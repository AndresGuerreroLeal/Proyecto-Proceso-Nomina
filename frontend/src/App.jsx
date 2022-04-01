import { useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from "react-router-dom"
import DashboardLayout from './layout/DashboardLayout'
import FormLayout from './layout/FormLayout'
import Contratos from './pages/Contratos'
import Dashboard from './pages/Dashboard'
import EmpleadoForm from './pages/EmpleadoForm'
import Empleados from './pages/Empleados'
import Login from './pages/Login'
import Nominas from './pages/Nominas'
import ReportesContratos from './pages/ReportesContratos'
import ReportesEmpleados from './pages/ReportesEmpleados'
import ReportesNominas from './pages/ReportesNominas'

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FormLayout />}>
          <Route index element={<Login />} />
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
    </Router>
  );
}

export default App
