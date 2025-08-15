# NCC ERP Workflow W2 UI - Frontend Setup Guideline

## Overview
W2 is one of the NCC tools to control and request workflow processes in the company.

### Table of Contents

- [Prerequisites](#prerequisites)
- [Frontend Setup](#frontend-setup)
- [Backend](#backend)
- [Useful Commands](#useful-commands)
- [Notes & Troubleshooting](#notes--troubleshooting)

---

### Prerequisites

Before you begin, ensure you have met the following requirements:

- [Visual Studio Code](https://code.visualstudio.com/) installed.
- [Node.js](https://nodejs.org/en) installed (recommended >=16.x).
- [pnpm](https://pnpm.io/installation) installed.

---

### Frontend Setup

1. **Clone Frontend Repository**
   ```bash
   git clone https://github.com/ncc-erp/ncc-erp-workflow-w2-ui.git
   cd ncc-erp-workflow-w2-ui
   ```

2. **Checkout Development Branch**
   ```bash
   git checkout develop
   ```

3. **Open Code Editor**
   - Change directory to the project folder (if not already):
     ```bash
     cd ncc-erp-workflow-w2-ui
     ```
   - Open the folder in Visual Studio Code:
     ```bash
     code .
     ```

4. **Install pnpm (if not yet installed)**
   Using PowerShell:
   ```bash
   iwr https://get.pnpm.io/install.ps1 -useb | iex
   ```

5. **Install Dependencies**
   ```bash
   pnpm install
   ```

6. **Configure Environment Variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and update values as needed (API URLs, keys, etc).

7. **Run Project**
   ```bash
   pnpm run dev
   ```
   - Default frontend port: `4200` or `4201`.

8. **Access Application**
   - Frontend UI will be available at: [http://localhost:4200](http://localhost:4200)

---

### Useful Commands

- Build for production:
  ```bash
  pnpm run build
  ```
- Run tests:
  ```bash
  pnpm run test
  ```
- Lint code:
  ```bash
  pnpm run lint
  ```

---

### Notes & Troubleshooting

- If you get dependency errors, delete `node_modules` and run install again.
- If you get port conflicts, change the port in `.env` or `vite.config.ts`.
- Make sure your backend API is running and accessible for frontend to connect.
- For more details, check the project README or ask your team.

---