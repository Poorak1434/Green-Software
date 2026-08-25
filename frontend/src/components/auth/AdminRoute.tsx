import React from 'react';
import { useUser, RedirectToSignIn } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#e0e5ec]">
        <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  // Check if the user has the 'admin' role in their public metadata
  const isAdmin = user?.publicMetadata?.role === 'admin';

  if (!isAdmin) {
    // If they are logged in but not an admin, redirect them to the regular dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
