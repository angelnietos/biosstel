export type ThemeColor = "blue" | "maroon" | "teal" | "purple" | "magenta";

interface ObjectiveColorEntry {
  text: string;
  bg: string;
  border: string;
  title: string;
  titleBg: string;
}

export const OBJECTIVE_COLOR_MAP: Record<ThemeColor, ObjectiveColorEntry> = {
  blue: { text: "text-[#185c80]", bg: "bg-[#185c80]", border: "border-[#185c80]", title: "text-[#185c80]", titleBg: "bg-[#eaf6fb]" },
  maroon: { text: "text-[#a51d2d]", bg: "bg-[#a51d2d]", border: "border-[#a51d2d]", title: "text-[#a51d2d]", titleBg: "bg-[#fbeaea]" },
  teal: { text: "text-[#0e7490]", bg: "bg-[#0e7490]", border: "border-[#0e7490]", title: "text-[#0e7490]", titleBg: "bg-[#e0f2fe]" },
  purple: { text: "text-[#7e22ce]", bg: "bg-[#7e22ce]", border: "border-[#7e22ce]", title: "text-[#7e22ce]", titleBg: "bg-[#f3e8ff]" },
  magenta: { text: "text-[#be185d]", bg: "bg-[#be185d]", border: "border-[#be185d]", title: "text-[#be185d]", titleBg: "bg-[#fce7f3]" },
};

export const formatNumber = (num: number) => num.toLocaleString("es-ES");
