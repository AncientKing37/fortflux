import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const NOWPAYMENTS_API_KEY = Deno.env.get('NOWPAYMENTS_API_KEY');
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
    // Validate API key is set
    if (!NOWPAYMENTS_API_KEY) {
      console.error('NOWPAYMENTS_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'NOWPayments API key is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the API key existence (not the key itself)
    console.log('NOWPAYMENTS_API_KEY configured:', !!NOWPAYMENTS_API_KEY);

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Create a NOWPayments invoice
    if (path === 'create-invoice' && req.method === 'POST') {
      const { transactionId, cryptoCurrency } = await req.json();
      
      if (!transactionId || !cryptoCurrency) {
        console.error('Missing required parameters:', { transactionId, cryptoCurrency });
        return new Response(
          JSON.stringify({ error: 'Missing required parameters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Get transaction details from Supabase
      const { data: transaction, error: txError } = await supabase
        .from('transactions')
        .select(`
          id, 
          amount, 
          seller_id, 
          buyer_id, 
          status,
          fortnite_accounts:account_id (title)
        `)
        .eq('id', transactionId)
        .maybeSingle();

      if (txError || !transaction) {
        console.error('Transaction not found:', txError);
        return new Response(
          JSON.stringify({ error: 'Transaction not found', details: txError }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Check if transaction is in a valid state for payment
      if (transaction.status !== 'pending') {
        console.error('Transaction is not in a valid state for payment:', transaction.status);
        return new Response(
          JSON.stringify({ error: 'Transaction is not in a valid state for payment' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const baseUrl = url.origin;
      const callbackUrl = `${baseUrl}/nowpayments-webhook`;
      const successUrl = `${baseUrl.replace('/functions/v1', '')}/marketplace/${transaction.account_id}?payment=success`;
      const cancelUrl = `${baseUrl.replace('/functions/v1', '')}/marketplace/${transaction.account_id}?payment=cancelled`;
      
      console.log('Creating invoice with params:', { 
        price_amount: transaction.amount,
        price_currency: 'USD',
        pay_currency: cryptoCurrency,
        order_id: transaction.id,
        callback_url: callbackUrl,
        success_url: successUrl,
        cancel_url: cancelUrl
      });

      // Test the API key by making a status request first
      try {
        console.log('Testing NOWPayments API status');
        const statusResponse = await fetch('https://api.nowpayments.io/v1/status', {
          method: 'GET',
          headers: {
            'x-api-key': NOWPAYMENTS_API_KEY,
          },
        });
        
        console.log('NOWPayments status response:', statusResponse.status);
        
        if (!statusResponse.ok) {
          const errorData = await statusResponse.json();
          console.error('NOWPayments API status check failed:', errorData);
          return new Response(
            JSON.stringify({ error: 'NOWPayments service is unavailable or API key is invalid', details: errorData }),
            { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const statusData = await statusResponse.json();
        console.log('NOWPayments status check successful:', statusData);
      } catch (error) {
        console.error('Error checking NOWPayments API status:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to connect to NOWPayments API', details: error.message }),
          { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create invoice via NOWPayments API
      try {
        console.log('Creating NOWPayments invoice');
        const response = await fetch('https://api.nowpayments.io/v1/invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': NOWPAYMENTS_API_KEY,
          },
          body: JSON.stringify({
            price_amount: transaction.amount,
            price_currency: 'USD',
            pay_currency: cryptoCurrency,
            order_id: transaction.id,
            order_description: `Payment for Fortnite Account: ${transaction.fortnite_accounts?.title || 'Unknown'}`,
            ipn_callback_url: callbackUrl,
            success_url: successUrl,
            cancel_url: cancelUrl,
          }),
        });

        console.log('NOWPayments invoice creation response status:', response.status);
        
        const responseText = await response.text();
        console.log('NOWPayments invoice creation raw response:', responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
        } catch (e) {
          console.error('Error parsing NOWPayments response:', e);
          return new Response(
            JSON.stringify({ error: 'Invalid response from NOWPayments API', rawResponse: responseText }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        if (!response.ok) {
          console.error('NOWPayments API error:', responseData);
          let errorMessage = 'Failed to create invoice';
          
          // Extract specific error message if available
          if (responseData.message) {
            errorMessage += `: ${responseData.message}`;
          }
          
          return new Response(
            JSON.stringify({ error: errorMessage, details: responseData }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        console.log('NOWPayments invoice created successfully:', responseData);

        // Store payment information in database
        const { data: paymentData, error: paymentError } = await supabase
          .from('crypto_payments')
          .insert({
            transaction_id: transaction.id,
            nowpayments_invoice_id: responseData.id,
            crypto_currency: cryptoCurrency,
            amount: transaction.amount,
            payment_status: 'waiting'
          })
          .select()
          .single();

        if (paymentError) {
          console.error('Database error:', paymentError);
          return new Response(
            JSON.stringify({ error: 'Failed to store payment information', details: paymentError }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Update transaction status
        await supabase
          .from('transactions')
          .update({ status: 'pending_payment' })
          .eq('id', transaction.id);

        return new Response(
          JSON.stringify({ 
            success: true, 
            invoice: responseData,
            payment: paymentData
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error creating invoice:', error);
        return new Response(
          JSON.stringify({ error: `Failed to create invoice: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get supported cryptocurrencies
    if (path === 'currencies' && req.method === 'GET') {
      console.log('Fetching supported cryptocurrencies');
      
      try {
        const response = await fetch('https://api.nowpayments.io/v1/currencies', {
          headers: {
            'x-api-key': NOWPAYMENTS_API_KEY,
          },
        });

        console.log('NOWPayments currencies response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Error fetching currencies:', errorData);
          return new Response(
            JSON.stringify({ error: 'Failed to fetch currencies', details: errorData }),
            { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const data = await response.json();
        console.log('Currencies fetched successfully. Count:', data.currencies?.length || 0);
        
        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        console.error('Error fetching currencies:', error);
        return new Response(
          JSON.stringify({ error: `Failed to fetch currencies: ${error.message}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    // Get payment status
    if (path === 'payment-status' && req.method === 'GET') {
      const url = new URL(req.url);
      const paymentId = url.searchParams.get('paymentId');
      
      if (!paymentId) {
        console.error('Missing payment ID');
        return new Response(
          JSON.stringify({ error: 'Missing payment ID' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { data: payment, error: paymentError } = await supabase
        .from('crypto_payments')
        .select('*')
        .eq('id', paymentId)
        .maybeSingle();

      if (paymentError || !payment) {
        console.error('Payment not found:', paymentError);
        return new Response(
          JSON.stringify({ error: 'Payment not found', details: paymentError }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true, payment }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Not Found' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
