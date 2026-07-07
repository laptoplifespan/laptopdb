import { supabase } from '@/lib/supabase'

export default async function sitemap() {
  const baseUrl = 'https://www.laptoplifespan.com'

  const { data: laptops } = await supabase
    .from('laptops')
    .select('slug')

  const { data: systems } = await supabase
    .from('operating_systems')
    .select('slug')

  const laptopUrls = laptops?.map((laptop) => ({
    url: `${baseUrl}/laptops/${laptop.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.8,
  })) || []

  // One URL per distinct brand (e.g. /laptops/brand/dell).
  const { data: brandRows } = await supabase
    .from('laptops')
    .select('brand')

  const brandUrls = [...new Set((brandRows ?? []).map((r) => r.brand).filter(Boolean))].map((brand) => ({
    url: `${baseUrl}/laptops/brand/${brand.toLowerCase()}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const osUrls = systems?.map((os) => ({
    url: `${baseUrl}/os/${os.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.7,
  })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/laptops`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/os`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    ...brandUrls,
    ...laptopUrls,
    ...osUrls,
  ]
}