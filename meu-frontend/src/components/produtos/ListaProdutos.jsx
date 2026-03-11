import { useState, useEffect } from 'react';

export default function ListaNotasFiscais({ atualizar = false }) {
    const [notas, setNotas] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const buscarNotas = () => {
        fetch('http://localhost:3000/api/notas')
        .then(res => res.json())
        .then(dados => { setNotas(dados); setCarregando(false); })
        .catch(erro => { console.error(erro); setCarregando(false); });
    };

    useEffect(() => { buscarNotas(); }, [atualizar]);

    const aoExcluirNota = (idNota) => {
        if (window.confirm('Tem certeza que deseja excluir esta Nota Fiscal?')) {
            fetch(`http://localhost:3000/api/notas/${idNota}`, {
                method: 'DELETE'
            })
            .then(() => {
                setNotas(notas.filter(n => n.nf_id !== idNota));
                alert('Nota Fiscal excluída com sucesso!');
            })
            .catch(erro => console.error('Erro ao excluir:', erro));
        }
    };

    if (carregando) return <p>Carregando Notas Fiscais...</p>;
    if (notas.length === 0) return <p>Nenhuma Nota Fiscal cadastrada.</p>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Notas Fiscais Cadastradas</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                <tr style={{ background: '#f0f0f0', borderBottom: '2px solid #2196f3' }}>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Número da NF</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Data de Emissão</th>
                    <th style={{ padding: '10px', textAlign: 'left' }}>Fornecedor</th>
                    <th style={{ padding: '10px', textAlign: 'center' }}>Ações</th>
                </tr>
                </thead>
                <tbody>
                {notas.map(nota => (
                    <tr key={nota.nf_id} style={{ borderBottom: '1px solid #ddd' }}>
                        <td style={{ padding: '10px' }}>{nota.nf_numero}</td>
                        
                        <td style={{ padding: '10px' }}>
                            {new Date(nota.nf_data_emissao).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                        </td>
                        
                        <td style={{ padding: '10px' }}>
                            {nota.forn_nome || nota.id_fornecedor || 'N/D'}
                        </td>
                        
                        <td style={{ padding: '10px', textAlign: 'center' }}>
                            <button
                                onClick={() => aoExcluirNota(nota.nf_id)}
                                style={{ background: '#f44336', color: 'white',
                                        border: 'none', padding: '6px 12px',
                                        cursor: 'pointer', borderRadius: '4px' }}>
                                Excluir
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}