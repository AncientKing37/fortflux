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
          className="w-full flex items-center justify-center bg-yellow-400 text-black hover:bg-yellow-500 border-yellow-500"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="mr-2 h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>
      
      <div className={`w-full md:w-72 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="bg-gradient-to-br from-yellow-400 via-yellow-300 to-white p-6 rounded-xl shadow-2xl border border-yellow-400/20">
          <h2 className="text-xl font-bold mb-6 text-black flex items-center">
            <SlidersHorizontal className="mr-2 h-5 w-5" />
            Filters
          </h2>
          
          <Accordion type="single" collapsible className="mb-2 space-y-2" defaultValue="price">
            <AccordionItem value="price" className="border-b border-black/10 bg-white/40 rounded-lg">
              <AccordionTrigger className="px-4 py-3 text-black hover:text-yellow-600 hover:no-underline">
                Price Range
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
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
                    <div className="bg-black/5 px-3 py-2 rounded-lg font-medium text-black">
                      ${priceRange[0]}
                    </div>
                    <div className="bg-black/5 px-3 py-2 rounded-lg font-medium text-black">
                      ${priceRange[1]}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="skins" className="border-b border-black/10 bg-white/40 rounded-lg">
              <AccordionTrigger className="px-4 py-3 text-black hover:text-yellow-600 hover:no-underline">
                Skins
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
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
                    <div className="text-sm text-black/70">Minimum Skins</div>
                    <div className="bg-black/5 px-3 py-2 rounded-lg font-medium text-black">
                      {minSkins}+
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="rarity" className="border-b border-black/10 bg-white/40 rounded-lg">
              <AccordionTrigger className="px-4 py-3 text-black hover:text-yellow-600 hover:no-underline">
                Rarity
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Select value={rarity} onValueChange={setRarity}>
                  <SelectTrigger className="bg-white border-yellow-400 focus:ring-yellow-400 rounded-lg">
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
            
            <AccordionItem value="features" className="border-b border-black/10 bg-white/40 rounded-lg">
              <AccordionTrigger className="px-4 py-3 text-black hover:text-yellow-600 hover:no-underline">
                Special Features
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="battlepass" 
                      checked={hasBattlePass}
                      onCheckedChange={(checked) => setHasBattlePass(checked === true)}
                      className="border-yellow-400 text-yellow-400 rounded"
                    />
                    <label htmlFor="battlepass" className="text-sm font-medium leading-none cursor-pointer text-black">
                      Has Battle Pass
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="date" className="border-b border-black/10 bg-white/40 rounded-lg">
              <AccordionTrigger className="px-4 py-3 text-black hover:text-yellow-600 hover:no-underline">
                Date Listed
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <Select value={dateRange.toString()} onValueChange={(value) => setDateRange(parseInt(value))}>
                  <SelectTrigger className="bg-white border-yellow-400 focus:ring-yellow-400 rounded-lg">
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
          
          <div className="pt-4 border-t border-black/10 mt-4">
            <h3 className="text-sm font-bold mb-3 text-black">Sort By</h3>
            <Select 
              value={sortBy} 
              onValueChange={setSortBy}
            >
              <SelectTrigger className="bg-white border-yellow-400 focus:ring-yellow-400 rounded-lg">
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
            className="w-full mt-6 bg-black text-white hover:bg-yellow-400 hover:text-black border-black transition-colors rounded-lg"
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
