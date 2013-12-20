# bindr

Bindr is a [Node.js][] service that handles template binding and nothing else.
When used in tandem with a server-side technology such as [ASP.NET][], [PHP][],
[Ruby on Rails][] or even [Express][], bindr enables you to handle template
binding on both the back and the front end.

[![Build Status][]](http://travis-ci.org/jedmao/bindr)


## What is template binding?

Also known as data binding, template binding is the process of merging your UI
template with your data. For example, you might have a Handlebars template that
looks like this:

```hbs
<ul>
  {{#each authors}}
    <li>{{last}}, {{first}}</li>
  {{/each}}
</ul>
```

With JSON data like this:
```json
{
   "authors":[
      {
         "first":"William",
         "last":"Shakespeare"
      },
      {
         "first":"Agatha",
         "last":"Christie"
      },
      {
         "first":"Barbara",
         "last":"Cartland"
      }
   ]
}
```

After template binding, the result would be the following HTML:

```html
<ul>
  <li>Shakespeare, William</li>
  <li>Christie, Agatha</li>
  <li>Cartland, Barbara</li>
</ul>
```


## Why use bindr?

Using the exact same JavaScript templating library on both the back and the
front end enables you to do things you couldn't necessarily do before.


### Proper separation of concerns

Surely, we can all agree that your UI and your data do not belong in the same
file. This is pretty standard on the back end, but more often than not, the
template engine you use on the back end isn't available on the front end. If
you're using a separate template engine on the front end then you have to make
decisions about which templates you want to run on the front end vs. the back
end and use the appropriate templating language.

Even if somebody made a JavaScript port of your favorite template engine or
vice versa, these are two separate code bases. You run the risk of discrepancies
between the two. What if one works perfectly well, but the other has a bug?


### Eliminate duplication of efforts

A new product specification comes in that requires you to move some logic from
the back to the front end or vice versa. This is a maintenance nightmare! Not
with bindr! Bindr enables you to write your template once in your favorite
JavaScript template engine and use it on the front or back end,
interchangeably. The choice is yours.


### Initial page load performance

Some template engine syntaxes like [Knockout][] and [AngularJS][] are valid
HTML out of the box. This allows the UI to render even before the application is
bootstrapped. Other engines, however, like the popular [Handlebars][], are
not valid HTML. This is no knock on Handlebars. It's actually my preferred
template engine at the moment. Handlebars, however, needs to wait until the
template binding is complete before the UI can render its contents. If you're
serving a [Single-page application][] (SPA) then your whole page would be a
template with more templates inside of it, making JavaScript solely responsible
for not only binding, but building out the entire DOM contents! This can be a
huge performance hit, especially where lists are concerned and especially on
limited CPUs like mobile devices. JavaScript was never intended to do this type
of heavy lifting and this is what bindr aims to solve.

Bindr will allow you to do the initial page load binding on the server side,
which should be cached. Since the cached result is sent to the client, the bindr
service would be skipped entirely until the cache is invalidated. In theory,
this sounds great, but the application still needs to be bootstrapped. In a way,
the application needs to be hijacked without tearing down or re-rendering its
contents. This is a problem that has yet to be solved, but it can't be solved
until bindr is implemented as a first step.


## How do I use bindr?

First, you'll need a [Node.js][] server.


### Installation

| Bash                        | Windows Command Prompt          |
| ----------------------------| ------------------------------- |
| $ npm install express-bindr | C:\\> npm install express-bindr |
| $ ./install                 | C:\\> sh install                |


### Library Usage

```node
var bindr = require('express-bindr');
// coming soon...
```


### Front-end Usage

```js
$.post('http://www.example.com/bindr', {
    engine: 'node/hbs',
    data: {
        first: 'William',
        last: 'Shakespeare'
    },
    templates: [
        {
            id: 'one',
            source: '<p>Hello, {{first}} {{last}}!</p>'
        }
    ]
}, function(templates) {
    $('body').html(templates.one); // <p>Hello, William Shakespeare!</p>
});
```


### engine

The engine must be a supported engine in the [engines folder][] of this project.
Notice that some of these engines are just aliases to other engines. For
example, ko points to knockout.

Engines in the root of this folder run on top of [jsdom][], which means the
actual JavaScript library is being loaded into a fake browser of sorts. In this
way, you can expect 100% consistency between template binding on the back vs.
the front end. Understand, however, that these engines perform slightly slower
than Node-native implementations.

The Node-native libraries are namespaced in the [engines/node folder][].

Other namespaces are reserved for perhaps company-specific helpers built on top
of the core libraries. Feel free to fork this project and add your own.

Supported template engines are listed as follows:

| Engine Key       | Template Engine               |
| ---------------- | ----------------------------- |
| handlebars       | [Handlebars][]                |
| hbs              | [Handlebars][] alias          |
| knockout         | [Knockout][]                  |
| ko               | [Knockout][] alias            |
| node/handlebars  | [Node Handlebars][]           |
| node/hbs         | [Node Handlebars][] alias     |
| node/liquid      | [liquid-node][]               |
| node/swig        | [Node Swig][]                 |


### id

The id is the key you wish to associate with the resulting, bound HTML. Every
bound template must have a separate id for hash table lookup. The service
response will be in the following JSON format:

```json
{
    "one": "<p>Hello, William Shakespeare!</p>",
    "two": "<p>Hello, Agatha Christie!</p>",
    "three": "<p>Hello, Barbara Cartland!</p>"
}
```


### source

The source is the template engine syntax.


### data

The data you wish to be bound to the template.


### templates

You may provide more sub-templates that inherit the engine, source and data.
You may have templates and more templates within templates, as deep as you
want. This allows you to specify data once and reuse that data for multiple
sources. If you provide more data, it will simply extend the parent data.


## Contributing

Please refer to the [Contributing doc][] for more information.


## License

MIT


[Build Status]: https://secure.travis-ci.org/jedmao/bindr.png?branch=master
[Node.js]: http://nodejs.org/
[ASP.NET]: http://www.asp.net/
[PHP]: http://www.php.net/
[Ruby on Rails]: http://rubyonrails.org/
[Express]: http://expressjs.com/
[Knockout]: http://knockoutjs.com/
[AngularJS]: http://angularjs.org/
[Handlebars]: http://handlebarsjs.com/
[Single-page application]: http://en.wikipedia.org/wiki/Single-page_application
[engines folder]: engines
[engines/node folder]: engines/node
[jsdom]: https://github.com/tmpvar/jsdom
[Node Handlebars]: https://npmjs.org/package/handlebars
[liquid-node]: https://npmjs.org/package/liquid-node
[Node Swig]: https://npmjs.org/package/swig
[Contributing doc]: CONTRIBUTING.md
