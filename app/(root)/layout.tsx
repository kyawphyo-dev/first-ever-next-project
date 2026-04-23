import { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import RightSideBar from "@/components/RightSideBar";
function layout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="flex mt-5">
        <SideBar />
        <div className="w-3/5">{children}</div>
        <div className="w-1/5 border-l border-primary">
          <RightSideBar />
        </div>
      </div>
    </>
  );
}

export default layout;
