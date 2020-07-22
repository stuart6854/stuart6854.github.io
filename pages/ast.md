# Abstract Syntax Tree (AST)

## What is an Abstract Syntax Tree?

> An abstract syntax tree (AST) is a way of representing the syntax of a programming language as a hierarchical tree-like structure.

Essentially we can take the following code snippet:

{% highlight c %}
speed = 25
{% endhighlight %}

and convert it into a tree structure:

<aside>
<p>Another subtle semantic corner: We evaluate <em>both</em> operands before checking the
type of <em>either</em>. Say we had a function <code>say()</code> that prints its argument then
returns it. Consider:</p>
{% highlight c %}
say("left") - say("right");
{% endhighlight %}
<p>Our implementation prints both “left” and “right” before reporting the runtime
error. We could have instead specified that it checks the first operand before
even evaluating the other.</p>
</aside>

![tree structure](../images/tree_structure.png)

Wikipedia has a slightly different definition:

> An AST is usually the result of the syntax analysis phase of a compiler. It often serves as an intermediate representation of the program through several stages that the compiler requires, and has a strong impact on the final output of the compiler.

An AST enables us to step through the structure of a program and report any issues (like a linter or intellisense) or even change the code that is written (optimisation).

### Wikipedia Example

<aside>
<p>A. Starting with the full tree, evaluate the bottom-most operation, <code>2 * 3</code>.</p>
<p>B. Now we can evaluate the <code>+</code>.</p>
<p>C. Finally the <code>-</code>.</p>
<p>D. The final answer.</p>
</aside>

<image style="padding: 10px" width= "450px" src="../images/ast_wikipedia_example.png" alt="Wikipedia AST Example" />
An abstract syntax tree for the following code for the Euclidean algorithm:

{% highlight java %}
while (b != 0)
{
  if (a > b)
    a = a - b;
  else
    b = b - a;
}
return a;
{% endhighlight %}

<div style="clear: both;" ></div>

## Tree Terminology

Quick review of tree terminology:

- A _tree_ is a data structure which consists of one or more nodes organised as a hierarchy.
- The tree has one _root_, which is the top-most node.
- Every node, except the root, has a unique _parent_.
- A node without children is called a _leaf_ node.
- A node with one or more children that is not the root is called an _interior_ node.
- Child nodes can also be complete _subtrees_.

## Representation

> This is just an example for an imperative/c-like language

Typically, the top-hierarchy can bt split into two supertypes:

- Expression
- Statement

The program is a list of statements, The program being a statement itself.

You most probably want to have a class for each type of statement that extends from the statement-base class.

Typical list of statements:

- Statement Block (a list of statements)
- If/Else
- For (for loop with its initialisation statements, check expression, increment statements and block)
- While (check expression and block)
- Variable Declaration
- Assignment (includes +=, -=, ++, --, etc. You can wrap all in one class with an operator field, a LVal and an RVal)
- Function call (used on its own/unneeded return)

Typical list of expressions:
<ul>
<li>Binary Operation (anything that has 2 operands and 1 operator, ie. + - * / % | & && || == < > <= >=)</li>
<li>Unary Operation (anything that has 1 operand and 1 operator, ie. ~ !)</li>
<li>Function call (non-void ones/used as expression)</li>
<li>Conditional Expression (exp ? true_value : false_value)</li>
</ul>

Example Pseudocode:

{% highlight java %}
class IfElse extends Statement
{
  Expression condition;
  Statement ifBranch;
  Statement elseBranch;
}

class BinaryOp extends Expression
{
  BinaryOperator operator;  // +, -, *, etc.
  Expression left;          // Left operand
  Expression right;         // Right operand
}

class StatementBlock extends Statement
{
  List<Statement> statements;
}

class Assignment extends Statement
{
  AssignmentOperator assignOp;  // =, +=, -=, etc.
  // The lValue cannot be an arbitrary expression,
  // you will usually have a specific type for it
  LVal lValue;                  // Left Value
  Expression rValue;            // Right Value
}

{% endhighlight %}

### Visitor Pattern

> In object-orientated programming and software engineering, the visitor design pattern is a way of separating an algorithm from an object structure on which it operates. A practical result of this separation is the ability to add new operations to existing object structures without modifying the structures. It is one way to follow the open/closed principle.

Rather than spreading the code for a given traversal throughout the node's classes, the code is concentrated in a particular traversal class. This code is called by arranging for each node to

1. Accept a call from a visitor that performs the traversal
2. Call the visitor back using a method in that visitor that is customised to the node

#### Example Code

Nodes:
{% highlight c++ %}
class INode
{
public:
  virtual void accept(IVisitor& visitor_) = 0;
}

class IntNode : public INode
{
public:
  void accept(IVisitor& visitor_) override
  {
    visitor_.visit(*this);
  }
}

class WhileNode : public INode
{
public:
  void accept(IVisitor& visitor_) override
  {
    visitor_.visit(*this);
  }
}

{% endhighlight %}
Visitor:
{% highlight c++ %}
class IVisitor
{
public:
  void visit(IntNode& node_) = 0;
  void visit(WhileNode& node_) = 0;
}

class ConcreteVisitor : public IVisitor
{
public:
  void visit(IntNode& node_) override
  {
    // Do something useful
  }

  void visit(WhileNode& node_) override
  {
    // Do something useful, then...
    node_.exprNode.accept(*this);
    node_.block.accept(*this);
  }

}

{% endhighlight %}

## Expression Parsing

### Operator Precedence

- **Precedence** determines which operator is evaluated first in an expression containing a mixture of different operators. Operators with higher precedence are evaluated before those with lower precedence.

- **Associativity** determines which operator is evaluated first in a series of the same operator. When an operator is **left-associative** (think "left-to-right"), operators in the left evaluate before those of the right.

#### C# Operators Table

{% include cs_operator_table.html %}
