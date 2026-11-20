import type { ImageMetadata } from "astro";
import type { RoomItem } from "./rooms";

const galleryFolderBySlug: Record<RoomItem["slug"], string> = {
  "standard-studio": "image_1",
  "executive-studio-2-adults": "image_2",
  "executive-studio-3-adults": "image_3",
};

const fullImages = import.meta.glob<ImageMetadata>(
  "../assets/gallery/*/full/*",
  { eager: true, import: "default" },
);

const previewImages = import.meta.glob<ImageMetadata>(
  "../assets/gallery/*/preview/*",
  { eager: true, import: "default" },
);

const rootImages = import.meta.glob<ImageMetadata>(
  "../assets/gallery/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

const sortByPath = ([pathA]: [string, ImageMetadata], [pathB]: [string, ImageMetadata]) =>
  pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: "base" });

export function hasRoomGallery(slug: RoomItem["slug"]) {
  const folder = galleryFolderBySlug[slug];
  return Object.keys(fullImages).some((path) => path.startsWith(`../assets/gallery/${folder}/full/`));
}

export function getRootGalleryPhotos() {
  const photos = Object.entries(rootImages).sort(sortByPath).map(([, src]) => ({ src }));
  if (photos.length === 0) {
    throw new Error("Gallery images are missing from src/assets/gallery.");
  }
  return photos;
}

export function getFolderGalleryPhotos() {
  const full = Object.entries(fullImages).sort(sortByPath);
  if (full.length === 0) {
    throw new Error("Gallery folder images are missing from src/assets/gallery/*/full.");
  }

  return full.map(([path, src]) => {
    const previewPath = path.replace("/full/", "/preview/");
    return {
      src,
      preview: previewImages[previewPath] ?? src,
    };
  });
}

export function getRoomMainImage(slug: RoomItem["slug"]) {
  const folder = galleryFolderBySlug[slug];
  const prefix = `../assets/gallery/${folder}/full/main.jpg`;

  return fullImages[prefix];
}


export function getRoomsGallery(slug: RoomItem["slug"]) {
  const folder = galleryFolderBySlug[slug];
  const prefix = `../assets/gallery/${folder}/`;
  const full = Object.entries(fullImages)
    .filter(([path]) => path.startsWith(`${prefix}full/`))
    .sort(sortByPath);
  const mainImage = getRoomMainImage(slug);

  if (full.length === 0) {
    console.warn(`Gallery images are missing for room item "${slug}"; omitting its gallery.`);
  }

  const photos = full
    .filter(([path]) => !path.endsWith("/main.jpg"))
    .map(([path, src]) => {
      const filename = path.slice(path.lastIndexOf("/") + 1);
      return {
        src,
        preview: previewImages[`${prefix}preview/${filename}`] ?? src,
      };
    });

  if (mainImage) {
    photos.unshift({
      src: mainImage,
      preview: previewImages[`${prefix}preview/main.jpg`] ?? mainImage,
    });
  }

  return { mainImage, photos };
}
