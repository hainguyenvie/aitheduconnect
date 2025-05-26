import { supabase } from './supabaseClient';

export async function testSendEmail() {
  try {
    const { data, error } = await supabase.functions.invoke('send-invite-email', {
      body: {
        to: 'fmnkdgv@gmail.com',
        subject: 'Test Email from VietnameseStudyHub',
        html: '<h1>Hello from VietnameseStudyHub!</h1><p>This is a test email to verify our email sending functionality is working correctly.</p>'
      }
    });

    if (error) {
      console.error('Error sending email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Unexpected error:', err);
    return { success: false, error: err };
  }
} 