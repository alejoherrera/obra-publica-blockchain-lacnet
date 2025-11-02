# Configuración de WSL2 - Solución de Problemas

## ⚠️ Problema Detectado

Tu sistema tiene WSL instalado pero **no está completamente configurado**. Específicamente:

```
❌ WSL 2 no es compatible con la configuración actual de la máquina.
❌ Se debe habilitar el componente opcional "Plataforma de máquina virtual"
❌ Asegurarse de que la virtualización está habilitada en el BIOS
```

## Solución Paso a Paso

### Paso 1: Habilitar Virtualización en BIOS

1. **Reinicia tu PC**
2. **Entra al BIOS/UEFI** (presiona F2, F10, F12 o DEL durante el arranque, depende de tu PC)
3. **Busca una opción llamada:**
   - "Intel Virtualization Technology" (VT-x)
   - "AMD-V" o "SVM Mode"
   - "Virtualization"
4. **Cámbiala a Enabled**
5. **Guarda cambios** (generalmente F10) y reinicia

### Paso 2: Habilitar Características de Windows

**Opción A: PowerShell (Recomendado - Más Rápido)**

Ejecuta PowerShell como **Administrador** y copia estos comandos:

```powershell
# Habilitar Subsistema de Windows para Linux
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Habilitar Plataforma de Máquina Virtual
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# Reiniciar
shutdown /r /t 0
```

**Opción B: Interfaz Gráfica**

1. Abre "Panel de Control"
2. Ve a "Programas" → "Activar o desactivar las características de Windows"
3. **Marca estas casillas:**
   - ✓ Subsistema de Windows para Linux
   - ✓ Plataforma de máquina virtual
4. Click "Aceptar"
5. **Reinicia** cuando te lo pida

### Paso 3: Actualizar Kernel de WSL2

Después de reiniciar:

1. Descarga el paquete de actualización:
   https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi

2. Ejecuta el instalador

3. Abre PowerShell como Administrador y ejecuta:

```powershell
wsl --set-default-version 2
```

### Paso 4: Instalar Ubuntu

```powershell
wsl --install -d Ubuntu
```

Esto descargará e instalará Ubuntu. Cuando termine:
- Se abrirá una ventana de Ubuntu
- Te pedirá crear un usuario y contraseña
- **Anota bien estos datos, los necesitarás**

### Paso 5: Verificar Instalación

```powershell
wsl --status
```

Deberías ver:
```
Versión predeterminada: 2
```

Y no deberías ver errores.

```powershell
wsl --list --verbose
```

Deberías ver:
```
  NAME      STATE      VERSION
* Ubuntu    Running    2
```

## Si Persisten los Errores

### Error: "Virtualización no habilitada"

**Verifica si tu CPU soporta virtualización:**

```powershell
systeminfo
```

Busca la línea "Requisitos de Hyper-V". Debe decir:
- "Extensiones de modo de monitor de VM: Sí"
- "Virtualización habilitada en el firmware: Sí"

Si dice "No", necesitas habilitarla en BIOS (Paso 1).

### Error: "Hyper-V incompatible con VirtualBox/VMware"

Si tienes VirtualBox o VMware instalados, pueden causar conflictos. Opciones:
1. Desinstalar VirtualBox/VMware (recomendado para este proyecto)
2. O usar solo WSL2 (no los dos a la vez)

### Error: Windows Home Edition

Si tienes Windows 10/11 Home:
- WSL2 **SÍ funciona** en Home
- Hyper-V completo NO, pero WSL2 usa una versión reducida que sí está disponible
- Sigue los pasos normalmente

## Comando de Instalación Completa Automática

Si prefieres un solo comando (requiere permisos de administrador):

```powershell
# Ejecutar en PowerShell como Administrador
wsl --install --no-distribution

# Esperar a que termine y reiniciar

# Después de reiniciar:
wsl --install -d Ubuntu
```

## Verificación Final

Cuando todo esté instalado, ejecuta:

```bash
wsl
```

Deberías entrar a la terminal de Ubuntu. Verifica la versión:

```bash
lsb_release -a
```

Deberías ver algo como:
```
Description:    Ubuntu 22.04.x LTS
```

## Próximo Paso

Una vez que WSL2 esté funcionando, continúa con:

📄 **INSTALACION.md** - Guía completa de instalación del proyecto

## Recursos Adicionales

- Documentación oficial de Microsoft: https://docs.microsoft.com/es-es/windows/wsl/install
- Solución de problemas: https://docs.microsoft.com/es-es/windows/wsl/troubleshooting
- Foro de la comunidad: https://github.com/microsoft/WSL/issues

## Resumen de Comandos Útiles

```powershell
# Listar distribuciones instaladas
wsl --list --verbose

# Establecer WSL2 como predeterminado
wsl --set-default-version 2

# Convertir Ubuntu de WSL1 a WSL2 (si aplica)
wsl --set-version Ubuntu 2

# Actualizar WSL
wsl --update

# Verificar estado
wsl --status

# Entrar a Ubuntu
wsl

# Apagar WSL
wsl --shutdown
```

## ¿Necesitas Ayuda?

Si sigues teniendo problemas después de estos pasos:

1. Verifica que tu versión de Windows sea compatible:
   - Windows 10 versión 1903+ (Build 18362+)
   - Windows 11 (cualquier versión)

2. Ejecuta el diagnóstico:
   ```powershell
   wsl --status
   systeminfo
   ```

3. Busca en los issues de GitHub de WSL:
   https://github.com/microsoft/WSL/issues
