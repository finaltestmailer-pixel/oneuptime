// Railway startup script with proper module resolution
const path = require('path');

// Set up environment variables
process.env.TS_NODE_PROJECT = path.join(__dirname, 'tsconfig.railway.json');
process.env.NODE_PATH = path.join(__dirname, 'node_modules');

// Set up module aliases BEFORE any imports
require('module-alias/register');
require('module-alias').addAliases({
  'Common': path.resolve(__dirname, 'Common')
});

// Configure ts-node with proper options
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

// Start the application
require('./App/Index.ts');