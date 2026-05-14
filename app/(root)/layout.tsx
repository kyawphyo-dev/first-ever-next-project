import { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import RightSideBar from "@/components/RightSideBar";
function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1 mt-[72px]">
        <SideBar />
        <main className="w-3/5">{children}</main>
        <div className="w-1/5">
          <RightSideBar />
        </div>
      </div>
    </div>
  );
}

export default layout;
