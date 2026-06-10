import { IconType } from "react-icons";
import { FaPlay, FaSquare, FaCircle, FaStar } from "react-icons/fa";

export interface OptionTheme {
  gradient: string;
  ring: string;
  icon: IconType;
}

// Kahoot/Mentimeter-style colored answer tiles, indexed by option position.
export const OPTION_THEMES: OptionTheme[] = [
  { gradient: "from-rose-500 to-red-600", ring: "ring-rose-300", icon: FaPlay },
  { gradient: "from-sky-500 to-blue-600", ring: "ring-sky-300", icon: FaSquare },
  { gradient: "from-amber-400 to-orange-500", ring: "ring-amber-200", icon: FaCircle },
  { gradient: "from-emerald-500 to-green-600", ring: "ring-emerald-300", icon: FaStar },
];
