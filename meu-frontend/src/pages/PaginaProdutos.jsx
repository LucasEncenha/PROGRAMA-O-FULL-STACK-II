import { useState, useEffect } from 'react';
import BuscaSelecionavel from '../components/notas/BuscaSelecionavel';
import { useAuth } from '../context/AuthContext.jsx';

export default function PaginaProdutos() {
    const [produtos, setProdutos] = useState([]);
    const [fornecedores, setFornecedores] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [prodNome, setProdNome] = useState('');
    const [prodCodigo, setProdCodigo] = useState('');
    const [prodEstoque, setProdEstoque] = useState('');
    const [prodPreco, setProdPreco] = useState('');
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
    const { token } = useAuth();

    const buscarDados = () => {
        Promise.all([
            fetch('http://localhost:3000/api/produtos', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch('http://localhost:3000/api/fornecedores', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
        ]).then(([prods, forns]) => {
            setProdutos(Array.isArray(prods) ? prods : []);
            setFornecedores(Array.isArray(forns) ? forns : []);
            setCarregando(false);
        }).catch(err => { console.error(err); setCarregando(false); });
    };

    useEffect(() => { buscarDados(); }, [token]);

    const aoSalvar = () => {
        if (!prodNome || !prodCodigo || !prodPreco) {
            alert('Nome, código de barras e preço são obrigatórios!');
            return;
        }
        fetch('http://localhost:3000/api/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                prod_nome: prodNome,
                prod_codigo_barras: prodCodigo,
                prod_estoque_atual: prodEstoque || 0,
                prod_preco_venda: prodPreco,
                id_fornecedor: fornecedorSelecionado?.forn_id || null
            })
        }).then(r => r.json()).then(dados => {
            if (dados.erro) { alert(dados.erro); return; }
            alert('Produto cadastrado com sucesso!');
            setProdNome(''); setProdCodigo(''); setProdEstoque(''); setProdPreco('');
            setFornecedorSelecionado(null);
            buscarDados();
        }).catch(err => console.error(err));
    };

    const aoExcluir = (id) => {
        if (!window.confirm('Excluir este produto?')) return;
        fetch(`http://localhost:3000/api/produtos/${id}`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
        }).then(() => buscarDados()).catch(err => console.error(err));
    };

    if (carregando) return (
        <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" />
        </div>
    );

    return (
        <div>
            <div className="card mb-4 shadow-sm">
                <div className="card-header"><h5 className="mb-0">Cadastrar Produto</h5></div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Nome</label>
                            <input type="text" className="form-control" value={prodNome}
                                onChange={e => setProdNome(e.target.value)} placeholder="Ex: Arroz 5kg" />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Código de Barras</label>
                            <input type="text" className="form-control" value={prodCodigo}
                                onChange={e => setProdCodigo(e.target.value)} placeholder="Ex: 7891234567890" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Estoque Inicial</label>
                            <input type="number" className="form-control" value={prodEstoque}
                                onChange={e => setProdEstoque(e.target.value)} placeholder="0" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Preço de Venda (R$)</label>
                            <input type="number" step="0.01" className="form-control" value={prodPreco}
                                onChange={e => setProdPreco(e.target.value)} placeholder="0.00" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Fornecedor (opcional)</label>
                            <BuscaSelecionavel itens={fornecedores} aoSelecionar={setFornecedorSelecionado}
                                placeholder="Buscar fornecedor..." campoExibicao="forn_nome" campoId="forn_id" />
                        </div>
                    </div>
                    <button className="btn btn-primary mt-3" onClick={aoSalvar}>Cadastrar Produto</button>
                </div>
            </div>

            <h5 className="mb-3">Produtos Cadastrados</h5>
            {produtos.length === 0 ? (
                <p className="text-muted">Nenhum produto cadastrado.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">
                        <thead className="table-light">
                            <tr>
                                <th>Nome</th><th>Código</th><th>Estoque</th><th>Preço</th><th>Fornecedor</th><th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produtos.map(p => (
                                <tr key={p.prod_id}>
                                    <td>{p.prod_nome}</td>
                                    <td>{p.prod_codigo_barras}</td>
                                    <td>{p.prod_estoque_atual}</td>
                                    <td>R$ {Number(p.prod_preco_venda).toFixed(2)}</td>
                                    <td>{p.forn_nome || '—'}</td>
                                    <td>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => aoExcluir(p.prod_id)}>
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}