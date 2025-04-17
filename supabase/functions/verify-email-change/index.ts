import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from verify-email-change!')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError) throw userError

    // Get the request body
    const { currentEmail, newEmail, code } = await req.json()

    // Verify current email matches the user's email
    if (user.email !== currentEmail) {
      throw new Error('Current email does not match')
    }

    // Get the stored code
    const { data: codeData, error: codeError } = await supabaseClient
      .from('email_change_codes')
      .select('*')
      .eq('user_id', user.id)
      .eq('code', code)
      .eq('current_email', currentEmail)
      .eq('new_email', newEmail)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (codeError || !codeData) {
      throw new Error('Invalid or expired code')
    }

    // Update the user's email
    const { error: updateError } = await supabaseClient.auth.admin.updateUserById(
      user.id,
      { email: newEmail }
    )

    if (updateError) throw updateError

    // Delete the used code
    await supabaseClient
      .from('email_change_codes')
      .delete()
      .eq('user_id', user.id)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
}) 