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
  // console.log("ProtectedRoute user:", user);

  useEffect(() => {
    if (!user.user) {
      navigate("/login", { replace: true });
      return;
    }
    // console.log("p:user present");
    if (!user.user?.username) {
      navigate("/create-profile", { replace: true });
      return;
    }
    // console.log("p:user username present");
    if (!user.user?.verified) {
      navigate("/verify", { replace: true });
      return;
    }
    // console.log("p:user verified");
  }, [user.user, navigate]);
  // Only render children if authenticated
  if (!user.user) return null;
  return <>{children}</>;
};

export default ProtectedRoute;
