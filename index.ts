import * as fs from 'fs';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

const srcPath = './src';
let serverProcess: ChildProcess | null = null;

function startServer() {
  if (serverProcess) {
    serverProcess.kill();
  }
  serverProcess = spawn('npm', ['run', 'start'], {
    stdio: 'inherit',
    shell: true
  });
  serverProcess.on('close', (code) => {
    if (code !== null) {
      console.log(`Server process exited with code ${code}`);
    }
  });
}

startServer();

fs.watch(srcPath, (eventType: string, filename: string | null) => {
  if (filename === null) {
    console.error('Filename is null');
    return;
  }
  console.log(`File ${filename} has changed`);
  const fileExtension = path.extname(filename);
  if (fileExtension === '.ts') {
    console.log('Restarting server due to TypeScript file change');
    startServer();
  } else {
    console.log('Running npm run copy-files...');
    spawn('npm', ['run', 'copy-files'], {
      stdio: 'inherit',
      shell: true
    }).on('close', (code) => {
      if (code !== null) {
        console.log(`copy-files process exited with code ${code}`);
      }
    });
  }
});