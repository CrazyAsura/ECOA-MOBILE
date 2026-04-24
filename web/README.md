# ECOA Web Platform - Painel Operacional 🌍

Sistema de monitoramento e gestão em tempo real para a plataforma ECOA. Desenvolvido com foco em alta performance, segurança de dados e uma experiência de usuário premium e cinemática.

## 🚀 Tecnologias

- **Framework:** Next.js 15 (App Router)
- **Estilização:** Tailwind CSS v4 (Aesthetics-First)
- **Animações:** Framer Motion
- **Mapas:** React Leaflet (Dark Mode Customizado)
- **Segurança:** 
  - Role-Based Access Control (RBAC)
  - Criptografia de parâmetros de URL
  - Mock Redis para Caching de alto desempenho
- **Forms:** React Hook Form + Zod

## 🛡️ Níveis de Acesso & Dashboards

O sistema é dividido em 4 painéis operacionais distintos, cada um com sua própria estética e funcionalidades:

1. **Super Admin:** Gestão total do sistema, CRUD de administradores e monitoramento de logs globais.
2. **Admin:** Gestão de cursos (Academia Ecoa), moderação de fórum e triagem de queixas.
3. **Contratante:** Painel de ordens de serviço (missões) para equipes de campo.
4. **Super Contratante:** Visão de rede, monitoramento de SLA e alertas críticos.

### 🔑 Credenciais de Teste (Seeds)

| Cargo | E-mail | Senha |
| :--- | :--- | :--- |
| **Super Admin** | `super@ecoa.br` | `super123` |
| **Admin** | `admin@ecoa.br` | `admin123` |
| **Contratante** | `prestador@ecoa.br` | `field123` |
| **Super Contratante** | `supervisor@ecoa.br` | `boss123` |

## 🛠️ Funcionalidades Principais

- **Geolocalização:** Mapas interativos em dark mode para visualização de queixas e equipes.
- **Segurança de URL:** IDs de recursos são criptografados na barra de endereços para evitar manipulação maliciosa.
- **Performance:** Sistema de cache simulado (Redis) para carregamento instantâneo de listas pesadas.
- **Proteção de Rotas:** Layout guards que impedem o acesso a usuários não autorizados ou com cargos incompatíveis.

## 📦 Como Rodar o Projeto

1. Certifique-se de ter o **Node.js** instalado.
2. Entre na pasta do projeto:
   ```bash
   cd web
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
5. Acesse `http://localhost:3000`.

---
Desenvolvido com ❤️ pela equipe **ECOA Systems**.
