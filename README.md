[![Build Status][]](http://travis-ci.org/jedmao/bindr)

# bindr
Bindr is a [node.js][] service that handles template binding and nothing else.
When used in tandem with a server-side technology such as [ASP.NET][], [PHP][],
[Ruby on Rails][] or even [Express][], bindr enables you to handle template
binding on both the back and the front end.

## What is template binding?
Also known as data binding, template binding is the process of merging your UI
template with your data. For example, you might have a Handlebars template that
looks like this:

```hbs
<ul>
  {{#each authors}}
    <li>{{lastName}}, {{firstName}}</li>
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

## Proper separation of concerns
Your UI and your data should not be in the same file. This is pretty standard
on the back end, but maybe your templating engine you use on the back end isn't
available on the front end. Even if somebody made a JavaScript port of your
favorite templating engine or vice versa, you run the risk of discrepancies
between the two. What if one works perfectly well, but the other has a bug? Now
you're writing in two different templating languages and you have to make
decisions about which templates you want to run on the front vs. the back end.

## Eliminate duplication of efforts
A new product specification comes in that requires you to move some logic from
the back to the front end or vice versa. This is a maintenance nightmare! Not
with bindr! Bindr enables you to write your template once in your favorite
JavaScript templating engine and use it on the front or back end,
interchangeably. The choice is yours.

## Initial page load performance
[Single-page application][] (SPA) frameworks like [Ember.js][] and [AngularJS][]
are all the rage now, and for good reason! One problem with Ember, however, is
that it has the potential to cause some major performance hits when your
application is written in such a way that JavaScript is doing all the heavy
lifting for creating DOM elements, especially where [lists are concerned][].
This appears to be an [issue with garbage collection][] that has yet to be
fixed, perhaps with [HTMLBars][].

Bindr aims to solve this problem with templating engines that are not already
valid HTML (e.g., [Handlebars.js][]).


[Build Status]: https://secure.travis-ci.org/jedmao/bindr.png?branch=master
[node.js]: http://nodejs.org/
[ASP.NET]: http://www.asp.net/
[PHP]: http://www.php.net/
[Ruby on Rails]: http://rubyonrails.org/
[Express]: http://expressjs.com/
[Single-page application]: http://en.wikipedia.org/wiki/Single-page_application
[Ember.js]: http://emberjs.com/
[AngularJS]: http://angularjs.org/
[lists are concerned]: http://discuss.emberjs.com/t/ember-is-very-slow-at-rendering-lists/1643
[issue with garbage collection]: http://discuss.emberjs.com/t/view-rendering-performance-ember-v-angular/1897
[HTMLBars]: https://github.com/tildeio/htmlbars
[Handlebars.js]: http://handlebarsjs.com/
