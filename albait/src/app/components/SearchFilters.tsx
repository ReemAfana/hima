import React, { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SearchFiltersProps {
  onBack: () => void;
  onSearch: (filters: FilterValues) => void;
}

export interface FilterValues {
  searchQuery: string;
  minPrice: string;
  maxPrice: string;
  area: string;
  neighborhood: string;
  rooms: string;
  conditions: string[];
}

export function SearchFilters({ onBack, onSearch }: SearchFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    searchQuery: '',
    minPrice: '',
    maxPrice: '',
    area: '',
    neighborhood: '',
    rooms: '',
    conditions: [],
  });

  const areas = ['North Gaza', 'Gaza City', 'Middle Area', 'Khan Younis', 'Rafah'];
  
  const neighborhoods: Record<string, string[]> = {
    'Gaza City': ['Al Remal', 'Shuja\'iyya', 'Tel Al Hawa', 'Al Zaytoun', 'Al Nasr'],
    'North Gaza': ['Jabalia', 'Beit Hanoun', 'Beit Lahia'],
    'Khan Younis': ['Khan Younis Camp', 'Al Qarara', 'Abasan'],
    'Middle Area': ['Deir Al Balah', 'Nuseirat', 'Bureij'],
    'Rafah': ['Rafah City', 'Tal Al Sultan', 'Brazil'],
  };

  const conditions = [
    'Ready to move',
    'Partially damaged',
    'Burnt room',
    'Broken windows',
    'Unfinished plaster',
    'Major structural damage',
  ];

  const handleConditionToggle = (condition: string) => {
    setFilters(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const handleSearch = () => {
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters({
      searchQuery: '',
      minPrice: '',
      maxPrice: '',
      area: '',
      neighborhood: '',
      rooms: '',
      conditions: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8DA87A] via-[#A5B88A] to-[#C8D1B0] p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#333333] flex items-center gap-2">
                <SlidersHorizontal className="w-6 h-6 text-[#8DA87A]" />
                Search & Filter Properties
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-[#8DA87A]"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Search Query */}
            <div>
              <Label htmlFor="search" className="text-[#333333]">Search</Label>
              <div className="relative mt-2">
                <Input
                  id="search"
                  placeholder="Search by title, location..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="pl-10 border-[#C8D1B0] focus:border-[#8DA87A]"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8DA87A]" />
              </div>
            </div>

            {/* Price Range */}
            <div>
              <Label className="text-[#333333] mb-2">Price Range (per month)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Min price"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="border-[#C8D1B0] focus:border-[#8DA87A]"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    placeholder="Max price"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="border-[#C8D1B0] focus:border-[#8DA87A]"
                  />
                </div>
              </div>
            </div>

            {/* Area Selection */}
            <div>
              <Label htmlFor="area" className="text-[#333333]">Area</Label>
              <Select value={filters.area} onValueChange={(value) => setFilters({ ...filters, area: value, neighborhood: '' })}>
                <SelectTrigger className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A]">
                  <SelectValue placeholder="Select area" />
                </SelectTrigger>
                <SelectContent>
                  {areas.map((area) => (
                    <SelectItem key={area} value={area}>{area}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Neighborhood Selection */}
            {filters.area && neighborhoods[filters.area] && (
              <div>
                <Label htmlFor="neighborhood" className="text-[#333333]">Neighborhood</Label>
                <Select value={filters.neighborhood} onValueChange={(value) => setFilters({ ...filters, neighborhood: value })}>
                  <SelectTrigger className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A]">
                    <SelectValue placeholder="Select neighborhood" />
                  </SelectTrigger>
                  <SelectContent>
                    {neighborhoods[filters.area].map((neighborhood) => (
                      <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Number of Rooms */}
            <div>
              <Label htmlFor="rooms" className="text-[#333333]">Number of Rooms</Label>
              <Select value={filters.rooms} onValueChange={(value) => setFilters({ ...filters, rooms: value })}>
                <SelectTrigger className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A]">
                  <SelectValue placeholder="Select rooms" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 Room</SelectItem>
                  <SelectItem value="2">2 Rooms</SelectItem>
                  <SelectItem value="3">3 Rooms</SelectItem>
                  <SelectItem value="4">4 Rooms</SelectItem>
                  <SelectItem value="5+">5+ Rooms</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* House Condition */}
            <div>
              <Label className="text-[#333333] mb-3">House Condition</Label>
              <div className="space-y-3">
                {conditions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2">
                    <Checkbox
                      id={condition}
                      checked={filters.conditions.includes(condition)}
                      onCheckedChange={() => handleConditionToggle(condition)}
                      className="border-[#8DA87A] data-[state=checked]:bg-[#8DA87A]"
                    />
                    <label
                      htmlFor={condition}
                      className="text-[#333333] cursor-pointer"
                    >
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 border-[#8DA87A] text-[#8DA87A] hover:bg-[#8DA87A]/10"
              >
                Reset Filters
              </Button>
              <Button
                onClick={handleSearch}
                className="flex-1 bg-[#8DA87A] hover:bg-[#7a9569] text-white"
              >
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
