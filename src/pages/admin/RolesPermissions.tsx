
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  LockIcon, 
  UserCog, 
  ShieldCheck, 
  CheckSquare,
  CheckSquare2,
  KeyRound,
  MessageCircle,
  Settings2,
  Layers
} from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';

// Mock data for roles and staff users
const rolesData = [
  {
    id: 'role1',
    name: 'Super Admin',
    description: 'Full access to all system features and settings',
    usersCount: 2,
    permissions: {
      users: { view: true, create: true, edit: true, delete: true },
      listings: { view: true, create: true, edit: true, delete: true, approve: true },
      transactions: { view: true, manage: true, escrow: true },
      disputes: { view: true, resolve: true },
      reports: { view: true, export: true },
      settings: { view: true, edit: true }
    }
  },
  {
    id: 'role2',
    name: 'Escrow Agent',
    description: 'Manage escrow transactions and resolve disputes',
    usersCount: 5,
    permissions: {
      users: { view: true, create: false, edit: false, delete: false },
      listings: { view: true, create: false, edit: false, delete: false, approve: false },
      transactions: { view: true, manage: true, escrow: true },
      disputes: { view: true, resolve: true },
      reports: { view: false, export: false },
      settings: { view: false, edit: false }
    }
  },
  {
    id: 'role3',
    name: 'Support Staff',
    description: 'Handle customer support and moderate content',
    usersCount: 8,
    permissions: {
      users: { view: true, create: false, edit: true, delete: false },
      listings: { view: true, create: false, edit: true, delete: false, approve: true },
      transactions: { view: true, manage: false, escrow: false },
      disputes: { view: true, resolve: false },
      reports: { view: true, export: false },
      settings: { view: false, edit: false }
    }
  },
];

const staffUsersData = [
  {
    id: 'usr1',
    username: 'admin1',
    email: 'admin1@example.com',
    role: 'Super Admin',
    avatar: 'https://i.pravatar.cc/100?u=40',
    lastActive: '2023-11-15T09:30:00Z',
    status: 'active'
  },
  {
    id: 'usr2',
    username: 'admin2',
    email: 'admin2@example.com',
    role: 'Super Admin',
    avatar: 'https://i.pravatar.cc/100?u=41',
    lastActive: '2023-11-14T16:45:00Z',
    status: 'active'
  },
  {
    id: 'usr3',
    username: 'escrow1',
    email: 'escrow1@example.com',
    role: 'Escrow Agent',
    avatar: 'https://i.pravatar.cc/100?u=42',
    lastActive: '2023-11-15T11:20:00Z',
    status: 'active'
  },
  {
    id: 'usr4',
    username: 'escrow2',
    email: 'escrow2@example.com',
    role: 'Escrow Agent',
    avatar: 'https://i.pravatar.cc/100?u=43',
    lastActive: '2023-11-15T10:15:00Z',
    status: 'active'
  },
  {
    id: 'usr5',
    username: 'support1',
    email: 'support1@example.com',
    role: 'Support Staff',
    avatar: 'https://i.pravatar.cc/100?u=44',
    lastActive: '2023-11-15T08:45:00Z',
    status: 'active'
  },
  {
    id: 'usr6',
    username: 'support2',
    email: 'support2@example.com',
    role: 'Support Staff',
    avatar: 'https://i.pravatar.cc/100?u=45',
    lastActive: '2023-11-14T14:30:00Z',
    status: 'inactive'
  },
];

// Permission modules with their labels and icons
const permissionModules = [
  { id: 'users', name: 'User Management', icon: UserCog },
  { id: 'listings', name: 'Listings & Content', icon: Layers },
  { id: 'transactions', name: 'Transactions & Escrow', icon: ShieldCheck },
  { id: 'disputes', name: 'Disputes & Resolutions', icon: MessageCircle },
  { id: 'reports', name: 'Reports & Analytics', icon: CheckSquare },
  { id: 'settings', name: 'System Settings', icon: Settings2 },
];

// Status badge mapping
const statusStyles = {
  active: { color: 'bg-green-500', text: 'Active' },
  inactive: { color: 'bg-gray-500', text: 'Inactive' },
  suspended: { color: 'bg-red-500', text: 'Suspended' }
};

const RolesPermissions: React.FC = () => {
  const [roles, setRoles] = useState(rolesData);
  const [staffUsers, setStaffUsers] = useState(staffUsersData);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('roles');
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  
  // Filter staff users
  const filteredUsers = staffUsers.filter(user => {
    return user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Open role dialog for editing
  const handleEditRole = (role) => {
    setSelectedRole(role);
    setDialogMode('edit');
    setRoleDialogOpen(true);
  };

  // Open role dialog for creating
  const handleCreateRole = () => {
    setSelectedRole({
      id: `role${roles.length + 1}`,
      name: '',
      description: '',
      usersCount: 0,
      permissions: {
        users: { view: false, create: false, edit: false, delete: false },
        listings: { view: false, create: false, edit: false, delete: false, approve: false },
        transactions: { view: false, manage: false, escrow: false },
        disputes: { view: false, resolve: false },
        reports: { view: false, export: false },
        settings: { view: false, edit: false }
      }
    });
    setDialogMode('create');
    setRoleDialogOpen(true);
  };

  // Open user dialog for editing
  const handleEditUser = (user) => {
    setSelectedUser(user);
    setDialogMode('edit');
    setUserDialogOpen(true);
  };

  // Open user dialog for creating
  const handleCreateUser = () => {
    setSelectedUser({
      id: `usr${staffUsers.length + 1}`,
      username: '',
      email: '',
      role: '',
      avatar: 'https://i.pravatar.cc/100?u=46',
      lastActive: new Date().toISOString(),
      status: 'active'
    });
    setDialogMode('create');
    setUserDialogOpen(true);
  };

  // Handle role save
  const handleSaveRole = () => {
    if (dialogMode === 'create') {
      setRoles([...roles, selectedRole]);
      toast.success('Role created successfully');
    } else {
      setRoles(roles.map(role => role.id === selectedRole.id ? selectedRole : role));
      toast.success('Role updated successfully');
    }
    setRoleDialogOpen(false);
  };

  // Handle user save
  const handleSaveUser = () => {
    if (dialogMode === 'create') {
      setStaffUsers([...staffUsers, selectedUser]);
      toast.success('User created successfully');
    } else {
      setStaffUsers(staffUsers.map(user => user.id === selectedUser.id ? selectedUser : user));
      toast.success('User updated successfully');
    }
    setUserDialogOpen(false);
  };

  // Handle role deletion
  const handleDeleteRole = (roleId) => {
    // Add confirmation here in a real app
    setRoles(roles.filter(role => role.id !== roleId));
    toast.success('Role deleted successfully');
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    // Add confirmation here in a real app
    setStaffUsers(staffUsers.filter(user => user.id !== userId));
    toast.success('User removed successfully');
  };

  // Toggle a permission for a role
  const togglePermission = (module, permission) => {
    if (!selectedRole) return;
    
    setSelectedRole({
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [module]: {
          ...selectedRole.permissions[module],
          [permission]: !selectedRole.permissions[module][permission]
        }
      }
    });
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  // Get time elapsed since last active
  const getTimeElapsed = (dateString) => {
    const lastActive = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - lastActive.getTime();
    
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
        <h1 className="text-2xl font-bold tracking-tight">Roles & Permissions</h1>
        <p className="text-muted-foreground">Manage administrative roles and staff accounts.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full md:w-auto grid-cols-2">
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
          <TabsTrigger value="users">Staff Users</TabsTrigger>
        </TabsList>
        
        {/* Roles & Permissions Tab */}
        <TabsContent value="roles" className="space-y-4 mt-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Available Roles</h2>
            <Button onClick={handleCreateRole} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Role
            </Button>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <Card key={role.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{role.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditRole(role)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteRole(role.id)}
                        disabled={role.usersCount > 0}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {role.usersCount} {role.usersCount === 1 ? 'user' : 'users'} assigned
                    </div>
                    
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Permissions:</div>
                      <div className="grid grid-cols-1 gap-1">
                        {permissionModules.map((module) => {
                          const permissions = role.permissions[module.id];
                          const hasPermissions = Object.values(permissions).some(Boolean);
                          
                          return (
                            <div 
                              key={module.id} 
                              className="flex items-center justify-between py-1 px-2 text-sm rounded-md bg-muted/40"
                            >
                              <div className="flex items-center gap-2">
                                <module.icon className="h-4 w-4 text-muted-foreground" />
                                <span>{module.name}</span>
                              </div>
                              {hasPermissions ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                                  <CheckSquare2 className="h-3 w-3 mr-1" />
                                  Granted
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300">
                                  <LockIcon className="h-3 w-3 mr-1" />
                                  No Access
                                </Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        {/* Staff Users Tab */}
        <TabsContent value="users" className="space-y-4 mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateUser} className="gap-2 shrink-0">
              <Plus className="h-4 w-4" />
              Add Staff User
            </Button>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No staff users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <img 
                            src={user.avatar} 
                            alt={user.username} 
                            className="w-8 h-8 rounded-full"
                          />
                          <span>{user.username}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/10 text-primary">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex flex-col">
                          <span className="text-xs text-muted-foreground">
                            {getTimeElapsed(user.lastActive)}
                          </span>
                          <span className="text-xs">
                            {formatDate(user.lastActive).split(',')[0]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={statusStyles[user.status].color + " text-white"}
                          variant="outline"
                        >
                          {statusStyles[user.status].text}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
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
      </Tabs>

      {/* Role Edit/Create Dialog */}
      <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Create New Role' : 'Edit Role'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Create a new role with specific permissions.' 
                : 'Modify permissions for this role.'}
            </DialogDescription>
          </DialogHeader>

          {selectedRole && (
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="role-name" className="text-sm font-medium">Role Name</label>
                    <Input 
                      id="role-name"
                      value={selectedRole.name}
                      onChange={(e) => setSelectedRole({...selectedRole, name: e.target.value})}
                      placeholder="Enter role name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="role-description" className="text-sm font-medium">Description</label>
                    <Input 
                      id="role-description"
                      value={selectedRole.description}
                      onChange={(e) => setSelectedRole({...selectedRole, description: e.target.value})}
                      placeholder="Enter role description"
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">Permissions</h3>
                  <div className="space-y-6">
                    {permissionModules.map((module) => (
                      <Card key={module.id}>
                        <CardHeader className="py-4">
                          <div className="flex items-center gap-2">
                            <module.icon className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">{module.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent className="py-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {Object.keys(selectedRole.permissions[module.id]).map((permission) => (
                              <div key={permission} className="flex items-center justify-between">
                                <label htmlFor={`${module.id}-${permission}`} className="text-sm capitalize">
                                  {permission}
                                </label>
                                <Switch
                                  id={`${module.id}-${permission}`}
                                  checked={selectedRole.permissions[module.id][permission]}
                                  onCheckedChange={() => togglePermission(module.id, permission)}
                                />
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setRoleDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveRole}
              disabled={!selectedRole?.name}
            >
              {dialogMode === 'create' ? 'Create Role' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Edit/Create Dialog */}
      <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Add Staff User' : 'Edit Staff User'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Create a new staff user account.' 
                : 'Update staff user information.'}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex justify-center mb-4">
                <img 
                  src={selectedUser.avatar} 
                  alt={selectedUser.username || 'New user'} 
                  className="w-20 h-20 rounded-full"
                />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="user-username" className="text-sm font-medium">Username</label>
                  <Input 
                    id="user-username"
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({...selectedUser, username: e.target.value})}
                    placeholder="Enter username"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="user-email" className="text-sm font-medium">Email</label>
                  <Input 
                    id="user-email"
                    type="email"
                    value={selectedUser.email}
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="user-role" className="text-sm font-medium">Role</label>
                  <Select 
                    value={selectedUser.role}
                    onValueChange={(value) => setSelectedUser({...selectedUser, role: value})}
                  >
                    <SelectTrigger id="user-role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="user-status" className="text-sm font-medium">Status</label>
                  <Select 
                    value={selectedUser.status}
                    onValueChange={(value) => setSelectedUser({...selectedUser, status: value})}
                  >
                    <SelectTrigger id="user-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {dialogMode === 'create' && (
                  <div className="mt-4 p-4 border rounded-md bg-yellow-50 dark:bg-yellow-900/20">
                    <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-300">
                      <KeyRound className="h-5 w-5" />
                      <div>
                        <div className="font-semibold">Password Reset Link</div>
                        <p className="text-sm">A password setup link will be sent to the user's email address.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setUserDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveUser}
              disabled={!selectedUser?.username || !selectedUser?.email || !selectedUser?.role}
            >
              {dialogMode === 'create' ? 'Create User' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesPermissions;
