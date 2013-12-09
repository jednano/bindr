///<reference path='../../common.ts'/>
import _chai = require('../../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Swig = require('../../../engines/node/swig');
var Swig = _Swig.Swig;


it('supports node/swig templating engine', done => {
	new Swig().compile('{{ foo }}', template => {
		expect(template({locals: { foo: 'bar' }})).to.equal('bar');
		done();
	});
});
