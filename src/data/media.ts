import logo from "@/assets/uchu-logo.svg";
import rooftopVolcano from "@/assets/rooftop-volcano.webp";
import rooftopGroup from "@/assets/rooftop-group.webp";
import cutting from "@/assets/cutting.webp";
import flambe from "@/assets/flambe.webp";
import toastSelfie from "@/assets/toast-selfie.webp";
import piscoChalkboard from "@/assets/pisco-chalkboard.webp";
import piscoPrep from "@/assets/pisco-prep.webp";
import barGroup from "@/assets/bar-group.webp";

// Centralized media paths: swap photos here without touching components.
export const MEDIA = {
  logo,
  hero: rooftopGroup,
  rooftop: rooftopVolcano,
  steps: [cutting, flambe, toastSelfie],
  dishes: [rooftopVolcano, flambe, piscoChalkboard],
};

export type GalleryCategory = "kitchen" | "process" | "feast" | "people";

export const GALLERY: { key: string; src: string; cat: GalleryCategory; tall?: boolean }[] = [
  { key: "rooftopVolcano", src: rooftopVolcano, cat: "feast" },
  { key: "cutting", src: cutting, cat: "process", tall: true },
  { key: "toastSelfie", src: toastSelfie, cat: "people" },
  { key: "flambe", src: flambe, cat: "kitchen", tall: true },
  { key: "piscoChalkboard", src: piscoChalkboard, cat: "feast", tall: true },
  { key: "rooftopGroup", src: rooftopGroup, cat: "people", tall: true },
  { key: "piscoPrep", src: piscoPrep, cat: "kitchen", tall: true },
  { key: "barGroup", src: barGroup, cat: "people" },
];
