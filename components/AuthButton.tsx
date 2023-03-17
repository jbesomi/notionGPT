import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

const AuthButton = () => {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <div className="flex">
      <div
        className={`nojs-show ${!session && loading ? "animate-pulse" : ""}`}
      >
        {!session && (
          <div>
            <div className="flex mx-auto">
              <Link
                href="/api/auth/signin"
                className="border-2 py-4 px-8 ml-2 rounded-lg"
                onClick={(e) => {
                  e.preventDefault();
                  signIn("notion");
                }}
              >
                <div className="flex m-be">
                  <img
                    loading="lazy"
                    height="24"
                    width="24"
                    id="provider-logo-dark"
                    src="https://authjs.dev/img/providers/notion.svg"
                  ></img>
                  <p className="mx-5">Sign in with Notion</p>
                </div>
              </Link>
            </div>
          </div>
        )}
        {session?.user && (
          <div className="">
            {session.user.image && (
              <span
                style={{ backgroundImage: `url('${session.user.image}')` }}
                className="bg-cover bg-center w-10 h-10 rounded-full inline-block"
              />
            )}
            <span className="ml-2 text-gray-600">
              <strong>{session.user.email ?? session.user.name}</strong>
            </span>
            <a
              href="/api/auth/signout"
              className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={(e) => {
                e.preventDefault();
                signOut();
              }}
            >
              Sign out
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthButton;
