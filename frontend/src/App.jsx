import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthState from "./context/auth/AuthState";
import DashboardLayout from "./layout/DashboardLayout";
import FormLayout from "./layout/FormLayout";
import Contratos from "./pages/Contratos";
import Dashboard from "./pages/Dashboard";
import EmpleadoForm from "./pages/EmpleadoForm";
import Empleados from "./pages/Empleados";
import Login from "./pages/Login";
import Nominas from "./pages/Nominas";
import NuevaContrasenia from "./pages/NuevaContrasenia";
import OlvideContrasenia from "./pages/OlvideContrasenia";
import ReportesContratos from "./pages/ReportesContratos";
import ReportesEmpleados from "./pages/ReportesEmpleados";
import ReportesNominas from "./pages/ReportesNominas";

function App() {
  return (
    <Router>
      <AuthState>
        <Routes>
          <Route path="/" element={<FormLayout />}>
            <Route index element={<Login />} />
            <Route path="olvide-contrasenia" element={<OlvideContrasenia />} />
            <Route path="olvide-contrasenia/:token" element={<NuevaContrasenia />} />
          </Route>

          <Route path="/admin" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />

            <Route path="empleados" element={<Empleados />} />
            <Route path="nuevo-empleado" element={<EmpleadoForm />} />
            <Route path="reportes-empleados" element={<ReportesEmpleados />} />

            <Route path="contratos" element={<Contratos />} />
            <Route path="reportes-contratos" element={<ReportesContratos />} />

            <Route path="nominas" element={<Nominas />} />
            <Route path="reportes-nominas" element={<ReportesNominas />} />
          </Route>
        </Routes>
      </AuthState>
    </Router>
  );
}

export default App;
