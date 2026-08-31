require("dotenv").config({ path: ".env.local" });
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI missing");
  process.exit(1);
}
const schema = new mongoose.Schema(
  { key: { type: String, unique: true }, data: Object },
  { timestamps: true },
);
const Site = mongoose.models.Site || mongoose.model("Site", schema);
(async () => {
  await mongoose.connect(uri);
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "data/site-data.json"), "utf8"),
  );
  await Site.findOneAndUpdate(
    { key: "main" },
    { key: "main", data },
    { upsert: true, new: true },
  );
  console.log("Seeded site-data.json into MongoDB");
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
