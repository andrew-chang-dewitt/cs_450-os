---
title: "OS: scheduling"
description: "lecture on cpu scheduling & allocation."
keywords:
  - "operating systems"
  - "proccesses"
  - "threads"
  - "scheduling"
  - "systems programming"
  - "lecture notes"
  - "computer science"
  - "cs 450"
  - "illinois tech"
meta:
  byline: Andrew Chang-DeWitt
  published: "2025-09-25T00:00-06:00"
---

agenda:

- overview
- scheduling algorithms
- comparison of scheduling algorithms
- implementations
- wrap-up

## overview

> [!TODO]
>
> catch up 5-9

### some terms...

#### cpu scheduler

cpu uses a strategy to decide which proc from mem to take & begin exec
on&mdash;called _short-term scheduler_

cpu scheduling decisions can occur when a process does one of the
following:

1. new proc arrives (_preemptive\*_)
2. proc switches from running to ready (_preemptive_)
3. proc switches from waiting to ready (_preemptive_)
4. proc switches from running to waiting state
   (_non-preemptive/cooperative_)
5. proc terminates (_non-preemptive/cooperative_)

- _**def:** non-preemptive/cooperative_&mdash;FIFO, works through jobs
  in order received
- _**def:** preemptive_&mdash;FILO/round-robin; jumps to front of queue
  and/or queue always pulls most recent job first

#### dispatcher

_**def:**_ module that gives control of cpu to process selected by short-term scheduler

handles:

- switching context
- switching mode
- jumping to proper location in user prg as needed

has latency

#### time-slicing

cpu is taken away by OS when running proc waits for event _or_ running proc has used CPU for a defined time interval

_**def:** quantum_&mdash;a slice of time determined by CPU & OS that is dedicated to the current running proc

### scheduling criteria & goals

to allocate time slices well, different goals may be needed for different types of tasks:

- fairness: each proc rcvs guaranteed min time allocation
- efficiency: aim for max cpu utilization
- response time: minimize latency
- turnaround time: minimize time any given proc may have to wait when it's not the currently running proc
- throughput: maximize number of jobs OS completes in some time interval
- reliability/predictability: meet real-time reqs & ensure predictable execution

| goal            | batch-sys | dialog sys | real-time sys |
| --------------- | --------- | ---------- | ------------- |
| fairness        | x         | x          | x             |
| wait time       | x         | x          | x             |
| throughput      | x         |            |               |
| turnaround time | x         |            |               |
| cpu utilization | x         |            |               |
| response time   |           | x          |               |
| predictability  |           |            | x             |

> [!TODO]
>
> add 2 qs before this section

## scheduling algorithms

basic types:

1. non-preemptive
   - aka run to completion
   - not good for interactive/multi-user systems or real-time
     processing
   - good for batch processing
   - _ex:_ MS-DOS
2. preemptive
   - aka priority interruption
   - requires time-slicing (into scheduling units, called quantums)

### scheduling algos for batch processes

- first come, first served (FCFS): FIFO queue of processes
- shortest job first (SJF): proc w/ shortest time executed first
- shortest remaining time next (SRTN): proc w/ least time left to
  finish runs next, **preemptive!**

all of these have issues w/ _starvation_, e.g. some procs may end up
never getting CPU time

### ... for interactive processes

- round robin (RR):
  - aka circular/time-slicing scheduling
  - FCFS combined w/ time slicing
  - perf depends on legth of time slice
    - shorter slices implies more frequent context switches
    - longer slices implies longer wait times
  - typical time slice length today is about 10 to 200 ms
- priority scheduling (PS):
  - proc w/ highest priority is executed next
    - helps jobs that are more important get executed first
    - can lead to _priority inversions_ where high prio tasks wait on
      low prio tasks in some cases
    - procs can have static or dynamic priorities, where they can-not
      or can change priority as needed (by OS or by program)
- shortest remaining time next (SRTN): preemptive version of batch algo
- lottery scheduling (random): cpu time is randomly assigned
- fair-share scheduling/guaranteed scheduling: aims to ensure all jobs
  get equal cpu time

> [!NOTE]
>
> approaches are often combined to implement real-world scheduling
> algos (e.g. round robin w/ priorities, more below)

### multi-level scheduling

- multi-level scheduling:
  - multiple queues for different classifications of jobs
  - each queue has own priority
- multi-level feedback scheduling:
  - a proc can move between queues to change priority
  - moves are done based on proc behaviour or execution history

### ex: rr w/ prio

starting w/ design goals:

- how long should quantum be? remember relationship between quantum length, overhead, & responsiveness
- how are priorities assigned?
  - maybes static to start, then dynamic in response to observations?

a dynamic solution:

- initially assign quantum at beginning of process
  - quantum can be dynamic to accomodate different needs:
    - cpu-intensive processes get shorter quantums, giving more responsiveness under load
    - i/o-intensive get longer quantums to avoid heavy context switches

requirements:

- mgmt of proc data (quantum & prio) w/ cyclical adjustments
- quantum of active procs is decremented in response to events
- prios also get recalculated as needed

## scheduling in realtime systems

requires fast reactions & predictability in behaviour

- has concept of _deadlines_ for process completion or event response times
  - hard deadlines: must responsed as quickly as possible (aka fixed deadlines)
  - soft deadliens: a real-time system w/ some delay (target objectives)

examples: minimal deadline first, polled loop, interrupt-driven

### real-time vs gen. purpose OS

| real-time                                            | gen-purp                                      |
| ---------------------------------------------------- | --------------------------------------------- |
| supports hard real-time reqs w/ guarantees/deadlines | supports only soft deadlines w/ no guarantees |
| optimized for worst-case scenarios                   | optimized for various app types               |
| predictability is key                                | efficient scheduling w/ fair servicing is key |
| typ. supports few dedicated functions                | many apps can run on one system               |
| time optimiztion important                           | throughput & response-time important          |

> [!ASIDE]
>
> ### Question 3
>
> Which algo is optimial in theory for minimizing average turnaround time?
>
> 1. first come first serve
> 2. round robin
> 3. shortest job first
> 4. priority scheduling
>
> **A:** ?
>
> ### Question 4
>
> Match scheduling algo to primary use case
>
> 1. round robin
> 2. multi-level feedback
> 3. minimal deadline first
> 4. first-come-first-serve
> 5. hard real-time
> 6. interactive systems
> 7. general-purpose OS
> 8. batch systems
>
> **A:** ?

## comparison of scheduling algorithms

### problem:

- given five jobs `A-E` that arrive in system almost simultaneously
  - w/ estimated exec times (ms):
    - `A := 10`
    - `B := 6`
    - `C := 4`
    - `D := 2`
    - `E := 8`
  - & static priorities:
    - `A := 3`
    - `B := 5`
    - `C := 2`
    - `D := 1`
    - `E := 4`
- system is single-core CPU

task: calculate average turnaround time, ignoring context-switching time

### examples

#### priotity scheduling execution time:

```
job a                       |||||||||||||||x
                            :              :
job b  |||||||||x           :              :
       :        :           :              :
job c  :        :           :              ||||||x
       :        :           :              :     :
job d  :        :           :              :     |||x
       :        :           :              :     :  :
job e  :        ||||||||||||x              :     :  :
       ______________________________________________
       |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
time   0     4     8     12    16    20    24    28
```

| job             | B   | E   | A   | C   | D   |
| --------------- | --- | --- | --- | --- | --- |
| turnaround time | 6   | 14  | 24  | 28  | 30  |

perf:

- total turnaround time: 102ms
- avg turnaround time: 102/5 = 20.4ms

#### first-come-first serve execution time:

```
job a  |||||||||||||||x
       :              :
job b  :              |||||||||x
       :              :        :
job c  :              :        :  ||||||x
       :              :        :  :     :
job d  :              :        |||x     :
       :              :        :  :     :
job e  :              :        :  :     ||||||||||||x
       ______________________________________________
       |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
time   0     4     8     12    16    20    24    28
```

| job             | A   | B   | D   | C   | E   |
| --------------- | --- | --- | --- | --- | --- |
| turnaround time | 10  | 16  | 18  | 22  | 30  |

perf:

- total turnaround time: 96ms
- avg turnaround time: 96/5 = 19.2ms

#### shortest job first execution time:

```
job a                                |||||||||||||||x
                                     :              :
job b           |||||||||x           :              :
                :        :           :              :
job c     ||||||x        :           :              :
          :     :        :           :              :
job d  |||x     :        :           :              :
       :  :     :        :           :              :
job e  :  :     :        ||||||||||||x              :
       ______________________________________________
       |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
time   0     4     8     12    16    20    24    28
```

| job             | A   | B   | D   | C   | E   |
| --------------- | --- | --- | --- | --- | --- |
| turnaround time | 10  | 16  | 18  | 22  | 30  |

perf:

- total turnaround time: 96ms
- avg turnaround time: 96/5 = 19.2ms

#### rr w/ prio:

assuming a 2ms quantum

```
job a  :  :  ||||  :  :  :  ||||  :  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job b  ||||  :  :  :  ||||  :  :  :  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job c  :  :  :  ||||  :  :  :  |||x  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job d  :  :  :  :  |||x  :  :  :  :  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job e  :  ||||  :  :  :  ||||  :  :  :  :  :  :  :  :
       ______________________________________________
       |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
time   0     4     8     12    16    20    24    28
```

| job             | A   | B   | D   | C   | E   |
| --------------- | --- | --- | --- | --- | --- |
| turnaround time | 10  | 16  | 18  | 22  | 30  |

perf:

- total turnaround time: 96ms
- avg turnaround time: 96/5 = 19.2ms

> [!ASIDE]
>
> ### question 5
>
> ...
>
> **A:** overhead increases

### in-class exercise

A CPU scheduler uses priority-driven, thread-based scheduling with
static priorities and a multi-level run queue. All threads in a
higher-priority queue are executed before any in a lower-priority
queue (1 = highest, 3 = lowest)

#### part (a)

For the seven ready threads A–G, determine the scheduling order under
priority scheduling with Round Robin per queue, using a static
quantum of 100 ms on a single-core CPU. Assume no context switch
overhead, and threads are preempted only if they finish before their
quantum expires.

| job  | a   | b   | c   | d   | e   | f   | g   |
| ---- | --- | --- | --- | --- | --- | --- | --- |
| time | 300 | 200 | 200 | 200 | 300 | 200 | 200 |
| prio | 2   | 1   | 3   | 1   | 2   | 3   | 3   |

```
job a  :  :  :  :  ||||  ||||  |||x  :  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job b  ||||  |||x  :  :  :  :  :  :  :  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job c  :  :  :  :  :  :  :  :  :  :  ||||  :  |||x  :  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job d  :  ||||  |||x  :  :  :  :  :  :  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job e  :  :  :  :  :  ||||  ||||  |||x  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job f  :  :  :  :  :  :  :  :  :  :  :  ||||  :  |||x  :
       :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :  :
job g  :  :  :  :  :  :  :  :  :  :  :  :  ||||  :  |||x
       _________________________________________________
       |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
time   0    200   400   600   800   1000  1200  1400  1600
```

| job             | b   | d   | a   | e    | c    | f    | g    |
| --------------- | --- | --- | --- | ---- | ---- | ---- | ---- |
| turnaround time | 300 | 400 | 900 | 1000 | 1400 | 1500 | 1600 |

perf:

- total turnaround time: 7100ms
- avg turnaround time: 7100/7 = 1014ms

#### part (b)

find turnaround time for a dual-core cpu where processes can be executed in true parallel. all other conditions remain the same.

```
job a  :  :  |||||||||x  :  :  :
       :  :  :  :  :  :  :  :  :
job b  ||||||x  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :
job c  :  :  :  :  :  ||||  |||x
       :  :  :  :  :  :  :  :  :
job d  ||||||x  :  :  :  :  :  :
       :  :  :  :  :  :  :  :  :
job e  :  :  |||||||||x  :  :  :
       :  :  :  :  :  :  :  :  :
job f  :  :  :  :  :  ||||||x  :
       :  :  :  :  :  :  :  :  :
job g  :  :  :  :  :  :  ||||||x
       _________________________
       |  |  |  |  |  |  |  |  |
time   0    200   400   600   800
```

| job             | b   | d   | a   | e   | c   | f   | g   |
| --------------- | --- | --- | --- | --- | --- | --- | --- |
| turnaround time | 200 | 200 | 500 | 500 | 800 | 600 | 800 |

perf:

- total turnaround time: 3600ms
- avg turnaround time: 3600/7 = 514ms
