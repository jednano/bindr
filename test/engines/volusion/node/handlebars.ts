///<reference path='../../../common.ts'/>
///<reference path='../../../../engines/volusion/node/handlebars.ts'/>
import _chai = require('../../../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Handlebars = require('../../../../engines/volusion/node/handlebars');
var Handlebars = _Handlebars.Handlebars;


describe('volusion/node/handlebars template engine', () => {

	var hb;
	before(() => {
		hb = new Handlebars();
	});

	it('supports link_to helper', done => {
		var context = { url: '#foo', body: 'bar' };
		var source = '{{{link_to}}}';
		var expectedResult = '<a href="#foo">bar</a>';

		hb.compile(source).done(template => {
			template.render(context).done(html => {
				expect(html).to.equal(expectedResult);
			});
			done();
		});
	});
});
