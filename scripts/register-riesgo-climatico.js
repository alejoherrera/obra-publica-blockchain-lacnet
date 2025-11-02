const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');

// Configuración
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

async function main() {
    console.log('🚀 Registrando obra con análisis de riesgo climático...\n');

    // Conectar a blockchain
    const web3 = new Web3(RPC_URL);
    console.log('✓ Conectado a blockchain:', RPC_URL);

    // Usar clave privada del nodo local LACNET
    const privateKey = process.env.PRIVATE_KEY || '0xa65d61deb3d18b44dd4b3499c3741ca3a94a08487a987bd6f9759ad1393959ee';
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    const registrador = account.address;
    console.log('✓ Cuenta registradora:', registrador);

    // Leer deployment info
    const deploymentPath = path.join(__dirname, 'deployment.json');
    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    const contractAddress = deployment.contractAddress;
    const abi = deployment.abi;

    console.log('✓ Dirección del contrato:', contractAddress);

    // Crear instancia del contrato
    const contract = new web3.eth.Contract(abi, contractAddress);

    // Leer datos de riesgo climático
    const riesgoPath = path.join(__dirname, '../../riesgo_climatico.json');
    const riesgoData = JSON.parse(fs.readFileSync(riesgoPath, 'utf8'));

    // Agregar enlace de YouTube y metadata adicional
    const obraCompleta = {
        ...riesgoData,
        multimedia: {
            videoYoutube: "https://www.youtube.com/watch?v=zZ6gC6C7W1A",
            descripcionVideo: "Crecida repentina del río durante construcción - Evidencia de riesgo hidrológico crítico"
        },
        metadatos: {
            registradoPor: registrador,
            fechaRegistroBlockchain: new Date().toISOString(),
            version: "1.0",
            fuenteDatos: "Análisis de riesgo climático in-situ"
        }
    };

    // Preparar datos para el contrato
    const datosJSON = JSON.stringify(obraCompleta);
    const ubicacion = `${riesgoData.informacionGeneral.coordenadas.latitud}, ${riesgoData.informacionGeneral.coordenadas.longitud} - ${riesgoData.informacionGeneral.coordenadas.pais}`;
    const tipoObra = riesgoData.informacionGeneral.tipoObra;

    console.log('\n📋 Datos a registrar:');
    console.log('  Tipo:', tipoObra);
    console.log('  Ubicación:', ubicacion);
    console.log('  Coordenadas:', riesgoData.informacionGeneral.coordenadas);
    console.log('  Video:', obraCompleta.multimedia.videoYoutube);
    console.log('  Riesgos identificados:', riesgoData.evaluacionRiesgos.length);
    console.log('  Tamaño de datos:', datosJSON.length, 'bytes');

    // Registrar en blockchain
    console.log('\n🚀 Registrando en blockchain...');
    const receipt = await contract.methods.registrarObra(
        datosJSON,
        ubicacion,
        tipoObra
    ).send({
        from: registrador,
        gas: 30000000,
        gasPrice: '0'
    });

    console.log('\n✅ Obra registrada exitosamente!');
    console.log('📍 Transaction hash:', receipt.transactionHash);
    console.log('⛽ Gas usado:', receipt.gasUsed);

    // Obtener el ID de la obra del evento
    const event = receipt.events.ObraRegistrada;
    if (event) {
        const obraId = event.returnValues.id;
        console.log('🆔 ID de la obra:', obraId);

        // Verificar obra registrada
        console.log('\n🔍 Verificando obra registrada...');
        const obra = await contract.methods.obtenerObra(obraId).call();
        console.log('✓ Obra verificada en blockchain');
        console.log('  ID:', obra.id);
        console.log('  Ubicación:', obra.ubicacion);
        console.log('  Tipo:', obra.tipoObra);
        console.log('  Activa:', obra.activo);
        console.log('  Timestamp:', new Date(Number(obra.timestamp) * 1000).toISOString());
    }

    console.log('\n📋 Próximos pasos:');
    console.log('1. Ver la obra en el frontend: http://localhost:8080');
    console.log('2. Consultar vía API: http://localhost:3000/api/obras');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
