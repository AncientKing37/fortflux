
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Crown } from 'lucide-react';
import { getEscrowRankByDeals, EscrowRank, RankInfo } from '@/utils/rankSystem';

interface EscrowRankBadgeProps {
  dealCount: number;
  showTooltip?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const EscrowRankBadge: React.FC<EscrowRankBadgeProps> = ({ 
  dealCount, 
  showTooltip = true,
  size = 'md'
}) => {
  const rank = getEscrowRankByDeals(dealCount);
  
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const crownSizes = {
    sm: 'h-3 w-3 mr-1',
    md: 'h-4 w-4 mr-1',
    lg: 'h-5 w-5 mr-1',
  };
  
  const badge = (
    <Badge className={`${rank.color} ${rank.textColor} ${sizeClasses[size]}`}>
      <Crown className={crownSizes[size]} />
      {rank.name}
    </Badge>
  );
  
  if (!showTooltip) return badge;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1 p-1">
            <p className="font-semibold">{rank.name} Escrow</p>
            <p className="text-xs">Completed {dealCount.toLocaleString()} deals</p>
            <p className="text-xs">Fee: ${rank.feePerDeal?.toFixed(2)} per transaction</p>
            {rank.name !== 'Exclusive' && (
              <p className="text-xs text-muted-foreground">
                {rank.name === 'Bronze' 
                  ? `Need ${500 - dealCount} more deals for Gold rank`
                  : `Progress to next rank: ${dealCount}/${getNextRankMinDeals(rank.name)}`}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const getNextRankMinDeals = (currentRank: EscrowRank): number => {
  switch (currentRank) {
    case 'Bronze': return 500;
    case 'Gold': return 1000;
    case 'Platinum I': return 2500;
    case 'Platinum II': return 5000;
    case 'Platinum III': return 10000;
    case 'Exclusive': return Infinity;
  }
};

export default EscrowRankBadge;
