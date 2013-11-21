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

    it('should be able to inject a defined module result', function () {
        define(['./modules/module1'], callback);

        expect(callback).toHaveBeenCalledWith('hi');
    });
});