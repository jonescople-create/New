# AuraOS - Product Requirements Document

## Original Problem Statement
Build AuraOS, a next-generation desktop environment shell with 'Obsidian Glass' aesthetic, featuring:
- 'Fluid-state' OS shell with cohesive surface design
- Obsidian Glass aesthetic (high-density blur, 0.8 opacity, dynamic accent colors)
- TypeScript-based Shell Manager for window lifecycle
- Aura glow effects on windows
- Dock with hot corner dashboard activation
- Compositor with momentum-based physics for draggable windows

## Architecture
- **Frontend**: React + Tailwind CSS + Framer Motion (for drag/momentum physics)
- **Backend**: FastAPI + MongoDB (JWT auth with httpOnly cookies)
- **Fonts**: Outfit (headings) + Manrope (body)
- **Aesthetic**: Obsidian Glass - glass-morphism with backdrop-blur, dark surfaces, iridescent borders

## User Personas
1. **Desktop User**: Logs in, uses desktop apps, customizes aura settings
2. **Admin**: Full access to system settings and user management

## Core Requirements
- [x] User authentication (register, login, logout, JWT)
- [x] Desktop shell with cosmic wallpaper
- [x] Top bar with system tray (WiFi, Bluetooth, Volume, Notifications, Time)
- [x] Bottom dock with 7 app icons (macOS-like magnification hover)
- [x] Draggable windows with momentum physics (framer-motion)
- [x] Aura glow effects on windows (pulsing box-shadow)
- [x] Settings app with Aura Effects & Colors controls
- [x] File Explorer with virtual filesystem
- [x] Terminal emulator with command execution
- [x] Text Editor with save/copy/clear
- [x] System Monitor with CPU/Memory/Disk gauges
- [x] Email app with mock inbox
- [x] Control panel with WiFi/Bluetooth/Volume/Brightness
- [x] Hot corner detection (bottom-left)
- [x] Window lifecycle (open, close, minimize, maximize, focus)

## What's Been Implemented (April 2026)
- Full auth flow with JWT, admin seeding, session management
- Desktop shell with cosmic wallpaper, centered logo, animated orbs
- Top bar with AuraOS branding, clock, system icons, user panel
- Glass-morphism dock with 7 app launchers and active indicators
- Draggable windows with framer-motion momentum physics
- macOS-style traffic light buttons (close/minimize/maximize)
- Aura pulse glow effects on active windows
- Settings: Aura Intensity slider, Color Shift Mode, Accent Palette, Transparency, Toggles
- File Explorer navigating virtual filesystem via API
- Terminal with simulated commands (help, whoami, ls, neofetch, etc.)
- Text Editor with line/char count and toolbar
- System Monitor with real CPU/Memory/Disk via psutil
- Email app with mock inbox, folders, and detail view
- Control panel with toggles and brightness slider
- Dashboard overlay activated by hot corner

## Prioritized Backlog
### P0 (Critical)
- All P0 features implemented ✓

### P1 (Important)
- Real file system browsing (restricted to user directory)
- Window resize handles (drag to resize)
- Custom wallpaper upload with color extraction
- Notification system

### P2 (Nice to Have)
- Three.js WebGL cosmic background (currently CSS-based)
- App store / installable apps
- Multi-user workspace
- Real email integration
- Keyboard shortcuts
- Window snap to edges

## Next Tasks
1. Add window resize handles for proper resizing
2. Implement wallpaper selection UI in Settings
3. Add keyboard shortcuts (Cmd+W close, Cmd+M minimize)
4. Add real-time notifications
5. Enhance terminal with more commands
