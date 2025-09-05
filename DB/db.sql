CREATE DATABASE IF NOT EXISTS ativos_db;

USE ativos_db;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    perfil ENUM('admin','funcionario') DEFAULT 'funcionario'
);

CREATE TABLE ativos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    codigo INT UNIQUE NOT NULL,
    descricao VARCHAR(200) NOT NULL
);

CREATE TABLE movimentacoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo_ativo INT NOT NULL,                                      
    funcionario_responsavel VARCHAR(100) NOT NULL,
    data_saida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    data_devolucao TIMESTAMP DEFAULT NULL,
    status ENUM('pendente', 'devolvido') DEFAULT 'pendente',
    FOREIGN KEY (codigo_ativo) REFERENCES ativos(codigo)
);
