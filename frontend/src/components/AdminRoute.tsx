import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Controle de acesso por papel: precisa estar logado E ser ADMIN.
// - Não logado  -> manda pro /login.
// - Logado mas USER -> manda pra home (sem permissão).
// O backend também bloqueia (authorize("ADMIN") -> 403); aqui é só a UX.
export function AdminRoute() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return <Outlet />;
}
