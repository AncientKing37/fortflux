
export type SellerRank = 'Bronze' | 'Gold' | 'Platinum I' | 'Platinum II' | 'Platinum III' | 'Exclusive';
export type EscrowRank = SellerRank; // Add EscrowRank type

export interface RankInfo {
  name: SellerRank;
  minDeals: number;
  color: string;
  textColor: string;
  feePerDeal?: number; // Add feePerDeal property
}

export const SELLER_RANKS: RankInfo[] = [
  {
    name: 'Bronze',
    minDeals: 0,
    color: 'bg-amber-700',
    textColor: 'text-white'
  },
  {
    name: 'Gold',
    minDeals: 500,
    color: 'bg-yellow-500',
    textColor: 'text-white'
  },
  {
    name: 'Platinum I',
    minDeals: 1000,
    color: 'bg-slate-300',
    textColor: 'text-black'
  },
  {
    name: 'Platinum II',
    minDeals: 2500,
    color: 'bg-slate-400',
    textColor: 'text-black'
  },
  {
    name: 'Platinum III',
    minDeals: 5000,
    color: 'bg-slate-500',
    textColor: 'text-white'
  },
  {
    name: 'Exclusive',
    minDeals: 10000,
    color: 'bg-purple-600',
    textColor: 'text-white'
  }
];

export const ESCROW_RANKS: RankInfo[] = [
  {
    name: 'Bronze',
    minDeals: 0,
    color: 'bg-amber-700',
    textColor: 'text-white',
    feePerDeal: 0.20
  },
  {
    name: 'Gold',
    minDeals: 500,
    color: 'bg-yellow-500',
    textColor: 'text-white',
    feePerDeal: 0.25
  },
  {
    name: 'Platinum I',
    minDeals: 1000,
    color: 'bg-slate-300',
    textColor: 'text-black',
    feePerDeal: 0.30
  },
  {
    name: 'Platinum II',
    minDeals: 2500,
    color: 'bg-slate-400',
    textColor: 'text-black',
    feePerDeal: 0.40
  },
  {
    name: 'Platinum III',
    minDeals: 5000,
    color: 'bg-slate-500',
    textColor: 'text-white',
    feePerDeal: 0.75
  },
  {
    name: 'Exclusive',
    minDeals: 10000,
    color: 'bg-purple-600',
    textColor: 'text-white',
    feePerDeal: 2.00
  }
];

export const getEscrowRankByDeals = (dealCount: number): RankInfo => {
  // Find the highest rank the user qualifies for
  for (let i = ESCROW_RANKS.length - 1; i >= 0; i--) {
    if (dealCount >= ESCROW_RANKS[i].minDeals) {
      return ESCROW_RANKS[i];
    }
  }
  
  // Default to Bronze if no rank is found (should never happen)
  return ESCROW_RANKS[0];
};

export const getSellerRankByDeals = (dealCount: number): RankInfo => {
  // Find the highest rank the user qualifies for
  for (let i = SELLER_RANKS.length - 1; i >= 0; i--) {
    if (dealCount >= SELLER_RANKS[i].minDeals) {
      return SELLER_RANKS[i];
    }
  }
  
  // Default to Bronze if no rank is found (should never happen)
  return SELLER_RANKS[0];
};
