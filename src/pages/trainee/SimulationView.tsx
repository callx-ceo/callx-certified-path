import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mic, PhoneOff, ArrowLeft, AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SimulationView = () => {
  const navigate = useNavigate();
  const [simStarted, setSimStarted] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Mock transcript with inline feedback
  const transcript = [
    {
      speaker: "AI Customer",
      text: "I've been overcharged for the third time this month! This is absolutely ridiculous!",
      feedback: null
    },
    {
      speaker: "You",
      text: "Hi, what's your account number?",
      feedback: {
        type: "poor",
        message: "Poor. You failed to show empathy first. Try: 'I'm so sorry to hear that, I'll definitely get this sorted out for you.'"
      }
    },
    {
      speaker: "AI Customer",
      text: "Account 12345. Are you even listening to me?",
      feedback: null
    },
    {
      speaker: "You",
      text: "I apologize for the inconvenience. Let me look into your account right away.",
      feedback: {
        type: "good",
        message: "Good! You showed empathy and took action. This helps de-escalate the situation."
      }
    },
  ];

  const handleStartSim = () => {
    // In production, request microphone access here
    setSimStarted(true);
    setIsActive(true);
  };

  const handleEndCall = () => {
    setIsActive(false);
    setShowResults(true);
  };

  if (!simStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-4 w-fit"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Lesson
            </Button>
            <CardTitle className="text-2xl">AI Call Simulation</CardTitle>
            <CardDescription className="text-base">
              Practice: Angry Customer Scenario
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This simulation will require microphone access to record your responses.
                You'll receive real-time feedback on your call handling skills.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Scenario</h3>
              <p className="text-foreground">
                A customer is calling about a billing error that has occurred multiple times. 
                They are frustrated and angry. Your goal is to de-escalate the situation, 
                show empathy, and resolve the issue while following proper call protocols.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold">Your Objectives:</h3>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Greet the customer professionally</li>
                <li>Show empathy and active listening</li>
                <li>Follow the proper call script</li>
                <li>Resolve the issue efficiently</li>
                <li>End the call positively</li>
              </ul>
            </div>

            <Button size="lg" className="w-full" onClick={handleStartSim}>
              <Phone className="mr-2 h-5 w-5" />
              Start Simulation
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/trainee/dashboard")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">Simulation Results</CardTitle>
              <CardDescription>Here's how you performed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Overall Score */}
              <div className="text-center py-6 bg-muted rounded-lg">
                <div className="text-5xl font-bold text-success mb-2">88%</div>
                <div className="text-muted-foreground">Overall Performance</div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-card border rounded-lg">
                  <div className="text-2xl font-semibold text-success">95%</div>
                  <div className="text-sm text-muted-foreground">Script Adherence</div>
                </div>
                <div className="p-4 bg-card border rounded-lg">
                  <div className="text-2xl font-semibold text-foreground">Good</div>
                  <div className="text-sm text-muted-foreground">Empathy</div>
                </div>
                <div className="p-4 bg-card border rounded-lg">
                  <div className="text-2xl font-semibold text-foreground">80%</div>
                  <div className="text-sm text-muted-foreground">Call Flow</div>
                </div>
                <div className="p-4 bg-card border rounded-lg">
                  <div className="text-2xl font-semibold text-success">Excellent</div>
                  <div className="text-sm text-muted-foreground">Resolution</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Full Transcript with Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>Call Transcript & Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transcript.map((entry, index) => (
                  <div key={index}>
                    <div className="flex items-start gap-3">
                      <Badge variant={entry.speaker === "You" ? "default" : "secondary"}>
                        {entry.speaker}
                      </Badge>
                      <p className="flex-1 text-foreground">{entry.text}</p>
                    </div>
                    {entry.feedback && (
                      <Alert className={`mt-2 ml-16 ${
                        entry.feedback.type === "good" 
                          ? "border-success bg-success/10" 
                          : "border-destructive bg-destructive/10"
                      }`}>
                        {entry.feedback.type === "good" ? (
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        ) : (
                          <XCircle className="h-4 w-4 text-destructive" />
                        )}
                        <AlertDescription className="text-sm">
                          {entry.feedback.message}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <Button variant="outline" onClick={() => setSimStarted(false)}>
                  Try Again
                </Button>
                <Button onClick={() => navigate("/trainee/dashboard")}>
                  Continue Learning
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Active simulation view
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-2xl w-full">
        <CardContent className="pt-8 pb-8">
          <div className="text-center space-y-8">
            {/* AI Customer Avatar */}
            <div>
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-12 w-12 text-primary" />
              </div>
              <Badge className="mb-2">AI Customer</Badge>
              <div className="bg-muted p-4 rounded-lg mt-4">
                <p className="text-foreground font-medium">
                  "I've been overcharged for the third time this month! This is absolutely ridiculous!"
                </p>
              </div>
            </div>

            {/* Agent Status */}
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Listening...</span>
              </div>
              
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Mic className="h-5 w-5" />
                <span className="text-sm">Speak your response</span>
              </div>
            </div>

            {/* End Call Button */}
            <Button
              size="lg"
              variant="destructive"
              onClick={handleEndCall}
              className="gap-2"
            >
              <PhoneOff className="h-5 w-5" />
              End Call
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationView;
