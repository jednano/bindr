/*
 * GET home page.
 */

exports.index = function(req, res) {
	res.render('index', { title: 'Express' });
};


/*
 * POST templates with data for binding.
 */

exports.bind = function(request, response) {
	var templateBinder = require('../lib/templateBinder');
	var boundTemplates = templateBinder.bindTemplates(request, response);
	response.json(boundTemplates);
};
