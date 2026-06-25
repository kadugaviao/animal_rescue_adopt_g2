import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Rota protegida: só deixa passar quem está autenticado. <Outlet /> renderiza a
// rota filha; senão redireciona para /login (replace = não cria histórico).
export function PrivateRoute() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
