import React from "react";

export default function ActionButton({
  children,
  onClick,
  disabled = false,
  className = "",
}: React.PropsWithChildren<{ onClick: () => void; disabled?: boolean; className?: string }>) {
  return (
    <button
      className={`px-2 py-0.5 rounded border border-gray-300 text-xs transition ${className}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}