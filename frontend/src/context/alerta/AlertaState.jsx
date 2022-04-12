import { useState } from "react";
import AlertaContext from "./AlertaContext";

const AlertaState = ({ children }) => {
  const [alerta, setAlerta] = useState({
    message: "",
    categoria: "",
  });
  
  const mostrarAlerta = (alerta) => {
    setAlerta(alerta);

    setTimeout(() => {
      setAlerta({
        message: "",
        categoria: "",
      });
    }, 3000);
  };

  return (
    <AlertaContext.Provider
      value={{
        alerta,
        mostrarAlerta,
      }}
    >
      {children}
    </AlertaContext.Provider>
  );
};

export default AlertaState;
