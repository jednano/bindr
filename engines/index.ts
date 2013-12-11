///<reference path='../vendor/dt-node/node.d.ts'/>


var engines = [];

[
	'handlebars',
	'hbs',
	'knockout',
	'ko',
	'node/handlebars',
	'node/hbs',
	'node/liquid',
	'node/swig',
	'volusion/node/handlebars',
	'volusion/node/hbs'
].forEach(engine => {
	engines.push(require('./' + engine));
});

export = engines;
