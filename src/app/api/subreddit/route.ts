import { Prismadb } from "@/lib/db";
import { userSession } from "@/lib/user-session";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await userSession();
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const { name } = SubredditValidator.parse({ body });

    const subredditExist = await Prismadb.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExist) {
      return new Response("Subreddit Already Exist", { status: 409 });
    }

    const subreddit = await Prismadb.subreddit.create({
      data: {
        name,
        creatorId: session.id,
      },
    });

    await Prismadb.subscription.create({
      data: {
        userId: session.id,
        subredditId: subreddit.id,
      },
    });

    return new Response(subreddit.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("could not create a Subreddit", { status: 500 });
  }
}
