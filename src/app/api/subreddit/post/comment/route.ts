import { getAuthSession } from "@/lib/auth";
import { Prismadb } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comments";
import { z } from "zod";

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, text, replyToId } = CommentValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await Prismadb.comment.create({
      data: {
        text,
        postId,
        authorId: session.user.id,
        replyToId,
      },
    });

    return new Response("Ok", { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request data passed", { status: 422 });
    }

    return new Response("could not add comment, please try again later", {
      status: 500,
    });
  }
}
