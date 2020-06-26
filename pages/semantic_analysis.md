---
title: "Semantic Analysis"
---

Semantic Analysis judges whether the syntax structure of an Abstract Syntax Tree (AST) actually has valid meaning according to the rules of the languages grammar.

Semantic Analysis is usually carried out in a compilers front-end, after the parser has built an AST.

The following are usual tasks carried out by a semantic analyzer:-

- Scope resolution
- Type checking
- Array-bound checking

## Semantic Errors

Here are some semantic errors that a semantic analyzer should recognize:-

- Type mismatch
- Undeclared variable
- Reserved identifier misuse
- Multiple declaration of variable in a scope
- Accessing an out of scope variable
- Actual and formal parameter mismatch

### Undeclared variables

Checking that variables are declared can be implemented with the following algorithm:-

1. Go over all variable declarations
2. For every variable declaration you encounter, collect all necessary information about the declared variable
3. Store the collected information in some stash for future reference by using the variable's name as a key
4. When you see a variable reference, such as in the assignment statement <code>x = x + y</code>, search the stash by the variable's name to see if the stash has any information about the variable. If it does, the variable has been declared. If it doesn't, the variable has not been declared yet, which is a semantic error.

Before that, you should answer a few question:

1. What information about variables do we need to collect?
2. Where and how should we store the collected information?
3. How do we implement the go over all variables step?

Answering question 1, here are some important parts we need:-

- Name (we need to know the name of the declared variable because later we will be looking up variables by their names)
- Category (we need to know what kind of an identifier it is: <em>variable</em>, <em>class/type</em>, <em>function</em>, etc.)
- Type (this is needed for type checking)

## Scoping

## Symbol Table

A symbol table associates identifiers in a program with related data such as whether the identifier is the name of a variable, function, constant, or class/Type; and if its a variable, what its value is, etc.

Typical operations include :-

- "Insert" operation when a variable is declared, adding and entry with the variable type and it initial value, etc.
- "Find" operation when a variable is referenced, to see the variables value at the present time.
- "Insert" or "Update" operation to change a variables value.
- "Delete" operation when a variable goes out of scope.
