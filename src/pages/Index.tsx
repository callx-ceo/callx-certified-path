import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Award, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-primary rounded-xl">
              <GraduationCap className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
            CallX Agent Certification Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Transform your call center agents into certified professionals through our comprehensive, 
            AI-powered training platform
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")}>
              Get Started
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Comprehensive Training</h3>
            <p className="text-muted-foreground">
              Video lessons, interactive quizzes, and real-world simulations
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI-Powered Simulations</h3>
            <p className="text-muted-foreground">
              Practice with AI customers and receive instant feedback
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor team performance and individual achievement
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
