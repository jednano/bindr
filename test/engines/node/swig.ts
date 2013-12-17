///<reference path='../../common.ts'/>
import chai = require('chai');
var expect = chai.expect;
import _Swig = require('../../../engines/node/swig');
var Swig = _Swig.Swig;


it('supports node/swig template engine', done => {
	new Swig().compile('{{ foo }}').done(template => {
		template.render({ locals: { foo: 'bar' } }).done(html => {
			expect(html).to.equal('bar');
			done();
		});
	});
});
