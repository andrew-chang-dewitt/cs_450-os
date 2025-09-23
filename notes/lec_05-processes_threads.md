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

- OS assigns each process a virtual processor in multiprogramming
- parallel processing occurs if each virt procer is mapped to real
  procer or CPU core
- quasi-parallel/concurrent processing happens when each real processor
  is assigned only one virt procer at a time & context switches occur

### pocs & resources

procs compete for sys resources

1 cpu, multiple procs; one way of handling:

- alernate procs every few milliseconds
  - creates illusion of parallel processing
  - in btwn proc switches occur (_context switch_)

### proc context

_**def:**_ the complete state info for a proc

```
+-----------------------------------------+
| process       +-----------------------+ |
|               |     h/w context       | |
| [data (heap)] | [cpu reg] [ mmu reg ] | |
|               +-----------------------+ |
| [prg code   ] [file info/access perms ] |
|                                         |
| [stack      ] [kernal stack           ] |
+-----------------------------------------+
```

OS manages process tables, storing all info required for proc mgmt

- an entry in the table is called a _Process Control Block (**PCB**)_ & contains many things, including...
  - program counter (_PC_)
  - proc state
  - priority
  - cpu time consumed since proc started
  - proc id (_PID_) & parent proc id (_PID_)
  - assigned resources (e.g. files/file descriptors)
  - current register contents (depending on processor)

illustration of process image in virtual memory:

```
+-----+    .+-----+  /. +-----+.....+-----+.....+------------------------+
|     |   . |     |  .  | PCB |     | id  |     | - num id               |
| OS  |  .  |kern.|  .  |     |     +-----+.    | - parent id            |
|     |  .  |addr.| {   +-----+.    |cpu  | .   | - user id              |
+-----+  .  |space|  .  |stack| .   |state|  .  | - etc.                 |
|/////| .   |     |  .  |     |  .  |info |   ..+------------------------+
+-----+.    +-----+  /. +-----+  .  +-----+.    | - user-visble reg      |
| p1  |     |     |  .  |data |  .  |ctrl | .   | - ctrl & stat. reg     |
|     |     |user |  .  |     |   . |info |  .  | - PC & SP              |
+-----+.    |addr.|  .  +-----+    .+-----+.  . | - etc.                 |
|/////| .   |space| {   |prog.|     |stack| .  .+------------------------+
+-----+  .  |     |  .  |code |     |     |  .  | - sched & state info   |
| p2  |  .  |     |  .  |     |     |     |  .  | - links to other procs |
|     |  .  |     |  .  |     |     |     |  .  | - mem limits           |
|     |  .  |     |  .  |     |     |     |  .  | - open files           |
|  ___|   . |     |  .  |     |     |  ___|   . | - etc.                 |
|__\       .+-----+  /. +-----+     |__\       .+------------------------+
```

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

## process lifecycle

procs created through sys call, `fork()` in Unix & `CreateProcess()` in Windows. both do roughly the following:

1. assign PID
2. allocate physical processor, main mem., & other resources
3. load prg code & data into mem
4. create PCB entry
5. load proc context & start it

terminating a process can happen because...

- normal exit (e.g. done processing)
- error exit (req by programmer), or fatal error (not requested)
- terminated by another process (killed)

processes change state during exec:

- **new**: proc being created
- **ready**: proc waiting to be assigned
- **running**: proc instructions being executed
- **waiting**: proc waiting for some event
- **terminated**: proc done

```
 [new] ---+ admitted    exit +-->[terminated]
          |                  |
          |    interrupt     |
          |   +---------+    |
          v   v         |    |
         [ready]       [running]
          ^   |         ^    |
          |   +---------+    |
          |   sched. disp.   |
i/o event |                  | wait i/o or
     done +---- [waiting] <--+ event
```

### proc creation

some example scenarios:

- system boots: when sys init'ed, several bg procs (or _daemons_) are started
- user req to run app: typing command in terminal or clicking in gui, user launches new proc
- existing proc spawns child proc: web server main proc creates new proc for each request being handled

### unix

much of this stuff is specific to an OS (although similar patterns are observable across most, if not all)

#### proc hierarchy & init proc

unix has tree-like proc struct, giving hierarchy:

- each proc has PID from OS
- OS has special processes:
  - scheduler (PID 0): prev called swapper, also known as idle proc
  - mem mgmt proc for swapping
  - init (PID 1): called launchd in macOS; ancestor of all procs

```
               [root]
                 |
      +----------+-------+
      |          |       |
[pagedaemon] [swapper] [init]
                 |       |
                 |       +---------+
                 |       |         |
             [user 1 ] [user 2] [user 3]
                                   |
                          +--------+-----+
                          |        |     |
                        [...]    [...] [...]
                                   |
                                +--+--+
                                |     |
                              [...] [...]
                                |
             +-----+-----+-----++----+
             |     |     |     |     |
           [...] [...] [...] [...] [...]
```

#### process creation via `fork`

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

### process termination

- regular completion, with or w/out error code: proc voluntarily exectutes an `exit(err)` sys call to tell OS it is done
- fatal error (uncatchable or uncaught)
  - service errors: non mem left for alloc, i/o err, etc.
  - total time limit exceeded
  - arithmetic error, out-of-bound mem access, etc.
- killed by another process via kernal

### process pause/dispatch

- i/o wait
  - OS/gc triggered (syscall)
  - proc invokes an i/o sys call that blocks waiting for i/o device: OS/gc puts proc in "waiting" stat & dispatches another proc to CPU
- preemptive timeout
  - hardware interrupt triggered (e.g. timer)
  - proc receives a timer interrupt & relinquishes control back to OS, who puts proc in "ready" stat & dispatches another proc to CPU
  - _not the same as "total time limit exceeded"_ which leads to termination

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

_**def:**_ when cpu switches between processes, the information used by each process must change as well

- requires saving mem. state of running proc before loading new proc state
- time to switch is overhead, no useful work can be done
- switching time is dependent on hw support

step by step:

1. save cpu context, including pc & regs
2. update proc state ("ready", "blocked", etc.) & other related fields of PCB
3. move PCB to appropriate queue
4. Select another proc for exec, decision made by cpu sched. algo of OS
5. update PCB of selected proc (change state to "running")
6. update mem mgmt structs
7. restore cpu context to values contained in new PCB

```

    proc A               OS                 proc B
     | |                                      |
     | |   +-{interrupt}-+                    |
     | |   |             |                    |
     | |   |             v                    |
     | |   |   [ save state in PCB_A ]        |
 \.. -x- --+             |                    |
 .    |                  v                    |
 .    |        [ load state in PCB_B ]        |
 .    |                  |                    |
 .    |                  +--{interrupt}----> -x- ..\
      |                                      | |   .
 i    |                                      | |  exec
 d    |                                      | |   .
 l    |                  +--{interrupt}----> -x- ..\
 e    |                  |                    |
 .    |                  v                    |
 .    |        [ save state in PCB_B ]        |
 .    |                  |                    |
 .    |                  v                    |
 \.. -x- <-+   [ load state in PCB_A ]        |
     | |   |             |                    |
     | |   |             |                    |
     | |   +-{interrupt}-+                    |
```

## process cooperation

indpt. proc cannot affect or be affected by exec of other proc--how to communicate or work together on shared goal in concurrent/multi-proc programming then?

cooperating procs can:

- share info
- speed up computation by sharing workloads
- behave in modular ways, thus allowing each to focus only on own job

> [!WARNING]
>
> cooperation btwn procs can lead to sync issues & race conditions

### inter-proc communication (IPC)

mechanisms for for procs to comm & sync their actions:

1. shared mem: using same address space & shared variables
2. message passing: pass info w/out sharing address space

#### message passing

relies on `send(msg)` & `receive(msg)` operations

if procs `P` & `Q` wish to comm, then need to:

- establish comm link
- exchange messages via `send`/`receive`

two types:

1. direct comm&mdash;procs must name eachother explicitly:
   - `send(P, message)`
   - `receive(Q, message)`
2. indirect comm&mdash;messages are passed to & received from mailboxes (aka _ports_):
   - `send(A, message)`
   - `receive(A, message)`

_messages can be sent in **blocking** or **non-blocking**_ fashion (e.g. _sync_ or _async_)

_messages can be **buffered**_&mdash;made to wait in a queue of some length, which then determines sender behaviour when sending:

- **zero capacity**: queue length of 0
  sender must wait for reciever before sending additionall messages
- **bounded capacity**: finite queue length
  sender must wait only if queue is full
- **unbounded capacity**: infinte length
  sender never waits

## threads

_**def:**_ a "lightweight process" that exists as copy of its parent, with access to the same address space.

why use threads? sometimes a single application may need to complete several tasks at once; sequential processing would slow things down

instead, concurrent processing will allow the application to:

- increase perf by running more than one task at a time, e.g. divide & conquer
- cope w/ independent physical devices, allows to not wait on a blocked device & instead perform other tasks until device is unblocked
- example uses:
  - **fg & bg work in parallel ->** UI never hangs while computations run
  - **async processing ->** separate & desync exec streams of indpt tasks that don't care about one another; handle external suprise events like client reqs
  - **increase exec speed ->** overlap cpu exec time w/ i/o wait time (think multiprogramming)

in practice has some important concerns:

- communication btwn threads has a cost (but much lower than full process context switch)
- deps btwn diff parts of same prog limits time increases to `log(n)` time, not `1/n` (where n is number of threads)

## threads implementation

## threads in Java

## wrap-up
