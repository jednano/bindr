///<reference path='../vendor/dt-node/node.d.ts'/>
///<reference path='../lib/templateBinder.ts'/>
import templateBinder = require('../lib/templateBinder');


/*
 * GET home page.
 */
export function index(request, response) {
	response.render('index', { title: 'Express' });
}


/*
 * POST templates with data for binding.
 */
export function bind(request, response) {
	var boundTemplates = templateBinder.bindTemplates(request, response);
	response.json(boundTemplates);
}
