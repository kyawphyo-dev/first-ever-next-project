import { IconType } from "react-icons";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  icon?: IconType;
  children?: React.ReactNode;
  style?: "normal" | "outline";
}

function Button({ type, icon: Icon, children, style }: ButtonProps) {
  return (
    <button
      type={type}
      className={`w-full flex h-10 items-center justify-center rounded-md border border-border  px-4 py-2 text-sm font-medium text-main-text  transition-colors ${style === "outline" ? "bg-outline-border text-white hover:bg-secondary" : " bg-accent hover:bg-blue-600"}`}
    >
      {Icon && <Icon className="text-lg me-2" />}
      {children}
    </button>
  );
}

export default Button;
