"use client";
import Button from "@/components/Button";
import { signIn } from "next-auth/react";

import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";
function AuthForm() {
  const handleLogin = async ({ provider }: { provider: string }) => {
    try {
      await signIn(provider, { redirectTo: "/" });
    } catch (e) {
      if (e instanceof Error) {
        toast.error("Login failed!" + e.message);
      }
    }
  };

  return (
    <div className="flex space-x-2">
      <Button
        type="button"
        icon={FaGoogle}
        style="outline"
        onClick={() => handleLogin({ provider: "google" })}
      >
        Google
      </Button>

      <Button
        type="submit"
        icon={FaGithub}
        style="outline"
        onClick={() => handleLogin({ provider: "github" })}
      >
        Github
      </Button>
    </div>
  );
}

export default AuthForm;
