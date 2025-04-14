
import { User, FortniteAccount, Transaction, Message, Vouch } from "../types";

// Mock Users
export const mockUsers: User[] = [
  {
    id: "u1",
    username: "epicbuyer",
    email: "buyer@example.com",
    role: "buyer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=epicbuyer",
    createdAt: new Date("2023-01-15"),
    vouchCount: 12,
    balance: 500,
  },
  {
    id: "u2",
    username: "sellerking",
    email: "seller@example.com",
    role: "seller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sellerking",
    createdAt: new Date("2022-11-20"),
    vouchCount: 47,
    balance: 2300,
  },
  {
    id: "u3",
    username: "escrowpro",
    email: "escrow@example.com",
    role: "escrow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=escrowpro",
    createdAt: new Date("2022-09-05"),
    vouchCount: 153,
    balance: 1500,
  },
];

// Mock Fortnite Accounts
export const mockAccounts: FortniteAccount[] = [
  {
    id: "a1",
    sellerId: "u2",
    title: "OG Renegade Raider Account",
    description: "Season 1 account with Renegade Raider, Black Knight, and 100+ skins. Full access email included.",
    price: 750,
    images: [
      "https://placehold.co/600x400/0d87f8/white?text=Fortnite+Account+1",
      "https://placehold.co/600x400/8c13fe/white?text=Fortnite+Account+1+Skins"
    ],
    rarity: "legendary",
    skins: 132,
    vBucks: 2500,
    battlePass: true,
    level: 350,
    featured: true,
    status: "available",
    createdAt: new Date("2023-12-01"),
  },
  {
    id: "a2",
    sellerId: "u2",
    title: "Rare Exclusive Skins Account",
    description: "Account with Travis Scott, Marvel skins, and many limited editions. Original owner.",
    price: 500,
    images: [
      "https://placehold.co/600x400/8c13fe/white?text=Fortnite+Account+2",
      "https://placehold.co/600x400/0d87f8/white?text=Fortnite+Account+2+Skins"
    ],
    rarity: "epic",
    skins: 87,
    vBucks: 1200,
    battlePass: true,
    level: 220,
    featured: true,
    status: "available",
    createdAt: new Date("2023-12-15"),
  },
  {
    id: "a3",
    sellerId: "u2",
    title: "Budget Account with Rare Skins",
    description: "Great starter account with some rare skins from Season 5-8.",
    price: 150,
    images: [
      "https://placehold.co/600x400/0d87f8/white?text=Fortnite+Account+3"
    ],
    rarity: "rare",
    skins: 45,
    vBucks: 300,
    battlePass: false,
    level: 120,
    featured: false,
    status: "available",
    createdAt: new Date("2024-01-10"),
  },
  {
    id: "a4",
    sellerId: "u2",
    title: "Maxed Battle Pass Account",
    description: "All battle passes completed from Season 7-19. Many exclusive items.",
    price: 350,
    images: [
      "https://placehold.co/600x400/8c13fe/white?text=Fortnite+Account+4"
    ],
    rarity: "epic",
    skins: 98,
    vBucks: 800,
    battlePass: true,
    level: 275,
    featured: false,
    status: "pending",
    createdAt: new Date("2024-02-05"),
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: "t1",
    accountId: "a4",
    sellerId: "u2",
    buyerId: "u1",
    escrowId: "u3",
    amount: 350,
    status: "in_escrow",
    cryptoType: "ETH",
    cryptoAmount: 0.13,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-01"),
  },
  {
    id: "t2",
    accountId: "a1",
    sellerId: "u2",
    buyerId: "u1",
    escrowId: "u3",
    amount: 750,
    status: "completed",
    cryptoType: "BTC",
    cryptoAmount: 0.018,
    createdAt: new Date("2024-03-15"),
    updatedAt: new Date("2024-03-18"),
  },
];

// Mock Messages
export const mockMessages: Message[] = [
  {
    id: "m1",
    senderId: "u1",
    receiverId: "u2",
    transactionId: "t1",
    content: "Hi, is this account still available?",
    read: true,
    createdAt: new Date("2024-04-01T10:30:00"),
  },
  {
    id: "m2",
    senderId: "u2",
    receiverId: "u1",
    transactionId: "t1",
    content: "Yes, it's available. Let me know if you're interested!",
    read: true,
    createdAt: new Date("2024-04-01T10:45:00"),
  },
  {
    id: "m3",
    senderId: "u1",
    receiverId: "u2",
    transactionId: "t1",
    content: "Great! I'll buy it through escrow now.",
    read: true,
    createdAt: new Date("2024-04-01T11:00:00"),
  },
  {
    id: "m4",
    senderId: "u3",
    receiverId: "u1",
    transactionId: "t1",
    content: "I've received your payment. Working with the seller to transfer the account.",
    read: false,
    createdAt: new Date("2024-04-01T12:30:00"),
  },
];

// Mock Vouches
export const mockVouches: Vouch[] = [
  {
    id: "v1",
    fromUserId: "u1",
    toUserId: "u2",
    transactionId: "t2",
    rating: 5,
    comment: "Great seller! Smooth transaction and account was exactly as described.",
    createdAt: new Date("2024-03-18"),
  },
  {
    id: "v2",
    fromUserId: "u2",
    toUserId: "u1",
    transactionId: "t2",
    rating: 5,
    comment: "Easy to work with. Payment was prompt.",
    createdAt: new Date("2024-03-18"),
  },
];

// Create a mock current user for testing
export const currentUser = mockUsers[0]; // Default to buyer for testing
