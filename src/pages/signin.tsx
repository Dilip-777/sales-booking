import { GetServerSideProps, Metadata } from "next";
import { UserAuthForm } from "@/components/Auth/signin-form";
import { getSession } from "next-auth/react";

export const metadata: Metadata = {
  title: "Authentication",
  description: "Authentication forms built using the components.",
};

export default function AuthenticationPage() {
  return (
    <div className="container relative  h-screen w-full flex flex-col items-center justify-center md:grid lg:max-w-none lg:px-0">
      <div className="mx-auto flex w-full  flex-col justify-center space-y-6 sm:w-[350px]">
        <UserAuthForm />
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (req) => {
  const session = await getSession(req);
  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

