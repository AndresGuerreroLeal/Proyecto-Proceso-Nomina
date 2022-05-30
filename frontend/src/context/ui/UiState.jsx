import { useState } from "react";

// Context
import UiContext from "./UiContext";

const UiState = ({ children }) => {
  const [menu, setMenu] = useState({});

  return (
    <UiContext.Provider
      value={{
        menu,
        setMenu,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

export default UiState;
