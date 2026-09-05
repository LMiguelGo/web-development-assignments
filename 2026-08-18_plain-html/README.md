# Réplica de la Interfaz de Mercado Libre en HTML Puro

Este proyecto consiste en la maquetación y evaluación comparativa de la página de inicio de Mercado Libre utilizando exclusivamente **HTML puro** (sin hojas de estilo CSS ni código JavaScript).

---

## Variantes Desarrolladas

Para analizar distintos enfoques de marcado e implementación semántica, se crearon tres versiones de la interfaz:

* `mercado_libre_no_ai/`: Implementación maquetada manualmente desde cero.
* `mercado_libre_gemini/`: Estructura generada con asistencia del modelo Gemini.
* `mercado_libre_claude/`: Estructura generada con asistencia del modelo Claude.

---

## Análisis Comparativo y Conclusiones

Tras realizar el desarrollo y revisión de los tres modelos, se identificaron los siguientes puntos clave:

1. **Uso de etiquetas semánticas:** Las versiones asistidas por Inteligencia Artificial integraron de forma explícita etiquetas estructurales como `<section>`, `<article>` y `<nav>`, logrando una mejor organización del documento.
2. **Estilizado HTML nativo:** La versión manual hizo uso del atributo nativo de color en tablas (`bgcolor`), mientras que las IAs omitieron el uso de atributos de color obsoletos en favor de un HTML visualmente más neutro.
3. **Nivel de detalle e interfaz:** Ambos modelos de IA maquetaron una mayor cantidad de secciones y componentes de la página original (métodos de pago, banners promocionales y grillas de productos más completas) utilizando tablas para simular el diseño en rejilla.

---

## Vista Previa y Ejecución

Para visualizar cualquier versión, abrir directamente los archivos `.html` correspondientes en cualquier navegador web:

```text
plain-html/
├── mercado_libre_claude/
│   └── mercado_libre_claude.html
├── mercado_libre_gemini/
│   └── mercado_libre_gemini.html
└── mercado_libre_no_ai/
    └── mercado_libre_no_ai.html