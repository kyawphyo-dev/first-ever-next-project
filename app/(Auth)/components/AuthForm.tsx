import { signIn } from "@/auth";
import Button from "@/components/Button";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
function AuthForm() {
  return (
    <div className="flex space-x-2">
      <Button type="button" icon={FaGoogle} style="outline">
        Google
      </Button>
      <form
        className="w-full"
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <Button type="submit" icon={FaGithub} style="outline">
          Github
        </Button>
      </form>
    </div>
  );
}

export default AuthForm;
