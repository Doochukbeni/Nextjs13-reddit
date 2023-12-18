"use client";

import useCustomToast from "@/hooks/use-custom-toast";
import { usePrevious } from "@mantine/hooks";
import { VoteType } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { ArrowBigDown, ArrowBigUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { PostVoteRequest } from "@/lib/validators/vote";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";

interface PostVotesClientProps {
  postId: string;
  initialVoteAmount: number;
  initialVote?: VoteType | null;
}

const PostVotesClient = ({
  postId,
  initialVoteAmount,
  initialVote,
}: PostVotesClientProps) => {
  const { loginToast } = useCustomToast();

  const [voteAmount, setVoteAmount] = useState<number>(initialVoteAmount);

  const [currentVote, setCurrentVote] = useState(initialVote);

  const prevVote = usePrevious(currentVote);

  // ensure sync with server
  useEffect(() => {
    setCurrentVote(initialVote);
  }, [initialVote]);

  const { mutate: vote, isLoading } = useMutation({
    mutationFn: async (type: VoteType) => {
      const payload: PostVoteRequest = {
        postId,
        voteType: type,
      };

      await axios.patch("/api/subreddit/post/vote", payload);
    },
    onError: (error, VoteType) => {
      if (VoteType === "UP") setVoteAmount((prev) => prev - 1);
      else setVoteAmount((prev) => prev + 1);

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
    onMutate: (type: VoteType) => {
      if (currentVote === type) {
        // meaning user is voting the same way again
        setCurrentVote(undefined);

        if (type === "UP") setVoteAmount((prev) => prev - 1);
        else if (type === "DOWN") setVoteAmount((prev) => prev + 1);
      } else {
        // user voting the opposite side, subtract 2
        setCurrentVote(type);
        if (type === "UP")
          setVoteAmount((prev) => prev + (currentVote ? 2 : 1));
        else if (type === "DOWN")
          setVoteAmount((prev) => prev - (currentVote ? 2 : 1));
      }
    },
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-0 pr-6 sm:w-20 pb-4 sm:pb-0">
      <Button
        size="sm"
        variant="ghost"
        aria-label="upvote"
        onClick={() => vote("UP")}
      >
        <ArrowBigUp
          className={cn("h-5 w-5 text-zinc-700", {
            "text-emerald-500 fill-emerald-500": currentVote === "UP",
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
            "text-red-500 fill-red-500": currentVote === "DOWN",
          })}
        />
      </Button>
    </div>
  );
};

export default PostVotesClient;
