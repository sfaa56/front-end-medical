"use client";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";

type Option = {
  label: string;
  value: string;
};

// Generic props
interface Props<T extends string | number> {
  options: (T | Option)[];
  value: T | undefined;
  placeholder?: string;
  onChange: (val: T) => void;
  disabled?:boolean
}

export default function CustomSelect<T extends string | number>({
  options,
  value,
  placeholder = "Select an option",
  onChange,
  disabled=false,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useClickOutside(ref, open, () => setOpen(false));

  // Normalize display text
  const getLabel = (opt: T | Option) =>
    typeof opt === "object" ? opt.label : opt;

  const getValue = (opt: T | Option): T =>
    typeof opt === "object" ? (opt.value as T) : (opt as T);

  return (
    <div className="relative w-full" ref={ref}>
      {/* Selected item */}
      <button
        disabled={disabled}
        type="button"
        onClick={() => setOpen(!open)}
        className={`${
          !value && "text-gray-400"
        } w-full flex justify-between items-center border text-sm rounded-md px-3 py-2 bg-white  hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary`}
      >
        <span>
          {value
            ? getLabel(options.find((o) => getValue(o) === value) ?? value)
            : placeholder}
        </span>
        <BiChevronDown
          className={`w-5 h-5 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Options */}
      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-60 overflow-y-auto text-sm">
          {options.map((opt, i) => {
            const optLabel = getLabel(opt);
            const optValue = getValue(opt);

            return (
              <li
                key={i}
                onClick={() => {
                  onChange(optValue);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-primary/10 ${
                  optValue === value ? "bg-primary/10 " : ""
                }`}
              >
                {optLabel}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
