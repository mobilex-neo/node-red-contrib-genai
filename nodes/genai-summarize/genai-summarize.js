module.exports = function (RED) {
    function GenaiSummarizeNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.summarizeUrl = config.summarizeUrl || "https://llama.mobilex.tech/llm/summarize";
        node.uuid = config.uuid || ""; // Pode ser utilizado para indicar o documento ou instância

        node.on('input', async function(msg, send, done) {
            try {
                const fetch = (await import('node-fetch')).default;
                const FormData = (await import('form-data')).default;
                let filePath = config.filePath || msg.filename;
                if (!filePath) {
                    throw new Error("Caminho do arquivo não informado.");
                }
                const fs = require('fs');
                if (!fs.existsSync(filePath)) {
                    throw new Error("Arquivo não encontrado no caminho: " + filePath);
                }
                const form = new FormData();
                const fileStream = fs.createReadStream(filePath);
                form.append('file', fileStream, { filename: require('path').basename(filePath) });
                
                let url = node.summarizeUrl;
                if (node.uuid) {
                    url = url + "/" + node.uuid;
                }
                
                const token = msg.token || config.token || "";
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: form
                });
                const data = await response.json();
                msg.payload = data;
                node.status({ fill: "green", shape: "dot", text: "Summarize OK" });
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
    RED.nodes.registerType("genai-summarize", GenaiSummarizeNode);
};
