import React, { useState } from 'react';
import { ArrowLeft, Plus, Home, MessageSquare, Bell, Settings, Calendar, DollarSign, Eye } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface HostDashboardProps {
  onBack: () => void;
  onAddProperty: () => void;
  onViewMessages: () => void;
}

export function HostDashboard({ onBack, onAddProperty, onViewMessages }: HostDashboardProps) {
  const [activeTab, setActiveTab] = useState('properties');

  // Mock data
  const properties = [
    {
      id: '1',
      title: 'Modern 3-Bedroom Apartment',
      location: 'Al Remal, Gaza City',
      price: 350,
      status: 'active',
      views: 156,
      bookings: 3,
      image: 'https://images.unsplash.com/photo-1651752523215-9bf678c29355?w=400',
    },
    {
      id: '2',
      title: 'Cozy 2-Bedroom House',
      location: 'Tel Al Hawa, Gaza City',
      price: 280,
      status: 'active',
      views: 89,
      bookings: 1,
      image: 'https://images.unsplash.com/photo-1756706718604-ef4af3970e33?w=400',
    },
  ];

  const bookingRequests = [
    {
      id: '1',
      propertyTitle: 'Modern 3-Bedroom Apartment',
      tenantName: 'Sara Mohammed',
      startDate: '2025-01-01',
      duration: '6 months',
      status: 'pending',
      message: 'Hi, I\'m interested in renting your apartment. I have a family of 4.',
    },
    {
      id: '2',
      propertyTitle: 'Cozy 2-Bedroom House',
      tenantName: 'Khaled Omar',
      startDate: '2025-01-15',
      duration: '3 months',
      status: 'pending',
      message: 'Looking for a temporary place. Can we discuss the terms?',
    },
  ];

  const stats = {
    totalProperties: 2,
    activeBookings: 3,
    totalEarnings: 1050,
    pendingRequests: 2,
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8DA87A] to-[#A5B88A] px-4 py-4 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-white">Host Dashboard</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#666666]">Total Properties</p>
                  <p className="text-[#8DA87A]">{stats.totalProperties}</p>
                </div>
                <Home className="w-8 h-8 text-[#8DA87A]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#666666]">Active Bookings</p>
                  <p className="text-[#8DA87A]">{stats.activeBookings}</p>
                </div>
                <Calendar className="w-8 h-8 text-[#8DA87A]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#666666]">Total Earnings</p>
                  <p className="text-[#8DA87A]">${stats.totalEarnings}</p>
                </div>
                <DollarSign className="w-8 h-8 text-[#8DA87A]/30" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[#666666]">Pending Requests</p>
                  <p className="text-[#8DA87A]">{stats.pendingRequests}</p>
                </div>
                <Bell className="w-8 h-8 text-[#8DA87A]/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#333333]">Manage Your Listings</CardTitle>
              <Button
                onClick={onAddProperty}
                className="bg-[#8DA87A] hover:bg-[#7a9569] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Property
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="properties">My Properties</TabsTrigger>
                <TabsTrigger value="requests">
                  Booking Requests
                  {stats.pendingRequests > 0 && (
                    <Badge className="ml-2 bg-[#8DA87A]">{stats.pendingRequests}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="properties" className="space-y-4">
                {properties.map((property) => (
                  <Card key={property.id} className="border border-[#C8D1B0]/30">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="text-[#333333]">{property.title}</h3>
                              <p className="text-[#666666]">{property.location}</p>
                            </div>
                            <Badge className="bg-green-100 text-green-800">
                              {property.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 mt-4">
                            <div>
                              <p className="text-[#666666]">Price</p>
                              <p className="text-[#333333]">${property.price}/mo</p>
                            </div>
                            <div>
                              <p className="text-[#666666]">Views</p>
                              <p className="text-[#333333] flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                {property.views}
                              </p>
                            </div>
                            <div>
                              <p className="text-[#666666]">Bookings</p>
                              <p className="text-[#333333]">{property.bookings}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 mt-4">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#8DA87A] text-[#8DA87A] hover:bg-[#8DA87A]/10"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#8DA87A] text-[#8DA87A] hover:bg-[#8DA87A]/10"
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="requests" className="space-y-4">
                {bookingRequests.map((request) => (
                  <Card key={request.id} className="border border-[#C8D1B0]/30">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-[#333333]">{request.propertyTitle}</h3>
                          <p className="text-[#666666]">Request from: {request.tenantName}</p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">
                          {request.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-3 text-[#666666]">
                        <div>
                          <p>Start Date</p>
                          <p className="text-[#333333]">{request.startDate}</p>
                        </div>
                        <div>
                          <p>Duration</p>
                          <p className="text-[#333333]">{request.duration}</p>
                        </div>
                      </div>

                      <div className="bg-[#C8D1B0]/10 p-3 rounded-lg mb-3">
                        <p className="text-[#666666]">{request.message}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-[#8DA87A] hover:bg-[#7a9569] text-white"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={onViewMessages}
                          className="border-[#8DA87A] text-[#8DA87A] hover:bg-[#8DA87A]/10"
                        >
                          <MessageSquare className="w-4 h-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
