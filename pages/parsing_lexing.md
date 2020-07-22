# Parsing / Lexing

## Basic Lexing/Parsing Theory

### Lexing

The first phase when translating any language is _lexical analysis_. Lexical analysis, or _lexing_ for short, is the process of breaking up the source file into its constituents "words". These words, in the context if lexing, are known as _lexemes_. For example, consider the following line of code:

```nasm
mov    Sum, X      ; Perform the addition
```

```c++
class Rabbit
{
public:
    void say_hello();
};

void Rabbit::say_hello()
{
    std::cout << "Hello!" << std::endl;
}
```

The line contains four separate lexemes; _Mov_, _Sum_, (the comma), and _X_ (note that the whitespace and comments are automatically stripped away and do not count). See how much easier this makes the task. Right of the bat, the lexer allows the user to fill their code with as much whitespace and commenting as they want, and you never have to know about it. As long as the lexer can filter this content out and simply provide the lexemes, you get each isolated piece of code presented in a clean, clutter-free manner. But the lexer never does more than this.

The unfiltered source code, as it enters your assembler's processing pipeline, is called a _character stream_, because it's a stream of raw source code expressed as a sequence of characters. Once it passes through the first phase of the lexer, it becomes a _lexeme stream_, because each element in the stream is now a separate lexeme.

In addition to isolating and extracting lexemes, the real job of the lexer is to convert the lexeme stream to a _token stream_. _Tokens_, unlike lexemes, are not strings at all; rather, they're simple codes (usually implemented as integer) that tell you what exactly the lexeme is. For example, the line of code used in the last example, after being converted to a lexeme stream , looks like this (note that for simplicity everything is converted to uppercase by the lexer):

{% highlight nasm %}
MOV SUM , X
{% endhighlight %}

The new stream of lexemes is indeed easier to process, but take a look at the token stream (each element in the following stream is actually a numeric constant):

{% highlight c %}
TOKEN_TYPE_INSTR TOKEN_TYPE_INDENT TOKEN_TYPE_COMMA TOKEN_TYPE_IDENT
{% endhighlight %}

Just for reference, it might be easier to mentally process the token stream when it's listed vertically:

{% highlight c %}
TOKEN_TYPE_INSTR
TOKEN_TYPE_INDENT
TOKEN_TYPE_COMMA
TOKEN_TYPE_IDENT
{% endhighlight %}

<p>
Instead of physically dealing with the lexeme strings themselves, which is often only of limited use, you can instead worry about the token type. As you can see by looking at the original like of code, the token stream tells you that it consists of an instruction (TOKEN_TYPE_INSTR), and identifier (TOKEN_TYPE_IDENT), a comma (TOKEN_TYPE_COMMA) and finally another identifier. These token of course directly correspond to <i>Mov</i>, <i>Sum</i>, and <i>X</i>, respectively. This process of turning the lexeme stream into a token stream is known as <i>tokenization</i>, and because of this, lexers are often referred to as <i>tokenizers</i>.
</p>

> **NOTE**: Technically lexers and tokenizers are two different objects, but they work so closely together and are usually referred to and even implemented as a singular object.

### Parsing

The parser immediately follow the lexer and tokenizer in the pipeline, and has a very important job. Given a stream of tokens, the parser is in charge of piecing together its overall meaning when taken as a collective unit. So, although the tokenizer is in charge of breaking down the source file from a giant, unruly string of characters to a collection of easy-to-use tokens, the parser takes those tokens and builds them back up again, but into a far more structured view of the overall source code.

There are many approaches to parsing, and building a parser is easily one of the most complex aspects of building a compiler. Fortunately, certain methods of parsing are easier than others, and the easy ones can be applied quite effectively to the our assembler.

In a nutshell, the read groups of tokens until it finds a pattern between them that indicates the overall purpose of that particular token group. The process starts by reading a single token. Based on this initial token's type, you can predict what tokens should theoretically come next, and compare that to the actual token stream. If the next tokens match up the way you think they do, you can group the, as a logical unit and consider them valid and ready to assemble.

Imagine this fragment of code:

{% highlight c %}
Func MyFunc {
{% endhighlight %}

Ass you can see, this is the beginning of a function declaration. It's cut of just before the function's code begins, because all you're worried about right now is the declaration itself. After the lexer performs its initial breakdown of the character stream, the tokenizer will go to work examining the incoming lexemes and convert them to a token stream. The token stream for the previous line of code will consist of:

{% highlight c %}
TOKEN_TYPE_FUNC
TOKEN_TYPE_IDENT
TOKEN_TYPE_BRACKET
{% endhighlight %}

Notice that you can reserve an entire token simply for the _Func_ directive. This is common among reserved words; for example, a C tokenizer would consider the _if_, _while_, and _for_ keywords to each be separate tokens. Anyway, with the tokens identified, the parser will be invoked and the second step towards assembly will being.

<p>
The parser begins by requesting the first token in the stream from the tokenizer, which will return <i>TOKEN_TYPE_FUNC</i>. Based on this, the parser will immediately realise that a function declaration must be starting. This is how you predict which tokens must follow based on the first one read. With the knowledge of <i>Wolf Script</i> Assembly, we know that a function declaration consists of the _Func_ keyword, and identifier that represents the function's name, and the open bracket symbol. So, the following two token <i>must</i> be <i>TOKEN_TYPE_IDENT</i> and <i>TOKEN_TYPE_OPEN_BRACKET</i>. If either of these tokens is incorrect, or if they appear in the wrong order, you've detected a syntax error and can halt the assembly process to alert the users. If these two tokens are successfully read, on the other hand, you know the function declaration is valid and can record the function in some form before moving on to parse the next series of tokens.
</p>
Pseudo-code, which illustrates the basic parsing process for a function declaration:
{% highlight c++ %}
// Read the next token from the stream
Token CurrToken = GetNextToken();
// Is a function declaration starting?
if(CurrToken == TOKEN_TYPE_FUNC)
{
    // Look for a valid identifier
    if(GetNextToken() == TOKEN_TYPE_IDENT)
    {
        // The current lexeme is the function name, so save it
        string FuncName = GetCurrLexeme();

        // Make sure the open bracket is present
        if(GetNextToken() != TOKEN_TYPE_OPEN_BRACKET)
        {
            Error("'{' expected!");
        }
    }
    else
    {
        Error("Identifier expected!");
    }
}
// Check for remaining tokens
{% endhighlight %}

Once you've properly parsed a given group of tokens, you're all set to translate it. After parsing an instruction, for example, you can use the instruction lookup table to verify its operands and convert it to machine code. In the case of directives like _Func_, you add a new entry to the function table (which, if you recall stores information on the script's functions, like their entry points, parameter counts, and local data size).

## Basic String Processing

### Vocabulary

A _string_ is simply a sequence of _characters_. Each character represents one symbol provided by the ASCII character set, or whichever character set you happen to use. Other examples include Unicode, which uses 16-bits for each character rather than 8-bits for ASCII.

A _substring_ is defined as a smaller, contiguous chunk of a larger string. In the string _"ABCDEF"_, _"ABC"_, _"DEF"_, and _"BCD"_ are all examples of substrings. A substring is defined by to indices; the _starting index_ and the _ending index_. The substring data itself is defined as all characters between and including the indices.

Whitespace is usually defined as non-visible characters such as spaces, tabs, and line breaks, and can exist in any string. However, it is often important to distinguish between whitespace that includes line breaks, and whitespace that doesn't.

A common whitespace operation is _trimming_, also known as _clamping_ or _chomping_ wherein the whitespace on either or both side of a string is removed. Eg.

{% highlight c++ %}
// Original string
"    This is a padded string.    "

// Left trim removes all whitespace on a strings left
"This is a padded string.    "

// Right trim removes all whitespace on a strings right
"    This is a padded string."

// Full trim is the same as both a Left and Right trim
"This is a padded string."
{% endhighlight %}

Trimming is often done by or before the lexing phase to make sure extraneous whitespace if removed early in the pipeline.

Strings and characters can be group and categorized in a number of way. For example, if a character is within the range of 0-9, you can say that character is a numeric digit. If it is within the range of a-z or A-Z, you can say it's an alphabetic character. Additionally, if it's within the range 0-9, a-z or A-Z, you can call it an _alphanumeric_, which is the union of both numeric digits and alphabetic characters.

This sort of classification can be extended to strings as well.

{% highlight c++ %}
// Numeric string
"1234" or "123456"
{% endhighlight %}

By prefixing an optional negation sign (-) to a numeric string, you can easily extend the class of numeric string to _signed_ numeric strings.

By further adding the allowance of one radix point (.) somewhere within the string (but not before the sign, if present, and not after the last digit), you can create another class called _signed floating-point_ numeric strings.