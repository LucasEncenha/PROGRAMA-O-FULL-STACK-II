import { AuthProvider, useAuth } from './context/AuthContext'
import { BrowserRouter, Navigate, Routes, Route, Link, useLocation } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import PaginaNotasFicais from './pages/PaginaNotas'
import PaginaProdutos from './pages/PaginaProdutos'

function RotaProtegida({ children }) {
    const { usuario, carregando } = useAuth();
    if (carregando) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status" />
        </div>
    );
    return usuario ? children : <Navigate to='/login' />;
}

function NavBar() {
    const { usuario, logout } = useAuth();
    const location = useLocation();
    if (!usuario) return null;

    return (
        <nav className="navbar navbar-expand navbar-dark bg-primary px-4">
            <Link to="/home" className="navbar-brand fw-semibold">Controle de Estoque</Link>
            <div className="navbar-nav me-auto">
                <Link to="/cadastro-nota" className={`nav-link ${location.pathname === '/cadastro-nota' ? 'active fw-semibold' : ''}`}>
                    Notas Fiscais
                </Link>
                <Link to="/cadastro-produto" className={`nav-link ${location.pathname === '/cadastro-produto' ? 'active fw-semibold' : ''}`}>
                    Produtos
                </Link>
            </div>
            <div className="d-flex align-items-center gap-3">
                <span className="text-white-50 small">Olá, {usuario.nome}</span>
                <button onClick={logout} className="btn btn-outline-light btn-sm">Sair</button>
            </div>
        </nav>
    );
}

function AppRoutes() {
    const { usuario, carregando } = useAuth();
    if (carregando) return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status" />
        </div>
    );

    return (
        <div>
            <NavBar />
            <main className="container py-4">
                <Routes>
                    <Route path='/login' element={usuario ? <Navigate to='/home' /> : <Login />} />
                    <Route path='/home' element={<RotaProtegida><Home /></RotaProtegida>} />
                    <Route path='/cadastro-nota' element={<RotaProtegida><PaginaNotasFicais /></RotaProtegida>} />
                    <Route path='/cadastro-produto' element={<RotaProtegida><PaginaProdutos /></RotaProtegida>} />
                    <Route path='*' element={<Navigate to={usuario ? '/home' : '/login'} />} />
                </Routes>
            </main>
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
            </AuthProvider>
        </BrowserRouter>
    );
}