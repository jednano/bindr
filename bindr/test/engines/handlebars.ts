///<reference path='../common.ts'/>
///<reference path='../../engines/handlebars.ts'/>
import _chai = require('../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Handlebars = require('../../engines/handlebars');
var Handlebars = _Handlebars.Handlebars;


var engine;
before(done => {
	new Handlebars().load(e => {
		engine = e;
		done();
	});
});

// ReSharper disable WrongExpressionStatement
describe('Handlebars Templating Engine', () => {
	
	it('handles basic template binding', done => {
		var source = '<p>{{name.first}}</p>';
		var data = { name: { first: 'Jed' } };
		var expectedResult = '<p>Jed</p>';

		engine.compile(source, template => {
			expect(template(data)).to.equal(expectedResult);
			done();
		});
	});

});
