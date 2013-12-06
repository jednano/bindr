///<reference path='../../common.ts'/>
///<reference path='../../../engines/volusion/handlebars.ts'/>
import _chai = require('../../chai');
var expect: chai.ExpectStatic = _chai.expect;
import _Handlebars = require('../../../engines/volusion/handlebars');
var Handlebars = _Handlebars.Handlebars;


var engine;
before(done => {
	new Handlebars().load(e => {
		engine = e;
		done();
	});
});

// ReSharper disable WrongExpressionStatement
describe('Handlebars Templating Engine', () => {

	it('renders link_to', done => {
		var context = { posts: [{ url: '/hello-world', body: 'Hello World!' }] };
		var source = "<ul>{{#posts}}<li>{{{link_to}}}</li>{{/posts}}</ul>";
		var expectedResult = '<ul><li><a href="/hello-world">Hello World!</a></li></ul>';

		engine.compile(source, template => {
			expect(template(context)).to.equal(expectedResult);
			done();
		});
	});

});
