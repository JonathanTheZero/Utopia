const { PythonShell } = require("python-shell");

const pyshell = new PythonShell('dist/x.py', { mode: "text" });

pyshell.on("message", console.log);