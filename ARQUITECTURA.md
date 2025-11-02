# Arquitectura del Sistema

## Vista General

```
┌─────────────────────────────────────────────────────────────┐
│                    USUARIO (Navegador)                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (HTML/JS + Leaflet.js)                │
│                    http://localhost:8080                    │
│  • Mapa interactivo con Leaflet                            │
│  • Visualización de obras públicas                         │
│  • Dashboard con estadísticas en tiempo real               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               API REST (Node.js + Express)                  │
│                    http://localhost:3000                    │
│  • GET /api/obras - Lista todas las obras                  │
│  • GET /api/obras/:id - Obtiene obra específica            │
│  • POST /api/obras - Registra nueva obra                   │
│  • GET /api/stats - Estadísticas de blockchain             │
└────────────────────────┬────────────────────────────────────┘
                         │ Web3.js (JSON-RPC)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           SMART CONTRACT (Solidity)                         │
│              ObraPublicaRegistry.sol                        │
│  • Struct Obra {id, datosJSON, ubicacion, ...}             │
│  • registrarObra(datosJSON, ubicacion, tipoObra)           │
│  • obtenerObra(id)                                         │
│  • Events: ObraRegistrada, ObraActualizada                 │
└────────────────────────┬────────────────────────────────────┘
                         │ Desplegado en
                         ▼
┌─────────────────────────────────────────────────────────────┐
│        BLOCKCHAIN LACNET LOCAL (Hyperledger Besu)           │
│                    http://localhost:4545                    │
│  • Nodo writer1 (modo desarrollo)                          │
│  • Compatible con Ethereum (JSON-RPC)                       │
│  • Gas ilimitado (local)                                    │
│  • Datos persistentes en volumen Docker                    │
└─────────────────────────────────────────────────────────────┘
```

## Componentes Detallados

### 1. Frontend (`/frontend`)

**Tecnologías:**
- HTML5 + CSS3
- JavaScript vanilla (sin frameworks)
- Leaflet.js para mapas interactivos
- Fetch API para llamadas HTTP

**Responsabilidades:**
- Mostrar obras en mapa interactivo
- Listar obras con filtros
- Visualizar detalles y riesgos
- Actualizar estadísticas en tiempo real

**Archivos:**
- `index.html` - Interfaz completa de usuario
- `package.json` - Configuración para servidor HTTP local

### 2. API REST (`/api`)

**Tecnologías:**
- Node.js v18+
- Express.js 4.x
- Web3.js 4.x
- CORS habilitado

**Responsabilidades:**
- Intermediario entre frontend y blockchain
- Parsear JSON de transacciones
- Formatear datos para consumo del frontend
- Manejo de errores y validaciones

**Endpoints:**
```
GET  /                     → Info de la API
GET  /health               → Health check
GET  /api/stats            → Estadísticas generales
GET  /api/obras            → Lista todas las obras
GET  /api/obras/:id        → Obtiene obra por ID
GET  /api/obras/ubicacion/:ciudad → Filtra por ciudad
POST /api/obras            → Registra nueva obra
```

**Archivos:**
- `server.js` - Servidor Express principal
- `package.json` - Dependencias
- `.env` - Configuración (generado automáticamente)

### 3. Smart Contract (`/contracts`)

**Tecnología:**
- Solidity ^0.8.0
- Compatible con EVM (Ethereum Virtual Machine)

**Estructuras de Datos:**
```solidity
struct Obra {
    uint256 id;              // ID único autoincremental
    string datosJSON;        // JSON completo de la obra
    string ubicacion;        // Ciudad, país
    string tipoObra;         // Tipo de construcción
    uint256 timestamp;       // Unix timestamp
    address reportadoPor;    // Dirección Ethereum
    bool activo;            // Estado
}

mapping(uint256 => Obra) public obras;
```

**Funciones Principales:**
- `registrarObra()` - Crea nueva obra
- `actualizarObra()` - Modifica datos existentes
- `desactivarObra()` - Marca como inactiva
- `obtenerObra()` - Lee datos de obra
- `obtenerObrasActivas()` - Cuenta obras activas

**Eventos:**
```solidity
event ObraRegistrada(uint256 indexed id, string ubicacion, ...);
event ObraActualizada(uint256 indexed id, ...);
event ObraDesactivada(uint256 indexed id, ...);
```

### 4. Scripts de Blockchain (`/scripts`)

**Tecnologías:**
- Node.js
- Web3.js para interacción con blockchain
- solc (compilador de Solidity)

**Scripts:**

**`deploy-contract.js`**
1. Compila `ObraPublica.sol`
2. Despliega a blockchain local
3. Guarda dirección del contrato
4. Genera archivo `.env`

**`register-obra.js`**
1. Lee `riesgo_climatico.json`
2. Envía transacción `registrarObra()`
3. Confirma registro
4. Muestra ID de la obra

**`query-obras.js`**
1. Consulta total de obras
2. Lista cada obra con detalles
3. Muestra estadísticas

### 5. Nodo LACNET Local

**Base:**
- Hyperledger Besu (fork de Ethereum)
- Configuración: writer1 (nodo escritor)
- Red: Aislada, sin conexión externa

**Características:**
- **RPC Endpoint**: `http://localhost:4545`
- **Gas**: Ilimitado (modo desarrollo)
- **Cuentas**: Precreadas automáticamente
- **Persistencia**: Volumen Docker en `data/`
- **Bloques**: Generación automática

**Métodos JSON-RPC usados:**
```javascript
eth_accounts          // Obtener cuentas
eth_getBlockNumber    // Número de bloque actual
eth_sendTransaction   // Enviar transacción
eth_call              // Llamar función (read-only)
eth_getTransactionReceipt // Obtener recibo
```

## Flujo de Datos: Registro de Obra

```
1. Usuario ejecuta: npm run register

2. Script register-obra.js:
   ├─ Lee riesgo_climatico.json
   ├─ Conecta a blockchain (Web3)
   ├─ Crea transacción registrarObra()
   └─ Envía a http://localhost:4545

3. Nodo LACNET:
   ├─ Valida transacción
   ├─ Ejecuta smart contract
   ├─ Emite evento ObraRegistrada
   ├─ Persiste en bloque
   └─ Retorna hash de transacción

4. Script verifica:
   ├─ Obtiene ID de la obra
   ├─ Llama obtenerObra(id)
   └─ Confirma datos guardados

5. Usuario puede consultar:
   └─ npm run query
```

## Flujo de Datos: Visualización

```
1. Usuario abre http://localhost:8080

2. Frontend (JavaScript):
   ├─ fetch('http://localhost:3000/api/stats')
   └─ fetch('http://localhost:3000/api/obras')

3. API (Node.js):
   ├─ Conecta via Web3 a blockchain
   ├─ Llama contract.methods.totalObras().call()
   ├─ Para cada obra:
   │  ├─ Llama obtenerObra(i)
   │  └─ Parsea datosJSON
   └─ Retorna array JSON

4. Frontend:
   ├─ Renderiza lista de obras
   ├─ Crea marcadores en mapa (Leaflet)
   └─ Actualiza estadísticas

5. Auto-refresh cada 10 segundos:
   └─ Vuelve al paso 2
```

## Almacenamiento de Datos

### En Blockchain (Inmutable):
```
Bloque N
├─ Transaction Hash: 0xabc123...
├─ From: 0x1234...
├─ To: 0x5678... (contract address)
├─ Data:
│  ├─ Function: registrarObra()
│  ├─ Args:
│  │  ├─ datosJSON: "{\"informacionGeneral\":{...}}"
│  │  ├─ ubicacion: "San Jose, Costa Rica"
│  │  └─ tipoObra: "Canalización"
│  └─ Gas: 500000
└─ Events:
   └─ ObraRegistrada(id=1, ubicacion=..., ...)
```

### En Memoria (API):
- Cache de deployment.json
- Instancia de Web3
- Instancia de Contract

### En Disco:
```
/scripts/deployment.json  → Info del contrato desplegado
/scripts/.env             → Variables de entorno
/data/riesgo_climatico.json → Datos de ejemplo
```

## Seguridad

### Smart Contract:
- ✓ Validación de parámetros con `require()`
- ✓ Control de estado (activo/inactivo)
- ✓ Eventos para auditoría
- ⚠️ No hay control de acceso (modo desarrollo)

### API:
- ✓ CORS configurado
- ✓ Validación de inputs
- ✓ Manejo de errores
- ⚠️ Sin autenticación (modo desarrollo local)

### Blockchain:
- ✓ Nodo aislado (sin exposición externa)
- ✓ Sin permisos necesarios (desarrollo)
- ⚠️ Gas ilimitado (no para producción)

## Escalabilidad y Limitaciones

### Limitaciones Actuales:
1. **Storage en blockchain**: JSON completo en string
   - Alternativa: Solo hash + almacenamiento en IPFS
   - Costo alto en gas para JSON grandes

2. **Consultas**: Loop para listar todas las obras
   - Alternativa: Indexar eventos con The Graph
   - O mantener índice en base de datos externa

3. **Coordenadas**: Hardcodeadas en frontend
   - Agregar campos lat/lng al struct Obra
   - O extraer de datosJSON

4. **Sin autenticación**: Cualquiera puede escribir
   - Agregar roles (OpenZeppelin AccessControl)
   - Whitelist de direcciones autorizadas

### Migración a Producción:

**Para Testnet (open-protest-net):**
1. Solicitar permisos a LACNET
2. Desplegar nodo en servidor cloud
3. Re-desplegar contrato en testnet
4. Actualizar API con nueva dirección
5. Implementar autenticación

**Para Mainnet:**
1. Auditoría de smart contract
2. Optimizar almacenamiento (IPFS)
3. Implementar sistema de roles
4. Backend escalable (PostgreSQL + Redis)
5. Frontend en CDN

## Monitoreo y Debugging

### Logs del Nodo:
```bash
docker-compose logs -f besu
```

### Verificar Conectividad:
```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:4545
```

### Verificar Contrato:
```bash
cd scripts
node -e "
const {Web3} = require('web3');
const web3 = new Web3('http://localhost:4545');
const deployment = require('./deployment.json');
const contract = new web3.eth.Contract(deployment.abi, deployment.contractAddress);
contract.methods.totalObras().call().then(console.log);
"
```

### Reiniciar Todo:
```bash
# 1. Detener servicios
docker-compose down
# 2. Limpiar datos
rm -rf data/*
# 3. Reiniciar
docker-compose up -d
# 4. Re-desplegar
cd scripts && npm run deploy && npm run register
```

## Próximos Pasos

1. **Agregar coordenadas reales** al struct Obra
2. **Implementar IPFS** para almacenamiento de JSON
3. **Crear indexador** de eventos (The Graph o custom)
4. **Sistema de autenticación** (MetaMask)
5. **Dashboard de administración**
6. **Exportar reportes** en PDF
7. **Notificaciones** en tiempo real (WebSockets)
8. **Integración con APIs externas** (clima, mapas)
