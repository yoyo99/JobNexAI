import React from 'react';
import { useResendQuota } from '../hooks/useResendQuota';

export default function ResendQuotaBanner() {
  const { sent, limit, percent, loading, error } = useResendQuota();

  if (loading) return null;
  if (error) return (
    <div style={{background:'#d90429',color:'#fff',padding:'0.5rem 1rem',borderRadius:6,margin:'1rem 0',textAlign:'center'}}>
      Erreur monitoring quota Resend: {error}
    </div>
  );
  if (percent < 70) return null;
  return (
    <div style={{background: percent < 90 ? '#f9c74f' : '#d90429',color:'#222',padding:'0.5rem 1rem',borderRadius:6,margin:'1rem 0',textAlign:'center',fontWeight:'bold'}}>
      Attention : {sent} emails envoyés ce mois-ci sur {limit} ({percent}%)
      {percent >= 90 && <span style={{color:'#fff',marginLeft:8}}>Limite presque atteinte !</span>}
    </div>
  );
}
