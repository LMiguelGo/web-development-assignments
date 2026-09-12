# Réplica de la Interfaz de Mercado Libre con HTML y CSS

Este proyecto consiste en la maquetación, estilizado y evaluación comparativa de la página de inicio de Mercado Libre utilizando **HTML5 y CSS3**, evaluando el impacto del uso de estilos y arquitecturas modernas frente a desarrollos asistidos por Inteligencia Artificial.

---

## Variantes Desarrolladas

Para analizar distintos enfoques de marcado, estilos y estructura del proyecto, se comparan tres versiones:

* `mercado_libre_no_ai/`: Implementación maquetada y estilizada manualmente por el desarrollador.
* `mercado_libre_chatgpt/`: Estructura y estilos generados con asistencia de ChatGPT en un único archivo.
* `mercado_libre_v0/`: Proyecto generado mediante v0 con arquitectura modular y herramientas de desarrollo.

---

## Análisis Comparativo y Conclusiones

Tras realizar el desarrollo, integración de CSS y revisión de las tres soluciones, se identificaron los siguientes puntos clave:

1. **Fidelidad y alcance de ChatGPT:** La versión generada por ChatGPT resultó ser la más básica y la menos cercana al diseño real de Mercado Libre. Consolidó todo el código (HTML y CSS) en un solo archivo, lo que limitó la complejidad visual y la escalabilidad de sus componentes.
2. **Resultado y arquitectura de v0:** La versión creada con v0 logró el diseño más preciso y fiel a la plataforma original. Además de la capa visual, generó una estructura de proyecto profesional que incluye archivos de configuración y gestión de dependencias como `package.json` y `pnpm-lock.yaml`.
3. **El toque del desarrollador (No AI):** La versión manual logró un diseño muy similar al sitio real. Aunque no abarcó tantos componentes como v0, demostró el valor de la intervención personal: la libertad y criterio del desarrollador para pulir minuciosamente detalles específicos de diseño, alineación y hojas de estilo.

---

## Vista Previa y Estructura del Proyecto

Para explorar o ejecutar cada versión, abrir los archivos correspondientes en navegador o entorno local:

```text
2026-08-31_css-html/
├── mercado_libre_chatgpt/
│   └── index.html
├── mercado_libre_no_ai/
│   ├── index.html
│   └── styles.css
└── mercado_libre_v0/
    ├── package.json
    ├── pnpm-lock.yaml
    └── ...