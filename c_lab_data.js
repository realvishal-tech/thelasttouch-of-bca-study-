/**
 * BCA STORE - C Programming Lab & Viva Knowledge Base
 * This file contains practical questions, lab programs, and viva-voce answers.
 */

const C_LAB_KNOWLEDGE = {
  // C Lab Basics
  "c lab file extension": "The extension for a C source file is .c, and for a compiled header file, it is .h.",
  "what is a compiler in lab": "A compiler (like GCC or Turbo C) translates the human-readable source code into machine-executable object code.",
  "stdio.h in lab": "Standard Input Output header file; required for using printf() and scanf() functions.",
  "conio.h": "Console Input Output header file; often used in Turbo C for functions like clrscr() and getch().",
  "main function significance": "The main() function is the entry point of every C program. Execution always starts from here.",
  "syntax error vs logical error": "Syntax errors are grammar mistakes in code (e.g., missing semicolon). Logical errors are mistakes in the program's reasoning (e.g., wrong formula).",

  // Common Lab Programs (Logic)
  "program to swap two numbers": "To swap two numbers, you can use a temporary third variable: temp = a; a = b; b = temp;",
  "swap without third variable": "Logic: a = a + b; b = a - b; a = a - b;",
  "check even or odd": "Logic: if(n % 2 == 0) then even, else odd.",
  "calculate simple interest": "Formula: SI = (Principal * Rate * Time) / 100;",
  "area of circle": "Formula: Area = 3.14 * radius * radius;",
  "check leap year": "Logic: A year is leap if it's divisible by 400 or (divisible by 4 and not 100).",
  "find largest of three": "Use nested if-else or logical AND: if(a>b && a>c) largest is a...",
  "factorial using loop": "Logic: fact = 1; for(i=1; i<=n; i++) fact = fact * i;",
  "fibonacci series": "Logic: Generate next term by adding previous two: next = t1 + t2; t1 = t2; t2 = next;",
  "reverse a number": "Logic: rev = rev * 10 + (num % 10); num = num / 10; in a while loop.",
  "palindrome number": "A number is palindrome if its reverse is equal to the original number.",
  "armstrong number": "A number where the sum of cubes of its digits equals the number itself (e.g., 153).",
  "prime number check": "A number is prime if it is only divisible by 1 and itself. Check from 2 to n/2.",

  // Arrays & Strings (Practical)
  "array declaration": "Syntax: data_type array_name[size]; e.g., int marks[50];",
  "linear search": "Searching for an element by comparing it sequentially with every element in the array.",
  "binary search requirement": "Binary search requires the array to be sorted in ascending or descending order first.",
  "matrix addition": "To add two matrices, add their corresponding elements: C[i][j] = A[i][j] + B[i][j].",
  "null character": "The '\\0' character used to mark the end of a string in C.",
  "strlen vs sizeof": "strlen() gives the number of characters in a string; sizeof() gives the total memory allocated for the array.",
  "strcpy function": "Used to copy one string into another: strcpy(destination, source);",
  "strcmp function": "Compares two strings; returns 0 if they are identical.",

  // Functions & Pointers (Viva)
  "recursion in c": "A process where a function calls itself to solve smaller instances of the same problem.",
  "call by value": "Passing a copy of the actual value to the function. Changes inside the function do not affect the original variable.",
  "call by reference": "Passing the address of the variable. Changes inside the function directly affect the original variable.",
  "pointer definition": "A variable that stores the memory address of another variable.",
  "dangling pointer": "A pointer pointing to a memory location that has been freed or deleted.",
  "null pointer": "A pointer that does not point to any valid memory address (assigned NULL).",

  // Structures & Files
  "structure vs union": "Structure allocates separate memory for each member. Union shares the same memory for all members, saving space.",
  "fopen modes": "'r' for read, 'w' for write (overwrites), 'a' for append (adds at end).",
  "fclose significance": "Closing a file ensures all data is saved (flushed) and system resources are released.",
  "eof": "End Of File; a constant used to detect the end of a file during reading.",

  // Viva Questions
  "is c case sensitive": "Yes, C is highly case-sensitive. 'Main' and 'main' are treated differently.",
  "keyword count": "Standard ANSI C has 32 keywords.",
  "why is c called middle level": "Because it combines the features of high-level languages (like English-like syntax) with the efficiency of low-level languages (like direct memory access).",
  "what is a token": "The smallest individual unit in a C program, such as keywords, identifiers, constants, and operators."
};

// Merge into the global knowledge base
if (typeof BCA_BOT_KNOWLEDGE !== 'undefined') {
  Object.assign(BCA_BOT_KNOWLEDGE, C_LAB_KNOWLEDGE);
}
