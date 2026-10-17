import { Briefcase, ClipboardList, Code, Megaphone, Palette, Stethoscope, type LucideProps } from "lucide-react";

const ICONS: Record<string, React.ComponentType<LucideProps>> = {
  "project-manager": ClipboardList,
  nurse: Stethoscope,
  "software-engineer": Code,
  "ux-designer": Palette,
  "marketing-manager": Megaphone,
};

export default function CareerIcon({ careerId, ...props }: { careerId: string } & LucideProps) {
  const Icon = ICONS[careerId] ?? Briefcase;
  return <Icon aria-hidden="true" {...props} />;
}
