import React from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";

export default function Chat() {
  const openCrispChat = () => {
    if (window.$crisp) {
      window.$crisp.push(["do", "chat:open"]);
    }
  };

  return (
    <Button
      onClick={openCrispChat}
      className="flex items-center gap-2"
      variant="default"
    >
      <MessageSquare className="h-5 w-5" />
      Chat with Support
    </Button>
  );
}
