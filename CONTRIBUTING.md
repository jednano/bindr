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
adding one or all of the three possible engine types.


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

Browse the [DefinitelyTyped] repo for an existing TypeScript definition file
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

The base module provides the base class you will extend. The Promises module
provides the classes required to follow the Promise pattern.

Now, you can extend your class from the Engine base class:

```ts
class Foo extends Engine {

}

export = Foo;
```


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
        done();
    });
});
```

Save the file and run your tests. You can do this with `npm test` or you can
start a watch with `./watch` or `sh watch`, depending on your shell. This
will keep track of any .ts file changes, clean, rebuild and rerun the tests.

This test will fail and rightly so. You haven't overridden your base class'
compile method. If you don't do this, a `Not Implemented` error will be
thrown.


### Override base class methods

Here's how you would override your base class' compile method:

```ts
private source: string;
private compiling: Promises.Deferred;
compile(source: string): Promises.Promise {
    this.source = source;
    this.compiling = new Deferred();
    this.load().done(this.onWindow.bind(this));
    return this.compiling.promise;
}
```

Save the file and you should see that your tests passes, but your engine still
doesn't render the HTML that you want. This is because...

TODO: Add documentation here

Let's add a constructor inside the class:

```ts
constructor(scriptPath?: string) {
    super(scriptPath || './vendor/foo/foo.js');
}
```

This opens up your class for extension by allowing a sub-class to override
your script path. Your pull request will not be merged in without this
inclusion.

TODO: Add documentation here



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
