const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  content = content.replace(/shadow-lg shadow-zinc-200\/50 hover:shadow-lg shadow-zinc-200\/50/g, 'shadow-lg shadow-zinc-200/50 hover:shadow-xl hover:shadow-zinc-300/60');
  content = content.replace(/border-zinc-200\/60\/60/g, 'border-zinc-200/60');

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
