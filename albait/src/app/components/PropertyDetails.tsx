import React, { useState } from 'react';
import { ArrowLeft, Star, MapPin, Home, DollarSign, Calendar, AlertTriangle, User, ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

interface PropertyDetailsProps {
  propertyId: string;
  onBack: () => void;
  onBookNow: (propertyId: string) => void;
}

export function PropertyDetails({ propertyId, onBack, onBookNow }: PropertyDetailsProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock property data
  const property = {
    id: propertyId,
    title: 'Modern 3-Bedroom Apartment in Al Remal',
    location: 'Gaza City',
    neighborhood: 'Al Remal',
    price: 350,
    rooms: 3,
    rating: 4.7,
    reviewCount: 24,
    hostName: 'Ahmed Hassan',
    hostRating: 4.9,
    hostListings: 5,
    images: [
      'https://images.unsplash.com/photo-1651752523215-9bf678c29355?w=800',
      'https://images.unsplash.com/photo-1756706718604-ef4af3970e33?w=800',
      'https://images.unsplash.com/photo-1630912121186-16bea8d6f241?w=800',
    ],
    description: 'Beautiful 3-bedroom apartment located in the heart of Al Remal. This spacious property features modern amenities and is close to schools, markets, and public transportation. Perfect for families looking for a comfortable living space.',
    damageConditions: [
      { type: 'Broken windows', description: 'Two windows in the living room need replacement', severity: 'medium' },
      { type: 'Cracked walls', description: 'Minor cracks in bedroom wall, cosmetic only', severity: 'low' },
    ],
    amenities: ['Water', 'Electricity', 'Internet ready', 'Parking available'],
    minimumStay: '1 month',
    paymentMethod: 'Monthly',
    rules: [
      'No smoking inside the property',
      'Pets allowed with deposit',
      'Quiet hours after 10 PM',
      'Tenant responsible for utilities',
    ],
  };

  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Sara Mohammed',
      rating: 5,
      comment: 'Excellent property with a great host. The location is perfect and the apartment was as described. Ahmed was very responsive to all our questions.',
      date: '2025-11-15',
      images: ['https://images.unsplash.com/photo-1628624747186-a941c476b7ef?w=400'],
    },
    {
      id: '2',
      userName: 'Khaled Omar',
      rating: 4,
      comment: 'Good value for money. The apartment is spacious and comfortable. Minor issues with windows but the host was transparent about it upfront.',
      date: '2025-10-28',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8DA87A] to-[#A5B88A] px-4 py-4 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-white">Property Details</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="aspect-video relative bg-[#C8D1B0]/20">
                <img 
                  src={property.images[currentImageIndex]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Property Info */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-[#333333] mb-2">{property.title}</h2>
                    <div className="flex items-center gap-2 text-[#666666]">
                      <MapPin className="w-4 h-4 text-[#8DA87A]" />
                      <span>{property.neighborhood}, {property.location}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#8DA87A]/10 px-3 py-2 rounded-lg">
                    <Star className="w-5 h-5 fill-[#8DA87A] text-[#8DA87A]" />
                    <span className="text-[#333333]">{property.rating}</span>
                    <span className="text-[#666666]">({property.reviewCount})</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-y border-[#C8D1B0]/30">
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-[#8DA87A]" />
                    <div>
                      <p className="text-[#666666]">Rooms</p>
                      <p className="text-[#333333]">{property.rooms}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#8DA87A]" />
                    <div>
                      <p className="text-[#666666]">Price</p>
                      <p className="text-[#333333]">${property.price}/mo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#8DA87A]" />
                    <div>
                      <p className="text-[#666666]">Min Stay</p>
                      <p className="text-[#333333]">{property.minimumStay}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#8DA87A]" />
                    <div>
                      <p className="text-[#666666]">Payment</p>
                      <p className="text-[#333333]">{property.paymentMethod}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-[#333333] mb-3">Description</h3>
                  <p className="text-[#666666] leading-relaxed">{property.description}</p>
                </div>

                <div className="mt-6">
                  <h3 className="text-[#333333] mb-3">Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="bg-[#C8D1B0]/30 text-[#333333]">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Damage Conditions */}
            {property.damageConditions.length > 0 && (
              <Card className="border-0 shadow-lg border-l-4 border-l-orange-400">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    <h3 className="text-[#333333]">Property Condition Notes</h3>
                  </div>
                  <div className="space-y-3">
                    {property.damageConditions.map((condition, index) => (
                      <div key={index} className="bg-orange-50 p-4 rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-[#333333]">{condition.type}</p>
                          <Badge 
                            variant={condition.severity === 'high' ? 'destructive' : 'secondary'}
                            className={condition.severity === 'medium' ? 'bg-orange-200 text-orange-900' : ''}
                          >
                            {condition.severity}
                          </Badge>
                        </div>
                        <p className="text-[#666666]">{condition.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Rules */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-[#333333] mb-4">Property Rules</h3>
                <ul className="space-y-2">
                  {property.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-[#666666]">
                      <span className="text-[#8DA87A] mt-1">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-[#333333] mb-4">Reviews ({reviews.length})</h3>
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b border-[#C8D1B0]/30 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-[#8DA87A] flex items-center justify-center text-white">
                            {review.userName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-[#333333]">{review.userName}</p>
                            <p className="text-[#999999]">{review.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-[#8DA87A] text-[#8DA87A]" />
                          <span className="text-[#333333]">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-[#666666] mb-3">{review.comment}</p>
                      {review.images && review.images.length > 0 && (
                        <div className="flex gap-2">
                          {review.images.map((img, idx) => (
                            <img 
                              key={idx}
                              src={img} 
                              alt="Review"
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Booking Card */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <p className="text-[#666666]">Monthly Rate</p>
                    <p className="text-[#8DA87A]">${property.price}</p>
                  </div>
                  <Button
                    onClick={() => onBookNow(propertyId)}
                    className="w-full bg-[#8DA87A] hover:bg-[#7a9569] text-white"
                  >
                    Book Now
                  </Button>
                  <p className="text-[#999999] text-center mt-4">
                    You won't be charged yet
                  </p>
                </CardContent>
              </Card>

              {/* Host Info */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-full bg-[#8DA87A] flex items-center justify-center text-white">
                      <User className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[#333333]">Hosted by</p>
                      <p className="text-[#333333]">{property.hostName}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-[#666666]">
                    <div className="flex items-center justify-between">
                      <span>Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-[#8DA87A] text-[#8DA87A]" />
                        <span>{property.hostRating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Listings</span>
                      <span>{property.hostListings} properties</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 border-[#8DA87A] text-[#8DA87A] hover:bg-[#8DA87A]/10"
                  >
                    Contact Host
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
