import { supabase } from './supabaseClient';

const DAILY_API_KEY = import.meta.env.VITE_DAILY_API_KEY;
const DAILY_DOMAIN = import.meta.env.VITE_DAILY_DOMAIN;

console.log('DAILY_API_KEY:', DAILY_API_KEY);
console.log('DAILY_DOMAIN:', DAILY_DOMAIN);

interface CreateRoomResponse {
  id: string;
  name: string;
  url: string;
  created_at: string;
}

export const createDailyRoom = async (bookingId: string): Promise<string> => {
  try {
    // First, check if a room already exists for this booking
    const { data: existingRoom } = await supabase
      .from('classroom_rooms')
      .select('room_url')
      .eq('booking_id', bookingId)
      .single();

    if (existingRoom?.room_url) {
      return existingRoom.room_url;
    }

    // Debug: Log headers before fetch
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DAILY_API_KEY}`,
    };
    console.log('Daily.co fetch headers:', headers);

    // If no room exists, create a new one
    const response = await fetch('https://api.daily.co/v1/rooms', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        name: `class-${bookingId}`,
        privacy: 'public',
        properties: {
          enable_chat: true,
          enable_screenshare: true,
          enable_recording: 'cloud',
          exp: Math.round(Date.now() / 1000) + 24 * 60 * 60, // 24 hours from now
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Daily.co room creation failed:', errorText);
      throw new Error('Failed to create Daily.co room');
    }

    const room: CreateRoomResponse = await response.json();

    // Store the room URL in the database
    const { error: supabaseError } = await supabase.from('classroom_rooms').insert({
      booking_id: bookingId,
      room_url: room.url,
      room_id: room.id,
      created_at: new Date().toISOString(),
    });
    if (supabaseError) {
      console.error('Supabase insert error:', supabaseError);
      throw supabaseError;
    }

    return room.url;
  } catch (error) {
    console.error('Error creating Daily.co room:', error);
    throw error;
  }
};

export const getDailyRoom = async (bookingId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('classroom_rooms')
      .select('room_url')
      .eq('booking_id', bookingId)
      .single();

    if (error) throw error;
    return data?.room_url || null;
  } catch (error) {
    console.error('Error getting Daily.co room:', error);
    return null;
  }
}; 