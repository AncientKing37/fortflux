
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import CustomTooltip from './CustomTooltip';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  platformFee: number;
  escrowFee: number;
  buyer: string;
  seller: string;
  escrowAgent: string;
  listing: string;
}

interface TransactionsTabProps {
  recentTransactionsData: Transaction[];
  formattedFeeData: any[];
  formatDate: (dateString: string) => string;
}

const TransactionsTab: React.FC<TransactionsTabProps> = ({ 
  recentTransactionsData, 
  formattedFeeData,
  formatDate 
}) => {
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest completed transactions with fee breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Platform Fee</TableHead>
                  <TableHead>Escrow Fee</TableHead>
                  <TableHead className="hidden xl:table-cell">Buyer</TableHead>
                  <TableHead className="hidden xl:table-cell">Seller</TableHead>
                  <TableHead className="hidden lg:table-cell">Escrow Agent</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactionsData.length > 0 ? (
                  recentTransactionsData.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>${transaction.platformFee.toFixed(2)}</TableCell>
                      <TableCell>${transaction.escrowFee.toFixed(2)}</TableCell>
                      <TableCell className="hidden xl:table-cell">{transaction.buyer}</TableCell>
                      <TableCell className="hidden xl:table-cell">{transaction.seller}</TableCell>
                      <TableCell className="hidden lg:table-cell">{transaction.escrowAgent}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Transaction Volume</CardTitle>
            <CardDescription>Total transaction amount by day</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={formattedFeeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="totalVolume" 
                  name="Transaction Volume ($)" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Fee to Volume Ratio</CardTitle>
            <CardDescription>Percentage of fees from total transaction volume</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={formattedFeeData.map(item => {
                  const totalFees = typeof item.totalFees === 'number' ? item.totalFees : 0;
                  const totalVolume = typeof item.totalVolume === 'number' && item.totalVolume !== 0 ? item.totalVolume : 1;
                  
                  const ratio = (totalFees / totalVolume) * 100;
                  return {
                    ...item,
                    feeRatio: Number(ratio.toFixed(2))
                  };
                })}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[4, 8]} />
                <Tooltip content={<CustomTooltip />} />
                <Line 
                  type="monotone" 
                  dataKey="feeRatio" 
                  name="Fee Ratio (%)" 
                  stroke="#82ca9d" 
                  strokeWidth={2}
                  dot={{ fill: '#82ca9d', r: 4 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Composition by Transaction</CardTitle>
          <CardDescription>Breakdown of platform and escrow fees for recent transactions</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={recentTransactionsData.map(tx => ({
                id: tx.id,
                listing: tx.listing.substring(0, 20) + (tx.listing.length > 20 ? '...' : ''),
                platformFee: tx.platformFee,
                escrowFee: tx.escrowFee
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="platformFee" name="Platform Fee ($)" stackId="a" fill="#8884d8" />
              <Bar dataKey="escrowFee" name="Escrow Fee ($)" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsTab;
