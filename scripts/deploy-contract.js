const { Web3 } = require('web3');
const fs = require('fs');
const path = require('path');
const solc = require('solc');

// Configuración
const RPC_URL = process.env.BLOCKCHAIN_RPC_URL || 'http://localhost:8545';

async function main() {
    console.log('🚀 Iniciando despliegue del contrato ObraPublicaRegistry...\n');

    // Conectar a blockchain
    const web3 = new Web3(RPC_URL);
    console.log('✓ Conectado a blockchain:', RPC_URL);

    // Usar clave privada del nodo local LACNET
    const privateKey = process.env.PRIVATE_KEY || '0xa65d61deb3d18b44dd4b3499c3741ca3a94a08487a987bd6f9759ad1393959ee';
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    const deployer = account.address;
    console.log('✓ Cuenta de despliegue:', deployer);

    // Leer código del contrato
    const contractPath = path.join(__dirname, '../contracts/ObraPublica.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    // Configurar compilador con optimizador
    const input = {
        language: 'Solidity',
        sources: {
            'ObraPublica.sol': {
                content: source
            }
        },
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            },
            evmVersion: 'constantinople',  // Compatible con nodo LACNET local
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode']
                }
            }
        }
    };

    // Compilar
    console.log('\n📝 Compilando contrato...');
    const output = JSON.parse(solc.compile(JSON.stringify(input)));

    // Verificar errores
    if (output.errors) {
        const errors = output.errors.filter(e => e.severity === 'error');
        if (errors.length > 0) {
            console.error('❌ Errores de compilación:');
            errors.forEach(err => console.error(err.formattedMessage));
            process.exit(1);
        }
    }

    const contract = output.contracts['ObraPublica.sol']['ObraPublicaRegistry'];
    const abi = contract.abi;
    const bytecode = contract.evm.bytecode.object;

    console.log('✓ Contrato compilado exitosamente');
    console.log('✓ Tamaño del bytecode:', bytecode.length / 2, 'bytes');

    // Crear instancia del contrato
    const ObraPublicaRegistry = new web3.eth.Contract(abi);

    // Desplegar
    console.log('\n🚀 Desplegando contrato a la blockchain...');
    const deployTx = ObraPublicaRegistry.deploy({
        data: '0x' + bytecode,
        arguments: []
    });

    // Usar gas fijo para nodo LACNET local
    const gas = 30000000; // 30M gas (aumentado para despliegue)
    console.log('✓ Gas fijo:', gas);

    const contract_instance = await deployTx.send({
        from: deployer,
        gas: gas,
        gasPrice: '0'  // Gas gratis en nodo local
    });

    const contractAddress = contract_instance.options.address;

    console.log('\n✅ Contrato desplegado exitosamente!');
    console.log('📍 Dirección del contrato:', contractAddress);

    // Guardar información del contrato
    const deploymentInfo = {
        contractAddress: contractAddress,
        deployer: deployer,
        deployedAt: new Date().toISOString(),
        abi: abi,
        network: 'LACNET Local'
    };

    const outputPath = path.join(__dirname, 'deployment.json');
    fs.writeFileSync(outputPath, JSON.stringify(deploymentInfo, null, 2));
    console.log('✓ Información guardada en:', outputPath);

    // Actualizar archivo .env
    const envPath = path.join(__dirname, '.env');
    let envContent = `BLOCKCHAIN_RPC_URL=${RPC_URL}\nCONTRACT_ADDRESS=${contractAddress}\n`;
    fs.writeFileSync(envPath, envContent);
    console.log('✓ Archivo .env actualizado');

    console.log('\n📋 Próximos pasos:');
    console.log('1. Verificar que el contrato esté desplegado: node query-obras.js');
    console.log('2. Registrar una obra: node register-obra.js');
    console.log('3. Iniciar la API: cd ../api && npm start');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
