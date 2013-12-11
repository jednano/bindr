///<reference path='../../common.ts'/>
import _chai = require('../../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Liquid = require('../../../engines/node/liquid');
var Liquid = _Liquid.Liquid;


it('supports node/liquid template engine', done => {
	new Liquid().compile('{{foo}}').done(template => {
		template.render({ foo: 'bar' }).done(html => {
			expect(html).to.equal('bar');
			done();
		});
	});
});
