import React from "react";
import { IconType } from "react-icons";

function Input({
  label,
  placeholder,
  id,
  icon: Icon,
  onIconClick,
  ...props
}: {
  label?: string;
  placeholder: string;
  id?: string;
  icon?: IconType;
  onIconClick?: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="space-y-3">
      {label && <label htmlFor={id}>{label}</label>}
      <div className="relative">
        <input
          {...props}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm text-main-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-background transition-colors"
          name=""
          id={id}
        />
        {Icon && (
          <button
            type="button"
            onClick={onIconClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-main-text transition-colors"
          >
            <Icon size={18} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Input;
