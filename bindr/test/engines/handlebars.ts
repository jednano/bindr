///<reference path='../common.ts'/>
///<reference path='../../engines/knockout.ts'/>
import _chai = require('../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Handlebars = require('../../engines/handlebars');
var Handlebars = _Handlebars.Handlebars;


it('supports handlebars templating engine', done => {
	new Handlebars().compile('{{foo}}', template => {
		expect(template({ foo: 'bar' })).to.equal('bar');
		done();
	});
});
