# intro to OS

> [!ASIDE]
> Q: what does DOS, the first OS, stand for?
>
> A: Disk Operating System

a computer has lots of Hardware:

machine, wiring, phys comp, includ

- cpu
- gpu
- ram
- nic
- peripherals & user i/o

but how does it do anything w/ hardware or how does software know about
it? entre OS.

OS is mediator btwn user software & comp hardware:

- allocates resources
- provides common services for things like networks & disks
- abstract interface to simplify things & make them portable

## how a computer actually works

composed of many layers:

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

more layers:

- high level code: code used to write application software, typically
- compiler/assembler: tool for translating high level code to arch specific
  machine lang
- ISA: def of instructions a given target arch can understand;
  is API or "contract" btwn SW & HW
- microarchitecture: how cpu is built to implement a given ISA
- hardware: physical impl of HW

### machine lang

- made of machine instructions encoded in binary
- makes commands that cpu can directly understand

- instruction set (commands that can be expressed/understood) is
  influenced by computer's architecture design
  - most common type today is von-neumann architecture
  - barely used: harvard architecture

### von-neumann arch (1946)

computer is made of components:

- cpu
  - control unit
  - alu
- memory unit
- i/o
- sys bus

### harvard architecture (1939-1944)

created for the Mark I computer

key difference from VN: two different memories

1. data
2. instructions

this meant two sys bus', giving the advantage of twice as much memory
available, but the disadvantage of more complex hardware which means
more complex instructions

### modern VN archs: x64 & x86

|                   | x86                        | x64                        |
| ----------------- | -------------------------- | -------------------------- |
| init release      | 1978                       | 2000                       |
| origin            | intel 8086 proc            | AMD                        |
| bit amt           | 32-bit                     | 64-bit                     |
| addressable space | 4 GB                       | 16 Billion GB              |
| data transmission | only 32-bits at a time     | 64-bits                    |
| app support       | no support for 64-bit apps | bkwds compatible w/ 32-bit |

### important basic register names/concepts:

- PC: program counter
- IR: instruction register
- SP: stack pointer
- status reg, used for boolean ops & tracking current _mode_ (user vs kernal
  mode)

### program exec steps simplified

1. fetch instruction at PC
2. decode instruction
3. exec instruction
4. write possible result to reg/mem
5. inc PC
6. repeat

### parallelization via multi-processing

- multicore
  - multicore CPUs are procs w/ multipe, independent & separate CPUs on the
    same die
  - each core is own separate proc unit
  - many resources are duplicated between cores (other than bus & caches)
  - more cost effective than one board w/ multiple CPUs
- simultaneous multithreading (e.g. intel's hyperthreading)
  - actually just one core, but exposed to OS as multiple cores
  - single-core procs w/ multiple PCs, register sets, & interrupt
    controllers, allowing faster switchign between multiple concurrent

> [!NOTE]
> threading referred to above in hyperthreading is _not_ discussing OS-level
> threads, but instead a HW level construct

## operating systems

so we now know the basics of how a computer works & that an OS interfaces between the hardware/machine level & application/user level. what kinds of computers have an OS though?

- mainframes
  - high-end systems/supercomputers
  - ibm os/390
  - ibm z/OS
  - ...
- servers
  - unix
  - linux
  - solaris
  - windows NT
  - windows server 20x
- PCs
  - linux
  - windows xx
  - macos x
- tablets & mobile
  - iOS
  - android
  - symbian
  - windows phone
- embedded & real-time systems
  - VxWorks
  - QNX
  - OSEK
  - embedded linux
  - netbsd
  - windows iot
- smart cards (like in credit card chips)
  - java card
  - multos
  - slcos

### but what is an OS?

- a _huge_ program (linux is 25+ million lines of C code)
- manages HW resources
- controls exec of programs to prevent errors & improper use
- intermediary btwn user & HW

a program w/ following goals:

- user perspective:
  - exec user programs & make solving problems easier
  - make computer convenient to use
  - hide messy details
  - preset user w/ VM easier to use
- system/HW perspective:
  - manage resources
  - make HW usage efficient
  - time sharing
  - resource sharing

### the kernal

Q: what is the kernal?

the core part of the OS, target arch specific & handles all interfacing w/
resources/processes/devices/syscalls/mem mgmt/etc.

if the kernal does all that, what does the rest of the OS do?

- boot loader
- UI
- libraries
- applications & utilities

## some history

modern OS' are complicated & do many things to make computing easier & more
convenient. but they didn't start that way:

### early systems

relied on serial operations only & direct interfacing w/ HW

- one app at a time
- app had complete control of hw
- OS was just set of basic functions that most applications needed
- users would stand in line to use a computer

this was slightly improved by adding a concept of a queue for jobs, using
_batch systems_:

- keeps cpu busy instead of downtime between jobs
- os would load next job to be ready while current job is running
- users would submit jobs, then just wait

while batch systems were an improvement, serial operations mean incredibly
difficult to create complex applications & it was difficult to know when your
job would be ready & when it would be done. because of this, computers were
still very inconvenient & only useful for big, complicated, tedious
computational jobs & not for everyday simple problem solving.

### time sharing

time sharing was introduced to eliminate wasted cpu time, allowing a computer
to schedule jobs & switch between them as needed. worked by dividing cpu time
into small slices w/ opportunities to _interrupt_ processes & switch between
them. allowed the following advantages:

- multiple simultaneous users
- interactive computing, real-time interaction w/ running programs
- as computers became cheaper, allowed to optimie for _user time_ instead of
  _computer time_

> [!ASIDE]
> Q: which part of OS manages sys resources?
>
> A: kernal

> [!ASIDE]
> Q: what type of OS allows multiple simultaneous users & real-time interactive programs?
>
> A: time-sharing OS
