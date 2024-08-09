const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

const distPath = path.join(__dirname, 'dist');

function registerEndpoints(dirPath, basePath = '') {
    const files = fs.readdirSync(dirPath);

    files.forEach((file) => {
        let filePath = path.join(dirPath, file);
        let relativePath = path.join(basePath, file);

        if (fs.statSync(filePath).isDirectory()) {
            registerEndpoints(filePath, relativePath);
        } else {
            let endpoint = path.join('/dist', relativePath);
            relativePath = relativePath.replace(/\\/g, '/');
            relativePath = path.join('/', relativePath);
            console.log(`Registering endpoint: ${endpoint} and relative path ${relativePath} for file ${filePath}`);
            app.get(endpoint, (req, res) => {
                res.sendFile(filePath);
            });
            app.get(relativePath, (req, res) => {
                res.sendFile(filePath);
            });
        }
    });
}

registerEndpoints(distPath);

app.get('/', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});