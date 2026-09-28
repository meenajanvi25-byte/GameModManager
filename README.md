# GameModManager

A clean, legitimate game mod and file manager.

## Features

- Search local catalog files by the exact numeric ID at the start of a filename (for example, `12345232-mod.zip`).
- Keep each game's files in its own folder under the storage root.
- Create and list game folders from the web interface.
- Use `C:\\Mods` by default, or configure another local root with `MODS_ROOT`.
- Never write automatically into Steam installation directories.

Search matches a numeric ID only when it is followed by a hyphen, underscore, period, or the end of the filename. Filename matching is case-insensitive; partial numeric-ID matches are not returned.

## Storage layout

```
C:\\Mods\\
├── GTA V\\
├── Forza Horizon\\
├── Minecraft\\
└── Downloads\\
```

## Architecture

```
Web UI -> API -> Local catalog file index -> C:\\Mods
```

This project is for legitimate mods and catalog files. It intentionally does not implement DRM bypass, license manipulation, cracking, or Steam-directory injection.
