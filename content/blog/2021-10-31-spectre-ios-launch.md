---
title: From Master Password to Spectre
date: 2021-10-31T11:10:00-04:00
author: Maarten Billemont
image: "/images/masterpassword-ios.jpg"
description: >
  Transitioning from Master Password and into the future.
---


## What is Master Password?

In 2010, I began work on an algorithm for addressing my own personal password needs.

Frustrated with the constant demand for passwords from every new website and
unsatisfied with the existing proposals for how to address this need in by the
market, I had the benefit of being a software engineer and a background in
security applications development.

The first few iterations of my personal solutions were simple, but it quickly
became apparent that a complete and reliable solution that could adequately
address the many security pitfalls was going to require deeper commitment.
Having always been of the type to go back to the basic principles underlying
the problem to address the issue from the root cause, this path eventually led
me to develop the Master Password algorithm.

For the technical; my journey in a nutshell boiled down to:
1. Generate random tokens by hashing `/dev/random` (eg. `dd if=/dev/random bs=1024 count=1 | openssl md5`), then save the token somewhere.
2. Fry my disks by being clumsy, losing all saved passwords.
3. Remove the reliance on storage by hashing the site name (eg. `openssl md5 <<< "$host"`)
4. Seed the hash to escape rainbow tables (eg. `openssl md5 <<< "$host-$secret"`)
5. Site password policies support using password templates (eg. `openssl sha256 <<< "$host-$secret" | passwordCipher`)
6. Introduce a KDF to counter brute-forcing the secret.
7. Multi-layered protection by switching from simple hashing to message authentication.
8. Testing, testing, consulting, coding, testing, seeking feedback, coding, testing.

Master Password first appeared in 2011 on iPhone, and has since garnered a large
audience of users excited about no longer being dependent on the cloud, secure vaults,
backups and personal storage systems for their secure online access controls.

Since then, I've brought Master Password solutions to all sorts of platforms.
We now have applications for:
1. iPhone and iPad
2. macOS
3. Linux / BSD / *NIX
4. Java desktop (including Windows)
5. Android
6. Web (offline / self-hosted)

## Spectre

The next evolution of Master Password is now called Spectre.

Spectre is a new platform based on the algorithm that underpins Master Password.
It is a fully rewritten and modernized software suite that will replace the old
and enable all future capabilities. Spectre aims to grow beyond just passwords
and offer a fully decentralized self-owned solution for privacy-first online
identity management.

Maintenance and development will now shift to Spectre and Master Password will
no longer be actively maintained. We recommend that everyone shift their user
profiles from their Master Password apps to the Spectre app. Both Master Password
and Spectre have been coded specifically to make this migration as easy as
possible for you:
- Install the Spectre app,
- Log in to your Master Password user,
- Master Password should detect the Spectre app and prompt you to migrate your user,
- Tap the message and enter your master password to export your user from Master Password into Spectre,
- Spectre should now open and your user should be imported and ready for use,
- Just sign in to your new Spectre user and find all of your old Master Password sites with all of their details intact.

## What's new?

Spectre comes with more modern platform support, rewritten in a modern new
development language for improved security and reliability, and integrates more
tightly with the operating system (such as by offering password AutoFill).

Spectre, like Master Password, is open-source, authored entirely by myself,
available for free, forever. It will also be financially supported by a new model
for those who are interested in the improved systems integration and
convenience features, which will allow me to focus my efforts into keeping
this project alive and growing.

A quick list of additional capabilities in Spectre (at launch):

- Redesigned modern interface
- Personalizable user interface
- Incognito users
- Privacy improvements such as enhanced identifier decoupling and "Offline Mode"
- Login identicon for typo detection
- Explicit Universal Clipboard & Handoff support
- Explicit support for FaceID
- Password Auto-Fill from other applications and browsers
- Third-party application storage & file sharing
- Opening sites from within the app