
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get auth token from request
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Parse request body
    const requestData = await req.json()
    const { transactionId } = requestData

    if (!transactionId) {
      return new Response(JSON.stringify({ error: 'Transaction ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create a Supabase client with the auth header
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    })

    // Query to get available escrow agents
    const { data: escrowAgents, error: escrowError } = await supabase
      .from('profiles')
      .select('id, username')
      .eq('role', 'escrow')
      .order('vouch_count', { ascending: false })
      .limit(1)

    if (escrowError || !escrowAgents || escrowAgents.length === 0) {
      console.error('Error getting escrow agents:', escrowError)
      return new Response(JSON.stringify({ error: 'No escrow agents available' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Assign the escrow agent to the transaction
    const escrowId = escrowAgents[0].id
    const { data: transaction, error: updateError } = await supabase
      .from('transactions')
      .update({
        escrow_id: escrowId,
        status: 'in_escrow',
        updated_at: new Date().toISOString()
      })
      .eq('id', transactionId)
      .select('seller_id')
      .single()

    if (updateError) {
      console.error('Error assigning escrow:', updateError)
      return new Response(JSON.stringify({ error: 'Error assigning escrow agent' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({
      success: true,
      escrow_id: escrowId,
      seller_id: transaction.seller_id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Request escrow error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
