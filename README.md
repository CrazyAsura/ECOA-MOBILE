# ECOA - Sistema de Monitoramento e Engajamento Comunitário

![ECOA Logo](./logo.png)

## 📌 Sobre o Projeto

O **ECOA** é uma plataforma robusta de monitoramento e engajamento comunitário, composta por uma aplicação móvel (Android/iOS/Web) e um backend escalável. O projeto visa facilitar a comunicação entre cidadãos e órgãos responsáveis, permitindo o relato de incidentes, acompanhamento de resoluções e interação via fórum.

Este repositório contém:
- **Mobile**: Aplicativo desenvolvido com Expo e React Native.
- **Backend**: API REST e WebSocket desenvolvida com NestJS.

---

## 🛠️ Tecnologias Utilizadas

### Mobile
- **Framework**: [Expo](https://expo.dev/) (SDK 55*) com [Expo Router](https://docs.expo.dev/router/introduction/).
- **UI/Styling**: [GlueStack UI](https://gluestack.io/) & [NativeWind v5](https://www.nativewind.dev/) (Tailwind CSS para React Native).
- **Gerenciamento de Estado**: [Redux Toolkit](https://redux-toolkit.js.org/) & [TanStack Query (React Query)](https://tanstack.com/query/latest).
- **Comunicação**: [Axios](https://axios-http.com/) & [Socket.io-client](https://socket.io/docs/v4/client-api/).
- **Formulários**: [Zod](https://zod.dev/) para validação.

### Backend
- **Framework**: [NestJS](https://nestjs.com/).
- **Banco de Dados**: [TypeORM](https://typeorm.io/) com suporte a SQLite (desenvolvimento) e PostgreSQL.
- **Autenticação**: [Argon2](https://github.com/ranisalt/node-argon2) para hashing de senhas.
- **Tempo Real**: [Socket.io](https://socket.io/) para notificações e chat.
- **Documentação**: [Swagger](https://swagger.io/) (disponível em `/api`).
- **Cache**: [Redis](https://redis.io/) via Cache Manager.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão LTS recomendada).
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/).
- [Expo Go](https://expo.dev/expo-go) instalado no celular (para testes mobile).

### 1. Configuração do Backend
```bash
cd backend
npm install
npm run start:dev
```
O servidor estará rodando em `http://localhost:3000`. A documentação Swagger pode ser acessada em `http://localhost:3000/api`.

### 2. Configuração do Mobile
```bash
cd mobile
npm install
npm run start
```
### 3. Exposição via Ngrok (Opcional)
Caso precise expor o backend ou o app para acesso externo (ex: testar notificações em dispositivo real fora da rede local):
```bash
./ngrok http 3000
```
Certifique-se de atualizar as variáveis de ambiente no mobile para apontar para a URL do Ngrok.

---

## 🌐 Deploy Web

O projeto está configurado para exportação estática da versão Web.

### Gerar Build Web
Para gerar os arquivos de produção para a Web, execute:
```bash
cd mobile
npm run build
```
Isso criará uma pasta `dist` dentro do diretório `mobile` com todos os arquivos estáticos prontos para deploy.

### Hospedagem
Você pode hospedar a pasta `dist` em qualquer serviço de arquivos estáticos:
- **Netlify**: `npx netlify deploy --dir=mobile/dist`
- **Vercel**: `npx vercel mobile/dist`
- **Expo Hosting**: `npx eas hosting:deploy`

---

## 🏗️ Estrutura de Pastas

```text
.
├── backend/                # Código fonte da API NestJS
│   ├── src/                # Lógica de negócio, controllers e services
│   └── database.sqlite     # Banco de dados local (desenvolvimento)
├── mobile/                 # Código fonte do App React Native
│   ├── app/                # Rotas (Expo Router)
│   ├── components/         # Componentes reutilizáveis
│   ├── store/              # Configuração do Redux
│   └── constants/          # Constantes e temas
└── logo.png                # Identidade visual
```

---

## 📄 Licença

Este projeto é para uso educacional/privado (UNLICENSED). Consulte os arquivos de package.json para mais detalhes sobre os autores.

---
*Desenvolvido com ❤️ pela equipe ECOA.*
