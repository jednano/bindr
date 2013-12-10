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
templating engine you use on the back end isn't available on the front end. If
you're using a separate templating engine on the front end then you have to make
decisions about which templates you want to run on the front end vs. the back
end and use the appropriate templating language.

Even if somebody made a JavaScript port of your favorite templating engine or
vice versa, these are two separate code bases. You run the risk of discrepancies
between the two. What if one works perfectly well, but the other has a bug?


### Eliminate duplication of efforts

A new product specification comes in that requires you to move some logic from
the back to the front end or vice versa. This is a maintenance nightmare! Not
with bindr! Bindr enables you to write your template once in your favorite
JavaScript templating engine and use it on the front or back end,
interchangeably. The choice is yours.


### Initial page load performance

Some templating engine syntaxes like [Knockout][] and [AngularJS][] are valid
HTML out of the box. This allows the UI to render even before the application is
bootstrapped. Other engines, however, like the popular [Handlebars.js][], are
not valid HTML. This is no knock on Handlebars. It's actually my preferred
templating engine at the moment. Handlebars, however, needs to wait until the
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
until bindr is implemented.


## How do I use bindr?

First, you'll need a [Node.js][] server.


### Installation

```bash
$ npm install express-bindr
$ sh install
```

### Usage

```js
var bindr = require('express-bindr');


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
}, function(html) {
    $('body').html(html); // <p>Hello, William Shakespeare!</p>
});
```


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
[Handlebars.js]: http://handlebarsjs.com/
[Single-page application]: http://en.wikipedia.org/wiki/Single-page_application
[Contributing doc]: Contributing.md
