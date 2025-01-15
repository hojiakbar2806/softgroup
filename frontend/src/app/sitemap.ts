// import type { MetadataRoute } from "next";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const response = await fetch("https://api.softgroup.uz/templates");
//   const templates = await response.json();

//   console.log(templates);

//   return templates?.data.map((template: { slug: string; updated_at: string }) => ({
//     url: `https://templora.uz/templates/${template.slug}`,
//     lastModified: new Date(),
//     changeFrequency: "weekly",
//     priority: 0.8,
//   }));
// }
