
'use client';

import { Button } from "@/components/ui/button";
import { deletePost } from "@/lib/actions/admin-actions";
import { Trash2 } from "lucide-react";

export function DeletePostButton({ postId }: { postId: number }) {
  const deleteAction = deletePost.bind(null, postId);

  return (
    <form action={deleteAction}>
      <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
        <Trash2 className="w-4 h-4" />
      </Button>
    </form>
  );
}
