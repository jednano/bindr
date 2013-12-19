///<reference path='../common.ts'/>
///<reference path='../../engines/handlebars.ts'/>
import chai = require('../chai');
var expect = chai.expect;
import Handlebars = require('../../engines/handlebars');
import templateBinder = require('../../lib/templateBinder');
import sinon = require('sinon');


var response: MiniResponse;
var send: SinonSpy;

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
});

describe('Template Binder', () => {

	it('handles basic template binding', done => {
		templateBinder.bindTemplates({
			body: JSON.stringify({
				engine: 'hbs',
				id: 'one',
				source: '{{foo}}',
				data: {
					foo: 'bar',
					bar: 'baz',
					baz: 'qux'
				},
				templates: [
					{
						id: 'two',
						source: '{{bar}}'
					},
					{
						id: 'three',
						source: '{{baz}}'
					}
				]
			})
		}, response).done(json => {
			expect(json.one).to.equal('bar');
			expect(json.two).to.equal('baz');
			expect(json.three).to.equal('qux');
			//expect(send).to.have.been.calledWithExactly(400, 'message');
			done();
		});
	});

});
