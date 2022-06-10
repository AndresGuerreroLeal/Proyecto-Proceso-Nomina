import { useState } from "react";

//Context
import NominaContext from "./NominaContext";

const NominaState = ({ children }) => {
  const [nominas, setNominas] = useState([]);

  return (
    <NominaContext.Provider
      value={{
        nominas,
      }}
    >
      {children}
    </NominaContext.Provider>
  );
};

export default NominaState;
