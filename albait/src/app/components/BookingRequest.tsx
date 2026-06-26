import React, { useState } from 'react';
import { ArrowLeft, Calendar, DollarSign, AlertTriangle, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';

interface BookingRequestProps {
  propertyId: string;
  propertyTitle: string;
  price: number;
  onBack: () => void;
  onSubmit: () => void;
}

export function BookingRequest({ propertyId, propertyTitle, price, onBack, onSubmit }: BookingRequestProps) {
  const [formData, setFormData] = useState({
    startDate: '',
    duration: '',
    message: '',
    agreeToTerms: false,
    agreeToDamage: false,
    agreeToDeposit: false,
  });

  const calculateTotal = () => {
    if (!formData.duration) return 0;
    const months = parseInt(formData.duration);
    return price * months;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms || !formData.agreeToDamage || !formData.agreeToDeposit) {
      alert('Please agree to all terms and conditions');
      return;
    }
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
          <h1 className="text-white">Booking Request</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#333333]">Booking Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-[#666666]">Property</Label>
                    <p className="text-[#333333] mt-1">{propertyTitle}</p>
                  </div>

                  <div>
                    <Label htmlFor="startDate" className="text-[#333333]">Start Date</Label>
                    <div className="relative mt-2">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8DA87A]" />
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="pl-10 border-[#C8D1B0] focus:border-[#8DA87A]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="duration" className="text-[#333333]">Rental Duration</Label>
                    <Select 
                      value={formData.duration} 
                      onValueChange={(value) => setFormData({ ...formData, duration: value })}
                    >
                      <SelectTrigger className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A]">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 month</SelectItem>
                        <SelectItem value="3">3 months</SelectItem>
                        <SelectItem value="6">6 months</SelectItem>
                        <SelectItem value="12">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="message" className="text-[#333333]">Message to Host (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Introduce yourself and explain why you're interested in this property..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="mt-2 border-[#C8D1B0] focus:border-[#8DA87A] min-h-[100px]"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg border-l-4 border-l-[#8DA87A]">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#8DA87A]" />
                    <CardTitle className="text-[#333333]">Terms & Conditions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start space-x-3 p-4 border border-[#C8D1B0]/30 rounded-lg">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
                      className="mt-1 border-[#8DA87A] data-[state=checked]:bg-[#8DA87A]"
                    />
                    <div className="flex-1">
                      <label htmlFor="terms" className="text-[#333333] cursor-pointer">
                        I agree to the cancellation policy
                      </label>
                      <p className="text-[#666666] mt-1">
                        Cancellation within 7 days of booking: Full refund minus service fee. After 7 days: 50% refund. No refund after move-in date.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-[#C8D1B0]/30 rounded-lg">
                    <Checkbox
                      id="damage"
                      checked={formData.agreeToDamage}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeToDamage: checked as boolean })}
                      className="mt-1 border-[#8DA87A] data-[state=checked]:bg-[#8DA87A]"
                    />
                    <div className="flex-1">
                      <label htmlFor="damage" className="text-[#333333] cursor-pointer">
                        I accept responsibility for any damage
                      </label>
                      <p className="text-[#666666] mt-1">
                        I understand that I am responsible for any damage caused to the property during my stay, beyond normal wear and tear.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-[#C8D1B0]/30 rounded-lg">
                    <Checkbox
                      id="deposit"
                      checked={formData.agreeToDeposit}
                      onCheckedChange={(checked) => setFormData({ ...formData, agreeToDeposit: checked as boolean })}
                      className="mt-1 border-[#8DA87A] data-[state=checked]:bg-[#8DA87A]"
                    />
                    <div className="flex-1">
                      <label htmlFor="deposit" className="text-[#333333] cursor-pointer">
                        I agree to the security deposit terms
                      </label>
                      <p className="text-[#666666] mt-1">
                        A security deposit equal to one month's rent will be required. This will be refunded within 14 days after move-out, minus any deductions for damages.
                      </p>
                    </div>
                  </div>
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
                  Send Booking Request
                </Button>
              </div>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-[#333333]">Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-[#666666]">Property</p>
                    <p className="text-[#333333]">{propertyTitle}</p>
                  </div>

                  <div className="border-t border-[#C8D1B0]/30 pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#666666]">Monthly rent</span>
                      <span className="text-[#333333]">${price}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#666666]">Duration</span>
                      <span className="text-[#333333]">
                        {formData.duration ? `${formData.duration} month${formData.duration !== '1' ? 's' : ''}` : '-'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[#666666]">Security deposit</span>
                      <span className="text-[#333333]">${price}</span>
                    </div>
                  </div>

                  <div className="border-t border-[#C8D1B0]/30 pt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[#333333]">Total</span>
                      <span className="text-[#8DA87A]">
                        ${calculateTotal() + price}
                      </span>
                    </div>
                    <p className="text-[#666666] mt-2">
                      Includes {formData.duration || 0} month{formData.duration !== '1' ? 's' : ''} rent + security deposit
                    </p>
                  </div>

                  <div className="bg-[#C8D1B0]/10 p-4 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-[#8DA87A] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[#333333]">Important</p>
                        <p className="text-[#666666]">
                          Your booking request will be sent to the host for approval. You will receive a notification once the host responds.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
