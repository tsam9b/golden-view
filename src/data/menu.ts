export interface MenuItem {
  id: number;
  name: string;
  section: string;
  href: string;
  locations: string[];
  classes?: string[];
  target?: string;
}

export const menu: MenuItem[] = [
  {
    id: 1,
    name: "About us",
    section: "index",
    href: "/",
    locations: ["header", "footer"],
    classes: ['pt-1'],
  },
  {
    id: 2,
    name: "Rooms",
    section: "rooms",
    href: "/rooms",
    locations: ["header", "footer"],
    classes: ['pt-1'],
  },
  {
    id: 3,
    name: "Services",
    section: "services",
    href: "/services",
    locations: ["header", "footer"],
    classes: ['pt-1'],
  },
  {
    id: 4,
    name: "Policies",
    section: "policies",
    href: "/policies",
    locations: ["header", "footer"],
    classes: ['pt-1'],
  },
  {
    id: 5,
    name: "Photos",
    section: "photos",
    href: "/photos",
    locations: ["header", "footer"],
    classes: ['pt-1'],
  },
  {
    id: 6,
    name: "Contact",
    section: "contact",
    href: "/contact",
    locations: ["header", "footer"],
    classes: ['pt-1'],
  },
  {
    id: 7,
    name: "Book now",
    section: "book",
    href: "https://www.booking.com/hotel/gr/golden-view-studios.el.html",
    target: "_blank",
    locations: ["header"],
    classes: ['highlight'],
  },
];