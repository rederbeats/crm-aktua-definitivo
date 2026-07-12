"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2, Loader2, LogOut, Plus, Trash2 } from "lucide-react";

type IconName = "plus" | "trash" | "check" | "logout";
type Variant = "primary" | "dark" | "ghost" | "danger";

const icons = {
  plus: Plus,
  trash: Trash2,
  check: CheckCircle2,
  logout: LogOut
};

const variants: Record<Variant, string> = {
  primary: "command-button justify-center bg-brand-red text-white hover:bg-brand-redDark",
  dark: "command-button bg-brand-black text-white",
  ghost: "icon-button",
  danger: "icon-button text-brand-red"
};

export function SubmitButton({
  label,
  pendingLabel = "Guardando...",
  icon,
  variant = "primary",
  title
}: {
  label: string;
  pendingLabel?: string;
  icon?: IconName;
  variant?: Variant;
  title?: string;
}) {
  const { pending } = useFormStatus();
  const Icon = icon ? icons[icon] : null;
  const isIconOnly = variant === "ghost" || variant === "danger";

  return (
    <button className={variants[variant]} type="submit" title={title || label} disabled={pending} aria-busy={pending}>
      {pending ? <Loader2 className="animate-spin" size={17} /> : Icon ? <Icon size={17} /> : null}
      {isIconOnly ? <span className="sr-only">{pending ? pendingLabel : label}</span> : <span>{pending ? pendingLabel : label}</span>}
    </button>
  );
}
