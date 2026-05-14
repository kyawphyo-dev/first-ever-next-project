"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import queryString from "query-string";
import Input from "../components/Input";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import debounce from "debounce";

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Use a ref to store the latest searchParams to avoid infinite loop
  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    searchParamsRef.current = searchParams;
  }, [searchParams]);

  // ✅ Create debounced function
  const updateUrl = useMemo(
    () =>
      debounce((value) => {
        const currentParams = queryString.parse(searchParamsRef.current.toString());
        const currentSearch = currentParams.search || "";

        if (value === currentSearch) return;

        if (value) {
          currentParams.search = value;
        } else {
          delete currentParams.search;
        }

        const query = queryString.stringify(currentParams);
        const url = `${pathname}${query ? `?${query}` : ""}`;

        router.replace(url, { scroll: false });
      }, 500),
    [pathname, router],
  );

  // ✅ Call debounced function when search changes
  useEffect(() => {
    updateUrl(search);

    return () => {
      updateUrl.clear(); // important cleanup
    };
  }, [search, updateUrl]);

  return (
    <Input
      type="search"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search"
      id="search"
    />
  );
}

export default SearchInput;
