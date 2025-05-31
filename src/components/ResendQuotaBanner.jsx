import React from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { useResendQuota } from '../hooks/useResendQuota';

export default function ResendQuotaBanner() {
  const { sent, limit, percent, loading, error: quotaError } = useResendQuota(); // Renamed error to quotaError to avoid conflict
  const user = useUser();

  if (loading) return null;

  // Display error banner only for admin user
  if (quotaError) {
    if (user && user.email === 'boltsaas01@gmail.com') {
      return (
        <div style={{background:'#d90429',color:'#fff',padding:'0.5rem 1rem',borderRadius:6,margin:'1rem 0',textAlign:'center'}}>
          Erreur monitoring quota Resend (Admin): {typeof quotaError === 'object' ? JSON.stringify(quotaError) : quotaError}
        </div>
      );
    }
    return null; // Do not show error banner for non-admin users or if user is not loaded
  }

  // Logic for warning banners (visible to all users if no error)
  // You might want to make these admin-only as well in the future
  if (percent < 70) return null;
  return (
    <div style={{background: percent < 90 ? '#f9c74f' : '#d90429',color:'#222',padding:'0.5rem 1rem',borderRadius:6,margin:'1rem 0',textAlign:'center',fontWeight:'bold'}}>
      Attention : {sent} emails envoyés ce mois-ci sur {limit} ({percent}%)
      {percent >= 90 && <span style={{color:'#fff',marginLeft:8}}>Limite presque atteinte !</span>}
    </div>
  );
}
