---
title: "OS: interrupt handling"
description: "lecture on methods of waiting/interrupting processes."
keywords:
  - "operating systems"
  - "interrupts"
  - "lecture notes"
  - "computer science"
  - "cs 450"
  - "illinois tech"
meta:
  byline: Andrew Chang-DeWitt
  published: "2025-09-04T00:00-06:00"
---

agenda:

- terms & classification
- interaction of components
- sys services & sys calls
- wrap up

## terms & classification

two major types of handling events:

1. polling
   - cpu continuously checks via loop
   - simple to impl, typ. bad perf
2. interrupts
   - cpu gets signal when attention is needed
   - event-driven, typ. better perf

### polling

a.k.a. **busy waiting**

ex:

```
while () {
  for (d in Device) {
    if (d.ready_bit == 1) {
      // do something...
    }
  }
}
```

### interrupts

no active querying, unlike polling. os-based & asynchronous events (w/
some synchronous exceptions, see below). can be caused by HW or SW.

possible to switch off (ignore/mask) interrupts, but can be dangrous &
should be done w/ care & for as short a time as possible when actually
necessary.

<section>

### polling vs interrupts

<div>

choose polling when...

- events occur often
- deterministic timing is required
- sys dedicated to that task
- interrupt overhead is too high
- simplicity is important

choose interrupts when...

- events are not often and/or unpredictable
- cpu efficiency is a priority
- concurrency is required
- power consumption needs to be low

#### ex of differences:

checking a fast sensor if it has new data every 10 microseconds

with interrupts:

- context switch: 5 μs
- handle interrupt: 2 μs
- restore context: 5 μs
- **total: 12 μs**

with polling:

- check status reg.: 1 μs
- process if data available: 2 μs
- **total: 3 μs**

</div>

> [!ASIDE]
>
> ##### Q: which situation favors interrupts over polling?
>
> 1. dedicated sys tasks
> 2. freq. predictible events
> 3. deterministic timing constraints
> 4. infreq. undpred. events
>
> A: 1) infreq. unpred. events
>
> ##### Q: what type of interrupt is triggered by a div. by zero event?
>
> A: synchronous interrupt

</section>

## interaction of components

interrupts need to stop normal program flow & must handle passing control & resuming control when done.

:::hgroup{.titlegroup}

### sync vs async interrupts

[from slide 8]

:::

- sync: exceptions thrown by CPU or OS service calls
- async: happens no matter what sys is doing (e.g. network adapter
  reports incoming message, disk storage reports compl. of block

> [!TODO]
>
> ?

### interrupt-request (IRQ) processing

control is passed to a special kernal position called the Interrupt-Service-Routine (ISR)

```
                                    {1:device is ready}
+------+            +------------+ <---[ hard disk ]
|      | <-{2:int}- | Interrupt  | <---[ clock     ]
| CPU  |            | Controller | <---[ keyboard  ]
|      | -{3:ack}-> |            | <---[ printer   ]
+-+--+-+            +-+--+-------+
  |  +----------------+  +------------+
  |          Bus                      |
  +-----------------------------------+
```

### interrupt handling: instruction cycle

how machine checks if there is an interrupt to be handled:

- at end of machine instruction, check if present
- interrupts have a priority level (4-256)
- many can be disabled using Interrupt Mask Register (IMR)
- some can not be disabled, called Non-Maskable Interrupt (NMI), used
  for critical events

```
/--> [    fetch instr.    ] <--\
|             |                |
|             v                |
|    [    exec instr.     ]    |
|             |                |
|             v                |
|    [ check if interrupt ]    |
|             |                |
|             v                |
\-{false}- < IQR >             |
              |                |
            {true}             |
              |                |
              v                |
     [  set PC to ISR[0]  ] ---/
```

### interrupt vector table (IVT)

how machine knows what code to run for what interrupt type

- maps IRQ's interrupt number (Int-No) to start address for appropriate
  interrupt service routine (ISR)
- defined by the processor:
  - 256 entries on intel arch
  - contains routines for
    - exceptions
    - sys calls
    - device interrupts

### Sequence of interrupt handling

> [!TODO]
> catch up slide 18

> [!ASIDE]
>
> Q: which component stores start addresses of interrupt service routines?
>
> A: Interrupt Vector Table (IVT)
>
> Q: match term to def
>
> A:
>
> ```
> (1)     DPC --+    +----> Kernal code handling
>               |    |           aninterrupt (A)
> (2)    IRQL - | -- | ---> Priority assigned to
>               +--- | -+      an interrupt (B)
> (3)     ISR -----  +  +-> Deferred low-priority
>                             work from ISR (C)
> (4) Polling ------------> CPU checks device
>                             status in a loop (D)
> ```

## sys services & sys calls

os has many services that app progs use, done via sys calls

- _**def:** system call_&mdash;well-defined entry point into the os

- sys calls work via special mechanism:
  - software interrupt (called trap) or supervisor call (SVC)
  - this lets app prog not have to know addresses of sys routines

- sys calls exec in kernal mode, so processor must switch on entry

- collection of sys calls form an interface btwn app progrs & os kernal, typ provided via libraries

```
+---------------------+
| app software, ...   |
+---------------------+
       /       \
      /         \
      |         |
      v         v
( )  ( )  ( )  ( )  ( )
 |    |    |    |    |
 v    v    v    v    v
+---------------------+
| os kernal           |
+---------------------+
```

### sys call flow

> [!TODO]
> catch up slides 40-47

> [!ASIDE]
>
> Q: match interrupt type w/ example
>
> ```
> (1)      software trap ------------> sys call invocation (A)
>
> (2) non-maskable-intpt -------+  +-> division by zero (B)
>                          +--- | -+
> (3)       async. intpt - | -+ +--+-> power failure sig. (C)
>                          |  |
> (4)        sync. intpt --+  +------> keyboard input ready (D)
> ```

## wrap up
