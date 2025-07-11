/*
  # Add network and messaging tables

  1. New Tables
    - `connections` - User connections/network
    - `messages` - Private messages between users
    - `user_settings` - User preferences and settings

  2. Security
    - Enable RLS
    - Add policies for data access
*/

-- Create connections table
CREATE TABLE connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  connected_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, connected_user_id)
);

-- Create messages table
CREATE TABLE messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create user settings table
CREATE TABLE user_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  security jsonb NOT NULL DEFAULT '{
    "enable_mfa": false,
    "enable_login_notifications": true,
    "enable_suspicious_activity_alerts": true
  }',
  notifications jsonb NOT NULL DEFAULT '{
    "email_notifications": true,
    "push_notifications": true,
    "job_alerts": true,
    "message_notifications": true,
    "application_updates": true
  }',
  privacy jsonb NOT NULL DEFAULT '{
    "profile_visibility": "public",
    "show_online_status": true,
    "allow_messages": true,
    "allow_connection_requests": true
  }',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for connections
CREATE POLICY "Users can manage their own connections"
  ON connections
  FOR ALL
  TO authenticated
  USING (
    auth.uid() = user_id OR
    auth.uid() = connected_user_id
  )
  WITH CHECK (
    auth.uid() = user_id OR
    auth.uid() = connected_user_id
  );

-- Create policies for messages
CREATE POLICY "Users can read their own messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = sender_id OR
    auth.uid() = receiver_id
  );

CREATE POLICY "Users can send messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

-- Create policies for user settings
CREATE POLICY "Users can manage their own settings"
  ON user_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to update updated_at
CREATE TRIGGER update_user_settings_updated_at
  BEFORE UPDATE ON user_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new connections
CREATE OR REPLACE FUNCTION handle_new_connection()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Create notification for connection request
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    content
  )
  SELECT
    NEW.connected_user_id,
    'connection_request',
    'Nouvelle demande de connexion',
    format(
      '%s souhaite se connecter avec vous',
      (SELECT full_name FROM public.profiles WHERE id = NEW.user_id)
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new connections
CREATE TRIGGER handle_new_connection_trigger
  AFTER INSERT ON connections
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_connection();

-- Create function to handle new messages
CREATE OR REPLACE FUNCTION handle_new_message()
RETURNS trigger
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Create notification for new message
  INSERT INTO public.notifications (
    user_id,
    type,
    title,
    content
  )
  SELECT
    NEW.receiver_id,
    'new_message',
    'Nouveau message',
    format(
      'Nouveau message de %s',
      (SELECT full_name FROM public.profiles WHERE id = NEW.sender_id)
    );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for new messages
CREATE TRIGGER handle_new_message_trigger
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_message();