import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GraduationCap, AlertCircle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

// Validation schemas
const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email address").max(255, "Email is too long"),
  password: z.string().min(6, "Password must be at least 6 characters").max(72, "Password is too long"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup form state
  const [signupFullName, setSignupFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Check if user is already authenticated
  useEffect(() => {
    // TODO: Check if user is already authenticated and redirect
    // This will be implemented when Lovable Cloud is enabled
    // Example:
    // supabase.auth.getSession().then(({ data: { session } }) => {
    //   if (session) {
    //     checkUserRoleAndRedirect(session.user.id);
    //   }
    // });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate input
      const validatedData = loginSchema.parse({
        email: loginEmail,
        password: loginPassword,
      });

      // TODO: Implement Supabase login when Lovable Cloud is enabled
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email: validatedData.email,
      //   password: validatedData.password,
      // });
      // 
      // if (error) {
      //   if (error.message.includes("Invalid login credentials")) {
      //     setError("Invalid email or password. Please try again.");
      //   } else {
      //     setError(error.message);
      //   }
      //   return;
      // }
      //
      // // Query user role from user_roles table
      // const { data: roleData } = await supabase
      //   .from('user_roles')
      //   .select('role')
      //   .eq('user_id', data.user.id)
      //   .single();
      //
      // // Redirect based on role
      // if (roleData?.role === 'admin') {
      //   navigate('/admin/dashboard');
      // } else if (roleData?.role === 'manager') {
      //   navigate('/manager/dashboard');
      // } else {
      //   navigate('/trainee/dashboard');
      // }

      // Mock success for now - remove when Lovable Cloud is enabled
      toast({
        title: "Login successful",
        description: "Redirecting to dashboard...",
      });
      
      // Temporary: redirect based on email for demo
      if (validatedData.email.includes("admin")) {
        navigate("/admin/dashboard");
      } else {
        navigate("/trainee/dashboard");
      }

    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Validate input
      const validatedData = signupSchema.parse({
        fullName: signupFullName,
        email: signupEmail,
        password: signupPassword,
        confirmPassword: confirmPassword,
      });

      // TODO: Implement Supabase signup when Lovable Cloud is enabled
      // const redirectUrl = `${window.location.origin}/trainee/dashboard`;
      // 
      // const { data, error } = await supabase.auth.signUp({
      //   email: validatedData.email,
      //   password: validatedData.password,
      //   options: {
      //     emailRedirectTo: redirectUrl,
      //     data: {
      //       full_name: validatedData.fullName,
      //     }
      //   }
      // });
      //
      // if (error) {
      //   if (error.message.includes("already registered")) {
      //     setError("An account with this email already exists. Please sign in instead.");
      //   } else {
      //     setError(error.message);
      //   }
      //   return;
      // }
      //
      // // Note: User role will be automatically set to 'trainee' by database trigger
      // // or you can add it here with an edge function

      // Mock success for now
      toast({
        title: "Account created successfully",
        description: "Please check your email to verify your account.",
      });

      // Clear form
      setSignupFullName("");
      setSignupEmail("");
      setSignupPassword("");
      setConfirmPassword("");

    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      } else {
        setError("Failed to create account. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-xl">
              <GraduationCap className="h-10 w-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to CallX</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Admins and trainees use the same login page
                </p>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupFullName}
                    onChange={(e) => setSignupFullName(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                  <p className="text-xs text-muted-foreground">
                    Must be at least 6 characters
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  New agents will be assigned the trainee role by default
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
