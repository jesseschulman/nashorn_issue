import jdk.nashorn.api.scripting.AbstractJSObject;
import jdk.nashorn.api.scripting.NashornScriptEngine;
import jdk.nashorn.api.scripting.NashornScriptEngineFactory;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

import javax.script.ScriptException;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;

public class Reproducer {

    private ScriptObjectMirror globalBindings;
    private NashornScriptEngine engine;


    public static void main(String[] args) throws ScriptException, IOException {
        new Reproducer().reproduce();
    }

    public void reproduce() throws ScriptException, IOException {
        NashornScriptEngineFactory factory = new NashornScriptEngineFactory();
        engine = (NashornScriptEngine) factory.getScriptEngine(new String[] { "--no-java", "-strict",
                        "--no-syntax-extensions", "--language=es6" });


        globalBindings = (ScriptObjectMirror) engine.createBindings();
        globalBindings.put("require", new RequireJSObject());
        globalBindings.put("reproduce", new ReproducerJSObject());
        engine.eval(fileToString(new File("Class.js")), globalBindings);

        ScriptObjectMirror module = (ScriptObjectMirror) require("Module.js");

        ScriptObjectMirror moduleInstance = (ScriptObjectMirror) module.newObject();

        moduleInstance.callMember("doSomething", "firstArg", "secondArg", "thirdArg");
    }

    class ReproducerJSObject extends AbstractJSObject {
        @Override
        public Object call(Object thiz, Object[] args) {
            // also happens with just SuperClass
            /*
            ScriptObjectMirror superClass = (ScriptObjectMirror) require("SuperClass.js");
            ScriptObjectMirror superClassInstance = (ScriptObjectMirror) superClass.newObject("arg1 from JSObject", "arg2 from JSObject");
            */


            ScriptObjectMirror subClass = (ScriptObjectMirror) require("SubClass.js");
            ScriptObjectMirror argObject = (ScriptObjectMirror) ((ScriptObjectMirror) globalBindings.getMember("Object")).newObject();
            argObject.put("foo", "bar");
            ScriptObjectMirror subClassInstance = (ScriptObjectMirror) subClass.newObject("arg1 from JSObject", argObject, "arg3 from JSObject");
            return subClassInstance;
        }
    }

    class RequireJSObject extends AbstractJSObject {
        @Override
        public Object call(Object thiz, Object[] args) {
            if (args.length < 1)
                throw new RuntimeException("Must provide a file to require");

            String toRequire = args[0].toString();
            return require(toRequire);
        }
    }

    private Object require(String toRequire) {
        File f = new File(toRequire);
        if (!f.exists())
            throw new RuntimeException("File does not exist: " + f.getAbsolutePath());

        String script;
        try {
            script = fileToString(f);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read file", e);
        }

        ScriptObjectMirror moduleObject = (ScriptObjectMirror) ((ScriptObjectMirror) globalBindings.getMember("Object")).newObject();
        ScriptObjectMirror moduleFunction = (ScriptObjectMirror) ((ScriptObjectMirror) globalBindings.getMember("Function")).newObject("module", script);

        moduleFunction.call(moduleFunction, moduleObject);

        return moduleObject.getMember("exports");
    }

    private String fileToString(File f) throws IOException {
        if (!f.exists())
            throw new RuntimeException("File does not exist " + f);

        StringBuilder sb = new StringBuilder();
        for (String s : Files.readAllLines(f.toPath())) {
           sb.append(s).append("\n");
        }
        return sb.toString();
    }

}
