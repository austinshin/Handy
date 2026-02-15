# AI Coding Assistant Instructions for Handy

## Architecture Overview
Handy is a cross-platform speech-to-text desktop app built with Tauri 2.x (Rust backend + React/TypeScript frontend). Core flow: Audio recording → Voice Activity Detection (VAD) → Whisper/Parakeet transcription → Text output to clipboard.

**Key Components:**
- **Backend Managers** (`src-tauri/src/managers/`): Audio, Model, Transcription handle core logic with shared state via `Arc<Mutex<T>>`
- **Frontend State** (`src/stores/`): Zustand stores with reactive updates via Tauri commands
- **Communication**: Frontend calls Tauri commands; backend emits events for real-time updates

## Development Workflow
```bash
bun install  # Dependencies
mkdir -p src-tauri/resources/models && curl -o src-tauri/resources/models/silero_vad_v4.onnx https://blob.handy.computer/silero_vad_v4.onnx  # Required VAD model
bun run tauri dev  # Full dev mode
CMAKE_POLICY_VERSION_MINIMUM=3.5 bun run tauri dev  # macOS cmake fix
bun run dev  # Frontend-only dev
bun run lint:fix && bun run format  # Pre-commit checks
```

**Debug Mode**: `Cmd+Shift+D` (macOS) / `Ctrl+Shift+D` (Win/Linux) for diagnostics and manual model downloads.

## Code Patterns
- **Error Handling**: Rust uses `anyhow::Error` with `?`; React uses try/catch with user feedback
- **Internationalization**: All UI strings via `i18next` - add to `src/i18n/locales/en/translation.json`, use `t('key.path')`
- **Settings**: Reactive via `tauri-plugin-store`; changes propagate through Zustand → Tauri commands → Rust state
- **Single Instance**: App enforces single process; new launches bring settings window to front
- **Platform Differences**: macOS uses Metal acceleration; Windows/Linux use Vulkan; Linux requires `xdotool`/`wtype` for text input

## Integration Points
- **Audio Pipeline**: `cpal` for recording, `vad-rs` for silence filtering, `whisper-rs`/`transcription-rs` for inference
- **System Integration**: `rdev` for global shortcuts, `enigo`/`xdotool` for text input, `tauri-plugin-clipboard-manager` for output
- **Model Management**: Auto-downloads Whisper variants (Small/Medium/Turbo/Large) or Parakeet V3; stored in app data directory

## Conventions
- **Commits**: Conventional commits (`feat:`, `fix:`, `refactor:`)
- **Imports**: Group external libs, internal modules, relative; use `import type` for TS interfaces
- **Components**: Functional with hooks; destructure props with defaults; minimize prop drilling
- **Rust Style**: Snake_case functions, PascalCase types; builder patterns for initialization; comment blocks `/* ─────────── */`

Reference: [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), [BUILD.md](BUILD.md) for detailed setup.</content>
<parameter name="filePath">c:\Users\link\Documents\code\handy-fork\.github\copilot-instructions.md