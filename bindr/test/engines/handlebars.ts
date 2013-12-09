///<reference path='../common.ts'/>
///<reference path='../../engines/handlebars.ts'/>
import _chai = require('../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Handlebars = require('../../engines/handlebars');
var Handlebars = _Handlebars.Handlebars;


var hb;
before(() => {
	hb = new Handlebars();
});

// ReSharper disable WrongExpressionStatement
describe('Handlebars Templating Engine', () => {

	it('handles basic template binding', done => {
		var source = '<p>{{name.first}}</p>';
		var context = { name: { first: 'Jed' } };
		var expectedResult = '<p>Jed</p>';

		hb.compile(source, template => {
			expect(template(context)).to.equal(expectedResult);
			done();
		});
	});

});
