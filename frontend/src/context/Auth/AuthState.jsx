import { useState } from "react"
import AuthContext from "./AuthContext"



const AuthState = ({children})=>{

    const [auth,setAuth]=useState({})
    const [cargando,setCargando]= useState(true)

    return(
        <AuthContext.Provider
            value={{
                auth,
                cargando
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export default AuthState