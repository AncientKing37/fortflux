
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts';
import { 
  Activity, 
  DollarSign, 
  Users, 
  ListPlus, 
  ShoppingBag, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  RefreshCcw,
  Timer
} from 'lucide-react';

// Mock data for analytics
const dailySalesData = [
  { date: '2023-11-01', sales: 2500, transactions: 15 },
  { date: '2023-11-02', sales: 3200, transactions: 19 },
  { date: '2023-11-03', sales: 2800, transactions: 17 },
  { date: '2023-11-04', sales: 4500, transactions: 28 },
  { date: '2023-11-05', sales: 4200, transactions: 25 },
  { date: '2023-11-06', sales: 3800, transactions: 22 },
  { date: '2023-11-07', sales: 5100, transactions: 31 },
  { date: '2023-11-08', sales: 4600, transactions: 27 },
  { date: '2023-11-09', sales: 5500, transactions: 34 },
  { date: '2023-11-10', sales: 5200, transactions: 32 },
  { date: '2023-11-11', sales: 4900, transactions: 30 },
  { date: '2023-11-12', sales: 6300, transactions: 38 },
  { date: '2023-11-13', sales: 6100, transactions: 36 },
  { date: '2023-11-14', sales: 7200, transactions: 43 },
];

const userActivityData = [
  { date: '2023-11-01', active: 320, new: 45 },
  { date: '2023-11-02', active: 332, new: 42 },
  { date: '2023-11-03', active: 345, new: 48 },
  { date: '2023-11-04', active: 360, new: 53 },
  { date: '2023-11-05', active: 375, new: 58 },
  { date: '2023-11-06', active: 392, new: 62 },
  { date: '2023-11-07', active: 410, new: 65 },
  { date: '2023-11-08', active: 430, new: 72 },
  { date: '2023-11-09', active: 445, new: 68 },
  { date: '2023-11-10', active: 462, new: 74 },
  { date: '2023-11-11', active: 475, new: 70 },
  { date: '2023-11-12', active: 490, new: 75 },
  { date: '2023-11-13', active: 510, new: 82 },
  { date: '2023-11-14', active: 532, new: 88 },
];

const listingsData = [
  { date: '2023-11-01', created: 28, sold: 15 },
  { date: '2023-11-02', created: 32, sold: 19 },
  { date: '2023-11-03', created: 25, sold: 17 },
  { date: '2023-11-04', created: 35, sold: 28 },
  { date: '2023-11-05', created: 30, sold: 25 },
  { date: '2023-11-06', created: 27, sold: 22 },
  { date: '2023-11-07', created: 38, sold: 31 },
  { date: '2023-11-08', created: 34, sold: 27 },
  { date: '2023-11-09', created: 42, sold: 34 },
  { date: '2023-11-10', created: 38, sold: 32 },
  { date: '2023-11-11', created: 36, sold: 30 },
  { date: '2023-11-12', created: 45, sold: 38 },
  { date: '2023-11-13', created: 42, sold: 36 },
  { date: '2023-11-14', created: 50, sold: 43 },
];

const topSellersData = [
  { name: 'FortniteTrader', sales: 26500, transactions: 28 },
  { name: 'RareSkins', sales: 18900, transactions: 20 },
  { name: 'OGCollector', sales: 15750, transactions: 15 },
  { name: 'GameDeals', sales: 14200, transactions: 35 },
  { name: 'EpicSeller', sales: 12800, transactions: 18 },
];

const escrowPerformanceData = [
  { name: 'EscrowAdmin1', responseTime: 15, completedDeals: 45, successRate: 98 },
  { name: 'EscrowPro', responseTime: 12, completedDeals: 38, successRate: 100 },
  { name: 'SecureEscrow', responseTime: 18, completedDeals: 32, successRate: 97 },
  { name: 'TrustedAgent', responseTime: 22, completedDeals: 28, successRate: 96 },
];

const categoryDistributionData = [
  { name: 'Rare', value: 35 },
  { name: 'OG', value: 25 },
  { name: 'Battle Pass', value: 20 },
  { name: 'Budget', value: 15 },
  { name: 'Special', value: 5 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A569BD'];

// Custom tooltip for charts
const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border rounded-md shadow-sm">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('14d');
  const [analyticTab, setAnalyticTab] = useState('overview');

  // Format chart data with proper dates
  const formattedSalesData = dailySalesData.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  const formattedUserData = userActivityData.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  const formattedListingsData = listingsData.map(item => ({
    ...item,
    date: formatDate(item.date)
  }));

  // Calculate summary statistics
  const totalSales = dailySalesData.reduce((sum, item) => sum + item.sales, 0);
  const totalTransactions = dailySalesData.reduce((sum, item) => sum + item.transactions, 0);
  const avgSaleValue = totalSales / totalTransactions;
  
  const totalActiveUsers = userActivityData[userActivityData.length - 1].active;
  const totalNewUsers = userActivityData.reduce((sum, item) => sum + item.new, 0);
  
  const totalListingsCreated = listingsData.reduce((sum, item) => sum + item.created, 0);
  const totalListingsSold = listingsData.reduce((sum, item) => sum + item.sold, 0);
  const sellThroughRate = (totalListingsSold / totalListingsCreated) * 100;

  // Calculate growth
  const previousPeriodSales = dailySalesData.slice(0, 7).reduce((sum, item) => sum + item.sales, 0);
  const currentPeriodSales = dailySalesData.slice(7).reduce((sum, item) => sum + item.sales, 0);
  const salesGrowth = ((currentPeriodSales - previousPeriodSales) / previousPeriodSales) * 100;

  const previousPeriodUsers = userActivityData.slice(0, 7).reduce((sum, item) => sum + item.new, 0);
  const currentPeriodUsers = userActivityData.slice(7).reduce((sum, item) => sum + item.new, 0);
  const userGrowth = ((currentPeriodUsers - previousPeriodUsers) / previousPeriodUsers) * 100;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into your marketplace performance.</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="14d">Last 14 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="90d">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toLocaleString()}</div>
            <div className="flex items-center mt-1">
              {salesGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <p className="text-xs">
                <span className={salesGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                  {salesGrowth >= 0 ? "+" : ""}{salesGrowth.toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs previous period</span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActiveUsers}</div>
            <div className="flex items-center mt-1">
              {userGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <p className="text-xs">
                <span className={userGrowth >= 0 ? "text-green-500" : "text-red-500"}>
                  {userGrowth >= 0 ? "+" : ""}{userGrowth.toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs previous period</span>
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Listings Created</CardTitle>
            <ListPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListingsCreated}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalListingsSold} listings sold ({sellThroughRate.toFixed(1)}% sell-through)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Sale Value</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${avgSaleValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalTransactions} total transactions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={analyticTab} onValueChange={setAnalyticTab} className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
          <TabsTrigger value="sales" className="flex-1">Sales</TabsTrigger>
          <TabsTrigger value="users" className="flex-1">Users</TabsTrigger>
          <TabsTrigger value="listings" className="flex-1">Listings</TabsTrigger>
          <TabsTrigger value="escrow" className="flex-1">Escrow</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Daily revenue and transactions</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={formattedSalesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar yAxisId="left" dataKey="sales" name="Sales ($)" fill="#8884d8" />
                    <Line yAxisId="right" type="monotone" dataKey="transactions" name="Transactions" stroke="#ff7300" />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>User Activity</CardTitle>
                <CardDescription>Active and new users over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={formattedUserData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="active" name="Active Users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                    <Area type="monotone" dataKey="new" name="New Users" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Top Sellers</CardTitle>
                <CardDescription>Highest performing sellers by revenue</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topSellersData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 50, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="sales" name="Sales ($)" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Listings Activity</CardTitle>
                <CardDescription>Created vs. sold listings</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={formattedListingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar dataKey="created" name="Listings Created" fill="#8884d8" />
                    <Bar dataKey="sold" name="Listings Sold" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Escrow Performance</CardTitle>
                <CardDescription>Response time and success rate by agent</CardDescription>
              </CardHeader>
              <CardContent className="h-80 overflow-x-auto">
                <div className="min-w-[500px]">
                  <ResponsiveContainer width="100%" height={300}>
                    <ComposedChart
                      data={escrowPerformanceData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      <Bar yAxisId="left" dataKey="completedDeals" name="Completed Deals" fill="#8884d8" />
                      <Line yAxisId="right" type="monotone" dataKey="responseTime" name="Avg. Response Time (min)" stroke="#ff7300" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Listing Categories</CardTitle>
                <CardDescription>Distribution by category</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Breakdown</CardTitle>
              <CardDescription>Detailed view of sales and revenue metrics</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={formattedSalesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" name="Revenue ($)" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Top Performing Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topSellersData.map((seller, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs">
                          {i + 1}
                        </div>
                        <span className="font-medium">{seller.name}</span>
                      </div>
                      <span>${seller.sales.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Sale Value:</span>
                    <span className="font-medium">${avgSaleValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Daily Sales:</span>
                    <span className="font-medium">${(totalSales / 14).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Transactions/Day:</span>
                    <span className="font-medium">{(totalTransactions / 14).toFixed(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee Revenue:</span>
                    <span className="font-medium">${(totalSales * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Escrow Fee Revenue:</span>
                    <span className="font-medium">${(totalSales * 0.03).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Growth Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Sales Growth:</span>
                    <div className="flex items-center">
                      {salesGrowth >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={salesGrowth >= 0 ? "text-green-500 font-medium" : "text-red-500 font-medium"}>
                        {salesGrowth >= 0 ? "+" : ""}{salesGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Transaction Growth:</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">+12.5%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Avg. Value Growth:</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">+5.2%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Fee Revenue Growth:</span>
                    <div className="flex items-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-500 font-medium">+18.3%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>New users and active users over time</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={formattedUserData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="active" name="Active Users" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="new" name="New Users" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>User Demographics</CardTitle>
                <CardDescription>Breakdown of user base</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Buyers', value: 65 },
                        { name: 'Sellers', value: 25 },
                        { name: 'Both', value: 10 },
                      ]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#0088FE" />
                      <Cell fill="#00C49F" />
                      <Cell fill="#FFBB28" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Retention</CardTitle>
                <CardDescription>Return rate over time</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { week: 'Week 1', rate: 100 },
                      { week: 'Week 2', rate: 85 },
                      { week: 'Week 3', rate: 75 },
                      { week: 'Week 4', rate: 68 },
                      { week: 'Week 8', rate: 52 },
                      { week: 'Week 12', rate: 45 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="rate" name="Retention Rate (%)" stroke="#8884d8" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Listings Tab */}
        <TabsContent value="listings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Listing Activity</CardTitle>
              <CardDescription>Created vs. sold listings over time</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={formattedListingsData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="created" name="Listings Created" fill="#8884d8" />
                  <Bar dataKey="sold" name="Listings Sold" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Listings by Category</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Average Listing Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Price:</span>
                    <span className="font-medium">${avgSaleValue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Time to Sell:</span>
                    <span className="font-medium">3.2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sell-through Rate:</span>
                    <span className="font-medium">{sellThroughRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Avg. Views per Listing:</span>
                    <span className="font-medium">120</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Conversion Rate:</span>
                    <span className="font-medium">5.8%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Price Ranges</CardTitle>
              </CardHeader>
              <CardContent className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { range: '$0-$50', count: 150 },
                      { range: '$50-$100', count: 215 },
                      { range: '$100-$200', count: 180 },
                      { range: '$200-$500', count: 125 },
                      { range: '$500+', count: 45 },
                    ]}
                    margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="range" type="category" width={80} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" name="Listings" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Escrow Tab */}
        <TabsContent value="escrow" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Escrow Performance</CardTitle>
              <CardDescription>Key metrics for escrow service</CardDescription>
            </CardHeader>
            <CardContent className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={escrowPerformanceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="completedDeals" name="Completed Deals" fill="#8884d8" />
                  <Line yAxisId="right" type="monotone" dataKey="responseTime" name="Avg. Response Time (min)" stroke="#ff7300" />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">Avg. Response Time</CardTitle>
                <Clock className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-500">16.8 min</div>
                  <p className="text-xs text-muted-foreground">Average time for escrow agent to respond to a new transaction</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Fastest Agent</span>
                    <span className="text-sm font-medium">EscrowPro (12 min)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">Dispute Resolution</CardTitle>
                <Activity className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-500">98.2%</div>
                  <p className="text-xs text-muted-foreground">Disputes resolved without refund or escalation</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg. Resolution Time</span>
                    <span className="text-sm font-medium">1.2 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">Transaction Volume</CardTitle>
                <Timer className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-purple-500">6.3 hrs</div>
                  <p className="text-xs text-muted-foreground">Average time to complete a transaction</p>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Transactions</span>
                    <span className="text-sm font-medium">{totalTransactions} this period</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
