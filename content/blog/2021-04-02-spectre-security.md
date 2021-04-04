---
draft: true
title: Security of the Spectre Algorithm
date: 2021-04-10T18:45:00-05:00
author: Maarten Billemont
image: images/blog/2021-02-04-cover.jpg
description: >
  Evaluating the Spectre algorithm from a security perspective to determine its trust boundaries.
chat: 43
---

## What is trust?

When seriously evaluating a security solution, we need to be clear about our end
goals. By formalizing the concept of password security concretely, we gain the
ability to test solutions and evaluate their real benefit in concrete fact.

All trust in external entities is by necessity limited. There are no guarantees.
What it means "to trust a solution" therefore requires an objective awareness
of what the solution's security parameters are and whether those parameters are
compatible with our security needs.

What this article sets out to accomplish is to describe Spectre's security
parameters and posit that given the results, Spectre as a solution answers far
more broadly to overall security needs without demanding the kind of sacrifices
and adoption of ancillary risk that so often accompanies traditional approaches
to digital identity and password security.

# Part 1
## The Algorithm

What immediately sets Spectre's approach to passwords apart from the industry is
its stateless and deterministic strategy to deriving passwords.

We'll explore this design decision and its implications before we dive into the
actual technical implementation details and their impact.

### State vs. stateless

Most of us are familiar with at least several market solutions, if not several
home-cooked solutions, for managing the conundrum of password security through
administrative means. That may mean keeping track of a growing list of passwords
in a ledger, notebook, digital database, encrypted vault, system-supplied key chain
or modern cloud-supported platform.

These solutions are so common-place that the thought of there being a different
way to address the problem of passwords can come as a bit of a moment to some.

That said, statelessly addressing the password problem is something many of us
have likely already tried without having really taken notice. It's not uncommon
for people to come up with internal mechanisms for deriving a unique password
for the websites they need to create accounts with. We may concoct such algorithms
as taking the website's name and appending our birth year, spelling it out on the
keyboard by pressing every key to the right of each letter in the website's name,
or even performing a more complicated cipher such as rotating word.

While the flaws in these approaches are quickly apparent on inspection, it's
still worth asking ourselves what drives us to consider such a "scheme", as an
alternative to the traditional list-based approach. While we'll find there are
in fact many valid reasons one may prefer such an "algorithmic" approach,
trivially we'll discover that these answers have a tendency to converge on
a simple, "because there is no list", suggesting that perhaps the real problem
isn't so much the password, as much as these "list" solutions that we've all
traditionally adopted.

#### Creating Passwords

Whether we store our passwords or don't, comes as a natural consequence of the
way in which we create them. We rarely give this relationship much thought and
therefore arrive automatically at a need for password storage that we hold as
self-evident.

As such, let's begin our evaluation at the point of inception: how can we create
passwords and what are the ways in which we can evaluate the passwords we have
created?

In this article, we'll explore the following metrics:

CRM-LIMS
: What limitations are we placing on the password's entropy?

CRM-REQS
: What do we need in order to create passwords this way?

CRM-DEPS
: What dependencies do we incur for continued use of this password?

CRM-VULS
: What paths exist for an unauthorized party to obtain this password?

We'll test the following password creation strategies against our metrics:

CRS-MREC
: Using our memory, we create a password we're likely to be able to recollect.

CRS-MRND
: We think of a new and maximally arbitrary password.

CRS-MALG
: We use a personal algorithm for translating a name into an associated password.

CRS-SREC
: Using software, we compose a random password or passphrase that is memorable.

CRS-SRND
: Using software, we create a maximally arbitrary password.

CRS-SALG
: Using software, we derive a name into an associated password.

