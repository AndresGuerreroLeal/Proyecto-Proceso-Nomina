import { useState } from "react";
import AlertaContext from "./AlertaContext";

const AlertaState = () => {
  const [alerta, setAlerta] = useState({
    message: "",
    categoria: "",
  });

  const mostrarAlerta = (message, categoria) => {
    setAlerta({ message, categoria });

    setTimeout(() => {
      setAlerta({
        message: "",
        categoria: false,
      });
    }, 1000);
  };

  return (
    <AlertaContext.Provider
      value={{
        alerta,
        mostrarAlerta,
      }}
    ></AlertaContext.Provider>
  );
};

export default AlertaState;
