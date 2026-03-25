import { useState, useEffect } from 'react';
import BuscaSelecionavel from './BuscaSelecionavel';
import ListaNotasFiscais from './ListarNotas';
import { useAuth } from '../../context/AuthContext.jsx';

export default function FormularioNotaFiscal() {
    const [numeroNF, setNumeroNF] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');
    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
    const [produtos, setProdutos] = useState([]);
    const [produtoSelecionado, setProdutoSelecionado] = useState(null);
    const [quantidade, setQuantidade] = useState('');
    const [itens, setItens] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [atualizar, setAtualizar] = useState(false);
    const { token } = useAuth();

    useEffect(() => {
        Promise.all([
            fetch('http://localhost:3000/api/fornecedores', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
            fetch('http://localhost:3000/api/produtos', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
        ]).then(([forns, prods]) => {
            setFornecedores(Array.isArray(forns) ? forns : []);
            setProdutos(Array.isArray(prods) ? prods : []);
            setCarregando(false);
        }).catch(err => { console.error(err); setCarregando(false); });
    }, [token]);

    const aoAdicionarItem = () => {
        if (!produtoSelecionado || !quantidade || quantidade <= 0) {
            alert('Selecione um produto e informe uma quantidade válida!');
            return;
        }
        if (itens.find(i => i.id_produto === produtoSelecionado.prod_id)) {
            alert('Este produto já foi adicionado.');
            return;
        }
        setItens([...itens, {
            id_produto: produtoSelecionado.prod_id,
            prod_nome: produtoSelecionado.prod_nome,
            prod_codigo_barras: produtoSelecionado.prod_codigo_barras,
            quantidade: Number(quantidade),
            tipo_movimento: 'ENTRADA'
        }]);
        setProdutoSelecionado(null);
        setQuantidade('');
    };

    const aoRemoverItem = (id) => setItens(itens.filter(i => i.id_produto !== id));

    const aoSalvarNota = () => {
        if (!numeroNF || !dataEmissao || !fornecedorSelecionado) {
            alert('Preencha o número, a data e selecione um fornecedor!');
            return;
        }
        if (itens.length === 0) { alert('Adicione pelo menos um produto!'); return; }

        fetch('http://localhost:3000/api/notas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({
                nf_numero: numeroNF,
                nf_data_emissao: dataEmissao,
                id_fornecedor: fornecedorSelecionado.forn_id,
                produtosMovimentados: itens
            })
        }).then(r => r.json()).then(dados => {
            if (dados.erro) { alert(dados.erro); return; }
            alert('Nota Fiscal cadastrada com sucesso!');
            setNumeroNF(''); setDataEmissao('');
            setFornecedorSelecionado(null); setItens([]);
            setAtualizar(a => !a);
        }).catch(err => console.error(err));
    };

    if (carregando) return (
        <div className="d-flex justify-content-center py-5">
            <div className="spinner-border text-primary" role="status" />
        </div>
    );

    return (
        <div>
            <div className="card shadow-sm mb-4">
                <div className="card-header"><h5 className="mb-0">Cadastrar Nota Fiscal</h5></div>
                <div className="card-body">
                    <div className="row g-3 mb-3">
                        <div className="col-md-4">
                            <label className="form-label">Número da NF</label>
                            <input type="text" className="form-control" value={numeroNF}
                                onChange={e => setNumeroNF(e.target.value)} placeholder="Ex: NF-1020" />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Data de Emissão</label>
                            <input type="date" className="form-control" value={dataEmissao}
                                onChange={e => setDataEmissao(e.target.value)} />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Fornecedor</label>
                            <BuscaSelecionavel itens={fornecedores} aoSelecionar={setFornecedorSelecionado}
                                placeholder="Buscar fornecedor..." campoExibicao="forn_nome" campoId="forn_id" />
                        </div>
                    </div>

                    <hr />
                    <h6 className="mb-3">Produtos da Nota</h6>

                    <div className="row g-2 align-items-end mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Produto</label>
                            <BuscaSelecionavel itens={produtos} aoSelecionar={setProdutoSelecionado}
                                placeholder="Buscar produto..." campoExibicao="prod_nome" campoId="prod_id" />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label">Quantidade</label>
                            <input type="number" className="form-control" value={quantidade}
                                onChange={e => setQuantidade(e.target.value)} min="1" placeholder="0" />
                        </div>
                        <div className="col-md-3">
                            <button className="btn btn-outline-primary w-100" onClick={aoAdicionarItem}>
                                + Adicionar
                            </button>
                        </div>
                    </div>

                    {itens.length === 0 ? (
                        <p className="text-muted small">Nenhum produto adicionado ainda.</p>
                    ) : (
                        <div className="table-responsive mb-3">
                            <table className="table table-sm table-bordered align-middle">
                                <thead className="table-light">
                                    <tr><th>Produto</th><th>Código</th><th className="text-center">Qtd</th><th className="text-center">Remover</th></tr>
                                </thead>
                                <tbody>
                                    {itens.map(item => (
                                        <tr key={item.id_produto}>
                                            <td>{item.prod_nome}</td>
                                            <td>{item.prod_codigo_barras}</td>
                                            <td className="text-center">{item.quantidade}</td>
                                            <td className="text-center">
                                                <button className="btn btn-outline-danger btn-sm"
                                                    onClick={() => aoRemoverItem(item.id_produto)}>✕</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <button className="btn btn-primary" onClick={aoSalvarNota}>Salvar Nota Fiscal</button>
                </div>
            </div>

            <ListaNotasFiscais atualizar={atualizar} />
        </div>
    );
}