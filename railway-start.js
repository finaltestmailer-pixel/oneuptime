// Railway startup script with proper error handling and logging
const path = require('path');

console.log('Starting OneUptime Railway deployment...');
console.log('Node version:', process.version);
console.log('Working directory:', __dirname);
console.log('Environment variables:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- PORT:', process.env.PORT);
console.log('- DATABASE_HOST:', process.env.DATABASE_HOST ? 'SET' : 'NOT SET');
console.log('- REDIS_HOST:', process.env.REDIS_HOST ? 'SET' : 'NOT SET');

// Set up environment variables
process.env.TS_NODE_PROJECT = path.join(__dirname, 'tsconfig.railway.json');
process.env.NODE_PATH = path.join(__dirname, 'node_modules');

console.log('Setting up module aliases...');

// Set up module aliases BEFORE any imports
require('module-alias/register');
require('module-alias').addAliases({
  'Common': path.resolve(__dirname, 'Common')
});

console.log('Module aliases configured');

// Configure ts-node with proper options
console.log('Configuring ts-node...');
const tsNode = require('ts-node');
tsNode.register({
  project: path.join(__dirname, 'tsconfig.railway.json'),
  transpileOnly: true,
  compilerOptions: {
    module: 'commonjs',
    moduleResolution: 'node',
    baseUrl: __dirname,
    paths: {
      'Common/*': ['./Common/*']
    }
  }
});

console.log('ts-node configured, starting application...');

// Add error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application with timeout
const startTimeout = setTimeout(() => {
  console.error('Application startup timeout after 60 seconds');
  process.exit(1);
}, 60000);

try {
  console.log('Loading App/Index.ts...');
  require('./App/Index.ts');
  clearTimeout(startTimeout);
  console.log('Application started successfully');
} catch (error) {
  console.error('Failed to start application:', error);
  console.error('Stack:', error.stack);
  clearTimeout(startTimeout);
  process.exit(1);
}