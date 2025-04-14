
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from './CustomTooltip';

interface OverviewTabProps {
  formattedFeeData: any[];
  totalPlatformFees: number;
  totalEscrowFees: number;
  feeSourcesData: any[];
  monthlyEarningsData: any[];
}

const OverviewTab: React.FC<OverviewTabProps> = ({
  formattedFeeData,
  totalPlatformFees,
  totalEscrowFees,
  feeSourcesData,
  monthlyEarningsData
}) => {
  // Colors for pie chart
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <div className="space-y-4 mt-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Fee Revenue</CardTitle>
            <CardDescription>Platform and escrow fees over time</CardDescription>
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

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Fee Breakdown</CardTitle>
            <CardDescription>Distribution of fee sources</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Platform Fees', value: totalPlatformFees },
                    { name: 'Escrow Fees', value: totalEscrowFees }
                  ]}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#8884d8" />
                  <Cell fill="#82ca9d" />
                </Pie>
                <Tooltip formatter={(value) => {
                  // Ensure value is a number before calling toFixed
                  return typeof value === 'number' 
                    ? `$${value.toFixed(2)}` 
                    : `$${value}`;
                }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Fee Sources</CardTitle>
            <CardDescription>Fees by account category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={feeSourcesData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip formatter={(value) => {
                  // Ensure value is a number before calling toFixed
                  return typeof value === 'number' 
                    ? `${value.toFixed(2)}%`
                    : `${value}%`;
                }} />
                <Bar dataKey="value" name="Percentage" fill="#8884d8">
                  {feeSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Earnings</CardTitle>
            <CardDescription>Year-to-date fee revenue</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={monthlyEarningsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="fees" name="Total Fees ($)" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OverviewTab;
