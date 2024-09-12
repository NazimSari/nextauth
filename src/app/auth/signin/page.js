"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });
    if (result.error) {
      setError(result.error);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col items-center min-h-[90vh] w-full mx-auto justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <div className="flex flex-col p-5 items-center justify-around w-[380px] min-h-[530px] bg-white rounded-3xl">
        <div>
          <div className="p-4 border-2 border-gray-200 rounded-lg  w-[300px] flex items-center mb-5">
            <div className="w-[25px] h-[25px] flex items-center justify-center">
              <Image
                src="/assets/google.png"
                alt="logo"
                width={25}
                height={25}
              />
            </div>
            <div className="ml-3 flex-grow text-center text-lg  text-black">
              <button onClick={() => signIn("google", { callbackUrl: "/" })}>
                Sign in with Google
              </button>
            </div>
          </div>
          <div className="p-4 border-2 border-gray-200 rounded-lg  w-[300px] flex items-center bg-black/80 hover:bg-black/65 transition-all duration-200">
            <div className="w-[25px] h-[25px] flex items-center justify-center">
              <Image
                src="/assets/github.png"
                alt="logo"
                width={25}
                height={25}
              />
            </div>
            <div className="ml-3 flex-grow text-center text-lg  text-white">
              <button onClick={() => signIn("github", { callbackUrl: "/" })}>
                Sign in with GitHub
              </button>
            </div>
          </div>
        </div>
        <div className="flex justify-around w-full relative my-7">
          <p className="absolute -top-3 text-gray-500 font-semibold">or</p>
          <span className="w-[130px] ml-6 border border-gray-300"></span>
          <span className="w-[130px] mr-6 border border-gray-300"></span>
        </div>
        <div className="flex flex-col items-center bg-white rounded-3xl">
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <label className="p-1">Email</label>
            <input
              className="w-[300px] border p-3 rounded-lg"
              type="email"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label className="p-1">Password</label>
            <input
              className="w-[300px] border p-3 rounded-lg"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">{"Hatalı giriş!"}</p>
            )}
            <button
              className="w-[300px] border p-3 rounded-lg bg-slate-200 mt-5 hover:bg-slate-300 transition-all duration-200"
              type="submit"
            >
              Sign in
            </button>
          </form>

          <Link
            href="/ResetForm"
            className="mt-5 text-sm text-blue-500 hover:underline"
          >
            şifrenizi mi unuttunuz?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
