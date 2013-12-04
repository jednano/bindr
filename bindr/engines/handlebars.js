module.exports = {
	compile: function(source) {
		return {
			done: require('handlebars').compile(source)
		};
	}
};
