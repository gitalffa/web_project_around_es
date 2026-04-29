# Around — Red Social de Fotografías 📸

> Red social interactiva para compartir fotografías con ubicación geográfica, clima en tiempo real e imagen astronómica del día. Proyecto del Sprint 7 del Bootcamp TripleTen.

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![BEM](https://img.shields.io/badge/BEM-000000?style=flat&logoColor=white)
![WeatherAPI](https://img.shields.io/badge/WeatherAPI-00BFFF?style=flat&logoColor=white)
![NASA API](https://img.shields.io/badge/NASA%20APOD-0B3D91?style=flat&logo=nasa&logoColor=white)

## 🔗 Demo en vivo

👉 [Ver proyecto en GitHub Pages](https://gitalffa.github.io/web_project_around_es/)

---

## 📋 Descripción

**Around** es una red social donde los usuarios pueden compartir fotografías de lugares. La aplicación combina gestión completa de tarjetas (CRUD) con dos integraciones de APIs externas: el **clima actual del usuario** obtenido por geolocalización, y la **imagen astronómica del día de la NASA (APOD)** como fondo dinámico de la aplicación.

Este proyecto forma parte del Bootcamp de Desarrollo Web Full Stack de **TripleTen** y aplica JavaScript orientado a objetos, fetch API y arquitectura de clases ES6.

---

## ✨ Funcionalidades

**Red social:**

- **Editar perfil** — Nombre y descripción del usuario mediante ventana modal
- **Agregar tarjetas** — Nuevas fotos con título y URL de imagen
- **Eliminar tarjetas** — Con confirmación antes de eliminar
- **Me gusta** — Toggle de corazón en cada tarjeta
- **Ver imagen ampliada** — Modal de imagen al hacer clic en una tarjeta
- **Validación de formularios** — Mensajes de error en tiempo real
- **Cerrar modales** — Con botón ✕, tecla Escape o clic fuera del modal

**Integraciones con APIs externas:**

- 🌤 **Clima en tiempo real** — Detecta la ubicación del usuario (Geolocation API) y consulta la temperatura y condición climática actual mediante **WeatherAPI.com**
- 🔭 **NASA APOD** — Obtiene la imagen astronómica del día de la **NASA Astronomy Picture of the Day API** y la muestra como fondo dinámico de la aplicación

---

## 🛠 Tecnologías y APIs

| Tecnología / API | Uso                                            |
| ---------------- | ---------------------------------------------- |
| JavaScript ES6+  | Lógica, clases, manipulación del DOM           |
| HTML5 semántico  | Estructura y accesibilidad                     |
| CSS3 + Variables | Estilos, animaciones y layout responsivo       |
| Metodología BEM  | Nomenclatura organizada de clases              |
| Webpack          | Empaquetado y optimización de archivos         |
| Fetch API        | Comunicación asíncrona con APIs externas       |
| WeatherAPI.com   | Clima actual por geolocalización del usuario   |
| NASA APOD API    | Imagen astronómica del día como fondo dinámico |
| Geolocation API  | Obtención de coordenadas del usuario           |
| GitHub Pages     | Despliegue del proyecto                        |

---

## 🗂 Estructura del proyecto

```
web_project_around_es/
├── src/
│   ├── index.html              # Estructura principal
│   ├── pages/
│   │   └── index.css           # Estilos principales
│   ├── components/             # Clases JS reutilizables
│   │   ├── api.js              # CRUD de tarjetas (backend propio)
│   │   ├── nasaApi.js          # Integración NASA APOD API
│   │   ├── weatherApi.js       # Integración WeatherAPI.com
│   │   ├── Card.js             # Clase para tarjetas de fotos
│   │   ├── FormValidator.js    # Validación de formularios
│   │   ├── Popup.js            # Clase base para modales
│   │   ├── PopupWithImage.js   # Modal de imagen ampliada
│   │   ├── PopupWithForm.js    # Modal con formulario
│   │   ├── Section.js          # Renderizado de listas
│   │   └── UserInfo.js         # Datos del perfil de usuario
│   ├── utils/
│   │   └── constants.js        # Configuración y selectores
│   └── images/                 # Imágenes del proyecto
├── .editorconfig
├── .gitignore
├── .prettierignore
└── favicon.ico
```

---

## 🌤 API del Clima — WeatherAPI.com

Usa la **API de Geolocalización del navegador** para obtener las coordenadas del usuario, luego consulta **WeatherAPI.com** para mostrar la temperatura y condición climática actual en tiempo real.

```javascript
// Flujo general
navigator.geolocation.getCurrentPosition(({ coords }) => {
  weatherApi
    .getWeather(coords.latitude, coords.longitude)
    .then((data) => renderWeather(data));
});
```

---

## 🔭 NASA APOD API

Consulta diariamente la **Astronomy Picture of the Day** de la NASA y la usa como fondo dinámico de la aplicación, renovándose cada día con una nueva imagen del universo.

```javascript
// Flujo general
nasaApi.getApod().then(({ url, title }) => {
  document.body.style.backgroundImage = `url(${url})`;
});
```

---

## 🚀 Cómo usar localmente

```bash
# Clona el repositorio
git clone https://github.com/gitalffa/web_project_around_es.git

# Entra al directorio
cd web_project_around_es

# Instala las dependencias
npm install

# Inicia el servidor de desarrollo
npm run dev
```

> ⚠️ Necesitas tus propias API keys de [WeatherAPI.com](https://www.weatherapi.com/) y [NASA APIs](https://api.nasa.gov/) y configurarlas en `src/utils/constants.js`.

---

## 📐 Conceptos aplicados

- **Programación Orientada a Objetos** — Arquitectura basada en clases ES6
- **Fetch API y Promesas** — Consumo de APIs REST externas de forma asíncrona
- **Geolocation API** — Detección de ubicación del usuario en el navegador
- **Metodología BEM** — Nomenclatura consistente de clases CSS
- **Manipulación del DOM** — Creación y eliminación dinámica de elementos
- **Validación de formularios** con JavaScript puro
- **Diseño responsive** con Flexbox y CSS Grid

---

## 🗒 Notas

Este repositorio es la versión en **español** del proyecto Around. La versión en inglés está disponible en [web_project_around](https://github.com/gitalffa/web_project_around).

---

## 👤 Autor

**Fabricio Galindo Copado**
Desarrollador Web Full Stack | Bootcamp TripleTen

- 🌐 [LinkedIn](https://www.linkedin.com/in/fabricio-galindo-copado/)
- 💻 [GitHub](https://github.com/gitalffa)
- ✉️ fabricio.alffa@gmail.com

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.
