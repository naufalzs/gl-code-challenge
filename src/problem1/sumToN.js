const N = 5;

// by accumulate number from 1 to n using loop
var sum_to_n_a = function (n) {
  let sum = 0;
  let i = 1;
  while (i <= n) {
    sum += i;
    i++;
  }
  return sum;
};

// using recursive
var sum_to_n_b = function (n) {
  if (n <= 1) return n;
  return n + sum_to_n_b(n - 1);
};

// using math formula
var sum_to_n_c = function (n) {
  return (n * (n + 1)) / 2;
};

console.log(sum_to_n_a(N));
console.log(sum_to_n_b(N));
console.log(sum_to_n_c(N));
