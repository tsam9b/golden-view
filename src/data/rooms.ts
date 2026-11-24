// src/data/room.ts

import type { ImageMetadata } from "astro";
import placeholder from "../assets/logo.png";

const images = import.meta.glob<ImageMetadata>(
  "../assets/room/*/main.{jpg,jpeg,png,webp,avif}",
  { eager: true, import: "default" },
);

function roomImage(slug: string): ImageMetadata {
  const image = Object.entries(images).find(([path]) =>
    path.startsWith(`../assets/room/${slug}/main.`)
  )?.[1];
  if (!image) {
    console.warn(`Room image for "${slug}" not found; using the logo as a placeholder.`);
  }
  return image ?? placeholder;
}

export interface RoomItem {
  id: number;
  slug: string;
  dayTrips?: number;
  charter?: { guests: number; cabins: number | null };
  eyebrow: string;
  title: string;
  description: string;
  image: ImageMetadata;
  classes: string[];
  fullDescription: string;
  facilities: string[];
  gallery: string;
  guests: number;
  size: string;
  rate: string;
}

export const rooms: RoomItem[] = [
  {
    id: 1,
    slug: "standard-studio",
    classes: [],
    charter: { guests: 2, cabins: null },
    title: "Standard Studio",
    eyebrow: "Standard Studio",
    description: "Guests: 2",
    facilities: [
        "Air-conditioning",
        "Wi-Fi",
        "Satellite TV",
        "Private Bathroom with Shower",
        "Bathroom Amenities & Towels",
        "Hairdryer",
        "Refrigerator",
        "Balcony or Terrace",
    ],
    image: roomImage("standard-studio"),
    fullDescription: `Our Standard Studio offers 1 large double bed, which can accommodate 2 persons.

All rooms are equipped with private bathroom, balcony or terrace and a kitchenette with 2 electric cooking rings and a fridge. Air-Conditioning, Wi-Fi, Safety Deposit Box and a Satellite TV are also available.`,
    gallery: "standard-studio",
    guests: 2,
    rate: "500",
    size: "20 m²",
  },
  {
    id: 2,
    slug: "executive-studio-2-adults",
    classes: [],
    charter: { guests: 2, cabins: null },
    title: "Executive Studio (2 adults)",
    eyebrow: "Executive Studio (2 adults)",
    description: "Guests: 2",
    image: roomImage("executive-studio-2-adults"),
    fullDescription: `Our Executive Studio offers 1 double bed or 2 single beds, which can accommodate 2 persons.

All rooms are equipped with private bathroom, balcony or terrace and a kitchenette with 2 electric cooking rings and a fridge. Air-Conditioning, Wi-Fi, Safety Deposit Box and a Satellite TV are also available.`,
    facilities: [
        "Snacks & Drinks included",
        "Air-conditioning",
        "Wi-fi Internet & TV",
        "Private Bathroom with Shower",
        "Bathroom Amenities",
        "Two Toilets",
        "Refrigerator & Kettle"
    ],
    gallery: "executive-studio-2-adults",
    guests: 2,
    size: "13 m²",
    rate:"500"
  },
  {
    id: 3,
    slug: "executive-studio-3-adults",
    classes: [],
    charter: { guests: 23, cabins: null },
    eyebrow: "Executive Studio (3 adults)",
    title: "Executive Studio (3 adults)",
    description: "Guests: 3",
    image: roomImage("executive-studio-3-adults"),
    fullDescription: `Ferretti 55 can easily accommodate 6 guests and comes with an outdoor dining area for al fresco meals. A flat-screen TV is available in the spacious living room fitted with a leather circular sofa. Other facilities include air conditioning, bathrobes, slippers and free toiletries.
    For day trips we can accommodate up to 6 persons.

    For charters: 6 persons, that can comfortably sleep in 3 cabins.`,
    facilities: [
        "Snacks & Drinks included",
        "Air-conditioning",
        "Wi-fi Internet & TV",
        "Private Bathroom with Shower",
        "Bathroom Amenities",
        "Two Toilets",
        "Refrigerator & Kettle"
    ],
    gallery: "executive-studio-3-adults",
    guests: 3,
    size: "40 m²",
    rate:"500"
  },

];