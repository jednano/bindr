///<reference path='../common.ts'/>
///<reference path='../../engines/handlebars.ts'/>
import chai = require('../chai');
var expect = chai.expect;
import Handlebars = require('../../engines/handlebars');
import templateBinder = require('../../lib/templateBinder');
import sinon = require('sinon');


var response: MiniResponse;
var send: SinonSpy;
var json: SinonSpy;

export class MiniResponse implements templateBinder.Response {
	send(statusOrBody: any, body?: any): MiniResponse {
		return this;
	}
	json(statusOrBody: any, body?: any): MiniResponse {
		return this;
	}
}

beforeEach(() => {
	response = new MiniResponse();
	send = sinon.spy(response, 'send');
	json = sinon.spy(response, 'json');
});

describe('Template Binder', () => {

	it('handles basic template binding', done => {
		var boundTemplates = templateBinder.bindTemplates({
			body: 'foo'
		}, response);
		response.json(boundTemplates);
		done();
	});

});
