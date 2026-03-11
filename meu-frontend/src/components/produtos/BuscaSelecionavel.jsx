import { useState } from 'react';

export default function BuscaSelecionavel({
    itens = [],
    aoSelecionar = () => {},
    placeholder = 'Buscar...',
    campoExibicao = 'nome',
    campoId = 'id'
}) {
    const [termoBusca, setTermoBusca] = useState('');
    const [estaAberto, setEstaAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState(null);

    const itensFiltrados = itens.filter(item =>
        item[campoExibicao]
        .toLowerCase()
        .includes(termoBusca.toLowerCase())
    );

    const manipularBusca = (e) => {
        setTermoBusca(e.target.value);
        setEstaAberto(e.target.value.length > 0);
    };

    const aoSelecionarItem = (item) => {
        setItemSelecionado(item);
        aoSelecionar(item);
        setTermoBusca('');
        setEstaAberto(false);
    };

    return (
        <div style={{ position: 'relative' }}>
            <input
                type="text"
                placeholder={placeholder}
                value={termoBusca}
                onChange={manipularBusca}
                style={{ width: '100%', padding: '8px',
                        borderRadius: '4px', border: '1px solid #ccc' }}
            />

            {estaAberto && itensFiltrados.length > 0 && (
                <div style={{
                    position: 'absolute', top: '100%',
                    left: 0, right: 0, background: 'white',
                    border: '1px solid #ccc', borderRadius: '4px',
                    marginTop: '4px', maxHeight: '200px',
                    overflowY: 'auto', zIndex: 10
                }}>
                    {itensFiltrados.map(item => (
                        <div
                            key={item[campoId]}
                            onClick={() => aoSelecionarItem(item)}
                            style={{ padding: '10px 12px', cursor: 'pointer',
                                    borderBottom: '1px solid #f0f0f0' }}
                            onMouseEnter={(e) => e.target.style.background = '#f5f5f5'}
                            onMouseLeave={(e) => e.target.style.background = 'white'}
                        >
                            {item[campoExibicao]}
                        </div>
                    ))}
                </div>
            )}

            {itemSelecionado && (
                <div style={{ 
                    marginTop: '8px', padding: '8px',
                    background: '#e8f5e9', color: '#2e7d32',
                    borderRadius: '4px', fontSize: '0.9em'
                }}>
                    ✓ Selecionado: <strong>{itemSelecionado[campoExibicao]}</strong>
                </div>
            )}
        </div>
    );
}