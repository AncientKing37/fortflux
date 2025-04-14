
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Webhook should only accept POST requests
    if (req.method !== 'POST') {
      console.error('Method not allowed:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const payload = await req.json();
    console.log('Received webhook:', JSON.stringify(payload));

    // Extract relevant information from the webhook payload
    const { 
      order_id,  // This is our transaction_id
      payment_id,
      payment_status,
      pay_amount,
      pay_currency,
      actually_paid,
      pay_address,
      purchase_id
    } = payload;

    if (!order_id || !payment_status) {
      console.error('Invalid webhook payload - missing required fields');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook payload' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Find the related payment record
    const { data: existingPayment, error: paymentError } = await supabase
      .from('crypto_payments')
      .select('*')
      .eq('transaction_id', order_id)
      .single();

    if (paymentError) {
      console.error('Error finding payment record:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Payment record not found', details: paymentError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update payment status
    const { error: updateError } = await supabase
      .from('crypto_payments')
      .update({ 
        payment_status,
        updated_at: new Date().toISOString(),
        fees: parseFloat(existingPayment.fees || '0')
      })
      .eq('transaction_id', order_id);

    if (updateError) {
      console.error('Error updating payment status:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update payment status', details: updateError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Payment status updated:', payment_status);

    // Handle payment status changes for the transaction
    if (payment_status === 'confirmed' || payment_status === 'finished') {
      // Update transaction status to in_escrow
      const { error: txError } = await supabase
        .from('transactions')
        .update({ 
          status: 'in_escrow',
          updated_at: new Date().toISOString() 
        })
        .eq('id', order_id);

      if (txError) {
        console.error('Error updating transaction status:', txError);
        return new Response(
          JSON.stringify({ error: 'Failed to update transaction status', details: txError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Transaction status updated to in_escrow');

      // Create notification for buyer and seller
      const { data: transaction } = await supabase
        .from('transactions')
        .select('buyer_id, seller_id, account_id')
        .eq('id', order_id)
        .single();

      if (transaction) {
        // Get account title
        const { data: account } = await supabase
          .from('fortnite_accounts')
          .select('title')
          .eq('id', transaction.account_id)
          .single();
          
        const accountTitle = account?.title || 'Unknown account';

        // Notify buyer
        await supabase
          .from('notifications')
          .insert({
            user_id: transaction.buyer_id,
            type: 'payment_confirmed',
            title: 'Payment Confirmed',
            content: `Your payment for "${accountTitle}" has been confirmed and is now in escrow.`,
            metadata: { transaction_id: order_id }
          });

        // Notify seller
        await supabase
          .from('notifications')
          .insert({
            user_id: transaction.seller_id,
            type: 'payment_received',
            title: 'Payment Received',
            content: `Payment for "${accountTitle}" has been received and is now in escrow.`,
            metadata: { transaction_id: order_id }
          });
          
        console.log('Notifications sent to buyer and seller');
      }
    } else if (payment_status === 'failed' || payment_status === 'expired') {
      // Update transaction status back to pending
      await supabase
        .from('transactions')
        .update({ 
          status: 'pending',
          updated_at: new Date().toISOString() 
        })
        .eq('id', order_id);
        
      console.log('Transaction status updated back to pending due to payment failure');
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
