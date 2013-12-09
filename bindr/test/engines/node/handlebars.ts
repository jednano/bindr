///<reference path='../../common.ts'/>
///<reference path='../../../engines/handlebars.ts'/>
import _chai = require('../../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Handlebars = require('../../../engines/node/handlebars');
var Handlebars = _Handlebars.Handlebars;


it('supports node/handlebars templating engine', done => {
	new Handlebars().compile('{{foo}}', template => {
		expect(template({ foo: 'bar' })).to.equal('bar');
		done();
	});
});
