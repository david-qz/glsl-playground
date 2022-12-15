# GLSL Playground

GLSL Playground is a browser-based code scratchpad for GLSL shader programs. No setup is required. Just open the page and start editing.

## Features

- Easy to use code editor with completions for GLSL built-ins.
- Preview rendering of a Utah Teapot using your program.
- Instant visual feedback when your program compiles.
- Instant in-editor error feedback when your program doesn't compile.
- Optionally create an account and save your programs.

## TODO

- Shadow mapping support.
- Model uploading.
- Texture uploading.

## Technology

GLSL Playground is built with:

- TypeScript!
- Vite as a dev server and bundler.
- ESLint for linting.
- Rome for formatting.

## Running Locally

 1) Install dependencies:

```sh
npm i
```

 2) To set up the environment, copy `.env.template` to `.env` and fill in the required fields. You will need a Postgres database URL. If you wish to use a separate database for testing, you can create a `TEST_DATABASE_URL` variable. The tests will tear down and re-seed whichever database they connect to. All the variables can be overridden in a test environment by similarly prefixing `TEST_`.

 3) To set up the development database run:

```sh
npm run setup-db
```

 3) Run the development server:

```sh
npm start
```

## Disclaimer

GLSL Playground is hobby project in active development. There will be bugs.
