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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Flag, 
  MessageCircle, 
  Shield, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Ban, 
  ShieldAlert, 
  Clock,
  UserX,
  Slash,
  ArrowRightCircle,
  PenLine,
  Trash
} from 'lucide-react';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';

// Mock data for flagged messages
const flaggedMessagesData = [
  {
    id: 'msg1',
    content: 'Hey, I can send you the account details through WhatsApp. My number is +1234567890.',
    sender: {
      id: 'user1',
      username: 'JohnSeller',
      avatar: 'https://i.pravatar.cc/100?u=50'
    },
    recipient: {
      id: 'user2',
      username: 'BuyerUser',
      avatar: 'https://i.pravatar.cc/100?u=51'
    },
    flagReason: 'external_contact',
    flaggedBy: 'system',
    timestamp: '2023-11-15T10:30:00Z',
    status: 'pending'
  },
  {
    id: 'msg2',
    content: 'This is a scam! You sent me an account that was already banned! I want my money back immediately or I will report you to the authorities.',
    sender: {
      id: 'user3',
      username: 'AngryBuyer',
      avatar: 'https://i.pravatar.cc/100?u=52'
    },
    recipient: {
      id: 'user4',
      username: 'SellerDude',
      avatar: 'https://i.pravatar.cc/100?u=53'
    },
    flagReason: 'abusive_language',
    flaggedBy: 'user',
    timestamp: '2023-11-14T16:45:00Z',
    status: 'pending'
  },
  {
    id: 'msg3',
    content: 'I can sell you this account for $50 outside the platform so we can both avoid fees. Just send the money to my PayPal.',
    sender: {
      id: 'user5',
      username: 'ShadySeller',
      avatar: 'https://i.pravatar.cc/100?u=54'
    },
    recipient: {
      id: 'user6',
      username: 'PotentialBuyer',
      avatar: 'https://i.pravatar.cc/100?u=55'
    },
    flagReason: 'fee_avoidance',
    flaggedBy: 'system',
    timestamp: '2023-11-15T09:15:00Z',
    status: 'pending'
  },
];

// Mock data for flagged accounts
const flaggedAccountsData = [
  {
    id: 'user5',
    username: 'ShadySeller',
    email: 'shadyseller@example.com',
    avatar: 'https://i.pravatar.cc/100?u=54',
    flagReason: 'multiple_violations',
    flaggedBy: 'system',
    timestamp: '2023-11-15T09:20:00Z',
    status: 'pending',
    violations: [
      { type: 'fee_avoidance', count: 3 },
      { type: 'external_contact', count: 2 }
    ],
    registeredDate: '2023-10-01T10:00:00Z',
    totalListings: 5,
    totalTransactions: 2
  },
  {
    id: 'user7',
    username: 'SuspiciousUser',
    email: 'suspicious@example.com',
    avatar: 'https://i.pravatar.cc/100?u=56',
    flagReason: 'suspicious_activity',
    flaggedBy: 'admin',
    timestamp: '2023-11-14T14:30:00Z',
    status: 'pending',
    violations: [
      { type: 'suspicious_payment', count: 1 }
    ],
    registeredDate: '2023-09-15T08:30:00Z',
    totalListings: 3,
    totalTransactions: 1
  },
  {
    id: 'user8',
    username: 'ScamReporter',
    email: 'reporter@example.com',
    avatar: 'https://i.pravatar.cc/100?u=57',
    flagReason: 'false_reports',
    flaggedBy: 'system',
    timestamp: '2023-11-13T11:20:00Z',
    status: 'pending',
    violations: [
      { type: 'false_reports', count: 4 }
    ],
    registeredDate: '2023-08-20T15:45:00Z',
    totalListings: 0,
    totalTransactions: 7
  },
];

// Mock data for flagged listings
const flaggedListingsData = [
  {
    id: 'lst1',
    title: 'Fortnite Account with Stolen Credit Card V-Bucks',
    seller: {
      id: 'user9',
      username: 'VBuckSeller',
      avatar: 'https://i.pravatar.cc/100?u=58'
    },
    price: 75.00,
    flagReason: 'prohibited_content',
    flaggedBy: 'user',
    timestamp: '2023-11-15T08:45:00Z',
    status: 'pending',
    description: 'Selling Fortnite account with 10,000 V-Bucks. These were purchased with various methods, no questions asked.',
    created: '2023-11-14T16:30:00Z'
  },
  {
    id: 'lst2',
    title: 'OG Fortnite Account - Extremely Rare Black Knight',
    seller: {
      id: 'user10',
      username: 'RareSeller',
      avatar: 'https://i.pravatar.cc/100?u=59'
    },
    price: 499.99,
    flagReason: 'misleading_information',
    flaggedBy: 'system',
    timestamp: '2023-11-14T12:15:00Z',
    status: 'pending',
    description: 'This is the rarest account you will ever find. Guaranteed to have items nobody else has. Black Knight and every exclusive skin ever released.',
    created: '2023-11-13T10:20:00Z'
  },
  {
    id: 'lst3',
    title: 'Fortnite Account with Auto-Aim Hack Enabled',
    seller: {
      id: 'user11',
      username: 'HackSeller',
      avatar: 'https://i.pravatar.cc/100?u=60'
    },
    price: 120.00,
    flagReason: 'prohibited_content',
    flaggedBy: 'admin',
    timestamp: '2023-11-13T15:30:00Z',
    status: 'pending',
    description: 'Special Fortnite account with undetectable auto-aim enabled. Win every game with this special account. HWID not linked.',
    created: '2023-11-12T14:15:00Z'
  },
];

// Status badge mapping
const statusStyles = {
  pending: { color: 'bg-yellow-500', text: 'Pending Review' },
  approved: { color: 'bg-green-500', text: 'Approved' },
  rejected: { color: 'bg-red-500', text: 'Rejected' },
  warned: { color: 'bg-orange-500', text: 'Warning Issued' },
  banned: { color: 'bg-purple-900', text: 'User Banned' }
};

// Flag reason badge mapping
const flagReasonStyles = {
  external_contact: { color: 'bg-orange-500', text: 'External Contact' },
  fee_avoidance: { color: 'bg-red-500', text: 'Fee Avoidance' },
  abusive_language: { color: 'bg-purple-500', text: 'Abusive Language' },
  prohibited_content: { color: 'bg-red-700', text: 'Prohibited Content' },
  suspicious_activity: { color: 'bg-yellow-500', text: 'Suspicious Activity' },
  multiple_violations: { color: 'bg-gray-800', text: 'Multiple Violations' },
  false_reports: { color: 'bg-blue-500', text: 'False Reports' },
  misleading_information: { color: 'bg-teal-500', text: 'Misleading Info' }
};

const FlaggedContent: React.FC = () => {
  const [messages, setMessages] = useState(flaggedMessagesData);
  const [accounts, setAccounts] = useState(flaggedAccountsData);
  const [listings, setListings] = useState(flaggedListingsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('messages');
  const [filterReason, setFilterReason] = useState('all');
  
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageDetailsOpen, setMessageDetailsOpen] = useState(false);
  
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [accountDetailsOpen, setAccountDetailsOpen] = useState(false);
  
  const [selectedListing, setSelectedListing] = useState(null);
  const [listingDetailsOpen, setListingDetailsOpen] = useState(false);
  
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionNotes, setActionNotes] = useState('');
  const [itemToAction, setItemToAction] = useState(null);

  // Filter flagged content based on search term and reason
  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient.username.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesReason = filterReason === 'all' || message.flagReason === filterReason;
    
    return matchesSearch && matchesReason;
  });

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesReason = filterReason === 'all' || account.flagReason === filterReason;
    
    return matchesSearch && matchesReason;
  });

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.seller.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesReason = filterReason === 'all' || listing.flagReason === filterReason;
    
    return matchesSearch && matchesReason;
  });

  // Handle view details
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setMessageDetailsOpen(true);
  };

  const handleViewAccount = (account) => {
    setSelectedAccount(account);
    setAccountDetailsOpen(true);
  };

  const handleViewListing = (listing) => {
    setSelectedListing(listing);
    setListingDetailsOpen(true);
  };

  // Handle opening action dialog
  const handleOpenAction = (type, item) => {
    setActionType(type);
    setItemToAction(item);
    setActionNotes('');
    setActionDialogOpen(true);
  };

  // Handle taking action on flagged content
  const handleTakeAction = () => {
    let updatedStatus;
    let actionMessage;

    switch (actionType) {
      case 'approve':
        updatedStatus = 'approved';
        actionMessage = 'Content approved. No action needed.';
        break;
      case 'warn':
        updatedStatus = 'warned';
        actionMessage = 'Warning issued to user.';
        break;
      case 'ban':
        updatedStatus = 'banned';
        actionMessage = 'User has been banned.';
        break;
      case 'reject':
        updatedStatus = 'rejected';
        actionMessage = 'Content has been removed.';
        break;
      default:
        return;
    }

    // Update the appropriate content list based on active tab
    if (activeTab === 'messages' && itemToAction) {
      setMessages(messages.map(message => 
        message.id === itemToAction.id ? { ...message, status: updatedStatus } : message
      ));
    } else if (activeTab === 'accounts' && itemToAction) {
      setAccounts(accounts.map(account => 
        account.id === itemToAction.id ? { ...account, status: updatedStatus } : account
      ));
    } else if (activeTab === 'listings' && itemToAction) {
      setListings(listings.map(listing => 
        listing.id === itemToAction.id ? { ...listing, status: updatedStatus } : listing
      ));
    }

    setActionDialogOpen(false);
    toast.success(actionMessage);
    
    // Close any open detail dialogs
    setMessageDetailsOpen(false);
    setAccountDetailsOpen(false);
    setListingDetailsOpen(false);
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get time elapsed since flagged
  const getTimeElapsed = (dateString) => {
    const flagged = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - flagged.getTime();
    
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Flagged Content</h1>
        <p className="text-muted-foreground">Review and moderate flagged content across the platform.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search flagged content..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={filterReason} onValueChange={setFilterReason}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reasons</SelectItem>
              <SelectItem value="external_contact">External Contact</SelectItem>
              <SelectItem value="fee_avoidance">Fee Avoidance</SelectItem>
              <SelectItem value="abusive_language">Abusive Language</SelectItem>
              <SelectItem value="prohibited_content">Prohibited Content</SelectItem>
              <SelectItem value="suspicious_activity">Suspicious Activity</SelectItem>
              <SelectItem value="multiple_violations">Multiple Violations</SelectItem>
              <SelectItem value="false_reports">False Reports</SelectItem>
              <SelectItem value="misleading_information">Misleading Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="messages" className="flex gap-2 items-center">
            <MessageCircle className="h-4 w-4" />
            <span>Messages</span>
            <Badge variant="outline" className="ml-auto">
              {messages.filter(m => m.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="accounts" className="flex gap-2 items-center">
            <User className="h-4 w-4" />
            <span>Accounts</span>
            <Badge variant="outline" className="ml-auto">
              {accounts.filter(a => a.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="listings" className="flex gap-2 items-center">
            <Shield className="h-4 w-4" />
            <span>Listings</span>
            <Badge variant="outline" className="ml-auto">
              {listings.filter(l => l.status === 'pending').length}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        {/* Messages Tab */}
        <TabsContent value="messages" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Messages</CardTitle>
              <CardDescription>
                Messages that violate community guidelines or platform rules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Message Preview</TableHead>
                      <TableHead>Users</TableHead>
                      <TableHead>Flag Reason</TableHead>
                      <TableHead className="hidden md:table-cell">Flagged</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No flagged messages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell className="max-w-xs truncate">
                            {message.content.substring(0, 50)}
                            {message.content.length > 50 && '...'}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1 text-xs">
                                <span className="font-medium">From:</span>
                                <span>{message.sender.username}</span>
                              </div>
                              <div className="flex items-center gap-1 text-xs">
                                <span className="font-medium">To:</span>
                                <span>{message.recipient.username}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={flagReasonStyles[message.flagReason].color + " text-white"}
                              variant="outline"
                            >
                              {flagReasonStyles[message.flagReason].text}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">
                                {getTimeElapsed(message.timestamp)}
                              </span>
                              <span className="text-xs">
                                By: {message.flaggedBy === 'system' ? 'System' : 'User'}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={statusStyles[message.status].color + " text-white"}
                              variant="outline"
                            >
                              {statusStyles[message.status].text}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewMessage(message)}
                              disabled={message.status !== 'pending'}
                            >
                              Review
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
        </TabsContent>
        
        {/* Accounts Tab */}
        <TabsContent value="accounts" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Accounts</CardTitle>
              <CardDescription>
                User accounts with suspicious activity or multiple violations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Flag Reason</TableHead>
                      <TableHead className="hidden md:table-cell">Violations</TableHead>
                      <TableHead className="hidden md:table-cell">Flagged</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No flagged accounts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account) => (
                        <TableRow key={account.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img 
                                src={account.avatar} 
                                alt={account.username} 
                                className="w-8 h-8 rounded-full"
                              />
                              <div>
                                <div className="font-medium">{account.username}</div>
                                <div className="text-xs text-muted-foreground">{account.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={flagReasonStyles[account.flagReason].color + " text-white"}
                              variant="outline"
                            >
                              {flagReasonStyles[account.flagReason].text}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="space-y-1">
                              {account.violations.map((violation, index) => (
                                <div key={index} className="flex items-center gap-1 text-xs">
                                  <span className="capitalize">{violation.type.replace(/_/g, ' ')}:</span>
                                  <span className="font-medium">{violation.count}</span>
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">
                                {getTimeElapsed(account.timestamp)}
                              </span>
                              <span className="text-xs">
                                By: {account.flaggedBy === 'system' ? 'System' : account.flaggedBy}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={statusStyles[account.status].color + " text-white"}
                              variant="outline"
                            >
                              {statusStyles[account.status].text}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewAccount(account)}
                              disabled={account.status !== 'pending'}
                            >
                              Review
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
        </TabsContent>
        
        {/* Listings Tab */}
        <TabsContent value="listings" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Listings</CardTitle>
              <CardDescription>
                Listings that violate marketplace policies or contain prohibited content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Listing</TableHead>
                      <TableHead>Seller</TableHead>
                      <TableHead>Flag Reason</TableHead>
                      <TableHead className="hidden md:table-cell">Flagged</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredListings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No flagged listings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredListings.map((listing) => (
                        <TableRow key={listing.id}>
                          <TableCell>
                            <div className="font-medium">{listing.title}</div>
                            <div className="text-xs text-muted-foreground">
                              ${listing.price.toFixed(2)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <img 
                                src={listing.seller.avatar} 
                                alt={listing.seller.username} 
                                className="w-6 h-6 rounded-full"
                              />
                              <span>{listing.seller.username}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={flagReasonStyles[listing.flagReason].color + " text-white"}
                              variant="outline"
                            >
                              {flagReasonStyles[listing.flagReason].text}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">
                                {getTimeElapsed(listing.timestamp)}
                              </span>
                              <span className="text-xs">
                                By: {listing.flaggedBy === 'system' ? 'System' : listing.flaggedBy}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              className={statusStyles[listing.status].color + " text-white"}
                              variant="outline"
                            >
                              {statusStyles[listing.status].text}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleViewListing(listing)}
                              disabled={listing.status !== 'pending'}
                            >
                              Review
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
        </TabsContent>
      </Tabs>

      {/* Message Details Dialog */}
      <Dialog open={messageDetailsOpen} onOpenChange={setMessageDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Flagged Message</DialogTitle>
            <DialogDescription>
              Message flagged for {selectedMessage && flagReasonStyles[selectedMessage.flagReason].text}
            </DialogDescription>
          </DialogHeader>

          {selectedMessage && (
            <div className="space-y-4 py-4">
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={selectedMessage.sender.avatar} 
                    alt={selectedMessage.sender.username} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{selectedMessage.sender.username}</div>
                    <div className="text-xs text-muted-foreground">Sender</div>
                  </div>
                </div>
                <ArrowRightCircle className="mx-4 text-muted-foreground" />
                <div className="flex items-center gap-2">
                  <img 
                    src={selectedMessage.recipient.avatar} 
                    alt={selectedMessage.recipient.username} 
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <div className="font-medium">{selectedMessage.recipient.username}</div>
                    <div className="text-xs text-muted-foreground">Recipient</div>
                  </div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="whitespace-pre-line">{selectedMessage.content}</p>
                <div className="text-xs text-muted-foreground mt-2 text-right">
                  {formatDate(selectedMessage.timestamp)}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Flag className="h-4 w-4 text-red-500" />
                <span className="font-medium">Flagged reason:</span>
                <Badge 
                  className={flagReasonStyles[selectedMessage.flagReason].color + " text-white"}
                  variant="outline"
                >
                  {flagReasonStyles[selectedMessage.flagReason].text}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Flagged by:</span>
                <span>{selectedMessage.flaggedBy === 'system' ? 'Automated System' : 'User Report'}</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="grid grid-cols-2 sm:flex-1 gap-2">
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => handleOpenAction('approve', selectedMessage)}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Approve</span>
              </Button>
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => handleOpenAction('warn', selectedMessage)}
              >
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Warn User</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="destructive"
                className="gap-2"
                onClick={() => handleOpenAction('reject', selectedMessage)}
              >
                <XCircle className="h-4 w-4" />
                <span>Remove</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setMessageDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Account Details Dialog */}
      <Dialog open={accountDetailsOpen} onOpenChange={setAccountDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Flagged Account</DialogTitle>
            <DialogDescription>
              Account flagged for {selectedAccount && flagReasonStyles[selectedAccount.flagReason].text}
            </DialogDescription>
          </DialogHeader>

          {selectedAccount && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <img 
                  src={selectedAccount.avatar} 
                  alt={selectedAccount.username} 
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <div className="text-xl font-bold">{selectedAccount.username}</div>
                  <div className="text-sm text-muted-foreground">{selectedAccount.email}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Registered</div>
                  <div>{formatDate(selectedAccount.registeredDate).split(',')[0]}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Activity</div>
                  <div>{selectedAccount.totalListings} listings, {selectedAccount.totalTransactions} transactions</div>
                </div>
              </div>
              
              <div className="border-t pt-2">
                <div className="text-sm font-medium mb-2">Violation History:</div>
                <div className="space-y-2">
                  {selectedAccount.violations.map((violation, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-muted rounded-md">
                      <div className="capitalize">{violation.type.replace(/_/g, ' ')}</div>
                      <Badge variant="outline">{violation.count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm pt-2">
                <Flag className="h-4 w-4 text-red-500" />
                <span className="font-medium">Flagged reason:</span>
                <Badge 
                  className={flagReasonStyles[selectedAccount.flagReason].color + " text-white"}
                  variant="outline"
                >
                  {flagReasonStyles[selectedAccount.flagReason].text}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Flagged by:</span>
                <span>{selectedAccount.flaggedBy === 'system' ? 'Automated System' : 'Admin'}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Flagged on:</span>
                <span>{formatDate(selectedAccount.timestamp)}</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="grid grid-cols-2 sm:flex-1 gap-2">
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => handleOpenAction('approve', selectedAccount)}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Clear Flag</span>
              </Button>
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => handleOpenAction('warn', selectedAccount)}
              >
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span>Warn User</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="destructive"
                className="gap-2"
                onClick={() => handleOpenAction('ban', selectedAccount)}
              >
                <Ban className="h-4 w-4" />
                <span>Ban User</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setAccountDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Listing Details Dialog */}
      <Dialog open={listingDetailsOpen} onOpenChange={setListingDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Flagged Listing</DialogTitle>
            <DialogDescription>
              Listing flagged for {selectedListing && flagReasonStyles[selectedListing.flagReason].text}
            </DialogDescription>
          </DialogHeader>

          {selectedListing && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedListing.title}</h3>
                <div className="text-sm text-primary font-medium">${selectedListing.price.toFixed(2)}</div>
              </div>
              
              <div className="flex items-center gap-2">
                <img 
                  src={selectedListing.seller.avatar} 
                  alt={selectedListing.seller.username} 
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <div className="font-medium">{selectedListing.seller.username}</div>
                  <div className="text-xs text-muted-foreground">Seller</div>
                </div>
              </div>
              
              <div className="rounded-lg border p-4 bg-muted/30">
                <p className="whitespace-pre-line">{selectedListing.description}</p>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Flag className="h-4 w-4 text-red-500" />
                <span className="font-medium">Flagged reason:</span>
                <Badge 
                  className={flagReasonStyles[selectedListing.flagReason].color + " text-white"}
                  variant="outline"
                >
                  {flagReasonStyles[selectedListing.flagReason].text}
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">Flagged by:</span>
                <span>
                  {selectedListing.flaggedBy === 'system' 
                    ? 'Automated System' 
                    : selectedListing.flaggedBy === 'user' 
                      ? 'User Report' 
                      : 'Admin'}
                </span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Created on:</span>
                <span>{formatDate(selectedListing.created)}</span>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
            <div className="grid grid-cols-2 sm:flex-1 gap-2">
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => handleOpenAction('approve', selectedListing)}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Approve</span>
              </Button>
              <Button 
                variant="outline"
                className="gap-2"
                onClick={() => handleOpenAction('warn', selectedListing)}
              >
                <PenLine className="h-4 w-4 text-yellow-500" />
                <span>Request Edit</span>
              </Button>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="destructive"
                className="gap-2"
                onClick={() => handleOpenAction('reject', selectedListing)}
              >
                <Trash className="h-4 w-4" />
                <span>Remove</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setListingDetailsOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === 'approve' 
                ? 'Approve Content' 
                : actionType === 'warn' 
                  ? 'Issue Warning' 
                  : actionType === 'ban' 
                    ? 'Ban User' 
                    : 'Remove Content'}
            </DialogTitle>
            <DialogDescription>
              {actionType === 'approve' 
                ? 'Confirm that this content does not violate platform rules.' 
                : actionType === 'warn' 
                  ? 'Send a warning message to the user.' 
                  : actionType === 'ban' 
                    ? 'Permanently ban this user from the platform.' 
                    : 'Remove this content from the platform.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
              {actionType === 'approve' && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {actionType === 'warn' && (
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              )}
              {actionType === 'ban' && (
                <UserX className="h-5 w-5 text-red-500" />
              )}
              {actionType === 'reject' && (
                <Slash className="h-5 w-5 text-red-500" />
              )}
              <div className="font-medium">
                {actionType === 'approve' && 'This content will be approved and marked as reviewed.'}
                {actionType === 'warn' && 'The user will receive a warning notice.'}
                {actionType === 'ban' && 'This account will be permanently banned.'}
                {actionType === 'reject' && 'This content will be removed from the platform.'}
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="action-notes" className="text-sm font-medium">Notes (optional)</label>
              <Textarea 
                id="action-notes"
                value={actionNotes}
                onChange={(e) => setActionNotes(e.target.value)}
                placeholder={actionType === 'warn' 
                  ? 'Enter warning message to send to the user...' 
                  : 'Enter notes about this action...'}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setActionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleTakeAction}
              variant={actionType === 'approve' ? 'default' : actionType === 'warn' ? 'outline' : 'destructive'}
              className={actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlaggedContent;
