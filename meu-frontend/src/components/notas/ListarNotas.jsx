import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ListaNotasFiscais({ atualizar = false }) {
    const [notas, setNotas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const { token } = useAuth();

    const buscarNotas = () => {
        fetch('http://localhost:3000/api/notas', { headers: { Authorization: `Bearer ${token}` } })
            .then(res => res.json())
            .then(dados => { setNotas(Array.isArray(dados) ? dados : []); setCarregando(false); })
            .catch(err => { console.error(err); setCarregando(false); });
    };

    useEffect(() => { buscarNotas(); }, [atualizar, token]);

    const aoExcluirNota = (idNota) => {
        if (!window.confirm('Excluir esta Nota Fiscal?')) return;
        fetch(`http://localhost:3000/api/notas/${idNota}`, {
            method: 'DELETE', headers: { Authorization: `Bearer ${token}` }
        }).then(() => setNotas(notas.filter(n => n.nf_id !== idNota)))
          .catch(err => console.error(err));
    };

    if (carregando) return (
        <div className="d-flex justify-content-center py-3">
            <div className="spinner-border text-primary" role="status" />
        </div>
    );
    if (notas.length === 0) return <p className="text-muted">Nenhuma Nota Fiscal cadastrada.</p>;

    return (
        <div>
            <h5 className="mb-3">Notas Fiscais Cadastradas</h5>
            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-primary">
                        <tr>
                            <th>Número da NF</th>
                            <th>Data de Emissão</th>
                            <th>Fornecedor</th>
                            <th className="text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notas.map(nota => (
                            <tr key={nota.nf_id}>
                                <td>{nota.nf_numero}</td>
                                <td>{new Date(nota.nf_data_emissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}</td>
                                <td>{nota.forn_nome || 'N/D'}</td>
                                <td className="text-center">
                                    <button className="btn btn-outline-danger btn-sm" onClick={() => aoExcluirNota(nota.nf_id)}>
                                        Excluir
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}