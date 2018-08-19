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
((. console log) "hello")
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
  (block
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
  (block
    "yo"
    123)
  (block
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
    "0")
  (case 1)
  (case 2
    "1 or 2")
  (default
    "other"))
`)).toBe(`
switch (a + b) {
case 0:
    '0';
case 1:
case 2:
    '1 or 2';
default:
    'other';
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
(@ 1 2 . (... a))
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
(# (a 1) (b 2) c (... d))
`)).toBe(`
({
    a: 1,
    b: 2,
    c,
    ...d
});
`.trim());
});

test('destructuring binding', () => {
  expect(sees.compile(`
(var ((@ a b) c))
`)).toBe(`
var [
    a,
    b
] = c;
`.trim());
});
