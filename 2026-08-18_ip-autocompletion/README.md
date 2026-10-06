# Autocompletado y Validación de Direcciones IP (IPv6 / IPv4)

Aplicación web interactiva desarrollada para la captura asistida y validación en tiempo real de direcciones IP, con soporte principal para el estándar **IPv6 (RFC 4291 / RFC 5952)** y compatibilidad con **IPv4**.

---

## 🚀 Funcionalidades Principales

1. **Autocompletado y Puntuación Asistida:**
   * A medida que el usuario ingresa dígitos hexadecimales (0-9, a-f), el sistema inserta automáticamente el separador correspondiente (`:` por defecto en IPv6) al completar cada bloque de 4 caracteres.
   * Manejo ergonómico del teclado numérico: al presionar la tecla punto (`.`), se traduce fluidamente al separador correspondiente para facilitar la digitación.
   * Prevención de bloqueo en retroceso: al borrar con *Backspace*, no se regenera el separador en bucle, permitiendo una edición cómoda.

2. **Indicador Dinámico de Cumplimiento de Formato:**
   * **Aviso en letras rojas:** Si la dirección no cumple las especificaciones (exceso o escasez de bloques, caracteres no hexadecimales, compresión múltiple `:::`, etc.), se muestra un mensaje de alerta en rojo detallando el motivo exacto del fallo.
   * **Aviso en letras verdes:** Si la dirección cumple formalmente con el estándar, se despliega un mensaje en verde confirmando la validez de la dirección.
   * Retroalimentación visual en el borde del campo de texto mediante iluminación contextual (verde/roja).

3. **Panel de Métricas y Clasificación de Red:**
   * Conteo dinámico de bloques o hextetos ingresados.
   * Detección de compresión de ceros (`::`).
   * Clasificación del tipo de dirección (Loopback, Link-Local, Global Unicast, ULA, Multicast, Red Privada, etc.).

4. **Chips de Prueba Rápida:**
   * Casos de prueba precargados para verificar de inmediato direcciones válidas (completas, comprimidas, especiales) e inválidas (demasiados bloques, caracteres inválidos, etc.).

5. **Configuración Personalizable:**
   * Selector entre protocolo **IPv6** e **IPv4**.
   * Posibilidad de alternar el separador automático (`:` estándar o `.` punto).
   * Interruptor para activar o desactivar la puntuación automática según la preferencia de prueba.

---

## 📂 Estructura de Archivos

```text
2026-08-18_ip-autocompletion/
├── index.html       # Estructura semántica, accesibilidad y componentes de interfaz
├── styles.css       # Hoja de estilos moderna, tema oscuro técnico y estados rojo/verde
├── script.js        # Lógica de autocompletado, eventos del teclado y algoritmos de validación
└── README.md        # Documentación técnica de la práctica
```

---

## 🌐 Cómo Ejecutar la Aplicación

No requiere gestores de paquetes ni servidores adicionales. Para visualizarlo en cualquier navegador web moderno:

1. Abrir directamente el archivo `index.html` con doble clic o con la extensión **Live Server** de Visual Studio Code.
2. O ejecutar un servidor local rápido mediante PowerShell:
   ```powershell
   # Desde el directorio del proyecto
   python -m http.server 8000
   ```
   Y acceder a `http://localhost:8000`.

---

## 👤 Autor

* **Luis Miguel Gomez** — Estudiante de Ingeniería de Electrónica y Telecomunicaciones, Universidad del Cauca.
* Curso: **Electiva: Desarrollo de Aplicaciones Web** (Semestre 2026-2).
