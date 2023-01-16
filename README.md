
# NG.CASH Back-end

Este foi um projeto desenvolvido para o processo seletivo da empresa NG.CASH e trata-se de uma aplicação onde é possível realizar transferências entre usuários.

## Stack e ferramentas utilizadas

**Back-end:**
- Typescript
- Node.js
- NestJS
- Prisma
- Postgresql
- Express
- Docker
- Jwt
- BCrypt
- Zod
- Jest
- Eslint
- Prettier


## Funcionalidades

- Registrar e logar usuário
- Realizar transferência de valores entre contas

## Rodando localmente

*Para executar o projeto localmente será necessário ter o [Docker](https://docs.docker.com/) instalado em sua máquina.*

Clone o projeto

```bash
  git clone git@github.com:ecioferraz/ngcash-backend.git
```

Entre no diretório do projeto

```bash
  cd ngcash-backend
```

Instale as dependências

```bash
  npm install
```

Crie um arquivo .env e copie o conteúdo de .env.example

```bash
  cp .env.example .env
```

Inicie o docker-compose

```bash
  docker-compose up
```

No .env, na variável de ambiente **DATABASE_URL**, altere a porta local de *postgres* para **localhost** e crie as migrations

```bash
  npx prisma migrate dev --name init
```

Após concluído, altere de volta sua porta local de *localhost* para **postgres** e acesse a aplicação através de http://localhost:3000/
## Rodando os testes

Para rodar os testes, rode o seguinte comando

```bash
  npm test
```

Para verificar cobertura de testes, rode o seguinte comando

```bash
  npm run test:cov
```


## Documentação da API

#### Cadastra usuário e retorna o usuário criado contendo id, username e accountId

```http
  POST /register
```

| Body   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `username` | `string` | **Obrigatório**. Seu nome de usuário |
| `password` | `string` | **Obrigatório**. Sua senha |

#### Realiza o login e retorna a id, username, accountId do usuário e um token com validade de 24 horas

```http
  GET /login
```

| Query   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `username` | `string` | **Obrigatório**. Seu nome de usuário |
| `password` | `string` | **Obrigatório**. Sua senha |

#### Retorna uma lista de usuários cadastrados

```http
  GET /users
```

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |


#### Retorna um usuário contendo id, username e accountId

```http
  GET /users/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário que você quer |

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |

#### Deleta um usuário

```http
  DELETE /users/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID do usuário que você quer |

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |

#### Retorna uma lista de contas cadastradas

```http
  GET /accounts
```

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |

#### Retorna uma conta contendo id da conta e saldo

```http
  GET /accounts/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID da conta que você quer |

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |

#### Retorna o saldo de um usuário

```http
  GET /accounts/balance
```

| Query   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `username` | `string` | **Obrigatório**. Seu nome de usuário |
| `accountId` | `string` | **Obrigatório**. O ID da conta do mesmo usuário |

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |

#### Deleta uma conta

```http
  DELETE /accounts/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID da conta que você quer |

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |

#### Realiza uma transação e retorna um objeto contendo id da transação, id da conta creditada, id da conta debitada, valor e data e hora da transação

```http
  POST /transactions
```

| Body   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `creditedUsername` | `string` | **Obrigatório**. O nome de usuário da pessoa a receber a transação |
| `debitedUsername` | `string` | **Obrigatório**. Seu nome de usuário |
| `value` | `number` | **Obrigatório**. O valor da transação |

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |

#### Retorna as transações referentes ao usuário, podendo ser filtradas por transações creditadas, debitadas ou todas, assim como ordenadas por momento da transação

```http
  GET /transactions
```

| Body   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `accountId` | `string` | **Obrigatório**. O ID da conta do usuário |
| `username` | `string` | **Obrigatório**. Seu nome de usuário |
| `orderBy` | `string` | Ordem de listagem, aceita 'asc' ou 'desc' (default) |
| `type` | `string` | Tipo de transação, aceita 'cash-in', 'cash-out' ou 'all' (default) |

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |

### Deleta uma transação

```http
  DELETE /transactions/${id}
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `id`      | `string` | **Obrigatório**. O ID da transação que você quer |

| Auth   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `Bearer Token` | `string` | **Obrigatório**. O token fornecido no login |


## Referência

 - [Nest.js](https://docs.nestjs.com/)
 - [Prisma](https://www.prisma.io/docs)
 - [devGenius](https://blog.devgenius.io/setup-project-and-fastify-platform-nestjs-with-passport-01-61a8a5bc2b5)


## Aprendizados

Foi a primeira vez que utilizei Nest.js, Prisma e Postgresql em um projeto, o que foi minha maior motivação de realizá-lo após muita pesquisa de como seria a melhor maneira, para mim, de desenvolvê-lo. São ferramentas que certamente continuarei utilizando em outros projetos.

## Autores

- [@ecioferraz](https://www.github.com/ecioferraz)

