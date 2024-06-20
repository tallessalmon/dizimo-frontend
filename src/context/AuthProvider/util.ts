import axios from "axios";
import { IUser } from "./types";
import { jwtDecode } from "jwt-decode";
import process from "process";

export function setUserLocalStorage (user: IUser | null) {
    user?.access_token ?
    localStorage.setItem('token', String(user?.access_token))
    : localStorage.setItem('token', String(null))
}

export function getUserLocalStorage () {
    const token = localStorage.getItem('token')
    
    if(!token) {
        return null
    }

    return token ?? null;
}

export function getProfileLocalStorage () {
    const token = localStorage.getItem('token')
    
    if(!token) {
        return null
    } 
    const profile = jwtDecode(token)

    return profile ?? null;
}

export async function LoginRequest (username: string, password: string) {
    try {
        const request = await axios.post(`${import.meta.env.VITE_BACKEND}/auth/login`, {username, password})
        return request.data;
    } catch (error) {
        console.log(process.env.REACT_APP_BACKEND)
        return null   
    }
}
