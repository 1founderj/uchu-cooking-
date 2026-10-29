# RECOVERY_LOG

Proyecto: Uchu Cooking Website (TanStack Start TS)
Raíz: /Users/userthink/Documents/4.uchu-cooking/uchu-cooking-website
Respaldo: /Users/userthink/Documents/4.uchu-cooking/uchu-cooking-website-backup-20261029-121937 (105 archivos, verificado)
Fuente canónica: no disponible (descarga manual archivo por archivo del proyecto Lovable)
Node: v22.14.0  Gestor: npm 10.9.2 (con --legacy-peer-deps debido a optional peer de jsdom en npm 10)

## Cambios

| N.º | Fecha | Archivo | Qué se cambió | Motivo / evidencia | Cómo revertir | Verificación |
|---|---|---|---|---|---|---|
| 1 | 2026-10-29 | `.gitignore` | Creado a partir del `gitignore` original agregando regla explícita `.env*` | La descarga manual omitió el punto inicial; `node_modules` y `.env*` no deben trackearse | `rm .gitignore` | `grep -E "node_modules\|\.env" .gitignore` confirma exclusiones |
| 2 | 2026-10-29 | `.prettierrc` | Creado como copia de `prettierrc` | La descarga manual omitió el punto inicial de archivos de configuración ocultos | `rm .prettierrc` | Archivo presente y legible por prettier |
| 3 | 2026-10-29 | `.prettierignore` | Creado como copia de `prettierignore` | La descarga manual omitió el punto inicial de archivos de configuración ocultos | `rm .prettierignore` | Archivo presente y legible por prettier |
| 4 | 2026-10-29 | `src/data/media.ts` | Se cambió la importación de archivos de metadata ausentes `@/assets/*.asset.json` por la importación directa de los archivos multimedia existentes (`.svg` y `.webp`) | Lovable usa archivos `.asset.json` como punteros remotos; la descarga local contenía las imágenes reales en `src/assets/`. `inventory.mjs` reportó 9 imports sin resolver y `tsc` falló con TS2307 | Restaurar las importaciones con extensión `.asset.json` | `npx tsc --noEmit` pasa con 0 errores; dev server responde 200 OK en todas las imágenes |
| 5 | 2026-10-29 | `package-lock.json` / `node_modules` | Instalación de dependencias ejecutando `npm install --legacy-peer-deps` | El proyecto usaba originalmente Bun (`bun.lock`), pero Bun no está instalado en el sistema. npm 10 presentaba un fallo interno (`TypeError: Cannot read properties of null (reading 'edgesOut')`) al resolver el optional peer `canvas` de `jsdom`. `--legacy-peer-deps` permitió la instalación limpia | `rm -rf node_modules package-lock.json` | `npm ls --depth=0` reporta 0 dependencias faltantes |

## Pruebas

| Ruta / función | Resultado (Pasa/Falla/No probado) | Evidencia |
|---|---|---|
| `GET /` | Pasa | `curl -s -I http://localhost:8080/` responde `HTTP/1.1 307` con cabecera `location: /es` |
| `GET /es` | Pasa | `curl -s http://localhost:8080/es` responde `HTTP/1.1 200 OK` con HTML completo renderizado por SSR, metadatos SEO, Open Graph y JSON-LD |
| Assets estáticos (`/src/assets/uchu-logo.svg`, `/src/assets/rooftop-group.webp`) | Pasa | `curl -s -I http://localhost:8080/src/assets/...` responde `HTTP/1.1 200 OK` (`image/svg+xml`, `image/webp`) |
| Vitest tests (`src/test/app-routing.test.tsx`) | Pasa | `npm test` ejecuta y aprueba 2 de 2 tests en 2.67s |
| TypeScript check (`npx tsc --noEmit`) | Pasa | Finaliza con código de salida 0 sin ningún error en todo el proyecto |
| Build de producción (`npm run build`) | Pasa | Compila client (2.17s), SSR (694ms) y Nitro cloudflare-module (2.18s) generando bundles en `.output/` |

## Variables de entorno (solo nombres)

| Nombre | Dónde se usa | Estado |
|---|---|---|
| *(Ninguna)* | Toda la configuración del negocio reside en `src/config/site.ts` | Confirmado: no se utilizan variables `import.meta.env.*` ni `.env` |

## Pendientes y limitaciones

- **Variante TanStack Start / Nitro**: El proyecto es una aplicación full-stack con TanStack Start y Nitro (preset Cloudflare). No utiliza `index.html` estático en la raíz ya que el documento HTML se genera desde el componente shell en `src/routes/__root.tsx`.
- **Prettier/Lint**: Existen 65 advertencias de espaciado y formato Prettier en componentes originales descargados de Lovable (`npm run lint`), subsanables ejecutando `npm run format`.
- **Wrangler para preview de producción local**: El comando `npm run build` genera el artefacto en `.output` para Cloudflare Workers/Pages mediante Nitro. `npm run preview` nativo de Vite espera un servidor Node estándar en `dist/server/server.js`; para probar el build de Nitro en local como Worker se requiere instalar `wrangler` (`npx wrangler dev`). Para desarrollo en localhost, el comando recomendado y 100% operativo es `npm run dev`.

