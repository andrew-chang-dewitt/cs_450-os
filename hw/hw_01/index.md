---
title: "hw 1: handling the bash"
description: first hw assignment
keywords:
  - bash
  - operating systems
  - file systems
  - scripting
  - file i/o redirection & pipes
---

:::hgroup{.titlegroup}

# hw 1: handling the bash

Andrew Chang-DeWitt \
Math 474, Fall 2025 \
2025 Sept. 9

:::
:::hgroup{.titlegroup}

## task 1

basic linux command line & file system navigation

:::

### part (a)

> Determine your current working directory and display its contents.

```
andrew@topo: ~/college/cs_450-os/hw/hw_01
$ echo $PWD
/home/andrew/college/cs_450-os/hw/hw_01

andrew@topo: ~/college/cs_450-os/hw/hw_01
$ ls
index.md
```

### part (b)

> Use a single command to display all files, including hidden ones, in
> your home directory. Elaborate on and explain different arguments
> that this command can take.

Using the same command as above, `ls`, _all_ files can be listed using the `-a`
flag, which lists all files in the target directory, as explained in the quoted
portion of the help text (given by `ls --help`) below.

> ```
> Usage: ls [OPTION]... [FILE]...
>
> //...
>
>   -a, --all                  do not ignore entries starting with .
> ```

The command `ls` defaults to listing files in the current directory; however, a
target directory can be specified using the first positional argument.
Additionally, a common alias for the home directory is `~`. Putting all this
together gives a command of `ls -a ~`:

```
andrew@topo: ~/college/cs_450-os/hw/hw_01
$ ls -a ~
.                        .landscape                 .tmux.conf
..                       .lesshst                   .vim
.aws                     .local                     .viminfo
.azure                   .motd_shown                .vimrc
.bash_history            .mozilla                   .wget-hsts
.bash_logout             .node_repl_history         bin
.bash_logout.original    .npm                       college
.bashrc                  .nvm                       dev
.c-toolchains            .ocamlinit                 docs
.cabal                   .opam                      gh_2.76.2_linux_arm64.deb
.cache                   .pm2                       job-hunt
.cargo                   .profile                   kai
.config                  .pyenv                     libexec
.docker                  .python_history            libs
.fzf.bash                .rustup                    personal-configs
.gcc                     .skip-cloud-init-warning   share
.ghcup                   .ssh                       snap
.gitconfig               .stack                     tmp
.gitconfig.original      .sudo_as_admin_successful
.gitmessagetemplate.txt  .swp
```

### part (c)

> Create a new directory named `assignment_files` in your current location.
> Download the file from
> [https://go.uniwue.de/chaos](https://go.uniwue.de/chaos) using the `wget`
> command, and then extract its contents into the `assignment_files` directory.
> Navigate into the extracted directory and use the `find` command to locate
> the file named BS.kurs. What is its full path and size?

Download the file & save it to `assignment_files/` using the `-O` flag for
`wget`:

```
andrew@topo: ~/college/cs_450-os/hw/hw_01
andrew@topo: ~/college/cs_450-os/hw/hw_01
$ wget https://go.uniwue.de/chaos -O assignment_files/chaos.tgz
--2025-09-10 11:23:00--  https://go.uniwue.de/chaos
Resolving go.uniwue.de (go.uniwue.de)... 132.187.3.108
Connecting to go.uniwue.de (go.uniwue.de)|132.187.3.108|:443... connected.
HTTP request sent, awaiting response... 301 Moved Permanently
Location: https://www.uni-wuerzburg.de/fileadmin/10030200/user_upload/teaching/OS/chaos.tgz
 [following]
--2025-09-10 11:23:00--  https://www.uni-wuerzburg.de/fileadmin/10030200/user_upload/teachi
ng/OS/chaos.tgz
Resolving www.uni-wuerzburg.de (www.uni-wuerzburg.de)... 132.187.1.118
Connecting to www.uni-wuerzburg.de (www.uni-wuerzburg.de)|132.187.1.118|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 1163 (1.1K) [application/x-gzip]
Saving to: ‘assignment_files/chaos.tgz’

assignment_files/chaos 100%[===========================>]   1.14K  --.-KB/s    in 0s

2025-09-10 11:23:01 (233 MB/s) - ‘assignment_files/chaos.tgz’ saved [1163/1163]
```

Then extract with `tar` using the following flags:

- `-x` to tell `tar` extract
- from `assignment_files/chaos.tgz` using the `-f` flag
- `-C` to tell `tar` to extract into `assignment_files/` by performing
  operations in the desired directory

```
andrew@topo: ~/college/cs_450-os/hw/hw_01
$ tar -C assignment_files/ -xf assignment_files/chaos.tgz
```

Finally, find the requested file w/ `find` by passing the target directory as
the first positional argument & telling `find` to search for files matching
some filename (w/out leading directories) using the `-name` flag:

```
andrew@topo: ~/college/cs_450-os/hw/hw_01
$ find assignment_files -name BS.kurs
assignment_files/chaos/Hotels/Deutschland/Bayern/Wuerzburg/BS.kurs
```

:::hgroup{.titlegroup}

## task 2

file i/o redirection and pipes

:::

### part (a)

> The command ls `NONEXISTENT` `EXISTENT` generates both standard output and an
> error message. Redirect the standard output (`stdout`) to a file named
> `stdout.log` and the standard error (`stderr`) to a separate file named
> `stderr.log`. Note `EXISTENT` and `NONEXISTENT` are 'placeholders' to be
> filled by you.

Starting from the same directory as in _task 1_ where:

```
   EXISTENT := ./assignment_files
NONEXISTENT := ./nonexistant
```

Separate & redirect outputs:

- `stdout` to `stdout.log` using `COMMAND > OUTPUT` &
- `stderr` to `stderr.log` using `COMMAND 2> OUTPUT`

```
andrew@topo: ~/college/cs_450-os/hw/hw_01
$ ls ./assignment_files ./nonexistant > stdout.log 2>stderr.log

andrew@topo: ~/college/cs_450-os/hw/hw_01
$ cat stdout.log
./assignment_files:
chaos
chaos.tgz

andrew@topo: ~/college/cs_450-os/hw/hw_01
$ cat stderr.log
ls: cannot access './nonexistant': No such file or directory
```

### part (b)

> Assuming you have files named `A`, `B`, `C`, and `D`, describe the effect
> of the command `cat A - B <C >D`. Be specific about which files are read,
> which are written to, and in what order.

First, let's create some test files & confirm they have the desired contents:

```
andrew@topo: ~/college/cs_450-os/hw/hw_01/assignment_files
$ for x in A B C D; do
>   echo "this is file $x" > $x
> done

andrew@topo: ~/college/cs_450-os/hw/hw_01/assignment_files
$ for x in A B C D; do
>   echo "$x:"
>   cat $x
>   echo ""
> done
A:
this is file A

B:
this is file B

C:
this is file C

D:
this is file D
```

Then let's see what happens when we run the command `cat A - B <C >D`:

```
andrew@topo: ~/college/cs_450-os/hw/hw_01/assignment_files
$ cat A - B <C >D

andrew@topo: ~/college/cs_450-os/hw/hw_01/assignment_files
$ for x in A B C D; do
>   echo "$x:"
>   cat $x
>   echo ""
> done
A:
this is file A

B:
this is file B

C:
this is file C

D:
this is file A
this is file C
this is file B
```

It appears file `D` is changed, while files `A`, `B`, & `C` are unchanged. Why?

Operators `<` & `>` are file i/o redirection operators (we used `>` above):

- `> FILE` redirects a command's output to some `FILE` (the space is optional)
- `< FILE` reads from `FILE` to standard input (`stdin`)

So it appears the last thing we'll do is save our output to `D`. But why does
it appear to read the files `A`, `B`, & `C` in the order `A`, `C`, then `B`?

Consulting `man cat`:

> ```
> SYNOPSIS
>        cat [OPTION]... [FILE]...
>
> DESCRIPTION
>        Concatenate FILE(s) to standard output.
>
>        With no FILE, or when FILE is -, read standard input.
> ```

we see that `cat` can read a list of files, & it when given `-` as a file to
read, it reads from `stdin`. This means that `cat A - B <C >D` does the

1. read file `A` to `stdout`
2. read from `stdin` to `stdout`, where `stdin` is populated by reading from
   `C` using `<C`
3. read from `B` to `stdout`
4. redirect `stdout` to `D`, replacing its contents

### part (c)

> The `/etc/passwd` file contains a list of all local system users. The
> first column contains the username, and the last column contains the
> user's login shell. Filter this list to only show users who do not have
> `/bin/false` or `/usr/sbin/nologin` as their login shell. Use pipes to
> sort the filtered list alphabetically by the username.

First let's tackle sorting. We can read from `/etc/passwd` using `cat` & sort the output using `sort`:

```
andrew@topo: ~/college/cs_450-os
$ cat /etc/passwd | sort
Debian-exim:x:105:108::/var/spool/exim4:/usr/sbin/nologin
_apt:x:42:65534::/nonexistent:/usr/sbin/nologin
andrew:x:1000:1000:,,,:/home/andrew:/bin/bash
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
dhcpcd:x:100:65534:DHCP Client Daemon,,,:/usr/lib/dhcpcd:/bin/false
fex:x:106:109::/usr/share/fex:/bin/sh
games:x:5:60:games:/usr/games:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
landscape:x:104:105::/var/lib/landscape:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
messagebus:x:101:101::/nonexistent:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
polkitd:x:990:990:User for polkitd:/:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
root:x:0:0:root:/root:/bin/bash
snap_daemon:x:584788:584788::/nonexistent:/usr/bin/false
snapd-range-524288-root:x:524288:524288::/nonexistent:/usr/bin/false
sync:x:4:65534:sync:/bin:/bin/sync
sys:x:3:3:sys:/dev:/usr/sbin/nologin
syslog:x:102:102::/nonexistent:/usr/sbin/nologin
systemd-network:x:998:998:systemd Network Management:/:/usr/sbin/nologin
systemd-resolve:x:991:991:systemd Resolver:/:/usr/sbin/nologin
systemd-timesync:x:996:996:systemd Time Synchronization:/:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
uuidd:x:103:103::/run/uuidd:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
```

Pretty close, but it'd be better if `Debian-exim` was between `daemon` & `chcpcd`. This can be done using `sort`'s '`-f` flag:

```
NAME
       sort - sort lines of text files

// ...

       -f, --ignore-case
              fold lower case to upper case characters
```

which gives us:

```
andrew@topo: ~/college/cs_450-os
$ cat /etc/passwd | sort -f
andrew:x:1000:1000:,,,:/home/andrew:/bin/bash
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
Debian-exim:x:105:108::/var/spool/exim4:/usr/sbin/nologin
dhcpcd:x:100:65534:DHCP Client Daemon,,,:/usr/lib/dhcpcd:/bin/false
fex:x:106:109::/usr/share/fex:/bin/sh
games:x:5:60:games:/usr/games:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
landscape:x:104:105::/var/lib/landscape:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
messagebus:x:101:101::/nonexistent:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
polkitd:x:990:990:User for polkitd:/:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
root:x:0:0:root:/root:/bin/bash
snapd-range-524288-root:x:524288:524288::/nonexistent:/usr/bin/false
snap_daemon:x:584788:584788::/nonexistent:/usr/bin/false
sync:x:4:65534:sync:/bin:/bin/sync
sys:x:3:3:sys:/dev:/usr/sbin/nologin
syslog:x:102:102::/nonexistent:/usr/sbin/nologin
systemd-network:x:998:998:systemd Network Management:/:/usr/sbin/nologin
systemd-resolve:x:991:991:systemd Resolver:/:/usr/sbin/nologin
systemd-timesync:x:996:996:systemd Time Synchronization:/:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
uuidd:x:103:103::/run/uuidd:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
_apt:x:42:65534::/nonexistent:/usr/sbin/nologin
```

Now let's filter out users "who do not have `/bin/false` or `/usr/sbin/nologin`
as their login shell". Using `grep`, we can remove any line not matching some
regular expression. Since we're only interested in the last column of each
line, we can match the contents of it using a regex to match from a colon to
the end of the line (`$`), like `:SOMETHING$`.

To figure out what should be between `:` & `$`, we only need to match two exact
values, so it can be fairly simple, using the OR (`|`) regex operator (e.g.
`.*A$|.*B$` matches any line ending in `A` or `B`). The simplest form is to
just replace `A` & `B` in our example, giving us a regex of
`(:/bin/false|:/usr/sbin/nologin)$` to match any line that _does_ specify the
shell we wish to _exclude_. `grep` uses POSIX regex (enabled using the `-E`
flag), so no negative lookahead exists; however, the expression can still be
negated by supplying the `-v` flag.

```
andrew@topo: ~/college/cs_450-os
$ cat /etc/passwd | grep -vE '(:/bin/false|:/usr/sbin/nologin)$' | sort -f
andrew:x:1000:1000:,,,:/home/andrew:/bin/bash
fex:x:106:109::/usr/share/fex:/bin/sh
root:x:0:0:root:/root:/bin/bash
snapd-range-524288-root:x:524288:524288::/nonexistent:/usr/bin/false
snap_daemon:x:584788:584788::/nonexistent:/usr/bin/false
sync:x:4:65534:sync:/bin:/bin/sync
```

### part (d)

> Save your command history to a file named `hist` using the `history`
> command. Then, using `head` and `tail`, display the first 10 and the last
> 10 commands from the hist file, respectively. Finally, display all
> commands from the `hist` file except for the first 10.

Use `>` to redirect output to `assignment_files/hist`:

```
andrew@topo: ~/college/cs_450-os/hw/hw_01/
$ history > assignment_files/hist
```

then get head & tail using default values of 10 lines each:

```
andrew@topo: ~/college/cs_450-os/hw/hw_01/
$ head assignment_files/hist && tail assignment_files/hist
 1055  git cob tmp
 1056  git branch -D blog/notes
 1057  git co blog/notes
 1058  git ll -20
 1059  git plo
 1060  git ll -20
 1061  git co tmp
 1062  git rebase -i blog/notes
 1063  git ll -20
 1064  git co blog/notes
 2045  cat /etc/passwd | grep '(?!(:/bin/false|:/usr/sbin/nologin)$)'
 2046  cat /etc/passwd | grep '(:/bin/false|:/usr/sbin/nologin)$'
 2047  cat /etc/passwd | grep -E '(:/bin/false|:/usr/sbin/nologin)$'
 2048  cat /etc/passwd | grep -E '(?!(:/bin/false|:/usr/sbin/nologin)$)'
 2049  cat /etc/passwd | grep -vE '(:/bin/false|:/usr/sbin/nologin)$'
 2050  cat /etc/passwd | grep -vE '(:/bin/false|:/usr/sbin/nologin)$' | sort -f
 2051  cat /etc/passwd | grep -E '(:/bin/false|:/usr/sbin/nologin)$' | sort -f
 2052  cat /etc/passwd | grep -vE '(:/bin/false|:/usr/sbin/nologin)$' | sort -f
 2053  history
 2054  history > assignment_files/hist
```

### part (e)

> First, use curl to retrieve the content of `www.google.com`. Then, use `grep`
> and a regular expression to find all links in the format of `<a href="...">`.
> Finally, using the `sed` command, prepend the text "URL: " to each matching

use `grep`'s `-o` flag to only print the matched text:
Download the html with `curl`, then use `grep`'s flags...

- `-o` to only print the matched text
- `-P` to use Perl-style regex (enabling lookahead/behind assertions)

& finally use `sed` to capture the entire line, then prepend "URL: " to the
captured reference:

```
andrew@topo: ~/college/cs_450-os/hw/hw_01
$ curl www.google.com \
>   | grep -oP '(?<=<a href=")[^"]*(?=">)' \
>   | sed 's/.*/URL: &/'
URL: /advanced_search?hl=en&amp;authuser=0
URL: /intl/en/ads/
URL: /services/
URL: /intl/en/about.html
URL: /intl/en/policies/privacy/
URL: /intl/en/policies/terms/
```

:::hgroup{.titlegroup}

## task 3

:::

### part (a)

> Create a bash script named `mvall`. This script should accept two or three
> parameters:
>
> - The first parameter, if present, can be a flag `--log`. If this flag is
>   provided, the script should print a log message after completion.
> - The second parameter is a file extension (e.g., `.txt`, `.pdf`).
> - The third parameter is the name of a new directory to be created.
>
> Further, the script should check if the new directory already exists. If it
> does, the script should exit with an error. It should count the number of
> files in the current directory that match the given file extension, create
> the new directory, and then move all matching files into it. If the `--log`
> flag was provided, the script should print the number of files moved to the
> new directory.

```bash
#!/usr/bin/env bash

help_text="\
Usage: $0 [OPTION]... EXTENSION DEST

Move all files with matching EXTENSION a new directory at DEST. Exits with an
error if DEST already exists.

Options:
  --log                 print number of files moved when done
"

declare -i log=0                        # logging output defaults to false
declare -i argc=$#                      # track original arg count value
# use declare -i to make integer variables instead of strings

if [ "$1" = "--log" ]; then
    log=1                               # set log to true
    shift                               # pop first arg off of argv
fi


if [ $# -ne 2 ]; then                   # guard against bad number of args
    declare -i argcexp=2+$log           # always expects 2 or 3 args
    err_msg="Bad number of arguments. Expected $argcexp, got $argc."

    printf "$err_msg\n\n" >&2           # send err msg to stderr
    printf "$help_text"                 # print usage help text on stdout
    exit 1                              # exit w/ error
fi

ext="$1"                                # save extension
dst="$2"                                # save destination path

if ! mkdir $dst 1>&2 2>/dev/null ; then # silently create destination directory
                                        # & report any failures
    err="Error creating directory at $dst:"
    if [ -d $dst ]; then                # report more helpful msg if dst exists
        printf "$err Directory already exists.\n" >&2
    else
        printf "$err Please make sure $dst is a valid path.\n" >&2
    fi
    exit 1                              # then exit w/ error code
fi

if ! mv *$ext $dst/ 1>&2 2>/dev/null    # move files matching ext
then                                    # and guard against failure
    printf "Error moving files." >&2
    exit 1
fi

if [ $log -ne 0 ] ; then                # report count of files moved
    count=$(ls -q $dst | wc -l)
    printf "$count files moved\n"
fi
```

testing this script with a directory containing the following 6 files:

```
andrew@topo: ~/college/cs_450-os/hw/hw_01/test
$ tr3
.
├── lec_00-administrivia.md
├── lec_01-intro_to_os.md
├── lec_02-history.css
├── lec_02-history.md
├── lec_03-architecture.md
└── lec_04-interrupt_handling.md

1 directory, 6 files

andrew@topo: ~/college/cs_450-os/hw/hw_01/test
$ ../mvall --log .css c
1 files moved

andrew@topo: ~/college/cs_450-os/hw/hw_01/test
$ ../mvall --log .md m
5 files moved

andrew@topo: ~/college/cs_450-os/hw/hw_01/test
$ tr3
.
├── c
│   └── lec_02-history.css
└── m
    ├── lec_00-administrivia.md
    ├── lec_01-intro_to_os.md
    ├── lec_02-history.md
    ├── lec_03-architecture.md
    └── lec_04-interrupt_handling.md

3 directories, 6 files

andrew@topo: ~/college/cs_450-os/hw/hw_01/test
$ ../mvall bad
Bad number of arguments. Expected 2, got 1.

Usage: ../mvall [OPTION]... EXTENSION DEST

Move all files with matching EXTENSION a new directory at DEST. Exits with an
error if DEST already exists.

Options:
  --log                 print number of files moved when done

andrew@topo: ~/college/cs_450-os/hw/hw_01/test
$ ../mvall bad two three
Bad number of arguments. Expected 2, got 3.

Usage: ../mvall [OPTION]... EXTENSION DEST

Move all files with matching EXTENSION a new directory at DEST. Exits with an
error if DEST already exists.

Options:
  --log                 print number of files moved when done

andrew@topo: ~/college/cs_450-os/hw/hw_01/test
$ ../mvall --log bad
Bad number of arguments. Expected 3, got 2.

Usage: ../mvall [OPTION]... EXTENSION DEST

Move all files with matching EXTENSION a new directory at DEST. Exits with an
error if DEST already exists.

Options:
  --log                 print number of files moved when done
```

:::hgroup{.titlegroup}

## task 4

process management

:::

### part (a)

> Briefly explain the different signals used with the `kill` command (e.g., `TERM`, `INT`, `KILL`) and in what situation you would use each.

### part (b)

> Use the `&` operator to run the `cat /dev/random` command in the background. Note the process ID (`PID`) that is displayed. Then, terminate the background process you started.

:::hgroup{.titlegroup}

## task 5

"Gonna catch 'em all"

:::

> Ash is a computer science student at Illinois Tech and a die-hard Pokémon
> (see [Wikipedia](https://en.wikipedia.org/wiki/Pokémon)) fan. He thinks
> while attending the OS lecture "As I cannot catch Pokémon right now, I can
> gather information on them". To achieve his plan, Ash wants to create a
> web crawler that retrieve all information from the [Poké
> Wiki](https://pokemon.fandom.com/wiki/List_of_Pokémon). The crawler should
> recursively visit the associated links, but ultimately each link only
> once. Ash also wants to appropriately visualize the resulting page
> hierarchy using a tree graph.

> Translated, the text above means that this final task requires writing a
> compact web crawler. It should recursively call all possible subpages from
> the any website (you are free to use the Pokémon Wiki), but in such a way
> that each link is visited only once in the end. In addition, the resulting
> hierarchy should be appropriately visualized using a tree graph.

### part (a)

> First, write a script that parses the content of a given `URL` and outputs
> all links. The script accepts either 1 or 2 arguments. If only 1 argument
> is passed, it is the domain. With two argu ents, the first argument is the
> domain and the second is the path. This means that when calling `script.sh
www.test.com` and `script.sh www.test.de/path1/path2`, only the page
> `www.test.com` is read, but when calling `script.sh www.test.com path1`,
> the page `www.test.com/path1` is read. After all links from the page have
> been captured, only the URLs that start with `http[s]` should be
> considered for simplicity.

### part (b)

> The second script should control the crawling. It starts with the staring
> website (e.g., `https://pokemon.fandom.com/wiki/List_of_Pokémon`) (Level
> 0). The links there are read with the script from task a). These links
> (Level 1) should be saved to a file, e.g., `level1.txt`. Further more, for
> each extracted link, all links reachable from there are read out again.
> These new links (Level 2), which are all reachable from the 'old' links
> (Level 1), should also be saved to a file, e.g., `level2.txt`. In short,
> all links reachable from Level i (Level i+1) are written out. To avoid
> infinite loops, the script must remember which URLs it has already read
> and then skip them. In addition, only pages that start with the same
> domain (in the example `https://pokemon.fandom.com/`) should be read.

### part (c)

> Write a script that visualizes (as tree graph) for a given level from
> which URLs other URLs are reachable.

### part (d)

> Name your favorite Pokémon and elaborate why.
