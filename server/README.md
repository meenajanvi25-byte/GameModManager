# Server

Local API for GameModManager. The default file storage root is `C:\\Mods`; set `MODS_ROOT` to override it.

## Endpoints

- `GET /api/health` — service status and storage root.
- `GET /api/games` — list game folders under the storage root.
- `POST /api/games` — create a game folder. JSON body: `{"name":"Game name"}`.
- `GET /api/search?id=12345232` — find local files whose names start with that exact numeric ID followed by a hyphen, underscore, period, or end of filename.

Search accepts IDs of 1–32 digits and scans at most 20,000 files. It returns file names, relative paths, optional game folder names, and file sizes; it does not expose file contents or create download links. Matching is case-insensitive for filenames and does not match partial IDs (for example, searching for `123` will not match `1234-mod.zip`).

The manager is for legitimate mod/catalog files and does not implement DRM bypass, cracking, license manipulation, or Steam-directory injection.
