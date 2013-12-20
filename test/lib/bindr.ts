///<reference path='../common.ts'/>
///<reference path='../../engines/handlebars.ts'/>
import chai = require('../chai');
var expect = chai.expect;
import Handlebars = require('../../engines/handlebars');
import bindr = require('../../lib/bindr');
import sinon = require('sinon');


var response: MiniResponse;
var send: SinonSpy;

export class MiniResponse implements bindr.Response {
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

describe('bindr.bind', () => {

	it('handles basic template binding', done => {
		bindr.bind({
			body: {
				engine: 'hbs',
				id: 'one',
				source: '{{foo}}',
				data: {
					foo: 'bar'
				}
			}
		}, response).done(result => {
			expect(result.one).to.equal('bar');
			done();
		});
	});

	it('handles source overrides', done => {
		bindr.bind({
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
		}, response).done(result => {
			expect(result.one).to.equal('bar');
			expect(result.two).to.equal('baz');
			expect(result.three).to.equal('qux');
			done();
		});
	});

	it('handles engine overrides', done => {
		bindr.bind({
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
		}, response).done(result => {
			expect(result.one).to.equal('bar');
			expect(result.two).to.equal('<p data-bind="text:bar">baz</p>');
			expect(result.three).to.equal('qux');
			done();
		});
	});

	it('handles recursion', done => {
		bindr.bind({
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
		}, response).done(result => {
			expect(result.one).to.equal('bar');
			expect(result.two).to.equal('baz');
			expect(result.three).to.equal('qux');
			done();
		});
	});

	it('fails if no id provided', done => {
		bindr.bind({
			body: {
				engine: 'hbs',
				source: '{{foo}}',
				data: {
					foo: 'bar'
				}
			}
		}, response).fail(message => {
			expect400(message, 'missing required template id');
			done();
		});
	});

	it('fails if no source provided', done => {
		bindr.bind({
			body: {
				id: 'one',
				engine: 'hbs',
				data: {
					foo: 'bar'
				}
			}
		}, response).fail(message => {
			expect400(message, 'missing required template source');
			done();
		});
	});

	it('fails if no engine provided', done => {
		bindr.bind({
			body: {
				id: 'one',
				source: '{{foo}}',
				data: {
					foo: 'bar'
				}
			}
		}, response).fail(message => {
			expect400(message, 'unspecified template engine');
			done();
		});
	});

	it('fails if engine provided is unsupported', done => {
		bindr.bind({
			body: {
				id: 'one',
				engine: 'never-create-an-engine-with-this-ridiculous-name',
				source: 'foo'
			}
		}, response).fail(message => {
			expect400(message, 'unsupported template engine');
			done();
		});
	});

});

function expect400(message, expectedMessage) {
	expect(message).to.equal(expectedMessage);
	expect(send).to.have.been.calledWithExactly(400, expectedMessage);
}
