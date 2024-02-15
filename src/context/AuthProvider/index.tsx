import React, {createContext, useState} from "react";
import { IAuthProvider, IContext, IUser } from "./types";
import { LoginRequest, setUserLocalStorage } from "./util";
import { redirect } from "react-router-dom";

export const AuthContext = createContext<IContext>({} as IContext)

export const AuthProvider = ({children} : IAuthProvider ) => {
    const [user, setUser] = useState<IUser | null>();


    async function authenticate(username:string, password:string) {
        const response = await LoginRequest(username, password);
        const payload = {access_token: response.access_token};
        setUser(payload);
        setUserLocalStorage(payload);
    }

    async function logout() {
        setUser(null)
        setUserLocalStorage(null)
        window.location.href = `/login`
        redirect('/login')
    }

    return(
        <AuthContext.Provider value={{...user, authenticate, logout}}>
            {children}
        </AuthContext.Provider>
    )
}