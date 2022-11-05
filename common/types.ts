// Exand and ExpandRecursively allow us ot peek into the innards of a type that
// sometimes the auto-complete/intellisense doesn't give us. See
// https://stackoverflow.com/a/69288824 for the creative solutions on getting
// this info.
//
// The usage is to surround the type (T) with Expand or ExpandRecursively
// (depending on how deep you want to go). Then you can place your cursor upon
// the type to see what it comes out to be.
//
// An example with Foo:
//
// type ExpandedFoo = Expand<Foo>
//
// And then place your cursor or mouse upon ExpandedFoo.
//
// This might only ever work in VSCode.
export type Expand<T> = T extends (...args: infer A) => infer R
  ? (...args: Expand<A>) => Expand<R>
  : T extends infer O
  ? { [K in keyof O]: O[K] }
  : never;

export type ExpandRecursively<T> = T extends (...args: infer A) => infer R
  ? (...args: ExpandRecursively<A>) => ExpandRecursively<R>
  : T extends object
  ? T extends infer O
    ? { [K in keyof O]: ExpandRecursively<O[K]> }
    : never
  : T;
