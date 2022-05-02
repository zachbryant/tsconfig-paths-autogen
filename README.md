# TSconfig Paths Auto Generator

A plugin for when configuring path aliases gets old. It reads your source structure and creates intellisense-friendly paths/ordering for your typescript config. Best used with [onmyjs](https://www.npmjs.com/package/onmyjs) config to JSON exporter 😉.

0 dependencies, 1kB minified.

**function generatePaths(baseUrl: string, options?: TSPathsAutogenOptions)**

- **baseUrl**: The baseUrl used in your tsconfig
- **options**:
  - **rootAlias**: What each alias will start with, such as the '@' in '@components/'
  - **customAliasMap**: Map a custom alias to a directory name. e.g., types becomes localtypes.
  - **maxDirectoryDepth**: How far deep in sub folders aliases should be generated.
  - **excludeAliasForDirectories**: Do not generate an alias for the given directories.
  - **excludeAliasForSubDirectories**: Do not generate aliases for subdirectories of the given directories
  - **includeAliasForDirectories**: Specifically generate an alias for each of the given directories.

Returns an object consistent with the paths type in tsconfig's compilerOptions.

## Sample Usage

`node tsconfig.js`

```javascript
// tsconfig.js
const { generatePaths } = require('tsconfig-paths-autogen');
module.exports = {
  compilerOptions: {
    ...
    paths: generatePaths(baseUrl, {
      rootAlias: '@',
      maxDirectoryDepth: 2,
      excludeAliasForSubDirectories: ['components'],
      includeAliasForDirectories: {
        common: 'components/common',
      },
    }),
  }
}
onmyjs(module.exports, undefined, true); // export to json
```

Based on this sample directory structure:

```
src
├── a
├── b
│   └── c
│       └── d
└── e
    └── f
```

we would see something like:

```json
"paths": {
  "@a": ["a/index"],
  "@a/*": ["a/*", "a/index"],
  "@d": ["b/c/d/index"],
  "@d/*": ["b/c/d/*", "b/c/d/index"],
  "@c": ["b/c/index"],
  "@c/*": ["b/c/*", "b/c/index"],
  "@b": ["b/index"],
  "@b/*": ["b/*", "b/index"],
  "@f": ["e/f/index"],
  "@f/*": ["e/f/*", "e/f/index"],
  "@e": ["e/index"],
  "@e/*": ["e/*", "e/index"],
  "@common": ["b/c/d/index"],
  "@common/*": ["b/c/d/*", "b/c/d/index"],
  "@/*": ["./*"],
  "~/*": ["../*"]
}
```

### Integrating in package.json scripts
A few ways you might consider integrating this are:
- Watch for changes in tsconfig, then re-emit json and reload dev-server
```
  "scripts": { 
      "dev": "nodemon -w tsconfig.js --exec \"run-s build:tsconfig dev:parcel\"" 
  }
```
- Or, use prebuild/prestart scripts
```
  "scripts": {
    "prebuild": "node tsconfig.js",
    "prestart": "node tsconfig.js"
    ...
  }
```