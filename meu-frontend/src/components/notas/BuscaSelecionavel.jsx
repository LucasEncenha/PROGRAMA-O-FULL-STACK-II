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
        item[campoExibicao].toLowerCase().includes(termoBusca.toLowerCase())
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
        <div className="position-relative">
            <input type="text" className="form-control" placeholder={placeholder}
                value={termoBusca} onChange={manipularBusca} />

            {estaAberto && itensFiltrados.length > 0 && (
                <ul className="list-group position-absolute w-100 shadow-sm z-3"
                    style={{ top: '100%', maxHeight: 200, overflowY: 'auto' }}>
                    {itensFiltrados.map(item => (
                        <li key={item[campoId]}
                            className="list-group-item list-group-item-action"
                            style={{ cursor: 'pointer' }}
                            onClick={() => aoSelecionarItem(item)}>
                            {item[campoExibicao]}
                        </li>
                    ))}
                </ul>
            )}

            {itemSelecionado && (
                <div className="form-text text-success mt-1">
                    ✓ Selecionado: <strong>{itemSelecionado[campoExibicao]}</strong>
                </div>
            )}
        </div>
    );
}