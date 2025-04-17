import React, { useState } from 'react';

const [editMode, setEditMode] = useState(false);
const [editedProfile, setEditedProfile] = useState({
  username: user?.username || '',
  email: user?.email || '',
  description: user?.description || '',
  avatar: user?.avatar || '',
  wallet_address: user?.wallet_address || '',
  ltc_wallet_address: user?.ltc_wallet_address || '',
  preferred_crypto: user?.preferred_crypto || 'btc',
});

{editMode ? (
  <div className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Username
      </label>
      <input
        type="text"
        value={editedProfile.username}
        onChange={(e) => setEditedProfile({ ...editedProfile, username: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-700"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Email
      </label>
      <input
        type="email"
        value={editedProfile.email}
        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-700"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Description
      </label>
      <textarea
        value={editedProfile.description}
        onChange={(e) => setEditedProfile({ ...editedProfile, description: e.target.value })}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-500 focus:ring-yellow-500 dark:bg-gray-800 dark:border-gray-700"
        rows={3}
      />
    </div>
    {/* ... existing wallet address fields ... */}
  </div>
) : (
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
        {user?.username}
      </h3>
      {user?.email && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user.email}
        </p>
      )}
      {user?.description && (
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {user.description}
        </p>
      )}
    </div>
    {/* ... existing wallet address display ... */}
  </div>
)} 