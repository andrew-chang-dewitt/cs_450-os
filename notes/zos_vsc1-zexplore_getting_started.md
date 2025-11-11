---
title: "Using the terminal & vim with IBM's zexplore"
description: "notes from completing the first task of IBM's ZExplore program."
keywords:
  - "ibm"
  - "zos"
  - "vim"
  - "operating systems"
  - "computer science"
  - "cs 450"
  - "illinois tech"
meta:
  byline: Andrew Chang-DeWitt
  published: "2025-11-11T00:00-06:00"
---

this first module is a simple setup/intro. it directed me on how to
obtain my credentials, then install & configure a client via a VSCode
plugin, and finally submit a job to the mainframe to confirm my client
is set up.

i prefer cli's over gui's most of the time & default to terminal + vim
for almost all of my work. after some hunting around in the docs
([docs.zowe.org](https://docs.zowe.org)) i found they provide a cli
in addition to the VSCode extension (in fact, the cli actually powers
the extension).

## `zowe` cli installation

as in the cli docs @
[docs.zowe.org/stable/user-guide/cli-installcli/](https://docs.zowe.org/stable/user-guide/cli-installcli/),
installing the cli was simple enough with a quick `npm` command:

```shell
npm install -g @zowe/cli@zowe-v3-lts
```

additionally, they shared a command to install all the official plugins
available:

```shell
zowe plugins install                    \
    @zowe/cics-for-zowe-cli@zowe-v3-lts \
    @zowe/db2-for-zowe-cli@zowe-v3-lts  \
    @zowe/mq-for-zowe-cli@zowe-v3-lts   \
    @zowe/zos-ftp-for-zowe-cli@zowe-v3-lts
```

however, if you're on an arm64 processor, you'll be unable to install `db2`,
like me. so far i haven't had any issues just skipping installing that plugin.

## `zowe` cli configuration

```shell
zowe config init --global-config
```

but it assumes that your os provides a secure creditial storage solution. in my
case, this was `gnome-keyring` as i'm running debian on wsl&mdash;however, i
use another central password manager outside of gnome/debian & don't run
keyring on my system. instead of setting it up just for this tool, i've found
it easier to just disable the automatic storage feature that attempts to load &
save credentials from & to keyring by editing my config @

````jsonc
{
```jsonc
{
  // ...
    "project_base": {
      // ...
      "secure": []                    // was `["user", "password"]`
    }
  },
  // ...
  "autoStore": false                  // was `true`
}
````

finally, there were a few other configuration changes required in the module
instructions.

```jsonc
{
  // ...
  "profiles": {
    "zosmf": {
      "type": "zosmf",
      "properties": {
        "port": 10443, // changed from `443`
      },
      "secure": [],
    },
    "tso": {
      "type": "tso",
      "properties": {
        "account": "FB3", // was blank `""`
        // ...
      },
      "secure": [],
    },
    "ssh": {
      "type": "ssh",
      "properties": {
        "port": 22,
      },
      "secure": [],
    },
    "cics": {
      "type": "cics",
      "properties": {},
      "secure": [],
    },
    "mq": {
      "type": "mq",
      "properties": {
        "port": 0,
      },
      "secure": [],
    },
    "zftp": {
      "type": "zftp",
      "properties": {
        "port": 21,
        "secureFtp": true,
      },
      "secure": [],
    },
    "project_base": {
      "type": "base",
      "properties": {
        "host": "<HOST IP ADDR>", // inserted host ip address provided
        "rejectUnauthorized": false, // was `true`
      },
      // ...
    },
  },
  // ...
}
```

after a quick exit of my terminal & entering it again to allow ZOWE to run with
these new configurations, i was able to confirm i can connect to the module's
host with the following command (replacing the `xxxxx` below with my user
number):

```shell
zowe zos-files list data-set "Zxxxxx.*"
```

which then prompted me for my username & password (credentials can also
be provided via options, e.g. `zowe zos-files list data-set "Zxxxxx.*"
--username <USERNAME> --password <PASSWORD>`) before showing the one
file available under my user's data-set:

```shell
andrew@topo: ~/college/cs-450/hw/zxplore-cert
$ zowe files list ds "Z*****.*" // username numbers replaced with *
Z*****.README
```

## module task: submitting a job

with everything set up, there was only one last step to complete:
submitting a job. reviewing the cli help text (w/ `zowe -h`) i was
able to find that jobs can be submitted with:

```shell
zowe jobs submit ...
```

but figuring out how to download a sample job file to use in my
submission was a little trickier. the `files` command group has the
obviously titled command `download`, but getting a useful format out of
the dataset at `ZXP.PUBLIC.JCL` was unclear. my first attempt used a
naive approach of just downloading the dataset directly. this
_technically_ worked, but the resulting file was incomprehensible
garbage.

reviewing this first attempt, i noticed the file the module
instructions said i was supposed to be looking for wasn't actually
listed (`ZXP.PUBLIC.JCL.CHKVSC`). additionally, i noticed that _some_
of the garbage downloaded in my first attempt did contain some readable
characters, including the string "CHKVSC". based on these two facts, i made a guess that a data-set must
be something akin to a directory (it would have helped if the provided
instructions had some sort of explanation about these differences
between z/OS & Unix). while this alone didn't get me to a working
solution (i still had no idea how to find a file i couldn't see yet), i eventually found a [helpful gist](https://gist.github.com/kuzmiigo/421c6dd850c3cdef9e0f891c38e4b4de) that showed an old way of downloading _all_ files in a given dataset. from there, i was able to arrive at the following command:

```shell
andrew@topo: ~/tmp/zxplore-cert
$ zowe files dl \
      all-members-matching "ZXP.PUBLIC.JCL" "CHKVSC" \
      --directory zxp/public/jcl \
      --extension "jcl" \
      --preserve-original-letter-case
1 members(s) were found matching pattern.

1 member(s) downloaded successfully.
Destination: zxp/public/jcl/
```

which downloaded the CHKVSC file contents:

```jcl
//@VSC1     JOB ,MSGLEVEL=(0,0),CLASS=7
// EXEC ZXP$$CHK
```

finally, i submitted a job using this downloaded file as the job source:

```shell
andrew@topo: ~/tmp/zxplore-cert
$ zowe jobs submit lf "zxp/public/jcl/CHKVSC.jcl"
jobid:   JOB02925
retcode: null
jobname: @VSC1
status:  INPUT
```
