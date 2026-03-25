import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <h4 className="mb-4">Sistema de Controle de Estoque</h4>
            <div className="d-flex gap-3">
                <Link to="/cadastro-nota" className="btn btn-outline-primary">
                    Notas Fiscais
                </Link>
                <Link to="/cadastro-produto" className="btn btn-outline-primary">
                    Produtos
                </Link>
            </div>
        </div>
    );
}