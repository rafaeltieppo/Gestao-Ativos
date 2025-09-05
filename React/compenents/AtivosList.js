import React, { useEffect, useState } from 'react';
import AtivosForm from './AtivosForm';

const API_URL = 'http://localhost/gestao-ativos/api/ativos.php';

const AtivosList = () => {
    const [ativos, setAtivos] = useState([]);
    const [ativoSelecionado, setAtivoSelecionado] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchAtivos = () => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setAtivos(Array.isArray(data) ? data : []))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAtivos();
    }, []);

    const handleAdd = () => {
        setAtivoSelecionado(null); // limpar form
        setShowForm(true);
    };

    const handleEdit = ativo => {
        setAtivoSelecionado(ativo);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = id => {
        if (!window.confirm('Tem certeza que deseja excluir este ativo?')) return;

        fetch(API_URL, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
            .then(res => res.json())
            .then(() => fetchAtivos())
            .catch(err => console.error(err));
    };

    return (
        <div className="container">

            {!showForm && (
                <button className="btn btn-success mb-4 mt-4" onClick={handleAdd}>
                    Cadastrar
                </button>
            )}

            {showForm && (
                <AtivosForm
                    ativo={ativoSelecionado}
                    onSucesso={() => {
                        setShowForm(false);
                        setAtivoSelecionado(null);
                        fetchAtivos();
                    }}
                    onCancel={() => {
                        setShowForm(false);
                        setAtivoSelecionado(null);
                    }}
                />
            )}

            <table className="table table-striped">
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                </tr>
                </thead>
                <tbody>
                {ativos.length > 0 ? (
                    ativos.map(a => (
                        <tr key={a.id}>
                            <td>{a.codigo}</td>
                            <td>{a.nome}</td>
                            <td>{a.descricao}</td>
                            <td>
                                <button
                                    className="btn btn-sm btn-warning me-2"
                                    onClick={() => handleEdit(a)}
                                >
                                    ✏️
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(a.id)}
                                >
                                    🗑️
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="5">Nenhum ativo encontrado</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default AtivosList;
