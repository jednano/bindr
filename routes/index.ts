///<reference path='../vendor/dt-node/node.d.ts'/>
///<reference path='../vendor/dt-express/express.d.ts'/>
///<reference path='../lib/templateBinder.ts'/>
import templateBinder = require('../lib/templateBinder');
import express = require('express');


/*
 * GET home page.
 */
export function index(request: express.Request, response: express.Response) {
	response.render('index', { title: 'Express' });
}


/*
 * POST templates with data for binding.
 */
export function bind(request: express.Request, response: express.Response) {
	templateBinder.bindTemplates(request, response).done(json => {
		response.json(json);
	});
}
