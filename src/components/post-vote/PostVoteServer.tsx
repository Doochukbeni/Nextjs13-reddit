import { getAuthSession } from "@/lib/auth";
import type { Post, Vote } from "@prisma/client";
import { notFound } from "next/navigation";
import PostVotesClient from "./PostVotesClient";

interface PostVoteServerProps {
  postId: string;
  initialVoteAmt?: number;
  initialVote?: Vote["type"] | null;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

const PostVoteServer = async ({
  postId,
  getData,
  initialVote,
  initialVoteAmt,
}: PostVoteServerProps) => {
  const session = await getAuthSession();

  let _voteAmt: number = 0;
  let _currentVote: Vote["type"] | null | undefined = undefined;

  if (getData) {
    const post = await getData();

    if (!post) return notFound();

    _voteAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;

      if (vote.type === "DOWN") return acc - 1;

      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user?.id
    )?.type;
  } else {
    _voteAmt = initialVoteAmt!;

    _currentVote = initialVote;
  }

  return (
    <PostVotesClient
      initialVoteAmount={_voteAmt}
      postId={postId}
      initialVote={_currentVote}
    />
  );
};

export default PostVoteServer;
