# GameModManager

A clean, legitimate game mod and file manager.

## Goals
- Search a catalog of legitimate/open-source mods and files.
- Download files into a dedicated local directory.
- Keep each game's files separated.
- Never write automatically into Steam installation directories.
- Support configurable storage locations such as `C:\\Mods`.

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
Web UI -> API -> Catalog/Database -> Downloader -> C:\\Mods
```

This project intentionally does not implement DRM bypass, license manipulation, cracking, or Steam-directory injection.
