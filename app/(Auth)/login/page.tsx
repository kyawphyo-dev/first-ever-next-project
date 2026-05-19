import { SiDevbox } from "react-icons/si";
import AuthForm from "../components/AuthForm";
import ROUTES from "@/routes";
import ButtonLink from "@/components/ButtonLink";
import CredentialsAuthForm from "../components/CredentialsAuthForm";

function page() {
  return (
    <div className="max-w-5xl min-h-screen mx-auto flex">
      <div className="flex shadow-2xl shadow-primary my-20">
        <div className="w-1/2 flex items-center justify-center">
          <div className="space-y-10 ps-10">
            <div className="flex items-center ">
              <SiDevbox className="text-6xl text-blue-600" />
              <h1 className="text-5xl font-bold">
                <span className="text-blue-600">.dev</span> forum
              </h1>
            </div>
            <p className="text-text-muted">
              Dev Forum is a community for developers to ask questions, share
              knowledge, and discuss modern technologies. It supports learners
              and professionals in improving skills and staying updated with
              industry trends.
            </p>
            <ButtonLink href={ROUTES.REGISTER} style="outline">
              Don't have an account?
            </ButtonLink>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center p-4">
          <div className="w-full max-w-sm space-y-6  p-8 rounded-lg border border-border">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-main-text">
                Welcome Back!
              </h2>
              <p className="text-sm text-text-muted">
                Enter your credentials to access your account
              </p>
            </div>
            <CredentialsAuthForm type="login" />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-bg px-2 text-text-muted">
                  Or continue with
                </span>
              </div>
            </div>
            <AuthForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
