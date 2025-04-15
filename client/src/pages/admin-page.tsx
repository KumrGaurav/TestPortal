import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const { user, logoutMutation } = useAuth();
  const [, navigate] = useLocation();
  
  // Redirect to auth if not logged in or not an admin
  if (!user) {
    navigate("/auth");
    return null;
  }
  
  if (!user.isAdmin) {
    navigate("/");
    return null;
  }

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Scholarship Test Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {user.email}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Log out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <AdminDashboard />
        </div>
      </main>
    </div>
  );
}
