"use client";
import Button from "@/components/Button";
import Input from "@/components/Input";
import { SignUpWithCredentials } from "@/lib/actions/SignUpWithCredentials.action";
import { SignInWithCredentials } from "@/lib/actions/SignInWithCredentials.action";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

interface Formdata {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface FormError {
  name?: string[];
  username?: string[];
  email?: string[];
  password?: string[];
}
function CredentialsAuthForm({ type }: { type: "login" | "register" }) {
  const [formData, setFormData] = useState<Formdata>({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<FormError | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  // Submit handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({});

    // Submit form data to server
    const action =
      type === "login" ? SignInWithCredentials : SignUpWithCredentials;

    const result = await action(formData);

    if (result.success) {
      toast.success(`Successfully signed ${type === "login" ? "in" : "up"}`);
      router.push("/");
    } else {
      if ("details" in result && result.details) {
        setError(result.details as FormError);
      }

      if ("message" in result && result.message) {
        const message = result.message;
        if (message === "Email already exists") {
          setError((prev) => ({ ...prev, email: [message] }));
        } else if (message === "Username already exists") {
          setError((prev) => ({ ...prev, username: [message] }));
        } else if (message === "Invalid email or password") {
          setError((prev) => ({
            ...prev,
            password: [message],
          }));
        } else {
          toast.error(message);
        }
      }
    }
  };
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {type === "register" && (
        <>
          <div>
            <Input
              type="text"
              placeholder="name"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
            {error?.name && (
              <p className="text-red-500 text-sm my-1">{error.name[0]}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              placeholder="username"
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
            />
            {error?.username && (
              <p className="text-red-500 text-sm my-1">{error.username[0]}</p>
            )}
          </div>
        </>
      )}
      <div>
        <Input
          type="email"
          placeholder="email@exaple.com"
          id="email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        {error?.email && (
          <p className="text-red-500 text-sm my-1">{error.email[0]}</p>
        )}
      </div>
      <div>
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="password"
          id="password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          icon={showPassword ? FaEyeSlash : FaEye}
          onIconClick={() => setShowPassword(!showPassword)}
        />
        {error?.password && (
          <p className="text-red-500 text-sm my-1">{error.password[0]}</p>
        )}
      </div>
      <Button type="submit" style="normal">
        Sign {type === "login" ? "In" : "Up"}
      </Button>
    </form>
  );
}

export default CredentialsAuthForm;
