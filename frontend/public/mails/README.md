# The Standard — Fase 1

Sistema editorial y plantilla maestra de correo para SOLE.

## Contenido

- `mini-brand-book.md`: identidad, tono, colores, tipografía y reglas visuales.
- `componentes.md`: catálogo y reglas de los bloques reutilizables.
- `variables.json`: valores que deben revisarse en cada edición.
- `plantilla-maestra-mailchimp.html`: plantilla lista para editar/importar.
- `assets/hero-editorial.jpg`: hero optimizado para correo (1200 px, 128 KB).
- `assets/hero-editorial.png`: original de alta calidad para futuras adaptaciones.

## Flujo de uso (10–20 minutos)

1. Duplica `plantilla-maestra-mailchimp.html` y renómbrala con el número de edición.
2. Busca `EDITAR:` en el HTML y reemplaza textos, enlaces e imágenes.
3. Cambia primero los valores descritos en `variables.json`.
4. Sube las imágenes a Mailchimp Content Studio o a un servidor HTTPS público.
5. Sustituye las URLs `https://TU-DOMINIO...` por las URLs públicas definitivas.
6. Importa el HTML en Mailchimp y envía pruebas a Gmail, Outlook y Apple Mail.

## Reglas críticas

- No incrustar SVG, JavaScript, video, formularios, `flex`, `grid` ni `position`.
- Mantener el ancho principal en 600 px.
- Usar JPG para fotografías y PNG para gráficos con bordes/texto.
- No poner información esencial únicamente dentro de una imagen.
- Conservar texto alternativo (`alt`) útil en todas las imágenes.
- El verde WhatsApp se usa solo para la conversión final.

## Importación en Mailchimp

En Mailchimp: **Content → Email templates → Create template → Code your own → Paste in code**. Pega el contenido completo del archivo HTML. Mailchimp puede mover algunos estilos, pero la presentación depende principalmente de tablas y estilos inline.

## Lista antes de enviar

- [ ] Asunto y preheader actualizados.
- [ ] Número, tema y próxima edición actualizados.
- [ ] Hero y fotografías alojados públicamente por HTTPS.
- [ ] WhatsApp oficial y mensaje verificados.
- [ ] URL de versión web y enlaces sociales verificados.
- [ ] Prueba de enlaces y revisión móvil.
- [ ] Prueba real en Gmail y Outlook.
