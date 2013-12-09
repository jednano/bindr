///<reference path='../../../common.ts'/>
///<reference path='../../../../engines/volusion/node/handlebars.ts'/>
import _chai = require('../../../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Handlebars = require('../../../../engines/volusion/node/handlebars');
var Handlebars = _Handlebars.Handlebars;


describe('volusion/node/handlebars templating engine', () => {

	var hb;
	before(() => {
		hb = new Handlebars();
	});

	it('supports link_to helper', done => {
		var context = { url: '#foo', body: 'bar' };
		var source = '{{{link_to}}}';
		var expectedResult = '<a href="#foo">bar</a>';

		hb.compile(source, template => {
			expect(template(context)).to.equal(expectedResult);
			done();
		});
	});
});
