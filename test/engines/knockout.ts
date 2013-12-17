///<reference path='../common.ts'/>
///<reference path='../../engines/knockout.ts'/>
import chai = require('chai');
var expect = chai.expect;
import Knockout = require('../../engines/knockout');


it('supports knockout template engine', done => {
	var source = '<p data-bind="text: foo"></p>';
	var context = { foo: 'bar' };
	var expectedResult = '<p data-bind="text: foo">bar</p>';

	new Knockout().compile(source).done(template => {
		template.render(context).done(html => {
			expect(html).to.equal(expectedResult);
			done();
		});
	});
});
