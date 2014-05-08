 /*
 	EXT can be .yml, .yaml, .coffee, .json, or .js
 	Configuration files in the config directory are loaded in the following order:
    default.EXT
    hostname.EXT 	- hostname is the $HOST environment variable if set, otherwise the $HOSTNAME environment variable 
    				if set, otherwise the hostname found from require('os').hostname(). Once a hostname is found, 
    				everything from the first period ('.') onwards is removed. For example, abc.example.com becomes abc
    deployment.EXT 	- is the deployment type, found in the $NODE_ENV environment variable. Defaults to 'development'.
    hostname-deployment.EXT - 
    local.EXT
    local-deployment.EXT
    runtime.json - The runtime.json file contains configuration changes made at runtime either manually, or 
    			   by the application setting a configuration value. The location is specified by NODE_CONFIG_RUNTIME_JSON environment variable. 
    			   By default, it is a file called runtime.json in NODE_CONFIG_DIR directory.
    			   Node-config monitors this file and loads any new configurations it detects. 
 */ 
module.exports = {
    travelapp: {
      dbName: "destinationsdb",
      dbHost: "localhost",
      port: 3000,
      dbPort: 27017,
      auto_reconnect: true,
      secret: 'thisismysecret',
      viewDir: '/views',
      publicFolder: 'public',
      logMode: 'dev', //  'default', 'short', 'tiny', 'dev' 
      userDbUrl: 'mongodb://localhost:27017/userDb'
    }
  }
