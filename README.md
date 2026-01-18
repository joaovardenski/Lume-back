# 🌙 Lume – Backend (API)

<div align="center">
  <p><i>API RESTful para o ecossistema Lume, gerenciando persistência de dados, autenticação e organização de tarefas.</i></p>
</div>

<div align="center">

![Node.js](https://img.shields.io/badge/node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Docker](https://img.shields.io/badge/docker-2496ED.svg?style=for-the-badge&logo=docker&logoColor=white)

</div>

---

## 📌 Sobre o Projeto

Este é o motor da aplicação **Lume**. Uma API robusta construída para fornecer dados de forma rápida e segura para o frontend. Ela lida com a lógica de filtros inteligentes (My Day, Important, etc.), autenticação de usuários e o gerenciamento completo do ciclo de vida das tarefas.

> **Repositório Frontend:** [Lume-front](https://github.com/joaovardenski/Lume-front)

---

## 🚀 Funcionalidades

- **Autenticação:** Sistema de login e registro com JWT (JSON Web Tokens).
- **Gestão de Tasks:** CRUD completo com suporte a descrições e datas de entrega.
- **Lógica de Filtros:** Endpoints preparados para retornar tarefas baseadas em critérios (Importância, Data, Conclusão).
- **Relacionamentos:** Cada tarefa é vinculada estritamente ao seu criador.
- **Segurança:** Senhas criptografadas e rotas protegidas por middleware.

---

## 🛠️ Tecnologias Utilizadas

- **Runtime:** [Node.js](https://nodejs.org/)
- **Framework:** [Express](https://expressjs.com/pt-br/)
- **Banco de Dados:** [PostgreSQL](https://www.postgresql.org/)
- **Segurança:** [Bcrypt](https://www.npmjs.com/package/bcrypt) para hashing de senhas.
- **Linguagem:** TypeScript para tipagem e melhor manutenção.
- **Containerização:** Docker & Docker Compose.

---

## 📂 Estrutura de Pastas

```text
src/
├── config/       # Configurações de Cors e banco
├── controllers/  # Lógica de controle das rotas
├── database/     # Estrutura do banco de dados
├── middlewares/  # Validadores e proteção de rotas (Auth)
├── repositories/ # Lógica de querys para o banco
├── routes/       # Definição dos endpoints da API
├── services/     # Regras de negócio e integração com banco
└── server.ts     # Ponto de entrada da aplicação
```

---

## 📡 Endpoints Principais (API)

### 🔑 Autenticação
- POST /register - Criar nova conta.
- POST /login - Autenticar usuário e receber Token.

### 📝 Tarefas (Tasks)
- GET /tasks - Listar todas as tarefas do usuário.
- POST /tasks - Criar uma nova tarefa.
- PATCH /tasks/:id - Atualizar status, importância ou conteúdo.
- DELETE /tasks/:id - Remover uma tarefa.

---

## ⚙️ Como Rodar o Projeto

### Executando no navegador

#### Siga o link para o projeto rodando no servidor
```text
https://lume-front.vercel.app/
```

### 🐳 Executando com Docker

#### Pré-requisitos
- Docker
- Docker Compose

Este projeto é totalmente containerizado. Com apenas um comando, a API e o banco de dados sobem prontos para uso.

### Passos

```bash
git clone https://github.com/joaovardenski/Lume-back.git
cd Lume-back
cp .env.example .env
docker compose up --build
```

---

## 👨‍💻 Autor
**João Victor Vardenski de Andrade** Estudante de Engenharia de Software.
<div align="center"> Desenvolvido com ❤️ por João Victor </div>
