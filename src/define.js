var callsite = require('callsite'),
    modules = {},
    path = require('path'),
    relPattern = /^[./]/,
    slice = Array.prototype.slice;

GLOBAL.define = function () {
    execFactory(resolveModuleFromArgs(callsite()[1].getFileName(), slice.call(arguments)));
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

function resolveModuleFromArgs(filename, args) {
    var module = {
        filename: filename,
        id: filename
    };

    args.forEach(function (arg) {
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

    modules[module.id] = modules[filename] = module;

    return module;
}

function resolveModule(moduleId) {
    if(!modules[moduleId]) {
        requireModule(moduleId);
    }
    return modules[moduleId];
}

function resolveDependencies(dependencies, filename) {
    var resolved = [];
    if (Array.isArray(dependencies)) {
        dependencies.forEach(function (moduleId) {
            var module = resolveModule(normalizeModuleId(moduleId, filename));
            resolved.push(execFactory(module).result);
        });
    }
    return resolved;
}

function requireModule(moduleId) {
    var module = modules[moduleId] = {
        id: moduleId
    };
    module.result = require(moduleId);
}

function execFactory(module) {
    if(module.factory && !module.hasOwnProperty('result')) {
        module.result = module.factory.apply(null, resolveDependencies(module.dependencies, module.filename));
    }
    return module;
}