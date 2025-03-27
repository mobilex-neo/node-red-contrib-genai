module.exports = function(RED){
	function GenaiContext(config){
		var node = this;
		RED.nodes.createNode(this,config);
		node.on('input',function(msg){
		});
	};
	RED.nodes.registerType("genai-context",GenaiContext);
};