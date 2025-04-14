
import React from 'react';
import { 
  Slider 
} from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, Star } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';

interface MarketplaceFiltersProps {
  priceRange: [number, number];
  setPriceRange: React.Dispatch<React.SetStateAction<[number, number]>>;
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
  showFilters: boolean;
  setShowFilters: React.Dispatch<React.SetStateAction<boolean>>;
  resetFilters: () => void;
  minSkins: number;
  setMinSkins: React.Dispatch<React.SetStateAction<number>>;
  rarity: string;
  setRarity: React.Dispatch<React.SetStateAction<string>>;
  hasBattlePass: boolean;
  setHasBattlePass: React.Dispatch<React.SetStateAction<boolean>>;
  dateRange: number;
  setDateRange: React.Dispatch<React.SetStateAction<number>>;
}

const MarketplaceFilters: React.FC<MarketplaceFiltersProps> = ({
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters,
  resetFilters,
  minSkins,
  setMinSkins,
  rarity,
  setRarity,
  hasBattlePass,
  setHasBattlePass,
  dateRange,
  setDateRange
}) => {
  return (
    <>
      <div className="md:hidden mb-4">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      
      <div className={`w-full md:w-1/4 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-6">Filters</h2>
          
          <Accordion type="single" collapsible className="mb-2" defaultValue="price">
            <AccordionItem value="price">
              <AccordionTrigger className="py-2">Price Range</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="my-6"
                  />
                  <div className="flex items-center justify-between">
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      ${priceRange[0]}
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      ${priceRange[1]}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="skins">
              <AccordionTrigger className="py-2">Skins</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <Slider
                    defaultValue={[0]}
                    max={500}
                    step={10}
                    value={[minSkins]}
                    onValueChange={(value) => setMinSkins(value[0])}
                    className="my-6"
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Minimum Skins</div>
                    <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded">
                      {minSkins}+
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="rarity">
              <AccordionTrigger className="py-2">Rarity</AccordionTrigger>
              <AccordionContent>
                <Select value={rarity} onValueChange={setRarity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rarity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Rarities</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="very high">Very High</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="features">
              <AccordionTrigger className="py-2">Special Features</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="battlepass" 
                      checked={hasBattlePass}
                      onCheckedChange={(checked) => setHasBattlePass(checked === true)}
                    />
                    <label htmlFor="battlepass" className="text-sm font-medium leading-none cursor-pointer">
                      Has Battle Pass
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="date">
              <AccordionTrigger className="py-2">Date Listed</AccordionTrigger>
              <AccordionContent>
                <Select value={dateRange.toString()} onValueChange={(value) => setDateRange(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any time</SelectItem>
                    <SelectItem value="1">Today</SelectItem>
                    <SelectItem value="7">Last week</SelectItem>
                    <SelectItem value="30">Last month</SelectItem>
                    <SelectItem value="90">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="pt-4 border-t mt-4">
            <h3 className="text-sm font-medium mb-2">Sort By</h3>
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="most-skins">Most Skins</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-6"
            onClick={resetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default MarketplaceFilters;
