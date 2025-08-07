-- Tier type definition
CREATE TYPE subscription_tier AS ENUM ('trial', 'starter', 'professional', 'enterprise');

-- User subscriptions table to track tiers and usage
CREATE TABLE public.user_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  tier subscription_tier DEFAULT 'trial',
  usage JSONB DEFAULT '{}'::jsonb,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Function to automatically create a subscription entry for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, tier)
  VALUES (new.id, 'trial');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function when a new user signs up
-- Drop the trigger first if it exists to make the script rerunnable
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Index for fast user lookup
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions(user_id);
