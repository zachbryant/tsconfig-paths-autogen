const fs = require('fs');

let _baseUrl = undefined;
let _rootAlias = undefined;
let _customAliasMap = undefined;
let _maxDirectoryDepth = undefined;
let _excludeAliasForDirectories = undefined;
let _excludeAliasForSubDirectories = undefined;
let _includeAliasForDirectories = undefined;

interface TSPathsAutogenOptions {
	rootAlias?: string;
	customAliasMap?: object;
	maxDirectoryDepth?: number;
	excludeAliasForDirectories?: string[];
	excludeAliasForSubDirectories?: string[];
	includeAliasForDirectories?: object;
}

/**
 *
 * @param baseUrl The baseUrl used in your tsconfig
 * @param rootAlias What each alias will start with, such as the '@' in '@components/'
 * @param customAliasMap Map a custom alias to a directory name. e.g., types becomes localtypes.
 * @param maxDirectoryDepth How far deep in sub folders aliases should be generated.
 * @param excludeAliasForDirectories Do not generate an alias for the given directories.
 * @param excludeAliasForSubDirectories Do not generate aliases for subdirectories of the given directories
 * @param includeAliasForDirectories Specifically generate an alias for each of the given directories.
 * @returns An object consistent with the paths type in tsconfig's compilerOptions.
 */
export default function generatePaths(baseUrl: string, options?: TSPathsAutogenOptions) {
	_baseUrl = baseUrl;

	_rootAlias = options.rootAlias ?? '@';
	_customAliasMap = options.customAliasMap ?? { types: 'localtypes' };
	_maxDirectoryDepth = options.maxDirectoryDepth ?? 1;
	_excludeAliasForDirectories = options.excludeAliasForDirectories ?? ['dist'];
	_excludeAliasForSubDirectories = options.excludeAliasForSubDirectories ?? [];
	_includeAliasForDirectories = options.includeAliasForDirectories ?? {};

	return _generatePaths();
}

// Import aliases like `import("@Public/img/myasset.png")`
function _generatePaths() {
	let aliases = {
		[`${_rootAlias}/*`]: ['./*'], // current dir
		'~/*': ['../*'], // parent dir
	};
	aliases = getPathsFromDir(aliases, '', 0, _maxDirectoryDepth);
	for (let [key, value] of Object.entries(_includeAliasForDirectories)) {
		aliases = getPathAliases(value, key, aliases);
	}
	return aliases;
}

// Get a list of sub-directories
function getDirectories(source) {
	return fs
		.readdirSync(source, { withFileTypes: true })
		.filter((_) => _.isDirectory())
		.filter((_) => !_excludeAliasForDirectories.includes(_))
		.map((_) => _.name);
}

function getPathsFromDir(paths, pathString, depth, maxDepth) {
	if (depth > maxDepth) return;

	const subDirsExcluded = _excludeAliasForSubDirectories.some((_) => {
		return pathString.includes(_);
	});

	if (subDirsExcluded) return paths;

	for (const dirName of getDirectories(`${_baseUrl}/${pathString}`)) {
		const newPathString = [pathString, dirName].filter(Boolean).join('/');
		paths = {
			...getPathAliases(newPathString, dirName, paths),
			...getPathsFromDir(paths, newPathString, depth + 1, maxDepth),
		};
	}
	return paths;
}

// Resolve the final path alias and add to the paths object
function getPathAliases(pathString, dirName, paths) {
	const index = `${pathString}/index`;
	const resolvedName = resolveNameConflicts(dirName);
	const alias = `${_rootAlias}${resolvedName}`;
	paths[`${alias}/*`] = [`${pathString}/*`, index];
	paths[`${alias}`] = [index];
	return paths;
}

// Sort out any name conflicts or custom aliases
function resolveNameConflicts(name) {
	return _customAliasMap[name] ?? name;
}
