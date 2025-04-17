import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  BarChart2, 
  Users, 
  DollarSign, 
  Flag, 
  Percent, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Bell,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  MoreHorizontal
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';

const AdminDashboard: React.FC = () => {
  // Fetch dashboard analytics
  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: dashboardService.getDashboardAnalytics
  });

  // Fetch recent transactions
  const { data: recentTransactions } = useQuery({
    queryKey: ['recent-transactions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          *,
          buyer:buyer_id(username),
          seller:seller_id(username),
          account:account_id(title)
        `)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });

  // Fetch recent users
  const { data: recentUsers } = useQuery({
    queryKey: ['recent-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-black dark:text-white">Admin Dashboard</h2>
              <p className="text-yellow-500 dark:text-yellow-400">Loading dashboard data...</p>
            </div>
            <Button variant="outline" size="sm" disabled className="border-yellow-500/50">
              <RefreshCw className="h-4 w-4 mr-2 animate-spin text-yellow-500" />
              Refreshing...
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <Card key={i} className="animate-pulse bg-white dark:bg-black border border-yellow-500/20">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-24 bg-yellow-100 dark:bg-yellow-900/20" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12 mb-2 bg-yellow-100 dark:bg-yellow-900/20" />
                  <Skeleton className="h-4 w-32 bg-yellow-100 dark:bg-yellow-900/20" />
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="col-span-1 animate-pulse bg-white dark:bg-black border border-yellow-500/20">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-yellow-100 dark:bg-yellow-900/20" />
              </CardHeader>
              <CardContent className="h-80">
                <Skeleton className="h-full w-full bg-yellow-100 dark:bg-yellow-900/20" />
              </CardContent>
            </Card>
            
            <Card className="col-span-1 animate-pulse bg-white dark:bg-black border border-yellow-500/20">
              <CardHeader>
                <Skeleton className="h-6 w-48 bg-yellow-100 dark:bg-yellow-900/20" />
              </CardHeader>
              <CardContent className="h-80">
                <Skeleton className="h-full w-full bg-yellow-100 dark:bg-yellow-900/20" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Prepare data for charts
  const userRoleData = analytics?.users?.byRole 
    ? Object.entries(analytics.users.byRole).map(([name, value]) => ({ name, value }))
    : [];
    
  const transactionStatusData = analytics?.transactions?.byStatus
    ? Object.entries(analytics.transactions.byStatus).map(([name, value]) => ({ name, value }))
    : [];
    
  const COLORS = ['#EAB308', '#FBBF24', '#FCD34D', '#FDE68A', '#FEF3C7', '#FFFBEB'];

  // Calculate growth percentages
  const userGrowth = analytics?.users?.growth || 0;
  const transactionGrowth = analytics?.transactions?.growth || 0;
  const listingGrowth = analytics?.listings?.growth || 0;
  const disputeGrowth = analytics?.transactions?.disputeGrowth || 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-black dark:text-white">Admin Dashboard</h2>
            <p className="text-yellow-600 dark:text-yellow-400">Welcome back! Here's what's happening with your marketplace.</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => refetch()} 
              className="bg-white dark:bg-black border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="bg-white dark:bg-black border-yellow-500 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950"
            >
              <Link to="/admin/analytics">
                <BarChart2 className="h-4 w-4 mr-2" />
                Detailed Analytics
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white dark:bg-black shadow-sm hover:shadow-md transition-shadow border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Total Users</CardTitle>
              <Users className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black dark:text-white">{analytics?.users?.total || 0}</div>
              <div className="flex items-center mt-1">
                {userGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <p className="text-xs">
                  <span className={userGrowth >= 0 ? "text-yellow-500" : "text-red-500"}>
                    {userGrowth >= 0 ? "+" : ""}{userGrowth}%
                  </span>
                  <span className="text-yellow-600/70 dark:text-yellow-400/70 ml-1">from last month</span>
                </p>
              </div>
              <div className="mt-2">
                <Progress 
                  value={Math.min(100, (analytics?.users?.total || 0) / 1000 * 100)} 
                  className="h-2 bg-yellow-100 dark:bg-yellow-950"
                  indicatorClassName="bg-yellow-500"
                />
                <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                  {Math.min(1000, analytics?.users?.total || 0)} / 1000 users
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-black shadow-sm hover:shadow-md transition-shadow border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Active Listings</CardTitle>
              <BarChart className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black dark:text-white">{analytics?.listings?.byStatus?.available || 0}</div>
              <div className="flex items-center mt-1">
                {listingGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <p className="text-xs">
                  <span className={listingGrowth >= 0 ? "text-yellow-500" : "text-red-500"}>
                    {listingGrowth >= 0 ? "+" : ""}{listingGrowth}%
                  </span>
                  <span className="text-yellow-600/70 dark:text-yellow-400/70 ml-1">from last month</span>
                </p>
              </div>
              <div className="mt-2">
                <Progress value={Math.min(100, (analytics?.listings?.byStatus?.available || 0) / 500 * 100)} className="h-2 bg-yellow-100 dark:bg-yellow-950" />
                <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                  {analytics?.listings?.byStatus?.available || 0} / 500 listings
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-black shadow-sm hover:shadow-md transition-shadow border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Transaction Volume</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black dark:text-white">${analytics?.transactions?.totalValue?.toFixed(2) || '0.00'}</div>
              <div className="flex items-center mt-1">
                {transactionGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <p className="text-xs">
                  <span className={transactionGrowth >= 0 ? "text-yellow-500" : "text-red-500"}>
                    {transactionGrowth >= 0 ? "+" : ""}{transactionGrowth}%
                  </span>
                  <span className="text-yellow-600/70 dark:text-yellow-400/70 ml-1">from last month</span>
                </p>
              </div>
              <div className="mt-2">
                <Progress value={Math.min(100, (analytics?.transactions?.totalValue || 0) / 100000 * 100)} className="h-2 bg-yellow-100 dark:bg-yellow-950" />
                <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                  ${(analytics?.transactions?.totalValue || 0).toLocaleString()} / $100,000
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-black shadow-sm hover:shadow-md transition-shadow border-yellow-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Disputed Transactions</CardTitle>
              <Flag className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-black dark:text-white">{analytics?.transactions?.byStatus?.disputed || 0}</div>
              <div className="flex items-center mt-1">
                {disputeGrowth >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-yellow-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                )}
                <p className="text-xs">
                  <span className={disputeGrowth >= 0 ? "text-yellow-500" : "text-green-500"}>
                    {disputeGrowth >= 0 ? "+" : ""}{disputeGrowth}%
                  </span>
                  <span className="text-yellow-600/70 dark:text-yellow-400/70 ml-1">from last month</span>
                </p>
              </div>
              <div className="mt-2">
                <Progress 
                  value={Math.min(100, ((analytics?.transactions?.byStatus?.disputed || 0) / (analytics?.transactions?.total || 1)) * 100)} 
                  className="h-2 bg-yellow-100 dark:bg-yellow-950" 
                />
                <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">
                  {((analytics?.transactions?.byStatus?.disputed || 0) / (analytics?.transactions?.total || 1) * 100).toFixed(1)}% dispute rate
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white dark:bg-black shadow-sm hover:shadow-md transition-shadow border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">User Distribution</CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-400">Breakdown of users by role</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {userRoleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} users`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-black shadow-sm hover:shadow-md transition-shadow border-yellow-500/20">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">Transaction Status</CardTitle>
              <CardDescription className="text-yellow-600 dark:text-yellow-400">Distribution of transaction statuses</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={transactionStatusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {transactionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} transactions`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList className="bg-white dark:bg-black border-yellow-500/20">
            <TabsTrigger value="transactions" className="data-[state=active]:bg-yellow-50 dark:data-[state=active]:bg-gray-900 text-yellow-600 dark:text-yellow-400">Recent Transactions</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-yellow-50 dark:data-[state=active]:bg-gray-900 text-yellow-600 dark:text-yellow-400">New Users</TabsTrigger>
          </TabsList>
          
          <TabsContent value="transactions" className="mt-4">
            <Card className="bg-white dark:bg-black shadow-sm hover:shadow-md transition-shadow border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">Recent Transactions</CardTitle>
                <CardDescription className="text-yellow-600 dark:text-yellow-400">Latest marketplace transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {recentTransactions?.map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-yellow-500/20 bg-yellow-50/50 dark:bg-gray-900">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
                              {transaction.seller?.username?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-black dark:text-white">{transaction.account?.title || 'Unknown Account'}</p>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">
                              {transaction.seller?.username} → {transaction.buyer?.username}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-black dark:text-white">${transaction.amount?.toFixed(2)}</p>
                          <Badge 
                            variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                            className={transaction.status === 'completed' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100'}
                          >
                            {transaction.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="mt-4">
            <Card className="bg-white dark:bg-black shadow-sm hover:shadow-md transition-shadow border-yellow-500/20">
              <CardHeader>
                <CardTitle className="text-black dark:text-white">New Users</CardTitle>
                <CardDescription className="text-yellow-600 dark:text-yellow-400">Recently registered users</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {recentUsers?.map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 rounded-lg border border-yellow-500/20 bg-yellow-50/50 dark:bg-gray-900">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarFallback className="bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400">
                              {user.username?.charAt(0) || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-black dark:text-white">{user.username}</p>
                            <p className="text-sm text-yellow-600 dark:text-yellow-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-yellow-600 dark:text-yellow-400">
                            Joined {new Date(user.created_at).toLocaleDateString()}
                          </p>
                          <Badge 
                            variant="outline" 
                            className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                          >
                            {user.role || 'user'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
