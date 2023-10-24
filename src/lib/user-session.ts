import { redirect } from "next/navigation";

import { getAuthSession } from "@/lib/auth";
import { Prismadb } from "@/lib/db";

export async function userSession() {
  const session = await getAuthSession();

  if (!session) {
    redirect("/sign-in");
  }
  const dbUser = await Prismadb.user.findUnique({
    where: { email: session.user.email! },
  });

  if (!dbUser) return;

  //   const userId = dbUser?.id;

  //   return userId;
  return dbUser;
}
