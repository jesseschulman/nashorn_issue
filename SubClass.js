var SuperClass = require("SuperClass.js");

var SubClass = Class.create(SuperClass, {
    initialize: function(argOne, argTwo, argThree) {
        this.subArgOne = argOne;
        this.subArgTwo = argTwo;
        this.subArgThree = argThree;
        print("ctor subArgOne=" + this.subArgOne);
        print("ctor subArgTwo=" + this.subArgTwo);
        print("ctor subArgThree=" + this.subArgThree);
    }
});

module.exports = SubClass;