module.exports = function (RED) {
    function GenaiIngestNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.ingestUrl = config.ingestUrl || "https://llama.mobilex.tech/llm/ingest";
        node.uuid = config.uuid || ""; // Caso o endpoint necessite de um identificador adicional

        node.on('input', async function(msg, send, done) {
            try {
                const fetch = (await import('node-fetch')).default;
                const FormData = (await import('form-data')).default;
                // Obtém o caminho do arquivo a ser enviado: pode ser definido na configuração ou via msg.filename
                let filePath = config.filePath || msg.filename;
                if (!filePath) {
                    throw new Error("Caminho do arquivo não informado.");
                }
                const fs = require('fs');
                if (!fs.existsSync(filePath)) {
                    throw new Error("Arquivo não encontrado no caminho: " + filePath);
                }
                // Cria o form-data e inclui o stream do arquivo
                const form = new FormData();
                const fileStream = fs.createReadStream(filePath);
                form.append('file', fileStream, { filename: require('path').basename(filePath) });
                
                // Caso haja UUID, adiciona à URL
                let url = node.ingestUrl;
                if (node.uuid) {
                    url = url + "/" + node.uuid;
                }
                
                // Recupera token do msg ou da configuração se necessário
                const token = msg.token || config.token || "";
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                        // O form-data já define o Content-Type com boundary
                    },
                    body: form
                });
                const data = await response.json();
                msg.payload = data;
                node.status({ fill: "green", shape: "dot", text: "Ingest OK" });
                send(msg);
                if (done) { done(); }
            } catch (error) {
                node.status({ fill: "red", shape: "ring", text: "Erro" });
                if (done) {
                    done(error);
                } else {
                    node.error(error, msg);
                }
            }
        });
    }
    RED.nodes.registerType("genai-ingest", GenaiIngestNode);
};
