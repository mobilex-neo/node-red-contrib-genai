module.exports = function(RED) {
    function GenaiChatNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.chatUrl = config.chatUrl || "https://llama.mobilex.tech/llm/chat";
        node.chatId = config.chatId || ""; // Pode ser configurável

        node.on('input', async function(msg, send, done) {
            try {
                const fetch = (await import('node-fetch')).default;
                // Construindo URL com chatId, se necessário.
                const url = node.chatUrl + "/" + node.chatId;
                const payload = {
                    message: msg.payload.message || ""
                };
                const token = msg.token || config.token;
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
                node.status({ fill: "green", shape: "dot", text: "Chat OK" });
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
    RED.nodes.registerType("genai-chat", GenaiChatNode);
};
