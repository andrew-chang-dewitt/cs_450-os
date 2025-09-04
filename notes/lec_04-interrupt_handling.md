---
title: "OS: interrupt handling"
description: "lecture on methods of waiting/interrupting processes."
keywords:
  - "operating systems"
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

### polling vs interrupts

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

> [!ASIDE]
>
> Q: which situation favors interrupts over polling?
>
> A) dedicated sys tasks
> B) freq. predictible events
> C) deterministic timing constraints
> D) infreq. undpred. events
>
> A: D

> [!ASIDE]
>
> Q: what type of interrupt is triggered by a div. by zero event?
>
> A: synchronous interrupt

## interaction of components

interrupts need to stop normal program flow & must handle passing control & resuming control when done.

### interrupt-request (IRQ) processing

control is passed to a special kernal position called the Interrupt-Service-Routine (ISR)

### sync vs async interrupts

- sync: exceptions thrown by CPU or OS service calls
- async: happens no matter what sys is doing (e.g. network adapter reports
  incoming message, disk storage reports compl. of block transfer)

> [!TODO]
>
> catch up to slide 18

## sys services & sys calls

## wrap up
