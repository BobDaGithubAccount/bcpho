const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, 'dist', 'src', '*');
const ghPagesDir = path.join(__dirname, 'gh-pages');
const staticDir = path.join(ghPagesDir, 'static');

if (fs.existsSync(ghPagesDir)) {
    execSync(`rm -r ${ghPagesDir}`);
}

fs.mkdirSync(ghPagesDir);
fs.mkdirSync(staticDir);

execSync(`cp -R ${srcDir} ${ghPagesDir}`);

execSync(`find ${ghPagesDir} -mindepth 1 -maxdepth 1 ! -name 'index.html' ! -name 'static' -exec mv -t ${staticDir} {} +`);

console.log('Files copied and moved successfully!');