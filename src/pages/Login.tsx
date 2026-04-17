import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast({ title: "Welcome back!", description: "You've been signed in successfully." });
      navigate("/dashboard");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container flex min-h-[calc(100vh-8rem)] items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="font-heading text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="mt-1 text-sm text-muted-foreground">Sign in to your RentRate account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="rounded-lg border border-border bg-muted/50 p-3 text-xs text-muted-foreground">
              <p className="font-medium text-foreground">Quick access accounts</p>
              <div className="mt-2 space-y-2">
                <div>
                  <p>Owner: owner@rentrate.com</p>
                  <p>Password: password123</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("owner@rentrate.com");
                      setPassword("password123");
                    }}
                    className="text-primary hover:underline"
                  >
                    Use owner account
                  </button>
                </div>
                <div>
                  <p>Renter: renter@rentrate.com</p>
                  <p>Password: password123</p>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail("renter@rentrate.com");
                      setPassword("password123");
                    }}
                    className="text-primary hover:underline"
                  >
                    Use renter account
                  </button>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-primary hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
