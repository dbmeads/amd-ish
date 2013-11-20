var callsite = require('callsite'),
    capture,
    modules = {},
    path = require('path'),
    relPattern = /^[./]/,
    slice = Array.prototype.slice;

GLOBAL.define = function () {
    execModule(resolveModule(callsite()[1].getFileName(), slice.call(arguments)));
};

define.amd = {
    factory: function (moduleId) {
        return resolveModule(normalizeModuleId(moduleId, callsite()[1].getFileName())).factory;
    }
};

function normalizeModuleId(moduleId, filename) {
    if (relPattern.test(moduleId)) {
        moduleId = path.normalize(path.resolve(path.dirname(filename), moduleId));
        if (!path.extname('.js')) {
            moduleId += '.js';
        }
    }
    return moduleId;
}

function resolveArgs(filename, args) {
    var module = {
        filename: filename,
        id: filename
    };

    (args||[]).forEach(function (arg) {
        switch (typeof arg) {
            case 'function':
                module.factory = arg;
                break;
            case 'string':
                module.id = arg;
                break;
            case 'object':
                if (Array.isArray(arg)) {
                    module.dependencies = arg;
                }
        }
    });

    return module;
}

function resolveModule(filename, args) {
    var module = resolveArgs(filename, args);

    if (modules[module.id] && !capture) {
        module = modules[module.id];
    } else {
        modules[module.id] = modules[module.filename] = module;
    }

    return module;
}

function resolveDependencies(dependencies, filename) {
    var resolved = [];
    if (Array.isArray(dependencies)) {
        dependencies.forEach(function (moduleId) {
            resolved.push(execModule(resolveModule(normalizeModuleId(moduleId, filename))).result);
        });
    }
    return resolved;
}

function execModule(module) {
    if (!module.result || capture) {
        if (module.factory) {
            module.result = module.factory.apply(null, resolveDependencies(module.dependencies, module.filename));
            if (capture) {
                modules[capture] = module;
            }
            return module;
        } else {
            capture = module.id;
            module.result = require(module.id);
            capture = undefined;
            return resolveModule(module.id);
        }
    }
    return module;
}
