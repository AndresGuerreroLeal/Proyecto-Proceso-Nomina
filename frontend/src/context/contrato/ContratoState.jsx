import { useState } from "react";

//Context
import ContratoContext from "./ContratoContext";

const ContratoState = ({ children }) => {
  const [contratos,setContratos] = useState([])

  return (
    <ContratoContext.Provider
      value={{
        contratos,
      }}
    >
      {children}
    </ContratoContext.Provider>
  );
};

export default ContratoState;
