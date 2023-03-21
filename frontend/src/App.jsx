//Router
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//Context
import AlertaState from "./context/alerta/AlertaState";
import AuthState from "./context/auth/AuthState";
import ContratoState from "./context/contrato/ContratoState";
import EmpleadoState from "./context/empleado/EmpleadoState";
import NominaState from "./context/nomina/NominaState";
import UiState from "./context/ui/UiState";

//Layout
import DashboardLayout from "./layout/DashboardLayout";
import FormLayout from "./layout/FormLayout";
import RutaPrivada from "./layout/RutaPrivada";
import ActualizarContrasenia from "./pages/ActualizarContrasenia";
import ContratoForm from "./pages/ContratoForm";

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
      <UiState>
        <AlertaState>
          <AuthState>
            <EmpleadoState>
              <ContratoState>
                <NominaState>
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

                      <Route element={<RutaPrivada />}>
                        <Route
                          path="empleados/nuevo-empleado"
                          element={<EmpleadoForm />}
                        />
                      </Route>

                      <Route element={<RutaPrivada />}>
                        <Route
                          path="empleados/editar-empleado/:id"
                          element={<EmpleadoForm />}
                        />
                      </Route>

                      <Route
                        path="reportes-empleados"
                        element={<ReportesEmpleados />}
                      />

                      <Route path="contratos" element={<Contratos />} />
                      <Route element={<RutaPrivada />}>
                        <Route
                          path="contratos/nuevo-contrato"
                          element={<ContratoForm />}
                        />
                      </Route>

                      <Route element={<RutaPrivada />}>
                        <Route
                          path="contratos/editar-contrato/:id"
                          element={<ContratoForm />}
                        />
                      </Route>

                      <Route
                        path="reportes-contratos"
                        element={<ReportesContratos />}
                      />

                      <Route path="nominas" element={<Nominas />} />
                      <Route
                        path="reportes-nominas"
                        element={<ReportesNominas />}
                      />
                    </Route>
                  </Routes>
                </NominaState>
              </ContratoState>
            </EmpleadoState>
          </AuthState>
        </AlertaState>
      </UiState>
    </Router>
  );
}

export default App;
