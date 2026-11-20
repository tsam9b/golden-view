import logo from "../assets/logo.png";
import type { UiKey } from "../i18n/ui";

interface FeatureConfig {
  title: UiKey;
  description: UiKey;
  image: string;
  imageAlt?: UiKey;
  backgroundImage: string;
  size: [number, number];
  gap: string;
  padding: string;
  imagePosition?: "left" | "right";
  eyebrow?: UiKey;
  linkText?: UiKey;
  linkHref?: string;
  classes: string[];
}

const features: FeatureConfig[] = [
  {
    title: "feature.1.title",
    description: "feature.1.description",
    image: "pool2-1000x570.jpg",
    backgroundImage: "square2.jpg",
    size: [1, 2],
    gap: "3.5rem",
    padding: "1.5rem 2.5rem",
    classes: [],
  },
  {
    title: "feature.2.title",
    description: "feature.2.description",
    image: "cortile-bar-1000x570.jpg",
    backgroundImage: "square4.jpg",
    size: [2, 1],
    gap: "3.5rem",
    padding: "1.5rem 2rem",
    imagePosition: "left",
    classes: [],
  },
  {
    title: "feature.3.title",
    description: "feature.3.description",
    image: "kids-activities-v17758138-1000x570.jpg",
    backgroundImage: "square2.jpg",
    size: [1, 2],
    gap: "3.5rem",
    padding: "1.5rem 2rem",
    classes: [],
  },
  {
    title: "feature.4.title",
    description: "feature.4.description",
    image: "6-1000x570.jpg",
    backgroundImage: "square4.jpg",
    size: [2, 1],
    gap: "3.5rem",
    padding: "1.5rem 2rem",
    imagePosition: "left",
    classes: [],
  },
  {
    title: "feature.5.title",
    description: "feature.5.description",
    image: "hallways-v17758209-1000x570.jpg",
    backgroundImage: "square2.jpg",
    size: [1, 2],
    gap: "3.5rem",
    padding: "1.5rem 2rem",
    classes: [],
  },
  {
    title: "feature.6.title",
    description: "feature.6.description",
    image: "standard-twin-studio-v17757977-1000x570.jpg",
    backgroundImage: "square4.jpg",
    size: [2, 1],
    gap: "3.5rem",
    padding: "1.5rem 2rem",
    imagePosition: "left",
    classes: [],
  },

];

// Single place for branding and contact details.
export const site = {
  name: "Golden View Studios",
  // tagline: "Monday – Sunday | 10:30 am – 11:00 pm",
  address1: "Vlycha Beach, Lindos",
  address2: "Rhodes Island, Greece",
  phone: "+30 693 236 8133",
  email: "info@golden-view.gr",
  eot: "1143K122K0513701",
  copyright: "Copyright © 2026 Golden View Studios",
  mapCoords: "36.10319051363955, 28.06430658880448",
  social: {
    facebook: "https://www.facebook.com/profile.php?id=100046915976025#",
    maps: "https://www.google.com/maps/place/Golden+View+Studios/@36.1025552,28.0654914,581m/data=!3m1!1e3!4m9!3m8!1s0x14950c2b3a695c93:0x59ee3f9d197f00cb!5m2!4m1!1i2!8m2!3d36.103069!4d28.064274!16s%2Fg%2F1wjspnpz?entry=ttu&g_ep=EgoyMDI2MTExNy4wIKXMDSoASAFQAw%3D%3D",
  },
  // Swap these to change the logo or favicon everywhere.
  logo,
  favicon: { svg: "/favicon.svg", ico: "/favicon.ico" },
  slideshow:[
    "1063922_220647318083448_1497662454_o-1900x1124.jpg",
    "DSC_9455-1900x1124.jpg",
    "pool-1900x1124.jpg",
    "DSC_9430-1900x1124.jpg",
    "DSC_9443-1900x1124.jpg",
    "18498787-1900x1124.jpg",
    "DSC_0599-1900x1124.jpg",
    "AND_7761-1900x1124.jpg",
    "DSC_9456-1900x1124.jpg",
    "8a0682ffcd5742c4928095c33417b912-1900x1124.jpg",
    "703f1cf7829645a78dd525b555c2fb62-1900x1124.jpg"
  ],
  features,
} as const;

export const phoneHref = `tel:${site.phone.replace(/\s/g, "")}`;
export const emailHref = `mailto:${site.email}`;
