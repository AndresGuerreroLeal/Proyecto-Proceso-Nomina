import { useState } from "react";
import AlertaContext from "./AlertaContext";

const AlertaState = ({children}) => {
  const [alerta, setAlerta] = useState({
    message: "",
    categoria: "error",
  });

  const mostrarAlerta = ({message, categoria}) => {
    setAlerta({ message, categoria });

    setTimeout(() => {
      setAlerta({
        message: "",
        categoria: "error",
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
