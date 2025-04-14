
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  DollarSign, 
  ArrowUpDown, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Clock, 
  ShieldCheck,
  CalendarClock,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';

// Mock data for transactions in escrow
const escrowTransactionsData = [
  {
    id: 'TRX12345',
    accountId: 'LST001',
    title: 'Rare Fortnite Account with 50+ Skins',
    amount: 120.00,
    platformFee: 6.00,
    escrowFee: 3.60,
    seller: {
      id: 'USR001',
      username: 'FortniteTrader',
      avatar: 'https://i.pravatar.cc/100?u=31'
    },
    buyer: {
      id: 'USR002',
      username: 'GameCollector',
      avatar: 'https://i.pravatar.cc/100?u=32'
    },
    escrowAgent: {
      id: 'USR003',
      username: 'EscrowAdmin1',
      avatar: 'https://i.pravatar.cc/100?u=33'
    },
    status: 'in_escrow',
    created: '2023-11-13T14:30:00Z',
    updated: '2023-11-13T14:35:00Z',
    messageCount: 12,
    disputed: false
  },
  {
    id: 'TRX12346',
    accountId: 'LST002',
    title: 'OG Fortnite Account - Season 1 Player',
    amount: 299.99,
    platformFee: 15.00,
    escrowFee: 9.00,
    seller: {
      id: 'USR004',
      username: 'OGSeller',
      avatar: 'https://i.pravatar.cc/100?u=34'
    },
    buyer: {
      id: 'USR005',
      username: 'CollectiblesHunter',
      avatar: 'https://i.pravatar.cc/100?u=35'
    },
    escrowAgent: {
      id: 'USR003',
      username: 'EscrowAdmin1',
      avatar: 'https://i.pravatar.cc/100?u=33'
    },
    status: 'in_escrow',
    created: '2023-11-12T09:15:00Z',
    updated: '2023-11-12T09:20:00Z',
    messageCount: 5,
    disputed: true
  },
  {
    id: 'TRX12347',
    accountId: 'LST003',
    title: 'Budget Fortnite Account - Great for Beginners',
    amount: 35.50,
    platformFee: 1.78,
    escrowFee: 1.07,
    seller: {
      id: 'USR006',
      username: 'CasualGamer',
      avatar: 'https://i.pravatar.cc/100?u=36'
    },
    buyer: {
      id: 'USR007',
      username: 'NewPlayer',
      avatar: 'https://i.pravatar.cc/100?u=37'
    },
    escrowAgent: null, // Not assigned yet
    status: 'pending_escrow',
    created: '2023-11-14T11:45:00Z',
    updated: '2023-11-14T11:45:00Z',
    messageCount: 0,
    disputed: false
  },
];

// Status badge mapping
const statusStyles = {
  pending_escrow: { color: 'bg-yellow-500', text: 'Pending Assignment' },
  in_escrow: { color: 'bg-blue-500', text: 'In Escrow' },
  completed: { color: 'bg-green-500', text: 'Completed' },
  cancelled: { color: 'bg-red-500', text: 'Cancelled' },
  disputed: { color: 'bg-purple-500', text: 'Disputed' }
};

const EscrowQueue: React.FC = () => {
  const [transactions, setTransactions] = useState(escrowTransactionsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'release' | 'refund' | null>(null);
  const [sortField, setSortField] = useState('created');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Sort transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    let fieldA, fieldB;
    
    // Handle nested fields
    if (sortField === 'seller') {
      fieldA = a.seller.username.toLowerCase();
      fieldB = b.seller.username.toLowerCase();
    } else if (sortField === 'buyer') {
      fieldA = a.buyer.username.toLowerCase();
      fieldB = b.buyer.username.toLowerCase();
    } else {
      fieldA = a[sortField];
      fieldB = b[sortField];
    }
    
    // Handle date fields
    if (sortField === 'created' || sortField === 'updated') {
      fieldA = new Date(fieldA).getTime();
      fieldB = new Date(fieldB).getTime();
    }
    
    // Sort direction
    if (sortDirection === 'asc') {
      return fieldA > fieldB ? 1 : -1;
    } else {
      return fieldA < fieldB ? 1 : -1;
    }
  });

  // Filter and search transactions
  const filteredTransactions = sortedTransactions.filter(transaction => {
    const matchesSearch = 
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.buyer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.seller.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'disputed' 
        ? transaction.disputed 
        : transaction.status === filterStatus);
    
    return matchesSearch && matchesStatus;
  });

  // Handle sort change
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handle transaction selection for details view
  const handleViewTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    setDetailsOpen(true);
  };

  // Open confirmation dialog for release/refund actions
  const handleActionConfirm = (action: 'release' | 'refund') => {
    setConfirmAction(action);
    setConfirmDialogOpen(true);
  };

  // Handle transaction release (funds to seller)
  const handleReleaseTransaction = () => {
    if (!selectedTransaction) return;
    
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === selectedTransaction.id 
        ? { ...transaction, status: 'completed', updated: new Date().toISOString() } 
        : transaction
    );
    
    setTransactions(updatedTransactions);
    setConfirmDialogOpen(false);
    setDetailsOpen(false);
    
    toast.success('Funds released to seller successfully.');
  };

  // Handle transaction refund (to buyer)
  const handleRefundTransaction = () => {
    if (!selectedTransaction) return;
    
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === selectedTransaction.id 
        ? { ...transaction, status: 'cancelled', updated: new Date().toISOString() } 
        : transaction
    );
    
    setTransactions(updatedTransactions);
    setConfirmDialogOpen(false);
    setDetailsOpen(false);
    
    toast.success('Transaction refunded to buyer successfully.');
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Calculate time elapsed since created
  const getTimeElapsed = (dateString) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    } else {
      return `${diffHours}h`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Escrow Queue</h1>
        <p className="text-muted-foreground">Manage and process escrow transactions.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Escrow Transactions</CardTitle>
          <CardDescription>
            View and manage transactions currently in escrow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending_escrow">Pending Assignment</SelectItem>
                  <SelectItem value="in_escrow">In Escrow</SelectItem>
                  <SelectItem value="disputed">Disputed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>
                    <div className="flex items-center gap-1">
                      Transaction ID
                      {sortField === 'id' && (
                        <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('title')}>
                    <div className="flex items-center gap-1">
                      Account
                      {sortField === 'title' && (
                        <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('seller')}>
                    <div className="flex items-center gap-1">
                      Seller
                      {sortField === 'seller' && (
                        <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('buyer')}>
                    <div className="flex items-center gap-1">
                      Buyer
                      {sortField === 'buyer' && (
                        <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('amount')}>
                    <div className="flex items-center gap-1">
                      Amount
                      {sortField === 'amount' && (
                        <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('created')}>
                    <div className="flex items-center gap-1">
                      Created
                      {sortField === 'created' && (
                        <ArrowUpDown size={16} className={sortDirection === 'asc' ? 'transform rotate-180' : ''} />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.id}</TableCell>
                      <TableCell className="max-w-[200px] truncate" title={transaction.title}>
                        {transaction.title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <img 
                            src={transaction.seller.avatar} 
                            alt={transaction.seller.username} 
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="truncate">{transaction.seller.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <img 
                            src={transaction.buyer.avatar} 
                            alt={transaction.buyer.username} 
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="truncate">{transaction.buyer.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{formatDate(transaction.created).split(',')[0]}</span>
                          <span className="text-xs text-muted-foreground">
                            {getTimeElapsed(transaction.created)} ago
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={
                              transaction.disputed 
                              ? statusStyles['disputed'].color
                              : statusStyles[transaction.status].color
                            } 
                            variant="outline"
                          >
                            {transaction.disputed 
                              ? statusStyles['disputed'].text
                              : statusStyles[transaction.status].text
                            }
                          </Badge>
                          {transaction.messageCount > 0 && (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              {transaction.messageCount}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleViewTransaction(transaction)}>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                  <span>Transaction {selectedTransaction.id}</span>
                  <Badge 
                    className={
                      selectedTransaction.disputed 
                        ? statusStyles['disputed'].color 
                        : statusStyles[selectedTransaction.status].color
                    } 
                    variant="outline"
                  >
                    {selectedTransaction.disputed 
                      ? statusStyles['disputed'].text
                      : statusStyles[selectedTransaction.status].text
                    }
                  </Badge>
                </DialogTitle>
                <DialogDescription>{selectedTransaction.title}</DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Transaction Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-medium">${selectedTransaction.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Platform Fee:</span>
                      <span>${selectedTransaction.platformFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Escrow Fee:</span>
                      <span>${selectedTransaction.escrowFee.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Seller Receives:</span>
                      <span>${(selectedTransaction.amount - selectedTransaction.platformFee - selectedTransaction.escrowFee).toFixed(2)}</span>
                    </div>
                    <div className="pt-2 flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Created: {formatDate(selectedTransaction.created)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarClock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Updated: {formatDate(selectedTransaction.updated)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Participants</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={selectedTransaction.seller.avatar} 
                          alt={selectedTransaction.seller.username} 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{selectedTransaction.seller.username}</div>
                          <div className="text-xs text-muted-foreground">Seller</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img 
                          src={selectedTransaction.buyer.avatar} 
                          alt={selectedTransaction.buyer.username} 
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <div className="font-medium">{selectedTransaction.buyer.username}</div>
                          <div className="text-xs text-muted-foreground">Buyer</div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                    
                    {selectedTransaction.escrowAgent ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img 
                            src={selectedTransaction.escrowAgent.avatar} 
                            alt={selectedTransaction.escrowAgent.username} 
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium">{selectedTransaction.escrowAgent.username}</div>
                            <div className="text-xs text-muted-foreground">Escrow Agent</div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Profile
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between border p-2 rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4 text-yellow-500" />
                          <div className="font-medium">No Escrow Agent Assigned</div>
                        </div>
                        <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-white">
                          Assign
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open(`/chat/${selectedTransaction.id}`, '_blank')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Transaction Chat ({selectedTransaction.messageCount} messages)
                </Button>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                <div className="grid grid-cols-2 sm:flex-1 gap-2">
                  <Button 
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 gap-2"
                    onClick={() => handleActionConfirm('release')}
                    disabled={selectedTransaction.status !== 'in_escrow'}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>Release to Seller</span>
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="gap-2"
                    onClick={() => handleActionConfirm('refund')}
                    disabled={selectedTransaction.status !== 'in_escrow'}
                  >
                    <ThumbsDown className="h-4 w-4" />
                    <span>Refund Buyer</span>
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setDetailsOpen(false)}
                >
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === 'release' 
                ? 'Release Funds to Seller' 
                : 'Refund Buyer'
              }
            </DialogTitle>
            <DialogDescription>
              {confirmAction === 'release'
                ? 'This will release the funds to the seller and mark the transaction as completed. This action cannot be undone.'
                : 'This will refund the full amount to the buyer and cancel the transaction. This action cannot be undone.'
              }
            </DialogDescription>
          </DialogHeader>
          
          {selectedTransaction && (
            <div className="py-4">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Transaction ID:</span>
                <span>{selectedTransaction.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Amount:</span>
                <span>${selectedTransaction.amount.toFixed(2)}</span>
              </div>
              {confirmAction === 'release' ? (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Seller:</span>
                  <span>{selectedTransaction.seller.username}</span>
                </div>
              ) : (
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Buyer:</span>
                  <span>{selectedTransaction.buyer.username}</span>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setConfirmDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant={confirmAction === 'release' ? 'default' : 'destructive'}
              className={confirmAction === 'release' ? 'bg-green-600 hover:bg-green-700' : ''}
              onClick={confirmAction === 'release' ? handleReleaseTransaction : handleRefundTransaction}
            >
              {confirmAction === 'release' ? 'Release Funds' : 'Refund Buyer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EscrowQueue;
