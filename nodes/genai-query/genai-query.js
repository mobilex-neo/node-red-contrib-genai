const GenaiClient = require('../../lib/genai-client');

module.exports = function (RED) {
  function GenaiQuery(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on('input', async function (msg) {
      const context = config.context || msg.context;
      const filters = msg.filters || {};
      const token = msg.neo?.token;
      const baseURL = config.baseURL || msg.neo?.baseURL;

      if (!context || !baseURL || !token) {
        node.error("Campos obrigatórios ausentes: context, token ou baseURL.");
        return;
      }

      try {
        const client = new GenaiClient(baseURL, token);
        const result = await client.query(context, filters);
        msg.payload = result;
        node.send(msg);
      } catch (err) {
        node.error("Erro ao consultar documentos: " + err.message);
      }
    });
  }

  RED.nodes.registerType("genai-query", GenaiQuery);
};