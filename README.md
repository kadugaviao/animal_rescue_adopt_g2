# Sistema de Resgate e Adoção de Animais

Projeto full stack para cadastro de animais resgatados, listagem dos animais disponíveis para adoção, envio de solicitações de adoção, registro de resgates e controle de acesso por perfil.

## Funções básicas

- Cadastro e login com JWT
- Listagem de animais com filtros por espécie, porte e status
- Detalhes do animal e solicitação de adoção
- Acompanhamento das próprias solicitações
- Registro de animais em situação de resgate
- Área administrativa: cadastrar/editar/remover animais, aprovar ou rejeitar adoções e alterar status dos resgates

## Instalação

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Configurar o backend

Na pasta `backend/`, copie o arquivo de ambiente:

```bash
cp .env.example .env
```

Preencha o `.env` com a string do PostgreSQL e o segredo do JWT:

```env
DATABASE_URL="postgresql://usuario:senha@host.neon.tech/banco?sslmode=require"
JWT_SECRET="sua_chave_secreta"
PORT=3333
JWT_EXPIRES_IN=7d
```

> O banco é PostgreSQL na nuvem (Neon). Crie um banco gratuito em [neon.tech](https://neon.tech), copie a connection string (com `?sslmode=require`) e cole na `DATABASE_URL`.

Depois, ainda na pasta `backend/`, gere o Prisma Client e crie as tabelas a partir das migrations:

```bash
npx prisma generate
npx prisma migrate dev
```

## Configurar o frontend

Na pasta `frontend/`, copie o arquivo de ambiente:

```bash
cp .env.example .env
```

O valor padrão já aponta para a API local:

```env
VITE_API_URL=http://localhost:3333
```

## Rodar o backend

```bash
cd backend
npm run dev
```

API em: [http://localhost:3333](http://localhost:3333)

## Rodar o frontend

```bash
cd frontend
npm run dev
```

Acesse: [http://localhost:5173](http://localhost:5173)

## Primeiro acesso

O sistema não vem com usuário admin criado, e o cadastro público sempre cria usuários comuns (`role: "USER"`) por segurança. Para criar o primeiro admin, promova um usuário direto no banco:

1. Cadastre um usuário pela tela `Cadastrar` (ex.: email `admin@teste.com`), ou pela API:

```bash
curl -X POST http://localhost:3333/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@teste.com","password":"123456"}'
```

2. Promova esse usuário a admin. O jeito mais simples é pelo Prisma Studio (na pasta `backend/`):

```bash
npx prisma studio
```

Abra a tabela **users**, troque o campo `role` do usuário de `USER` para `ADMIN` e salve.

> Alternativa via SQL: `UPDATE "users" SET role = 'ADMIN' WHERE email = 'admin@teste.com';`

3. Faça login com esse admin no frontend.
4. Acesse `Gerir animais` e cadastre pelo menos um animal.
5. Cadastre um usuário comum pela tela `Cadastrar` e solicite a adoção com ele.

## Perfis de usuário (promover admin)

O sistema tem dois perfis: `USER` (comum) e `ADMIN`. Por segurança, o cadastro sempre cria `USER`. Para promover alguém, atualize o perfil no banco:

```bash
# na pasta backend/
npx prisma studio   # edite o campo role do usuário para ADMIN
```

> Ou via SQL: `UPDATE "users" SET role = 'ADMIN' WHERE email = 'EMAIL_DO_USUARIO';`

Após promover, o usuário precisa fazer **logout e login novamente** para o novo perfil ter efeito (o perfil fica gravado no token JWT).

Diferença entre os perfis:

- **USER:** vê a listagem de animais, solicita adoções, acompanha os próprios pedidos e registra resgates.
- **ADMIN:** tudo do user, mais cadastrar/editar/remover animais, aprovar ou rejeitar adoções e alterar o status dos resgates.

## Fluxo básico de uso

1. Abra o frontend em [http://localhost:5173](http://localhost:5173).
2. Cadastre um usuário na tela `Cadastrar`.
3. Faça login.
4. Entre com um usuário `ADMIN`, vá em `Gerir animais` e cadastre um animal.
5. Veja os animais na tela `Animais` e use os filtros por espécie, porte e status.
6. Abra os detalhes de um animal disponível e envie uma solicitação de adoção.
7. Acompanhe o pedido na tela `Minhas adoções`.
8. Registre um animal em situação de risco na tela `Registrar resgate`.
9. Entre com o `ADMIN` para aprovar/rejeitar adoções e alterar o status dos resgates.

## Observações rápidas

- O cadastro pela interface cria usuário comum (`USER`).
- É preciso ter pelo menos um animal cadastrado (por um admin) antes de solicitar adoção.
- Um usuário não pode solicitar adoção do mesmo animal mais de uma vez.
- Ao aprovar uma adoção, o animal passa automaticamente para o status `ADOPTED`.
- As migrations do banco estão em `backend/prisma/migrations/`.
- A coleção do Postman está em `backend/postman/Rescue Adopt API.postman_collection.json`.

## Tecnologias

- Backend: Node.js, Express, TypeScript, Prisma, PostgreSQL (Neon), JWT e bcrypt
- Frontend: React, Vite, TypeScript, Tailwind CSS, Axios e React Router DOM
