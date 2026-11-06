# 00 — Cài đặt khi dùng dự án trên máy khác (agent đọc đầu phiên, kiểm tra từng mục)

| Thành phần | Nguồn | Kiểm tra / cài |
|---|---|---|
| Plugin `youtube-agent` (skill yt-*) | marketplace GitHub `Jakeschincariol/youtube-agent-skill` (plugin `youtube-agent@youtube-agent-skill`) | `/plugin marketplace add Jakeschincariol/youtube-agent-skill` rồi cài `youtube-agent` |
| Plugin `lemo-opuscar` | marketplace GitHub `lemomo-ai/lemo-opuscar` (plugin `lemo-opuscar@lemolab`) | cài plugin, chạy skill một lần để `setup.sh` clone thư viện về `~/lemo-opuscar`; sau đó `setup.sh deps` và `setup.sh deps voice` (Kokoro + faster-whisper) |
| Skill `stock-audio` (SFX + nhạc) | repo riêng `https://github.com/quanlh30504/claude-skills` (`skills/stock-audio`) | xem `08-sfx-and-music-sourcing.md`; `sh install.sh`, khởi động lại Claude Code |
| Node 20+, ffmpeg 7+, Python 3.11+ (hoặc uv), git | hệ thống | cài tay; `setup.sh` chỉ báo thiếu. Windows: Git Bash cần `export MSYS_NO_PATHCONV=1 PYTHONUTF8=1` (xem file 04) |
| Font **Playfair Display + Source Sans 3 + Lora** (OFL; Bodoni/Pinyon không còn dùng) | `raw.githubusercontent.com/google/fonts/main/ofl/...` | đã nằm trong `pilot-1453/fonts/` (copy cho mỗi project) |
| Giọng | Kokoro `bm_george` (offline, trong lemo-opuscar) | không cần dịch vụ ngoài |
| Quyền tải | người dùng xác nhận trong chat trước khi tải file | tư liệu, font, model |

Quy trình đầu phiên trên máy lạ: (1) đọc `CLAUDE.md`; (2) chạy kiểm tra bảng trên (skill có trong danh sách? `~/lemo-opuscar` tồn tại? `~/.claude/skills/stock-audio`?); (3) thiếu gì thì hướng dẫn cài như cột cuối, **không tự cài phần mềm hệ thống**; (4) chạy lại `pilot-1453/build.sh` để xác nhận toàn chuỗi (voice → mix → render) hoạt động.

## Git: cái gì vào, cái gì không (2026-11-06)
- **Vào git (tri thức + mã tái dùng + văn bản):** `CLAUDE.md`, `knowledge/` (trừ font ứng viên .ttf đã loại), `templates/`, `episodes/EPxxx/` gồm `brief/research/script/bible/HANDOFF/assets-*.md`, `shots/`, `timing/`, `tools/`, engine nguồn (`pu*/` *.js/html/json, `engine/`, `fonts/` đã khóa), `lines.json`/`asr.json`, `CREDITS.md`/manifest.
- **KHÔNG vào git (output nặng, tái tạo được):** `parts/*.mp4`, `out/`, `stills/`, `qc/`, `styletest/`, mọi `.wav/.mp3/.mp4`, `audio/` (trừ lines/asr json), `assets/audio/` (tải lại bằng stock-audio theo manifest), ảnh tư liệu `archive/*.jpg|png` (tải lại theo `archive.json` + `assets-licenses.md`), `art-in/ art-cut/ art-ready/` (ảnh người dùng dán về — sao lưu riêng, ví dụ ổ đám mây), `*.log`. Chi tiết: `.gitignore`.
- **Sang máy mới:** `git clone <repo>` → làm theo bảng ở đầu file này (plugin, stock-audio, deps) → tái tạo output: `tts.py` (giọng) → `tools/pipeline.sh` (render/mix/mux); tải lại SFX/nhạc/tư liệu theo manifest.
- Mọi thứ cần dùng lại cho tập sau phải nằm trong thư mục đang theo dõi; **không để tri thức chỉ nằm trong output hoặc chat**. Commit sau mỗi cổng ★ được duyệt.
- Repo hiện chỉ có commit **cục bộ**; chưa có remote. Thêm: `git remote add origin <URL>` rồi `git push -u origin master` (cần người dùng cung cấp URL; dùng repo **private**).
