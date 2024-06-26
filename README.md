## Overview
W2 is one of the NCC tools to controls, request to the workflow of the company, 
### Table of Contents

- [Prerequisites](#prerequisites)
- [Frontend Setup](#frontend-setup)
- [Backend](#backend)

### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Visual Studio Code](https://code.visualstudio.com/) installed.
- [Node.js](https://nodejs.org/en) installed.
- [pnpm](https://pnpm.io/installation) installed.

### Frontend Setup
- Open Front-end repository
For example:
```bash
cd C:\Users\long.vodinhhoang\Documents\workflow-w2-ui
```
- Open code editor
```bash
code .
```

- Install pnpm (if not yet installed):
Using PowerShell:

```bash
iwr https://get.pnpm.io/install.ps1 -useb | iex

```
- Install dependencies:
```bash
pnpm install
```
- Create `.env.development` and add these config:

```bash
VITE_OAUTH_CLIENT_ID=
VITE_GOOGLE_LOGIN_REDIRECT=
VITE_AUTHORITY_URL=
VITE_API_BASE_URL=
VITE_PROXY_SERVER_URL=
```
- Run Project:
```bash
pnpm run dev
```

### Backend
- [Backend repository](https://github.com/nccasia/workflow-w2).

- [API Documents](http://10.10.32.10:4433/swagger/index.html).