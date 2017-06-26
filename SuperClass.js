var SuperClass = Class.create({
   initialize: function(argOne, argTwo) {
       this.argOne = argOne;
       this.argTwo = argTwo;
       print("superArgOne=" + this.argOne);
       print("superArgTwo=" + this.argTwo);
   },

    superMethod: function() {
        print("superArgOne=" + this.argOne);
        print("superArgTwo=" + this.argTwo);
    }
});

module.exports = SuperClass;