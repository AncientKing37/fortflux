
import React from 'react';

interface ChatPlaceholderProps {
  connected: boolean;
}

const ChatPlaceholder: React.FC<ChatPlaceholderProps> = ({ connected }) => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50">
      <div className="text-center p-4">
        <h3 className="font-medium text-lg">Select a conversation</h3>
        <p className="text-gray-500">Choose a conversation from the list to start chatting</p>
        {!connected && (
          <p className="text-yellow-600 mt-2 text-sm">
            Chat connection status: {connected ? 'Connected' : 'Disconnected'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatPlaceholder;
