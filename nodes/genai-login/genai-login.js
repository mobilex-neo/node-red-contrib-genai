module.exports = function(RED) {
    function LoginNode(config) {
        RED.nodes.createNode(this, config);
        var node = this;
        node.username = config.username;
        node.password = config.password;
        node.loginUrl = config.loginUrl || "https://llama.mobilex.tech/login";

        node.on('input', async function(msg, send, done) {
            // Cria o payload para login
            const payload = {
                username: node.username,
                password: node.password
            };

            try {
                // Utilizando fetch para chamar o endpoint
                const fetch = (await import('node-fetch')).default;
                const response = await fetch(node.loginUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                const data = await response.json();

                // Armazena o token no msg ou no contexto
                msg.token = data.token;
                node.status({ fill: "green", shape: "dot", text: "Login OK" });
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
    RED.nodes.registerType("login", LoginNode);
};
