import { auth } from "@/auth";
import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";

async function page() {
  const session = await auth();
  console.log(session);
  return (
    <>
      <Navbar />
      <SideBar />
    </>
  );
}

export default page;
