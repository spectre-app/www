---
title: An algorithm for freedom
date: 2018-01-06T15:44:20-05:00
author: Maarten Billemont
image: /images/blog/2018-01-06-cover.png
description: >
  Exploring the Spectre algorithm, we find that at the core stands the principle of statelessness.
chat: 40
---

## Statelessness

At the core of the Spectre solution is the principle of statelessness. State is the technical term for "what
needs to be saved". In most tasks, state is used to ensure you don't need to redo your work. You write a document and
save it to disk so you needn't rewrite it every time you need it. But not all state is reproducible. When you save your
sites' passwords on your computer, be it in a program or elsewhere, you depend on that information whenever you need to
log in. If this state becomes inaccessible for any reason; you don't have your computer handy, it breaks down, you lose
it; the state is gone and there is no way to accomplish our task. We are dependent on this state. State also introduces
vulnerability: private state must be protected from any and all attack vectors. In order to free ourselves from these
risks and dependencies, we need to free ourselves from state. Stateless operation implies that the computer or program
can give you what you need based on nothing more than inputs you can give it.

## The Spectre solution

Spectre solves the password problem in a stateless manner while continuing to guarantee and to some extent even
enforce good security for your sites. Spectre implements its solution in three distinct phases:

1. Your User Key
2. Your Site Key
3. Your Site Password

### Phase 1: Your identity

Your identity is defined by your user key. This key unlocks all of your doors. Your user key is the cryptographic
result of two components:

1. Your full name: `user-name` (identification)
2. Your Spectre secret: `user-secret` (authentication)

Your secret is a personal mnemonic and your name scopes that secret to your identity. Together, they create a
cryptographic identifier that is unique to your person.

```
user-key  = SCRYPT1( key, seed, N, r, p, dkLen )
  key     = user-secret
  seed    = scope . LEN( user-name ) . user-name
  N       = 32768
  r       = 8
  p       = 2
  dkLen   = 64
```

We employ the SCRYPT cryptographic function to derive a 64-byte cryptographic key from the user's name and secret
using a fixed set of parameters.

### Phase 2: Your site key

Your site key is a derivative from your user key when it is used to unlock the door to a specific site. Your site key
is the result of two components:

1. Your user key: `user-key` (authentication)
2. The site's domain: `site-name` (identification)
3. The site's password counter: `site-counter`

Your user key ensures only your identity has access to this site key and the domain name scopes the key to the site. The
site counter ensures you can easily create new keys for the site should a key become compromised. Together, they create
a cryptographic identifier that is unique to your account at this site.

```
site-key = HMAC-SHA-25612( key, seed )
  key    = user-key
  seed   = scope . LEN( site-name ) . site-name . site-counter
```

We employ the HMAC-SHA-256 cryptographic function to derive a 32-byte cryptographic site key from the site name
and user key scoped to a given counter value.

### Phase 3: Your site password

Your site password is an identifier derived from your site key in compliance with the site’s password policy. The
purpose of this step is to render the site’s cryptographic key into a format that the site’s password input will accept.
Spectre declares several site password formats and uses these pre-defined password “templates” to render the
site key legible.

```
template = templates1[ <site key>[0] % LEN( templates ) ]

for i in 0..LEN( template )
  passChars   = templateChars2[ template[i] ]
  passWord[i] = passChars[ <site key>[i+1] % LEN( passChars ) ]
```

We resolve a template to use for the password from the site key’s first byte. As we iterate the template, we use it to
translate site key bytes into password characters. The result is a site password in the form defined by the site
template scoped to our site key. This password is then used to authenticate the user for his account at this site.

### Key Scopes

The Spectre algorithm defines several key scopes. These scopes are used to scope the key generation to a
specific purpose.

Three purposes are defined:

1. Authentication

   The authentication scope is used when generating a key that is used for authenticating the user, such as a passphrase
   or password.

2. Identification

   The identification scope is used when generating a key that is intended for the purpose of identifying the user, such
   as a user or login name.

3. Recovery

   The recovery scope is used for generating fall-back identifiers for use in access recovery when the primary
   authentication mechanism has failed, such as backup codes or security question answers.

| Purpose Scope  | Identifier                         |
| -------------- | ---------------------------------- |
| Authentication | `com.lyndir.masterpassword`        |
| Identification | `com.lyndir.masterpassword.login`  |
| Recovery       | `com.lyndir.masterpassword.answer` |

### Output Templates

In an effort to enforce increased password entropy, a common consensus has developed among account administrators that
passwords should adhere to certain arbitrary password policies. These policies enforce certain rules which must be
honoured for an account password to be deemed acceptable. As a result of these enforcement practices, Spectre’s
site key output must necessarily adhere to these types of policies. Since password policies are governed by site
administrators and not standardized, Spectre defines several password templates to make a best-effort attempt at
generating site passwords that conform to these policies while also keeping its output entropy as high as possible under
the constraints.

| Template Class   | Template Set           |                        |
| ---------------- | ---------------------- | ---------------------- |
| Maximum Security | `anoxxxxxxxxxxxxxxxxx` | `axxxxxxxxxxxxxxxxxno` |
| Long             | `CvcvnoCvcvCvcv`       | `CvcvCvcvCvccno`       |
|                  | `CvcvCvcvnoCvcv`       | `CvccnoCvccCvcv`       |
|                  | `CvcvCvcvCvcvno`       | `CvccCvccnoCvcv`       |
|                  | `CvccnoCvcvCvcv`       | `CvccCvccCvcvno`       |
|                  | `CvccCvcvnoCvcv`       | `CvcvnoCvccCvcc`       |
|                  | `CvccCvcvCvcvno`       | `CvcvCvccnoCvcc`       |
|                  | `CvcvnoCvccCvcv`       | `CvcvCvccCvccno`       |
|                  | `CvcvCvccnoCvcv`       | `CvccnoCvcvCvcc`       |
|                  | `CvcvCvccCvcvno`       | `CvccCvcvnoCvcc`       |
|                  | `CvcvnoCvcvCvcc`       | `CvccCvcvCvccno`       |
|                  | `CvcvCvcvnoCvcc`       |                        |
| Medium           | `CvcnoCvc`             | `CvcCvcno`             |
| Short            | `Cvcn`                 |                        |
| Basic            | `aaanaaan`             | `aannaaan`             |
|                  | `aaannaaa`             |                        |
| PIN              | `nnnn`                 |                        |
| Name             | `cvccvcvcv`            |                        |
| Phrase           | `cvcc cvc cvccvcv cvc` | `cvc cvccvcvcv cvcv`   |
|                  | `cv cvccv cvc cvcvccv` |                        |

A Spectre template is a string of characters, where each character identifies a certain character class. As
such, the template specifies that the output password should be formed by substituting each of the template’s character
class characters by a chosen character from that character class.

| Character Class | Character Set                                                              |
| --------------- | -------------------------------------------------------------------------- |
| V (vowels)      | `AEIOU`                                                                    |
| C (consonants)  | `BCDFGHJKLMNPQRSTVWXYZ`                                                    |
| v (vowels)      | `aeiou`                                                                    |
| c (consonants)  | `bcdfghjklmnpqrstvwxyz`                                                    |
| A (alphabetic)  | `AEIOUBCDFGHJKLMNPQRSTVWXYZ`                                               |
| a (alphabetic)  | `AEIOUaeiouBCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz`                     |
| n (numeric)     | `0123456789`                                                               |
| o (other)       | `@&%?,=[]_:-+*$#!'^~;()/.`                                                 |
| x (union set)   | `AEIOUaeiouBCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz0123456789!@#$%^&*()` |
