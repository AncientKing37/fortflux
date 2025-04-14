
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { ShoppingBag, CreditCard, MessageSquare, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FortniteAccount, Transaction } from '@/types';

const DashboardHome: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  
  const { data: userTransactions, isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', user?.id, user?.role],
    queryFn: () => dashboardService.getUserTransactions(user?.id || '', user?.role || ''),
    enabled: !!user?.id
  });
  
  const { data: userListings, isLoading: isLoadingListings } = useQuery({
    queryKey: ['listings', user?.id],
    queryFn: () => dashboardService.getUserListings(user?.id || ''),
    enabled: !!user?.id && user?.role === 'seller'
  });

  // Redirect based on role for more specific dashboards
  useEffect(() => {
    if (user?.role === 'escrow') {
      navigate('/dashboard/escrows');
    } else if (user?.role === 'support') {
      navigate('/dashboard/support');
    } else if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user?.role, navigate]);

  if (!user) {
    return null;
  }

  if (isLoadingTransactions || isLoadingListings) {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Welcome to your Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
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
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Process data based on user role
  const recentTransactions = userTransactions?.slice(0, 5) || [];
  const activeListings = userListings?.filter(l => l.status === 'available') || [];

  // Buyer dashboard
  if (user.role === 'buyer') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Welcome, {user.username}!</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${user.balance?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">Available for purchases</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Purchases</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userTransactions?.length || 0}</div>
              <p className="text-xs text-muted-foreground">Total purchases</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Unread messages</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{transaction.accountId}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${transaction.amount.toFixed(2)}</p>
                      <p className="text-xs capitalize bg-primary/10 rounded-full px-2 py-1 inline-block">
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
                {recentTransactions.length > 0 && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/dashboard/purchases">View All Purchases</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center p-6">
                <p className="text-muted-foreground mb-4">You haven't made any purchases yet</p>
                <Button asChild>
                  <Link to="/marketplace">Explore Marketplace</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Become a Seller</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Want to sell your Fortnite accounts? Become a seller today and start earning!</p>
              <Button asChild>
                <Link to="/dashboard/become-seller">Get Started</Link>
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Our support team is available 24/7 to assist you with any issues.</p>
              <Button variant="outline" asChild>
                <Link to="/dashboard/help">Contact Support</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  // Seller dashboard
  if (user.role === 'seller') {
    return (
      <div className="space-y-6">
        <h2 className="text-3xl font-bold">Seller Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Balance</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${user.balance?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-muted-foreground">Available for withdrawal</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Listings</CardTitle>
              <Store className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeListings.length}</div>
              <p className="text-xs text-muted-foreground">Accounts for sale</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Sales</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userTransactions?.filter(t => t.status === 'completed').length || 0}
              </div>
              <p className="text-xs text-muted-foreground">Successfully sold</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Listings</CardTitle>
            </CardHeader>
            <CardContent>
              {activeListings.length > 0 ? (
                <div className="space-y-4">
                  {activeListings.slice(0, 3).map(listing => (
                    <div key={listing.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{listing.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Listed: {new Date(listing.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${listing.price.toFixed(2)}</p>
                        <p className="text-xs capitalize bg-green-500/10 text-green-700 rounded-full px-2 py-1 inline-block">
                          Active
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full" asChild>
                    <Link to="/dashboard/listings">Manage Listings</Link>
                  </Button>
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-muted-foreground mb-4">You don't have any active listings</p>
                  <Button asChild>
                    <Link to="/dashboard/create-listing">Create Listing</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.slice(0, 3).map(transaction => (
                    <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{transaction.accountId}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${transaction.amount.toFixed(2)}</p>
                        <p className="text-xs capitalize bg-primary/10 rounded-full px-2 py-1 inline-block">
                          {transaction.status}
                        </p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    View All Sales
                  </Button>
                </div>
              ) : (
                <div className="text-center p-6">
                  <p className="text-muted-foreground mb-4">You haven't made any sales yet</p>
                  <Button asChild variant="outline">
                    <Link to="/dashboard/listings">Manage Listings</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-4">
              <Button asChild>
                <Link to="/dashboard/create-listing">
                  <Store className="mr-2 h-4 w-4" />
                  Create New Listing
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/dashboard/profile">
                  Update Seller Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Default return for any other role
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">Welcome to your Dashboard</h2>
      <p>Loading your personalized dashboard...</p>
    </div>
  );
};

export default DashboardHome;
