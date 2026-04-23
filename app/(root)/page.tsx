import { auth } from "@/auth";

async function page() {
  const session = await auth();
  console.log(session);
  return <>{session?.user?.email}</>;
}

export default page;
