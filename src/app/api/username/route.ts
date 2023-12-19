import { getAuthSession } from "@/lib/auth";
import { Prismadb } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const session = await getAuthSession();

    if (!session?.user) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name } = UsernameValidator.parse(body);

    const username = await Prismadb.user.findFirst({
      where: {
        username: name,
      },
    });

    if (username) {
      return new Response("Username already Taken", { status: 409 });
    }

    //   update usename if it is not taken

    await Prismadb.user.update({
      where: {
        id: session.user.id,
      },
      data: { username: name },
    });

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("could not update your username, please try again", {
      status: 500,
    });
  }
}
