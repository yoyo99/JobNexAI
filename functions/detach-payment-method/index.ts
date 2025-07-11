import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { verify } from 'jsonwebtoken';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Define CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Define the response interface
interface DetachPaymentMethodResponse {
  success?: boolean;
  error?: string;
  code?: string;
}

// Function to authenticate the request
const authenticate = async (authHeader: string): Promise<string> => {
  if (!authHeader) throw new Error("Unauthorized");

  const token = authHeader.split(' ')[1];
  const payload = verify(token, process.env.SUPABASE_JWT_SECRET!);
  const userIdFromToken = payload.sub;

  if (!userIdFromToken) throw new Error("Unauthorized");
  return userIdFromToken;
};

// Function to validate the input data
const validateInput = async (data: any): Promise<boolean> => {
  if (!data) throw new Error("Body is required");
  if (!data.userId || typeof data.userId !== "string") {
    throw new Error("Invalid userId");
  }
  if (!data.paymentMethodId || typeof data.paymentMethodId !== "string") {
    throw new Error("Invalid paymentMethodId");
  }
  return true;
};

// Function to detach the payment method
const detachPaymentMethod = async (
  userId: string,
  paymentMethodId: string,
): Promise<DetachPaymentMethodResponse> => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2023-10-16' });

  // Check if the user is authorized to delete this payment method
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (subscriptionError) {
    console.error("Supabase error:", subscriptionError);
    throw new Error("Failed to retrieve subscription information from Supabase");
  }

  if (!subscription || !subscription.stripe_customer_id) {
    throw new Error("No Stripe customer associated with this user");
  }

  // Check if the payment method belongs to this customer
  try {
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    if (paymentMethod.customer !== subscription.stripe_customer_id) {
      throw new Error("This payment method does not belong to this user");
    }
  } catch (stripeError) {
    console.error("Stripe error:", stripeError);
    throw new Error("Failed to retrieve payment method from Stripe");
  }

  // Detach the payment method
  await stripe.paymentMethods.detach(paymentMethodId);
  return { success: true };
};

// Netlify handler
export async function handler(event: any) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: 'ok',
    };
  }

  try {
    const authHeader = event.headers.authorization || event.headers.Authorization;
    if (!authHeader) {
      throw new Error('Unauthorized');
    }

    const userIdFromToken = (verify(authHeader.split(' ')[1], process.env.SUPABASE_JWT_SECRET!) as any).sub;

    const { userId, paymentMethodId } = JSON.parse(event.body || '{}');

    // Validate input
    if (!userId || !paymentMethodId) {
      throw new Error('Missing userId or paymentMethodId');
    }
    if (userId !== userIdFromToken) {
      throw new Error('Unauthorized');
    }

    const response = await detachPaymentMethod(userId, paymentMethodId);

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error('Error detach payment method:', error);
    return {
      statusCode: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: (error as Error).message }),
    };
  }
}