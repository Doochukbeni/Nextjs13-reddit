"use client";

import { Button } from "@/components/ui/Button";
import useCustomToast from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { startTransition } from "react";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditname: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle = ({
  subredditId,
  subredditname,
  isSubscribed,
}: SubscribeLeaveToggleProps) => {
  const { loginToast } = useCustomToast();
  const router = useRouter();

  const { mutate: subscribetoComunity, isLoading: isSubLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const data = await axios.post(
        "/api/subreddit/subscribe",
        JSON.stringify(payload)
      );
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem",
        description: "Something went wrong please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      return toast({
        title: "Subscription was successful",
        description: `You are now subscribed to r/${subredditname}`,
      });
    },
  });

  const { mutate: unsubscribetoComunity, isLoading: isUnSubLoading } =
    useMutation({
      mutationFn: async () => {
        const payload: SubscribeToSubredditPayload = {
          subredditId,
        };

        const data = await axios.post(
          "/api/subreddit/unsubscribe",
          JSON.stringify(payload)
        );
      },
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            return loginToast();
          }
        }

        return toast({
          title: "There was a problem",
          description: "Something went wrong please try again",
          variant: "destructive",
        });
      },
      onSuccess: () => {
        startTransition(() => {
          router.refresh();
        });
        return toast({
          title: "Unsubscribed !",
          description: `You are now unsubscribed from r/${subredditname}`,
        });
      },
    });

  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => unsubscribetoComunity()}
      isLoading={isUnSubLoading}
    >
      Leave Community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubLoading}
      onClick={() => subscribetoComunity()}
    >
      Join to post
    </Button>
  );
};

export default SubscribeLeaveToggle;
