var callsite = require('callsite'),
    capture,
    modules = {},
    path = require('path'),
    relPattern =  /^[./]/,
    slice = Array.prototype.slice;

GLOBAL.define = function () {
    execModule(resolveModule(slice.call(arguments), callsite()[1].getFileName()));
};

define.amd = {
    factory: function (moduleId) {
        return execModule(normalizeModuleId(moduleId, callsite()[1].getFileName())).factory;
    }
};

function normalizeModuleId(moduleId, filename) {
    if(relPattern.test(moduleId)) {
        moduleId = path.normalize(path.resolve(path.dirname(filename), moduleId));
        if(!path.extname('.js')) {
            moduleId += '.js';
        }
    }
    return moduleId;
}

function resolveModule(args, filename) {
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

    modules[module.id] = module;

    return module;
}

function resolveDependencies(dependencies, filename) {
    var resolved = [];
    if(Array.isArray(dependencies)) {
        dependencies.forEach(function (moduleId) {
            resolved.push(execModule(normalizeModuleId(moduleId, filename)).result);
        });
    }
    return resolved;
}

function execModule(module) {
    if(typeof module === 'string') {
        if(modules[module]) {
            return modules[module];
        } else {
            module = resolveModule([module], module);

            capture = module.id;
            module.result = require(module.id);
            capture = undefined;

            return execModule(module.id);
        }
    } else {
        if (module.factory) {
            module.result = module.factory.apply(null, resolveDependencies(module.dependencies, module.filename));
        }

        if(capture) {
            modules[capture] = module;
        }
        return module;
    }
}
