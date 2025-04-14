
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface StatusFilterProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({ statusFilter, setStatusFilter }) => {
  return (
    <div className="mb-6">
      <Select
        value={statusFilter}
        onValueChange={setStatusFilter}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Listings</SelectItem>
          <SelectItem value="available">Available</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="sold">Sold</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default StatusFilter;
