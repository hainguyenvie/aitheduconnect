-- Create classroom_rooms table
create table if not exists classroom_rooms (
  id uuid default uuid_generate_v4() primary key,
  booking_id integer references bookings(id) on delete cascade,
  room_id text not null,
  room_url text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Add indexes
create index if not exists classroom_rooms_booking_id_idx on classroom_rooms(booking_id);
create index if not exists classroom_rooms_room_id_idx on classroom_rooms(room_id);

-- Add RLS policies
alter table classroom_rooms enable row level security;

-- Allow users to view rooms they have access to
create policy "Users can view their own classroom rooms"
  on classroom_rooms for select
  using (
    exists (
      select 1 from bookings
      where bookings.id = classroom_rooms.booking_id
      and (
        bookings.student_id = auth.uid()
        or bookings.teacher_id = auth.uid()
      )
    )
  );

-- Allow teachers to create rooms
create policy "Teachers can create classroom rooms"
  on classroom_rooms for insert
  with check (
    exists (
      select 1 from bookings
      where bookings.id = classroom_rooms.booking_id
      and bookings.teacher_id = auth.uid()
    )
  );

-- Allow teachers to update rooms
create policy "Teachers can update classroom rooms"
  on classroom_rooms for update
  using (
    exists (
      select 1 from bookings
      where bookings.id = classroom_rooms.booking_id
      and bookings.teacher_id = auth.uid()
    )
  ); 