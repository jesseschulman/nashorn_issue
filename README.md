# Debugging details on reproducing

### Working version debugging

Calling RecompilableScriptFunctionData.compileTypeSpecialization() When it peparses and compiles to function it invokes compiler.compile(..). While in compiler and during  the "Builtin Replacement", ApplySpecialization.checkValidTransform() throwing a ApplySpecialization.TransformFailedException exception since it finds "arguments" but isCurrentArg() is false. This appears because arguments is used and its NOT part of an apply statement. That causes newFunctionNode.parameters to be empty.

This essentially creates compiledFn with no parameters, toString looks something like "[object] function {U%}klass()".

Eventually a new FunctionInitializer() is created with compiledFn. Since it has a methodType of "(Object,Object[])Object".

That methodType is used in RecompilableScriptFunctionData and is added to this.code and stored with an invokerType of "(Object,Object[])Object".

Down the line, the ScriptFunctionData.getGenericConstructor is called and lgenericInvokers.constructor is set to the "(Object,Object[])Object" type. And then the ScriptFunctionData.construct call goes into the "isVarArg" and invokeExact calls the right function.


### Non-working version debugging

Calling RecompilableScriptFunctionData.compileTypeSpecialization() When it peparses and compiles to function it invokes compiler.compile(..). While in compiler and during  the "Builtin Replacement", ApplySpecialization.checkValidTransform() works fine and this.pushExplodedArgs runs. That causes newFunctionNode.parameters to have an object.

This essentially creates compiledFn with 1 parameter, toString looks something like "[object] function {U%}klass([object] {O}:xarg0)".

Eventually a new FunctionInitializer() is created with compiledFn. Since it has a methodType of "(ScriptFunction,Object,Object)Object".

That methodType is used in RecompilableScriptFunctionData and is added to this.code and stored with an invokerType of "(ScriptFunction,Object,Object)Object".

Down the line, the ScriptFunctionData.getGenericConstructor is called (which calls getBest -> pickFunction()) and lgenericInvokers.constructor is set to the "(ScriptFunction,Object,Object)Object" type. And then the ScriptFunctionData.construct call goes and the isVarArg returns false. Which then goes into using the paramCount
to invokeExact.  Unfortunately the paramCount is not correct since the invokerType is different and invoking the constructor doesn't pass the proper arguments. 

