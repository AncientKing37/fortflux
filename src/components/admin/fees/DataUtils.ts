
// Mock data for platform fees
export const platformFeeData = [
  { date: '2023-11-01', platformFees: 125.50, escrowFees: 38.20, totalFees: 163.70, totalVolume: 2500.00 },
  { date: '2023-11-02', platformFees: 160.00, escrowFees: 48.00, totalFees: 208.00, totalVolume: 3200.00 },
  { date: '2023-11-03', platformFees: 140.00, escrowFees: 42.00, totalFees: 182.00, totalVolume: 2800.00 },
  { date: '2023-11-04', platformFees: 225.00, escrowFees: 67.50, totalFees: 292.50, totalVolume: 4500.00 },
  { date: '2023-11-05', platformFees: 210.00, escrowFees: 63.00, totalFees: 273.00, totalVolume: 4200.00 },
  { date: '2023-11-06', platformFees: 190.00, escrowFees: 57.00, totalFees: 247.00, totalVolume: 3800.00 },
  { date: '2023-11-07', platformFees: 255.00, escrowFees: 76.50, totalFees: 331.50, totalVolume: 5100.00 },
  { date: '2023-11-08', platformFees: 230.00, escrowFees: 69.00, totalFees: 299.00, totalVolume: 4600.00 },
  { date: '2023-11-09', platformFees: 275.00, escrowFees: 82.50, totalFees: 357.50, totalVolume: 5500.00 },
  { date: '2023-11-10', platformFees: 260.00, escrowFees: 78.00, totalFees: 338.00, totalVolume: 5200.00 },
  { date: '2023-11-11', platformFees: 245.00, escrowFees: 73.50, totalFees: 318.50, totalVolume: 4900.00 },
  { date: '2023-11-12', platformFees: 315.00, escrowFees: 94.50, totalFees: 409.50, totalVolume: 6300.00 },
  { date: '2023-11-13', platformFees: 305.00, escrowFees: 91.50, totalFees: 396.50, totalVolume: 6100.00 },
  { date: '2023-11-14', platformFees: 360.00, escrowFees: 108.00, totalFees: 468.00, totalVolume: 7200.00 },
];

// Mock data for escrow agent earnings
export const escrowAgentData = [
  { 
    id: 'agent1',
    name: 'EscrowAdmin1',
    avatar: 'https://i.pravatar.cc/100?u=70',
    earnings: 285.50,
    transactions: 35,
    responseTime: 15,
    successRate: 98,
    rank: 'Gold'
  },
  { 
    id: 'agent2',
    name: 'EscrowPro',
    avatar: 'https://i.pravatar.cc/100?u=71',
    earnings: 312.75,
    transactions: 38,
    responseTime: 12,
    successRate: 100,
    rank: 'Platinum'
  },
  { 
    id: 'agent3',
    name: 'SecureEscrow',
    avatar: 'https://i.pravatar.cc/100?u=72',
    earnings: 195.40,
    transactions: 24,
    responseTime: 18,
    successRate: 97,
    rank: 'Silver'
  },
  { 
    id: 'agent4',
    name: 'TrustedAgent',
    avatar: 'https://i.pravatar.cc/100?u=73',
    earnings: 170.80,
    transactions: 21,
    responseTime: 22,
    successRate: 96,
    rank: 'Bronze'
  },
];

// Mock data for top fee categories
export const feeSourcesData = [
  { name: 'Rare Skins', value: 45 },
  { name: 'OG Accounts', value: 30 },
  { name: 'Battle Pass', value: 15 },
  { name: 'Budget Accounts', value: 10 },
];

// Mock data for monthly earnings
export const monthlyEarningsData = [
  { month: 'Jan', fees: 2800, volume: 56000 },
  { month: 'Feb', fees: 3200, volume: 64000 },
  { month: 'Mar', fees: 4100, volume: 82000 },
  { month: 'Apr', fees: 3800, volume: 76000 },
  { month: 'May', fees: 4500, volume: 90000 },
  { month: 'Jun', fees: 5200, volume: 104000 },
  { month: 'Jul', fees: 6100, volume: 122000 },
  { month: 'Aug', fees: 5800, volume: 116000 },
  { month: 'Sep', fees: 6500, volume: 130000 },
  { month: 'Oct', fees: 7200, volume: 144000 },
  { month: 'Nov', fees: 3295, volume: 65900 },
];

// Mock data for recent transactions
export const recentTransactionsData = [
  { 
    id: 'tx1',
    date: '2023-11-15T10:30:00Z',
    amount: 120.00,
    platformFee: 6.00,
    escrowFee: 3.60,
    buyer: 'GameCollector',
    seller: 'FortniteTrader',
    escrowAgent: 'EscrowPro',
    listing: 'Rare Fortnite Account with 50+ Skins'
  },
  { 
    id: 'tx2',
    date: '2023-11-15T09:45:00Z',
    amount: 85.50,
    platformFee: 4.28,
    escrowFee: 2.57,
    buyer: 'NewPlayer',
    seller: 'CasualGamer',
    escrowAgent: 'TrustedAgent',
    listing: 'Budget Fortnite Account - Great for Beginners'
  },
  { 
    id: 'tx3',
    date: '2023-11-15T08:15:00Z',
    amount: 299.99,
    platformFee: 15.00,
    escrowFee: 9.00,
    buyer: 'CollectiblesHunter',
    seller: 'OGSeller',
    escrowAgent: 'EscrowAdmin1',
    listing: 'OG Fortnite Account - Season 1 Player'
  },
  { 
    id: 'tx4',
    date: '2023-11-14T16:20:00Z',
    amount: 175.25,
    platformFee: 8.76,
    escrowFee: 5.26,
    buyer: 'FortniteFan',
    seller: 'PremiumSeller',
    escrowAgent: 'SecureEscrow',
    listing: 'Fortnite Account with Rare Battle Pass Skins'
  },
  { 
    id: 'tx5',
    date: '2023-11-14T14:50:00Z',
    amount: 89.99,
    platformFee: 4.50,
    escrowFee: 2.70,
    buyer: 'GamerKid',
    seller: 'AccountDealer',
    escrowAgent: 'EscrowAdmin1',
    listing: 'Fortnite Account with V-Bucks Bundle'
  },
];

// Format date for display
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
