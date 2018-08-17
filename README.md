# sees
Sees is an S-expression based AltJS.

## About

``` lisp
(const (hello "Hello!"))

(function fact (n)
  (if (<= n 0)
      (return 1)
      (return (* n (fact (- n 1))))))

((. console log) (fact 5))
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
