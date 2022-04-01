import { useEffect, useState } from "react"
import clienteAxios from "../../config/axios"
import TokenAuth from "../../config/tokenAuth"
import AuthContext from "./AuthContext"



const AuthState = ({children})=>{

    const [auth,setAuth]=useState({})
    const [cargando,setCargando]= useState(true)



    return(
        <AuthContext.Provider
            value={{
                auth,
                cargando,
                setAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export default AuthState