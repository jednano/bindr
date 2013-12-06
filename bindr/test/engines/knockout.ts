///<reference path='../common.ts'/>
///<reference path='../../engines/knockout.ts'/>
import _chai = require('../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Knockout = require('../../engines/knockout');
var Knockout = _Knockout.Knockout;


//var engine;
//before(done => {
//	new Knockout().load(e => {
//		engine = e;
//		done();
//	});
//});

//// ReSharper disable WrongExpressionStatement
//describe('Knockout Templating Engine', () => {

//	it('handles basic template binding', done => {
//		var source = '<p data-bind="text: name.first"></p>';
//		var data = { name: { first: 'Jed' } };
//		var expectedResult = '<p data-bind="text: name.first">Jed</p>';

//		engine.compile(source, template => {
//			expect(template(data)).to.equal(expectedResult);
//			done();
//		});
//	});

//});
