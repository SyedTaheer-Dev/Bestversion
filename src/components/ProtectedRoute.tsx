import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

type ProtectedRouteProps = {
  children: ReactNode;
  adminOnly?: boolean;
};

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/70 px-5 py-3 text-sm text-muted-foreground shadow-lg backdrop-blur-xl">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          Checking your secure session...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && !user.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-[28px] border border-border/60 bg-card/75 p-8 text-center shadow-[0_18px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-display font-bold text-foreground">Admin access required</h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            This page is only available to the Best Version admin account.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
