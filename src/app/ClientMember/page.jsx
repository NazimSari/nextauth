"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ClientMember() {
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/api/auth/signin?callbackUrl=/ClientMember");
    },
  });

  return (
    <>
      <h1 className="text-3xl font-bold">Client Member Server Session</h1>
      <p>{session?.user?.email}</p>
      <p>{session?.user?.role}</p>
    </>
  );
}
