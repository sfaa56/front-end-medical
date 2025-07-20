"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const navItems = [
  { href: "/payments/transaction", label: "Transactions" },
  { href: "/payments/withdrawal", label: "Withdrawals" },
  { href: "/payments/invoice", label: "Invoices" },
  { href: "/payments/earnings", label: "Earnings" },
];

type PaymentPath = "/payments/transaction" | "/payments/withdrawal" | "/payments/invoice" | "/payments/earnings";

export default function PaymentsNav() {
  const underlineRef = useRef<HTMLSpanElement>(null);

  const buttonRefs: Record<PaymentPath, React.RefObject<HTMLAnchorElement>> = {
    "/payments/transaction": useRef<HTMLAnchorElement>(null),
    "/payments/withdrawal": useRef<HTMLAnchorElement>(null),
    "/payments/invoice": useRef<HTMLAnchorElement>(null),
    "/payments/earnings": useRef<HTMLAnchorElement>(null),
  };
  const pathname = usePathname() as PaymentPath;

  useEffect(() => {
    const underline = underlineRef.current;
    const activeButton = buttonRefs[pathname]?.current;

    if (underline && activeButton) {
      const { offsetLeft, offsetWidth } = activeButton;
      underline.style.left = `${offsetLeft}px`;
      underline.style.width = `${offsetWidth}px`;
    }
  }, [pathname]);


  return (
    <nav className="mb-6 relative flex flex-col border-b border-gray-200 ">
      <ul className="flex relative gap-3  px-2 py-3">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              ref={buttonRefs[item.href as PaymentPath]}
              className={`px-3 py-1  hover:cursor-pointer relative transition ${
                pathname === item.href
                  ? " font-semibold"
                  : "font-normal"
              }`}
            >
              {item.label}
            </Link>
          </li>
        ))}
    

         {/* Animated Underline */}
          <span
            ref={underlineRef}
            className="absolute bottom-0 h-[2px] bg-black transition-all duration-200 ease-in-out"
            style={{ left: 0, width: 0 }}
          />
      </ul>
    </nav>
  );
}