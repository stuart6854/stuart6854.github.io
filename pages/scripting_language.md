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

### Example Code

The following high-level C++ code:

```c++
int get_number()
{
    int x = 0;

    for(int i = 0; i < 10; i++)
        x += i;

    if(x < 5)
        x += 5;
    else
        x -= 5;

    return x;
}

int main()
{
    return get_number();
}
```

Becomes:

```assembly
get_number():
        push    rbp
        mov     rbp, rsp
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
        mov     eax, DWORD PTR [rbp-4]
        pop     rbp
        ret
main:
        push    rbp
        mov     rbp, rsp
        call    get_number()
        nop
        pop     rbp
        ret
```

When compiled into assembly language (no optimisation).

## Assembler

## Virtual Machine

[1]: https://en.wikipedia.org/wiki/Stack_(abstract_data_type)
