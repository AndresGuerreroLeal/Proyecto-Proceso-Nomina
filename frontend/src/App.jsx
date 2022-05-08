//Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Context
import AlertaState from "./context/alerta/AlertaState";
import AuthState from "./context/auth/AuthState";
import EmpleadoState from "./context/empleado/EmpleadoState";

//Layout
import DashboardLayout from "./layout/DashboardLayout";
import FormLayout from "./layout/FormLayout";
import ActualizarContrasenia from "./pages/ActualizarContrasenia";

//Pages
import Contratos from "./pages/Contratos";
import Dashboard from "./pages/Dashboard";
import EmpleadoForm from "./pages/EmpleadoForm";
import Empleados from "./pages/Empleados";
import Login from "./pages/Login";
import Nominas from "./pages/Nominas";
import NuevaContrasenia from "./pages/NuevaContrasenia";
import OlvideContrasenia from "./pages/OlvideContrasenia";
import Perfil from "./pages/Perfil";
import ReportesContratos from "./pages/ReportesContratos";
import ReportesEmpleados from "./pages/ReportesEmpleados";
import ReportesNominas from "./pages/ReportesNominas";

function App() {
  return (
    <Router>
      <AuthState>
        <EmpleadoState>
          <AlertaState>
            <Routes>
              <Route path="/" element={<FormLayout />}>
                <Route index element={<Login />} />
                <Route
                  path="olvide-contrasenia"
                  element={<OlvideContrasenia />}
                />
                <Route
                  path="olvide-contrasenia/:token"
                  element={<NuevaContrasenia />}
                />
              </Route>

              <Route path="/home" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />

                <Route path="perfil" element={<Perfil />} />
                <Route
                  path="actualizar-contrasenia"
                  element={<ActualizarContrasenia />}
                />

                <Route path="empleados" element={<Empleados />} />
                <Route
                  path="empleados/nuevo-empleado"
                  element={<EmpleadoForm />}
                />

                <Route
                  path="reportes-empleados"
                  element={<ReportesEmpleados />}
                />

                <Route path="contratos" element={<Contratos />} />
                <Route
                  path="reportes-contratos"
                  element={<ReportesContratos />}
                />

                <Route path="nominas" element={<Nominas />} />
                <Route path="reportes-nominas" element={<ReportesNominas />} />
              </Route>
            </Routes>
          </AlertaState>
        </EmpleadoState>
      </AuthState>
    </Router>
  );
}

export default App;
