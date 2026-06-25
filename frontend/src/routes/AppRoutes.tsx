import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "../components/PrivateRoute";
import { AdminRoute } from "../components/AdminRoute";
import { MainLayout } from "../layouts/MainLayout";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { AnimalsPage } from "../pages/AnimalsPage";
import { AnimalDetailsPage } from "../pages/AnimalDetailsPage";
import { MyAdoptionsPage } from "../pages/MyAdoptionsPage";
import { RescuesPage } from "../pages/RescuesPage";
import { AnimalsAdminPage } from "../pages/admin/AnimalsAdminPage";
import { AdoptionsAdminPage } from "../pages/admin/AdoptionsAdminPage";
import { RescuesAdminPage } from "../pages/admin/RescuesAdminPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Telas de autenticação: layout próprio (tela cheia), sem Navbar. */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Tudo que tem Navbar passa pelo MainLayout. */}
      <Route element={<MainLayout />}>
        {/* Públicas: listar e ver animais não exige login. */}
        <Route path="/" element={<AnimalsPage />} />
        <Route path="/animais/:id" element={<AnimalDetailsPage />} />

        {/* Logado (USER ou ADMIN). */}
        <Route element={<PrivateRoute />}>
          <Route path="/minhas-adocoes" element={<MyAdoptionsPage />} />
          <Route path="/resgates" element={<RescuesPage />} />
        </Route>

        {/* Apenas ADMIN. */}
        <Route element={<AdminRoute />}>
          <Route path="/admin/animais" element={<AnimalsAdminPage />} />
          <Route path="/admin/adocoes" element={<AdoptionsAdminPage />} />
          <Route path="/admin/resgates" element={<RescuesAdminPage />} />
        </Route>
      </Route>

      {/* Qualquer rota desconhecida cai na home. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
