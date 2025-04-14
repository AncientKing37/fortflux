
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

// Create a Supabase client with the service role key
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
    // Get auth token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, message: 'Not authorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extract user ID from JWT
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      console.error('Error fetching user:', userError);
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid user token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const { listing_id, seller_id, amount } = await req.json();

    // Validate required fields
    if (!listing_id || !seller_id || !amount) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Prevent users from buying their own listings
    if (user.id === seller_id) {
      return new Response(
        JSON.stringify({ success: false, message: 'You cannot buy your own listing' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Creating transaction with:', {
      account_id: listing_id,
      seller_id: seller_id,
      buyer_id: user.id,
      amount: amount,
      status: 'pending',
      platform_fee: amount * 0.05
    });

    // Create transaction using the service role client
    // This bypasses RLS policies since it uses the admin key
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        account_id: listing_id,
        seller_id: seller_id,
        buyer_id: user.id,
        amount: amount,
        status: 'pending',
        platform_fee: amount * 0.05 // 5% platform fee
      })
      .select()
      .single();

    if (transactionError) {
      console.error('Error creating transaction:', transactionError);
      return new Response(
        JSON.stringify({ success: false, message: transactionError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Transaction created successfully:', transaction);

    // Update listing status to 'pending'
    const { error: updateError } = await supabase
      .from('fortnite_accounts')
      .update({ status: 'pending' })
      .eq('id', listing_id);
      
    if (updateError) {
      console.error('Error updating listing status:', updateError);
      // Continue anyway, don't fail the transaction
    }

    return new Response(
      JSON.stringify({ success: true, transaction }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
