# SGA - Sistema de Gestión de Aulas

Este es el repositorio central para el desarrollo del **SGA (Sistema de Gestión de Aulas)**. Este documento contiene los pasos iniciales para configurar y ejecutar el entorno de desarrollo de manera colaborativa.

## 🚀 Comenzando

Sigue estas instrucciones para clonar el proyecto y levantar el entorno local en tu máquina.

### 📋 Prerrequisitos

Antes de empezar, es necesario que tengas instalado en tu sistema:

* **Node.js**: Entorno de ejecución para JavaScript en el servidor. Se recomienda instalar la versión **LTS** estable. Puedes descargarlo e instalarlo desde [nodejs.org](https://nodejs.org/).
* **Git**: Para la gestión del código fuente y el trabajo en equipo.

---

## 🔧 Instalación y Configuración del Backend

Sigue estos pasos ordenados en tu terminal para inicializar el servidor:

### 1. Clonar el repositorio
Si todavía no clonaste el proyecto en tu computadora, ejecutá:

```bash
git clone https://github.com/Matias-Zahn/SGA
```

### 2. Entrar a la carpeta del Backend
El proyecto se encuentra dividido. Para trabajar con el servidor, navegá hacia el directorio de la API:

```bash
cd backend
```

### 3. Instalar las dependencias
Una vez dentro de la carpeta `backend`, instalá todos los módulos y paquetes necesarios ejecutando:

```bash
npm i
```
*(También podés usar `npm install` si lo preferís).*

### 4. Levantar el servidor de desarrollo
Para iniciar la aplicación en modo de desarrollo (con recarga automática ante cualquier cambio en el código), ejecutá:

```bash
npm run dev
```

Si todo está correcto, la terminal indicará que el servidor está corriendo y escuchando en el puerto configurado (por ejemplo, `http://localhost:3000`).

