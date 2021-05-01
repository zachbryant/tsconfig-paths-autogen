"use strict";
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call */
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var fs = require('fs');
var _baseUrl = undefined;
var _rootAlias = undefined;
var _customAliasMap = undefined;
var _maxDirectoryDepth = undefined;
var _excludeAliasForDirectories = undefined;
var _excludeAliasForSubDirectories = undefined;
var _includeAliasForDirectories = undefined;
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
function generatePaths(baseUrl, options) {
    var _a, _b, _c, _d, _e, _f;
    _baseUrl = baseUrl;
    _rootAlias = (_a = options.rootAlias) !== null && _a !== void 0 ? _a : '@';
    _customAliasMap = (_b = options.customAliasMap) !== null && _b !== void 0 ? _b : { types: 'localtypes' };
    _maxDirectoryDepth = (_c = options.maxDirectoryDepth) !== null && _c !== void 0 ? _c : 1;
    _excludeAliasForDirectories = (_d = options.excludeAliasForDirectories) !== null && _d !== void 0 ? _d : ['dist'];
    _excludeAliasForSubDirectories = (_e = options.excludeAliasForSubDirectories) !== null && _e !== void 0 ? _e : [];
    _includeAliasForDirectories = (_f = options.includeAliasForDirectories) !== null && _f !== void 0 ? _f : {};
    return _generatePaths();
}
exports["default"] = generatePaths;
// Import aliases like `import("@Public/img/myasset.png")`
function _generatePaths() {
    var _a;
    var aliases = (_a = {},
        _a[_rootAlias + "/*"] = ['./*'],
        _a['~/*'] = ['../*'],
        _a);
    aliases = getPathsFromDir(aliases, '', 0, _maxDirectoryDepth);
    for (var _i = 0, _b = Object.entries(_includeAliasForDirectories); _i < _b.length; _i++) {
        var _c = _b[_i], key = _c[0], value = _c[1];
        aliases = getPathAliases(value, key, aliases);
    }
    return aliases;
}
// Get a list of sub-directories
function getDirectories(source) {
    return fs
        .readdirSync(source, { withFileTypes: true })
        .filter(function (_) { return _.isDirectory(); })
        .filter(function (_) { return !_excludeAliasForDirectories.includes(_); })
        .map(function (_) { return _.name; });
}
function getPathsFromDir(paths, pathString, depth, maxDepth) {
    if (depth > maxDepth)
        return;
    var subDirsExcluded = _excludeAliasForSubDirectories.some(function (_) {
        return pathString.includes(_);
    });
    if (subDirsExcluded)
        return paths;
    for (var _i = 0, _a = getDirectories(_baseUrl + "/" + pathString); _i < _a.length; _i++) {
        var dirName = _a[_i];
        var newPathString = [pathString, dirName].filter(Boolean).join('/');
        paths = __assign(__assign({}, getPathAliases(newPathString, dirName, paths)), getPathsFromDir(paths, newPathString, depth + 1, maxDepth));
    }
    return paths;
}
// Resolve the final path alias and add to the paths object
function getPathAliases(pathString, dirName, paths) {
    var index = pathString + "/index";
    var resolvedName = resolveNameConflicts(dirName);
    var alias = "" + _rootAlias + resolvedName;
    paths[alias + "/*"] = [pathString + "/*", index];
    paths["" + alias] = [index];
    return paths;
}
// Sort out any name conflicts or custom aliases
function resolveNameConflicts(name) {
    var _a;
    return (_a = _customAliasMap[name]) !== null && _a !== void 0 ? _a : name;
}
