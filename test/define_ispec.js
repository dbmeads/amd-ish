describe('define', function() {
    it('should call factory function', function() {
        var callback = jasmine.createSpy();

        define(callback);

        expect(callback).toHaveBeenCalled();
    });
});