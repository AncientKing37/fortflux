
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Wallet, CircleDollarSign, BarChart as BarChartIcon } from 'lucide-react';

interface StatsCardsProps {
  totalFees: number;
  totalVolume: number;
  totalPlatformFees: number;
  totalEscrowFees: number;
  platformFeePercentage: number;
  escrowFeePercentage: number;
  avgTransactionSize: number;
  platformFeeRate: number;
}

const StatsCards: React.FC<StatsCardsProps> = ({
  totalFees,
  totalVolume,
  totalPlatformFees,
  totalEscrowFees,
  platformFeePercentage,
  escrowFeePercentage,
  avgTransactionSize,
  platformFeeRate
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalFees.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            From ${totalVolume.toFixed(2)} total volume ({(totalFees / totalVolume * 100).toFixed(2)}%)
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalPlatformFees.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {platformFeePercentage.toFixed(1)}% of total fees
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Escrow Fees</CardTitle>
          <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalEscrowFees.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {escrowFeePercentage.toFixed(1)}% of total fees
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Transaction</CardTitle>
          <BarChartIcon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${avgTransactionSize.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Platform fee: {platformFeeRate.toFixed(1)}%
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
