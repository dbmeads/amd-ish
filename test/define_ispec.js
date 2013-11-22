describe('define', function () {
    var callback;

    beforeEach(function () {
        callback = jasmine.createSpy();
    });

    it('should call factory function', function () {
        define(callback);

        expect(callback).toHaveBeenCalled();
    });

    it('should be able to inject a required module', function () {
        define(['util'], callback);

        expect(callback).toHaveBeenCalledWith(require('util'));
    });

    it('should be able to inject a local defined module result', function () {
        define(['./modules/module1'], callback);

        expect(callback).toHaveBeenCalledWith('hi');
    });

    it('should be able to inject a defined module result', function () {
        define(['jasmine-injector'], callback);

        expect(callback).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('should not execute the factory when called from define.amd.factory', function () {
        var factory = define.amd.factory('./modules/module2');

        expect(factory()).toBe(1);
    });

    describe('amd.register', function () {
        beforeEach(function () {
            define.amd.register('jasmine-injector', 'Awesome!');
        });

        it('should register a result for a module', function () {
            define(['jasmine-injector'], callback);

            expect(callback).toHaveBeenCalledWith('Awesome!');
        });

        it('should allow for unregistering modules (i.e.: clearing cache)', function () {
            define.amd.unregister('jasmine-injector');

            define(['jasmine-injector'], callback);

            expect(callback).toHaveBeenCalledWith(jasmine.any(Function));
        });
    });

});