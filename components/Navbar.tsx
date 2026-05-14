"use client";

import Image from "next/image";
import logo from "../public/devlogo-removebg.png";
import Link from "next/link";
import globe from "../public/globe.svg";
import SearchInput from "../components/SearchInput";
import ROUTES from "@/routes";
import { Suspense, useEffect, useState } from "react";

function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", controlNavbar);

    return () => {
      window.removeEventListener("scroll", controlNavbar);
    };
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-bg transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-between px-10 py-3 items-center">
        <div>
          <Link href={ROUTES.HOME}>
            <Image
              src={logo}
              alt="dev forum"
              width={120}
              height={130}
              className="object-cover"
            />
          </Link>
        </div>
        <div className="w-150">
          <Suspense
            fallback={
              <div className="h-10 w-full bg-input-background animate-pulse rounded-md" />
            }
          >
            <SearchInput />
          </Suspense>
        </div>
        <div>
          <Image
            src={globe}
            alt="profile globe"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
