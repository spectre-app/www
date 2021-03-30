---
draft: true
title: Comparing Password Strategies
date: 2021-03-28T12:13:00-04:00
author: Maarten Billemont
image: https://images.unsplash.com/photo-1586772002345-339f8042a777
description: >
  Evaluating the different strategies around password management to identify pain points.
---


## What is trust?

When seriously evaluating a security solution, we need to be clear about our end
goals. By formalizing the concept of password security concretely, we gain the
ability to test solutions and evaluate their real benefit in concrete fact.

All trust in external entities is by necessity limited. There are no guarantees.
What it means "to trust a solution" therefore requires an objective awareness
of what the solution's security parameters are and whether those parameters are
compatible with our security needs.

What this article sets out to accomplish is to explore the security parameters
involved in different approaches to password authentication in an effort to
clearly identify the objective weaknesses present in the solution as well as
the ancillary risk that adoption requires us to incur. This will allow us to
select the strategy that best aligns with our needs and ability to assume risk.


## State vs. stateless

Most of us are familiar with at least several market solutions, if not several
home-cooked solutions, for managing the conundrum of password security through
administrative means. That may mean keeping track of a growing list of passwords
in a ledger, notebook, digital database, encrypted vault, system-supplied key
chain or modern cloud-supported platform.

These solutions are so common-place that the thought of there being a different
way to address the problem of passwords can come as a bit of a moment.

Statelessly addressing the password problem is however something many of us
have likely already tried without really taking notice of the fact.
It's not uncommon for people to come up with internal mechanisms for deriving
a unique password for the websites they need to create accounts with. We may
concoct such algorithms as taking the website's name and appending our birth
year, spelling it out on the keyboard by pressing every key to the right of each
letter in the website's name, or even performing a more complicated cipher such
as rotating it.


## Creating Passwords

Whether we end up in a stateful or stateless password solution results mainly
as a natural consequence of the way in which we have chosen to create them.
We rarely give this relationship much thought and therefore often arrive
automatically at a need for password storage that we hold as self-evident.

As such, let's begin our evaluation at the point of inception: what are the
different ways in which we can create our passwords and how should we evaluate
those strategies with the consequences they incur?

In this article, we'll test the following password creation strategies:

CRS-MREM
: Using our memory, we create a password we're likely to be able to remember.

CRS-MRND
: We think of a new and maximally arbitrary password.

CRS-MALG
: We use a personal algorithm for translating a name into an associated password.

CRS-SREM
: Using software, we compose a random password or passphrase that is memorable.

CRS-SRND
: Using software, we create a maximally arbitrary password.

CRS-SALG
: Using software, we derive a name into an associated password.

We'll test our strategies by exploring their performance against the following
metrics:

CRM-LIMS
: What limitations are we placing on the password's entropy?

CRM-REQS
: What do we need in order to create passwords this way?

CRM-DEPS
: What dependencies do we incur for continued use of this password?

CRM-VULS
: What paths exist for an unauthorized party to obtain this password?

We will rate our findings on a scale from safe to problematic, where:
- <i class="fas fa-fw fa-shield-exclamation safe"></i> A safe rating represents
  a finding that we do not expect should give rise to concern in terms of impact
  on the viability of using this strategy for securing our accounts.
- <i class="fas fa-fw fa-triangle-exclamation notice"></i> A notice rating
  represents a finding that warrants care in order to ensure the implementation
  accommodates for what might otherwise become a cause for concern that could
  impact the security of our account.
- <i class="fas fa-fw fa-octagon-exclamation severe"></i> A severe rating
  indicates a finding that compromises the strategy's ability to yield trustworthy
  account security with no viable solutions for mitigating the weakness.


### CRS-MREM

> eg. `jake1982`, `sarahhhhhh6`, `qazwsxedcrfv`, `2dragons!`

In the absence of any tools and prior experience, this strategy is often what
first comes to us when confronted with a need to secure our online presence.

Confronted with a request for a password, we do our best to answer to what
appears to be the question asked of us: "please tell me a secret word that I
can recognize you by in the future". We think of what might be such a word,
cognisant of the fact that we will need to be able to recall it in the future.

#### CRM-LIMS

1. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Constrained by past experiences, often non-exclusive knowledge
2. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Human creativity biases away from uniformly random

#### CRM-REQS

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Creative energy

#### CRM-DEPS

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Reliable expansive memory

#### CRM-VULS

1. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Low entropy facilitates searching the domain space
2. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Knowledge of personal information may further narrow the domain space
3. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Partial or complete password re-use is a fast track to compromise


### CRS-MRND

> eg. `dmsabdadnmb`, `EfRq!15`, `31051982`, `m%Q$y*(xY#`

When we learn of the realities around account insecurity and the impact it may
have, hopefully indirectly and not first-hand, we often find the next step
toward taking account security seriously involves the realization that our
passwords need to be both unique for each site and also sufficiently random so
as to make successful guesses against the token we've chosen less likely. We
may adopt this strategy selectively, such as only for our most valued accounts.

We think really hard and try to come up with a token that appears as far away as
anything guessable might appear. We do now realize that this isn't something we
can continue to try to remember, especially after doing this for four or five
accounts, and seek out solutions for persisting our more secure passwords.

#### CRM-LIMS

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Human creativity biases away from uniformly random

#### CRM-REQS

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Creative energy

#### CRM-DEPS

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   A method for persistence and recollection

#### CRM-VULS

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Bias impacts the size of the domain space
2. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Our persistence method and its usage can lead to complete compromise


### CRS-MALG

> eg. `tertwi3`, `f4c3b00k`, `bqqmd!`, `hpph;r/vp,`

Having gone from a solution where we created and remembered our own passwords
to one where it had now become impossible to log into our accounts without
the support of a tool, often one we don't have exclusive control over.

Instinctively some people chose a different path, intentionally seeking to find
a middle ground between being able to have hundreds of unique passwords and not
needing to surrender our ownership and control. The end result tends to be a
home crafted algorithm of some sort where we translate the name of the site into
a unique password for it.

#### CRM-LIMS

2. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Human crafted algorithms are deceptively low entropy

#### CRM-REQS

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Mentally solving the algorithm

#### CRM-DEPS

1. <i class="fas fa-fw fa-shield-exclamation safe"></i>
   We need to remember the algorithm

#### CRM-VULS

1. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Biased output leads to critically low entropy
2. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   The algorithm is susceptible to reverse engineering
   

### CRS-SREM

> eg. `banana colored duckling`, `totally physical shoulder`, `want timely plastic butterfly`

A less common solution attempts to combine the benefits of personal ownership
with the cheap and unbiased ability for software to generate high entropy tokens.
In this strategy, a program can be used to generate what will often be a sentence
based on a very large word list, with sufficient grammatical coherence to allow
our memories to easily store and recollect the sentence on demand.

The size of the original word list combined with the length of these passphrases
is often quite successful at generating high entropy passwords. Interestingly,
people are in fact very capable of remembering arbitrary or nonsensical sentences
since the mind naturally tends to weave a story around them that aids in
recollection.


### CRS-SRND

> eg. `~,&s2'<T{u`, `UHj80koBGsh6`, `45406061`, ``

: Using software, we create a maximally arbitrary password.


### CRS-SALG

: Using software, we derive a name into an associated password.
