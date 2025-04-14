
export interface Listing {
  id: string;
  title: string;
  price: number;
  rarity: string;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  skins: number;
  level: number;
  vBucks?: number;
  battlePass?: boolean;
  images?: string[];
  seller: {
    id: string;
    username: string;
    avatar: string;
    totalSold?: number;
    joinedDate?: string;
  };
  createdAt: Date;
}

export const rarityStyles: Record<string, { color: string; border?: string }> = {
  common: { color: "bg-gray-500" },
  uncommon: { color: "bg-green-500" },
  rare: { color: "bg-blue-500" },
  epic: { color: "bg-purple-500" },
  legendary: { color: "bg-orange-500" },
  High: { color: "bg-blue-500" },
  "Very High": { color: "bg-purple-500" },
  Low: { color: "bg-green-500" },
  Medium: { color: "bg-yellow-500" },
  Default: { color: "bg-gray-500" }
};
