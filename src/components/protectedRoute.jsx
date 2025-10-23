import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const [auth, setAuth] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/index/check", {
      credentials: "include", // include session cookie
    })
      .then(res => res.json())
      .then(data => setAuth(data.authenticated))
      .catch(() => setAuth(false));
  }, []);

  console.log(auth);
  if (auth === null) return <div>Loading...</div>;
  if (!auth) return <Navigate to="/login" replace />;

  return children;
}
