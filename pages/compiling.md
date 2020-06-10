# Compiling

## Overview

Compilers are generally built as two separate "ends", which are separated by an _I-code module_. I-code is a way to represent a program's source code in a way that independent of any source or target language, allowing a compiler to be retargeted or supportive if multiple high-level languages.

```text
                Front End                       Back End
Source  |   High-Level Language -> I-Code <- Target Language    |   Target
                Analysis                        Synthesis
```

### Front End

The front end of the compiler is responsible for loading the source code, preprocessing it, lexing it into token and lexeme stream, and parsing it into an equivalent I-code representation. Once the front end has done it job, any trace of human interaction will have been stripped away, leaving a structured, validated, in-memory version of the source code that can easily be translated to assembly.

The front end is the most complex part of a compiler by far. It can be broken down into multiple modules: Loader, Preprocessor, Lexical Analyser, Parser.

```text
MyScript.ws -> Loader -> Preprocessor -> Lexical Analyser -> Parser
```

#### Loader Module

The loader module is responsible for initially loading the source code from file into memory.

##### Storing the Source Code

When it comes to storing the source code in memory, the easiest option is to store it all as a single string. This has the advantage of it being easier to lex a contiguous stream of characters than some other, more complex data structure.

The best, recommended, option is to store each line as separate strings in an array/list/vector. This method allows you to easily track the current lines string and line-number, allowing for verbose error messages.

##### Internalisation of the Source Code

Virtually every plain text file in the world is stored using the ASCII format, but the specific method for denoting line breaks is often different from one platform to the next. To make things easier to manage internally, and to aid in portability, the loader will be responsible for ensuring that the in-memory version of the source code uses a consistent representation for line breaks and newlines.

#### Preprocessor Module

Once the loader module has loaded the source code into memory, we have to opportunity to filter and convert the source code to a more convenient format via the preprocessor. Having the preprocessor module between the loader and the lexical analyser, we can perform any sort of preprocessing operation we want transparently.

#### Lexical Analyser Module

The lexer is responsible for converting raw source code into a more usable format for the parser. This module doesn't do anything on its own, however; this module actually works in parallel with the parser. The parser is responsible for invoking the lexer to return the next token in the stream, so the lexer doesn't actually execute until the parser explicitly calls it.

#### Parser Module

While also being the most complex aspect of the compiler, the parser also takes centre stage among the various modules of the front end, and it its final stage. The parser is responsible for converting the stream tokens and lexemes produced by the lexical analyser into I-code, which is then converted to assembly by the back end.

### I-Code Module

The front and back ends never communicate with each other directly, but rather by interfacing with the command I-code module. Once the front end has produced the I-code, it's entirely removed from the picture (conceptually). The focus then shifts exclusively to the back end, which is responsible for translating the I-code into the target format (some form of assembly, bytecode, etc.).

The I-code module is really just a stream of instructions, very similar to the nature of a assembled instruction stream. The parser will use a number of I-code interface functions to generate instructions within this stream and define their operands, which will make the code emitter's job very easy.

### Back End

The back end is responsible for converting the contents of the I-code module to assembly and invoking the Assembler to create a ready-to-use executable from it.

#### Code Emitter Module

The compiler doesn't generate actual executables; rather it generates ASCII-formatted assembly files, and relies on an Assembler to finish the job. These two jobs could be combined into a single program, but this way is easier to grasp and gives the option of hand-tuning the compiled assembly output before passing it to the Assembler.

#### Assembler

The second module of the compiler's back end is an entirely separate program. Once the code emitter has done it's job, a text file containing assembly code will be ready to feed into the Assembler to produce the final executable. Therefore, the last step in the compiler's lifespan is to briefly invoke the Assembler to carry out this final task. The assembly file is then deleted leaving the user with the original source file, and a newly created executable file. The the end user, this process if transparent.
