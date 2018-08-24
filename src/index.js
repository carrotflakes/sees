const parse = require('./parser.js');
const transform = require('./transform.uttr').transform;
const escodegen = require('escodegen');

class Compiler {

  parse(source) {
    return parse(source);
  }

  convertAst(uttrAst) {
    const makeMacro = (ast) => {
      const fn = eval(this.render(ast));
      return args => fn(...args);
    }

    return transform(uttrAst, makeMacro);
  }

  render(esAst) {
    return escodegen.generate(esAst);
  }

  compile(source) {
    return this.render(this.convertAst(this.parse(source)));
  }

}

module.exports = {
  Compiler
};
