# Contributing

The source files in this project are written in [TypeScript][]. For
[TypeScript][] development, [Visual Studio][] is hands down the best tool,
giving you a great [Plugin] with intelligent code completion, known as
[Intellisense][].

If, however, you don't have a Windows OS available to you or you prefer to use
something like [Sublime Text][], you can at least get some syntax highlighting
by installing [Sublime Package Control][] and then the TypeScript Compiler.

Now you're ready for TypeScript development.

If you wish to provide an additional template engine, you'll want to consider
adding one or both of the two possible engine types.


## JavaScript Library Template Engine

A JavaScript engine normally runs in the browser, but we'll need it to run in
Node. To get started, you'll want to install the JavaScript library as a
[Bower][] dependency. Assuming the library is listed as `foo` in
[Bower's registry][], type the following in your shell:

```sh
$ bower install foo --save
```

This installs the js files in the [vendor directory][] and adds it to the
[bower.json file][] automatically.


### Install Definition File

Note: This is *not* required, but it *is* a nice-to-have.

Browse the [DefinitelyTyped][] repo for an existing TypeScript definition file
for your template engine library. If it exists, there's a chance it will also
exist in [Bower's registry][]. TypeScript definition files are listed in
[Bower's registry][] with a `dt-` prefix. To install `dt-foo`, type:

```sh
$ bower install dt-foo --save-dev
```

Since the definition file is only needed for development, you'll save this
dependency as a dev dependency with `--save-dev`. If it doesn't already exist,
you can create and publish your own `dt-foo` repo. Refer to [Bower][]
documentation for instructions or look at an existing `dt-` repo as a
reference.


### Create a new TypeScript file

Now, you can get started with your Engine class. You can look at existing
engines in the [engines folder][], but this guide will help you get started.

Add `foo.ts` to the [engines folder][]. The first line of this file should
point to your definition file.

```ts
///<reference path='../vendor/dt-foo/foo.d.ts'/>
```

[TypeScript][] now has information, not just about the methods available to you
in a library, but also the argument types you can pass-in to those methods.
This allows faster development with less documentation lookups.

Next, you'll want to handle your imports:

```ts
import Engine = require('../lib/Engine');
import Promises = require('../lib/Promises');
var Deferred = Promises.Deferred;
```

Your Foo class will be extending the Engine class. The Promises module provides
the classes required to follow the Promise pattern. Here's how you extend the
Engine class:

```ts
class Foo extends Engine {
    constructor(scriptPath?: string) {
        super(scriptPath || './vendor/foo/foo.js');
    }
}

export = Foo;
```

The constructor here allows one to extend your Foo class and override the
script path if they need to.



### Write a failing test

Now that your class is setup, you'll want to write a failing test. You can add
a ts file at `test/engines/foo.ts` and set it up like this:

```ts
///<reference path='../common.ts'/>
import chai = require('chai');
var expect = chai.expect;
import Foo = require('../../engines/foo');


it('supports foo template engine', done => {
    new Foo().compile('{{foo}}').done(template => {
        template.render({ foo: 'bar' }).done(html => {
            expect(html).to.equal('bar');
            done();
        });
    });
});
```

Save the file and run your tests. You can do this with `npm test` or you can
start a watch with `./watch` or `sh watch`, depending on your shell. This
will keep track of any .ts file changes, clean, rebuild and rerun the tests.

This test will fail and rightly so. You haven't overridden your base class'
compile method. If you don't do this, a `Not Implemented` error will be
thrown. Go back to your engine file and add the following:

```ts
class Foo extends Engine {
    compile(source: string): Promise.Promise {
        var compiling = new Deferred();
        setTimeout(() => {
            this.load().done((window: any) => {
                var foo = <FooStatic>window.Foo;
                var render = foo.compile(source);
                compiling.resolve({
                    render: this.onRender.bind(this, render)
                });
            });
        });
        return compiling.promise;
    }

    private onRender(render: Function, context: {}): Promises.Promise {
        var rendering = new Deferred();
        setTimeout(() => {
            rendering.resolve(render(context));
        });
        return rendering.promise;
    }
}

export = Foo;
```

This might look confusing, but let me break it down for you:


### compile

```ts
compile(source: string): Promises.Promise {
    var compiling = new Deferred();
    setTimeout(() => {
        // time consuming operations
    });
    return compiling.promise;
}
```

The public compile method is what starts everything. As you can see, it returns
a Promise. It is important that Node scripts are non-blocking, so we return a
promise immediately and defer all time consuming operations inside of a
`setTimeout`. Here's what we put inside the `setTimeout`:


### load

```ts
this.load().done(window: any) => {
    var foo = <FooStatic>window.Foo;
    // more code
});
```

Since Foo is a native JavaScript library, we need to load the DOM first to gain
access to it. To gain intellisense for the `dt-foo` TypeScript definition file,
we cast `window.Foo` to `FooStatic`. Here's what happens next:


### render

```ts
var render = foo.compile(source);
compiling.resolve({
    render: this.onRender.bind(this, render)
});
```

In this case, the Foo library has a compile method that returns a function that
handles template rendering. Now that this function is available, we need to
resolve the deferred compiling variable with it. Unfortunately, this render
function doesn't itself return a promise. This means we need to create our own
function that does; thus, the private `onRender` method. We can't just provide
the `onRender` method, however. We must bind it with the current class instance
and pass-in the `render` method we've just created.


### onRender

```ts
private onRender(render: Function, context: {}): Promises.Promise {
    var rendering = new Deferred();
    setTimeout(() => {
        // time consuming operations
    });
    return rendering.promise;
}
```

As you can see, the `onRender` method follows the same format of the `compile`
method. It immediately returns a promise and defers time consuming operations
inside of a `setTimeout`. The `render` method has been passed in, as stated
before, and the `context` will be provided in the implementation. This is the
data one wishes to bind with the template. The rest is simple:

```ts
rendering.resolve(render(context));
```

Finally, we're resolving the deferred rendering var with the result of the
render function. Since the function is library code and out of our control, it
could be a time consuming operation. This is, again, why it's so important to
immediately return a promise and keep this Node engine non-blocking.

Run the tests again and you should see the failing test now passes.


## Node Library Template Engine

These template engines run on top of Node; thus, do not require the DOM to
operate. As such, the code is slightly less complicated. Please refer to
existing engines under the [engines/node][] namespace for an example.


## Extending Existing Engines

You can extend existing engines with additional functionality. See
[engines/companyx/node/handlebars][] for an example of creating a `link_to`
helper.



[Bower]: http://bower.io/
[Bower's registry]: http://sindresorhus.com/bower-components/
[vendor directory]: vendor
[bower.json file]: bower.json
[engines folder]: engines
[Visual Studio]: http://www.visualstudio.com/
[TypeScript]: http://www.typescriptlang.org/
[Plugin]: http://go.microsoft.com/fwlink/?LinkID=266563
[Intellisense]: https://en.wikipedia.org/wiki/Intelligent_code_completion
[Sublime Text]: http://www.sublimetext.com/
[Sublime Package Control]: https://sublime.wbond.net/installation
[DefinitelyTyped]: https://github.com/borisyankov/DefinitelyTyped
[engines/node]: engines/node
[engines/companyx/node/handlebars]: engines/companyx/node/handlebars
