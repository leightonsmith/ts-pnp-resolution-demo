# Demo of a couple of problems in ts-pnp

We're investigating porting over to yarn plug and play, and we ran into 2 problems in module resolution
in yarn pnp
1. Folder masking
  * If there is a folder with the same name as a file, ts-pnp will look in the folder rather than loading
   the file
2. typesVersion
  * Typescript allows different paths to be referenced depending on the version of typescript (see 
    https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-1.html#version-selection-with-typesversions).
    This hasn't been implemented in ts-pnp

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

