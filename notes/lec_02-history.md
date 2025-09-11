---
title: "OS: history of os"
description: "Quick history of operating systems from first gen, tube computers to modern fourth gen multicore computers."
keywords:
  - "operating systems"
  - "history"
  - "lecture notes"
  - "computer science"
  - "cs 450"
  - "illinois tech"
meta:
  byline: Andrew Chang-DeWitt
  published: "2025-08-28T00:00-06:00"
---

agenda:

- hist overview
- classical types of computing
- os examples
- wrap-up

## history overview

topics:

- first gen
- second gen
- third gen
- fourth gen

### first gen computers

1945-1955

- tube computers (~20,000 tubes)
- minimal os
- programmed in machine lang & punch cards

### second gen

1955-1965

- transistors <- ~tubes~
- assembler -> simple os
- batch processing

### third gen

1965 - 1980

- integrated circuits
- os approach something more recognizable today
- high level langs introduced
- mainframes, multiprogramming, & timesharing
- first gui (1973 xerox alto)

### fourth gen

since 1980

- large scale, x,000+ transistors on single chip
- complex modern os
- pc, workstations, mainframes, servers, mobile devices, ...
- OOP
- network os & dist. os

## classical types of computers

topics:

- multicore systems

### multicore systems

foundation of true parallel processing

- today, is std in pcs
- for os, processing becomes more complex, but still presents simply to user
- synch of resource access is req, done by os
  - main mem
  - internal kernal data structures
  - i/o system
  - ...

### multiprogramming vs multitasking

:::{.wrap}

| multiprogramming                                                                                                                                                                 | multitasking                                                                                                                                         |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| <ul><li>ability of os to exec prg simultaneously (or quasi-)</li><li>mult jobs held in me & ready for exec at same time</li><li>does not necessarily require multicore</li></ul> | <ul><li>mult prg active at once (interactive processing)</li><li>req sys resources assigned alternately, based on priority or time-slicing</li></ul> |

:::
