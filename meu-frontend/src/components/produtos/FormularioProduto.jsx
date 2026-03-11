import { useState, useEffect } from 'react';
import BuscaSelecionavel from './BuscaSelecionavel';
import ListaPratos from './ListaProdutos';


export default function FormularioNotaFiscal() {
    const [numeroNF, setNumeroNF] = useState('');
    const [dataEmissao, setDataEmissao] = useState('');

    const [fornecedores, setFornecedores] = useState([]);
    const [fornecedorSelecionado, setFornecedorSelecionado] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        fetch('http://localhost:3000/api/fornecedores')
            .then(res => res.json())
            .then(dados => {
                console.log(dados)
                setFornecedores(dados);
                setCarregando(false);
            })
            .catch(erro => {
                console.error('Erro ao buscar fornecedores:', erro);
                setCarregando(false);
            });
    }, []);

    const aoSalvarNota = () => {
        if (!numeroNF || !dataEmissao || !fornecedorSelecionado) {
            alert('Preencha o número, a data e selecione um fornecedor!');
            return;
        }

        const corpo = {
            nf_numero: numeroNF,
            nf_data_emissao: dataEmissao,
            id_fornecedor: fornecedorSelecionado.forn_id,
            nf_fornecedor: fornecedorSelecionado.forn_nome,
            produtosMovimentados: [] 
        };

        fetch('http://localhost:3000/api/notas', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(corpo)
        })
            .then(res => res.json())
            .then(() => {
                alert('Nota Fiscal cadastrada com sucesso!');
                setNumeroNF('');
                setDataEmissao('');
                setFornecedorSelecionado(null);
            })
            .catch(erro => console.error('Erro ao salvar a Nota Fiscal:', erro));
    };

    if (carregando) return <p>Carregando sistema...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Cadastrar Nota Fiscal de Entrada</h2>
            
            <label style={{ display: 'block', marginBottom: '12px' }}>
                <strong>Número da NF:</strong>
                <input 
                    type="text" 
                    value={numeroNF}
                    onChange={(e) => setNumeroNF(e.target.value)}
                    placeholder="Ex: NF-1020"
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }} 
                />
            </label>

            <label style={{ display: 'block', marginBottom: '12px' }}>
                <strong>Data de Emissão:</strong>
                <input 
                    type="date" 
                    value={dataEmissao}
                    onChange={(e) => setDataEmissao(e.target.value)}
                    style={{ width: '100%', padding: '8px', marginTop: '4px' }} 
                />
            </label>

            <label style={{ display: 'block', marginBottom: '20px' }}>
                <strong>Fornecedor (Emissor da NF):</strong>
                <BuscaSelecionavel
                    itens={fornecedores}
                    aoSelecionar={setFornecedorSelecionado}
                    placeholder="Buscar fornecedor cadastrado..."
                    campoExibicao="forn_nome" 
                    campoId="forn_id"         
                />
            </label>

            <button 
                onClick={aoSalvarNota}
                style={{ 
                    width: '100%', padding: '10px', background: '#2196f3',
                    color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                }}>
                Salvar Capa da Nota
            </button>

            <ListaPratos />
        </div>
    );
}