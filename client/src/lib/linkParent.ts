import { supabase } from './supabaseClient';

export async function requestParentLink(parentEmail: string, studentId: string, studentName: string) {
  const body = { parent_email: parentEmail, student_id: studentId, student_name: studentName };
  console.log('Sending parent link invite with body:', body);
  const { data, error } = await supabase.functions.invoke('invite-parent-student-link', {
    body
  });
  if (error) {
    console.error('Error from invite-parent-student-link:', error);
    throw error;
  }
  return data;
}

export async function confirmParentLink(token: string, parentId: string) {
  const { data, error } = await supabase.functions.invoke('invite-parent-student-link', {
    body: { token, parent_id: parentId }
  });
  if (error) throw error;
  return data;
} 
 