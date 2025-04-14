import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { BarChart, BarChart2, Users, DollarSign, Flag, Percent, ShieldAlert, CheckCircle, XCircle, Clock, Bell } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const AdminDashboard: React.FC = () => {
  // Fetch dashboard analytics
  const { data: analytics, isLoading } = useQuery({
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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
          
          <Card className="col-span-1">
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="h-80">
              <Skeleton className="h-full w-full" />
            </CardContent>
          </Card>
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
    
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Admin Dashboard</h2>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/admin/analytics">
              <BarChart2 className="h-4 w-4 mr-2" />
              Detailed Analytics
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.users?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.users?.byRole?.seller || 0} sellers
              <span className="mx-1">•</span>
              {analytics?.users?.byRole?.buyer || 0} buyers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.listings?.byStatus?.available || 0}</div>
            <p className="text-xs text-muted-foreground">
              Total: {analytics?.listings?.total || 0}
              <span className="mx-1">•</span>
              {analytics?.listings?.byStatus?.sold || 0} sold
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transaction Volume</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${analytics?.transactions?.totalValue?.toFixed(2) || '0.00'}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.transactions?.total || 0} total transactions
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disputed Transactions</CardTitle>
            <Flag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.transactions?.byStatus?.disputed || 0}</div>
            <p className="text-xs text-muted-foreground">
              {((analytics?.transactions?.byStatus?.disputed || 0) / (analytics?.transactions?.total || 1) * 100).toFixed(1)}% dispute rate
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Distribution</CardTitle>
            <CardDescription>Breakdown of users by role</CardDescription>
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
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction Status</CardTitle>
            <CardDescription>Distribution of transaction statuses</CardDescription>
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
      
      <Tabs defaultValue="transactions">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="users">New Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Date</th>
                      <th className="text-left pb-2">Account</th>
                      <th className="text-left pb-2">Amount</th>
                      <th className="text-left pb-2">Buyer</th>
                      <th className="text-left pb-2">Seller</th>
                      <th className="text-left pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions ? (
                      recentTransactions.map((tx: any) => (
                        <tr key={tx.id} className="border-b last:border-0">
                          <td className="py-3">{new Date(tx.created_at).toLocaleDateString()}</td>
                          <td className="py-3">{tx.account?.title || 'Unknown'}</td>
                          <td className="py-3">${tx.amount.toFixed(2)}</td>
                          <td className="py-3">{tx.buyer?.username || 'Unknown'}</td>
                          <td className="py-3">{tx.seller?.username || 'Unknown'}</td>
                          <td className="py-3">
                            <Badge 
                              variant={
                                tx.status === 'completed' ? 'default' : 
                                tx.status === 'disputed' ? 'destructive' : 
                                'outline'
                              }
                            >
                              {tx.status}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center">No recent transactions</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/fees">View All Transactions</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recently Joined Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left pb-2">Joined Date</th>
                      <th className="text-left pb-2">Username</th>
                      <th className="text-left pb-2">Role</th>
                      <th className="text-left pb-2">Balance</th>
                      <th className="text-left pb-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers ? (
                      recentUsers.map((user: any) => (
                        <tr key={user.id} className="border-b last:border-0">
                          <td className="py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                          <td className="py-3 flex items-center">
                            <Avatar className="h-6 w-6 mr-2">
                              <AvatarImage src={user.avatar_url} />
                              <AvatarFallback>
                                {user.username.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {user.username}
                          </td>
                          <td className="py-3">
                            <Badge variant="outline" className="capitalize">{user.role}</Badge>
                          </td>
                          <td className="py-3">${user.balance?.toFixed(2) || '0.00'}</td>
                          <td className="py-3">
                            <Link to={`/admin/users/${user.id}`}>
                              <Button variant="ghost" size="sm">View</Button>
                            </Link>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-4 text-center">No recent users</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin/users">Manage Users</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Moderation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <ShieldAlert className="h-5 w-5 mr-2 text-amber-500" />
                  <span>Disputed Transactions</span>
                </div>
                <Badge variant="outline">{analytics?.transactions?.byStatus?.disputed || 0}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Flag className="h-5 w-5 mr-2 text-red-500" />
                  <span>Flagged Content</span>
                </div>
                <Badge variant="outline">0</Badge>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  <span>Pending Approvals</span>
                </div>
                <Badge variant="outline">{analytics?.listings?.byStatus?.pending || 0}</Badge>
              </div>
              <Button className="w-full mt-2" asChild>
                <Link to="/admin/disputes">Handle Issues</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild>
                <Link to="/admin/listings/approve">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Approve Listings
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/roles">
                  <Users className="h-5 w-5 mr-2" />
                  Manage Roles
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/bans">
                  <XCircle className="h-5 w-5 mr-2" />
                  Ban System
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/admin/notifications">
                  <Bell className="h-5 w-5 mr-2" />
                  Send Notifications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
