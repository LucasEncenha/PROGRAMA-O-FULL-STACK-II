import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setErro('');
        try {
            await login(email, senha);
            navigate('/cadastro-nota');
        } catch (error) {
            setErro(error?.response?.data?.erro || 'Erro ao processar login');
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
            <div className="card shadow-sm" style={{ width: '100%', maxWidth: 400 }}>
                <div className="card-body p-4">
                    <h4 className="card-title mb-4">Entrar</h4>
                    {erro && <div className="alert alert-danger py-2">{erro}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" value={email}
                                onChange={e => setEmail(e.target.value)} placeholder="Seu email" required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Senha</label>
                            <input type="password" className="form-control" value={senha}
                                onChange={e => setSenha(e.target.value)} placeholder="Sua senha" required />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Entrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}