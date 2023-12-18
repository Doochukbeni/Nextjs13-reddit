"use client";

import { Comment, CommentVote, User } from "@prisma/client";
import { useRef, useState } from "react";

import CommentVotes from "@/components/CommentVotes";
import UserAvatar from "@/components/UserAvatar";
import { Button } from "@/components/ui/Button";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { formatTimeToNow } from "@/lib/utils";
import { MessageSquare } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getAuthSession } from "@/lib/auth";

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
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <div ref={commentRef} className="flex flex-col ">
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
          onClick={async () => {
            if (!session) return router.push("/sign-in");
            setIsReplying(true);
          }}
          variant="ghost"
          size="xs"
          className="flex items-center text-zinc-500"
        >
          <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
          Reply
        </Button>

        {isReplying ? (
          <div className="grid w-full gap-1.5">
            <Label htmlFor="comment">Your comment</Label>
            <div className="mt-2">
              <Textarea
                placeholder="got anything to say?"
                id="comment"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={1}
              />

              <div className="flex mt-2 justify-end">
                <Button
                  className=""
                  variant="outline"
                  isLoading={isLoading}
                  disabled={input.length === 0}
                  // onClick={() => comment({ postId, text: input, replyToId })}
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PostComment;
