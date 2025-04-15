import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const [, navigate] = useLocation();

  // Redirect to home if user is already logged in
  if (user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Form Section */}
      <div className="lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </CardTitle>
            <CardDescription className="text-center">
              {isLogin ? "Enter your credentials to continue" : "Fill in the details to get started"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLogin ? (
              <LoginForm />
            ) : (
              <RegisterForm />
            )}
            <div className="mt-6 text-center text-sm">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Button
                variant="link"
                className="p-0 h-auto font-semibold text-primary hover:text-indigo-500"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero Section */}
      <div className="lg:w-1/2 bg-gradient-to-r from-primary to-indigo-600 flex items-center justify-center p-12">
        <div className="max-w-md text-white">
          <h1 className="text-4xl font-bold mb-6">Scholarship Test Platform</h1>
          <p className="text-xl mb-8">
            Challenge yourself with our comprehensive scholarship test and compete for
            educational opportunities.
          </p>
          <ul className="space-y-4">
            <li className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Timed assessments with multiple-choice questions
            </li>
            <li className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Track your progress and review flagged questions
            </li>
            <li className="flex items-center">
              <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Compete for scholarships based on performance
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
