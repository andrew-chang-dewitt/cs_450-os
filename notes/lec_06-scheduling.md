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
