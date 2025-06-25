import { create } from 'zustand';
import netlifyIdentity, { User as NetlifyUser } from 'netlify-identity-widget';

// --- Type Definitions ---
// This is a simplified Profile type to match what Supabase might have provided.
// We will map the NetlifyUser to this type for compatibility.
export interface Profile {
  id: string;
  email?: string;
  full_name?: string;
}

// Subscription will be null for now.
export type Subscription = null;

// --- State Interface (kept similar for compatibility) ---
interface AuthState {
  user: Profile | null;
  subscription: Subscription | null;
  loading: boolean;
  signIn: () => void; // Simplified: no email/password needed, opens widget
  signUp: () => void; // Simplified: opens widget
  signOut: () => void;
  loadUser: () => Promise<void>; 
}

// --- Helper function to map Netlify user to our Profile type ---
const mapNetlifyUserToProfile = (netlifyUser: NetlifyUser | null): Profile | null => {
  if (!netlifyUser) {
    return null;
  }
  return {
    id: netlifyUser.id,
    email: netlifyUser.email,
    full_name: netlifyUser.user_metadata?.full_name,
  };
};

// --- Zustand Store ---
export const useAuth = create<AuthState>((set) => {
  // These listeners will be set up once and will react to Netlify Identity events.
  netlifyIdentity.on('init', (user) => {
    console.log('[AuthStore] Netlify Identity initialized.');
    set({
      user: mapNetlifyUserToProfile(user),
      loading: false,
    });
  });

  netlifyIdentity.on('login', (user) => {
    console.log('[AuthStore] User logged in.');
    set({ user: mapNetlifyUserToProfile(user), loading: false });
    netlifyIdentity.close(); // Close widget after login
  });

  netlifyIdentity.on('logout', () => {
    console.log('[AuthStore] User logged out.');
    set({ user: null });
  });
  
  return {
    user: null,
    subscription: null, // Decoupled from DB for now
    loading: true, // Starts loading until init event fires

    // --- Actions ---
    signIn: () => {
      netlifyIdentity.open('login');
    },
    signUp: () => {
      netlifyIdentity.open('signup');
    },
    signOut: () => {
      netlifyIdentity.logout();
    },
    // This function is now mostly a no-op, as Netlify Identity handles this automatically.
    loadUser: async () => {
      console.log('[AuthStore] loadUser called, but it is handled by Netlify Identity init.');
    },
  };
});

// --- Initialize Netlify Identity ---
// This is crucial. It triggers the 'init' event.
console.log('[AuthStore] Initializing Netlify Identity...');
netlifyIdentity.init({
  APIUrl: 'https://jobnexai-windsurf.netlify.app/.netlify/identity'
});