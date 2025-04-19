import React, { useState, useEffect } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/integrations/supabase/client';
import { MessageSquare, Loader2, Users, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface SupportTicket {
  id: string;
  user_id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
}

const SupportDashboard: React.FC = () => {
  const { user } = useUser();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('support_tickets')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (err) {
      console.error('Error fetching support tickets:', err);
      setError('Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <p className="text-red-500">{error}</p>
      </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Support Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
                            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-yellow-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Total Tickets</h3>
                <p className="text-2xl font-bold">{tickets.length}</p>
                    </div>
            </div>
            </div>
            
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-500 mr-4" />
              <div>
                <h3 className="text-lg font-semibold">Active Tickets</h3>
                <p className="text-2xl font-bold">
                  {tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length}
                      </p>
                    </div>
                  </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center">
              <AlertCircle className="w-8 h-8 text-red-500 mr-4" />
                          <div>
                <h3 className="text-lg font-semibold">Urgent Tickets</h3>
                <p className="text-2xl font-bold">0</p>
                          </div>
                          </div>
                        </div>
                        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Tickets</h2>
            {tickets.length === 0 ? (
              <p className="text-gray-500">No support tickets found</p>
                      ) : (
                        <div className="space-y-4">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border-b last:border-b-0 pb-4 last:pb-0"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{ticket.subject}</h3>
                        <p className="text-sm text-gray-500">
                          Created: {new Date(ticket.created_at).toLocaleString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        ticket.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        ticket.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>
    </div>
    </DashboardLayout>
  );
};

export default SupportDashboard;
