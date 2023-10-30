import MiniCreatePost from "@/components/MiniCreatePost";
import { INFINITE_SCROLLING_PAGINATION_RESULT } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { Prismadb } from "@/lib/db";
import { notFound } from "next/navigation";

interface CommunityProp {
  params: {
    slug: string;
  };
}

const community = async ({ params }: CommunityProp) => {
  const { slug } = params;
  console.log(slug);

  const session = await getAuthSession();

  // const subreddit = await Prismadb.subreddit.findFirst({
  //   where: { name: slug },
  //   include: {
  //     posts: {
  //       include: {
  //         author: true,
  //         votes: true,
  //         subreddit: true,
  //         comments: true,
  //       },
  //       take: INFINITE_SCROLLING_PAGINATION_RESULT,
  //     },
  //   },
  // });
  const subreddit = await Prismadb.subreddit.findFirst({
    where: { name: slug },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: INFINITE_SCROLLING_PAGINATION_RESULT,
      },
    },
  });

  if (!subreddit) return notFound();

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl h-14">
        r/{subreddit.name}
      </h1>
      <MiniCreatePost session={session} />
    </>
  );
};

export default community;
