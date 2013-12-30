///<reference path='../common.ts'/>
import chai = require('chai');
var expect = chai.expect;
import Handlebars = require('../../engines/handlebars');
import Hbs = require('../../engines/hbs');


it('supports hbs alias', () => {
	expect(new Hbs()).to.be.an.instanceOf(Handlebars);
});

it('supports handlebars template engine', done => {
	new Handlebars().compile('{{foo}}').done(template => {
		template.render({ foo: 'bar' }).done(html => {
			expect(html).to.equal('bar');
			done();
		});
	});
});
