import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/index/check`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (isMounted) {
          setAuth(data.authenticated);
        }
      } catch {
        if (isMounted) {
          setAuth(false);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;

  return children;
}
