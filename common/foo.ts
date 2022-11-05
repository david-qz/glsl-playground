/**
 * A Foo which has yet to be tracked in the database.
 */
export type UntrackedFoo = {
  foo: string,
}

/**
 * Our chief export at Foo Co.
 */
export type Foo = {
  id: string,
  foo: string,
}

// Force this to be treated as an ES6 module.
export {}
