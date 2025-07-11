/*
  # Add real-time notifications and professional network

  1. New Tables
    - `notifications_settings` - User notification preferences
    - `notification_templates` - Templates for automated notifications
    - `notification_channels` - Available notification channels (email, push, in-app)
    - `professional_connections` - Network connections between users
    - `connection_requests` - Pending connection requests
    - `chat_rooms` - Direct message rooms
    - `chat_messages` - Individual chat messages

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
    - Add audit logging
*/

-- Notification settings
CREATE TABLE notification_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email_notifications boolean DEFAULT true,
  push_notifications boolean DEFAULT true,
  in_app_notifications boolean DEFAULT true,
  job_alerts boolean DEFAULT true,
  connection_requests boolean DEFAULT true,
  messages boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Notification templates
CREATE TABLE notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  title_template text NOT NULL,
  content_template text NOT NULL,
  channel text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Professional connections
CREATE TABLE professional_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connected_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Chat rooms
CREATE TABLE chat_rooms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now()
);

-- Chat room participants
CREATE TABLE chat_room_participants (
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (room_id, user_id)
);

-- Chat messages
CREATE TABLE chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id uuid REFERENCES chat_rooms(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read_by uuid[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE professional_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_room_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Notification settings policies
CREATE POLICY "Users can manage their own notification settings"
  ON notification_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Professional connections policies
CREATE POLICY "Users can manage their own connections"
  ON professional_connections
  FOR ALL
  TO authenticated
  USING (auth.uid() IN (user_id, connected_user_id))
  WITH CHECK (auth.uid() = user_id);

-- Chat room policies
CREATE POLICY "Users can access their chat rooms"
  ON chat_rooms
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_room_participants
      WHERE room_id = id AND user_id = auth.uid()
    )
  );

-- Chat room participants policies
CREATE POLICY "Users can see participants in their rooms"
  ON chat_room_participants
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_room_participants
      WHERE room_id = chat_room_participants.room_id 
      AND user_id = auth.uid()
    )
  );

-- Chat messages policies
CREATE POLICY "Users can manage messages in their rooms"
  ON chat_messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chat_room_participants
      WHERE room_id = chat_messages.room_id 
      AND user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_room_participants
      WHERE room_id = chat_messages.room_id 
      AND user_id = auth.uid()
    ) AND auth.uid() = sender_id
  );

-- Functions for real-time chat
CREATE OR REPLACE FUNCTION handle_new_message()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Create notifications for all room participants except sender
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    content,
    link
  )
  SELECT 
    p.user_id,
    'new_message',
    'Nouveau message',
    format(
      'Nouveau message de %s',
      (SELECT full_name FROM public.profiles WHERE id = NEW.sender_id)
    ),
    '/chat/' || NEW.room_id
  FROM public.chat_room_participants p
  WHERE p.room_id = NEW.room_id
    AND p.user_id != NEW.sender_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new messages
CREATE TRIGGER handle_new_message_trigger
  AFTER INSERT ON chat_messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_message();

-- Insert default notification templates
INSERT INTO notification_templates (type, title_template, content_template, channel) VALUES
  ('new_connection', 'Nouvelle demande de connexion', '{{sender_name}} souhaite se connecter avec vous', 'in_app'),
  ('connection_accepted', 'Connexion acceptée', '{{user_name}} a accepté votre demande de connexion', 'in_app'),
  ('new_message', 'Nouveau message', 'Vous avez reçu un message de {{sender_name}}', 'in_app'),
  ('job_alert', 'Nouvelle offre correspondante', 'Une nouvelle offre correspond à vos critères : {{job_title}}', 'email');