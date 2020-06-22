# Wolf Script

## The WolfScript Language

### High-level Language

#### Static typing

WolfScript is statically typed. Variables must be defined with a type, a single variable can only hold data of its assigned type. Type-checking will be done at compile time, so any attempts to assigned a value to a variable of the wrong type with throw an error.

### Memory Management

### Built-in Types

- Booleans
  
  ```c#
  bool x = true;
  ```

- Integer
  
  ```c#
  int x = 123;
  ```

- Float
  
  ```c#
  float x = 3.1415;
  ```

- String
  
  ```c#
  string x = "Hello World!";
  ```

## Parsing

### Grammar Rules

Below is WolfScripts grammar defined in a tweaked version of **Backus-Naur form**.

Each rule is a name, followed by an arrow (->), followed by its sequence of symbols. Terminals are quoted strings, non-terminals are lowercase words.

#### Syntax

```c
rule_name           -> non_terminal "terminal" ;
production_series   -> this | "or_this" ;
grouping            -> ( this | "or_this" | or_this_2 ) "with this" ;
recursion           -> "zero_or_more"* "one_or_more"+ ;
optional            -> i_am_optional? "i_am_required" ;
```

#### Rules

```c
program         -> declaration* EOF ;

declaration     -> classDecl
                 | funDecl
                 | varDecl
                 | statement ;
classDecl       -> "class" IDENTIFIER "{" ( varDecl | funDecl )* "}" ;
funDecl         -> TYPE IDENTIFIER "(" parameters? ")" block ;
varDecl         -> TYPE IDENTIFIER ( "=" expression )? ";" ;

statement       -> exprStmt
                 | forStmt
                 | ifStmt
                 | printStmt
                 | returnStmt
                 | whileStmt
                 | block ;

exprStmt        -> expression ";" ;
forStmt         -> "for" "(" ( varDecl | exprStmt | ";" )
                        expression? ";" expression? ")" statement ;
ifStmt          -> "if" "(" expression ")" statement ( "else" statement )? ;
printStmt       -> "print" expression ";" ;
returnStmt      -> "return" expression? ";" ;
whileStmt       -> "while" "(" expression ")" statement ;
block           -> "{" declaration "}" ;

expression      -> assignment ;
assignment      -> IDENTIFIER "=" assignment
                 | logic_or ;
logic_or        -> logic_and ( "||" logic_and )* ;
logic_and       -> equality ( "&&" equality )* ;
equality        -> comparison ( ( "!=" | "==" ) comparison )* ;
comparison      -> addition ( ( ">" | ">=" | "<" | "<=" ) addition )* ;
addition        -> multiplication ( ( "-" | "+" ) multiplication )* ;
multiplication  -> unary ( ( "/" | "*" ) unary )* ;
unary           -> ("!" | "-" ) unary | call ;
call            -> primary ( "(" arguments? ")" )* ;
primary         -> "true" | "false" | "nil"
                 | NUMBER | STRING
                 | IDENTIFIER
                 | "(" expression ")" ;

arguments       -> expression ( "," expression )* ;
parameters      -> IDENTIFIER ( "," IDENTIFIER )* ;
```

## Syntax

```c#
class Animal
{
    int age;

    void set_age(int age_)
    {
        age = age_;
    }

    void sit()
    {
        print "Animal sitting.";
    }
}

class Dog
{
    void sit()
    {
        print "Dog sitting.";
    }
}

int main()
{
    Animal pet = Dog();
    pet.set_age(5);
    pet.sit();

    return 0;
}
```
