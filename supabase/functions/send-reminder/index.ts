
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionId, buyerId, sellerId } = await req.json();

    // Initialize Supabase client with service role key
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Get auth user from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error("Invalid user token");
    }

    // Verify user is an escrow
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || userProfile.role !== 'escrow') {
      throw new Error("Only escrow users can send reminders");
    }

    // Get transaction details
    const { data: transaction, error: transactionError } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("id", transactionId)
      .single();

    if (transactionError) {
      throw new Error(`Transaction error: ${transactionError.message}`);
    }

    // Verify the escrow is assigned to this transaction
    if (transaction.escrow_id !== user.id) {
      throw new Error("You are not the escrow for this transaction");
    }

    // Get parties' emails
    const { data: parties, error: partiesError } = await supabaseAdmin
      .from("profiles")
      .select("id, username, email")
      .in("id", [buyerId, sellerId]);

    if (partiesError || !parties.length) {
      throw new Error("Could not find transaction parties");
    }

    // Send emails (would connect to your email provider here)
    const buyer = parties.find(p => p.id === buyerId);
    const seller = parties.find(p => p.id === sellerId);

    console.log(`Sending reminder for transaction: ${transactionId}`);
    console.log(`To Buyer: ${buyer?.username} (${buyer?.email})`);
    console.log(`To Seller: ${seller?.username} (${seller?.email})`);

    // Send a notification in the chat
    const { data: message, error: messageError } = await supabaseAdmin
      .from("messages")
      .insert({
        sender_id: user.id,
        transaction_id: transactionId,
        content: "⚠️ REMINDER: Please check this chat for updates on your transaction.",
        // We're sending to both parties by not specifying receiver_id
      })
      .select()
      .single();

    if (messageError) {
      console.error("Error creating reminder message:", messageError);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Reminders sent successfully"
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in send-reminder function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400
      }
    );
  }
});
