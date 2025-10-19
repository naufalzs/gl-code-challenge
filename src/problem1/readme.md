# Problem 1: Three ways to sum N

## Task

Provide 3 unique implementations of the following function in JavaScript

### **Input:**

`n` – any integer

_Assuming this input will always produce a result less than_ `Number.MAX_SAFE_INTEGER`.

### **Output:**

Return the summation to `n`, i.e.  
`sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`

```js
var sum_to_n_a = function (n) {
  // your code here
};

var sum_to_n_b = function (n) {
  // your code here
};

var sum_to_n_c = function (n) {
  // your code here
};
```

## Solution

I choose 3 approach, first using loop, second using recursive, and last using math formula `sum = (n(n+1))/2`. I save it in `sumToN.js` file, you can try the code by changing the N variable then run it with node.js
