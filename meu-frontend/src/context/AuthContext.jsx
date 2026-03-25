import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({children}) {
    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/auth/perfil', {withCredentials: true})
        .then(res => setUsuario(res.data.usuario))
        .catch(() => setUsuario(null))
        .finally(() => setCarregando(false));
    }, []);

    const [token, setToken] = useState(null);

    async function login(email, senha) {
        const res = await axios.post('http://localhost:3000/auth/login',
            { email, senha },
            { withCredentials: true }
        );
        setUsuario(res.data.usuario);
        setToken(res.data.token);
    }

    async function logout() {
        await axios.post('http://localhost:3000/auth/logout', {}, { withCredentials: true });
        setUsuario(null);
        setToken(null);
    }

    return <AuthContext.Provider value={{usuario, token, login, logout}}>
        {children}
    </AuthContext.Provider>
}

export function useAuth() {
    return useContext(AuthContext);
}