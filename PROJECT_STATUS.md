# Project status and engineering notes

This document records the boundary between what this repository is intended to demonstrate, what has been verified in the repository, and what still needs evidence. It is deliberately more specific than a feature list.

## Current stage

**Personal student-planning experiment**

## Why this exists

I built this to try a single workspace for courses, tasks, milestones, and study planning instead of maintaining separate lists across several tools.

## Scope and known limitations

The repository includes a static preview, but the full app depends on its server, database, authentication, and configured integrations. It is not a multi-tenant education platform, and generated planning suggestions require user judgment.

## Next evidence to collect

Publish a fixture-backed demo path and document which features are available in the static preview versus a configured full stack environment.

## Maintenance rule

Future changes should describe one concrete behavior, include the smallest relevant verification step, and update this document whenever the project boundary changes.
