const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Enhance shadows for boxes
  content = content.replace(/shadow-sm/g, 'shadow-lg shadow-zinc-200/50');
  content = content.replace(/border-zinc-200\/50/g, 'border-zinc-200/60');
  content = content.replace(/rounded-\[20px\]/g, 'rounded-[1.5rem]');
  content = content.replace(/rounded-\[16px\]/g, 'rounded-2xl');

  if (original !== content) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  }
}

function walkSync(dir) {
  let files = fs.readdirSync(dir);
  files.forEach(file => {
    let filepath = path.join(dir, file);
    if (fs.statSync(filepath).isDirectory()) {
      walkSync(filepath);
    } else if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
      replaceInFile(filepath);
    }
  });
}

walkSync('src');
