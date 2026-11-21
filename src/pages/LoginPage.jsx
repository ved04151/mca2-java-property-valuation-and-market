import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Building2, ShieldCheck, UserCheck, KeyRound, ArrowRight, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('Admin@123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.prefillEmail) {
      setEmail(location.state.prefillEmail);
      setPassword('');
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const res = await login(email, password);
      toast.success('Successfully authenticated', {
        description: `Welcome back, ${res.user?.name || 'User'}!`,
      });
      // Redirect users according to their role if no specific destination
      if (from && from !== '/dashboard') {
        navigate(from, { replace: true });
      } else if (res.user?.role === 'ADMIN') {
        navigate('/admin/users', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
      toast.error('Authentication Error', { description: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-xl shadow-blue-600/30 mb-3">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            PropValuate NCR
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-xs">
            Commercial & Residential Property Valuation and Market Intelligence Platform
          </p>
        </div>

        <Card className="border-slate-800/80 bg-[#0e1626]/90 shadow-2xl backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-xl">Sign In to Workspace</CardTitle>
            <CardDescription>
              Enter credentials to access NCR property data and valuation tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email" required>Corporate Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@propval.in"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" required>Password</Label>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 focus:outline-none"
                    tabIndex="-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="default"
                className="w-full h-11 text-base mt-2"
                isLoading={isLoading}
              >
                Sign In <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800 text-center">
              <p className="text-sm text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="font-medium text-blue-400 hover:text-blue-300 hover:underline inline-flex items-center"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {/* Quick Demo Credential Selectors */}
            <div className="mt-5 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400 block mb-2 font-medium">
                Initial / Demo Credentials (Click to fill):
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@gmail.com', 'Admin@123')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 text-left transition group"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-semibold text-white block truncate">Initial Admin</span>
                    <span className="text-[10px] text-slate-400 block truncate">admin@gmail.com</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/signup')}
                  className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-700/80 bg-slate-900/60 hover:bg-slate-800/80 text-left transition group"
                >
                  <UserPlus className="w-4 h-4 text-blue-400 shrink-0" />
                  <div className="truncate">
                    <span className="text-xs font-semibold text-white block truncate">New User</span>
                    <span className="text-[10px] text-slate-400 block truncate">Go to Sign Up</span>
                  </div>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Spring Boot note */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-slate-400" />
          <span>Spring Security JWT authentication contract ready.</span>
        </div>
      </div>
    </div>
  );
}
