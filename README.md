# 🧩 Sistema Web de Gestão de Ativos

Este projeto tem como objetivo simplificar e modernizar o controle de ferramentas, máquinas e equipamentos dentro de uma empresa, oferecendo rastreabilidade completa dos ativos — desde a saída até o retorno ao estoque.

## 🚀 Tecnologias Utilizadas

- **Frontend**: React  
- **Backend**: PHP  
- **Banco de Dados**: MySQL  
- **Ambiente de Desenvolvimento**: XAMPP (Apache, PHP, MySQL)

## 🔐 Funcionalidades

### Gestão de Ativos
- Cadastro, edição e exclusão de ativos
- Campos: código, nome e descrição
- Filtro por texto para localizar ativos rapidamente

### Controle de Movimentações
- Registro automático da data de saída e funcionário responsável
- Atualização de status para "Devolvido" com data de retorno automática
- Status dinâmico:
  - **Pendente**: ativo em uso
  - **Devolvido**: ativo disponível no estoque

### Tela de Login e Dashboard
- Autenticação simples e segura
- Dashboard com indicadores:
  - Quantidade de ativos no estoque
  - Movimentações pendentes e devolvidas
  - Acesso direto às páginas de ativos e movimentações

### Filtros Avançados
- Filtro por texto: código, nome, descrição, responsável ou status
- Filtro por período para análise de movimentações

### Interface e Usabilidade
- Layout responsivo e intuitivo
- Botões para ações rápidas
- Tabelas organizadas para facilitar o gerenciamento

