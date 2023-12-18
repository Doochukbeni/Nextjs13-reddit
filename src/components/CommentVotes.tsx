"use client";

import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { CommentVote, VoteType } from "@prisma/client";
import { usePrevious } from "@mantine/hooks";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import { Button } from "@/components/ui/Button";
import useCustomToast from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { CommentValidatorRequest } from "@/lib/validators/vote";

interface CommentVotesClientProps {
  commentId: string;
  initialVoteAmount: number;
  initialVote?: Pick<CommentVote, "type">;
}

const CommentVotes = ({
  commentId,
  initialVoteAmount,
  initialVote,
}: CommentVotesClientProps) => {
  const { loginToast } = useCustomToast();

  const [voteAmount, setVoteAmount] = useState<number>(initialVoteAmount);

  const [currentVote, setCurrentVote] = useState(initialVote);

  const prevVote = usePrevious(currentVote);

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (voteType: VoteType) => {
      const payload: CommentValidatorRequest = {
        commentId,
        voteType,
      };

      await axios.patch("/api/subreddit/post/comment/vote", payload);
    },
    onError: (error, VoteType) => {
      if (VoteType === "UP") {
        setVoteAmount((prev) => prev - 1);
      } else {
        setVoteAmount((prev) => prev + 1);
      }

      // reset currentVote
      setCurrentVote(prevVote);

      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }
      return toast({
        title: "Something went wrong",
        description: "we could not register your vote, Please try again later",
        variant: "destructive",
      });
    },
    onMutate: (type) => {
      if (currentVote?.type === type) {
        setCurrentVote(undefined);

        if (type === "UP") {
          setVoteAmount((prev) => prev - 1);
        } else if (type === "DOWN") setVoteAmount((prev) => prev + 1);
      } else {
        setCurrentVote({ type });
        if (type === "UP")
          return setVoteAmount((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          return setVoteAmount((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex gap-1">
      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote?.type === "UP",
          })}
        />
      </Button>
      <p className="text-center py-2 font-medium text-sm text-zinc-900">
        {voteAmount}
      </p>

      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        onClick={() => vote("DOWN")}
      >
        <ArrowBigDown
          className={cn("h-5 w-5 text-zinc-700", {
            "text-red-500 fill-red-500": currentVote?.type === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default CommentVotes;
