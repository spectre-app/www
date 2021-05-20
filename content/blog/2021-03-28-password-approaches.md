---
title: What is safe?
date: 2021-03-28T12:13:00-04:00
author: Maarten Billemont
image: https://images.unsplash.com/photo-1586772002345-339f8042a777?auto=format&h=400&q=80
description: >
  Evaluating the different strategies around password management to identify pain points.
chat: 42
---


## What is trust?

When seriously evaluating a security solution, we need to be clear about our end
goals. By formalizing the concept of password security concretely, we gain the
ability to test solutions and evaluate their real benefit in concrete fact.

All trust is by necessity limited. There are no guarantees.
What it means "to trust a solution" therefore requires an objective awareness
of what the solution's security parameters are and whether those parameters are
compatible with our security needs.

What this article sets out to accomplish is to explore the security parameters
involved in different approaches to password authentication in an effort to
clearly identify the objective weaknesses present in the solution as well as
the ancillary risk that adoption requires us to incur. This will allow us to
select the strategy that best aligns with our needs and ability to assume risk.


## Parameters

To determine a solution's viability, we need to evaluate its performance in
several distinct categories. It's important to think beyond claims such as
security, encryption or entropy, and consider the full scope of consequences
that adoption brings.

In this article, we will be testing solutions against to the following
categories. 

Entropy
: What limitations are we placing on the password's entropy?

Requirements
: What do we need in order to create passwords this way?

Dependents
: What dependencies do we incur for continued use of this password?

Vulnerabilities
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

### Entropy

In this context, entropy is defined as the size of the space that an attacker
would need to search in order to successfully guess the password that was
created.

A low entropy means fewer guesses are required in order to make a successful
guess against the password. This unlocks the ability to brute-force the
password, ie. defeat the solution's security with no need for finding and
exploiting any inherent weaknesses.

> The way in which low entropy is exploited is by making attempts against the
password and checking whether those attempts were successful.

Even when we consider the incredibly limited space of a 4-digit PIN, an attacker
attempting a brute-force strategy against the PIN's entropy would still need to
search a space of 10,000 possibilities.

Nearly all password-protected assets are engineered specifically to minimize
the ability for attackers to make random attempts against the password.  
If an attacker is only permitted an attempt every 10 seconds, the time it takes
to search a space of 10,000 candidates tops out at 100,000 seconds, or over
27 hours. Increase the delay to 1 hour after the first 5 failed attempts and the
attack now tops out at 35,982,050 seconds, surpassing a year.  
If an attacker is only permitted a total of 5 attempts before being locked out,
a brute-force strategy that needs to search a space of 10,000 candidates has no
realistic chances of success.

> Consequently, any attack against a password that seeks to successfully exploit
its entropy requires access to a method of testing the password by the thousands
per second.

Unfortunately, we do live in a world where such a tool exists: password leaks.
The websites that hold our accounts need some way of testing whether we have
provided the correct password. They can do this either by storing your password
directly in their database, or by storing a one-way cryptographic hash of the
password. When the website's database is infiltrated and its contents stolen,
attackers can now use what's in the database to make an attempt against your
account at this website.

When websites leak clear-text password databases, ie. databases where your
password was stored as-is, it's unfortunately game-over for you. An attacker can
now simply find your exact password in the leak and impersonate you with it.

When websites store one-way hashes of passwords, ie. the recommended way of
storing shared secrets, an attacker can only see a "fingerprint" of your
password. They have a "clue" about what your password might be, and will need to
try looking at a bunch of passwords to see which one has the same fingerprints
as your password in this leak has. This is where brute-forcing your password's
entropy comes in. An attacker will run the website's chosen hash function
against a random guess. This will give them a similar fingerprint for their
guess. If the result matches what they find in the leak, they know they've made
a correct guess and what your original password was.

There are different types of hash functions that websites use to protect our
accounts. The main feature of a good hash function in this context must be that
it is expensive: ie. it takes a lot of resources to run the hash function. This
may seem counter-intuitive: wouldn't a website want their account login code to
be cheap, so that many thousands of customers can log in quickly and easily?
Why, yes, but keep in mind that an attacker would need to use the same hash
function as that chosen by the website, so the more expensive the chosen hash
function is for a website, the more expensive it will be for an attacker to
make guesses against your fingerprint in it. We arrive thus at a situation where
a careful balance must be made in choosing a hash function that is expensive
enough to repel attackers and yet cheap enough to allow the website to employ it
at scale for its customers.

> Widely adopted currently is the bare minimum recommendation of `bcrypt` with
> a cost factor of `10`.

In the table below, we evaluate the time cost for scanning the full entropy of
our hash functions using the `Nvidia GTX 1080 Ti` work horse GPU.

| Entropy       | Example                | Time (bcrypt-10)      | Time (sha-256)        |
| ------------- | ---------------------- | --------------------- | --------------------- |
| ~13 bit       | `9268`                 | 14.59 Seconds         | 0 Seconds             |
| ~31 bit       | `Paj7=Kaf`             | 1.31 Months           | 0.50 Seconds          |
| ~42 bit       | `XDe7YmV8`             | 205.54 Years          | 15.41 Minutes         |
| ~55 bit       | `Joji9,GowzLanr`       | 3 Million Years       | 5.28 Months           |
| ~71 bit       | `k9Awp1Jap6EJ`         | 10<sup>11</sup> Years | 16,374.89 Years       |
| ~119 bit      | `X0[CY06hn$Ch06ztHd6#` | 10<sup>25</sup> Years | 10<sup>18</sup> Years |

In conclusion, we find that:
1. `sha-256` is inadequate for password hashing and websites should not use it.
2. `~55 bit` makes a decent minimum bar for ordinary use password entropy.
3. Going much higher in entropy doesn't really net us any realistic benefit.

One final consideration is the fact that many websites impose counter-productive
password policies which force password generators to contort the types of
passwords they produce away from max entropy in an effort to remain generally
supported by an unpredictable range of website policies. Sacrificing some
entropy to ensure wide applicability and avoid user frustration is an acceptable
trade-off so long as the final entropy is still sufficiently high.

To some extent, parallelization can be used in an attempt to bring down
high time costs. While this isn't perfectly linear, one could imagine a cluster
of ~20,000 GPUs might be used to bring a 16,374.89 Years estimate down to the
single year range, but keep in mind that this would incur extreme expenses in
terms of hardware acquisition, infrastructure and operating costs. It's safe to
say that any numbers beyond those are out of range for brute-force attempts.

### Requirements

Any solution that incurs a cost higher than we're willing to pay in the very
moment we need it, is a non-solution. We notice that users are very picky about
their own convenience. For instance, as an employer you may require that
passwords be kept in a book which is kept securely in a vault, and must always
be returned immediately after use. In which case you may find that employees
begin copying passwords out of the book to keep them elsewhere, violating the
solution for the sake of feasibility.

We need to be realistic, therefore, and consider solutions only when their use
requirements are compatible with the usage scenarios. Considering the diversity
in the population as well as the unpredictability of what future situations we
may find ourselves in, we should take into account that we cannot necessarily
judge realistic requirements as an objective measure.

> We therefore aspire to keep requirements to an absolute minimum and grant
> ourselves maximal flexibility in terms of future contingencies.

We should be very wary of requirements that incur:
- A lot of effort on our part.
- Actively maintained contracts with other parties.
- Loss of control, such as proprietary solutions with no recourse.

### Dependencies

Going beyond requirements, it's also important to evaluate to what extent we're
outsourcing our security to other parties where trust is always going to be
limited.

Wherever we involve other parties, it's important to acknowledge honestly the
position of power in which we'd be placing them and moderate our trust level
accordingly.

Involving dependent parties is a slightly insidious process in our current
society where we've been conditioned to accept that in a contractual engagement,
parties who claim to be security vendors can certainly be trusted to act with
integrity and flawless operation.

Dependencies may be incurred in the sense that we become dependent on the
cooperation of another party in order to gain access to our own accounts.
They may also be incurred in the sense that we've put them in a position of
power where if their intentions became misaligned or operations became
compromised, they could easily gain access to our complete online identity.

> In times of stability, we tend to put faith in the system of law and order,
> contracts and policy. But the reality is that tides shift and if we want to
> future-proof our operations, it's imperative that we seek to minimize our
> dependencies on and trust in external entities.

### Vulnerabilities

We spoke of entropy and brute-force attacks and got a clear picture of what it
might take for an attacker to seek to guess our password through searching
the space of its entropy. In doing so, we understood that sufficiently
high-entropy passwords are quite robust against brute force attempts.

As an attacker, knowing that brute-force may be off the table, the next strategy
is to seek out what solution you're employing to manage your passwords.
It's therefore important that we become cognisant of the different pathways that
exist in our chosen solution for compromising our passwords.

> A 120 bit entropy password may be resilient to millions of years of
> brute-forcing, but if an attacker can download it off of your computer
> tomorrow, that hasn't helped much.

Vulnerabilities can come from all sorts of angles.  The best way to discover
them is to put yourself in the role of an attacker and seek out the best
strategy you can come up with for attacking your own assets.


## Solutions

With a clear picture of the security parameters and a framework for trust in
mind, let's begin our evaluation: what are the different ways in which we can
create and manage our passwords and what are the consequences they incur?

We'll test the following password creation strategies:

User Memorized
: We create a password we're likely to be able to recall.

User Stored
: We think of a new and maximally arbitrary password.

User Algorithm
: We use a personal algorithm for translating a website into an associated password.

Software Memorized
: Using software, we compose a random password or passphrase that is memorable.

Software Stored
: Using software, we create a maximally arbitrary password.

Software Algorithm
: Using software, we derive a name into an associated password.

Below, we'll explore each of these strategies in some detail to check them
against our security parameters. The following table summarizes those findings:

<p class="text-center">

|          | Limitations | Requirements | Dependencies | Vulnerabilities |
| -------- | -------- | -------- | -------- | -------- |
| User Memorized | [<i class="fas fa-fw fa-octagon-exclamation severe"></i>](#crm-lims) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-reqs) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-deps) | [<i class="fas fa-fw fa-octagon-exclamation severe"></i>](#crm-vuls) |
| User Stored | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-lims-1) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-reqs-1) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-deps-1) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-vuls-1) |
| User Algorithm | [<i class="fas fa-fw fa-octagon-exclamation severe"></i>](#crm-lims-2) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-reqs-2) | [<i class="fas fa-fw fa-shield-exclamation safe"></i>](#crm-deps-2) | [<i class="fas fa-fw fa-octagon-exclamation severe"></i>](#crm-vuls-2) |
| Software Memorized | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-lims-3) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-reqs-3) | [<i class="fas fa-fw fa-shield-exclamation safe"></i>](#crm-deps-3) | [<i class="fas fa-fw fa-shield-exclamation safe"></i>](#crm-vuls-3) |
| Software Stored | [<i class="fas fa-fw fa-shield-exclamation safe"></i>](#crm-lims-4) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-reqs-4) | [<i class="fas fa-fw fa-octagon-exclamation severe"></i>](#crm-deps-4) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-vuls-4) |
| Software Algorithm | [<i class="fas fa-fw fa-shield-exclamation safe"></i>](#crm-lims-5) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-reqs-5) | [<i class="fas fa-fw fa-shield-exclamation safe"></i>](#crm-deps-5) | [<i class="fas fa-fw fa-triangle-exclamation notice"></i>](#crm-vuls-5) |

</p>

From an overview of the different approaches to password security, we can draw
some conclusions:

1. User generated passwords tend to be critically weak in entropy.
2. User-based solutions come with unsustainable requirements.
3. User-based solutions suffer from critical vulnerability pathways.
4. Computing high-entropy memorable passwords works well, but only in limited quantities.
5. Storing high-entropy passwords is robust, but demands questionable dependencies.
6. Deriving high-entropy passwords algorithmically incurs minimal trade-offs if done right.

### User Memorized

> eg. `jake1982`, `sarahhhhhh6`, `qazwsxedcrfv`, `2dragons!`

In the absence of any tools and prior experience, this strategy is often what
first comes to us when confronted with a need to secure our online presence.

Confronted with a request for a password, we do our best to answer to what
appears to be the question asked of us: "please tell me a secret word that I
can recognize you by in the future". We think of what might be such a word,
cognisant of the fact that we will need to be able to recall it in the future.

#### Limitations

1. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Constrained by past experiences, often non-exclusive knowledge
2. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Human creativity biases away from uniformly random

#### Requirements

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Creative energy

#### Dependencies

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Reliable expansive memory

#### Vulnerabilities

1. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Low entropy facilitates searching the domain space
2. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Knowledge of personal information may further narrow the domain space
3. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Partial or complete password re-use is a fast track to compromise


### User Stored

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

#### Limitations

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Human creativity biases away from uniformly random

#### Requirements

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Creative energy

#### Dependencies

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   A method for persistence and recollection

#### Vulnerabilities

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Bias impacts the size of the domain space
2. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Our persistence method and its usage can lead to complete compromise


### User Algorithm

> eg. `tertwi3`, `f4c3b00k`, `bqqmd!`, `hpph;r/vp,`

Having gone from a solution where we created and remembered our own passwords
to one where it had now become impossible to log into our accounts without
the support of a tool, often one we don't have exclusive control over.

Instinctively some people chose a different path, intentionally seeking to find
a middle ground between being able to have hundreds of unique passwords and not
needing to surrender our ownership and control. The end result tends to be a
home crafted algorithm of some sort where we translate the name of the site into
a unique password for it.

#### Limitations

1. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Human crafted algorithms are deceptively low entropy

#### Requirements

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Mentally solving the algorithm

#### Dependencies

1. <i class="fas fa-fw fa-shield-exclamation safe"></i>
   We need to remember the algorithm

#### Vulnerabilities

1. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Biased output leads to critically low entropy
2. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   The algorithm is susceptible to reverse engineering


### Software Memorized

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

#### Limitations

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Incompatible with many website password policies

#### Requirements

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Remembering passphrases is quite manageable in limited quantities only

#### Dependencies

1. <i class="fas fa-fw fa-shield-exclamation safe"></i>
   Any application with a sufficiently diverse dictionary

#### Vulnerabilities

1. <i class="fas fa-fw fa-shield-exclamation safe"></i>
   Sufficiently high entropy to make searching the space infeasible


### Software Stored

> eg. `~,&s2'<T{u`, `UHj80koBGsh6`, `45406061`, `taml1-deluq4`

Industry standard solutions appear to have settled on generating tokens based on
a secure random device generating maximally unbiased output within a predefined
character class or template. The result is a high-entropy password that's very
robust against direct attacks.

The main downside being that these solutions are fully dependent on stateful
storage of the resulting passwords, though not to worry - these industry solutions
come with an answer to this as well: just marry the product and they will store
it for you in their proprietary vault or remote data-centres.

#### Limitations

1. <i class="fas fa-fw fa-shield-exclamation safe"></i>
   High entropy may be tweaked to maximally fit the website's password policies

#### Requirements

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Access to your password vault and a working app that can read it

#### Dependencies

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Proprietary data storage
2. <i class="fas fa-fw fa-octagon-exclamation severe"></i>
   Remote data storage

#### Vulnerabilities

1. <i class="fas fa-fw fa-shield-exclamation safe"></i>
   Sufficiently high entropy to make searching the space infeasible
2. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Data storage may be captured


### Software Algorithm

> eg. `PozoLalv0_Yelo`, `FB22U#U*LPFWlWxaxK2.`, `zowp quy roxzuyu qim`, `FLI88cDK`

A rare approach in the industry involves seeking to combine the benefits of
high-entropy software generated tokens with the control and ownership benefits
of incurring minimal dependencies while remaining maximally applicable.

A one-way algorithm can be used to derive a password from the website's name.
The output can be rendered user-specific by seeding the algorithm with a
user token such as their own name. The output can also be made secret by seeding
the algorithm with a user provided secret, something the user would then need to
either store or remember themselves.

#### Limitations

1. <i class="fas fa-fw fa-shield-exclamation safe"></i>
   Password policy compatible output templates can maintain high entropy

#### Requirements

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Access to the algorithm

#### Dependencies

1. <i class="fas fa-fw fa-shield-exclamation safe"></i>
   Software capable of evaluating the algorithm

#### Vulnerabilities

1. <i class="fas fa-fw fa-triangle-exclamation notice"></i>
   Algorithms might be reversed if not well designed


## Products

With a good understanding of the general categories of password solutions out
there, let's take a closer look at some products that are available on the
market to help us address this problem and how we might evaluate their proposals.

We'll test these products against the same metrics to find the concrete results
of how their implementation resolves against the security parameters you may
want to consider.  
Hover over each finding for details.

<p class="text-center">

|                  | Entropy | Requirements | Dependents | Vulnerabilities |
| ---------------- | ------- | ------------ | ---------- | --------------- |
| Apple Keychain   | <i title="~89&nbsp;bit" class="fas fa-fw fa-shield-exclamation safe" title="testbar"></i> | <i title="Comes with OS, Proprietary" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Database&nbsp;File&nbsp;(Proprietary), iCloud&nbsp;Connectivity" class="fas fa-fw fa-octagon-exclamation severe"></i> | <i title="User&nbsp;Error, Data&nbsp;Ransoming, Data&nbsp;Theft, Backdooring" class="fas fa-fw fa-octagon-exclamation severe"></i> |
| Mozilla Lockwise | <i title="~80&nbsp;bit&nbsp;default" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Free Software (MPLv2)" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Database&nbsp;File&nbsp;(Open), Firefox&nbsp;Sync" class="fas fa-fw fa-triangle-exclamation notice"></i> | <i title="User&nbsp;Error, Data&nbsp;Ransoming, Data&nbsp;Theft" class="fas fa-fw fa-octagon-exclamation severe"></i> |
| KeePass          | <i title="~100&nbsp;bit&nbsp;default" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Free Software (GPLv2)" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Database&nbsp;File&nbsp;(Open)" class="fas fa-fw fa-triangle-exclamation notice"></i> | <i title="User&nbsp;Error, Data&nbsp;Ransoming, Data&nbsp;Theft" class="fas fa-fw fa-octagon-exclamation severe"></i> |
| LastPass         | <i title="~71&nbsp;bit&nbsp;default" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Active&nbsp;Subscription, Proprietary" class="fas fa-fw fa-triangle-exclamation notice"></i> | <i title="Database&nbsp;File&nbsp;(Proprietary), LastPass&nbsp;Connectivity" class="fas fa-fw fa-octagon-exclamation severe"></i> | <i title="User&nbsp;Error, Data&nbsp;Ransoming, Data&nbsp;Theft, Backdooring" class="fas fa-fw fa-octagon-exclamation severe"></i> |
| 1Password        | <i title="~146&nbsp;bit&nbsp;default" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Active&nbsp;Subscription, Proprietary" class="fas fa-fw fa-triangle-exclamation notice"></i> | <i title="Database&nbsp;File&nbsp;(Proprietary), 1Password&nbsp;Connectivity" class="fas fa-fw fa-octagon-exclamation severe"></i> | <i title="User&nbsp;Error, Data&nbsp;Ransoming, Data&nbsp;Theft, Backdooring" class="fas fa-fw fa-octagon-exclamation severe"></i> |
| LessPass         | <i title="~229&nbsp;bit&nbsp;max, ~104&nbsp;bit&nbsp;default" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Free Software (GPLv3)" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Algorithm&nbsp;(Open)" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="User&nbsp;Error, Reversal" class="fas fa-fw fa-octagon-exclamation severe"></i> |
| Spectre          | <i title="~119&nbsp;bit&nbsp;max, ~55&nbsp;bit&nbsp;default" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Free Software (GPLv3), Optional&nbsp;Subscription" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="Algorithm&nbsp;(Open)" class="fas fa-fw fa-shield-exclamation safe"></i> | <i title="User&nbsp;Error" class="fas fa-fw fa-shield-exclamation safe"></i> |

</p>

You may not find it wholly surprising that an article on spectre.app finds the
Spectre solution to be least problematic - that said, we hope we've given you
sufficient context to draw consider the relevant problems for yourself and draw
your own conclusions.

Feel free to drop by [our community with your questions and your thoughts](https://chat.spectre.app).
We'd love to have your voice added to the conversation and together work toward
a future where we're empowered as individuals to control our own digital privacy
and security.