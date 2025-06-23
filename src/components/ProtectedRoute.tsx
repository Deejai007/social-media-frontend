import React, { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "redux/store/store";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!user.user) {
      navigate("/login", { replace: true });
    }
  }, [user.user, navigate]);

  // Only render children if authenticated
  if (!user.user) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
