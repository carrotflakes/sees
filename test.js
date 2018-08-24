const sees = new (require('./dist/index.js').Compiler)();

test('variable declaration', () => {
  expect(sees.compile(`
(var (a 1))
`)).toBe(`
var a = 1;
`.trim());
  expect(sees.compile(`
(let (a 1))
`)).toBe(`
let a = 1;
`.trim());
  expect(sees.compile(`
(const (a 1))
`)).toBe(`
const a = 1;
`.trim());
  expect(sees.compile(`
(var (a 1) (b 1) (c (+ 1 2)))
`)).toBe(`
var a = 1, b = 1, c = 1 + 2;
`.trim());
});

test('dot operator and function call', () => {
  expect(sees.compile(`
((@dot console log) "hello")
`)).toBe(`
console.log('hello');
`.trim());
});

test('function declaration', () => {
  expect(sees.compile(`
(function add (x y)
  (return (+ x y)))
`)).toBe(`
function add(x, y) {
    return x + y;
}
`.trim());
});

test('assignment', () => {
  expect(sees.compile(`
(= a 1)
`)).toBe(`
a = 1;
`.trim());
  expect(sees.compile(`
(= (@dot a b) (= c 1))
`)).toBe(`
a.b = c = 1;
`.trim());
});

test('arrow function', () => {
  expect(sees.compile(`
(=> () 1)
`)).toBe(`
() => 1;
`.trim());
  expect(sees.compile(`
(=>{} (a b)
  (return (+ a b)))
`)).toBe(`
(a, b) => {
    return a + b;
};
`.trim());
});

test('if statement', () => {
  expect(sees.compile(`
(if (<= n 0)
  "yo")
`)).toBe(`
if (n <= 0)
    'yo';
`.trim());
  expect(sees.compile(`
(if (<= n 0)
  ({}
    "yo"
    123))
`)).toBe(`
if (n <= 0) {
    'yo';
    123;
}
`.trim());
  expect(sees.compile(`
(if (<= n 0)
  ({}
    "yo"
    123)
  ({}
    "else..."))
`)).toBe(`
if (n <= 0) {
    'yo';
    123;
} else {
    'else...';
}
`.trim());
});

test('switch statement', () => {
  expect(sees.compile(`
(switch (+ a b)
  (case 0
    "0"
    (break))
  (case 1)
  (case 2
    "1 or 2"
    (break foo))
  (default
    "other"))
`)).toBe(`
switch (a + b) {
case 0:
    '0';
    break;
case 1:
case 2:
    '1 or 2';
    break foo;
default:
    'other';
}
`.trim());
});

test('for statement', () => {
  expect(sees.compile(`
(for (var (i 0)) (< i 10) (@++ i)
  (print i))
`)).toBe(`
for (var i = 0; i < 10; i++)
    print(i);
`.trim());
  expect(sees.compile(`
(for () () ()
  ({}
   (print i)))
`)).toBe(`
for (;;) {
    print(i);
}
`.trim());
});

test('new operator', () => {
  expect(sees.compile(`
(new Error "foo")
`)).toBe(`
new Error('foo');
`.trim());
});

test('array initializer', () => {
  expect(sees.compile(`
([ 1 2 . (@dots a))
`)).toBe(`
[
    1,
    2,
    ,
    ...a
];
`.trim());
});

test('object initializer', () => {
  expect(sees.compile(`
({ (a 1) (b 2) c (@dots d))
`)).toBe(`
({
    a: 1,
    b: 2,
    c,
    ...d
});
`.trim());
});

test('destructuring assignment', () => {
  expect(sees.compile(`
(var (([ a b (@dots c)) d))
`)).toBe(`
var [a, b, ...c] = d;
`.trim());
  expect(sees.compile(`
(var (({ (a aa) ("b" bb) c) d))
`)).toBe(`
var {
    a: aa,
    'b': bb,
    c
} = d;
`.trim());
  expect(sees.compile(`
(function f (a (@dots b)))
`)).toBe(`
function f(a, ...b) {
}
`.trim());
});

test('macro', () => {
  expect(sees.compile(`
(@macro -> (base (@dots xs))
        (return
          ((@dot xs reduce)
           (=>{} (x y)
                 (switch (typeof y)
                         (case "string"
                           (return ([ "@dot" x y)))
                         (case "number")
                         (case "object"
                           (return ([ "[]" x y)))))
           base)))
(-> foo bar "baz" 0 (-> a b))
`)).toBe(`
foo.bar['baz'][0][a.b];
`.trim());
});
