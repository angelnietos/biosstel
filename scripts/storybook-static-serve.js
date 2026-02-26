/**
 * Escribe LEEME.txt en storybook-static.
 * Para ver Storybook estático hay que servirlo por HTTP (no abrir index.html con file://).
 */
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'storybook-static');
const leeme = path.join(dir, 'LEEME.txt');
const msg = [
  'STORYBOOK ESTÁTICO',
  '',
  'No abras index.html directamente (file://) o verás una página en blanco.',
  '',
  'Para verlo: en la raíz del proyecto ejecuta',
  '  pnpm run storybook:serve',
  'y abre en el navegador:  http://localhost:6006',
].join('\n');

if (fs.existsSync(dir)) {
  fs.writeFileSync(leeme, msg, 'utf8');
}
console.log('\n  Build listo. Para verlo ejecuta en otra terminal:');
console.log('  pnpm run storybook:serve');
console.log('  Luego abre: http://localhost:6006\n');
