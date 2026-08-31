import { connectDB } from "./db";
import Site from "@/models/Site";
import seedData from "@/data/site-data.json";

export function readSeedData() {
  return seedData;
}

export async function getSiteData() {
  try {
    await connectDB();

    const doc = await Site.findOne({ key: "main" }).lean();

    if (doc?.data) {
      return doc.data;
    }
  } catch (e) {
    console.warn("MongoDB unavailable, using seed data");
  }

  return readSeedData();
}

export async function saveSiteData(data) {
  await connectDB();

  return Site.findOneAndUpdate(
    { key: "main" },
    { key: "main", data },
    { upsert: true, new: true },
  );
}

export function allItems(data) {
  const out = [];

  for (const s of data.sections || []) {
    for (const g of s.groups || []) {
      for (const sg of g.subgroups || []) {
        for (const item of sg.items || []) {
          out.push({
            ...item,
            sectionSlug: s.slug,
            sectionLabel: s.label,
            group: g.name,
            subgroup: sg.name,
          });
        }
      }
    }
  }

  return out;
}

export function findItem(data, slug) {
  return allItems(data).find((x) => x.slug === slug);
}
