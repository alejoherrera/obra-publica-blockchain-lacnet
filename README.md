# Public Works Blockchain Registry

> A complete blockchain-based system for registering, tracking, and visualizing public infrastructure projects with climate risk assessments.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-363636?logo=solidity)
![Node](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![Web3](https://img.shields.io/badge/Web3.js-4.x-F16822?logo=web3.js)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Smart Contract](#smart-contract)
- [Contributing](#contributing)
- [License](#license)

## Overview

This system provides a transparent and immutable registry for public infrastructure projects, including detailed climate risk assessments. Built on the LACNET blockchain (Hyperledger Besu), it ensures data integrity and traceability for construction projects vulnerable to climate events.

### Key Use Cases

- **Government Agencies**: Track public infrastructure investments
- **Climate Risk Analysts**: Document and monitor climate-vulnerable projects
- **Citizens**: Access transparent information about public works
- **Engineers**: Reference historical climate impact data

## Features

- **Blockchain Registry**: Immutable storage of public works data on LACNET
- **Climate Risk Assessment**: Comprehensive evaluation of hydrological, geotechnical, and operational risks
- **Interactive Map**: Real-time visualization of projects with GPS coordinates
- **Rich Media**: YouTube video integration for visual evidence
- **RESTful API**: Easy integration with external systems
- **Real-time Updates**: Live dashboard with blockchain statistics
- **Detailed Analytics**: Dimensional analysis and expert consultation points

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER (Web Browser)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          FRONTEND (HTML/JS + Leaflet.js)                    │
│                    http://localhost:8080                    │
│  • Interactive map with markers                             │
│  • Real-time statistics dashboard                           │
│  • Detailed project information panels                      │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               REST API (Node.js + Express)                  │
│                    http://localhost:3000                    │
│  • GET /api/obras - List all projects                       │
│  • GET /api/obras/:id - Get specific project                │
│  • POST /api/obras - Register new project                   │
│  • GET /api/stats - Blockchain statistics                   │
└────────────────────────┬────────────────────────────────────┘
                         │ Web3.js (JSON-RPC)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         SMART CONTRACT (Solidity ^0.8.0)                    │
│              ObraPublicaRegistry.sol                        │
│  • Struct Obra {id, datosJSON, ubicacion, ...}              │
│  • registrarObra() - Create new record                      │
│  • obtenerObra(id) - Retrieve record                        │
│  • Events: ObraRegistrada, ObraActualizada                  │
└────────────────────────┬────────────────────────────────────┘
                         │ Deployed on
                         ▼
┌─────────────────────────────────────────────────────────────┐
│      LACNET BLOCKCHAIN (Hyperledger Besu)                   │
│                    http://localhost:4545                    │
│  • Writer node (development mode)                           │
│  • Ethereum-compatible (JSON-RPC)                           │
│  • Unlimited gas (local development)                        │
│  • Persistent data in Docker volumes                        │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Blockchain
- **LACNET**: Permissioned blockchain network for Latin America
- **Hyperledger Besu**: Enterprise-grade Ethereum client
- **Solidity**: Smart contract programming language

### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **Web3.js**: Ethereum JavaScript API

### Frontend
- **HTML5/CSS3**: Modern web standards
- **JavaScript (Vanilla)**: No framework dependencies
- **Leaflet.js**: Interactive maps
- **OpenStreetMap**: Map tiles

### DevOps
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **WSL2**: Windows Subsystem for Linux (development on Windows)

## Prerequisites

- **Operating System**: Windows 10/11 with WSL2, macOS, or Linux
- **Node.js**: v18.0.0 or higher
- **Docker**: Latest version
- **Docker Compose**: v2.0.0 or higher
- **Git**: Latest version

### For Windows Users

1. Install WSL2:
```powershell
# Run as Administrator
wsl --install
```

2. Install Docker Desktop with WSL2 backend

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/alejoherrera/obra-publica-blockchain-lacnet.git
cd obra-publica-blockchain-lacnet
```

### 2. Start LACNET Local Node

```bash
# Navigate to home directory (Linux/WSL)
cd ~

# Clone LACNET Besu networks
git clone https://github.com/LACNet-Networks/besu-networks

# Navigate to writer node configuration
cd besu-networks/docker/compose/local/writer1
sudo chmod -R 777 data

# Start the blockchain node
cd ..
docker-compose up -d

# Verify the node is running
docker-compose logs -f besu
```

Wait until you see blocks being generated, then press `Ctrl+C`.

### 3. Deploy Smart Contract

```bash
cd obra-publica-blockchain-lacnet/scripts
npm install
node deploy-contract.js
```

Expected output:
```
✅ Contrato desplegado exitosamente!
📍 Dirección del contrato: 0x7cb6F55F24d80849931F676400437d9df07a87e9
```

### 4. Start the API Server

```bash
cd ../api
npm install
npm start
```

Expected output:
```
✅ API corriendo en http://localhost:3000
```

### 5. Start the Frontend

```bash
cd ../frontend
npm install
npm run dev
```

Open your browser at: **http://localhost:8080**

## Usage

### Register a New Project

1. Prepare your project data in JSON format (see `data/example-project.json`)

2. Run the registration script:
```bash
cd scripts
node register-riesgo-climatico.js
```

3. Verify the registration:
```bash
node query-obras.js
```

### Access the Web Interface

Navigate to http://localhost:8080 to:
- View all projects on an interactive map
- Click markers to see project summaries
- Click "Ver Detalles Completos" for full project information including:
  - Climate risk assessments
  - YouTube video evidence
  - GPS coordinates with Google Maps integration
  - Expert consultation points
  - Prioritized action plans

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API information |
| GET | `/health` | Health check |
| GET | `/api/stats` | Blockchain statistics |
| GET | `/api/obras` | List all projects |
| GET | `/api/obras/:id` | Get project by ID |
| POST | `/api/obras` | Register new project |

### Example API Request

```bash
# Get all projects
curl http://localhost:3000/api/obras

# Get specific project
curl http://localhost:3000/api/obras/1

# Get blockchain statistics
curl http://localhost:3000/api/stats
```

## Project Structure

```
obra-publica-blockchain/
├── api/                          # REST API server
│   ├── server.js                # Express application
│   ├── package.json             # Dependencies
│   └── .env.example             # Environment variables template
│
├── contracts/                    # Smart contracts
│   └── ObraPublica.sol          # Main contract
│
├── frontend/                     # Web interface
│   ├── index.html               # Main HTML file
│   └── package.json             # Frontend dependencies
│
├── scripts/                      # Blockchain interaction scripts
│   ├── deploy-contract.js       # Contract deployment
│   ├── register-riesgo-climatico.js  # Register project
│   ├── query-obras.js           # Query projects
│   └── deployment.json          # Deployment info (generated)
│
├── data/                         # Sample data
│   └── example-project.json     # Project template
│
├── docs/                         # Documentation
│   ├── ARCHITECTURE.md          # System architecture
│   └── API.md                   # API documentation
│
├── .gitignore                    # Git ignore rules
├── LICENSE                       # MIT License
├── README.md                     # This file
└── CONTRIBUTING.md              # Contribution guidelines
```

## Smart Contract

### Data Structure

```solidity
struct Obra {
    uint256 id;              // Unique auto-incremental ID
    string datosJSON;        // Complete project data in JSON
    string ubicacion;        // Location (coordinates, city, country)
    string tipoObra;         // Type of construction
    uint256 timestamp;       // Unix timestamp
    address reportadoPor;    // Reporter's Ethereum address
    bool activo;            // Active status
}
```

### Key Functions

- `registrarObra(datosJSON, ubicacion, tipoObra)`: Register new project
- `actualizarObra(id, datosJSON)`: Update existing project
- `desactivarObra(id)`: Deactivate project
- `obtenerObra(id)`: Retrieve project data
- `getTotalObras()`: Get total project count

### Events

```solidity
event ObraRegistrada(uint256 indexed id, string ubicacion, string tipoObra, uint256 timestamp, address indexed reportadoPor);
event ObraActualizada(uint256 indexed id, string datosJSON, uint256 timestamp);
event ObraDesactivada(uint256 indexed id, uint256 timestamp);
```

## API Documentation

### Get All Projects

```http
GET /api/obras
```

Response:
```json
{
  "success": true,
  "total": 1,
  "obras": [
    {
      "id": "1",
      "ubicacion": "9.916088, -84.067517 - Costa Rica",
      "tipoObra": "Canalización/Modificación de cauce",
      "timestamp": 1762100010,
      "fecha": "2025-11-02T16:13:30.000Z",
      "reportadoPor": "0x211152cA21d5dAeDBCfbF61173886bBB1A217242",
      "activo": true,
      "datos": {
        "informacionGeneral": { ... },
        "evaluacionRiesgos": [ ... ],
        "multimedia": {
          "videoYoutube": "https://www.youtube.com/watch?v=..."
        }
      }
    }
  ]
}
```

### Get Blockchain Statistics

```http
GET /api/stats
```

Response:
```json
{
  "totalObras": 1,
  "obrasActivas": 1,
  "blockNumber": 1423,
  "contractAddress": "0x7cb6F55F24d80849931F676400437d9df07a87e9"
}
```

### Register New Project

```http
POST /api/obras
Content-Type: application/json

{
  "datosJSON": "{...}",
  "ubicacion": "Lat, Lng - Country",
  "tipoObra": "Construction type"
}
```

## Development

### Verify Blockchain Connection

```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  http://localhost:4545
```

### View Node Logs

```bash
cd ~/besu-networks/docker/compose/local
docker-compose logs -f besu
```

### Restart Blockchain Node

```bash
cd ~/besu-networks/docker/compose/local
docker-compose restart
```

### Clean Restart

```bash
# Stop services
docker-compose down

# Clean data
cd writer1
sudo rm -rf data/*

# Restart
cd ..
docker-compose up -d

# Redeploy contract
cd ~/obra-publica-blockchain/scripts
node deploy-contract.js
node register-riesgo-climatico.js
```

## Deployment

### Local Development
The current setup is configured for local development with unlimited gas and no permissions required.

### Testnet Deployment (LACNET open-protest-net)
1. Request permissions from LACNET
2. Deploy node on cloud server
3. Update RPC endpoint in environment variables
4. Redeploy smart contract
5. Implement authentication/authorization

### Production Deployment
1. Conduct smart contract security audit
2. Implement IPFS for large data storage
3. Add role-based access control (OpenZeppelin)
4. Set up scalable backend (PostgreSQL + Redis)
5. Deploy frontend to CDN
6. Implement monitoring and logging

## Troubleshooting

### Cannot connect to blockchain

**Error**: `ECONNREFUSED localhost:4545`

**Solution**:
- Verify Docker is running: `docker ps`
- Check node status: `docker-compose logs besu`
- Restart node: `docker-compose restart`

### Permission denied (chmod)

**Error**: Permission errors on `chmod`

**Solution**:
- Ensure you're in WSL filesystem (`cd ~`), not Windows (`/mnt/c/`)
- Use `sudo` for permission commands

### API not responding

**Error**: `ECONNREFUSED localhost:3000`

**Solution**:
- Verify API is running: Check terminal where you ran `npm start`
- Check port availability: `netstat -ano | findstr :3000`

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Roadmap

- [ ] Add IPFS integration for large file storage
- [ ] Implement MetaMask authentication
- [ ] Create admin dashboard
- [ ] Add export to PDF functionality
- [ ] Implement WebSocket for real-time notifications
- [ ] Integrate external APIs (weather, mapping services)
- [ ] Multi-language support (i18n)
- [ ] Mobile responsive design improvements

## Security

- Smart contracts use Solidity best practices with `require()` validations
- API implements input validation and error handling
- CORS properly configured for security
- For production: Implement authentication, rate limiting, and access control

**Note**: This is a development setup. Do not use in production without proper security hardening.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **LACNET**: For providing the blockchain infrastructure
- **LACChain Alliance**: For documentation and support
- **Hyperledger Besu**: For the Ethereum client
- **Leaflet.js**: For mapping capabilities
- **OpenStreetMap**: For map tiles

## Contact & Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `/docs`
- Review LACNET official documentation: https://docs.lacnet.com

## Citation

If you use this project in your research or work, please cite:

```bibtex
@software{obra_publica_blockchain,
  title = {Public Works Blockchain Registry},
  author = {Juan Alejandro Herrera López},
  year = {2025},
  url = {https://github.com/alejoherrera/obra-publica-blockchain-lacnet}
}
```

---

**Built with ❤️ for transparent and climate-resilient infrastructure**
