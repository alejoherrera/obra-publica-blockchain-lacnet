# 🔐 Setup de GitHub - Repositorio Privado

## Blockchain de Transparencia en Obra Pública (LACNET)

Este repositorio contiene una implementación completa de blockchain para registrar obras públicas de forma inmutable, usando la red LACNET (Red privada de Hyperledger Besu).

---

## 📦 Contenido del Repositorio

### Estructura
```
obra-publica-blockchain/
├── contracts/          # Smart contract Solidity
├── scripts/            # Scripts de deploy y registro
├── api/                # Backend REST API (Node.js/Express)
├── frontend/           # Interfaz web (React/Vite)
└── docker/             # Configuración LACNET local
```

### Componentes
- **Smart Contract**: ObraPublicaRegistry.sol - Registro inmutable de proyectos
- **Backend API**: REST API con Web3.js para interacción blockchain
- **Frontend**: Dashboard interactivo con mapas y visualización de datos
- **LACNET**: Red blockchain privada (Hyperledger Besu)
- **Docker Compose**: Configuración completa de nodos LACNET

---

## 🚀 Crear Repositorio Privado en GitHub

### Paso 1: Crear el Repositorio

1. Ve a: https://github.com/new
2. Configura:
   - **Repository name**: `obra-publica-blockchain-lacnet`
   - **Description**: `Sistema de transparencia para obra pública usando blockchain LACNET (Hyperledger Besu)`
   - **Visibility**: ✅ **Private** (repositorio privado)
   - **NO** marcar "Initialize this repository with..."
3. Click en **"Create repository"**

### Paso 2: Inicializar Git Local

Abre Git Bash en el directorio del proyecto:

```bash
cd C:/Users/aleja/blockchain/obra-publica-blockchain

# Inicializar repositorio
git init

# Agregar todos los archivos
git add .

# Crear commit inicial
git commit -m "Initial commit: LACNET blockchain transparency platform

- Smart contract for public works registry
- REST API with Web3.js integration
- React frontend with interactive maps
- LACNET local network configuration
- Docker Compose setup for Besu nodes
- Complete documentation

Features:
- Immutable project registration
- Real-time blockchain data visualization
- Climate risk assessment integration
- GPS coordinates and mapping
- RESTful API for integrations

Stack: Solidity, Node.js, Express, React, Vite, Web3.js, LACNET (Hyperledger Besu)

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

### Paso 3: Conectar con GitHub

Copia el comando desde GitHub (aparece después de crear el repo) o ejecuta:

```bash
# Agregar remote (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/obra-publica-blockchain-lacnet.git

# Renombrar rama a main (si es necesario)
git branch -M main

# Push inicial
git push -u origin main
```

---

## ✅ Verificación de Seguridad

Antes de hacer push, verifica que estos archivos **NO** estén incluidos:

```bash
# Verificar archivos a subir
git status

# Verificar que estos archivos NO aparezcan:
# ❌ scripts/.env
# ❌ api/.env
# ❌ scripts/deployment.json
# ❌ node_modules/
# ❌ cualquier archivo .key o .keystore
```

Si aparecen, verifica tu `.gitignore`.

---

## 📋 Setup del Proyecto (Para colaboradores)

### Prerequisitos
- Docker Desktop
- Node.js 18+
- Git

### Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/TU_USUARIO/obra-publica-blockchain-lacnet.git
cd obra-publica-blockchain-lacnet
```

2. **Configurar red LACNET local**
```bash
cd docker/compose/local/writer1
sudo chmod -R 777 data
cd ..
docker-compose up -d
```

3. **Instalar dependencias**
```bash
# Scripts de deploy
cd scripts
npm install
cp .env.example .env

# API
cd ../api
npm install
cp .env.example .env

# Frontend
cd ../frontend
npm install
```

4. **Deploy del smart contract**
```bash
cd scripts
node deploy-contract.js
```

5. **Configurar API con dirección del contrato**
```bash
# Copiar CONTRACT_ADDRESS de scripts/deployment.json a api/.env
# Editar api/.env y agregar la dirección del contrato
```

6. **Iniciar servicios**
```bash
# Terminal 1: API
cd api
npm start

# Terminal 2: Frontend
cd frontend
npm run dev
```

7. **Acceder a la aplicación**
- Frontend: http://localhost:5173
- API: http://localhost:3000
- LACNET RPC: http://localhost:8545

---

## 🔑 Configuración de Variables de Entorno

### scripts/.env
```env
BLOCKCHAIN_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=<address-from-deployment>
```

### api/.env
```env
PORT=3000
BLOCKCHAIN_RPC_URL=http://localhost:8545
CONTRACT_ADDRESS=<address-from-deployment>
CORS_ORIGIN=*
```

---

## 📊 Información de la Red LACNET

- **Tipo**: Blockchain privada (Hyperledger Besu)
- **Consenso**: IBFT 2.0 (Istanbul Byzantine Fault Tolerance)
- **RPC Local**: http://localhost:8545
- **Chain ID**: 648629
- **Nodos**: 4 validadores + 1 writer
- **Gas**: Ilimitado (red privada)

---

## 📞 Soporte y Documentación

### Documentación LACNET
- Oficial: https://lacnet.lacchain.net/
- GitHub: https://github.com/lacnet-networks/

### Logs y Debug
```bash
# Ver logs de LACNET
docker logs -f writer1

# Ver logs de API
cd api && npm run dev

# Verificar estado de la blockchain
curl http://localhost:8545 -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
```

---

## 🔒 Nota de Seguridad

Este es un **repositorio privado**. No compartas:
- Claves privadas
- Archivos .env configurados
- Archivos deployment.json con datos sensibles
- Credenciales de acceso

Los archivos sensibles están protegidos por `.gitignore`.

---

## 📄 Licencia

Ver archivo [LICENSE](LICENSE) para detalles.

---

**¡Listo!** Tu repositorio privado está configurado y listo para colaboración segura 🎉
