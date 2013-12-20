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
			body: {
				engine: 'hbs',
				id: 'one',
				source: '{{foo}}',
				data: {
					foo: 'bar'
				}
			}
		}, response).done(hash => {
			expect(hash.one).to.equal('bar');
			done();
		});
	});

	it('handles source overrides', done => {
		templateBinder.bindTemplates({
			body: {
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
			}
		}, response).done(hash => {
			expect(hash.one).to.equal('bar');
			expect(hash.two).to.equal('baz');
			expect(hash.three).to.equal('qux');
			done();
		});
	});

	it('handles engine overrides', done => {
		templateBinder.bindTemplates({
			body: {
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
						engine: 'ko',
						source: '<p data-bind="text:bar"></p>'
					},
					{
						id: 'three',
						engine: 'node/liquid',
						source: '{{baz}}'
					}
				]
			}
		}, response).done(hash => {
			expect(hash.one).to.equal('bar');
			expect(hash.two).to.equal('<p data-bind="text:bar">baz</p>');
			expect(hash.three).to.equal('qux');
			done();
		});
	});

	it('handles recursion', done => {
		templateBinder.bindTemplates({
			body: {
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
						source: '{{bar}}',
						templates: [
							{
								id: 'three',
								source: '{{baz}}'
							}
						]
					}
				]
			}
		}, response).done(hash => {
			expect(hash.one).to.equal('bar');
			expect(hash.two).to.equal('baz');
			expect(hash.three).to.equal('qux');
			done();
		});
	});

	it('fails if no id provided', done => {
		templateBinder.bindTemplates({
			body: {
				engine: 'hbs',
				source: '{{foo}}',
				data: {
					foo: 'bar'
				}
			}
		}, response).fail(message => {
			var expectedMessage = 'missing required template id';
			expect(message).to.equal(expectedMessage);
			expect(send).to.have.been.calledWithExactly(400, expectedMessage);
			done();
		});
	});

	it('fails if no source provided', done => {
		templateBinder.bindTemplates({
			body: {
				id: 'one',
				engine: 'hbs',
				data: {
					foo: 'bar'
				}
			}
		}, response).fail(message => {
			var expectedMessage = 'missing required template source';
			expect(message).to.equal(expectedMessage);
			expect(send).to.have.been.calledWithExactly(400, expectedMessage);
			done();
		});
	});

	it('fails if no engine provided', done => {
		templateBinder.bindTemplates({
			body: {
				id: 'one',
				source: '{{foo}}',
				data: {
					foo: 'bar'
				}
			}
		}, response).fail(message => {
			var expectedMessage = 'unspecified template engine';
			expect(message).to.equal(expectedMessage);
			expect(send).to.have.been.calledWithExactly(400, expectedMessage);
			done();
		});
	});

	it('fails if engine provided is unsupported');

	//it('fails if engine provided is unsupported', done => {
	//	templateBinder.bindTemplates({
	//		body: {
	//			id: 'one',
	//			engine: 'never-create-an-engine-with-this-ridiculous-name',
	//			source: '{{foo}}',
	//			data: {
	//				foo: 'bar'
	//			}
	//		}
	//	}, response).fail(message => {
	//		var expectedMessage = 'unsupported template engine';
	//		expect(message).to.equal(expectedMessage);
	//		expect(send).to.have.been.calledWithExactly(400, expectedMessage);
	//		done();
	//	});
	//});

});
