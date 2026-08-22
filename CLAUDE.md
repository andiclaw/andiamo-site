
## Disk discipline (standing, fleet law — OPS-SCRATCH-DISCIPLINE-CLAUDEMD-001, 2026-08-23)
- Before ANY build, export, staging, or bulk-file step: `export TMPDIR=/Volumes/Scratch/tmp` (create it
  if absent). /private/var/folders on the boot disk is where the 306-file ENOSPC integrity incident
  happened — never stage bulk work there.
- Build outputs (.next, dist, cargo target, tauri target) go to /Volumes/Scratch (the ACA_BUILD_DIR
  pattern). Caches too: `npm_config_cache=/Volumes/Scratch/caches/npm`,
  `CARGO_TARGET_DIR=/Volumes/Scratch/caches/cargo-target` where applicable.
- Check `df -h /` BEFORE any operation that writes >1GB. STOP under 5G free and report, rather than
  starting an operation that can die mid-write.

