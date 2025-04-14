
// Mock data for pending listings
export const pendingListingsData = [
  {
    id: 'LST001',
    title: 'Rare Fortnite Account with 50+ Skins',
    price: 120.00,
    skins: 53,
    vBucks: 1500,
    level: 85,
    battlePass: true,
    rarity: 'High',
    images: [
      'https://placehold.co/600x400?text=Fortnite+Account+1',
      'https://placehold.co/600x400?text=Inventory+1',
      'https://placehold.co/600x400?text=Skins+1',
    ],
    description: 'Rare Fortnite account with over 50 skins including rare and exclusive items. Level 85 with Battle Pass completed and 1500 V-Bucks included.',
    seller: {
      id: 'USR001',
      username: 'FortniteTrader',
      avatar: 'https://i.pravatar.cc/100?u=20',
      totalSold: 15,
      joinedDate: '2023-05-12T10:30:00Z'
    },
    created: '2023-11-14T18:30:00Z',
    status: 'pending',
  },
  {
    id: 'LST002',
    title: 'OG Fortnite Account - Season 1 Player',
    price: 299.99,
    skins: 125,
    vBucks: 2800,
    level: 210,
    battlePass: true,
    rarity: 'Very High',
    images: [
      'https://placehold.co/600x400?text=Fortnite+Account+2',
      'https://placehold.co/600x400?text=Inventory+2',
      'https://placehold.co/600x400?text=Skins+2',
    ],
    description: 'Original player from Season 1 with all Battle Passes completed. Includes ultra-rare skins and items that are no longer available. Account level 210 with 2800 V-Bucks ready to use.',
    seller: {
      id: 'USR002',
      username: 'OGCollector',
      avatar: 'https://i.pravatar.cc/100?u=21',
      totalSold: 7,
      joinedDate: '2023-08-05T14:15:00Z'
    },
    created: '2023-11-13T09:45:00Z',
    status: 'pending',
  },
  {
    id: 'LST003',
    title: 'Budget Fortnite Account - Great for Beginners',
    price: 35.50,
    skins: 12,
    vBucks: 300,
    level: 25,
    battlePass: false,
    rarity: 'Low',
    images: [
      'https://placehold.co/600x400?text=Fortnite+Account+3',
      'https://placehold.co/600x400?text=Inventory+3',
    ],
    description: 'Affordable Fortnite account perfect for beginners. Includes 12 popular skins and 300 V-Bucks. Level 25 and ready to play!',
    seller: {
      id: 'USR003',
      username: 'GameDeals',
      avatar: 'https://i.pravatar.cc/100?u=22',
      totalSold: 28,
      joinedDate: '2023-02-18T11:20:00Z'
    },
    created: '2023-11-15T11:10:00Z',
    status: 'pending',
  },
];

// Format date for display
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString();
};
