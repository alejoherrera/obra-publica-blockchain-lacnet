const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
    console.log('📝 Registrando obra pública en blockchain...\n');

    // Cargar información del contrato desplegado
    const deploymentPath = path.join(__dirname, 'deployment.json');
    if (!fs.existsSync(deploymentPath)) {
        throw new Error('No se encontró deployment.json. Ejecuta primero: npm run deploy');
    }

    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    const contractAddress = deployment.contractAddress;
    const abi = deployment.abi;

    // Cargar datos de ejemplo
    const dataPath = path.join(__dirname, '../../riesgo_climatico.json');
    const obraData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    // Conectar a blockchain
    const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545');

    // Usar clave privada del nodo local LACNET
    const privateKey = process.env.PRIVATE_KEY || '0xa65d61deb3d18b44dd4b3499c3741ca3a94a08487a987bd6f9759ad1393959ee';
    const accountObj = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(accountObj);
    const account = accountObj.address;

    console.log('✓ Conectado a blockchain');
    console.log('✓ Cuenta:', account);
    console.log('✓ Contrato:', contractAddress);

    // Crear instancia del contrato
    const contract = new web3.eth.Contract(abi, contractAddress);

    // Preparar datos
    const datosJSON = JSON.stringify(obraData);
    const ubicacion = obraData.informacionGeneral?.ubicacionObservada || 'San Jose, Costa Rica';
    const tipoObra = obraData.informacionGeneral?.tipoObra || 'Canalización';

    console.log('\n📋 Datos a registrar:');
    console.log('- Ubicación:', ubicacion);
    console.log('- Tipo de obra:', tipoObra);
    console.log('- Tamaño del JSON:', datosJSON.length, 'bytes');

    // Registrar obra
    console.log('\n🚀 Enviando transacción...');
    const tx = await contract.methods.registrarObra(
        datosJSON,
        ubicacion,
        tipoObra
    ).send({
        from: account,
        gas: 5000000,
        gasPrice: '0'
    });

    console.log('\n✅ Obra registrada exitosamente!');
    console.log('📍 Hash de transacción:', tx.transactionHash);
    console.log('📦 Bloque:', tx.blockNumber);

    // Obtener ID de la obra del evento
    const event = tx.events.ObraRegistrada;
    if (event) {
        const obraId = event.returnValues.id;
        console.log('🆔 ID de la obra:', obraId);

        // Verificar que se guardó correctamente
        const obra = await contract.methods.obtenerObra(obraId).call();
        console.log('\n✓ Verificación:');
        console.log('  - ID:', obra.id);
        console.log('  - Ubicación:', obra.ubicacion);
        console.log('  - Tipo:', obra.tipoObra);
        console.log('  - Activa:', obra.activo);
        console.log('  - Timestamp:', new Date(Number(obra.timestamp) * 1000).toISOString());
    }

    // Obtener total de obras
    const total = await contract.methods.totalObras().call();
    console.log('\n📊 Total de obras en blockchain:', total.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
