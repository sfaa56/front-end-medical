import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // base styling
        "flex h-10 w-full rounded-md border bg-white px-3 py-2 text-base text-gray-700  file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // focus styling (customized here)
        "focus:outline-none focus-visible:ring-1 focus-visible:ring-secondary focus-visible:ring-offset-1 focus-visible:border-none",
        className
      )}
      {...props}
    />
  );
}

export { Input };
