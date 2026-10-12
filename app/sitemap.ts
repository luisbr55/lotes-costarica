import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const supabase = await createClient();

  const { data: lotes } = await supabase
    .from("lotes_publico")
    .select("id, updated_at")
    .neq("estado", "vendido");

  return [
    { url: base, changeFrequency: "daily", priority: 1 },
    ...(lotes ?? []).map((lote) => ({
      url: `${base}/lotes/${lote.id}`,
      lastModified: new Date(lote.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}