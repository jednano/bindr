///<reference path='../../../common.ts'/>
///<reference path='../../../../engines/volusion/node/handlebars.ts'/>
import _chai = require('../../../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Handlebars = require('../../../../engines/volusion/node/handlebars');
var Handlebars = _Handlebars.Handlebars;


var hb;
before(() => {
	hb = new Handlebars();
});

// ReSharper disable WrongExpressionStatement
describe('Handlebars Templating Engine', () => {

	it('renders link_to', done => {
		var context = { posts: [{ url: '/hello-world', body: 'Hello World!' }] };
		var source = "<ul>{{#posts}}<li>{{{link_to}}}</li>{{/posts}}</ul>";
		var expectedResult = '<ul><li><a href="/hello-world">Hello World!</a></li></ul>';

		hb.compile(source, template => {
			expect(template(context)).to.equal(expectedResult);
			done();
		});
	});

});
