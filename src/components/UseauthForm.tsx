"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Icons } from "@/components/Icon";
import { useToast } from "@/hooks/use-toast";

interface UserauthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const UseauthForm = ({ className, ...props }: UserauthFormProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  const logInwithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      toast({
        title: "There was a problem",
        description: "Sorry there was an error logging you in with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex justify-center", className)} {...props}>
      <Button
        size="sm"
        className="w-full"
        isLoading={isLoading}
        onClick={logInwithGoogle}
      >
        {isLoading ? null : <Icons.google className="h-4 w-4 mr-2" />}
        Google
      </Button>
    </div>
  );
};

export default UseauthForm;
