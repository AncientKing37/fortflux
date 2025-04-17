-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  category TEXT NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  closed_at TIMESTAMP WITH TIME ZONE
);

-- Create ticket_messages table
CREATE TABLE IF NOT EXISTS ticket_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ticket_attachments table
CREATE TABLE IF NOT EXISTS ticket_attachments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  ticket_id UUID REFERENCES tickets(id) ON DELETE CASCADE,
  message_id UUID REFERENCES ticket_messages(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_attachments ENABLE ROW LEVEL SECURITY;

-- Tickets policies
CREATE POLICY "Users can view their own tickets"
  ON tickets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tickets"
  ON tickets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tickets"
  ON tickets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tickets"
  ON tickets FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role IN ('admin', 'support')
  ));

CREATE POLICY "Admins can update all tickets"
  ON tickets FOR UPDATE
  USING (auth.uid() IN (
    SELECT user_id FROM user_roles WHERE role IN ('admin', 'support')
  ));

-- Ticket messages policies
CREATE POLICY "Users can view their ticket messages"
  ON ticket_messages FOR SELECT
  USING (auth.uid() = user_id OR 
         auth.uid() IN (
           SELECT assigned_to FROM tickets WHERE id = ticket_id
         ));

CREATE POLICY "Users can create ticket messages"
  ON ticket_messages FOR INSERT
  WITH CHECK (auth.uid() = user_id OR 
              auth.uid() IN (
                SELECT assigned_to FROM tickets WHERE id = ticket_id
              ));

-- Ticket attachments policies
CREATE POLICY "Users can view their ticket attachments"
  ON ticket_attachments FOR SELECT
  USING (auth.uid() IN (
    SELECT user_id FROM tickets WHERE id = ticket_id
  ) OR auth.uid() IN (
    SELECT assigned_to FROM tickets WHERE id = ticket_id
  ));

CREATE POLICY "Users can create ticket attachments"
  ON ticket_attachments FOR INSERT
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM tickets WHERE id = ticket_id
  ) OR auth.uid() IN (
    SELECT assigned_to FROM tickets WHERE id = ticket_id
  ));

-- Create indexes
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_tickets_status ON tickets(status);
CREATE INDEX idx_tickets_priority ON tickets(priority);
CREATE INDEX idx_ticket_messages_ticket_id ON ticket_messages(ticket_id);
CREATE INDEX idx_ticket_attachments_ticket_id ON ticket_attachments(ticket_id);
CREATE INDEX idx_ticket_attachments_message_id ON ticket_attachments(message_id); 