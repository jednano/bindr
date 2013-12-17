///<reference path='../../common.ts'/>
import chai = require('chai');
var expect = chai.expect;
import Liquid = require('../../../engines/node/liquid');


it('supports node/liquid template engine', done => {
	new Liquid().compile('{{foo}}').done(template => {
		template.render({ foo: 'bar' }).done(html => {
			expect(html).to.equal('bar');
			done();
		});
	});
});
