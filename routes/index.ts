///<reference path='../vendor/dt-node/node.d.ts'/>
///<reference path='../vendor/dt-express/express.d.ts'/>
import api = require('../lib/api');
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
	api.bind(request, response).done(json => {
		response.json(json);
	});
}
