import React from 'react';
import { ArrowLeft, Shield, AlertTriangle, DollarSign, FileText, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface PoliciesProps {
  onBack: () => void;
}

export function Policies({ onBack }: PoliciesProps) {
  const policies = [
    {
      icon: Shield,
      title: 'Information Accuracy',
      description: 'All hosts must provide truthful and accurate information about their properties, including current condition, amenities, and any war-related damage. Misrepresentation of property condition is grounds for listing removal.',
      color: 'text-[#8DA87A]',
    },
    {
      icon: AlertTriangle,
      title: 'Damage Responsibility',
      description: 'Tenants are responsible for any damage caused to the property during their stay, beyond normal wear and tear. Pre-existing damage must be documented before move-in with photos and signed agreement.',
      color: 'text-orange-500',
    },
    {
      icon: DollarSign,
      title: 'Security Deposit',
      description: 'Hosts may request a security deposit equal to one month\'s rent. This deposit must be held securely and returned within 14 days after move-out, minus any legitimate deductions for damages with photographic evidence.',
      color: 'text-green-600',
    },
    {
      icon: FileText,
      title: 'Cancellation Policy',
      description: 'Three cancellation policy options are available: Flexible (full refund up to 7 days before), Moderate (50% refund up to 14 days before), and Strict (no refund within 30 days of booking).',
      color: 'text-blue-600',
    },
    {
      icon: Users,
      title: 'Fair Use',
      description: 'Properties must be used only for legal residential purposes. Subletting without host permission is prohibited. Maximum occupancy limits must be respected. Commercial use requires explicit agreement.',
      color: 'text-purple-600',
    },
  ];

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
          <h1 className="text-white">Policies & Guidelines</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Introduction */}
        <Card className="border-0 shadow-lg mb-6">
          <CardContent className="p-6">
            <h2 className="text-[#333333] mb-4">Welcome to Beit Gaza</h2>
            <p className="text-[#666666] leading-relaxed mb-4">
              Beit Gaza is committed to creating a safe, transparent, and trustworthy rental marketplace for the Gaza Strip. 
              These policies ensure fair treatment for both hosts and tenants, while acknowledging the unique challenges 
              faced by our community.
            </p>
            <p className="text-[#666666] leading-relaxed">
              By using our platform, you agree to follow these guidelines. Violations may result in account suspension 
              or removal from the platform.
            </p>
          </CardContent>
        </Card>

        {/* Policy Cards */}
        <div className="space-y-6">
          {policies.map((policy, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-[#333333]">
                  <div className={`w-12 h-12 rounded-full bg-[#C8D1B0]/20 flex items-center justify-center ${policy.color}`}>
                    <policy.icon className="w-6 h-6" />
                  </div>
                  {policy.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[#666666] leading-relaxed">
                  {policy.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Terms */}
        <Card className="border-0 shadow-lg mt-6 border-l-4 border-l-[#8DA87A]">
          <CardHeader>
            <CardTitle className="text-[#333333]">Additional Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-[#333333] mb-2">Payment Terms</h3>
              <ul className="space-y-2 text-[#666666]">
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>First month's rent and security deposit required before move-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Rent must be paid by the agreed date each month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Late payments may incur fees as specified in rental agreement</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#333333] mb-2">Property Maintenance</h3>
              <ul className="space-y-2 text-[#666666]">
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Hosts responsible for major repairs and structural maintenance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Tenants responsible for minor repairs and day-to-day upkeep</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Emergency repairs must be addressed within 24 hours when possible</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#333333] mb-2">Dispute Resolution</h3>
              <ul className="space-y-2 text-[#666666]">
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>All disputes should first be resolved through direct communication</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Platform mediation available for unresolved issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Photographic evidence required for damage claims</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-[#333333] mb-2">War-Related Circumstances</h3>
              <ul className="space-y-2 text-[#666666]">
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Special consideration given for displacement or safety concerns</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Flexible policies may apply during active conflict situations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#8DA87A] mt-1">•</span>
                  <span>Both parties encouraged to maintain open communication during crises</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="border-0 shadow-lg mt-6 bg-gradient-to-br from-[#8DA87A]/10 to-[#C8D1B0]/10">
          <CardContent className="p-6 text-center">
            <h3 className="text-[#333333] mb-2">Questions about our policies?</h3>
            <p className="text-[#666666] mb-4">
              Our support team is here to help clarify any questions or concerns.
            </p>
            <Button className="bg-[#8DA87A] hover:bg-[#7a9569] text-white">
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}