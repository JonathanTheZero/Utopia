# Utopia Rewrite

Bla bla some text
Rewrite is done with TypeScript

It's deployed using Webpack to bundle the files (tsc can be used as well, tsconfig is present)

## Get your copy to work

Requirements:
* Node.js and npm (I use Node v12.16.0 and npm v6.14.3)
* MongoDB
* Python 3+ and pip (I use Python 3.6.8 and pip 19.3.1)
* TypeScript (I use TypeScript 3.8.3)
* webpack (optional, I use v4.16.0)
* Pillow (Python library for the image plotting, I used v6.2.1)

First of all you should rename the `example-config.json` in `/src/static/` to `config.json` and fill out the fields. 
The names are mostly self-explainatory. 
If you don't know what you should do with the `dbl` object, leave it as it is. 
It's only needed for the voting streaks.

After that run `npm install` in the command line.

You have two options when compiling the code: 

* Use webpack and generate one bundled up file, which contains all the code 
  (hard to debug runtime errors, so I suggest not using that, this is for me when deploying the app).
  In order to use that, simply run `webpack && node dist/bundle.js`.
  Another thing have to do first is create a second config file called `config.prod.json` in the same folder as `config.json` first.
  For testing you can just paste the data of your `config.json` in the `config.prod.json`.

* Use the default TypeScript compiler: This will compile each TypeScript file to a corresponding JavaScript file 
  (and a definition file `*.d.ts` but you can ignore these).
  This should not be used during production but makes it much easier to debug when testing.
  In order to get that, run `tsc && node dist/index.js`.