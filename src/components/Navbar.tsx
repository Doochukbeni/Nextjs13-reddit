import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { Icons } from "@/components/Icon";
import UserAccountNav from "@/components/UserAccountNav";
import { buttonVariants } from "@/components/ui/Button";
import SearchBar from "@/components/SearchBar";

const Navbar = async () => {
  const session = await getAuthSession();
  const user = session?.user;

  return (
    <div className="fixed top-0 inset-x-0  h-fit bg-zinc-100 border-b border-zinc-300 z-10 py-2">
      <div className="container max-w-7xl h-full mx-auto flex items-center justify-between gap-2">
        <Link href="/" className="flex gap-2 items-center ">
          <p className="hidden text-zinc-700 text-sm font-medium md:block">
            Breadit
          </p>
          <Icons.Logo className="h-8 w-8 sm:h-6 sm:w-6" />
        </Link>

        {/* searchbar */}
        <SearchBar />

        {user ? (
          <UserAccountNav user={user} />
        ) : (
          <Link href="/sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
