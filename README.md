# ProjexFi Frontend

This repository contains the client-side web application for **ProjexFi**, allowing users to interact with smart contracts, fund projects, and view their transaction history.

> **⚠️ IMPORTANT: Deployment & Setup**
> This repository is a microservice part of the larger ProjexFi ecosystem. 
> To run this project, boot the local blockchain, and deploy the containers, please refer to the master initialization guide in the **[ProjexFi Root Repository](https://github.com/anupasiriwardana/ProjexFi)**.

## 🛠 Tech Stack
* **React 18:** UI Library.
* **Vite:** Next-generation frontend tooling and bundler.
* **TypeScript:** Static typing for safer code.
* **Ethers.js (v6):** Connecting the UI to MetaMask and the blockchain.

## 💻 Local Development
If you are modifying the UI locally without Docker, ensure your local Hardhat node is running first.

```bash
# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

*(Note: Ensure your MetaMask wallet is connected to `http://127.0.0.1:8545` and you have imported a test account to execute transactions locally).*

## Expanding the ESLint configuration (Additional)

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
