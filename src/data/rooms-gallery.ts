import type { ImageMetadata } from "astro";
import type { RoomItem } from "./rooms";

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

const roomImages = import.meta.glob<ImageMetadata>(
  "../assets/room/*/*.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

const sortByPath = ([pathA]: [string, ImageMetadata], [pathB]: [string, ImageMetadata]) =>
  pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: "base" });

export function hasRoomGallery(slug: RoomItem["slug"]) {
  const prefix = `../assets/room/${slug}/`;
  return Object.keys(roomImages).some((path) =>
    path.startsWith(prefix) && !path.includes("/background.")
  );
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
  const rooms = Object.entries(roomImages)
    .filter(([path]) => !path.includes("/background."))
    .sort(sortByPath);

  if (full.length === 0 && rooms.length === 0) {
    throw new Error("Gallery images are missing from src/assets/gallery and src/assets/room.");
  }

  const galleryPhotos = full.map(([path, src]) => {
    const previewPath = path.replace("/full/", "/preview/");
    return {
      src,
      preview: previewImages[previewPath] ?? src,
    };
  });

  const roomPhotos = rooms.map(([, src]) => ({
    src,
    preview: src,
  }));

  return [...galleryPhotos, ...roomPhotos];
}

export function getRoomMainImage(slug: RoomItem["slug"]) {
  const prefix = `../assets/room/${slug}/main.`;
  return Object.entries(roomImages).find(([path]) => path.startsWith(prefix))?.[1];
}

export function getRoomBackgroundImage(slug: RoomItem["slug"]) {
  const prefix = `../assets/room/${slug}/background.`;
  return Object.entries(roomImages).find(([path]) => path.startsWith(prefix))?.[1];
}

export function getRoomsGallery(slug: RoomItem["slug"]) {
  const prefix = `../assets/room/${slug}/`;
  const images = Object.entries(roomImages)
    .filter(([path]) =>
      path.startsWith(prefix) && !path.includes("/background.")
    )
    .sort(sortByPath);
  const mainImage = getRoomMainImage(slug);
  const backgroundImage = getRoomBackgroundImage(slug);

  if (images.length === 0) {
    console.warn(`Gallery images are missing for room item "${slug}"; omitting its gallery.`);
  }

  const photos = images
    .filter(([path]) => !path.includes("/main."))
    .map(([, src]) => ({ src, preview: src }));

  if (mainImage) {
    photos.unshift({ src: mainImage, preview: mainImage });
  }

  return { mainImage, backgroundImage, photos };
}
