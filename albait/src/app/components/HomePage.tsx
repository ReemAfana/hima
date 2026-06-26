import React from 'react';
import { Search, Star, MapPin, Home as HomeIcon, DollarSign } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Property {
  id: string;
  title: string;
  location: string;
  neighborhood: string;
  price: number;
  rooms: number;
  rating: number;
  reviewCount: number;
  hostName: string;
  image: string;
  condition: string;
}

interface HomePageProps {
  onPropertyClick: (id: string) => void;
  onSearchClick: () => void;
  properties: Property[];
}

export function HomePage({ onPropertyClick, onSearchClick, properties }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8DA87A] via-[#A5B88A] to-[#C8D1B0]">
      {/* Search Bar Section */}
      <div className="pt-6 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Input
              placeholder="Search properties in Gaza..."
              className="w-full h-12 pl-12 pr-4 rounded-full bg-white/95 backdrop-blur border-0 shadow-lg"
              onClick={onSearchClick}
              readOnly
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8DA87A]" />
          </div>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h2 className="text-white">Available Properties</h2>
            <p className="text-white/80 mt-1">Browse rentals sorted by rating</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card 
                key={property.id} 
                className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer bg-white/95 backdrop-blur border-0"
                onClick={() => onPropertyClick(property.id)}
              >
                <div className="aspect-video relative overflow-hidden bg-[#C8D1B0]/20">
                  <img 
                    src={property.image} 
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#8DA87A] text-[#8DA87A]" />
                    <span className="text-[#333333]">{property.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="text-[#333333] mb-2">{property.title}</h3>
                  
                  <div className="flex items-center gap-2 text-[#666666] mb-2">
                    <MapPin className="w-4 h-4 text-[#8DA87A]" />
                    <span>{property.neighborhood}, {property.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-3 text-[#666666]">
                    <div className="flex items-center gap-1">
                      <HomeIcon className="w-4 h-4 text-[#8DA87A]" />
                      <span>{property.rooms} rooms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-[#8DA87A]" />
                      <span>${property.price}/month</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#C8D1B0]/30">
                    <div>
                      <p className="text-[#666666]">Host: {property.hostName}</p>
                      <p className="text-[#999999]">{property.reviewCount} reviews</p>
                    </div>
                    <Button 
                      className="bg-[#8DA87A] hover:bg-[#7a9569] text-white"
                      size="sm"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
