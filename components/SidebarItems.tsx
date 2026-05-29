"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoMdHome } from "react-icons/io";
import { IoMdPricetags } from "react-icons/io";
import { FaChartLine } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import ROUTES from "@/routes";

const sidebarItems = [
  {
    label: "Home",
    href: ROUTES.HOME,
    icon: IoMdHome,
  },
  {
    label: "Tags",
    href: ROUTES.TAGS,
    icon: IoMdPricetags,
  },
  {
    label: "Popular",
    href: "/popular",
    icon: FaChartLine,
  },
  {
    label: "Categories",
    href: ROUTES.CATEGORIES,
    icon: MdOutlineCategory,
  },
  {
    label: "All",
    href: "/all",
    icon: BiCategory,
  },
];

function SidebarLinks() {
  const pathname = usePathname();

  return (
    <>
      {sidebarItems.map((item) => {
        const Icon = item.icon;

        const isActive =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <li
            key={item.href}
            className={`px-4 w-full py-3 rounded-sm cursor-pointer transition-colors
              ${
                isActive
                  ? "bg-secondary text-white"
                  : "text-secondary hover:text-white hover:bg-hover"
              }`}
          >
            <Link href={item.href} className="flex items-center">
              <Icon />
              <span className="ms-2">{item.label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
}

export default SidebarLinks;
