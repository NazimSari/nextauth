import { getServerSession } from "next-auth";
import { options } from "../../api/auth/[...nextauth]/options";
import Link from "next/link";

export default async function Nav() {
  const session = await getServerSession(options);
  return (
    <header>
      <nav className="flex justify-between max-w-6xl mx-auto items-center h-20">
        <div className="py-5 font-bold text-3xl">
          <Link href="/">LOGO</Link>
        </div>
        <ul className="flex py-5">
          <li className="mr-5 hover:underline">
            <Link href="/">Home Page</Link>
          </li>
          <li className="mr-5 hover:underline">
            <Link href="/CreateUser">Create User</Link>
          </li>
          <li className="mr-5 hover:underline">
            <Link href="/ClientMember">Client Member</Link>
          </li>
          <li className="mr-5 hover:underline">
            <Link href="/Member">Member</Link>
          </li>
          <li className="mr-5 hover:underline">
            <Link href="/Public">Public</Link>
          </li>
        </ul>
        {session ? (
          <Link href="/api/auth/signout?callbackUrl=/">Sign Out</Link>
        ) : (
          <Link href="/api/auth/signin">Sign In</Link>
        )}
      </nav>
    </header>
  );
}
