import { copyFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const galleryDirectory = path.join(root, "src", "assets", "gallery");
const files = await readdir(galleryDirectory);
const sets = new Set(
  files
    .map((file) => file.match(/^(\d+)-1000x570\.(?:jpe?g|png|webp|avif)$/i))
    .filter(Boolean)
    .map((match) => match[1]),
);

if (sets.size === 0) {
  throw new Error("No preview images matching <number>-1000x570.* were found.");
}

for (const number of [...sets].sort((a, b) => Number(a) - Number(b))) {
  const preview = files.find((file) =>
    new RegExp(`^${number}-1000x570\\.(?:jpe?g|png|webp|avif)$`, "i").test(file),
  );
  const full = files.find((file) =>
    new RegExp(`^${number}-1900x1124\\.(?:jpe?g|png|webp|avif)$`, "i").test(file),
  );

  if (!preview || !full) {
    throw new Error(`Image set "${number}" needs both 1000x570 and 1900x1124 variants.`);
  }

  const imageDirectory = path.join(galleryDirectory, `image_${number}`);
  const previewDirectory = path.join(imageDirectory, "preview");
  const fullDirectory = path.join(imageDirectory, "full");

  await Promise.all([
    mkdir(previewDirectory, { recursive: true }),
    mkdir(fullDirectory, { recursive: true }),
  ]);

  const extension = path.extname(preview).toLowerCase();
  await Promise.all([
    copyFile(path.join(galleryDirectory, preview), path.join(previewDirectory, `main${extension}`)),
    copyFile(path.join(galleryDirectory, full), path.join(fullDirectory, `main${extension}`)),
  ]);

  console.log(`image_${number}: prepared preview and full images`);
}

console.log(`Prepared ${sets.size} gallery image sets.`);
