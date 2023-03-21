import { useState } from "react";

// Context
import UiContext from "./UiContext";

const UiState = ({ children }) => {
  const [open, setOpen] = useState(true);
  const [menuProperties,setMenuProperties] = useState({widthMenu:333,visibility: "visible"})

  const changeMenuProperties =()=>{
    if(open){
      setMenuProperties({ widthMenu: 0, visibility: "visible" });
    }else{
      setMenuProperties({ widthMenu: 333, visibility: "visible" });
    }
  }

  return (
    <UiContext.Provider
      value={{
        open,
        setOpen,
        menuProperties,
        changeMenuProperties
      }}
    >
      {children}
    </UiContext.Provider>
  );
};

export default UiState;
