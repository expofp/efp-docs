---
title: Heroku Environment Variable Exposure — Technical Reference
description: A source-based catalogue of attack paths to Heroku application configuration and equivalent secret copies, with documented incidents and evidentiary limitations.
sidebar: false
aside: false
editLink: false
lastUpdated: false
prev: false
next: false
---

# Heroku Environment Variable Exposure

**TECHNICAL REFERENCE MEMORANDUM**  
**Prepared by:** ExpoFP · **Date prepared:** September 9, 2026 · **Version:** 1.0

## I. Purpose and scope

This memorandum consolidates the attack paths identified in the research materials listed in Section III, grouping overlapping techniques into sixteen classes. It is prepared as technical background for commercial and legal review in the United States. It does not determine causation, responsibility, or legal compliance in any particular matter.

**Configuration variables (“Config Vars”)** are Heroku-managed application settings supplied to application processes as environment variables. An attacker may obtain their values by accessing the management interface, executing or exploiting code with access to them, or acquiring a copy previously placed in another system. Classic buildpacks receive Config Vars during builds; Cloud Native Buildpacks receive them at runtime by default, with build access requiring additional configuration. Applicability therefore depends on the application, permissions, build system, and secrets actually supplied. [Heroku, Configuration and Config Vars][config]

**Evidence convention.** “Incident” identifies reported malicious activity; “demonstration” identifies a published technical reproduction; “documented mechanism” identifies supported behavior from which the described attack path is inferred. An incident outside Heroku is an analogy, not evidence of a Heroku breach. References to the same incident under different classes describe different stages of one event, not independent incidents. This catalogue is comprehensive as to the supplied research topics; it is not a claim that every possible attack has been enumerated.

## II. Catalogue of attack vectors

### 2.01. Compromise of Heroku's platform or internal service credentials

An attacker who obtains sufficiently privileged internal service access may reach databases holding customer configuration. **Heroku incident:** its June 14, 2022 report confirms that an attacker downloaded a database containing pipeline-level Config Vars for Review Apps and Heroku CI. The initial access involved a machine-account token obtained from an archived private repository through an unidentified third-party integration. This establishes a pipeline-secret exposure precedent; it does not establish theft of ordinary production app-level Config Vars. [Heroku, April 2022 Incident Review][heroku-2022]

### 2.02. Compromise or misuse of an authorized account, session, or API token

Stolen developer credentials, browser/SSO sessions, CLI tokens, or excessively privileged integration grants can give an attacker the victim's configuration-reading or command-execution authority. Heroku documents Config Vars retrieval, protected OAuth scopes, and app permissions for configuration and one-off commands. Ordinary OAuth `read`/`write` scopes exclude Config Vars; `read-protected`, `write-protected`, and `global` include them, subject to the account's app access. CLI tokens use a supported system keychain with a `.netrc` fallback. **Analogous incident:** CircleCI traced its 2023 disclosure to malware stealing an engineer's authenticated SSO session; this is not a reported Heroku CLI theft. [API][api], [OAuth][oauth], [permissions][permissions], [CLI][cli], [one-off dynos][one-off], [CircleCI incident report][circleci]

### 2.03. Repository access through compromised source-hosting integrations

Stolen repository credentials or integration tokens may reveal secret copies in source, history, or deployment configuration and enable further access. A GitHub OAuth token held by a Heroku integration authorizes GitHub access; it is not interchangeable with a Heroku Platform API token. **Heroku-related incident:** GitHub confirmed that stolen tokens associated with Heroku and Travis CI integrations were used to download private repositories in April 2022. GitHub separately attributed unauthorized npm infrastructure access to an AWS key it believed came from downloaded repositories. [GitHub, April 2022 security alert][github-2022]

### 2.04. Tampered application code, deployment commands, or startup hooks

An attacker able to alter code that actually passes deployment controls can cause that code to read runtime secrets. Entry points include an auto-deployed branch, deployment scripts, `Procfile` commands, and release/migration code. Cedar `.profile` and classic-buildpack `.profile.d` scripts run with Config Vars already present. **Documented mechanism:** Heroku describes automatic deployments and these lifecycle hooks; the inference requires malicious changes to be executed. Repository read access alone does not establish this path, and Cedar startup behavior must not be assumed for Fir. [GitHub integration][deploy], [dyno startup][startup], [Buildpack API][buildpack], [release phase][release]

### 2.05. Untrusted pull-request code in Review Apps

If attacker-controlled pull-request code is built or run as a Review App, it can access the secrets supplied to that app, including through setup hooks. **Documented mechanism:** Heroku injects all Review App Config Vars configured in pipeline settings when the app is created. The relevant boundary is permission to cause untrusted code to run with those values. Production secrets are affected only if supplied or reused there; the 2022 database theft in §2.01 does not prove exploitation through a malicious pull request. [Heroku, Review Apps][review-apps]

### 2.06. Compromised CI provider, runner, workflow, or test code

An attacker controlling a CI service or code executed by a job may obtain job secrets directly or steal a deployment token that enables §2.02. Heroku CI makes its configured pipeline secrets available to test runs; it does not automatically inherit the parent application's Config Vars. **Analogous incidents:** CircleCI reported theft of customer environment variables, tokens, and keys in December 2022; Codecov reported that its altered Bash Uploader extracted environment variables in 2021. Neither report establishes exposure of any particular Heroku customer's secrets. [Heroku CI][heroku-ci], [CircleCI][circleci], [Codecov post-mortem][codecov]

### 2.07. Malicious dependencies and package installation hooks

Compromised maintainers, malicious updates, typosquatting, and dependency confusion can introduce code that reads secrets available during installation or runtime. **Documented malicious packages:** the 2022 `ctx` compromise collected process environment values during object creation; its Heroku-hosted collection endpoint does not establish that victims ran on Heroku. Microsoft documented npm credential-harvesting packages on May 28, 2026 and a separate dependency-confusion campaign on May 29. The latter's observed reconnaissance mode and CI-skipping behavior do not support a claim of universal CI secret theft. [GitHub `ctx` advisory][ctx], [Microsoft, May 28][npm-typosquat], [Microsoft, May 29][npm-confusion]

### 2.08. Compromised buildpacks and other trusted build tools

Custom, third-party, or inline buildpacks and compromised build tools may read secrets supplied to a build or insert code that reads them later. Classic buildpacks receive configuration files through `ENV_DIR` and can create startup scripts. Inline buildpacks are supported in `project.toml`; build-time Config Vars for Cloud Native Buildpacks require configuration. **Documented mechanism and analogous incident:** Heroku expressly warns about exposing secrets to untrusted build tools; Codecov's compromised uploader demonstrates environment theft by a trusted build component, not a confirmed malicious Heroku buildpack. [Buildpack API][buildpack], [managing buildpacks][manage-buildpacks], [build-time warning][frontend-heroku], [Codecov][codecov]

### 2.09. Application code execution and server-side injection

OS command injection, server-side template injection, unsafe deserialization, and vulnerable runtime components can give attacker-controlled code access to the application's environment. Exploitability depends on the vulnerable component and execution privileges. **Published demonstrations and observed attacks:** OWASP documents command execution and deserialization paths; PortSwigger demonstrates template injection. Cloudflare observed Log4Shell payloads attempting to extract environment values, including passwords, in December 2021. Those observations include blocked attempts and do not prove successful theft from a Heroku application. [Command injection][command], [deserialization][deserialize], [template-injection research][ssti], [Cloudflare analysis][log4shell]

### 2.10. Arbitrary file read, path traversal, or local file inclusion

A file-disclosure flaw may expose environment-bearing files or process environment data where the operating system permits access. The attacker must also receive the relevant contents; a server reading a file internally does not by itself prove exfiltration. **Published demonstration:** PostCSS's July 2026 advisory documents attacker-influenced file reads and error-message disclosure of approximately the first ten bytes, including environment-file prefixes. This is a bounded information leak, not a demonstrated full secret dump or Heroku incident. [OWASP, local file inclusion][lfi], [PostCSS advisory GHSA-6g55-p6wh-862q][postcss]

### 2.11. Server-side request forgery into a secret-bearing resource

SSRF may let an attacker reach an internal diagnostic endpoint, configuration service, or supported file resource that exposes secrets or enables another attack class. **Conditional mechanism:** OWASP documents access to internal resources and cloud metadata. A reachable resource, sufficient authority, and a way to obtain its response or execute further code are still required. An AWS metadata attack must not be treated as a universal SSRF-to-Heroku-Config-Vars path; the cited material supplies no such Heroku precedent. [OWASP, SSRF][ssrf]

### 2.12. Exposed configuration, debug, or diagnostic endpoints

An application may disclose configuration through an insufficiently protected endpoint, error page, diagnostic report, or memory dump without an attacker obtaining a shell. **Documented mechanism:** Django warns that debug output can expose settings and local variables. Spring Boot documents sensitive diagnostic endpoints and value sanitization. Current Spring Boot defaults sanitize environment values; enabling an endpoint or Django debug mode alone does not prove that every secret is returned. The actual exposure depends on version, configuration, filtering, and authorization. [Django deployment checklist][django], [Spring Boot endpoints][spring]

### 2.13. Secrets copied into logs, telemetry, or error-reporting services

Secrets printed by application/build code or captured in diagnostics may reach logs, APM systems, support exports, or external log drains. An attacker needs access to those copies or their destination. Drain definitions can themselves contain credentials; their disclosure does not imply access to every Config Var. **Analogous incident:** StepSecurity observed the compromised `tj-actions/changed-files` action exposing CI secrets in public logs in March 2025. This establishes the log-disclosure path, not theft by a Heroku logging provider. [Heroku logging][logging], [log drains][drains], [OAuth metadata limitation][oauth], [StepSecurity investigation][tj-actions]

### 2.14. Secret copies in repositories, exposed files, or backups

Accidental publication or unauthorized access to `.env` files, repository history, configuration exports, and backups can disclose values also used as Heroku Config Vars. Heroku warns against committing secrets in source or `project.toml`. **Analogous incident:** Unit 42's August 2024 investigation documented attackers using credentials recovered from publicly exposed `.env` files to compromise cloud environments. This path retrieves a copy of a secret; it need not involve reading Heroku's configuration store. [Config Vars guidance][config], [build configuration][manage-buildpacks], [Unit 42 investigation][env-files]

### 2.15. Secrets embedded in images or browser-delivered build artifacts

Build arguments, image layers, generated files, and client-side JavaScript can retain secrets supplied during a build. Registry/artifact access—or ordinary public access to a browser bundle—may then suffice. **Analogous incident:** Codecov traced its 2021 compromise to a service credential extracted from an intermediate layer of its public Docker image. **Documented browser mechanism:** Vite bundles designated client-visible environment values into source code. This does not expose every runtime Config Var automatically. [Codecov][codecov], [Docker build secrets][docker], [Vite environment variables][vite]

### 2.16. Compromised add-on provider or delegated third-party service

An attacker compromising an add-on provider may obtain that provider's service credentials or secret copies actually sent to it. Additional application access depends on separately granted permissions or installed code. **Documented, limited mechanism:** Heroku permits an add-on to read only Config Vars it sets; it cannot read manually configured values or another add-on's values through that integration. The cited documentation establishes this trust boundary, not a confirmed malicious-provider incident or unrestricted access to the application's environment. [Heroku, How Add-ons Work][addons]

## III. Materials and authorities consulted

All linked materials below were reviewed on **September 9, 2026**. Incident dates and publication dates are identified separately where relevant. “Precedent” in this memorandum means a documented technical event, not judicial precedent.

### A. Incident reports, advisories, and original research

1. Heroku, [April 2022 Incident Review][heroku-2022] (June 14, 2022), “Incident Summary.”
2. GitHub, [Security alert: stolen OAuth user tokens][github-2022] (April 2022), investigation and npm impact.
3. CircleCI, [Jan. 4, 2023 security incident report][circleci] (January 2023), “What happened?”
4. Codecov, [Post-Mortem / Root Cause Analysis (April 2021)][codecov], “Root Cause” and “Impact.”
5. GitHub Advisory Database, [Malware in ctx, GHSA-4g82-3jcr-q52w][ctx] (May 25, 2022).
6. Microsoft, [Typosquatted npm packages used to steal cloud and CI/CD secrets][npm-typosquat] (May 28, 2026).
7. Microsoft, [Malicious npm packages abuse dependency confusion to profile developer environments][npm-confusion] (May 29, 2026).
8. PortSwigger, [Server-Side Template Injection][ssti] (August 5, 2015; updated September 3, 2025).
9. Cloudflare, [Log4j exploitation, evasion, and exfiltration analysis][log4shell] (December 14, 2021).
10. PostCSS, [Arbitrary file read and information disclosure, GHSA-6g55-p6wh-862q][postcss] (July 20, 2026), “Summary” and “Impact.”
11. StepSecurity, [tj-actions/changed-files compromise investigation][tj-actions] (March 2025).
12. Palo Alto Networks Unit 42, [Leaked Environment Variables Allow Large-Scale Extortion Operation in Cloud Environments][env-files] (August 15, 2024).

### B. Platform and application documentation

- Heroku: [Configuration and Config Vars][config] (scope); [Platform API Reference][api] (Config Vars); [OAuth][oauth] (scopes); [App Permissions][permissions]; [Heroku CLI][cli] (credential storage); [One-Off Dynos][one-off].
- Heroku: [GitHub Integration][deploy] (automatic deploys); [Review Apps][review-apps] (sensitive Config Vars); [Heroku CI][heroku-ci] (environment variables and test runs); [Release Phase][release]; [Dyno Startup Behavior][startup].
- Heroku: [Buildpack API][buildpack] (classic buildpacks and startup scripts); [Managing Buildpacks][manage-buildpacks] (inline buildpacks and build environment); [Deploying Front-End Web Apps][frontend-heroku] (build-time secrets warning).
- Heroku: [Logging][logging]; [Log Drains][drains]; [How Add-ons Work][addons] (Config Vars and add-on security).
- OWASP: [Command Injection][command]; [Deserialization Cheat Sheet][deserialize]; [WSTG v4.2, Local File Inclusion][lfi]; [Server Side Request Forgery][ssrf].
- Framework/build documentation: [Django 5.2 deployment checklist][django] (debug); [Spring Boot endpoints][spring] (sensitive-value sanitization); [Docker build secrets][docker]; [Vite environment variables][vite].

[heroku-2022]: https://www.heroku.com/blog/april-2022-incident-review/
[github-2022]: https://github.blog/news-insights/company-news/security-alert-stolen-oauth-user-tokens/
[circleci]: https://circleci.com/blog/jan-4-2023-incident-report/
[codecov]: https://about.codecov.io/apr-2021-post-mortem/
[ctx]: https://github.com/advisories/GHSA-4g82-3jcr-q52w
[npm-typosquat]: https://www.microsoft.com/en-us/security/blog/2026/05/28/typosquatted-npm-packages-used-steal-cloud-ci-cd-secrets/
[npm-confusion]: https://www.microsoft.com/en-us/security/blog/2026/05/29/33-malicious-npm-packages-abuse-dependency-confusion-profile-developer-environments/
[ssti]: https://portswigger.net/research/server-side-template-injection
[log4shell]: https://blog.cloudflare.com/exploitation-of-cve-2021-44228-before-public-disclosure-and-evolution-of-waf-evasion-patterns/
[postcss]: https://github.com/postcss/postcss/security/advisories/GHSA-6g55-p6wh-862q
[tj-actions]: https://www.stepsecurity.io/blog/harden-runner-detection-tj-actions-changed-files-action-is-compromised
[env-files]: https://unit42.paloaltonetworks.com/large-scale-cloud-extortion-operation/
[config]: https://devcenter.heroku.com/articles/config-vars
[api]: https://devcenter.heroku.com/articles/platform-api-reference#config-vars
[oauth]: https://devcenter.heroku.com/articles/oauth#scopes
[permissions]: https://devcenter.heroku.com/articles/app-permissions
[cli]: https://devcenter.heroku.com/articles/heroku-cli#login-issues
[one-off]: https://devcenter.heroku.com/articles/working-with-one-off-dynos
[deploy]: https://devcenter.heroku.com/articles/github-integration#automatic-deploys
[review-apps]: https://devcenter.heroku.com/articles/github-integration-review-apps#sensitive-config-vars
[heroku-ci]: https://devcenter.heroku.com/articles/heroku-ci#setting-environment-variables-env
[release]: https://devcenter.heroku.com/articles/release-phase
[startup]: https://devcenter.heroku.com/articles/dyno-startup-behavior
[buildpack]: https://devcenter.heroku.com/articles/buildpack-api
[manage-buildpacks]: https://devcenter.heroku.com/articles/managing-buildpacks
[frontend-heroku]: https://devcenter.heroku.com/articles/deploying-front-end-web#build-time-config-vars
[logging]: https://devcenter.heroku.com/articles/logging
[drains]: https://devcenter.heroku.com/articles/log-drains
[addons]: https://devcenter.heroku.com/articles/how-add-ons-work#updating-config-vars-and-add-on-security
[command]: https://owasp.org/www-community/attacks/Command_Injection
[deserialize]: https://cheatsheetseries.owasp.org/cheatsheets/Deserialization_Cheat_Sheet.html
[lfi]: https://owasp.org/www-project-web-security-testing-guide/v42/4-Web_Application_Security_Testing/07-Input_Validation_Testing/11.1-Testing_for_Local_File_Inclusion
[ssrf]: https://owasp.org/www-community/attacks/Server_Side_Request_Forgery
[django]: https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/#debug
[spring]: https://docs.spring.io/spring-boot/reference/actuator/endpoints.html#actuator.endpoints.sanitization
[docker]: https://docs.docker.com/build/building/secrets/
[vite]: https://vite.dev/guide/env-and-mode#env-variables
