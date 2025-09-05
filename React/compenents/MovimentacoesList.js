import React, { useEffect, useState } from 'react';
import MovimentacaoForm from './MovimentacaoForm';

const Api_URL = 'http://localhost/gestao-ativos/api/movimentacoes.php';

const MovimentacoesList = () => {
    const [movs, setMovs] = useState([]);
    const [mostrarForm, setMostrarForm] = useState(false);
    const [movimentoSelecionado, setMovimentoSelecionado] = useState(null);
    const [filtro, setFiltro] = useState(''); // Filtro geral
    const [dataInicio, setDataInicio] = useState(''); // Filtro data inicial
    const [dataFim, setDataFim] = useState(''); // Filtro data final

    const fetchMovs = () => {
        fetch(Api_URL)
            .then(res => res.json())
            .then(data => setMovs(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchMovs();
    }, []);

    const handleNovaOuEdicao = () => {
        fetchMovs();
        setMostrarForm(false);
        setMovimentoSelecionado(null);
    };

    const handleEditar = mov => {
        setMovimentoSelecionado(mov);
        setMostrarForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    //const handleDelete = id => {
    //    if (!window.confirm('Tem certeza que deseja excluir esta movimentação?')) return;

    //    fetch(Api_URL, {
    //       method: 'DELETE',
    //        headers: { 'Content-Type': 'application/json' },
    //        body: JSON.stringify({ id })
    //    })
    //        .then(res => res.json())
    //        .then(() => fetchMovs())
    //        .catch(err => console.error(err));
    //};

    const movsFiltrados = movs.filter(m => {
        const matchTexto =
            m.codigo_ativo.toString().includes(filtro) ||
            m.descricao.toLowerCase().includes(filtro.toLowerCase()) ||
            m.funcionario_responsavel.toLowerCase().includes(filtro.toLowerCase()) ||
            m.status.toLowerCase().includes(filtro.toLowerCase());

        let matchData = true;
        if (dataInicio) matchData = matchData && (new Date(m.data_saida) >= new Date(dataInicio));
        if (dataFim) matchData = matchData && (new Date(m.data_saida) <= new Date(dataFim));

        return matchTexto && matchData;
    });

    return (
        <div className="mt-4">
            <button
                className="btn btn-success mb-3"
                onClick={() => {
                    setMovimentoSelecionado(null);
                    setMostrarForm(!mostrarForm);
                }}
            >
                {mostrarForm ? 'Fechar Formulário' : 'Registrar Movimentação'}
            </button>

            {mostrarForm && (
                <MovimentacaoForm
                    onNovaMovimentacao={handleNovaOuEdicao}
                    movimento={movimentoSelecionado}
                    onCancel={() => {
                        setMostrarForm(false);
                        setMovimentoSelecionado(null);
                    }}
                />
            )}

            <input
                type="text"
                className="form-control mb-2"
                placeholder="Buscar por código, descrição, responsável ou status..."
                value={filtro}
                onChange={e => setFiltro(e.target.value)}
            />

            <div className="mb-2">
                <small className="text-muted">Filtrar por período:</small>
            </div>
            <div className="d-flex mb-3 gap-2">
                <input
                    type="date"
                    className="form-control"
                    value={dataInicio}
                    onChange={e => setDataInicio(e.target.value)}
                />
                <input
                    type="date"
                    className="form-control"
                    value={dataFim}
                    onChange={e => setDataFim(e.target.value)}
                />
            </div>

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Código do Ativo</th>
                    <th>Descrição</th>
                    <th>Responsável</th>
                    <th>Data Saída</th>
                    <th>Data Devolução</th>
                    <th>Status</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {movsFiltrados.length > 0 ? (
                    movsFiltrados.map(m => (
                        <tr key={m.id}>
                            <td>{m.codigo_ativo}</td>
                            <td>{m.descricao}</td>
                            <td>{m.funcionario_responsavel}</td>
                            <td>{m.data_saida}</td>
                            <td>{m.data_devolucao || '-'}</td>
                            <td>
                    <span className={`badge ${m.status === 'pendente' ? 'bg-warning' : 'bg-success'} fs-6`}>
                        {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                    </span>
                            </td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEditar(m)}
                                >
                                    ✏️
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="7">Nenhuma movimentação encontrada</td>
                    </tr>
                )}
                </tbody>
            </table>

        </div>
    );
};

export default MovimentacoesList;
