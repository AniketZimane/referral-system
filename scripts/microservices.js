const { spawn } = require('child_process');

const services = [
  { name: 'Auth Service',     cmd: 'tsx', args: ['services/auth-service/src/index.ts'] },
  { name: 'User Service',     cmd: 'tsx', args: ['services/user-service/src/index.ts'] },
  { name: 'Referral Service', cmd: 'tsx', args: ['services/referral-service/src/index.ts'] },
  { name: 'Purchase Service', cmd: 'tsx', args: ['services/purchase-service/src/index.ts'] },
  { name: 'API Gateway',      cmd: 'tsx', args: ['api-gateway/src/index.ts'] },
  { name: 'Frontend',         cmd: 'npx', args: ['next', 'dev'] },
];

const colors = ['\x1b[36m', '\x1b[32m', '\x1b[33m', '\x1b[35m', '\x1b[34m', '\x1b[37m'];
const reset = '\x1b[0m';

services.forEach((service, i) => {
  const color = colors[i % colors.length];
  const proc = spawn(service.cmd, service.args, { shell: true });

  proc.stdout.on('data', (data) => {
    process.stdout.write(`${color}[${service.name}]${reset} ${data}`);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`${color}[${service.name}]${reset} ${data}`);
  });

  proc.on('close', (code) => {
    console.log(`${color}[${service.name}]${reset} exited with code ${code}`);
  });
});

console.log('\x1b[1m🚀 All microservices starting...\x1b[0m');
console.log('  Auth Service     → http://localhost:5001');
console.log('  User Service     → http://localhost:5002');
console.log('  Referral Service → http://localhost:5003');
console.log('  Purchase Service → http://localhost:5004');
console.log('  API Gateway      → http://localhost:5000');
console.log('  Frontend         → http://localhost:3000');
