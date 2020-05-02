# Utopia Rewrite

Complete rewrite of the Utopia Bot using MongoDB and TypeScript (instead of JSON files and JavaScript... hell, that was a mess).

## How to get a Fork/Copy of the Repository to work

Requirements:
* Node.js and npm (I use Node v12.16.0 and npm v6.14.3)
* MongoDB
* TypeScript (I use TypeScript 3.8.3)

Optional:
* webpack (used for compiling in production, I use v4.16.0)
* For the imageplotting:
  * Python 3+ and pip (I use Python 3.6.8 and pip 19.3.1)
  * Pillow (Python Image library, I used v6.2.1)
  * Requests (I use 2.22.0)

A more detailed list with all additional dev-dependencies and more can be found in the files `package.json` and `package-lock.json` (Node) and `requirements.txt` (Python)

First of all you should rename the `example-config.json` in `/src/static/` to `config.json` and fill out the fields. 
The names are mostly self-explainatory. 
If you don't know what you should do with the `dbl` object, leave it as it is. 
It's only needed for the voting streaks.

After that run `npm install` in the command line.

You have two options when compiling the code: 

* Use webpack and generate one bundled up file, which contains all the code 
  (hard to debug runtime errors, so I suggest not using that, this is for me when deploying the app).
  Before you compile it, you need to create a second config file called `config.prod.json` in the same folder as `config.json`.
  For testing you can just paste the data of your `config.json` in the `config.prod.json`.
  After you have done that, you can compile and run the project using `webpack && node dist/bundle.js`.

* Use the default TypeScript compiler: This will compile each TypeScript file to a corresponding JavaScript file 
  (and a definition file `*.d.ts` but you can ignore these).
  This should not be used during production but makes it much easier to debug when testing.
  In order to get that, run `tsc && node dist/index.js`.<br />
  **Note:** When debugging, the errors will be thrown in the JavaScript files so you have to look there and afterwards edit the TypeScript files
