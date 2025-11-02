const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function main() {
    console.log('🔍 Consultando obras públicas en blockchain...\n');

    // Cargar información del contrato
    const deploymentPath = path.join(__dirname, 'deployment.json');
    if (!fs.existsSync(deploymentPath)) {
        throw new Error('No se encontró deployment.json. Ejecuta primero: npm run deploy');
    }

    const deployment = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    const contractAddress = deployment.contractAddress;
    const abi = deployment.abi;

    // Conectar a blockchain
    const web3 = new Web3(process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:4545');

    console.log('✓ Conectado a blockchain');
    console.log('✓ Contrato:', contractAddress);

    // Crear instancia del contrato
    const contract = new web3.eth.Contract(abi, contractAddress);

    // Obtener totales
    const totalObras = await contract.methods.totalObras().call();
    const obrasActivas = await contract.methods.obtenerObrasActivas().call();

    console.log('\n📊 Estadísticas:');
    console.log('- Total de obras:', totalObras.toString());
    console.log('- Obras activas:', obrasActivas.toString());
    console.log('- Obras inactivas:', (BigInt(totalObras) - BigInt(obrasActivas)).toString());

    if (totalObras > 0) {
        console.log('\n📋 Lista de obras:\n');

        for (let i = 1; i <= totalObras; i++) {
            try {
                const obra = await contract.methods.obtenerObra(i).call();
                const datos = JSON.parse(obra.datosJSON);

                console.log(`┌─ Obra #${i} ${obra.activo ? '✓' : '✗'}`);
                console.log(`│ Ubicación: ${obra.ubicacion}`);
                console.log(`│ Tipo: ${obra.tipoObra}`);
                console.log(`│ Fecha: ${new Date(Number(obra.timestamp) * 1000).toLocaleString()}`);
                console.log(`│ Reportado por: ${obra.reportadoPor}`);

                if (datos.evaluacionRiesgos && datos.evaluacionRiesgos.length > 0) {
                    console.log(`│ Riesgos identificados: ${datos.evaluacionRiesgos.length}`);
                    datos.evaluacionRiesgos.forEach((riesgo, idx) => {
                        console.log(`│  ${idx + 1}. [${riesgo.severidad}] ${riesgo.categoria}`);
                    });
                }

                console.log('└─────────────────────────────\n');
            } catch (error) {
                console.error(`Error al obtener obra #${i}:`, error.message);
            }
        }
    } else {
        console.log('\n ℹ️  No hay obras registradas aún.');
        console.log('   Ejecuta: npm run register');
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
