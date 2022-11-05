# Base!

This is a readme template! This should be swapped out with some documentation
about the application itself.

## Recommended First Repo Steps

For forks of this repository, it's recommended to move this file aside
(suggested to a `base.md`) and flesh out your own `README.md`. All repositories
should have readmes! Even if your readme amounts to "Here be dragons", it can
still convey some usefulness. And you can expand on it later.

A good readme will have:
0. The purpose of this software.
1. How to use this software if it is to be consumed via its code (such as a
   library).
2. How to get started locally. This can sometimes be in a `CONTRIBUTING.md`
   file, which this file links to.
3. Design considerations and decisions. If these grow too big, much like the
   `CONTRIBUTING.md` you can make something like a `DESIGN.md`.
4. Having a vague roadmap can also be helpful, or even notes features you are
   working on.

## Running Locally

### PostgreSQL Setup

You'll need PostgreSQL installed for this application. If your final project
does not use PostgreSQL, feel free to delete references to PostgreSQL from your
copy, including this section.

If PostgreSQL is generally always running for you and the database is already
configured, there's nothing for you to do here.

Additionally, PostgreSQL can be manually started with the following invocation.

``` sh
$ pg_ctl -D .tmp/$USER -l logfile start
```

This will run daemonized. Use this invocation to bring the server down:

``` sh
$ pg_ctl -D .tmp/$USER -l logfile stop
```

PostgreSQL requires a database stood up. The default `createdb` invocation will
stand this up for you.

``` sh
$ createdb
```

### The Application Itself

The application can be started with `npm start`, and browsing to
[http://localhost:7891](http://localhost:7891). The only route it serves right
now is `/foos` which can be reached at
[http://localhost:7891/foos](http://localhost:7891/foos). 

## Testing

This application uses Jest + `react-testing` for testing the React side, and
Jest + Supertest for server tests. Simply name the test file with
`<subject>.test.ts` or `<subject>.test.tsx` and place the file adjacent to the
test subject. `npm test` runs the suite for the entire application.

### React Testing

Coming soon!

### Supertest

Supertest is a testing library that sits atop Superagent. It is able to start a
server up automatically and exercise that server. See our server test under
`./server` to see an example of its functionality. Of note, it uses
`request(app)` to capture the server and invoke routes from there. Additionally,
an agent can be setup (much like Superagent's agent) that handles persistent
connections, cookies, sessions, etc.

## Deployment

Coming soon!

## Technology Tour

This section covers the technology selections in this repository and how you can
learn more about them. It assumes you have a working knowledge of application
development with JavaScript - notably with React.js and Express.js.

### Webpack

Webpack is used to bundle the UI from our cutting edge features (like
TypeScript and CSS Modules) into something browsers can work with. You can start
at `webpack.config.js` and skim through its contents as it is well commented at
this point. Of major note, this configuration supports TypeScript and CSS
Modules, but this is not an exhaustive feature list.

### TypeScript

The TypeScript configuration can be found in `tsconfig.json`.

This repository uses a fairly strict TypeScript configuration, with a focus on
correctness/soundness of code taking precedence over editor hints. You can
afford to lean heavily on types as something to be true.

This is using EcmaScript modules (sometimes called ES6 modules, although the 6
is part is inaccurate nowadays). There is significant configuration made to
support module usage transparently. Modify the area with care: TypeScript does
not always catch module loading issues immediately, and these will manifest in
the runtime instead.

There are two major caveats:
1. All code must be a module. So it must `import` or `export` something. Use
   `export {}` if you don't really need to export anything. Because these are
   "modules" in a very strict sense, `import` statements always get hoisted to
   the top. This means you can't `import` something, run a function, and then
   `import` another thing which depends on that function being run. It doesn't
   come up much, but it can be surprising when it does.
2. All TypeScript imports must end in `.js`. Tickets like
   https://github.com/microsoft/TypeScript/issues/49083 outline the arguments
   and counter arguments about it, and there's other long winded tickets on the
   same topic. TypeScript has made their decision to stick with `.js` though,
   even though it seems to fly in the face of module standards. Don't expect
   this will change anytime soon.

### CSS Modules

CSS Modules are supported via Webpack as well as some TypeScript plugins.
