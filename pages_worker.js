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

fs.readdirSync(ghPagesDir).forEach(file => {
    const filePath = path.join(ghPagesDir, file);
    if (file !== 'index.html') {
        fs.renameSync(filePath, path.join(staticDir, file));
    }
});

console.log('Files copied and moved successfully!');
