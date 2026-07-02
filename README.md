 API-Loja - Sistema de Gerenciamento

##  Sobre o Projeto

API Restful para gerenciamento de loja com autenticação JWT e persistência em MySQL. Desenvolvida como atividade de migração de MongoDB para MySQL.

###  Funcionalidades

-  Autenticação JWT (Register/Login)
-  CRUD de Categorias
-  CRUD de Produtos
-  CRUD de Clientes
-  CRUD de Pedidos
-  Rota pública de status
-  Prepared Statements (proteção SQL Injection)
-  Views EJS para frontend

---

##  Tecnologias Utilizadas

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| Node.js | v18+ | Runtime JavaScript |
| Express | 5.2.1 | Framework web |
| MySQL | 8.0+ | Banco de dados relacional |
| mysql2 | 3.14.3 | Driver MySQL com Promises |
| JWT | 9.0.3 | Autenticação via token |
| bcryptjs | 3.0.3 | Criptografia de senhas |
| EJS | 5.0.2 | Template engine |
| Dotenv | 17.4.2 | Variáveis de ambiente |

---

##  Estrutura do Projeto
api-mongodb/
├── public/
│ └── css/
│ └── style.css 
├── src/
│ ├── config/
│ │ └── database.js - Configuração MySQL
│ ├── controllers/
│ │ ├── authController.js
│ │ ├── categoriaController.js
│ │ ├── produtoController.js
│ │ ├── clienteController.js
│ │ └── pedidoController.js
│ ├── middlewares/
│ │ └── authMiddleware.js 
│ ├── models/
│ │ ├── usuarioModel.js
│ │ ├── categoriaModel.js
│ │ ├── produtoModel.js
│ │ ├── clienteModel.js
│ │ └── pedidoModel.js
│ ├── routes/
│ │ ├── apiRoutes.js 
│ │ ├── authRoutes.js 
│ │ ├── categoriaRoutes.js
│ │ ├── produtoRoutes.js
│ │ ├── clienteRoutes.js
│ │ └── pedidoRoutes.js
│ ├── views/ 
│ │ ├── login.ejs
│ │ ├── register.ejs
│ │ ├── produtos.ejs
│ │ ├── novoProduto.ejs
│ │ └── editarProduto.ejs
│ └── server.js 
├── .env 
├── package.json
└── README.md

##  Instalação e Configuração

### 1. Clonar o repositório
```bash
git clone https://github.com/FernandaBruxel/api-mongodb.git
create = api-mongodb-copia


### 2. Configurar banco de dados MySQL
1 = Criar o banco:
windows + r = cmd
mysql -u root -p 

CREATE DATABASE loja;
USE loja;

4. Configurar variáveis de ambiente

## Iniciar o servidor

npm run dev
Servidor rodando na porta 3000 = http://localhost:3000


Endpoints da API

Públicos (SEM O TOKEN)
Método	Endpoint	Descrição
GET	/api/status	Status da API
GET	/api/versao	Versão da API
POST	/api/auth/register	Cadastrar usuário
POST	/api/auth/login	Fazer login

 Privados (requerem token JWT)
Categorias
Método	Endpoint	Descrição
GET	/api/categorias	Listar todas
POST	/api/categorias	Criar nova
GET	/api/categorias/:id	Buscar por ID
PUT	/api/categorias/:id	Atualizar
DELETE	/api/categorias/:id	Deletar


EXEMPLO:
 Registrar Usuário
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "nome": "Maria Silva",
  "nick": "maria123",
  "senha": "123456"
}


Fazer Login
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "nick": "maria123",
  "senha": "123456"
}

RESPOSTA DO LOGIN:

{
" mensagem " :  "Login realizado com sucesso." ,
" token " :  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwibmljayI6Im1hcmlhMTIzIiwiaWF0IjoxNzgyOTUxMTUyLCJleHAiOjE3ODMwMzc1NTJ9.DBfw5CzqaSE2oq5iFLekISJyUMrBRqAHJftLYRIKHTU" ,
" usuário " :{
" id " :  6 ,
" nome " :  "Maria Silva" ,
" nick " :  "maria123"
}
(SEMPRE GUARDAR O TOKEN!)


## Banco de Dados

Diagrama de Tabelas

usuarios     -  id_usuario, nome, nick, senha
categorias   -  id_categoria, nome
produtos     -  id_produto, nome, valor, estoque, categorias_id_categoria
clientes     -  id_cliente, nome, telefone, status
pedidos      -  id_pedido, data, clientes_id_cliente
produtos_pedidos - produtos_id_produto, pedidos_id_pedido, quantidade, valor

Verificar Dados:

USE loja;
SELECT * FROM categorias;
SELECT * FROM produtos;
SELECT * FROM clientes;
SELECT * FROM pedidos;
SELECT * FROM usuarios;

Projeto de migração de MongoDB para MySQL - Atividade avaliativa.

Fernanda Bruxel - 63-1