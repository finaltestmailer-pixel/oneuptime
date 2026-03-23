// Railway startup script with module aliases
const moduleAlias = require('module-alias');

// Set up module aliases for Common modules
moduleAlias.addAliases({
  'Common': __dirname + '/Common'
});

// Register the aliases
moduleAlias();

// Now start the application with ts-node
require('ts-node/register');
require('./App/Index.ts');