module.exports = function(RED) {
    function GenaiContextsNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.contextsUrl = config.contextsUrl || "https://llama.mobilex.tech/context";
        
        node.on('input', async function(msg, send, done) {
            try {
                const fetch = (await import('node-fetch')).default;
                const token = msg.token || config.token || "";
                const response = await fetch(node.contextsUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    }
                });
                const data = await response.json();
                msg.payload = data;
                node.status({ fill: "green", shape: "dot", text: "Contexts OK" });
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
    RED.nodes.registerType("genai-contexts", GenaiContextsNode);
};
