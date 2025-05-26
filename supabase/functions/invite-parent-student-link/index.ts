// Supabase Edge Function: invite-parent-student-link
import { corsHeaders } from '../_shared/cors.ts';
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from 'https://esm.sh/resend@2.0.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
const supabase = createClient(
  Deno.env.get('SUPABASE_URL'),
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
);

function randomToken(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let body;
  try {
    body = await req.json();
    console.log('Received body:', body);
  } catch (e) {
    console.log('Error parsing JSON body:', e);
    return new Response(JSON.stringify({ error: 'Invalid or missing JSON body' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // If confirming link (parent clicks email)
  if (body.token && body.parent_id) {
    // Confirm the link
    const { error: updateError } = await supabase
      .from('parent_student_links')
      .update({ status: 'accepted', parent_id: body.parent_id })
      .eq('token', body.token)
      .eq('status', 'pending');
    if (updateError) {
      console.log('Update error:', updateError);
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Otherwise, create invitation
  const { parent_email, student_id, student_name } = body;
  if (!parent_email || !student_id || !student_name) {
    console.log('Missing params:', { parent_email, student_id, student_name });
    return new Response(JSON.stringify({ error: 'Missing params' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  const token = randomToken();
  const insertPayload = {
    student_id,
    parent_email,
    token,
    status: 'pending',
  };
  console.log('Insert payload:', insertPayload);
  const { error: insertError } = await supabase.from('parent_student_links').insert(insertPayload);
  if (insertError) {
    console.log('Insert error:', insertError);
    return new Response(JSON.stringify({ error: insertError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  // Always use localhost for testing
  const confirmLink = `http://localhost:5000/parent-link/confirm?token=${token}`;
  const { error: emailError } = await resend.emails.send({
    from: 'noreply@aithenos.com',
    to: parent_email,
    subject: 'Xác nhận liên kết tài khoản phụ huynh',
    html: `<p>Bạn nhận được lời mời liên kết tài khoản phụ huynh với học sinh <b>${student_name}</b>.</p><p>Nhấn vào link sau để xác nhận:</p><a href="${confirmLink}">${confirmLink}</a>`
  });
  if (emailError) {
    console.log('Email error:', emailError);
    return new Response(JSON.stringify({ error: emailError.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}); 