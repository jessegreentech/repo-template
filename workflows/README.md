# Workflow status records

Each workflow run gets its own directory at
`workflows/<workflow>/<instance>/status.json`. Use a stable workflow name and a
unique instance identifier (for example, a timestamp or run ID); do not reuse an
instance directory for a later run.

Each `status.json` records the workflow name, instance, current status, start and
update timestamps, and a short summary. Keep records small and machine-readable.
For example:

```json
{
  "workflow": "example",
  "instance": "2026-10-12T10-00-00Z",
  "status": "in_progress",
  "startedAt": "2026-10-12T10:00:00Z",
  "updatedAt": "2026-10-12T10:00:00Z",
  "summary": "Describe the current run."
}
```
