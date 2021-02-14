---
title: Privacy Policy
date: 2021-02-03T19:12:20-05:00
author: Maarten Billemont
description: >
  Detailed information on how the Spectre applications handle personal
  information.
---

Spectre was designed specifically to minimize collection and persistence of
sensitive personal information.

To achieve this, we have adopted a *zero-PII* (personally identifiable information)
policy.  
This document describes the implementation details of that policy.

---

Spectre apps will never:

* Send out your name, passwords or contact information.
* Send out any information which could identify you.

It is for these reasons that:

* You do not hold an account with us.
* We can not recover your lost credentials.
* We do not directly process payments or refunds.
* We do not sync passwords between your devices.
* We may require your collaboration when you report a bug.
* We are unable to provide details to authorities on your use of Spectre.

> Spectre has not complied with any authority request for personal information since Nov, 2011 (inception).

## Collection

With the important bit out of the way, the Spectre app does collect or transmit
some information.

The following details how that collection takes place to ensure that our *zero-PII* policy is honoured.

### Device Logs

Transparency and self-empowerment are important values at Spectre. For this reason, the app collects logs on its own operation in the background for you to review.

These logs are intended to help you
keep track of what is happening, to enable you to investigate
unexpected behaviour and to ensure you are the gatekeeper when you recruit our
assistance to diagnose a problem with the app.

Logs can be viewed by you at any time. Logs are not saved to disk and disappear
as soon as the app is quit.

Logs are not sent to us and we can only access them
by asking you to relay them to us.

### Identifiers

Spectre is determined to limit its own ability to correlate information with
specific individual users.

Note that these identifiers are not shared unless you do so manually or enable
Spectre's built-in diagnostics features as detailed below.

#### User Identifier

Spectre uses an authenticated identifier passed through a one-way cryptographic
encoding algorithm to ensure that:

1. It is impossible to derive user information from the identifier.
2. It is impossible to derive the identifier for an individual without their
   authorization.

#### Device Identifier

Spectre exclusively uses random identifiers to ensure that:

1. It is impossible to derive user or device information from the identifier.
2. It is impossible to derive the identifier for an individual or device.

### Crash Monitoring

It is important to us that your experience using the app is as flawless as
possible. To that end, Spectre has hooks in place designed to take action should
the app crash for any reason.

Crash monitoring is disabled by default but enabled if the user agrees to engage
the app's built-in diagnostics feature.

When the app crashes, the software will make a best-effort attempt to write to
disk some information that will assist in determining the cause of the crash.
This information is commonly referred to as a "crash report".

When the app is started next, Spectre will find this crash report on disk and
attempt to send it to our crash monitoring service. Once there, our developers
will be notified and investigate the cause of the crash. With this information,
they should be able to apply changes to Spectre's code to prevent the crash from
occurring in the future. These changes would roll out to your app via an app
update.

#### Metrics

As part of recording a crash event, Spectre discloses the following metric categories:

* Information describing the device model (eg. device name, model, memory)
* Information describing the operating system version (eg. system name, version, kernel)
* Information describing the application version (eg. application build, version, distribution)
* Information describing the state of the device (eg. time zone, available memory, disk space)
* Information describing the cause of the crash (eg. binaries, libraries, call stack)
* Spectre user and device identifiers as described above
* Operational and critical Spectre device logs void of any personal information

As a result of our zero-PII policy, this information cannot uniquely trace back
to you.

> For example, "there is an iPad out there, running iOS 14.0, which crashed when FaceID recognition failed".

### Analytics

To ensure we are adequately serving the needs of our many users, avoid creating
confusing user experiences and build our features such that they are helpful to
people of all abilities, we use analytics to build statistical models of how our
aggregate user-base interacts with the user interface.

Analytics are disabled by default but enabled if the user agrees to engage the
app's built-in diagnostics feature.

As users navigate through the app, an aggregate statistical model is built to
determine how large populations interact differently with the app. Using this
information, our product managers are able to validate their assumptions or make
corrections to resolve bottlenecks and make your usage of the app simpler and
smoother.

#### Metrics

As part of building a statistical model, Spectre discloses the following
details:

* Information describing the device model (eg. device name, model, memory)
* Information describing the operating system version (eg. system name, version, kernel)
* Information describing the application version (eg. application build, version, distribution)
* Information describing the state of the device (eg. time zone, available memory, disk space)
* Information describing application interaction (eg. controls used, timings, problems)
* Spectre user and device identifiers as described above

As a result of our zero-PII policy, this information cannot uniquely trace back
to you.

> For example, "7% of our users are having issues logging in with FaceID, 35% of them are using an iPad".

### Communication

To keep our users appraised of significant developments in digital security and
raise awareness of relevant important events, Spectre users can opt-in to
receiving one-way notifications in their app. If security information needs to
be communicated, such as a critical bug in the app or a widely used website has
been compromised, Spectre may use notifications to appraise and advise its
user-base.

Notifications are disabled by default but can be enabled from within the app by
the user.

#### Metrics

To facilitate participation in Spectre's notifications, Spectre discloses the
following details:

* Information describing the device model (eg. device name, model, memory)
* Information describing the operating system version (eg. system name, version, kernel)
* Information describing the application version (eg. application build, version, distribution)
* Information describing the state of the device (eg. time zone, available memory, disk space)
* Spectre device identifiers as described above

As a result of our zero-PII policy, this information cannot uniquely trace back
to you.

> For example, "a critical bug caused FaceID to fail for iPad users, notify them a hot-fix is now live".

### Payment

Spectre is determined to hold no account, payment or transaction information on
you. To that end, any payments for services or subscriptions are handled
exclusively by trusted partners.

These partners share their income from your payments with us but do not disclose
any information on the origin of this income, barring statistics in aggregate.

Spectre does not share any user or device information with payment providers.

* On iOS and macOS devices, the payment provider is Apple's iTunes Store.

> For example, "the user logged in on this device has an active Spectre Premium subscription".
