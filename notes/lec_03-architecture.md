---
title: "OS: architecture"
description: "lecture on operating system architecture design concerns, types,& pros/cons of various models."
keywords:
  - "operating systems"
  - "lecture notes"
  - "computer science"
  - "cs 450"
  - "illinois tech"
meta:
  byline: Andrew Chang-DeWitt
  published: "2025-09-02T00:00-06:00"
---

agenda

- os design
- access control
- local archs
- dist archs
- hw & os virt
- cloud computing
- wrap up

## OS design

divided by many approaches, but all have same base concerns:

- affected by hw, system type (batch vs time-shard, single vs multi
  user, etc.)
- two types of goals:
  1. user: convenient to use/learn, safe, & fast
  2. system: easy to design/impl/maintaint and flex, reliable, error
     free, & efficient

policy vs mech, where:

- _**def:** policy_
- _**def:** mechanism_

ex: cpu protection

this leads us to our first os design approach, _simple structure_.

> [!IMPORTANT]
>
> ## approach 1: simple struct
>
> a small, simple os w/ limited systems. grows into more complex
> structure as more needs are met.
>
> - lacks a well-defined structure (spaghetti code!)
> - no well-defined layers or modularization
>
> ### ex: MS-DOS
>
> - originally for most functionality in least space
> - kept growing as more features wanted, esp. as later versions of
>   windows were based on it
> - worked/necessary because hw of the time was v limited

> [!ASIDE]
>
> **Q:** how to describe separation of (difference between) policy & mechanism
> in OS design?
>
> **A:** policy establishes _what_ should be done, mechanism details _how_ it
> should be done

## access control

an important job of a modern OS (it was missing in OS's for first & second gen computers!) is safety, esp. regarding user application code & os code. we call this "user mode" & "kernal mode".

### user mode & kernal mode

- user mode:
  - exec for apps
  - no access to kernal's code & data
- kernal mode
  - privileged
  - used to exec os/kernal code
  - protects kernal's data from manip/corruption by user apps
- os mode switches using special machine instructions
- current mode is reflected in status register

### ex: intel's x86 arch

- protection model uses 4 privileges: rings 0-3
- a process always runs w/in one specific ring
- typically, only rings 0 & 3 are used (to maintain compat w/ other cpu archs)
- transition is done using interupt or other similarly privileged istructions
- in ring 0, full instruction set; in ring 3, limited instruction set

## local archs

we keep mentioning the _kernal_&mdash;what is it?

- _**def:** kernal_
  core code that manages essential services of the OS; should remain loaded in
  main mem whenever absolutely possible

how this kernal is designed dictates much of how an os works/performs/etc.

designs typ. split into one of a few approaches:

- monolithic kernal
- layered kernal
- microkernal

### monolithic kernal

kernal might be made of modules, but they all share common address space & have access to its entirety.

```
[ app 0 ]  [ app 1 ]  ... [ app n ]
    ^          ^              ^
    |          |              |
- - | - - - -  |  - - - - - - - - -  sys svc interface
    |          |              |
    v          v              v
[        service dispatcher       ]
    ^       ^    ^           ^
    |       |    |           |
    v       |    v           v
[ module ]  |[ module ]  [ module ]
     ^      |     ^  ^       ^
     |      |     |  |       |
     v      |     v  \----\  |
[ module ]<-/  [ module ] |  |
     ^                    v  v
     |                 [ module ]
     |                      ^
- - -|- - - - - - - - - - - | - - -  hw interface
     v                      v
[             hardware            ]
```

> [!TODO]
>
> finish this!

## dist archs

an os can be more than local&mdash;in fact there's a long history of os' that
run across multiple computers at once, treating them as though they were one
single computer as far as the user can tell.
- a truly distributed sys (e.g. Amoeba) makes dist of services across network transparent to client processes
- microkernal simplifies distributing server procs

today not used much due to massive perf overheads to manage multiple computers. instead, we tend to use a _communication middleware_ based approach:

- software that runs in user mode
- coordinates multiple computers work, typ. using client-server arch (although
  peer-to-peer models are becoming more and more common)

### client/server model

dedicated roles between computers in dist. os arch:

- server: provides services to clients
- client: runs processes according to server direction

### peer-to-peer model

- each os is own peer w/ no distinct role
- examples:
  - gnutella, tor (pure p2p)
  - napster (hybrid)
  - skype (superpeer)

### middleware

- comms middleware manages comms btwn clients & server
- computers/nodes are dist. across network
- each node runs a full OS, middleware runs as user app on each node

### examples of dist arch systems

- typ. web app--components _can_ all run on same computer, but typically exist
  on separate nodes that communicate via middleware
  - web server (presentation tier)
  - app server (business logic)
  - database (persistence node)
- netflix

## hw & os virt

## cloud computing

## wrap up
