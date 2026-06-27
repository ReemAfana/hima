import React, { useState } from 'react';
import { ArrowLeft, Building2, User, Mail, Lock, Home, Key } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface HostLoginSignupProps {
  onBack: () => void;
  onLogin: (role: 'tenant' | 'host', email: string) => void;
}

export function HostLoginSignup({ onBack, onLogin }: HostLoginSignupProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupPhone, setSignupPhone] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('host', loginEmail);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin('host', signupEmail);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8DA87A] via-[#A5B88A] to-[#C8D1B0] p-4">
      <div className="max-w-md mx-auto pt-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="bg-white/95 backdrop-blur border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#8DA87A] to-[#A5B88A] flex items-center justify-center shadow-lg">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md">
                  <Key className="w-4 h-4 text-[#8DA87A]" />
                </div>
              </div>
            </div>
            <CardTitle className="text-[#333333] text-2xl mb-2">Welcome, Host!</CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Become a Host</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="bg-gradient-to-r from-[#8DA87A]/5 to-[#A5B88A]/5 p-4 rounded-lg border border-[#8DA87A]/20 mb-6">
                    <div className="flex items-start gap-3">
                      <Home className="w-5 h-5 text-[#8DA87A] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[#333333] font-medium">Host Dashboard Access</p>
                        <p className="text-[#666666] text-sm mt-1">
                          Manage your properties, bookings, and connect with tenants
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-email" className="text-[#333333]">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8DA87A]" />
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="your@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="pl-10 border-[#C8D1B0] focus:border-[#8DA87A]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="login-password" className="text-[#333333]">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8DA87A]" />
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="pl-10 border-[#C8D1B0] focus:border-[#8DA87A]"
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#8DA87A] to-[#A5B88A] hover:from-[#7a9569] hover:to-[#94a379] text-white shadow-md"
                  >
                    Sign In to Host Dashboard
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      className="text-[#8DA87A] hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="bg-gradient-to-r from-[#8DA87A]/5 to-[#A5B88A]/5 p-4 rounded-lg border border-[#8DA87A]/20 mb-6">
                    <div className="flex items-start gap-3">
                      <Building2 className="w-5 h-5 text-[#8DA87A] mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-[#333333] font-medium">List Your Property</p>
                        <p className="text-[#666666] text-sm mt-1">
                          Join our community of hosts and help rebuild Gaza together
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-name" className="text-[#333333]">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8DA87A]" />
                      <Input
                        id="signup-name"
                        type="text"
                        placeholder="Ahmed Hassan"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        className="pl-10 border-[#C8D1B0] focus:border-[#8DA87A]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-email" className="text-[#333333]">Email</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8DA87A]" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="your@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        className="pl-10 border-[#C8D1B0] focus:border-[#8DA87A]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-phone" className="text-[#333333]">Phone Number</Label>
                    <div className="relative mt-2">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8DA87A]">📱</span>
                      <Input
                        id="signup-phone"
                        type="tel"
                        placeholder="+970 XX XXX XXXX"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        className="pl-10 border-[#C8D1B0] focus:border-[#8DA87A]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="signup-password" className="text-[#333333]">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8DA87A]" />
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        className="pl-10 border-[#C8D1B0] focus:border-[#8DA87A]"
                        required
                      />
                    </div>
                  </div>

                  <div className="bg-[#C8D1B0]/20 p-4 rounded-lg">
                    <p className="text-[#666666] text-sm">
                      ✓ List unlimited properties<br />
                      ✓ Manage booking requests<br />
                      ✓ Connect with verified tenants<br />
                      ✓ Transparent damage reporting
                    </p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#8DA87A] to-[#A5B88A] hover:from-[#7a9569] hover:to-[#94a379] text-white shadow-md"
                  >
                    Create Host Account
                  </Button>

                  <p className="text-[#666666] text-center text-sm">
                    By signing up, you agree to our Terms and Privacy Policy
                  </p>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}