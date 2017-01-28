
# [![BuildGem](https://cdn.rawgit.com/buildgem/logo/v2.0.0/build/buildgem-logo-240x60.png)](https://github.com/buildgem)

[![version](https://img.shields.io/npm/v/buildgem.svg?label=version&colorA=333333&colorB=E8BA00&style=flat-square&maxAge=1000)](https://www.npmjs.com/package/buildgem)
[![build](https://img.shields.io/travis/buildgem/buildgem.svg?label=build&colorA=333333&colorB=E8BA00&style=flat-square&maxAge=1000)](https://travis-ci.org/buildgem/buildgem)
[![coverage](https://img.shields.io/coveralls/buildgem/buildgem.svg?label=coverage&colorA=333333&colorB=E8BA00&style=flat-square&maxAge=1000)](https://coveralls.io/github/buildgem/buildgem)
[![dependencies](https://img.shields.io/david/buildgem/buildgem.svg?label=dependencies&colorA=333333&colorB=E8BA00&style=flat-square&maxAge=1000)](https://david-dm.org/buildgem/buildgem)
[![code quality GPA](https://img.shields.io/codeclimate/github/buildgem/buildgem.svg?label=code%20quality%20GPA&colorA=333333&colorB=E8BA00&style=flat-square&maxAge=1000)](https://codeclimate.com/github/buildgem/packagename)
[![downloads](https://img.shields.io/npm/dt/buildgem.svg?label=downloads&colorA=333333&colorB=E8BA00&style=flat-square&maxAge=1000)](https://www.npmjs.com/package/buildgem)


## Introduction

BuildGem builds stuff from a directory of source files. A typical use case would be to make a static website from Markdown and Sass. But BuildGem is not limited to this use case.

BuildGem works like this:

* It reads files from a source directory that you specify
* It passes those files through a series of plugins that you configure
* Each plugin is given the opportunity to process some or all of the source files, using them to create new files in a separate build directory

BuildGem doesn't do any building itself. The build steps are handled by plugins.

Plugins are run sequentially. A plugin is given three parameters: the path to the source directory, the path to the destination build directory, and a reference to the next plugin in the chain.

```javascript
function plugin (source, destination, next) {}
```

Typically, a plugin will look for specific files in the source directory and use them to do things like transpile code, compile CSS, aggregate and minify JavaScript modules, and inject content into HTML templates. Each plugin specializes in one task.

When a plugin is finished, it is expected to call the ``next`` plugin in the chain.

That's all there is to it. Nothing more complicated than that.

BuildGem is inspired by Node.js static site generators, notably [MetalSmith](https://www.npmjs.com/package/metalsmith), [Wintersmith](https://www.npmjs.com/package/wintersmith) and [Blacksmith](https://www.npmjs.com/package/blacksmith). BuildGem is different in that it is a generic build automation tool. It does not specialise in the building of static websites.

Also, BuildGem's internal mechanics are simpler. It does not provide plugins with an abstraction of the source files like MetalSmith, for instance. This means that plugins are not tightly coupled to BuildGem itself.


## Requirements

Node.js >= 4.5.0


## Installation

BuildGem and its plugins are shipped as separate packages. They can be installed with npm:

```bash
npm install buildgem
npm install buildgem-copy
npm install buildgem-js
npm install buildgem-md2html
npm install buildgem-sass
```
BuildGem
You can also use [jspm.io](http://jspm.io/), a universal JavaScript package manager that is capable of loading any module format (ES6, AMD, CommonJS) from any registry (npm, GitHub, Bitbucket).


## Usage

```javascript
var BuildGem = require('buildgem')
var copy = require('buildgem-copy')
var js = require('buildgem-js')
var md2html = require('buildgem-md2html')
var sass = require('buildgem-sass')
var custom = require('./lib/plugins/custom-plugin.js')

new BuildGem()
  .from('src')
  .to('build')
  .via([
    md2html({
      sources: ['markdown/**/*.md', 'markdown/**/*.markdown'],
      templates: ['html/*.html']
    }),
    sass({
      sources: ['scss/*.scss']
    }),
    js({
      sources: ['js/*.js']
    }),
    copy({
      sources: ['.*', '*.*']
    }),
    custom({
      config: true
    })
  ])
  .rebuild()
  .listen();
```


## API

Use Node.js's ``require()`` function to include BuildGem and the plugins that you need.

```javascript
var buildgem = require('buildgem')
var copy = require('buildgem-copy')
var js = require('buildgem-js')
var md2html = require('buildgem-md2html')
var sass = require('buildgem-sass')
```

You can write your own custom BuildGem plugins. If you do, you include them by providing their relative path.

```javascript
var custom = require('./lib/plugins/custom-plugin.js')
```

### new BuildGem()

The ``buildgem`` module returns an instance of the ``BuildGem`` constructor function. To start a new build, create a new ``BuildGem`` instance:

```javascript
new BuildGem()

// Or:
BuildGem()
```

The constructor function does not take any parameters.

### from(path) and to(path)

The ``from()`` and ``to()`` methods set the paths to the source and build directories respectively. The defaults are ``./src`` and ``./build``.

### via(plugins)

The ``via()`` method adds the plugins. The ``plugins`` parameter is an array of plugin functions. Typically, each plugin function is constructed by an outer function call that takes an ``options`` object, which configures the plugin. Available ``options`` vary, but most plugins will have an ``options`` property called ``sources`` that defines patterns for finding files in the source directory that the plugin is capable of processing.

Plugin functions themselves accept three parameters: the path to the source directory, the path to the build directory, and a reference to the next plugin.

```javascript
function plugin (options) {
  return function (source, build, next) {
    // ...
  }
}
```

### build(fn) and rebuild(fn)

The ``build()`` and ``rebuild()`` methods will trigger a fresh build. The only difference between these two methods is that ``rebuild()`` will first wipe all of the contents of the build destination directory, while ``build()`` will not.

When a build is triggered, the plugins are called sequentially in the order in which you defined them. Each plugin is given three parameters: the source path, the build path, and a reference to the next plugin in the queue. Thus, each plugin gets the opportunity to process some or all of the source files, and to generate build files from them. When a plugin has finished, it executes the next plugin.

Optionally, the ``build()`` and ``rebuild()`` methods may be given a callback which is executed when the last plugin completes it task. Build callbacks have the following signature: ``fn(err)``. Example usage:

```javascript
.build(function (err) {
  if (err) throw err;
  console.log('Build complete');
})
```


## CLI

Instead of configuring your builds programmatically, you can use the ``buildgem`` command line tool, which reads a JSON configuration file called ``buildgem.json``.

{
  "from": "src",
  "to": "build",
  "via": {
    "buildgem-md2html": {
      sources: ['markdown/**/*.md', 'markdown/**/*.markdown'],
      templates: ['html/*.html']
    },
    "buildgem-sass": {
      sources: ['sass/*.scss']
    },
    "buildgem-js": {
      sources: ['js/**/*.js']
    },
    "buildgem-copy": {
      sources: ['.*', '*.*']
    }
  }
}

You can configure your own custom plugins from ``buildgem.json``, too. Local plugin names are relative paths from the root directory.

```bash
"via": {
"./lib/plugins/custom-plugin.js": {
  config: true
}
```

Install ``buildgem`` and the plugins from npm. Then run ``buildgem`` from the command line:

```bash
node_modules/.bin/buildgem
```

If you installed BuildGem globally (``npm install -g buildgem``) you can use the following command:

```bash
buildgem
```

This command will run the build process, but it will not clean out the contents of the build directory first. To do a clean build:

```bash
buildgem --clean
```

To have the command line tool listen for subsequent changes to source files and do partial rebuilds on the fly:

```bash
buildgem --listen
```


## How to write a BuildGem plugin

You can easily write your own plugins for BuildGem. Use this as a template:

```javascript
module.exports = plugin

function plugin (options) {
  options = options || {}

  return function (source, build, next) {
    // ...

    next()
  }
}
```

Please share your plugins with the community by publishing them to npm. We recommend that you prefix package names "buildgem-" so that it will be easy for everyone to discover all available BuildGem plugins.

---

[![Standard JS](https://cdn.rawgit.com/feross/standard/master/badge.svg)](http://standardjs.com/)


