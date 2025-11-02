const express = require('express');
const cors = require('cors');
const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());

// Configuración de blockchain
let web3;
let contract;
let contractABI;
let contractAddress;

// Inicializar conexión a blockchain
async function initBlockchain() {
    try {
        // Cargar deployment info
        const deploymentPath = path.join(__dirname, '../scripts/deployment.json');

        if (!fs.existsSync(deploymentPath)) {
            console.warn('⚠️  deployment.json no encontrado. La API funcionará con funcionalidad limitada.');
            console.warn('   Ejecuta primero: cd scripts && npm run deploy');
            return false;
        }

        const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
        contractAddress = deployment.contractAddress;
        contractABI = deployment.abi;

        // Conectar a blockchain
        const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:4545';
        web3 = new Web3(rpcUrl);

        // Verificar conexión
        const blockNumber = await web3.eth.getBlockNumber();
        console.log('✓ Conectado a blockchain en bloque:', blockNumber.toString());

        // Crear instancia del contrato
        contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log('✓ Contrato cargado:', contractAddress);

        return true;
    } catch (error) {
        console.error('❌ Error al conectar con blockchain:', error.message);
        return false;
    }
}

// Rutas

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        blockchain: contract ? 'connected' : 'disconnected',
        timestamp: new Date().toISOString()
    });
});

// Obtener estadísticas generales
app.get('/api/stats', async (req, res) => {
    try {
        if (!contract) {
            return res.status(503).json({
                error: 'Blockchain no conectada',
                message: 'El contrato no está desplegado aún'
            });
        }

        const totalObras = await contract.methods.totalObras().call();
        const blockNumber = await web3.eth.getBlockNumber();

        // Contar obras activas manualmente
        let obrasActivas = 0;
        for (let i = 1; i <= totalObras; i++) {
            try {
                const obra = await contract.methods.obras(i).call();
                if (obra.activo) {
                    obrasActivas++;
                }
            } catch (e) {
                // Obra no existe, continuar
            }
        }

        res.json({
            totalObras: totalObras.toString(),
            obrasActivas: obrasActivas.toString(),
            obrasInactivas: (BigInt(totalObras) - BigInt(obrasActivas)).toString(),
            blockNumber: blockNumber.toString(),
            contractAddress: contractAddress
        });
    } catch (error) {
        console.error('Error en /api/stats:', error);
        res.status(500).json({
            error: 'Error al obtener estadísticas',
            message: error.message
        });
    }
});

// Obtener todas las obras
app.get('/api/obras', async (req, res) => {
    try {
        if (!contract) {
            return res.status(503).json({
                error: 'Blockchain no conectada',
                message: 'El contrato no está desplegado aún'
            });
        }

        const totalObras = await contract.methods.totalObras().call();
        const obras = [];

        for (let i = 1; i <= totalObras; i++) {
            try {
                const obra = await contract.methods.obtenerObra(i).call();
                const datosJSON = JSON.parse(obra.datosJSON);

                obras.push({
                    id: obra.id.toString(),
                    ubicacion: obra.ubicacion,
                    tipoObra: obra.tipoObra,
                    timestamp: Number(obra.timestamp),
                    fecha: new Date(Number(obra.timestamp) * 1000).toISOString(),
                    reportadoPor: obra.reportadoPor,
                    activo: obra.activo,
                    datos: datosJSON
                });
            } catch (error) {
                console.error(`Error al procesar obra #${i}:`, error.message);
            }
        }

        // Filtrar solo activas si se solicita
        const soloActivas = req.query.activas === 'true';
        const resultado = soloActivas ? obras.filter(o => o.activo) : obras;

        res.json({
            total: resultado.length,
            obras: resultado
        });
    } catch (error) {
        console.error('Error en /api/obras:', error);
        res.status(500).json({
            error: 'Error al obtener obras',
            message: error.message
        });
    }
});

// Obtener una obra específica
app.get('/api/obras/:id', async (req, res) => {
    try {
        if (!contract) {
            return res.status(503).json({
                error: 'Blockchain no conectada'
            });
        }

        const id = parseInt(req.params.id);
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                error: 'ID inválido'
            });
        }

        const obra = await contract.methods.obtenerObra(id).call();
        const datosJSON = JSON.parse(obra.datosJSON);

        res.json({
            id: obra.id.toString(),
            ubicacion: obra.ubicacion,
            tipoObra: obra.tipoObra,
            timestamp: Number(obra.timestamp),
            fecha: new Date(Number(obra.timestamp) * 1000).toISOString(),
            reportadoPor: obra.reportadoPor,
            activo: obra.activo,
            datos: datosJSON
        });
    } catch (error) {
        if (error.message.includes('Obra no existe')) {
            return res.status(404).json({
                error: 'Obra no encontrada',
                message: `No existe una obra con ID ${req.params.id}`
            });
        }

        console.error('Error en /api/obras/:id:', error);
        res.status(500).json({
            error: 'Error al obtener obra',
            message: error.message
        });
    }
});

// Obtener obras por ubicación
app.get('/api/obras/ubicacion/:ciudad', async (req, res) => {
    try {
        if (!contract) {
            return res.status(503).json({
                error: 'Blockchain no conectada'
            });
        }

        const ciudad = req.params.ciudad.toLowerCase();
        const totalObras = await contract.methods.totalObras().call();
        const obras = [];

        for (let i = 1; i <= totalObras; i++) {
            try {
                const obra = await contract.methods.obtenerObra(i).call();

                if (obra.ubicacion.toLowerCase().includes(ciudad)) {
                    const datosJSON = JSON.parse(obra.datosJSON);

                    obras.push({
                        id: obra.id.toString(),
                        ubicacion: obra.ubicacion,
                        tipoObra: obra.tipoObra,
                        timestamp: Number(obra.timestamp),
                        fecha: new Date(Number(obra.timestamp) * 1000).toISOString(),
                        reportadoPor: obra.reportadoPor,
                        activo: obra.activo,
                        datos: datosJSON
                    });
                }
            } catch (error) {
                console.error(`Error al procesar obra #${i}:`, error.message);
            }
        }

        res.json({
            ciudad: req.params.ciudad,
            total: obras.length,
            obras: obras
        });
    } catch (error) {
        console.error('Error en /api/obras/ubicacion:', error);
        res.status(500).json({
            error: 'Error al buscar obras',
            message: error.message
        });
    }
});

// Registrar nueva obra (POST)
app.post('/api/obras', async (req, res) => {
    try {
        if (!contract) {
            return res.status(503).json({
                error: 'Blockchain no conectada'
            });
        }

        const { datosJSON, ubicacion, tipoObra } = req.body;

        if (!datosJSON || !ubicacion || !tipoObra) {
            return res.status(400).json({
                error: 'Faltan campos requeridos',
                required: ['datosJSON', 'ubicacion', 'tipoObra']
            });
        }

        // Obtener cuenta para enviar transacción
        const accounts = await web3.eth.getAccounts();
        if (accounts.length === 0) {
            return res.status(500).json({
                error: 'No hay cuentas disponibles para enviar transacciones'
            });
        }

        const account = accounts[0];

        // Enviar transacción
        const tx = await contract.methods.registrarObra(
            JSON.stringify(datosJSON),
            ubicacion,
            tipoObra
        ).send({
            from: account,
            gas: 5000000,
            gasPrice: '0'
        });

        const obraId = tx.events.ObraRegistrada.returnValues.id;

        res.status(201).json({
            success: true,
            obraId: obraId.toString(),
            transactionHash: tx.transactionHash,
            blockNumber: tx.blockNumber.toString()
        });
    } catch (error) {
        console.error('Error en POST /api/obras:', error);
        res.status(500).json({
            error: 'Error al registrar obra',
            message: error.message
        });
    }
});

// Información de la API
app.get('/', (req, res) => {
    res.json({
        name: 'Obra Pública Blockchain API',
        version: '1.0.0',
        endpoints: {
            health: 'GET /health',
            stats: 'GET /api/stats',
            obras: {
                all: 'GET /api/obras',
                byId: 'GET /api/obras/:id',
                byUbicacion: 'GET /api/obras/ubicacion/:ciudad',
                create: 'POST /api/obras'
            }
        },
        blockchain: {
            connected: !!contract,
            contractAddress: contractAddress || 'not deployed',
            rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:4545'
        }
    });
});

// Iniciar servidor
async function start() {
    console.log('🚀 Iniciando API de Obra Pública Blockchain...\n');

    await initBlockchain();

    app.listen(PORT, () => {
        console.log(`\n✅ API corriendo en http://localhost:${PORT}`);
        console.log(`\n📋 Endpoints disponibles:`);
        console.log(`   GET  http://localhost:${PORT}/`);
        console.log(`   GET  http://localhost:${PORT}/health`);
        console.log(`   GET  http://localhost:${PORT}/api/stats`);
        console.log(`   GET  http://localhost:${PORT}/api/obras`);
        console.log(`   GET  http://localhost:${PORT}/api/obras/:id`);
        console.log(`   POST http://localhost:${PORT}/api/obras`);
        console.log(`\n💡 Presiona Ctrl+C para detener el servidor\n`);
    });
}

start();
