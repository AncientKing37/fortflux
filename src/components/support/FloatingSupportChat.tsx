import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function FloatingSupportChat() {
  const openCrispChat = () => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  return (
    <Button
      onClick={openCrispChat}
      className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg"
      size="icon"
      variant="default"
    >
      <MessageSquare className="h-6 w-6" />
    </Button>
  );
}
