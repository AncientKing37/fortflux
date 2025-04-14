
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  ThumbsUp, 
  ThumbsDown, 
  MessageSquare, 
  Clock, 
  FileText, 
  User,
  DollarSign,
  RefreshCcw,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useUser } from '@/contexts/UserContext';

// Status badge mapping
const statusStyles = {
  pending: { color: 'bg-yellow-500', text: 'Pending' },
  reviewing: { color: 'bg-blue-500', text: 'Reviewing' },
  resolved: { color: 'bg-green-500', text: 'Resolved' },
  refunded: { color: 'bg-purple-500', text: 'Refunded' },
  closed: { color: 'bg-gray-500', text: 'Closed' }
};

type Dispute = {
  id: string;
  transactionId: string;
  buyer: {
    id: string;
    username: string;
    avatar: string;
  };
  seller: {
    id: string;
    username: string;
    avatar: string;
  };
  amount: number;
  status: 'pending' | 'reviewing' | 'resolved' | 'refunded' | 'closed';
  reason: string;
  created: string;
  updated: string;
  messages: Array<{
    id: string;
    sender: string;
    content: string;
    timestamp: string;
    isAdmin: boolean;
  }>;
  evidence: Array<{
    id: string;
    type: string;
    url: string;
    description: string;
    uploader: string;
  }>;
};

const DisputeManagement: React.FC = () => {
  const { user } = useUser();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  // Check user permissions
  if (!user || !['admin', 'support'].includes(user.role)) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p>You do not have permission to access the dispute management system.</p>
      </div>
    );
  }

  // Fetch transactions in dispute status from Supabase
  const { data: disputes, isLoading } = useQuery({
    queryKey: ['dispute-transactions'],
    queryFn: async () => {
      // Fetch transactions with dispute status
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          status,
          created_at,
          updated_at,
          buyer_id,
          seller_id
        `)
        .in('status', ['disputed', 'in_dispute'])
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (!transactions || transactions.length === 0) {
        return [];
      }
      
      // Get buyer and seller profiles for each transaction
      const disputesWithUsers = await Promise.all(
        transactions.map(async (tx) => {
          // Get buyer profile
          const { data: buyer } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('id', tx.buyer_id)
            .single();
            
          // Get seller profile  
          const { data: seller } = await supabase
            .from('profiles')
            .select('id, username, avatar_url')
            .eq('id', tx.seller_id)
            .single();
            
          return {
            id: tx.id,
            transactionId: tx.id,
            buyer: {
              id: buyer?.id || tx.buyer_id,
              username: buyer?.username || 'Unknown User',
              avatar: buyer?.avatar_url || 'https://i.pravatar.cc/100?u=1'
            },
            seller: {
              id: seller?.id || tx.seller_id,
              username: seller?.username || 'Unknown User',
              avatar: seller?.avatar_url || 'https://i.pravatar.cc/100?u=2'
            },
            amount: tx.amount,
            status: 'pending',
            reason: 'Dispute regarding transaction',
            created: tx.created_at,
            updated: tx.updated_at,
            messages: [],
            evidence: []
          };
        })
      );
      
      return disputesWithUsers as Dispute[];
    }
  });

  // If no disputes, show empty state with a message
  const disputesList = disputes || [];

  // Filter and search disputes
  const filteredDisputes = disputesList.filter(dispute => {
    const matchesSearch = 
      dispute.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.buyer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dispute.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || dispute.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Handle dispute selection for details view
  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setDetailsOpen(true);
  };

  // Handle sending a message in a dispute
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedDispute) return;
    
    const updatedDispute = { 
      ...selectedDispute,
      messages: [
        ...selectedDispute.messages,
        {
          id: `MSG${Math.floor(Math.random() * 10000)}`,
          sender: user?.username || 'Admin',
          content: newMessage,
          timestamp: new Date().toISOString(),
          isAdmin: true
        }
      ]
    };
    
    setSelectedDispute(updatedDispute);
    setNewMessage('');
    toast.success('Message sent');
  };

  // Update dispute status mutation
  const updateDispute = useMutation({
    mutationFn: async ({ disputeId, resolution }: { disputeId: string, resolution: 'refund' | 'release' }) => {
      // Update transaction status based on resolution
      const newStatus = resolution === 'refund' ? 'refunded' : 'completed';
      
      const { error } = await supabase
        .from('transactions')
        .update({ status: newStatus })
        .eq('id', disputeId);
        
      if (error) throw error;
      
      // In a real implementation, you would handle fund transfers here
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dispute-transactions'] });
      toast.success('Dispute resolved successfully');
      setDetailsOpen(false);
    },
    onError: (error) => {
      console.error('Error resolving dispute:', error);
      toast.error('Failed to resolve dispute');
    }
  });

  // Handle dispute resolution
  const handleResolveDispute = (resolution: 'refund' | 'release') => {
    if (!selectedDispute) return;
    
    updateDispute.mutate({ 
      disputeId: selectedDispute.id,
      resolution 
    });
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dispute Management</h1>
        <p className="text-muted-foreground">Handle and resolve user disputes.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Disputes</CardTitle>
          <CardDescription>Manage ongoing disputes between buyers and sellers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by ID, username, or transaction..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Reviewing</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Seller</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7}>
                      <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/70" />
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredDisputes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No disputes found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDisputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell className="font-medium">{dispute.id.substring(0, 8)}</TableCell>
                      <TableCell>{dispute.buyer.username}</TableCell>
                      <TableCell>{dispute.seller.username}</TableCell>
                      <TableCell>${dispute.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          className={statusStyles[dispute.status].color + " text-white"}
                        >
                          {statusStyles[dispute.status].text}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(dispute.created).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleViewDispute(dispute)}>
                          View Details
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

      {/* Dispute Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          {selectedDispute && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Dispute {selectedDispute.id.substring(0, 8)}</span>
                  <Badge className={statusStyles[selectedDispute.status].color + " text-white"}>
                    {statusStyles[selectedDispute.status].text}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  Transaction: {selectedDispute.transactionId.substring(0, 8)} - ${selectedDispute.amount.toFixed(2)}
                </DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
                  <TabsTrigger value="chat" className="flex-1">Chat History</TabsTrigger>
                  <TabsTrigger value="evidence" className="flex-1">Evidence</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">Buyer</h3>
                      <div className="flex items-center gap-2">
                        <img 
                          src={selectedDispute.buyer.avatar} 
                          alt={selectedDispute.buyer.username} 
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{selectedDispute.buyer.username}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">Seller</h3>
                      <div className="flex items-center gap-2">
                        <img 
                          src={selectedDispute.seller.avatar} 
                          alt={selectedDispute.seller.username} 
                          className="w-8 h-8 rounded-full"
                        />
                        <span>{selectedDispute.seller.username}</span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium text-sm text-muted-foreground">Dispute Reason</h3>
                    <p>{selectedDispute.reason}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">Created</h3>
                      <p className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {formatDate(selectedDispute.created)}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-medium text-sm text-muted-foreground">Last Updated</h3>
                      <p className="flex items-center gap-2">
                        <RefreshCcw className="h-4 w-4 text-muted-foreground" />
                        {formatDate(selectedDispute.updated)}
                      </p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h3 className="font-medium">Resolution Actions</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="default" 
                        className="gap-2 flex-1"
                        onClick={() => handleResolveDispute('release')}
                        disabled={['resolved', 'refunded', 'closed'].includes(selectedDispute.status)}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Release Funds to Seller</span>
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="gap-2 flex-1"
                        onClick={() => handleResolveDispute('refund')}
                        disabled={['resolved', 'refunded', 'closed'].includes(selectedDispute.status)}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Refund Buyer</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="chat" className="space-y-4 pt-4">
                  <div className="border rounded-md p-4 h-64 overflow-y-auto space-y-4">
                    {selectedDispute.messages.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-muted-foreground">
                        No messages in this dispute yet
                      </div>
                    ) : (
                      selectedDispute.messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-lg p-3 ${
                            message.isAdmin 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}>
                            <div className="font-medium text-xs flex items-center gap-1 mb-1">
                              <User className="h-3 w-3" />
                              {message.sender}
                            </div>
                            <p>{message.content}</p>
                            <div className="text-xs opacity-70 mt-1 text-right">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      disabled={['resolved', 'refunded', 'closed'].includes(selectedDispute.status)}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={['resolved', 'refunded', 'closed'].includes(selectedDispute.status) || !newMessage.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="evidence" className="space-y-4 pt-4">
                  {selectedDispute.evidence.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No evidence has been submitted
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedDispute.evidence.map((item) => (
                        <Card key={item.id}>
                          <CardContent className="p-0">
                            <img 
                              src={item.url} 
                              alt={item.description} 
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                              <p className="font-medium">{item.description}</p>
                              <p className="text-sm text-muted-foreground">
                                Uploaded by: {item.uploader}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setDetailsOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DisputeManagement;
