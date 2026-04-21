import Image from "next/image";
import logo from "../public/devlogo-removebg.png";
import Link from "next/link";
import globe from "../public/globe.svg";
import Input from "../components/Input";
function Navbar() {
  return (
    <div className="flex justify-between px-10 py-3 items-center">
      <div>
        <Link href="/">
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
        <Input type="text" placeholder="Search" id="search" />
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
  );
}

export default Navbar;
