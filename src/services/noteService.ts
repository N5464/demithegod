import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tawbsjqosxdtqsskaddy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRhd2JzanFvc3hkdHFzc2thZGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5NzMwMjAsImV4cCI6MjA2NDU0OTAyMH0.ASP0YqSdpcLj_FmLyOyme1iLYm2Z8CbJyrNJVREiZ6U';
const supabase = createClient(supabaseUrl, supabaseKey);

const fixedUserId = 'demigod_owner';

export async function loadNotesFromSupabase(): Promise<Record<string, string[]>> {
  const { data, error } = await supabase
    .from('deminotes')
    .select('tag, content')
    .eq('user_id', fixedUserId);

  if (error) throw new Error(`Failed to load notes: ${error.message}`);

  const groupedNotes: Record<string, string[]> = {};
  data?.forEach(note => {
    if (!groupedNotes[note.tag]) {
      groupedNotes[note.tag] = [];
    }
    groupedNotes[note.tag].push(note.content);
  });

  return groupedNotes;
}

export async function saveNotesToSupabase(notes: Record<string, string[]>): Promise<void> {
  const { error: deleteError } = await supabase
    .from('deminotes')
    .delete()
    .eq('user_id', fixedUserId);

  if (deleteError) throw new Error(`Failed to clear existing notes: ${deleteError.message}`);

  const notesToInsert = Object.entries(notes).flatMap(([tag, contents]) =>
    contents.map(content => ({
      user_id: fixedUserId,
      tag,
      content
    }))
  );

  const { error: insertError } = await supabase
    .from('deminotes')
    .insert(notesToInsert);

  if (insertError) throw new Error(`Failed to save notes: ${insertError.message}`);
}

export async function deleteNoteGroup(tag: string): Promise<void> {
  const { error } = await supabase
    .from('deminotes')
    .delete()
    .eq('user_id', fixedUserId)
    .eq('tag', tag);

  if (error) throw new Error(`Failed to delete note group: ${error.message}`);
}