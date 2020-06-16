# Scripting Language

- [Assembly](#assembly)
- [Assembler](#assembler)
- [Virtual Machine](#virtual-machine)

## Call Stack

A _Call Stack_ is a [stack data structure](1) which holds information about the active functions of a computer program. Proper maintenance of the call stack is very important for a program to function correctly.

A call stack has several purposes, all mostly related, but the main purpose is to keep track of the return address/index of each active function. An active function, a function that has been called but is yet to complete execution, must return control to the point that it is called. The stack structure is used since function calls can be stacked, or even called recursively.

### Structure

<image align="right" style="padding: 10px" width= "300px" src="../images/call_stack.png" alt="Call Stack" />

Call stacks are made up of _Stack Frames_ (also called _activation records_ or _activation frames_). Each stack frame corresponds to a function call which has not been terminated with a return yet. For example, if a function `DrawSquare()` where to call function `DrawLine()`, the `DrawLine()` stack frame would be on top of the `DrawSquare()` stack frame.

The stack frame on the top should always correspond to the currently active/executing function. The stack frame will usually be made up of the following items (in push order):

- the argument/parameter values passed to the function (if any)
- the return address back to the function caller (eg. `DrawLine()` would have an address back to `DrawSquare()`)
- space for local variables of the function (if any)

### Stack Frame and Frame Pointers

<image align="right" style="padding: 10px" width= "175px" src="../images/call_stack_addresses.png" alt="Call Stack Addresses" />

Since stack frames can differ in size between function calls, decrementing the **stack pointer** a fixed amount after popping a stack function won't work. So, when a function returns, the stack pointer is instead moved to the **frame pointer**, which is the position of the stack pointer just before a function call.

Locations for all of a stack frame's fields can be defined as _relative_ to the top of the stack as negative indices, or _absolute_ to the bottom of the stack as positive indices.

## Assembly

### Basic Elements

Typically, assembly languages consist of 3 types of instruction statements which are used to define a programs operations:

- Opcode mnemonics
- Data definitions
- Assembly directives

### x86 Assembly Example Code

The following high-level C++ code:

```c++
int get_number(int y)
{
    int x = 0;

    for(int i = 0; i < 10; i++)
        x += i;

    if(x < 5)
        x += 5;
    else
        x -= 5;

    return x + y;
}

int main()
{
    return get_number(20) - 5;
}
```

Becomes:

```assembly
get_number(int):
        push    rbp
        mov     rbp, rsp
        mov     DWORD PTR [rbp-20], edi
        mov     DWORD PTR [rbp-4], 0
        mov     DWORD PTR [rbp-8], 0
.L3:
        cmp     DWORD PTR [rbp-8], 9
        jg      .L2
        mov     eax, DWORD PTR [rbp-8]
        add     DWORD PTR [rbp-4], eax
        add     DWORD PTR [rbp-8], 1
        jmp     .L3
.L2:
        cmp     DWORD PTR [rbp-4], 4
        jg      .L4
        add     DWORD PTR [rbp-4], 5
        jmp     .L5
.L4:
        sub     DWORD PTR [rbp-4], 5
.L5:
        mov     edx, DWORD PTR [rbp-4]
        mov     eax, DWORD PTR [rbp-20]
        add     eax, edx
        pop     rbp
        ret
main:
        push    rbp
        mov     rbp, rsp
        mov     edi, 20
        call    get_number(int)
        sub     eax, 5
        pop     rbp
        ret
```

When compiled into assembly language (no optimisation).

Another (commented) example:

```assembly
_foobar:
    ; ebp must be preserved across calls. Since
    ; this function modifies it, it must be
    ; saved.
    ;
    push    ebp

    ; From now on, ebp points to the current stack
    ; frame of the function
    ;
    mov     ebp, esp

    ; Make space on the stack for local variables
    ;
    sub     esp, 16

    ; eax <-- a. eax += 2. then store eax in xx
    ;
    mov     eax, DWORD PTR [ebp+8]
    add     eax, 2
    mov     DWORD PTR [ebp-4], eax

    ; eax <-- b. eax += 3. then store eax in yy
    ;
    mov     eax, DWORD PTR [ebp+12]
    add     eax, 3
    mov     DWORD PTR [ebp-8], eax

    ; eax <-- c. eax += 4. then store eax in zz
    ;
    mov     eax, DWORD PTR [ebp+16]
    add     eax, 4
    mov     DWORD PTR [ebp-12], eax

    ; add xx + yy + zz and store it in sum
    ;
    mov     eax, DWORD PTR [ebp-8]
    mov     edx, DWORD PTR [ebp-4]
    lea     eax, [edx+eax]
    add     eax, DWORD PTR [ebp-12]
    mov     DWORD PTR [ebp-16], eax

    ; Compute final result into eax, which
    ; stays there until return
    ;
    mov     eax, DWORD PTR [ebp-4]
    imul    eax, DWORD PTR [ebp-8]
    imul    eax, DWORD PTR [ebp-12]
    add     eax, DWORD PTR [ebp-16]

    ; The leave instruction here is equivalent to:
    ;
    ;   mov esp, ebp
    ;   pop ebp
    ;
    ; Which cleans the allocated locals and restores
    ; ebp.
    ;
    leave
    ret
```

[Function Prologue](https://en.wikipedia.org/wiki/Function_prologue#Epilogue)

### My Custom Assembly Language

My own custom assembly language is based, somewhat, on x86 Assembly.

#### Pointers

```assembly
fp      ; Frame pointer
sp      ; Stack pointer
```

#### Registers

```assembly
rv      ; The return value register
pv1     ; The first parameter value
pv2     ; The second parameter value
```

#### Syntax

```assembly
#directive      ; A hash symbol denotes a directive. Directives are used to by the assembler to during preprocessing. It could be used to set a setting, etc.

function_name:
        ; A identifier and colon declares a function or label

label_abc:
        ; Instructions here

function_with_params(int, float):
        ; Instructions here
        mov     sf+1, pv1       ; Move the parameter values from the register to the stack frames local data
        mov     sf+2, pv2
        mov     rv, sf+1
        add     rv, sf+2        ; Adds the two params and leaves the result in the return register

main:
        ; This function is the programs entry point

.label_name:
        ; Although not required, it should be considered standard for labels to be prefixed with a dot
```

## Assembler

## Virtual Machine

[1]: https://en.wikipedia.org/wiki/Stack_(abstract_data_type)
