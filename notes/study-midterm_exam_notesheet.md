# ch 1 - intro

- interactive processing: timesharing; complete multiple (all?) tasks quickly; jobs don't have to be fully defined to start
- resources
  - includes: procs/threads, mem (ram, virt. mem, cache), file sys, i/o devices (network, gpu, disks, keyboard,...)
  - 3 classifications: (1) hw/sw (2) non-/preemptible (3) exclusive/shared
- types of os: mainframes, servers, PCs, tablets & mobile phones, embedded, real-time, smart cards
- layers:
  - hierarchy (high to low):
    - high level code: code used to write application software
    - compiler/assembler: tool for translating high level code
    - ISA: API or "contract" btwn SW & HW
    - microarchitecture: how cpu is built to implement a given ISA
    - hardware: physical impl of HW

    ```
    app software
     |       |
     |       v
     |  sys software
     |       |
     v       v
    operating system
    machine lang
    microarchitecture
    hardware
    ```

  - machine lang: binary commands; made of (1) opcode & (2) operands
  - microarchitectures: mostly x86 (outdated, 4GB max 32-bit) & x64 (modern, 16B GB, 64-bit)
  - important cpu reg: PC, IR (instr. reg), SP, status reg (for mode, comparisons, & more...)

# ch 3 - architecture

- approaches:
  1. simple (e.g. MS-DOS): no well-defined structure, no well-defined layers; limited as hw was limited at time
  2. monolithic kernal; continuation of (1); shared address space w/in single proc
  3. layered (or modular) kernal: modular, abstract; layers don't know how eachother are impl'd & don't share data; hard to organize (requires sortable as DAG or conflicts arise)
  4. microkernal: minimal; pushes many things to user space instead; more portable & easier to maintain; reqs message passing btwn user space to run sys procs in kernal space -> more overhead
- policy (what should be done) vs mechanism (how it should be done)
- access control: user vs kernal mode
- distrubuted approaches:
  - fully-dist. os: not in use much today due to inherent perf limitations of this setup
  - comm. middleware: used by modern dist. sys.; often runs in user mode and helps individual computers (& OSs) coordinate work
- distributed models:
  - client/server
  - p2p
  - middleware
- virtualization: sw simplification of hw/resources, but slower than bare metal
  - anything can be virtualized: vms, runtime sys (JVM), proc envs (mem, proc model), storage, network (vLAN,SDN,NFV), app...
  - :[os virt:]
    ```
    [p1][p2]p3]...[pl] [p1][p2][p3]..[pm]     [p1][p2][p3]...[pn]
    [  os1 (windows) ] [  os1 (ubuntu)  ] ... [   os1 (macos)   ]
    [           virtual machine monitor (hypervisor)            ]
    [                            hardware                       ]
    ```
- cloud service models: trad on-prem; IAAS, PAAS, SAAS, FAAS (not actually serverless)
  - :[metaphor: pizza as a service:]
    :::

    | model  | trad on-prem: home | IaaS: frozen | PaaS: delivery | SaaS: dine out |
    | ------ | ------------------ | ------------ | -------------- | -------------- |
    | diy:   | dining table       | dining table | dining table   |                |
    |        | soda               | soda         | soda           |                |
    |        | elec/gas           | elec/gas     |                |                |
    |        | oven               | oven         |                |                |
    |        | fire               | fire         |                |                |
    |        | dough              |              |                |                |
    |        | sauce              |              |                |                |
    |        | toppings           |              |                |                |
    |        | cheese             |              |                |                |
    | -----  | ------------------ | ------------ | -------------- | -------------- |
    | cloud: |                    |              |                | dining table   |
    |        |                    |              |                | soda           |
    |        |                    |              | elec/gas       | elec/gas       |
    |        |                    |              | oven           | oven           |
    |        |                    |              | fire           | fire           |
    |        |                    | dough        | dough          | dough          |
    |        |                    | sauce        | sauce          | sauce          |
    |        |                    | toppings     | toppings       | toppings       |
    |        |                    | cheese       | cheese         | cheese         |

    :::

  - :[resc. sharing approaches:]
    ```
    [client A][cl. B]  [cl. A][cl. B]  [cl. A][cl. B]  [cl. A][cl. B]
      ^        ^        ^      ^        ^      ^        ^      ^
      |        |        |      |        |      |        |      |
      v        v        v      v        v      v        v      v
    [  app   ][ app ]  [ app ][ app ]  [ app ][ app ]  [     app    ]
    [  mid   ][ mid ]  [ mid ][ mid ]  [     mid    ]  [     mid    ]
    [  os    ][ os  ]  [ os  ][ os  ]  [     os     ]  [     os     ]
    [  vrt   ][ vrt ]  [     vrt    ]  [     vrt    ]  [     vrt    ]
    [  hw    ][ hw  ]  [     hw     ]  [     hw     ]  [     hw     ]
    |               |  |            |  |            |  |            |
    \-- datacenter -\  \--virtual.--\  \--sh. mid.--\  \-- multi- --\
    |     sharing                                   |     tenancy
    \--------------- multi-instance ----------------\
    ```

# ch 4 - interrupts & sys svcs/calls

## interrupts

1. polling
   - cpu continuously checks via loop
   - choose polling when... events occur often, deterministic timing is required, sys dedicated to that task, interrupt overhead is too high, simplicity is important
2. interrupts
   - cpu gets signal when attention is needed, event-driven
   - choose interrupts when... events are not often and/or unpredictable, cpu efficiency is a priority, concurrency is required, power consumption needs to be low

- 2 broad classifications of interrupts:
  1. sync: exceptions thrown by cpu or os svc; div by zero, page fault, etc.\
     has own sub classification:
     1. exceptions
     2. sys calls
  2. async: occur regardless of what sys is doing; network adapter reports incoming msg, disk storage reports completion of block transfer, etc.

- how interrupts work:
  - :[cause code exec outside of normal prg flow, passes ctrl to kernal-defined position called ISR (interrupt service routine):]

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

  - :[interrupt handling:]

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

    - ISR uses IVT (interrupt vector table) to map interrupt request (IRQ) int-no to assigned interrupt controller

  - catching/masking:
    - some interrupts can be disabled via masking on the IMR (interrupt mask register)
    - unmaskable: NMI (non-maskable interrupt); includes critical events
  - priority: interrupts have priority & higher priority ones can preempt low-priority ones

- uses of interrupts:
  - deferred procedure call: kernal mode only, used to defer lower-priority work from an ISR to be exec later at a lower interrupt priority
  - async procedure call: user or kernal mode, exec code asynchronously in context of specific thread

## svcs & sys calls

- _**def:** system call_&mdash;well-defined entry point into the os

- sys calls work via special mechanism:
  - software interrupt (called trap) or supervisor call (SVC)
  - this lets app prog not have to know addresses of sys routines

- sys calls exec in kernal mode, so processor must switch on entry

- collection of sys calls form an interface btwn app progrs & os kernal, typ provided via libraries

- :[syscall flow:]
  ```
          t ----------------------------------------->
            [ prg instr. | sys call | prg instr. ...]
                         |          ^
             +-----------+          +------+
             |                             |
  +----------v-------------+    +----------+-------------+
  | sw interrupt           |    | back from kern. mode   |
  | put params to stack    |    | get res. from stack    |
  | PC <- sys routine addr |    | PC <- addr after call  |
  | switch to kern. mode   |    | switch to user mode    |
  +----------+-------------+    +----------^-------------+
             |                             |
             +-------> [ os kernal ] ------+
  ```

# ch 5 - proc/threads

## processes

- os virtualizes processes in multiprogramming, storing context & scheduling actual cpu time for each proc per scheduling algorithm
  - parallel processing: when mapping 1 virt processor to 1 real processor
  - concurrent processing: 1 virt processor to 1 virt process & context switches occur to change which virt proc is running

- :[_**def:** process context_&mdash;the complete state info for a proc]

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

  - **each proc has own _addr space, open files, kern. stack, file descriptors_**
  - os manages proc tables storing context: each entry called PCB (proc ctrl block), containing context (above)
  - :[organizes process "image" in virt. mem:]
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

- proc lifecycle

  ```
   [not-existant] <------------------------+
         |                                 |
         | created              terminated |
         v                                 |
       [new] ---+                  +--> [zombie]
                |                  |
       admitted |    interrupt     | wait for parents
                |   +---------+    |
                v   v         |    |
               [ready]       [running]
                ^   |         ^    |
                |   +---------+    |
                |   sched. disp.   |
      i/o event |                  | wait i/o or
           done +---- [waiting] <--+ event
  ```

  - processes created by on sys boot a few background (daemon) procs are created, user req (run an application), existing proc spawns child (server may create proc per request handled)

- unix
  - proc hierarchy
    - tree structure, each proc has id (PID) & parent id (PPID) from OS
    - some spec unix procs: scheduler (PID 0), mem mgmt proc, init (PID 1, ancestor of all other procs)
  - proc creation: `fork()`
    1. clone child proc `pid = fork()`
    2. replace child's image `execvp(name, ...)`
    ```
    +---------+     +---------+     +---------+
    | OS      |     | OS      |     | OS      |
    +---------+     +---------+     +---------+
    | P1 ctx  | (1) | P1 ctx  |     | P1 ctx  |
    | P1 data |--+  | P1 data |     | P1 data |
    | P1 prg  |  |  | P1 prg  |     | P1 prg  |
    +---------+  |  +---------+     +---------+
    |         |  |  | P1 ctx  | (2) | P2 ctx  |
    |         |  +->| P1 data |---->| P2 data |
    |         |     | P1 prg  |     | P2 prg  |
    |         |     +---------+     +---------+
    |         |     |         |     |         |
    ```
  - proc termination:
    - reg completion: proc execs `exit(errcode)` syscall to tell OS it's done
      - on parent to clean up done proc, else child is called a zombie!
    - fatal err: uncatchable or uncaught
    - killed by another proc via kernal
  - proc pause/resume:\
    two types
    1. i/o wait&mdash;ex:
       1. os/gc (syscall) triggered
       2. proc syscall invocation that blocks while waiting for i/o device
       3. proc in waiting status
       4. os dispatches another proc to cpu while waiting
    2. premptive timeout&mdash;ex:
       1. hw inter. (timer) triggered
       2. proc rcvs interrupt & gives ctrl to OS
       3. proc goes to ready status
       4. os dispatches another proc to cpu
  - proc ctx switching
    - steps:
      1. save cpu ctx (pc & other regs)
      2. update proc state in PCB
      3. move PCB to appropriate queue
      4. OS scheduler selects another proc for exec
      5. update PCB of selected proc
      6. update mem mgmt structs
      7. restore cpu ctx of new proc from PCB
  - proc coop
    - inter-proc comms (IPC); shared mem vs msg passing:

      ```
      +--------+         +-------------------------+
      | proc A |--+      | proc A                  |--+
      +--------+  |      +-------------------------+  |
      | shared |<-+   +->| proc B                  |  |
      | mem    |<-+   |  +-------------------------+  |
      +--------+  |   |  | ...                     |  |
      | proc B |--+   |  |                         |  |
      +--------+      |  +-------------------------+  |
      | ...    |      |  | msg queue               |  |
      |        |      |  +-------------------------+  |
      |        |      +--| m0 | m1 | m2 | ... | mn |<-+
      +--------+         +-------------------------+
      | kern   |         | kern                    |
      +--------+         +-------------------------+
      ```

      - shared mem by using same addr space & shared vars
      - message passing via `send()` & `receive()`
        - in-/direct:
          - can be _**direct**_&mdash;procs must name one another explicitly
          - or _**indirect**_&mdash;procs pass msgs via mailboxes (ports)
        - non-/blocking: sync or async
        - can be buffered w/ capacity of **0** (sender must wait before sending more msgs), **bounded** (finite queue, send must wait when full), or **unbounded** (sender never waits)

## threads

- _**def:**_ a "lightweight process" that exists as copy of its parent, with access to the same address space.
- used to perform tasks similar to concurrent processing w/out all the context switching overhead & strict mem sharing policies
- threads have own context w/ thread ctrl blocks that contain own registers, stack; but share code, data, & files with one another & parent proc and are organized on stack for parent proc:

  ```
  +---------------------+    +-----+   +--------+
  | code | data | files |    | PCB |   | PCB    |
  +---------------------+    |     |   |        |
  | reg      | reg      |    +-----+   +--------+
  +----------+----------+    |stack|   |thread 1|
  | stack    | stack    |    |     |   |ctrl blk|
  +---------------------+    |     |   +--------+
                             +-----+   |thread 1|
                             |data |   |stack   |
                             |     |   +--------+
                             +-----+   |thread 2|
                             |prog.|   |ctrl blk|
                             |code |   +--------+
                             |     |   |thread 2|
                             |     |   |stack   |
                             |     |   +--------+
                             |     |   |data    |
                             |     |   +--------+
                             |     |   |prog.   |
                             |     |   |code    |
                             |     |   |        |
                             +-----+   +--------+
  ```

- threads vs procs:
  - threads advantages: much quicker to create, much quicker to ctx switch, share data more easily
  - threads disadvantages: procs more flexible, don't have to run on same processor, no security btwn threads, share data, (in user-level threads) if one thread blocks, all block
- thread pools: used to save time/resources on creating & destroying threads
- two broad categories of implementations of threads:
  1. user-level threads (ULT)
     - implemented in user space using a library
     - that library then handles kernal-level comms as needed; typically w/ only one process/thread
     - kernal is thus not aware there are multiple threads in the process it is communicating with
     - user space process must manage its own private thread table
     - pros:
       - lightweight switching, no kernal privileges needed
       - cross-platform; easy to compile to different target OS'
     - cons:
       - if one thread blocks, entire process blocks _all_ threads in process
  2. kernal-level threads (KLT)
     - threads implemented in kernal space **&** user space
     - can create multiple kernal threads/processes for multiple user space threads/processes
     - threads are known to kernal in a Thread Control Block (TCB)
     - thread code executes in user mode
     - from OS perspective, scheduling unit is thread, not process
     - a thread context switch requires syscall
     - pros:
       - fine-grain scheduling, done on per-thread basis
       - if a thread blocks, other threads can be scheduled w/out blocking process
     - cons:
       - heavier thread context switching
