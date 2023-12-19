import React from "react";

import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import { Prismadb } from "@/lib/db";
import PostFeed from "@/components/PostFeed";

const GeneralFeed = async () => {
  const posts = await Prismadb.post.findMany({
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

export default GeneralFeed;
