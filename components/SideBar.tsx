import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import SidebarItems from "./SidebarItems";
import ROUTES from "@/routes";
import Link from "next/link";
import { CiLogin, CiLogout } from "react-icons/ci";

async function SideBar() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="w-1/5 my-12">
      <ul className="flex flex-col items-center px-5 space-y-1">
        <SidebarItems />

        {!user && (
          <li className="px-4 w-full py-3 text-accent rounded-sm hover:text-white hover:bg-blue-500 cursor-pointer">
            <Link href={ROUTES.LOGIN} className="flex items-center">
              <CiLogin />
              <span className="ms-2">Login</span>
            </Link>
          </li>
        )}

        {user && (
          <li className="px-4 w-full py-3 text-danger rounded-sm hover:text-white hover:bg-red-500 cursor-pointer">
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
