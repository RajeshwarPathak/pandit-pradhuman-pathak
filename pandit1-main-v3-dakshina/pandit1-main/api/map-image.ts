export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey =
    process.env.map_via_Geoapify_API ||
    process.env.GEOAPIFY_API_KEY ||
    process.env.VITE_GEOAPIFY_API_KEY;

  if (!apiKey) {
    return res.status(503).json({ error: 'Map service is not configured.' });
  }

  const mapUrl =
    'https://maps.geoapify.com/v1/staticmap' +
    '?style=osm-bright' +
    '&width=900&height=420' +
    '&center=lonlat:84.7274,25.7844' +
    '&zoom=14.5' +
    '&marker=lonlat:84.7274,25.7844;color:%23ff7a1a;size:large' +
    `&apiKey=${encodeURIComponent(apiKey)}`;

  try {
    const upstream = await fetch(mapUrl);
    if (!upstream.ok) {
      return res.status(502).json({ error: 'Failed to load map image.' });
    }
    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'image/png');
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).send(buffer);
  } catch (error) {
    console.error('Geoapify Map Proxy Error:', error);
    return res.status(500).json({ error: 'Unable to fetch map right now.' });
  }
}
