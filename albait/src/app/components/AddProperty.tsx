import React, { useState } from 'react';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface AddPropertyProps {
  onBack: () => void;
  onSubmit: () => void;
}

export function AddProperty({ onBack, onSubmit }: AddPropertyProps) {
  const [formData, setFormData] = useState({
    title: '',
    area: '',
    neighborhood: '',
    price: '',
    rooms: '',
    minimumStay: '',
    paymentMethod: 'monthly',
    description: '',
    rules: '',
    conditions: [] as string[],
  });

  const areas = ['North Gaza', 'Gaza City', 'Middle Area', 'Khan Younis', 'Rafah'];
  
  const neighborhoods: Record<string, string[]> = {
    'Gaza City': ['Al Remal', 'Shuja\'iyya', 'Tel Al Hawa', 'Al Zaytoun', 'Al Nasr'],
    'North Gaza': ['Jabalia', 'Beit Hanoun', 'Beit Lahia'],
    'Khan Younis': ['Khan Younis Camp', 'Al Qarara', 'Abasan'],
    'Middle Area': ['Deir Al Balah', 'Nuseirat', 'Bureij'],
    'Rafah': ['Rafah City', 'Tal Al Sultan', 'Brazil'],
  };

  const damageConditions = [
    'Ready to move',
    'Partially damaged',
    'Burnt room',
    'Broken windows',
    'Cracked walls',
    'Water leakage',
    'Needs plaster',
    'Major structural damage',
  ];

  const handleConditionToggle = (condition: string) => {
    setFormData(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, this would send data to backend
    onSubmit();
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#8DA87A] to-[#A5B88A] px-4 py-4 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-white">Add New Property</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-[#333333]">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-[#333333]">Property Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Modern 3-Bedroom Apartment"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area" className="text-[#333333]">Area</Label>
                  <Select 
                    value={formData.area} 
                    onValueChange={(value) => setFormData({ ...formData, area: value, neighborhood: '' })}
                  >
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

                {formData.area && neighborhoods[formData.area] && (
                  <div>
                    <Label htmlFor="neighborhood" className="text-[#333333]">Neighborhood</Label>
                    <Select 
                      value={formData.neighborhood} 
                      onValueChange={(value) => setFormData({ ...formData, neighborhood: value })}
                    >
                      <SelectTrigger className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A]">
                        <SelectValue placeholder="Select neighborhood" />
                      </SelectTrigger>
                      <SelectContent>
                        {neighborhoods[formData.area].map((neighborhood) => (
                          <SelectItem key={neighborhood} value={neighborhood}>{neighborhood}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price" className="text-[#333333]">Monthly Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="350"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A]"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="rooms" className="text-[#333333]">Number of Rooms</Label>
                  <Select 
                    value={formData.rooms} 
                    onValueChange={(value) => setFormData({ ...formData, rooms: value })}
                  >
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

                <div>
                  <Label htmlFor="minimumStay" className="text-[#333333]">Minimum Stay</Label>
                  <Select 
                    value={formData.minimumStay} 
                    onValueChange={(value) => setFormData({ ...formData, minimumStay: value })}
                  >
                    <SelectTrigger className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A]">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1 month">1 month</SelectItem>
                      <SelectItem value="3 months">3 months</SelectItem>
                      <SelectItem value="6 months">6 months</SelectItem>
                      <SelectItem value="1 year">1 year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-[#333333]">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your property, its features, location advantages..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A] min-h-[120px]"
                  required
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-[#333333]">Property Condition</CardTitle>
            </CardHeader>
            <CardContent>
              <Label className="text-[#333333] mb-3">Select all conditions that apply</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                {damageConditions.map((condition) => (
                  <div key={condition} className="flex items-center space-x-2 p-3 border border-[#C8D1B0]/30 rounded-lg hover:bg-[#C8D1B0]/5">
                    <Checkbox
                      id={condition}
                      checked={formData.conditions.includes(condition)}
                      onCheckedChange={() => handleConditionToggle(condition)}
                      className="border-[#8DA87A] data-[state=checked]:bg-[#8DA87A]"
                    />
                    <label
                      htmlFor={condition}
                      className="text-[#333333] cursor-pointer flex-1"
                    >
                      {condition}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-[#333333]">Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-[#C8D1B0] rounded-lg p-8 text-center hover:border-[#8DA87A] transition-colors cursor-pointer">
                <Upload className="w-12 h-12 text-[#8DA87A] mx-auto mb-3" />
                <p className="text-[#333333] mb-2">Click to upload photos</p>
                <p className="text-[#666666]">Upload up to 10 photos of your property</p>
                <input type="file" multiple accept="image/*" className="hidden" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-[#333333]">Rules & Policies</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="rules" className="text-[#333333]">Property Rules</Label>
              <Textarea
                id="rules"
                placeholder="e.g., No smoking, Pets allowed with deposit, Quiet hours after 10 PM"
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A] min-h-[100px]"
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 border-[#8DA87A] text-[#8DA87A] hover:bg-[#8DA87A]/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#8DA87A] hover:bg-[#7a9569] text-white"
            >
              Publish Property
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
