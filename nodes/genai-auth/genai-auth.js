module.exports = function(RED) {
	function GenaiAuth(config) {
		RED.nodes.createNode(this, config);
		const node = this;
      node.baseURL = config.baseURL;
      node.authType = config.authType;
      node.username = config.username;
      node.password = config.password;
      node.apiKey = config.apiKey;
      node.apiSecret = config.apiSecret;

      node.on('input', function(msg) {
          let authData;
          if (node.authType === "login") {
			  
              authData = {
                  username: node.username,
                  password: node.password
              };
          } else if (node.authType === "apikey") {
              authData = {
                  apiKey: node.apiKey,
                  apiSecret: node.apiSecret
              };
          }

          msg.neo = {
            baseURL : node.baseURL,
            authType : node.authType,
            token : authData
          };

          node.send(msg);
      });
	}
	RED.nodes.registerType("genai-auth", GenaiAuth);
}
