# midterm review

> [!NOTE]
>
> frontmatter skipped as not intending this note for publishing on blog

## review of practice midterm

a question-by-question discussion of practice exam w/ prof's thoughts on each
one.

### task 1 - theory

will all be from ch 1

1. os provides interface to allow os svc access: **system calls**
2. von neumann: **one bus system**
3. for level-n caches, smaller n means: **faster cache** also means smaller
   size
4. higher intrpt lvl can: **interrupt handling of lower-level interrupts**
5. which statement about os virt is false:
   - maintenance becomes easier
   - less pwr consumed
   - **apps always run faster** (more layers means slower than bare metal)
   - less hw required
6. which statement abt interactive proc is correct?
   - **job does not need to be fully defined**
   - ...
7. primary role of an OS: **act as mediator btwn user & hw**
8. autonomous vehicle's OS must guarantee...: **monolithic kernal w/ real-time
   sched guarantees**
9. which of following components would typ run in user space in microkernal:
   - mem mgmt
   - proc sched
   - **file server**
   - interrupt handling
10. primary disadvantage of user-level threads?: **block one thread blocks all
    threads**
11. which following is mem mgmt responsibility of the OS:
    - track mem usage
    - loading & swapping procs
    - enforcing isolation
    - **all of above**
12. what is an advtg of async i/o over sync i/o: **proc can continue running
    while i/o completes**

### task 2 - misc

will all be from ch 1

1. resources can be classified into 3 groups, name & give example for each:
   1. ?
   2. ?
   3. pre-emptive or not (disks can be shared)
2. order from fastest to slowest:
   1. cpu reg
   2. cache
   3. main mem
   4. hard disk
3. name 4 types of OS:
   1. mobile
   2. embedded
   3. server
   4. mainframe
   5. iot

   look for tree showing all types of devices running OS'

4. explain diff btwn multicore & hyperthreading cpus:

   HT: 1 proc unit w/ multiple _physical_ threads that looks like multicore to OS
   MC: multiple actual cores

5. machine inst elements: **opcode & data**

### task 3 - architecture

all from ch 3

> [!NOTE]
>
> ch 2 (history) skipped!

1. fund. diff btwn user mode & kern mode:

   **user mode includes user prgs & doesn't care abt phys/virt mem addressing;
   while kern mode has full instruction set & priviliges**

2. name 2 components typ belonging to OS kern core?
   1. file manager
   2. resource manager
   3. mem mgmt
   4. interrupt handling

   > [!TIP]
   >
   > answer was back in q ? abt microkernal from task ?

3. two improv. of layered kern over monolithic?
   1. maintenance req changing only 1 layer
   2. porting is easier (reqs only changing lowest layer to match target
      architecture)

4. name 3 cloud services?
   1. IAAS (infra, e.g. aws ec2)
   2. PAAS (platform)
   3. SAAS (software, google docs)

5. how bytecode enables platform independence: **compiles to runtime, not
   target arch; runtime then targets the platform**

### task 4 - interrupts

all from ch 4

1. def: sync & async interrupts, give examples:
   1. sync: int that happens immediately (req read file, div by zero)
   2. async: int that happens outside current prg context (user input received)

2. name 2 scenarios when polling is better than interrupts:
   1. interrupt comes w/ too much overhead for perf reqs
   2. thing being done is deterministic w/ respect to time; e.g. happens every
      second

3. what is ISR (int. svc. routine) & where is control passed?

   ISR ??

4. what is a NMI when used?

   an iterrupt that must be sent no matter what, e.g. power failure handling

5. why is interrupt crucial for multitasking prg?

   running multiple tasks req switching btwn tasks as needed; also may req
   sharing resources; yet these tasks should be able to not know about one
   another at all

6. advtgs of sys calls over direct kernal routine access?

   should be obvious, but easier to type `f.write(...)` or whatever w/out
   knowing how OS will handle it

7. fill in 1-4 in diagram:
   1. fetch current prg @ PC
   2. execute prg @ PC
   3. check for interrupts
   4. set PC to associated interrupt routine (ISR)

## task 5 - procs & threads

all from ch 5

1. c prg analysis
   1. num procs created (including initial parent proc): **3**
   2. for each proc, list exact output:
      - **P0**:
      - **P0.0**:
      - **P0.1**:

   explanation:
   - starts as P0 at line 1
   - splits child @ line 3
   - splits @ line 5

2. complete diagram:
   1. new/created
   2. ready
   3. running
   4. terminated

3. complete diagram:
   1. data heap
   2. text (prg code)
   3. kern. lvl. stack
   4. cpu reg

4. multiple threads in proc:
   1. name 2 ex of elements from proc context that are shared by threads in
      proc:
      1. open files
      2. data
      3. prg code
      4. heap
      5. file descriptors

   2. name two examples of elements that are **not** shared btwn threads in
      proc:

      think about Thread Control Block (TCB)...
      1. cpu reg
      2. PC
      3. stack
      4. ...

5. describe procedure of proc context switch & expl why thread context switch
   is faster:

   proc ctx switch:
   1. ...

   why thread faster:

   doesn't need to do steps ... or include ... in loading/saving operations

6. threads are impl in OS as user-lvl or kern-lvl. expl diff by stating sched
   unit from OS perspective fro each & provide one advantage or disadvantage
   for each variant:

   user-lvl: **impl in user space w/ thread lib**
   - sched unit from os perspective: **the process only**
   - pros: portable
   - con: blocks all if one blocks

   kern-lvl: **impl in user space w/ thread lib**
   - sched unit from os perspective: **the thread as OS manages thread sched**
   - pro: faster, doesn't block as easily
   - con: not portable

## tips, rules, etc.

- will have some def overlap w/ practice exam
- roughly 2 points = 1 minute

process:

- 8:35am&mdash;exams handed out
- 8:40am&mdash;begin exam
- 9:40am&mdash;time ends

cheat sheet:

> You are allowed to bring a one-pager. That is, one US-letter with just one
> side with content. You can use your handwriting or write it via word etc.
> Diagrams etc. are allowed.

rules:

- no calculator/electronics
- stop as soon as end announced&mdash;will be considered cheating
- use **pen**
