import React from "react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";

const CreateComment = () => {
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment">Your comment</Label>
      <div className="mt-2">
        <Textarea placeholder="Your comments" />
      </div>
    </div>
  );
};

export default CreateComment;
