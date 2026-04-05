# SeniorEase — Aplicação Principal

**FIAP Pos Tech Hackathon**

SeniorEase é uma plataforma educacional desenvolvida para idosos, com foco em acessibilidade. Esta é a aplicação principal (shell), responsável pelo dashboard, atividades, caderno, fórum e configurações de perfil/acessibilidade.

[IMAGEM AQUI — screenshot da tela inicial / dashboard]

---

## Sumário

- [Visão geral da arquitetura](#visão-geral-da-arquitetura)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e execução](#instalação-e-execução)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Rotas](#rotas)
- [Funcionalidades de acessibilidade](#funcionalidades-de-acessibilidade)
- [Autenticação (microfrontend)](#autenticação-microfrontend)
- [Integração com Firebase](#integração-com-firebase)
- [Dependências principais](#dependências-principais)
- [Scripts disponíveis](#scripts-disponíveis)

---

## Visão geral da arquitetura

O projeto é composto por dois aplicativos Angular separados que funcionam como **microfrontend**:

| App                 | Porta | Responsabilidade                                                |
| ------------------- | ----- | --------------------------------------------------------------- |
| `SeniorEase` (este) | 4200  | Shell principal — dashboard, perfil, acessibilidade, atividades |
| `SeniorEase-login`  | 4201  | Autenticação — login e cadastro via Firebase Auth               |

[IMAGEM AQUI — diagrama do fluxo de autenticação entre os dois apps]

**Fluxo de autenticação:**

1. O usuário acessa o shell (`localhost:4200`)
2. O `authGuard` verifica se há um JWT válido em `sessionStorage`
3. Se não houver, redireciona para `localhost:4201` (login app)
4. Após login/cadastro bem-sucedido, o login app redireciona para `localhost:4200/auth/callback?token=<JWT>`
5. O `AuthCallbackComponent` armazena o token, carrega dados do Firestore e redireciona para `/inicio`

---

## Pré-requisitos

- **Node.js** 20+ e **npm** 10+
- **Angular CLI** 21+: `npm install -g @angular/cli`
- Conta no **Firebase** com Firestore e Authentication habilitados
- O app `SeniorEase-login` rodando em `localhost:4201` (para autenticação)

---

## Instalação e execução

```bash
# 1. Instalar dependências
npm install

# 2. Configurar Firebase
# Edite src/environments/environment.ts com as credenciais do seu projeto Firebase

# 3. Rodar em desenvolvimento
npm start
# Acesse: http://localhost:4200
```

> **Importante:** O login app (`SeniorEase-login`) deve estar rodando em `localhost:4201` para que o fluxo de autenticação funcione.

---

## Estrutura de pastas

```
src/
├── app/
│   ├── core/
│   │   ├── domain/
│   │   │   ├── entities/           # Modelos de dados (User, Nota, Atividade, Acessibilidade)
│   │   │   └── repositories/       # Interfaces dos repositórios
│   │   ├── infrastructure/
│   │   │   └── repositories/       # Implementações em localStorage
│   │   ├── services/
│   │   │   ├── auth.service.ts             # Leitura/validação do JWT (sessionStorage)
│   │   │   ├── accessibility.service.ts    # Estado reativo de acessibilidade (Signals)
│   │   │   ├── accessibility-firestore.service.ts  # Sync de prefs com Firestore
│   │   │   ├── user-firestore.service.ts   # Sync de perfil com Firestore
│   │   │   ├── voice-reading.service.ts    # Text-to-speech (Web Speech API)
│   │   │   ├── voice-input.service.ts      # Reconhecimento de voz (Web Speech API)
│   │   │   └── storage.service.ts          # Abstração de localStorage
│   │   └── use-cases/              # Casos de uso (load/save por domínio)
│   ├── features/
│   │   ├── auth-callback/          # Processa token JWT após login
│   │   ├── dashboard/              # Tela inicial (início)
│   │   ├── profile/                # Perfil do usuário (dados pessoais)
│   │   ├── accessibility/          # Configurações de acessibilidade
│   │   ├── notebook/               # Caderno de anotações
│   │   ├── activity-wizard/        # Atividades educacionais
│   │   ├── waiting-room/           # Sala de espera para aulas ao vivo
│   │   ├── active-lesson-session/  # Sessão de aula ativa
│   │   ├── forum-chat/             # Fórum de discussão
│   │   ├── final-work/             # Trabalho final
│   │   └── logout/                 # Logout
│   ├── guards/
│   │   └── auth.guard.ts           # Protege rotas autenticadas
│   ├── layout/
│   │   └── main-layout/            # Layout com sidebar e navegação
│   └── shared/
│       ├── components/             # Componentes reutilizáveis
│       └── directives/
│           └── voice-read.directive.ts  # Lê elemento em voz alta ao focar
├── environments/                   # Configurações de ambiente (Firebase, URLs)
└── styles.css                      # Estilos globais + variáveis CSS de acessibilidade
```

---

## Rotas

| Caminho              | Componente                     | Descrição                       |
| -------------------- | ------------------------------ | ------------------------------- |
| `/auth/callback`     | `AuthCallbackComponent`        | Recebe JWT e inicializa sessão  |
| `/logout`            | `LogoutComponent`              | Limpa sessão e redireciona      |
| `/inicio`            | `DashboardComponent`           | Tela inicial (requer auth)      |
| `/perfil`            | `ProfileComponent`             | Dados pessoais do usuário       |
| `/acessibilidade`    | `AccessibilityComponent`       | Configurações de acessibilidade |
| `/sala-de-espera`    | `WaitingRoomComponent`         | Sala de espera                  |
| `/aula`              | `ActiveLessonSessionComponent` | Aula ao vivo                    |
| `/meu-caderno`       | `NotebookComponent`            | Caderno de notas                |
| `/minhas-atividades` | `ActivityWizardComponent`      | Atividades                      |
| `/forum`             | `ForumChatComponent`           | Fórum                           |
| `/trabalho-final`    | `FinalWorkComponent`           | Trabalho final                  |

Todas as rotas dentro do `MainLayoutComponent` são protegidas pelo `authGuard`.

---

## Funcionalidades de acessibilidade

[IMAGEM AQUI — screenshot da tela de acessibilidade]

As preferências são salvas no **Firebase Firestore** (coleção `accessibilityPreferences/{uid}`) e também cacheadas no **localStorage** para carregamento instantâneo.

| Opção                      | O que faz                                           | Implementação                                                        |
| -------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| **Tamanho da fonte**       | Pequena / Média / Grande / Extra grande / XX grande | Adiciona classe CSS `font-large`, `font-x-large`, etc. no `<html>`   |
| **Tema**                   | Padrão / Alto contraste / Suave                     | Adiciona classe `theme-high-contrast` ou `theme-soft` no `<html>`    |
| **Velocidade de animação** | Normal / Lenta / Desativada                         | Adiciona classe `animation-slow` ou `animation-disabled` no `<html>` |
| **Leitura por voz**        | Lê elementos ao passar o foco (hover/focus)         | `VoiceReadDirective` + `VoiceReadingService` (Web Speech API)        |
| **Velocidade da voz**      | Controle deslizante de 0.5x a 1.5x                  | `SpeechSynthesisUtterance.rate`                                      |
| **Botões maiores**         | Aumenta altura e padding dos botões                 | Adiciona classe `buttons-larger` no `<html>`                         |
| **Modo silencioso**        | Desativa toda leitura por voz                       | Bloqueia chamadas ao `SpeechSynthesis` em `VoiceReadingService`      |
| **Navegação simplificada** | Simplifica a barra lateral                          | Sinal `simplifiedNav` no `AccessibilityService`                      |
| **Espaçamento aumentado**  | Aumenta espaçamentos e largura da sidebar           | Adiciona classe `spacing-increased` no `<html>`                      |
| **Fonte para dislexia**    | Fonte de maior legibilidade                         | Adiciona classe `dyslexia-font` no `<html>`                          |

**Persistência automática:** Qualquer alteração feita na tela de acessibilidade é salva no Firestore com debounce de 2 segundos. Ao sair da página, `ngOnDestroy` sempre executa um save final.

**Migração de dados:** Ao fazer login, o sistema verifica se o documento Firestore possui todos os campos. Se não (conta antiga), os campos faltantes são preenchidos com os valores padrão e salvos automaticamente.

---

## Autenticação (microfrontend)

O sistema usa **JWT (Firebase ID Token)** como mecanismo de comunicação entre os dois apps:

```
SeniorEase-login                    SeniorEase
      │                                   │
      │  1. Login bem-sucedido            │
      │  2. Gera JWT (Firebase ID Token)  │
      │  3. Redireciona para:             │
      │─────────────────────────────────►│
      │     /auth/callback?token=<JWT>    │
      │                                   │
      │                  4. Valida JWT    │
      │                  5. Carrega dados do Firestore
      │                  6. Redireciona para /inicio
```

O JWT é armazenado em **`sessionStorage`** (não em `localStorage`) — é perdido ao fechar o browser, forçando novo login, o que é mais seguro.

O `authGuard` verifica a validade do token a cada navegação interna:

```typescript
// guards/auth.guard.ts
if (!authService.isTokenValid()) {
  window.location.href = authService.loginUrl; // → localhost:4201
}
```

---

## Integração com Firebase

O app usa dois serviços do Firestore:

### `UserFirestoreService`

- **Coleção:** `userProfiles/{uid}`
- **Campos:** `name`, `email`, `phone`, `dateOfBirth`, `cpf`
- A imagem de perfil é armazenada **apenas em localStorage** (base64) devido ao tamanho

### `AccessibilityFirestoreService`

- **Coleção:** `accessibilityPreferences/{uid}`
- **Campos:** `fontSize`, `theme`, `voiceReading`, `speechRate`, `dyslexiaFont`, `animationSpeed`, `extraConfirmations`, `increasedSpacing`, `simplifiedNav`, `largerButtons`, `silentMode`

> **Nota técnica:** O app usa funções do SDK direto do Firebase (`firebase/firestore`) em vez das funções wrapped do `@angular/fire/firestore`, para evitar o erro _"Calling Firebase APIs outside of an Injection context"_ dentro de `setTimeout` e `ngOnDestroy`.

---

## Dependências principais

| Pacote                             | Versão              | Uso                                                              |
| ---------------------------------- | ------------------- | ---------------------------------------------------------------- |
| `@angular/core`                    | ^21.2.0             | Framework principal                                              |
| `@angular/fire`                    | ^20.0.1             | Integração com Firebase (Firestore, Auth)                        |
| `firebase`                         | (via @angular/fire) | SDK do Firebase                                                  |
| `@senior-ease/ui`                  | ^0.2.3              | Biblioteca de componentes internos (Buttons, Icons, Cards, etc.) |
| `@ngx-translate/core`              | ^17.0.0             | Internacionalização (pt-BR e en)                                 |
| `@ngx-translate/http-loader`       | ^17.0.0             | Carrega arquivos de tradução JSON                                |
| `@fortawesome/angular-fontawesome` | ^4.0.0              | Ícones (Font Awesome 6)                                          |
| `@angular/service-worker`          | ^21.2.0             | PWA / Service Worker                                             |
| `tailwindcss`                      | ^4.1.12             | Estilização utilitária                                           |
| `rxjs`                             | ~7.8.0              | Programação reativa                                              |

**Ferramentas de desenvolvimento:**

| Pacote                  | Uso                                               |
| ----------------------- | ------------------------------------------------- |
| `vitest`                | Testes unitários                                  |
| `prettier`              | Formatação de código                              |
| `husky` + `lint-staged` | Git hooks (formata antes de commitar)             |
| `@commitlint`           | Valida mensagens de commit (Conventional Commits) |

---

## Scripts disponíveis

```bash
npm start          # Sobe o servidor de desenvolvimento (localhost:4200)
npm run build      # Build de produção
npm run watch      # Build em modo watch (desenvolvimento)
npm test           # Executa os testes com Vitest
```

---

## Variáveis de ambiente

Configure o arquivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  loginAppUrl: 'http://localhost:4201',
  firebase: {
    apiKey: '...',
    authDomain: '...',
    projectId: '...',
    storageBucket: '...',
    messagingSenderId: '...',
    appId: '...',
  },
};
```
