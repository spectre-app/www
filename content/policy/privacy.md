---
title: Privacy Policy
date: 2021-02-03T19:12:20-05:00
author: Maarten Billemont
description: >
  Detailed information on how the Spectre applications handle personal
  information.
---

Spectre was intentionally designed make access to sensitive personal information impossible.

To achieve this, we have adopted a *zero-PII* (personally identifiable information)
policy.

---

What motivates our dedication to your privacy?

- Keeping zero user records reduces our internal and legal risk profile.
- Trust is earned: we aim to prove our worth through transparency.
- We believe statelessness fundamentally underpins privacy.

Consequently, Spectre apps will never:

* Transmit your name, passwords, personal or contact information.
* Transmit any information which could be used to identify you.

It is for these reasons that:

* You do not actually hold an account with us.
* We can not recover your lost credentials.
* We do not process payments or refunds.
* We can not sync passwords between your devices.
* We may require your collaboration when you report an issue.
* We are unable to provide details to authorities on your use of Spectre.

> Spectre has not been compelled to turn over personal information since Nov, 2011 (inception).

## Collection

With the important bit out of the way, the Spectre app does collect or transmit
some information.

The following details how that collection takes place in order to ensure that our *zero-PII* policy is honoured.

### <i class="fa-duotone fa-file-exclamation fa-fw"></i> Device Logs

*These logs are available only to you, or via Diagnostics if enabled (critical operation logs only).*

Transparency and self-empowerment are important values at Spectre. For this reason, the app collects logs on its own operation in the background for you to review.

These logs are intended to help you
keep track of what is happening, to enable you to investigate
unexpected behaviour and to ensure you are the gatekeeper when you recruit our
assistance to diagnose a problem with the app.

Logs can be viewed by you at any time. Logs are not saved to disk and disappear
as soon as the app is quit.

### <i class="fa-duotone fa-id-badge fa-fw"></i> Identifiers

*These identifiers are available only to you, or via Diagnostics if enabled.*

Spectre is determined to limit its own ability to correlate information with
specific individual users. We do this by cryptographically severing the link between you and your identifiers.

#### User Identifier

Spectre uses an authenticated identifier passed through a one-way cryptographic
encoding algorithm to ensure that:

1. It is impossible to derive user information from the identifier.
2. It is impossible to derive the identifier for an individual without their
   authorization.

#### Device Identifiers

Spectre exclusively uses random identifiers to ensure that:

1. It is impossible to derive user or device information from the identifier.
2. It is impossible to derive the identifier for an individual or device.

### <i class="fa-duotone fa-car-crash fa-fw"></i> Crash Monitoring

*Crash monitoring is disabled by default. It is enabled only if the user turns on Diagnostics.*

It is important to us that your experience using the app is as flawless as
possible. To that end, Spectre was designed with the ability to take action should
the app crash for any reason.

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

* Information describing the device model (eg. device name, model, screen, memory)
* Information describing the operating system version (eg. system name, version, kernel)
* Information describing the application version (eg. application build, version, distribution)
* Information describing the state of the device (eg. time zone, orientation, carrier, locale)
* Information describing the cause of the crash (eg. binaries, libraries, call stack)
* Spectre's critical operation logs, void of any personal information
* Spectre user and device identifiers as described above

As a result of our zero-PII policy, this information cannot uniquely trace back
to you.

### <i class="fa-duotone fa-chart-mixed fa-fw"></i> Analytics

*Analytics are disabled by default. They are enabled only if the user turns on Diagnostics.*

To ensure we are adequately serving the needs of our many users, avoid creating
confusing user experiences and build our features such that they are maximally helpful to
people of all abilities, we use analytics to build statistical user interaction models.

#### Metrics

Spectre's statistical user interaction models consist of the following device information:

* Information describing the device model (eg. device name, model, screen, memory)
* Information describing the operating system version (eg. system name, version, kernel)
* Information describing the application version (eg. application build, version, distribution)
* Information describing the state of the device (eg. time zone, orientation, carrier, locale)
* Information describing application interaction (eg. controls used, timing, problems)
* Spectre user and device identifiers as described above

As a result of our zero-PII policy, this information cannot uniquely trace back
to you.

### <i class="fa-duotone fa-message-lines fa-fw"></i> Communication

*Notifications are disabled until the user agrees to turn them on in the app.*

To keep our users appraised of significant developments in digital security and
raise awareness of relevant important events, Spectre users can opt-in to
receiving one-way notifications in their app. If security information needs to
be communicated, such as a critical bug in the app or a widely used website has
been compromised, Spectre may use notifications to appraise and advise its
user-base.

#### Metrics

To facilitate participation in Spectre's notifications, Spectre discloses the
following details:

* Information describing the device model (eg. device name, model, screen, memory)
* Information describing the operating system version (eg. system name, version, kernel)
* Information describing the application version (eg. application build, version, distribution)
* Information describing the state of the device (eg. time zone, orientation, carrier, locale)

As a result of our zero-PII policy, this information cannot uniquely trace back
to you.

### <i class="fa-duotone fa-envelope-open-text fa-fw"></i> Updates

*Update e-mails are only sent to members who have registered for an update stream.*

Some of our users are interested in keeping up-to-date on Spectre's development,
the roadmap, and opportunities for testing out new capabilities and early releases.

#### Personal Information

To facilitate participation in Spectre's update e-mails, the following details
are submitted to and retained by Spectre:

* E-mail address
* Given and family name (optional)
* Device information (optional)
* User-submitted notes (optional)

This information is expunged when users unsubscribe from future updates.

### <i class="fa-duotone fa-circle-dollar fa-fw"></i> Payment

*Spectre does not share any user or device information with payment providers.*

Spectre is determined to hold no account, payment or transaction information on
you. To that end, any payments for services or subscriptions are handled
exclusively by trusted partners.

These partners share their income from your payments with us but do not disclose
any information on the origin of this income, barring statistics in aggregate.

We work with the following payment processors:

* iOS and macOS devices: Apple's iTunes Store
