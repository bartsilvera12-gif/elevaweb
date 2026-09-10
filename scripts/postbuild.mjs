// Post-build de ELEVA: deja el export estático de Next.js en dist/.
//
// Next.js con output:"export" siempre genera el sitio en out/. Para el flujo
// de despliegue en Hostinger necesitamos que el resultado final quede en dist/,
// que es lo que se sube tal cual a public_html/.
//
// Este script:
//   1. Elimina un dist/ anterior (para no mezclar builds viejos).
//   2. Mueve out/ -> dist/ (rename atómico; si falla, copia y borra).
//
// Es multiplataforma: usa solo la API fs de Node, sin comandos de shell
// (nada de move/xcopy/PowerShell).
import { existsSync, rmSync, renameSync, cpSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const OUT = resolve(root, "out");
const DIST = resolve(root, "dist");

if (!existsSync(OUT)) {
  console.error(
    "[postbuild] No se encontró out/. ¿Se ejecutó 'next build' con output:\"export\"?"
  );
  process.exit(1);
}

// 1) Limpiar dist/ anterior.
if (existsSync(DIST)) {
  rmSync(DIST, { recursive: true, force: true });
}

// 2) Mover out/ -> dist/. rename es instantáneo en el mismo volumen;
//    si el entorno lo impide (p.ej. distinto filesystem), copiar y borrar.
try {
  renameSync(OUT, DIST);
} catch {
  cpSync(OUT, DIST, { recursive: true });
  rmSync(OUT, { recursive: true, force: true });
}

console.log("[postbuild] Export listo en dist/ — subir su contenido a public_html/.");
