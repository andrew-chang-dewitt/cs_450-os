---
title: "OS: processes & threads"
description: "lecture on processes, threads, & how they work."
keywords:
  - "operating systems"
  - "proccesses"
  - "threads"
  - "systems programming"
  - "lecture notes"
  - "computer science"
  - "cs 450"
  - "illinois tech"
meta:
  byline: Andrew Chang-DeWitt
  published: "2025-09-04T00:00-06:00"
---

agenda:

- proccesses
  - lifecycle
  - context switching
  - cooperation
- threads
  - implementation
  - in Java
- wrap-up

## proccesses

_**def:** process_&mdash;the execution of a program on a processor; a
dynamic sequence of actions associated w/ corresponding state changes;
complete state info of prog's operating resources. (_alias: task_)

### virtual processors

- os assigns each process a virtual processor in multiprogramming
- parallel processing occurs if each virt procer is mapped to real
  procer or CPU core
- quasi-parallel/concurrent processing happens when each real processor
  is assigned only one virt procer at a time & context switches occur

## process lifecycle

> [!TODO]
>
> catch up from 8 to 10...

> [!ASIDE]
>
> Q: in most OS, each proc has own...
>
> 1.  addr space
> 2.  open files
> 3.  kernal stack
> 4.  all of them
>
> A: all of them

## process context switching

> [!TODO]
>
> catch up from 12 to 17...

### unix process creation - fork

- proc in unix created through `fork()` call by parent
- child proc inherits **copy** of parent's env, including:
  - all open files & network conn's
  - env vars
  - cwd
  - data segments
  - code segments
- using sys call `execve()` new prog can be loaded into child proc

see [shlab from CS
351](https://github.com/andrew-chang-dewitt/cs_351-lab_04-shlab) forsome examples.

> [!TODO]
>
> catch up from 25 to 30...

> [!ASIDE]
>
> Q: When a child proc completes exec, but parent is still exec, then the child proc is known as:
>
> 1. orphan
> 2. zombie
> 3. body
> 4. dead
>
> A: (1) zombie


## process context switching

## process cooperation

## threads

## threads implementation

## threads in Java

## wrap-up
