---
title: "OS: architecture"
description: "lecture on operating system architecture design concerns, types,& pros/cons of various models."
keywords:
  - "operating systems"
  - "architecture"
  - "lecture notes"
  - "computer science"
  - "cs 450"
  - "illinois tech"
meta:
  byline: Andrew Chang-DeWitt
  published: "2025-09-02T00:00-06:00"
  updated: "2025-09-04T00:00-05:00"
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

### approach 1: simple struct

a small, simple os w/ limited systems. grows into more complex
structure as more needs are met.

- lacks a well-defined structure (spaghetti code!)
- no well-defined layers or modularization

#### ex: MS-DOS

- originally for most functionality in least space
- kept growing as more features wanted, esp. as later versions of
  windows were based on it
- worked/necessary because hw of the time was v limited

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

### approach 2: monolithic kernal

kernal might be made of modules, but they all share common address space & have
access to its entirety.

- basically a continuation of **approach 1**
- high mem usage, can be disorganized & complicated to maintain
- v difficult to translate to multi-core/multi-processing hw

```
[ app 0 ]   [ app 1 ] ... [ app n ]
    ^           ^             ^
....|...........| ............|..... sys svc interface
    v           v             v
[        service dispatcher       ]
    ^       ^    ^           ^
    |       |    |           |
    v       |    v           v
[ module ]  |[ module ]  [ module ]
    ^       |     ^  ^       ^
    |       |     |  |       |
    v       |     v  \----\  |
[ module ]<-/  [ module ] |  |
    ^                     v  v
    |                  [ module ]
    |                       ^
....|.......................|....... hw interface
    v                       v
[             hardware            ]
```

### approach 3: layered kernal

composed of layers organized hierarchically, uses abstractions in each layer to
simplify how parts of the kernal interact.

- higher layers provide api for user-space code
- lower layers interface w/ hw & provide abstractions for upper layers to
  communicate with hw

pros:

- simplifies maintenance through proper modular design
  - layers can be debugged independently
  - layers can be replaced/upgraded independently

cons:

- can be vvv difficult to properly design/define layers!
- more layers -> more indirection -> more overhead
- only possible if all funtion deps can be topologically sorted in a directed acyclic graph; does not work if there are circular dependencies!

```
[ app 0 ]   [ app 1 ] ... [ app n ]
    ^        ^  ^             ^
    |        |  |             |
    |     /--/  |             |
....|..../......|.............|............... sys svc interface
    |   /       |             |
    |   |       |             |
    v   v       v             v
[ module ]  [ module ]    [ module ]   layer 2
    ^   ^       ^             ^
    |   |       |             |
    |   \       |             |
....|....\......|.............|...............
    |     \---\ |             |
    |         | |             |
    v         v v             v
[ module ]  [ module ]    [ module ]   layer 1
    ^           ^          ^  ^
    |           |          |  |
    |           |     /----/  |
....|...........|..../........|...............
    |           |   /         |
    |           |   |         |
    v           v   v         v
[ module ]  [ module ]    [ module ]   layer 0
    ^           ^             ^
....|...........|.............|............... hw interface
    v           v             v
[             hardware            ]
```

### approach 4: microkernal

newer design approach where os-level services typ. found in kernal space operate in user mode instead & are interacted w/ via service requests passed from user mode "client" processes to user mode "server" processes via the microkernal.

pros:

- portable: allows many different OS to be built on top of this kernal
- extendable: allows easy extension of kernal via new services added in user space instead of in kernal
- reliable/secure: significantly smaller, fails less often & failures in user mode services don't effect kernal

cons:

- perf overhead due to increased comms btwn kernal & user spaces
- not always possible to move a service to user space

```
[ client proc ]  [ client proc ] ... [ server proc ] ...
                        ^               ^                 user mode
........................|...............|..........................
 __                     |               |         __      kernal mode
|                       \---------------/           |
|                         microkernal               |
|__                                               __|
[                          hardware                 ]
```

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

### terminal servers

past: many/most computers were mainframes w/ thin clients that allowed
users to run programs on the mainframe while in other various
locations. these clients only handled displaying & all other logic was
run on the mainframe.

today: client machines are more intelligent and contain client-side
applications.

both have issues w/ vulnerabilities & either are creating lots of
overhead on the mainframe that could easily be handled client side, or
requiring complicated distributed client updates.

#### idea: terminal servers

examples: windows terminal services, citrix metaframe, xenserver

each terminal thin client can interact w/ 1 of a selection of terminal
servers via network; each server works together to distribute workload
as needed.

## hw & os virt

_**def:** virtualization_&mdash;abstracting a physical resource to
simplify usage/maintenance while presenting as a real resource to the
user/interface.

ex:

- virt machines
- virt runtime sys
- virt proc envs
- storage virt
- network virt
- app virt

### os virtualization

abstracts a computer's hw resources to allow for multiple virt
"computers" to share the same hw, even when running different operating
systems.

```
[p1][p2]p3]...[pl] [p1][p2][p3]..[pm]     [p1][p2][p3]...[pn]
[  os1 (windows) ] [  os1 (ubuntu)  ] ... [   os1 (macos)   ]
[           virtual machine monitor (hypervisor)            ]
[                            hardware                       ]
```

### runtime virtualization

ex:

- jvm
- .NET common runtime lang (CLR)

runtime env for prog lang: uses intermediate bytecode which is
interpreted by a VM to target the underlying host architecture. allows
programs to become independent of underlying sys platform. decouples
app software from OS.

> [!ASIDE]
>
> Q: what does hw virt allow on a single physical machine?
>
> A: operating systems

_**def:** cloud computing_&mdash;it infra provided over network, including computer power, OS', data storage, software

can be categorized as:

- private cloud
- public cloud
- hybrid cloud

### cloud service models

- IaaS: provides VMs (& OS') via OS virt
- PaaS: provides programming envs
- SaaS: provides software

metaphor: pizza as a service:

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

### serverless

misleading, still req. servers&mdash;just abstracts them away via a Function as a Service (FaaS) model.

ex:

- AWS lambda
- gc functions
- azure functions
- ibm cloud functions

> [!ASIDE]
>
> Q: company wants to deploy web app but doesn't want to manage OS or HW, focusing only on their app code. which model should they choose?
>
> A: PaaS

### resource-sharing approaches

ways to share underlying resources vary based on goals:

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

## wrap up

objectives:

- understand high-level steps on how to design an os
- user vs kernal mode
- name diff kernal architectures
- know diff terms for dist. arch.
- understand what virt. is
- distinguish btwn diff. cloud computing types
