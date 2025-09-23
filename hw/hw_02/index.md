---
title: "hw 2: scheduling & memory access"
description: second hw assignment
keywords:
  - cpu scheduling
  - memory access
  - operating systems
---

:::hgroup{.titlegroup}

# hw 2: scheduling & memory access

Andrew Chang-DeWitt \
Math 474, Fall 2025 \
2025 Oct. 22

:::

:::hgroup{.titlegroup}

## task 1

cpu scheduling

:::

:::hgroup{.titlegroup}

### part (a)

20 points

:::

> In a fictional country (which is not Westeros) there is a wall of ice
> on which a brotherhood guards the border. On a mild winter evening
> five enemies suddenly appear in front of the wall and want to get
> over it. The mentioned section of the wall is manned by one archer
> who is to open fire on the enemies. Because this archer is very poor
> at shooting and the enemies are very close together, the enemies are
> fired upon using the Round Robin (RR) scheduling method. Round Robin
> should be implemented without priorities. The archer fires at the
> enemies in time slices of 2 seconds in the order A, B, C, D, E. A
> change in firing occurs both after a time slice has elapsed and when
> an enemy is defeated during a time slice (=process in time slice
> finished). All five enemies arrive at the wall almost simultaneously.
> Switching times are negligible. Calculate the accumulated
> firing-free time (=waiting times) per enemy and the average lifetimes
> (=avg. waiting time) taking into account the Round Robin (RR)
> scheduling method

| Enemy (= Process)                                | A   | B   | C   | D   | E   |
| ------------------------------------------------ | --- | --- | --- | --- | --- |
| Survivable firing time <br/>(= service time) [s] | 3   | 3   | 5   | 2   | 5   |

| Start of time <br /> slice [s] |     |     |     |     |     |     |     |     |     |     |     |     |     |
| ------------------------------ | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Enemy <br /> (= Process)       |     |     |     |     |     |     |     |     |     |     |     |     |     |

| Enemy (= Process)                          |     |     |     |     |     |
| ------------------------------------------ | --- | --- | --- | --- | --- |
| Firing-free time <br/>(= waiting time) [s] |     |     |     |     |     |

:::hgroup{.titlegroup}

### part (b)

30 points

:::

> Implement a simulation of an elevator system with 10 floors (1–10).
>
> **Initial Setup** The elevator starts on floor 1. At the beginning, there are
> 5 passengers waiting:
>
> - Passenger A: waits at floor 3, wants to go to floor 8
> - Passenger B: waits at floor 4, wants to go to floor 1
> - Passenger C: waits at floor 1, wants to go to floor 10
> - Passenger D: waits at floor 8, wants to go to floor 2
> - Passenger E: waits at floor 4, wants to go to floor 5
>
> Elevator Rules The elevator can perform exactly one action per tick:
>
> - Move up one floor
> - Move down one floor
> - Load passengers at the current floor
> - Unload passengers at the current floor
>
> **Boarding and scheduling strategies** You are free to implement different
> non-preemptive strategies for how passengers are chosen to board (e.g.,
> Longest/Shortest Job First, Random, First-Come-First-Served (FCFS),
> Last-Come-First-Served (LCFS)).
>
> **Direction policies** It is up to you to decide whether passengers are only
> allowed to board if the elevator is moving in their travel direction, or if
> they may board whenever the elevator stops at their starting floor. This
> depends on how much influence passengers have over the elevator’s direction
> (e.g., via voting or priorities).
>
> **Dynamic Passenger Arrivals** During the simulation, five more passengers
> arrive at different times:
>
> - Tick 3: Passenger F: waits at floor 9, wants to go to floor 10
> - Tick 5: Passenger G: waits at floor 2, wants to go to floor 1
> - Tick 6: Passenger H: waits at floor 7, wants to go to floor 2
> - Tick 6: Passenger I: waits at floor 9, wants to go to floor 3
> - Tick 9: Passenger J: waits at floor 1, wants to go to floor 6
>
> **Task** Run two simulations with each a different strategy, compute and
> report:
>
> - The waiting time for each passenger (time from arrival until reaching their
>   destination).
> - The average waiting time across all passengers.
>
> Also upload your code

:::hgroup{.titlegroup}

## task 2

demand paging

:::

:::hgroup{.titlegroup}

### part (a)

25 points

:::

> Three pages can be kept in RAM, and the remaining pages are managed in a
> paging area. Page replacement follows the Least-Recently-Used (LRU)
> principle. The access sequence in which the pages with indices 1 to 5 are
> referenced is given as:
>
> ```
> 1 - 2 - 3 - 4 - 3 - 1 - 4 - 5 - 2 - 3
> ```
>
> Fill in the memory contents after each access in the prepared tables. Mark
> all pages that are candidates for replacement (in the next step) with a star.
> State the number of required replacements and the number of page hits.

| Page Index  | 1   | 2   | 3   | 4   | 3   | 1   | 4   | 5   | 2   | 3   |
| ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RAM         |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| Paging Area |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |

:::hgroup{.titlegroup}

### part (b)

25 points

:::

> Three RAM pages are available in main memory and the remaining pages are kept
> in a paging area. The reference sequence in which the pages with reference
> digits 0 to 6 are accessed is:
>
> ```
> 3 - 3 - 4 - 5 - 3 - 2 - 5 - 4 - 2 - 1
> ```
>
> After each access, enter the memory contents and the corresponding access
> counters in the prepared tables. Mark all pages that are candidates for
> replacement, and state the number of replacements required.
>
> Page replacement is performed using the Not-Frequently-Used (NFU) algorithm.

| Page Index  | 3   | 3   | 4   | 5   | 3   | 2   | 5   | 4   | 2   | 1   |
| ----------- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RAM         |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| Paging Area |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
| ⁝           |     |     |     |     |     |     |     |     |     |     |
