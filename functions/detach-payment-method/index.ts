import Stripe from "npm:stripe@14.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { verify } from "https://deno.land/x/djwt@v2.9.1/mod.ts";
import { v4 as uuidv4 } from "https://deno.land/std@0.224.0/uuid/mod.ts";
import { getEnv } from "../../src/lib/env.ts";

// Initialize Supabase client
const supabaseUrl = getEnv("SUPABASE_URL") || "";
const supabaseServiceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY") || "";
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
const authenticate = async (req: Request): Promise<string> => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) throw new Error("Unauthorized");

  const token = authHeader.split(" ")[1];
  const payload = await verify(
    token,
    Deno.env.get("SUPABASE_JWT_SECRET")!,
    "HS256",
  );
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
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!);

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

// Main function to handle the request
Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Authenticate the request
    const userIdFromToken = await authenticate(req);

    // Validate the input data
    const body = await req.json();
    await validateInput(body);

    const { userId, paymentMethodId } = body;

    // Check if the user ID from the token matches the user ID from the body
    if (userId !== userIdFromToken) throw new Error("Unauthorized");

    // Detach the payment method
    const response = await detachPaymentMethod(userId, paymentMethodId);

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error detach payment method:", error);
    const response: DetachPaymentMethodResponse = {};

    // Handle different types of errors
    if (error.message === "Unauthorized") {
      response.error = "Unauthorized";
      response.code = "unauthorized";
      return new Response(JSON.stringify(response), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    } else if (
      error.message === "Failed to retrieve payment method from Stripe" || error.message === "Failed to retrieve subscription information from Supabase"
    ) {
      response.error = error.message;
      response.code = "error";
    } else {
      response.error = error.message;
      response.code = "error-detach-payment-method";
    }

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});