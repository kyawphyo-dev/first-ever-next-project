import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { FaChartLine } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import ROUTES from "@/routes";

function SideBar() {
  return (
    <div className="w-1/5 border-r border-primary">
      <ul className="flex flex-col items-center px-5 space-y-1">
        <li className="text-white px-4 w-full py-3 bg-secondary rounded-sm hover:bg-hover cursor-pointer ">
          <Link href={ROUTES.HOME} className="flex items-center">
            <IoMdHome />
            <span className="ms-2">Home</span>
          </Link>
        </li>

        <li className="text-white px-4 w-full py-3  rounded-sm hover:bg-hover cursor-pointer">
          <Link href="/" className="flex items-center">
            <FaChartLine className="text-secondary" />
            <span className="ms-2">Popular</span>
          </Link>
        </li>
        <li className="text-white px-4 w-full py-3  rounded-sm hover:bg-hover cursor-pointer">
          <Link href={ROUTES.CATEGORIES} className="flex items-center">
            <MdOutlineCategory className="text-secondary" />
            <span className="ms-2">Categories</span>
          </Link>
        </li>
        <li className="text-white px-4 w-full py-3  rounded-sm hover:bg-hover cursor-pointer">
          <Link href="/" className="flex items-center">
            <BiCategory className="text-secondary" />
            <span className="ms-2">All</span>
          </Link>
        </li>

        <li className=" px-4 w-full py-3 text-danger  rounded-sm hover:text-white hover:bg-red-500 cursor-pointer">
          <Link href="/" className="flex items-center">
            <CiLogout />
            <span className="ms-2">Logout</span>
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
