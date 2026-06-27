import React, { useState } from 'react';
import { ArrowLeft, Building2, User, Mail, Lock, UserCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface LoginSignupProps {
  onBack: () => void;
  onLogin: (role: 'tenant' | 'host', email: string) => void;
  mode?: 'tenant' | 'host'; // Add mode to determine which signup flow to show
}

export function LoginSignup({ onBack, onLogin, mode = 'tenant' }: LoginSignupProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - in real app, this would validate credentials
    onLogin(mode, loginEmail);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock signup - in real app, this would create an account
    onLogin(mode, signupEmail);
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
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#8DA87A] to-[#A5B88A] flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-[#333333]">Welcome to Beit Gaza</CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  {mode === 'host' && (
                    <div className="bg-[#8DA87A]/10 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-[#8DA87A]">
                        <Building2 className="w-5 h-5" />
                        <p>Host Login</p>
                      </div>
                      <p className="text-[#666666] mt-1">Sign in to manage your properties</p>
                    </div>
                  )}
                  {mode === 'tenant' && (
                    <div className="bg-[#8DA87A]/10 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-[#8DA87A]">
                        <UserCircle className="w-5 h-5" />
                        <p>Tenant Login</p>
                      </div>
                      <p className="text-[#666666] mt-1">Sign in to book properties</p>
                    </div>
                  )}
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
                    className="w-full bg-[#8DA87A] hover:bg-[#7a9569] text-white"
                  >
                    Sign In as {mode === 'host' ? 'Host' : 'Tenant'}
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
                  {mode === 'host' && (
                    <div className="bg-[#8DA87A]/10 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-[#8DA87A]">
                        <Building2 className="w-5 h-5" />
                        <p>Become a Host</p>
                      </div>
                      <p className="text-[#666666] mt-1">Create a host account to list your properties</p>
                    </div>
                  )}
                  {mode === 'tenant' && (
                    <div className="bg-[#8DA87A]/10 p-4 rounded-lg mb-4">
                      <div className="flex items-center gap-2 text-[#8DA87A]">
                        <UserCircle className="w-5 h-5" />
                        <p>Create Tenant Account</p>
                      </div>
                      <p className="text-[#666666] mt-1">Sign up to browse and book properties</p>
                    </div>
                  )}
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

                  <Button
                    type="submit"
                    className="w-full bg-[#8DA87A] hover:bg-[#7a9569] text-white"
                  >
                    Create {mode === 'host' ? 'Host' : 'Tenant'} Account
                  </Button>

                  <p className="text-[#666666] text-center">
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