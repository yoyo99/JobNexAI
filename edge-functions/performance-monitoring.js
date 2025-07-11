export default async (request, context) => {
  // Récupérer les métriques de performance
  const url = new URL(request.url);
  const params = new URLSearchParams(url.search);
  const metrics = {
    url: params.get('url') || request.headers.get('referer') || '/',
    userAgent: request.headers.get('user-agent'),
    timestamp: new Date().toISOString(),
    // Métriques Web Vitals
    FCP: params.get('fcp'),
    LCP: params.get('lcp'),
    CLS: params.get('cls'),
    FID: params.get('fid'),
    TTFB: params.get('ttfb'),
    // Informations supplémentaires
    deviceType: getDeviceType(request.headers.get('user-agent')),
    country: context.geo?.country?.name || 'Unknown',
    region: context.geo?.subdivision?.name || 'Unknown',
    ip: context.ip,
  };

  // Envoyer les métriques à un service de monitoring (simulé ici)
  console.log('Performance metrics:', JSON.stringify(metrics, null, 2));

  // Dans une implémentation réelle, vous enverriez ces données à un service comme
  // Sentry, New Relic, Datadog, etc.

  // Retourner une réponse vide avec un statut 204 (No Content)
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-store',
    },
  });
};

// Fonction utilitaire pour déterminer le type d'appareil
function getDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (/mobile/i.test(userAgent)) {
    return 'mobile';
  } else if (/tablet/i.test(userAgent)) {
    return 'tablet';
  } else if (/ipad/i.test(userAgent)) {
    return 'tablet';
  } else {
    return 'desktop';
  }
}