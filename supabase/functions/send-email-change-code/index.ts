import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

console.log('Hello from send-email-change-code!')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

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
    const { currentEmail, newEmail } = await req.json()

    // Verify current email matches the user's email
    if (user.email !== currentEmail) {
      throw new Error('Current email does not match')
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    // Store the code in the database with expiration
    const { error: storeError } = await supabaseClient
      .from('email_change_codes')
      .upsert({
        user_id: user.id,
        code,
        current_email: currentEmail,
        new_email: newEmail,
        expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes expiration
      })

    if (storeError) throw storeError

    // Send the email with the code
    const { error: emailError } = await supabaseClient.auth.admin.sendRawEmail({
      to: currentEmail,
      subject: 'Email Change Verification Code',
      body: `Your verification code for changing email is: ${code}\n\nThis code will expire in 15 minutes.`,
    })

    if (emailError) throw emailError

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