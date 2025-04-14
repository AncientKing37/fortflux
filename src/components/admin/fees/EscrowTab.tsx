
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Crown } from 'lucide-react';
import CustomTooltip from './CustomTooltip';

interface EscrowAgentData {
  id: string;
  name: string;
  avatar: string;
  earnings: number;
  transactions: number;
  responseTime: number;
  successRate: number;
  rank: string;
}

interface EscrowTabProps {
  escrowAgentData: EscrowAgentData[];
}

const EscrowTab: React.FC<EscrowTabProps> = ({ escrowAgentData }) => {
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle>Escrow Agent Earnings</CardTitle>
          <CardDescription>Performance and earnings of escrow agents</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agent</TableHead>
                  <TableHead>Earnings</TableHead>
                  <TableHead>Transactions</TableHead>
                  <TableHead className="hidden md:table-cell">Response Time</TableHead>
                  <TableHead className="hidden md:table-cell">Success Rate</TableHead>
                  <TableHead>Rank</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {escrowAgentData.map((agent) => (
                  <TableRow key={agent.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <img 
                          src={agent.avatar} 
                          alt={agent.name} 
                          className="w-8 h-8 rounded-full"
                        />
                        <span className="font-medium">{agent.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>${agent.earnings.toFixed(2)}</TableCell>
                    <TableCell>{agent.transactions}</TableCell>
                    <TableCell className="hidden md:table-cell">{agent.responseTime} min</TableCell>
                    <TableCell className="hidden md:table-cell">{agent.successRate}%</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Crown className={`h-4 w-4 ${
                          agent.rank === 'Platinum' ? 'text-purple-500' :
                          agent.rank === 'Gold' ? 'text-yellow-500' :
                          agent.rank === 'Silver' ? 'text-gray-400' :
                          'text-amber-800'
                        }`} />
                        <span>{agent.rank}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Agent Performance Comparison</CardTitle>
            <CardDescription>Earnings vs. transactions handled</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={escrowAgentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="earnings" name="Earnings ($)" fill="#8884d8" />
                <Bar yAxisId="right" dataKey="transactions" name="Transactions" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Agent Response Time</CardTitle>
            <CardDescription>Average time to respond to requests</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={escrowAgentData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="responseTime" name="Response Time (min)" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Agent Success Rate</CardTitle>
          <CardDescription>Percentage of successfully completed transactions</CardDescription>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={escrowAgentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[90, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="successRate" name="Success Rate (%)" fill="#82ca9d">
                {escrowAgentData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={
                      entry.successRate >= 99 ? '#4ade80' :
                      entry.successRate >= 97 ? '#a3e635' :
                      entry.successRate >= 95 ? '#facc15' :
                      '#f87171'
                    } 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default EscrowTab;
