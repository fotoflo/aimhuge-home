import { icons } from "lucide-react";

interface IconProps {
  name: string;
  color?: string;
  size?: number | string;
  className?: string;
}

export function Icon({ name, color, size, className }: IconProps) {
  const LucideIcon = (icons as any)[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon color={color} size={size} className={className} />;
}
