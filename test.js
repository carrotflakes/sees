const sees = new (require('./dist/index.js').Compiler)();

function compile(src) {
  console.log(src);
  const ast = sees.parse(src);
  console.log(JSON.stringify(ast));
  const esAst = sees.convertAst(ast);
  console.log(JSON.stringify(esAst));
  const js = sees.render(esAst);
  console.log('\n' + js + '\n');
}

compile('(return (+ x y))');
compile('(function add (x y) (return (+ x y)))');
compile(`
(const (a 1))
(let (b a) (c (+ a b)))
(function add (x y)
  (return (+ x y)))
(add 1 2)
((. console log) (add 1 2))
(function fact (n)
  (if (<= n 0)
     (return 1)
     (return (* n (fact (- n 1))))))
`);
