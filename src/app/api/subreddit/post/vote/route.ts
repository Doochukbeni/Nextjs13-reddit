import { getAuthSession } from "@/lib/auth";
import { Prismadb } from "@/lib/db";
import { redis } from "@/lib/upstashRedis";
import { VoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_VOTE = 1;

export async function PATCH(req: Request) {
  try {
    const body = await req.json();

    const { postId, voteType } = VoteValidator.parse(body);

    const session = await getAuthSession();

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const post = await Prismadb.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        votes: true,
      },
    });

    if (!post) {
      return new Response("Post not Found", { status: 404 });
    }

    const existingVote = await Prismadb.vote.findFirst({
      where: {
        userId: session.user.id,
        postId,
      },
    });

    if (existingVote) {
      if (existingVote.type === voteType) {
        await Prismadb.vote.delete({
          where: {
            userId_postId: {
              postId,
              userId: session.user.id,
            },
          },
        });
        return new Response("Ok", { status: 200 });
      }

      await Prismadb.vote.update({
        where: {
          userId_postId: {
            postId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      });

      // recount the votes

      const voteAmount = post.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1;
        if (vote.type === "DOWN") return acc - 1;

        return acc;
      }, 0);

      if (voteAmount >= CACHE_AFTER_VOTE) {
        const cachePost: CachedPost = {
          id: postId,
          authorUsername: post.author.username ?? "",
          content: JSON.stringify(post.content),
          title: post.title,
          currentVote: voteType,
          createdAt: post.createdAt,
        };

        await redis.hset(`post:${postId}`, cachePost);
      }
      return new Response("OK");
    }

    await Prismadb.vote.create({
      data: {
        postId,
        type: voteType,
        userId: session.user.id,
      },
    });

    // recount the votes
    const voteAmount = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;

      return acc;
    }, 0);

    if (voteAmount >= CACHE_AFTER_VOTE) {
      const cachePost: CachedPost = {
        id: postId,
        authorUsername: post.author.username ?? "",
        content: JSON.stringify(post.content),
        title: post.title,
        currentVote: voteType,
        createdAt: post.createdAt,
      };

      await redis.hset(`post:${postId}`, cachePost);
    }

    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    }

    return new Response("could not register you vote, please try again later", {
      status: 500,
    });
  }
}
