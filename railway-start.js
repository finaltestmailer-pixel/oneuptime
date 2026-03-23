// Railway startup script with proper error handling and logging
const path = require('path');

console.log('Starting OneUptime Railway deployment...');
console.log('Node version:', process.version);
console.log('Working directory:', __dirname);

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
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Start the application
try {
  require('./App/Index.ts');
} catch (error) {
  console.error('Failed to start application:', error);
  process.exit(1);
}