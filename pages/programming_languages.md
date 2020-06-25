# Programming

## Two aspects of languages

1. Syntax
2. Semantics

Syntax is the rules of writing code, spelling and word order.

Semantics is the idea and meaning of code.

## Statically vs. Dynamically Typed

### Statically Typed

Languages are statically typed if variable types are known at compile time. This means that the programmer must explicitly specify each variable type.

The main advantage is that the compiler can carry out lots of checking, therefore catches bugs at an early stage.

For example C++ is statically typed:

```c++
int x = 5;
float y = 3.14f;
bool isHot = false;
char c = '&';
```

Other examples: C, Java, Rust, Go, Scala

### Dynamically Typed

The types of variables of dynamically typed languages are associated with runtime values,

And JavaScript is dynamically typed:

```javascript
var x = 5;
var y = 3.14;
var isHit = false;
var c = '&';
```

Other examples: Perl, Ruby, Python, PHP

## Strongly vs. Weakly Typed

This refers to whether values can be implicitly convert to other types.

**Strongly** typed means that values can **not** be converted to other types:

```c#
int x = 1;
string y = "2";
int z = x + y;  // This would fail
```

**Weakly** typed means that values can be converted to other types:

```c#
int x = 1;
string y = "2";
string z = x + y;  // "12"
```

Note that only some type conversion work. In the example above, int x was converted to a string.

## Operator Precedence

- **Precedence** determines which operator is evaluated first in an expression containing a mixture of different operators. Operators with higher precedence are evaluated before those with lower precedence.

- **Associativity** determines which operator is evaluated first in a series of the same operator. When an operator is **left-associative** (think "left-to-right"), operators in the left evaluate before those of the right.

### C# Operator Precedence Table

{% include cs_operator_table.html %}
