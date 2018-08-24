# sees
Sees is an AltJS represented as S-expression.

## features(aimed)
- Bijection-able AST mapping

## Translate example
``` lisp
(const (hello "Hello!"))

(function fact (n)
  (if (<= n 0)
      (return 1)
      (return (* n (fact (- n 1))))))

((@dot console log) (fact 5))
```

↓↓↓

``` js
const hello = "Hello!";
function fact(n) {
  if (n <= 0)
    return 1;
  else
    return n * fact(n - 1);
}
console.log(fact(5));
```

Supported syntax is [here](./test.js)
