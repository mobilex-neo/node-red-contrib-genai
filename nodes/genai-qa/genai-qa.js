module.exports = function(RED) {
    function GenaiQaNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.askUrl = config.askUrl || "https://llama.mobilex.tech/llm/ask";
        node.contextId = config.contextId || "";
        
        node.on('input', async function(msg, send, done) {
            try {
                const fetch = (await import('node-fetch')).default;
                // Constrói a URL com o context_id, se informado na configuração
                let url = node.askUrl;
                if (node.contextId) {
                    url = url + "/" + node.contextId;
                }
                // Monta o payload, podendo sobrescrever com valores vindos de msg.payload
                const payload = {
                    context_id: node.contextId || msg.context_id,
                    prompt: (msg.payload && msg.payload.prompt) || config.prompt || "",
                    documents: (msg.payload && msg.payload.documents) || []
                };
                const token = msg.token || config.token || "";
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();
                msg.payload = data;
                node.status({ fill: "green", shape: "dot", text: "Ask OK" });
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
    RED.nodes.registerType("genai-qa", GenaiQaNode);
};
