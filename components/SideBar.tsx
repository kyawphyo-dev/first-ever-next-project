import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { FaChartLine } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import { BiCategory } from "react-icons/bi";
import { CiLogout } from "react-icons/ci";
import ROUTES from "@/routes";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { CiLogin } from "react-icons/ci";

async function SideBar() {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="w-1/5 my-12">
      <ul className="flex flex-col items-center px-5 space-y-1">
        <li className="text-white px-4 w-full py-3 bg-secondary rounded-sm hover:bg-hover cursor-pointer ">
          <Link href={ROUTES.HOME} className="flex items-center">
            <IoMdHome />
            <span className="ms-2">Home</span>
          </Link>
        </li>

        <li className="text-secondary px-4 w-full py-3 hover:text-white  rounded-sm hover:bg-hover cursor-pointer">
          <Link href="/" className="flex items-center">
            <FaChartLine />
            <span className="ms-2">Popular</span>
          </Link>
        </li>
        <li className="text-secondary hover:text-white px-4 w-full py-3  rounded-sm hover:bg-hover cursor-pointer">
          <Link href={ROUTES.CATEGORIES} className="flex items-center">
            <MdOutlineCategory className="" />
            <span className="ms-2">Categories</span>
          </Link>
        </li>
        <li className="text-secondary hover:text-white px-4 w-full py-3  rounded-sm hover:bg-hover cursor-pointer">
          <Link href="/" className="flex items-center">
            <BiCategory />
            <span className="ms-2">All</span>
          </Link>
        </li>
        {!user && (
          <li className=" px-4 w-full py-3 text-accent  rounded-sm hover:text-white hover:bg-blue-500 cursor-pointer">
            <Link href={ROUTES.LOGIN} className="flex items-center">
              <CiLogin />
              <span className="ms-2">Login</span>
            </Link>
          </li>
        )}

        {user && (
          <li className=" px-4 w-full py-3 text-danger  rounded-sm hover:text-white hover:bg-red-500 cursor-pointer">
            <form
              action={async () => {
                "use server";
                await signOut({ redirect: false });
                return redirect(ROUTES.LOGIN);
              }}
            >
              <button
                type="submit"
                className="flex items-center w-full text-left"
              >
                <CiLogout />
                <span className="ms-2">Logout</span>
              </button>
            </form>
          </li>
        )}
      </ul>
    </div>
  );
}

export default SideBar;
