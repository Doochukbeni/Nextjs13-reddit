"use client";

import { useRef } from "react";
import { Comment, CommentVote, User } from "@prisma/client";

import CommentVotes from "@/components/CommentVotes";
import UserAvatar from "@/components/UserAvatar";
import { formatTimeToNow } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { MessageSquare } from "lucide-react";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  postId: string;
  voteAmount: number;
  currentVote: CommentVote | undefined;
}

const PostComment = ({
  comment,
  voteAmount,
  currentVote,
  postId,
}: PostCommentProps) => {
  const commentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col ">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        />

        <div className="ml-2 flex items-center gap-x-2">
          <p className="text-sm font-medium text-gray-900">
            u/{comment.author.username}
          </p>
          <p className="max-h-40 truncate text-xs text-zinc-500">
            {formatTimeToNow(new Date(comment.createdAt))}
          </p>
        </div>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center">
        <CommentVotes
          commentId={comment.id}
          initialVoteAmount={voteAmount}
          initialVote={currentVote}
        />

        <Button
          variant="ghost"
          size="xs"
          className="flex items-center text-zinc-500"
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
          Reply
        </Button>
      </div>
    </div>
  );
};

export default PostComment;
