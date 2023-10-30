import { getAuthSession } from "@/lib/auth";
import { Prismadb } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // check if the user is logged in
    const userSession = await getAuthSession();
    const session = userSession?.user;

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    // validate user input in the backend as well
    const { name } = SubredditValidator.parse(body);
    console.log("route payload", name);

    // check if user already exist
    const subredditExist = await Prismadb.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (subredditExist) {
      return new Response("Subreddit Already Exist", { status: 409 });
    }

    // create a new subredit community

    const subreddit = await Prismadb.subreddit.create({
      data: {
        name,
        creatorId: session.id,
      },
    });

    // subscribe to the community after creation
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
