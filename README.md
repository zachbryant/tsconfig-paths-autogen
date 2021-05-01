# TSconfig Paths Auto Generator

A plugin for when configuring path aliases gets old. It reads your source structure and creates intellisense-friendly paths for your typescript config. Best used with [onmyjs](https://www.npmjs.com/package/onmyjs) config to JSON exporter.

**function generatePaths(baseUrl: string, options?: TSPathsAutogenOptions)**

- **baseUrl**: The baseUrl used in your tsconfig
- **Options**:
  - **rootAlias**: What each alias will start with, such as the '@' in '@components/'
  - **customAliasMap**: Map a custom alias to a directory name. e.g., types becomes localtypes.
  - **maxDirectoryDepth**: How far deep in sub folders aliases should be generated.
  - **excludeAliasForDirectories**: Do not generate an alias for the given directories.
  - **excludeAliasForSubDirectories**: Do not generate aliases for subdirectories of the given directories
  - **includeAliasForDirectories**: Specifically generate an alias for each of the given directories.

Returns an object consistent with the paths type in tsconfig's compilerOptions.

## Sample Usage

```javascript
const generatePaths = require('tsconfig-paths-autogen').default;
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
├── assets
│   ├── images
│   │   └── ...
│   └── styles
│       └── ...
├── components
│   └── common (empty folder)
├── config
│   ├── constants
│   │   └── ...
├── layouts
│   └── ...
├── models
│   └── ...
├── pages
│   └── ...
├── stories
│   └── ...
├── types
│   └── ...
└── utils
    └── ...
```

we would see the resulting json:

```json
"paths": {
  "@/*": ["./*"],
  "~/*": ["../*"],
  "@assets/*": ["stories/assets/*", "stories/assets/index"],
  "@assets": ["stories/assets/index"],
  "@images/*": ["assets/images/*", "assets/images/index"],
  "@images": ["assets/images/index"],
  "@styles/*": ["assets/styles/*", "assets/styles/index"],
  "@styles": ["assets/styles/index"],
  "@components/*": ["components/*", "components/index"],
  "@components": ["components/index"],
  "@common/*": ["components/common/*", "components/common/index"],
  "@common": ["components/common/index"],
  "@config/*": ["config/*", "config/index"],
  "@config": ["config/index"],
  "@constants/*": ["config/constants/*", "config/constants/index"],
  "@constants": ["config/constants/index"],
  "@layouts/*": ["layouts/*", "layouts/index"],
  "@layouts": ["layouts/index"],
  "@models/*": ["models/*", "models/index"],
  "@models": ["models/index"],
  "@pages/*": ["pages/*", "pages/index"],
  "@pages": ["pages/index"],
  "@stories/*": ["stories/*", "stories/index"],
  "@stories": ["stories/index"],
  "@localtypes/*": ["types/*", "types/index"],
  "@localtypes": ["types/index"],
  "@utils/*": ["utils/*", "utils/index"],
  "@utils": ["utils/index"]
}
```
