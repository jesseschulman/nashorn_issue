Object.extend = function (destination, source) {
    for (var property in source)
        destination[property] = source[property];
    return destination;
};

Object.isFunction = function(object) {
    return Object.prototype.toString.call(object) === '[object Function]';
};

Function.prototype.argumentNames = function() {
    var names = this.toString().match(/^[\s\(]*function[^(]*\(([^)]*)\)/)[1]
        .replace(/\/\/.*?[\r\n]|\/\*(?:.|[\r\n])*?\*\//g, '')
        .replace(/\s+/g, '').split(',');
    return names.length == 1 && !names[0] ? [] : names;
};

var Class = (function() {
    var IS_DONTENUM_BUGGY = (function(){
        for (var p in { toString: 1 }) {
            if (p === 'toString') return false;
        }
        return true;
    })();

    function subclass() {};
    function create() {
        var parent = null, properties = $A(arguments);
        if (Object.isFunction(properties[0]))
            parent = properties.shift();

        function klass() {
            //var foo = $A(arguments);
            //arguments.length;
            this.initialize.apply(this, arguments);
        }

        Object.extend(klass, Class.Methods);
        klass.superclass = parent;
        klass.subclasses = [];

        if (parent) {
            subclass.prototype = parent.prototype;
            klass.prototype = new subclass;
            parent.subclasses.push(klass);
        }

        for (var i = 0, length = properties.length; i < length; i++)
            klass.addMethods(properties[i]);

        if (!klass.prototype.initialize) {
            klass.prototype.initialize = function() { };
        }

        klass.prototype.constructor = klass;

        return klass;
    }

    function $A(iterable) {
        if (!iterable) return [];
        if ('toArray' in Object(iterable)) return iterable.toArray();
        var length = iterable.length || 0, results = new Array(length);
        while (length--) results[length] = iterable[length];
        return results;
    }

    function addMethods(source) {
        var ancestor   = this.superclass && this.superclass.prototype,
            properties = Object.keys(source);

        if (IS_DONTENUM_BUGGY) {
            if (source.toString != Object.prototype.toString)
                properties.push("toString");
            if (source.valueOf != Object.prototype.valueOf)
                properties.push("valueOf");
        }

        for (var i = 0, length = properties.length; i < length; i++) {
            var property = properties[i], value = source[property];
            if (ancestor && Object.isFunction(value) &&
                value.argumentNames()[0] == "$super") {
                var method = value;
                value = (function(m) {
                    return function() { return ancestor[m].apply(this, arguments); };
                })(property).wrap(method);

                value.valueOf = (function(method) {
                    return function() { return method.valueOf.call(method); };
                })(method);

                value.toString = (function(method) {
                    return function() { return method.toString.call(method); };
                })(method);
            }
            this.prototype[property] = value;
        }

        return this;
    }

    return {
        create: create,
        Methods: {
            addMethods: addMethods
        }
    };
})();