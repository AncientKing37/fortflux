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
import { Textarea } from '@/components/ui/textarea';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Plus, 
  Edit, 
  Trash2, 
  Bell, 
  Mail, 
  Send, 
  CalendarClock, 
  Clock, 
  RefreshCw, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Check,
  Eye,
  UserCircle,
  Tag,
  BellRing,
  AlarmClock
} from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

const notificationTemplatesData = [
  {
    id: 'temp1',
    name: 'Payment Received',
    type: 'transaction',
    description: 'Sent to sellers when payment enters escrow',
    channel: 'email',
    subject: 'Payment Received for Your Listing',
    content: 'Dear {{seller_name}},\n\nWe are pleased to inform you that payment of ${{amount}} has been received for your listing "{{listing_title}}" and is now in escrow.\n\nBuyer: {{buyer_name}}\nTransaction ID: {{transaction_id}}\n\nPlease proceed with providing the account details to the buyer.\n\nThank you,\nFortMarket Team',
    variables: ['seller_name', 'amount', 'listing_title', 'buyer_name', 'transaction_id'],
    active: true,
    lastUpdated: '2023-10-15T10:30:00Z'
  },
  {
    id: 'temp2',
    name: 'New Message',
    type: 'message',
    description: 'Notifies users of new messages',
    channel: 'push',
    subject: 'New Message from {{sender_name}}',
    content: '{{sender_name}} has sent you a new message regarding {{listing_title}}.',
    variables: ['sender_name', 'listing_title'],
    active: true,
    lastUpdated: '2023-10-20T11:15:00Z'
  },
  {
    id: 'temp3',
    name: 'Funds Released',
    type: 'transaction',
    description: 'Sent to sellers when funds are released from escrow',
    channel: 'email',
    subject: 'Funds Released - Transaction Completed',
    content: 'Dear {{seller_name}},\n\nWe are pleased to inform you that the funds for your listing "{{listing_title}}" have been released from escrow and added to your balance.\n\nAmount: ${{amount}}\nTransaction ID: {{transaction_id}}\n\nThank you for using our platform!\n\nBest regards,\nFortMarket Team',
    variables: ['seller_name', 'amount', 'listing_title', 'transaction_id'],
    active: true,
    lastUpdated: '2023-11-05T09:45:00Z'
  },
  {
    id: 'temp4',
    name: 'Dispute Filed',
    type: 'dispute',
    description: 'Notifies parties when a dispute is filed',
    channel: 'email',
    subject: 'Dispute Filed for Transaction #{{transaction_id}}',
    content: 'Dear {{recipient_name}},\n\nA dispute has been filed for transaction #{{transaction_id}} regarding the listing "{{listing_title}}".\n\nReason: {{dispute_reason}}\n\nOur escrow team will review the case and reach out to both parties shortly.\n\nThank you,\nFortMarket Team',
    variables: ['recipient_name', 'transaction_id', 'listing_title', 'dispute_reason'],
    active: true,
    lastUpdated: '2023-10-28T15:20:00Z'
  },
  {
    id: 'temp5',
    name: 'Listing Approved',
    type: 'listing',
    description: 'Sent when a listing is approved by moderators',
    channel: 'push',
    subject: 'Your Listing Has Been Approved',
    content: 'Good news! Your listing "{{listing_title}}" has been approved and is now live on the marketplace.',
    variables: ['listing_title'],
    active: true,
    lastUpdated: '2023-11-08T14:10:00Z'
  },
  {
    id: 'temp6',
    name: 'Inactivity Reminder',
    type: 'reminder',
    description: 'Reminds users to reply to unanswered messages',
    channel: 'email',
    subject: 'You have unanswered messages',
    content: 'Dear {{recipient_name}},\n\nYou have {{message_count}} unanswered messages in your inbox. Don\'t keep your potential buyers/sellers waiting!\n\nClick here to view your messages: {{messages_link}}\n\nBest regards,\nFortMarket Team',
    variables: ['recipient_name', 'message_count', 'messages_link'],
    active: false,
    lastUpdated: '2023-11-10T16:30:00Z'
  },
];

const broadcastHistoryData = [
  {
    id: 'brc1',
    title: 'System Maintenance Notice',
    content: 'Our platform will undergo scheduled maintenance on November 20th from 2 AM to 4 AM UTC. During this time, some features may be temporarily unavailable.',
    sendDate: '2023-11-18T10:00:00Z',
    sender: 'Admin',
    audience: 'all',
    stats: {
      delivered: 1250,
      opened: 720,
      clicked: 180
    }
  },
  {
    id: 'brc2',
    title: 'New Feature Announcement',
    content: 'We\'ve just released a new feature that allows sellers to highlight their listings. Check it out in your dashboard!',
    sendDate: '2023-11-10T15:30:00Z',
    sender: 'Marketing',
    audience: 'sellers',
    stats: {
      delivered: 450,
      opened: 380,
      clicked: 210
    }
  },
  {
    id: 'brc3',
    title: 'Black Friday Sale',
    content: 'Don\'t miss our platform-wide Black Friday sale with reduced fees for all transactions made between November 24th and 27th!',
    sendDate: '2023-11-15T12:00:00Z',
    sender: 'Marketing',
    audience: 'all',
    stats: {
      delivered: 1250,
      opened: 950,
      clicked: 620
    }
  },
];

const reminderSchedulesData = [
  {
    id: 'rem1',
    name: 'Message Reply Reminder',
    description: 'Remind users to reply to unread messages',
    template: 'Inactivity Reminder',
    trigger: 'inactive_chat',
    delay: 24,
    audience: 'users_with_unread_messages',
    active: true,
    lastRun: '2023-11-14T23:00:00Z',
    nextScheduled: '2023-11-15T23:00:00Z'
  },
  {
    id: 'rem2',
    name: 'Abandoned Cart Reminder',
    description: 'Remind users about items in their cart',
    template: 'Cart Abandonment',
    trigger: 'abandoned_cart',
    delay: 6,
    audience: 'users_with_items_in_cart',
    active: true,
    lastRun: '2023-11-15T10:00:00Z',
    nextScheduled: '2023-11-15T16:00:00Z'
  },
  {
    id: 'rem3',
    name: 'Buyer Feedback Request',
    description: 'Request feedback after transaction completion',
    template: 'Feedback Request',
    trigger: 'transaction_completed',
    delay: 48,
    audience: 'buyers_with_completed_transactions',
    active: false,
    lastRun: '2023-11-10T09:00:00Z',
    nextScheduled: null
  },
];

const typeStyles = {
  transaction: { color: 'bg-blue-500', text: 'Transaction' },
  message: { color: 'bg-green-500', text: 'Message' },
  dispute: { color: 'bg-purple-500', text: 'Dispute' },
  listing: { color: 'bg-orange-500', text: 'Listing' },
  reminder: { color: 'bg-yellow-500', text: 'Reminder' },
  system: { color: 'bg-gray-500', text: 'System' }
};

const channelStyles = {
  email: { color: 'bg-indigo-500', icon: Mail, text: 'Email' },
  push: { color: 'bg-red-500', icon: Bell, text: 'Push' },
  sms: { color: 'bg-green-500', icon: MessageSquare, text: 'SMS' }
};

const NotificationsManager: React.FC = () => {
  const [templates, setTemplates] = useState(notificationTemplatesData);
  const [broadcasts, setBroadcasts] = useState(broadcastHistoryData);
  const [reminders, setReminders] = useState(reminderSchedulesData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('templates');
  
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  
  const [selectedBroadcast, setSelectedBroadcast] = useState(null);
  const [broadcastDialogOpen, setBroadcastDialogOpen] = useState(false);
  const [broadcastPreviewOpen, setBroadcastPreviewOpen] = useState(false);
  
  const [selectedReminder, setSelectedReminder] = useState(null);
  const [reminderDialogOpen, setReminderDialogOpen] = useState(false);

  const filteredTemplates = templates.filter(template => {
    return template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleCreateTemplate = () => {
    setSelectedTemplate({
      id: `temp${templates.length + 1}`,
      name: '',
      type: '',
      description: '',
      channel: 'email',
      subject: '',
      content: '',
      variables: [],
      active: true,
      lastUpdated: new Date().toISOString()
    });
    setDialogMode('create');
    setTemplateDialogOpen(true);
  };

  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setDialogMode('edit');
    setTemplateDialogOpen(true);
  };

  const handleDeleteTemplate = (templateId) => {
    setTemplates(templates.filter(template => template.id !== templateId));
    toast.success('Template deleted successfully');
  };

  const handleSaveTemplate = () => {
    if (dialogMode === 'create') {
      setTemplates([...templates, selectedTemplate]);
      toast.success('Template created successfully');
    } else {
      setTemplates(templates.map(template => 
        template.id === selectedTemplate.id ? selectedTemplate : template
      ));
      toast.success('Template updated successfully');
    }
    setTemplateDialogOpen(false);
  };

  const handleToggleTemplate = (templateId, active) => {
    setTemplates(templates.map(template => 
      template.id === templateId ? { ...template, active } : template
    ));
    toast.success(`Template ${active ? 'activated' : 'deactivated'} successfully`);
  };

  const handleCreateBroadcast = () => {
    setSelectedBroadcast({
      id: `brc${broadcasts.length + 1}`,
      title: '',
      content: '',
      sendDate: new Date().toISOString(),
      sender: 'Admin',
      audience: 'all',
      stats: {
        delivered: 0,
        opened: 0,
        clicked: 0
      }
    });
    setBroadcastDialogOpen(true);
  };

  const handlePreviewBroadcast = (broadcast) => {
    setSelectedBroadcast(broadcast);
    setBroadcastPreviewOpen(true);
  };

  const handleSendBroadcast = () => {
    setSelectedBroadcast({
      ...selectedBroadcast,
      sendDate: new Date().toISOString()
    });
    setBroadcasts([selectedBroadcast, ...broadcasts]);
    setBroadcastDialogOpen(false);
    toast.success('Broadcast sent successfully');
  };

  const handleCreateReminder = () => {
    setSelectedReminder({
      id: `rem${reminders.length + 1}`,
      name: '',
      description: '',
      template: '',
      trigger: '',
      delay: 24,
      audience: '',
      active: true,
      lastRun: null,
      nextScheduled: null
    });
    setDialogMode('create');
    setReminderDialogOpen(true);
  };

  const handleEditReminder = (reminder) => {
    setSelectedReminder(reminder);
    setDialogMode('edit');
    setReminderDialogOpen(true);
  };

  const handleDeleteReminder = (reminderId) => {
    setReminders(reminders.filter(reminder => reminder.id !== reminderId));
    toast.success('Reminder schedule deleted successfully');
  };

  const handleSaveReminder = () => {
    if (dialogMode === 'create') {
      setReminders([...reminders, selectedReminder]);
      toast.success('Reminder schedule created successfully');
    } else {
      setReminders(reminders.map(reminder => 
        reminder.id === selectedReminder.id ? selectedReminder : reminder
      ));
      toast.success('Reminder schedule updated successfully');
    }
    setReminderDialogOpen(false);
  };

  const handleToggleReminder = (reminderId, active) => {
    setReminders(reminders.map(reminder => 
      reminder.id === reminderId ? { ...reminder, active } : reminder
    ));
    toast.success(`Reminder schedule ${active ? 'activated' : 'deactivated'} successfully`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Notifications Manager</h1>
        <p className="text-muted-foreground">Manage notification templates, broadcasts, and automatic reminders.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-3">
          <TabsTrigger value="templates">Notification Templates</TabsTrigger>
          <TabsTrigger value="broadcasts">Broadcasts</TabsTrigger>
          <TabsTrigger value="reminders">Reminder Schedules</TabsTrigger>
        </TabsList>
        
        <TabsContent value="templates" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search templates..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateTemplate} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden md:table-cell">Updated</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTemplates.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No templates found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTemplates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">{template.name}</TableCell>
                      <TableCell>
                        <Badge 
                          className={typeStyles[template.type].color + " text-white"}
                          variant="outline"
                        >
                          {typeStyles[template.type].text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={channelStyles[template.channel].color + " text-white"}
                          variant="outline"
                        >
                          {React.createElement(channelStyles[template.channel].icon, { className: "h-3 w-3 mr-1" })}
                          {channelStyles[template.channel].text}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell max-w-[200px] truncate">
                        {template.description}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {formatDate(template.lastUpdated).split(',')[0]}
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={template.active}
                          onCheckedChange={(checked) => handleToggleTemplate(template.id, checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditTemplate(template)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteTemplate(template.id)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="broadcasts" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Broadcast Messages</h2>
            <Button onClick={handleCreateBroadcast} className="gap-2">
              <Send className="h-4 w-4" />
              Send New Broadcast
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Sent Date</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead className="hidden md:table-cell">Delivery Rate</TableHead>
                  <TableHead className="hidden md:table-cell">Open Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {broadcasts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No broadcasts found
                    </TableCell>
                  </TableRow>
                ) : (
                  broadcasts.map((broadcast) => (
                    <TableRow key={broadcast.id}>
                      <TableCell className="font-medium">{broadcast.title}</TableCell>
                      <TableCell>{formatDate(broadcast.sendDate).split(',')[0]}</TableCell>
                      <TableCell className="capitalize">{broadcast.audience}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <span className="mr-2">{broadcast.stats.delivered}</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <span className="mr-2">{Math.round((broadcast.stats.opened / broadcast.stats.delivered) * 100)}%</span>
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 rounded-full" 
                              style={{ width: `${(broadcast.stats.opened / broadcast.stats.delivered) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePreviewBroadcast(broadcast)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="reminders" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Automated Reminder Schedules</h2>
            <Button onClick={handleCreateReminder} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Schedule
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {reminders.map((reminder) => (
              <Card key={reminder.id} className={reminder.active ? '' : 'opacity-70'}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base">{reminder.name}</CardTitle>
                    <div className="flex gap-1">
                      <Switch
                        checked={reminder.active}
                        onCheckedChange={(checked) => handleToggleReminder(reminder.id, checked)}
                      />
                    </div>
                  </div>
                  <CardDescription>{reminder.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm">
                      <BellRing className="h-4 w-4 text-muted-foreground" />
                      <span>Template: </span>
                      <span className="font-medium">{reminder.template}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <AlarmClock className="h-4 w-4 text-muted-foreground" />
                      <span>Trigger: </span>
                      <span className="font-medium capitalize">{reminder.trigger.replace(/_/g, ' ')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Delay: </span>
                      <span className="font-medium">{reminder.delay} hours</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm">
                      <UserCircle className="h-4 w-4 text-muted-foreground" />
                      <span>Audience: </span>
                      <span className="font-medium capitalize">{reminder.audience.replace(/_/g, ' ')}</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="text-muted-foreground">Last Run:</div>
                        <div className="font-medium">
                          {reminder.lastRun ? formatDate(reminder.lastRun).split(',')[0] : 'Never'}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-1">
                        <div className="text-muted-foreground">Next Scheduled:</div>
                        <div className="font-medium">
                          {reminder.active && reminder.nextScheduled 
                            ? formatDate(reminder.nextScheduled).split(',')[0] 
                            : 'Not scheduled'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditReminder(reminder)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteReminder(reminder.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            {reminders.length === 0 && (
              <Card className="col-span-full flex items-center justify-center p-8">
                <div className="text-center text-muted-foreground">
                  <RefreshCw className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p>No reminder schedules found</p>
                  <p className="text-sm mt-2">Create your first automated reminder schedule</p>
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create Notification Template' : 'Edit Notification Template'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Create a new notification template to send to users.' 
                : 'Modify an existing notification template.'}
            </DialogDescription>
          </DialogHeader>

          {selectedTemplate && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="template-name" className="text-sm font-medium">Template Name</label>
                  <Input 
                    id="template-name"
                    value={selectedTemplate.name}
                    onChange={(e) => setSelectedTemplate({...selectedTemplate, name: e.target.value})}
                    placeholder="Enter template name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="template-type" className="text-sm font-medium">Type</label>
                  <Select 
                    value={selectedTemplate.type}
                    onValueChange={(value) => setSelectedTemplate({...selectedTemplate, type: value})}
                  >
                    <SelectTrigger id="template-type">
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transaction">Transaction</SelectItem>
                      <SelectItem value="message">Message</SelectItem>
                      <SelectItem value="dispute">Dispute</SelectItem>
                      <SelectItem value="listing">Listing</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="template-channel" className="text-sm font-medium">Channel</label>
                  <Select 
                    value={selectedTemplate.channel}
                    onValueChange={(value) => setSelectedTemplate({...selectedTemplate, channel: value})}
                  >
                    <SelectTrigger id="template-channel">
                      <SelectValue placeholder="Select a channel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="push">Push Notification</SelectItem>
                      <SelectItem value="sms">SMS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="template-description" className="text-sm font-medium">Description</label>
                  <Input 
                    id="template-description"
                    value={selectedTemplate.description}
                    onChange={(e) => setSelectedTemplate({...selectedTemplate, description: e.target.value})}
                    placeholder="Enter template description"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="template-subject" className="text-sm font-medium">Subject Line</label>
                <Input 
                  id="template-subject"
                  value={selectedTemplate.subject}
                  onChange={(e) => setSelectedTemplate({...selectedTemplate, subject: e.target.value})}
                  placeholder="Enter subject line"
                />
                <p className="text-xs text-muted-foreground">
                  Use variables like &#123;&#123;variable_name&#125;&#125; that will be replaced with actual values.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="template-content" className="text-sm font-medium">Content</label>
                <Textarea 
                  id="template-content"
                  value={selectedTemplate.content}
                  onChange={(e) => setSelectedTemplate({...selectedTemplate, content: e.target.value})}
                  placeholder="Enter template content"
                  rows={10}
                />
                <p className="text-xs text-muted-foreground">
                  Use variables like &#123;&#123;variable_name&#125;&#125; that will be replaced with actual values.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Template Variables</label>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      const variable = prompt('Enter variable name:');
                      if (variable && !selectedTemplate.variables.includes(variable)) {
                        setSelectedTemplate({
                          ...selectedTemplate,
                          variables: [...selectedTemplate.variables, variable]
                        });
                      }
                    }}
                  >
                    Add Variable
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable) => (
                    <Badge key={variable} variant="outline" className="px-2 py-1">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Template Variables</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate?.variables?.map((variable) => (
                    <Badge key={variable} variant="outline" className="px-2 py-1">
                      {`{{${variable}}}`}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 flex gap-2">
                <Input 
                  placeholder="Add new variable (without brackets)"
                  className="flex-1"
                  id="new-variable"
                />
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('new-variable') as HTMLInputElement;
                    const newVar = input.value.trim();
                    if (newVar && !selectedTemplate.variables.includes(newVar)) {
                      setSelectedTemplate({
                        ...selectedTemplate,
                        variables: [...selectedTemplate.variables, newVar]
                      });
                      input.value = '';
                    }
                  }}
                >
                  Add
                </Button>
              </div>
              
              <div className="pt-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="template-active"
                    checked={selectedTemplate.active}
                    onCheckedChange={(checked) => setSelectedTemplate({...selectedTemplate, active: checked})}
                  />
                  <label htmlFor="template-active" className="text-sm font-medium">
                    Template is active
                  </label>
                </div>
                <div className="text-sm text-muted-foreground">
                  Last updated: {formatDate(selectedTemplate.lastUpdated)}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveTemplate}>Save Template</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={broadcastDialogOpen} onOpenChange={setBroadcastDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Broadcast</DialogTitle>
            <DialogDescription>
              Create a broadcast message to send to users
            </DialogDescription>
          </DialogHeader>

          {selectedBroadcast && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="broadcast-title" className="text-sm font-medium">Title</label>
                <Input 
                  id="broadcast-title"
                  value={selectedBroadcast.title}
                  onChange={(e) => setSelectedBroadcast({...selectedBroadcast, title: e.target.value})}
                  placeholder="Enter broadcast title"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="broadcast-content" className="text-sm font-medium">Content</label>
                <Textarea 
                  id="broadcast-content"
                  value={selectedBroadcast.content}
                  onChange={(e) => setSelectedBroadcast({...selectedBroadcast, content: e.target.value})}
                  placeholder="Enter broadcast content"
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="broadcast-audience" className="text-sm font-medium">Audience</label>
                <Select 
                  value={selectedBroadcast.audience}
                  onValueChange={(value) => setSelectedBroadcast({...selectedBroadcast, audience: value})}
                >
                  <SelectTrigger id="broadcast-audience">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="buyers">Buyers Only</SelectItem>
                    <SelectItem value="sellers">Sellers Only</SelectItem>
                    <SelectItem value="new_users">New Users (Last 30 Days)</SelectItem>
                    <SelectItem value="inactive_users">Inactive Users (90+ Days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 space-y-2">
                <div className="text-sm text-muted-foreground">
                  Estimated recipients: {selectedBroadcast.audience === 'all' ? '1,250' : 
                                         selectedBroadcast.audience === 'sellers' ? '450' : 
                                         selectedBroadcast.audience === 'buyers' ? '800' : 
                                         selectedBroadcast.audience === 'new_users' ? '320' : '180'}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setBroadcastDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendBroadcast}
              disabled={!selectedBroadcast?.title || !selectedBroadcast?.content}
            >
              Send Broadcast
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={broadcastPreviewOpen} onOpenChange={setBroadcastPreviewOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Broadcast Details</DialogTitle>
            <DialogDescription>
              Sent on {selectedBroadcast && formatDate(selectedBroadcast.sendDate)}
            </DialogDescription>
          </DialogHeader>

          {selectedBroadcast && (
            <div className="space-y-4 py-4">
              <div>
                <h3 className="text-lg font-semibold">{selectedBroadcast.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Sent by: {selectedBroadcast.sender} • Audience: {selectedBroadcast.audience}
                </p>
              </div>

              <div className="border rounded-md p-4 bg-muted/30">
                <p className="whitespace-pre-line">{selectedBroadcast.content}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center">
                  <div className="text-2xl font-bold">{selectedBroadcast.stats.delivered}</div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round((selectedBroadcast.stats.opened / selectedBroadcast.stats.delivered) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Open Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round((selectedBroadcast.stats.clicked / selectedBroadcast.stats.opened) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setBroadcastPreviewOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={reminderDialogOpen} onOpenChange={setReminderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create Reminder Schedule' : 'Edit Reminder Schedule'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Create a new automated reminder schedule.' 
                : 'Modify an existing reminder schedule.'}
            </DialogDescription>
          </DialogHeader>

          {selectedReminder && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="reminder-name" className="text-sm font-medium">Schedule Name</label>
                <Input 
                  id="reminder-name"
                  value={selectedReminder.name}
                  onChange={(e) => setSelectedReminder({...selectedReminder, name: e.target.value})}
                  placeholder="Enter schedule name"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="reminder-description" className="text-sm font-medium">Description</label>
                <Input 
                  id="reminder-description"
                  value={selectedReminder.description}
                  onChange={(e) => setSelectedReminder({...selectedReminder, description: e.target.value})}
                  placeholder="Enter description"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="reminder-template" className="text-sm font-medium">Notification Template</label>
                <Select 
                  value={selectedReminder.template}
                  onValueChange={(value) => setSelectedReminder({...selectedReminder, template: value})}
                >
                  <SelectTrigger id="reminder-template">
                    <SelectValue placeholder="Select template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.filter(t => t.type === 'reminder').map(template => (
                      <SelectItem key={template.id} value={template.name}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="reminder-trigger" className="text-sm font-medium">Trigger Event</label>
                <Select 
                  value={selectedReminder.trigger}
                  onValueChange={(value) => setSelectedReminder({...selectedReminder, trigger: value})}
                >
                  <SelectTrigger id="reminder-trigger">
                    <SelectValue placeholder="Select trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inactive_chat">Inactive Chat</SelectItem>
                    <SelectItem value="abandoned_cart">Abandoned Cart</SelectItem>
                    <SelectItem value="transaction_completed">Transaction Completed</SelectItem>
                    <SelectItem value="login_inactivity">Login Inactivity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="reminder-delay" className="text-sm font-medium">Delay (hours)</label>
                <Input 
                  id="reminder-delay"
                  type="number"
                  min={1}
                  value={selectedReminder.delay}
                  onChange={(e) => setSelectedReminder({...selectedReminder, delay: parseInt(e.target.value) || 24})}
                />
                <p className="text-xs text-muted-foreground">
                  Hours to wait after the trigger event before sending the notification.
                </p>
              </div>

              <div className="space-y-2">
                <label htmlFor="reminder-audience" className="text-sm font-medium">Target Audience</label>
                <Select 
                  value={selectedReminder.audience}
                  onValueChange={(value) => setSelectedReminder({...selectedReminder, audience: value})}
                >
                  <SelectTrigger id="reminder-audience">
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="users_with_unread_messages">Users with Unread Messages</SelectItem>
                    <SelectItem value="users_with_items_in_cart">Users with Items in Cart</SelectItem>
                    <SelectItem value="buyers_with_completed_transactions">Buyers with Completed Transactions</SelectItem>
                    <SelectItem value="inactive_users">Inactive Users</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <Switch
                  id="reminder-active"
                  checked={selectedReminder.active}
                  onCheckedChange={(checked) => setSelectedReminder({...selectedReminder, active: checked})}
                />
                <label htmlFor="reminder-active" className="text-sm font-medium">
                  Schedule is active
                </label>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setReminderDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveReminder}
              disabled={!selectedReminder?.name || !selectedReminder?.template || !selectedReminder?.trigger}
            >
              {dialogMode === 'create' ? 'Create Schedule' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NotificationsManager;
