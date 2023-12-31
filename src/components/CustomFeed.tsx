import { Prismadb } from "@/lib/db";

import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import PostFeed from "@/components/PostFeed";
import { getAuthSession } from "@/lib/auth";

const CustomFeed = async () => {
  const session = await getAuthSession();

  const followedCommunities = await Prismadb.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await Prismadb.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunities.map(({ subreddit }) => subreddit.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLLING_PAGINATION_RESULT,
  });
  return <PostFeed initialPosts={posts} />;
};

export default CustomFeed;
