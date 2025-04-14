export type UserRole = 'buyer' | 'seller' | 'escrow' | 'support' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  vouchCount: number;
  balance: number;
  description?: string;
  wallet_address?: string;
  ltc_wallet_address?: string;
  preferred_crypto?: string;
}

export interface FortniteAccount {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  skins: number;
  vBucks: number;
  battlePass: boolean;
  level: number;
  featured: boolean;
  status: 'available' | 'pending' | 'sold';
  createdAt: Date;
}

export interface Listing {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  status: 'available' | 'pending' | 'sold';
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  accountId: string;
  sellerId: string;
  buyerId: string;
  escrowId?: string;
  amount: number;
  status: 'pending' | 'in_escrow' | 'completed' | 'cancelled' | 'disputed';
  cryptoType: string;
  cryptoAmount: number;
  escrowFee?: number;
  platformFee?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SupabaseTransaction {
  id: string;
  account_id: string;
  seller_id: string;
  buyer_id: string;
  escrow_id?: string;
  amount: number;
  status: string;
  crypto_type: string;
  crypto_amount: number;
  escrow_fee?: number;
  platform_fee?: number;
  created_at: string;
  updated_at: string;
}

export interface SupabaseTransactionWithRelations extends SupabaseTransaction {
  account?: {
    title: string;
  } | null;
  seller?: {
    username: string;
    avatar_url?: string;
    role: string;
    vouch_count: number;
  } | null | any;
  escrow?: {
    username: string;
    avatar_url?: string;
    role: string;
    vouch_count: number;
  } | null | any;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  transactionId?: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface SupabaseMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  transaction_id?: string;
  content: string;
  read: boolean;
  created_at: string;
}

export interface Vouch {
  id: string;
  fromUserId: string;
  toUserId: string;
  transactionId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface SupabaseVouch {
  id: string;
  from_user_id: string;
  to_user_id: string;
  transaction_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}
