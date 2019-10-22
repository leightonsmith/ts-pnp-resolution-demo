# Demo of a couple of problems in ts-pnp

We're investigating porting over to yarn plug and play, and we've hit 3 problems so far in yarn pnp.

1. Folder masking (ts-pnp)
  * If there is a folder with the same name as a file, ts-pnp will look in the folder rather than loading
   the file
2. typesVersion (ts-pnp)
  * Typescript allows different paths to be referenced depending on the version of typescript (see 
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-1.html#version-selection-with-typesversions).
    This hasn't been implemented in ts-pnp
3. types for dependencies not resolved (pnpify)
  * If a dependency requires a type to compile that is supplied as project dependency, then running `yarn pnpify tsc` 
    will not resolve the type.


## Steps to reproduce

1. `yarn install`
2. Run `yarn pnpify tsc`
  * Note that compilation works
3. Run `yarn build`
  * Note that compilation fails, with an error similar to: 

```
Cannot find module 'lodash/fp'.  TS2307

  > 1 | import { find } from 'lodash/fp'
      |                      ^
    2 |
    3 | export const testCompiler: () => number | undefined = () => {
```

This occurs because ts-pnp adds a trailing slash to the module path, and lodash has both a `fp` directory, and a `fp.d.ts` declaration file.
The `fp.d.ts` file should be resolved, but instead the `fp` directory is searched.

4. To see the typesVersion bug, revert this commit https://github.com/arcanis/ts-pnp/commit/862d45d832c06b391365eb8b1c3f571520216b19
   in your local environment, at which point `yarn build` will produce an error like;

```
  Type 'LodashOrderBy2x3<unknown>' is missing the following properties from type 'Many<(...args: any[]) => any>[]': pop, push, concat, join, and 27 more.  TS2345

     5 |   const test = [1,2,3];
     6 |
  >  7 |   const ordered = flow(orderBy(v => v, 'desc'))(test);
       |                        ^
     8 |   return ordered;
     9 |
    10 | }
```

This occurs because ts-pnp resolves `lodash/fp.d.ts` instead of `lodash/ts3.1/fp.d.ts`

5. To see the pnpify bug, run the following command: `yarn pnpify tsc`; the first two errors don't occur, but you should get an error like:

```
$ /home/ljsmith/.cache/yarn/v6/npm-@yarnpkg-pnpify-2.0.0-rc.7-0427e3d9f881db39176de3e52c59b40685552106-integrity/node_modules/@yarnpkg/pnpify/.bin/pnpify tsc
src/App.tsx:29:9 - error TS2605: JSX element type 'ReactMarkdown' is not a constructor function for JSX elements.
  Type 'ReactMarkdown' is missing the following properties from type 'ElementClass': render, context, setState, forceUpdate, and 3 more.

 29         <ReactMarkdown
            ~~~~~~~~~~~~~~
 30           source="a string"
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~
...
 33           linkTarget="_blank"
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 34         />
    ~~~~~~~~~~

src/App.tsx:29:9 - error TS2607: JSX element class does not support attributes because it does not have a 'props' property.

 29         <ReactMarkdown
            ~~~~~~~~~~~~~~
 30           source="a string"
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~
...
 33           linkTarget="_blank"
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 34         />
    ~~~~~~~~~~
```

This problem occurs because typescript looks for dependencies for a file by walking up the file system. When using pnpify, 
typescript walks up out of the cache directory, and misses the dependencies available in the project
