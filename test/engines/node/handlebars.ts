﻿///<reference path='../../common.ts'/>
import chai = require('chai');
var expect = chai.expect;
import _Handlebars = require('../../../engines/node/handlebars');
var Handlebars = _Handlebars.Handlebars;


it('supports node/handlebars template engine', done => {
	new Handlebars().compile('{{foo}}').done(template => {
		template.render({ foo: 'bar' }).done(html => {
			expect(html).to.equal('bar');
			done();
		});
	});
});
