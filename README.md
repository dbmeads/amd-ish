amd-ish
=======

AMD style wrapper for node modules.

1. Supports "define".
2. Includes "define.amd.factory" to retrieve any module factory for easy unit testing.
3. Includes "define.amd.register" to allow for registering a mock / stub module (e.g.: "define.amd.register('foo', <mock>);").
4. Includes "define.amd.unregister" to allow for unregistering mock / stub modules (e.g.: "define.amd.unregister('foo');").

Installation
------------

1. npm install amd-ish
2. Add it to your node app simply by doing a "require('amd-ish');" in your main js file.
