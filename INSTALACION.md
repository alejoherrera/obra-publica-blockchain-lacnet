# Guía de Instalación Completa

## Paso 1: Instalar WSL2 (Windows Subsystem for Linux)

### 1.1 Verificar si WSL está instalado
```powershell
wsl --status
```

### 1.2 Si no está instalado, ejecutar como Administrador:
```powershell
wsl --install
```

### 1.3 Reiniciar el sistema
Después de la instalación, **debes reiniciar Windows**.

### 1.4 Configurar Ubuntu
Al reiniciar, se abrirá Ubuntu automáticamente. Crea un usuario y contraseña.

### 1.5 Verificar instalación
```bash
# Dentro de Ubuntu/WSL
lsb_release -a
```

## Paso 2: Instalar Docker Desktop

### 2.1 Descargar Docker Desktop
https://www.docker.com/products/docker-desktop/

### 2.2 Durante la instalación
- Marcar: "Use WSL 2 instead of Hyper-V"
- Marcar: "Add shortcut to desktop"

### 2.3 Configurar Docker Desktop
1. Abrir Docker Desktop
2. Ir a Settings (icono de engranaje)
3. General → Verificar que "Use the WSL 2 based engine" esté marcado
4. Resources → WSL Integration → Habilitar Ubuntu
5. Apply & Restart

### 2.4 Verificar Docker
```bash
# Dentro de WSL (Ubuntu)
docker --version
docker-compose --version
```

## Paso 3: Levantar Nodo LACNET Local

### 3.1 Abrir terminal de WSL (Ubuntu)
```bash
# Ir al directorio home de Linux (NO usar /mnt/c/)
cd ~
```

### 3.2 Clonar repositorio de LACNET
```bash
git clone https://github.com/LACNet-Networks/besu-networks
cd besu-networks/docker/compose/local/writer1
```

### 3.3 Configurar permisos
```bash
sudo chmod -R 777 data
```

### 3.4 Subir un nivel y levantar el nodo
```bash
cd ..
docker-compose up -d
```

### 3.5 Verificar que el nodo esté corriendo
```bash
docker-compose logs -f besu
```

Deberías ver logs de bloques siendo creados. Presiona Ctrl+C para salir.

### 3.6 Verificar conectividad RPC
```bash
curl -X POST --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:4545
```

Deberías recibir algo como: `{"jsonrpc":"2.0","id":1,"result":"0x123"}`

## Paso 4: Configurar el Proyecto Obra Pública Blockchain

### 4.1 Navegar al proyecto (en Windows)
```powershell
cd C:\Users\aleja\blockchain\obra-publica-blockchain
```

### 4.2 Instalar Node.js
Si no tienes Node.js instalado:
- Descargar desde: https://nodejs.org/ (versión LTS)
- Ejecutar el instalador
- Verificar: `node --version` y `npm --version`

### 4.3 Instalar dependencias de scripts
```bash
cd scripts
npm install
```

### 4.4 Desplegar el smart contract
```bash
npm run deploy
```

Deberías ver:
```
✅ Contrato desplegado exitosamente!
📍 Dirección del contrato: 0x...
```

### 4.5 Registrar obra de ejemplo
```bash
npm run register
```

### 4.6 Consultar obras registradas
```bash
npm run query
```

## Paso 5: Iniciar la API

### 5.1 Abrir nueva terminal y navegar a API
```bash
cd C:\Users\aleja\blockchain\obra-publica-blockchain\api
```

### 5.2 Instalar dependencias
```bash
npm install
```

### 5.3 Iniciar servidor
```bash
npm start
```

Deberías ver:
```
✅ API corriendo en http://localhost:3000
```

### 5.4 Probar la API
Abre en el navegador:
- http://localhost:3000/
- http://localhost:3000/api/stats
- http://localhost:3000/api/obras

## Paso 6: Iniciar el Frontend

### 6.1 Abrir nueva terminal y navegar a frontend
```bash
cd C:\Users\aleja\blockchain\obra-publica-blockchain\frontend
```

### 6.2 Instalar dependencias
```bash
npm install
```

### 6.3 Iniciar servidor web
```bash
npm run dev
```

### 6.4 Abrir en navegador
http://localhost:8080

¡Deberías ver el mapa con las obras registradas!

## Resumen de Servicios Corriendo

| Servicio | Puerto | URL |
|----------|--------|-----|
| Blockchain LACNET | 4545 | http://localhost:4545 |
| API REST | 3000 | http://localhost:3000 |
| Frontend | 8080 | http://localhost:8080 |

## Comandos Útiles

### Ver logs del nodo blockchain
```bash
cd ~/besu-networks/docker/compose/local
docker-compose logs -f besu
```

### Reiniciar nodo blockchain
```bash
cd ~/besu-networks/docker/compose/local
docker-compose restart
```

### Detener todo
```bash
# Detener nodo
cd ~/besu-networks/docker/compose/local
docker-compose down

# Detener API (Ctrl+C en su terminal)
# Detener Frontend (Ctrl+C en su terminal)
```

### Limpiar y empezar de nuevo
```bash
# Eliminar datos del nodo
cd ~/besu-networks/docker/compose/local/writer1
sudo rm -rf data/*

# Volver a desplegar contrato
cd C:\Users\aleja\blockchain\obra-publica-blockchain\scripts
npm run deploy
npm run register
```

## Solución de Problemas

### Error: "Permission denied" en chmod
- Asegúrate de estar en el sistema de archivos de WSL (`cd ~`), NO en `/mnt/c/`

### Error: "Cannot connect to Docker daemon"
- Verifica que Docker Desktop esté corriendo
- Verifica WSL Integration en Docker Desktop settings

### Error: "No hay cuentas disponibles"
- El nodo blockchain aún no ha iniciado completamente
- Espera 1-2 minutos y vuelve a intentar

### Error: "ECONNREFUSED localhost:4545"
- El nodo blockchain no está corriendo
- Verifica: `docker-compose ps`

### Error: "ECONNREFUSED localhost:3000"
- La API no está corriendo
- Verifica que ejecutaste `npm start` en `/api`

## Siguiente Paso: Agregar Tus Propias Obras

1. Edita `/data/riesgo_climatico.json` con tus datos
2. Ejecuta `npm run register` en `/scripts`
3. Refresca el navegador en http://localhost:8080

¡Listo! Tienes un sistema completo de blockchain local funcionando.
