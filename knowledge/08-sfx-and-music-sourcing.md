# 08 — Sound effects & nhạc: dùng skill `stock-audio`
> Nhạc nền (cách chọn, mức âm lượng, ducking, kiểm tra) nằm ở **file 10**. File này tập trung SFX và cách cài skill.

## Luật
- **SFX và nhạc nền lấy bằng skill `/stock-audio`** (CLI `stock_audio.py`: search → download → probe → fit → mix; tự ghi `stock_audio_manifest.json` + `CREDITS.md`). Không tự cào web, không tự tổng hợp thay thế khi stock-audio có hàng.
- **SFX tổng hợp bằng code (`core/audio/sfx.py` của lemo-opuscar) chỉ là phương án dự phòng** khi stock-audio không có tiếng cần thiết, hoặc để lấp chỗ trống rất nhỏ. Pilot 1453 v1–v2 dùng SFX tổng hợp; **từ v3 toàn bộ SFX lấy bằng stock-audio** (bảng bên dưới). Nhạc nền của pilot vẫn là nhạc tự tạo bằng code (Karplus-Strong); tập thật nên thử nhạc từ stock-audio (lute/harpsichord/cello) và so sánh.
- Nhạc: khớp tông kênh (điềm tĩnh, bí ẩn, cổ điển): đàn dây gảy/lute, viola da gamba, organ phòng, cello solo, harpsichord; tránh "piano + dàn dây" chung chung. Từ khóa gợi ý (tiếng Anh): `medieval`, `lute`, `harpsichord`, `baroque`, `cello`, `dark ambient`, `mysterious`, `ancient`, `cinematic calm`.
- **Tên SFX theo chất liệu của style** (xem STYLE.md engraving & archive-lighttable): giấy (peel, slip tap, tissue rustle, page turn), kim loại/burin (hiss, tick), bút/mực (pen scratch), nước/cọ (water plip, wet brush), kính (glass set-down, ring), phòng xưởng (clock tick, room tone). Dùng `search "<từ khóa>" --type sfx --max-duration 3`.
- **Credit:** Mixkit (không cần credit; nhạc không dùng cho TV/radio/game); Incompetech = CC BY 4.0 **bắt buộc ghi credit**. Hỏi/ưu tiên `--no-credit` cho kênh để mô tả video gọn; nếu dùng Incompetech, dán `attribution_text` vào mô tả. Mọi track ghi vào `episodes/EPxxx/assets-licenses.md`/`CREDITS.md`.
- Nguồn thủ công (Pixabay, YouTube Audio Library, Chosic, Musopen, FMA, Bensound…): skill chỉ đưa link, **người dùng tải tay rồi `import`**. Không bypass bot-check/login.
- Mix: voice là ưu tiên số 1; nhạc ~ nửa mức thoại, ducking theo giọng; foley ngắn, tắt/hạ ở 2 khoảnh khắc im lặng (trước loupe/bước ngoặt và sau câu cuối). Master -14 LUFS (mux.sh).

## Đã áp dụng trong pilot 1453 (2026-11-05)
12 SFX Mixkit (không cần credit, license "Mixkit Sound Effects Free"), tải bằng `stock_audio.py download <id> --type sfx --out pilot-1453/assets/audio/sfx` (`CREDITS.md` + `stock_audio_manifest.json` nằm cùng thư mục). Bảng ánh xạ cảnh → SFX (dùng lại cho tập thật):
| Hành động trên hình | Mixkit id |
|---|---|
| burin / bút khắc, nét khắc, chữ được cắt | 2367 Writing with a pen on paper; 2369 Writing scribble; 3194 Writing pencil; 809 Metal Scrape (nhấc burin) |
| mảnh giấy / tờ đặt xuống bàn sáng | 1104 Page turn single; 1105 Big paper page turn |
| kính lúp hạ xuống / roundel chạm | 2623 Ghostly whoosh passing; 154 A couple of glasses clink (cắt đuôi) |
| cọ ướt + nước khi màu nở | 3087 Long broom or wipe sweep; 1879 Bathroom sink water drip; 1311 Water splash |
| đồng hồ xưởng | 1061 Clock ticker single |
**Khoảng trống của Mixkit:** không có "room tone" và không có tiếng burin/cọ thật (phải mượn bút/chổi). Pilot dùng nền phòng tổng hợp (brown noise rất nhỏ). Khi cần chân thực hơn → thử `--source all`/nguồn thủ công (Pixabay "engraving", "quill", "wax seal", "old library ambience") qua `manual-url` + `import`.
Cách đặt: cắt đoạn 0.25–0.6 s với fade 20 ms, ngẫu nhiên hóa vị trí/pan, gain thấp (≈0.05–0.2 so với giọng), `mix.py` của pilot là mẫu. Sau mix, **kiểm giọng bằng whisper trên bản cuối** (pilot: câu chữ nguyên vẹn).

## Cài `stock-audio` trên máy mới (bắt buộc kiểm tra đầu phiên)
Skill là **skill cá nhân của người dùng**, không nằm trong marketplace plugin. Nguồn: repo GitHub **`https://github.com/quanlh30504/claude-skills`** (thư mục `skills/stock-audio`; cùng repo có `make-skill`, `idea-to-video`, `make-reel`, `itv-*`).

1. Kiểm tra đã cài chưa: tồn tại `~/.claude/skills/stock-audio/SKILL.md` (Windows: `C:\Users\<user>\.claude\skills\stock-audio\`) và skill `stock-audio` hiện trong danh sách skill.
2. Nếu chưa có:
   ```bash
   git clone https://github.com/quanlh30504/claude-skills ~/claude-skills
   cd ~/claude-skills && sh install.sh          # macOS/Linux/Git Bash
   ```
   Windows PowerShell: `cd ~\claude-skills; .\install.ps1`. Script chép các skill vào `~/.claude/skills`. **Khởi động lại Claude Code** để skill được nạp. (Repo riêng của người dùng — nếu không clone được, hỏi người dùng quyền truy cập thay vì tự tìm bản khác.)
3. Phụ thuộc: Python 3.8+ (stdlib), **ffmpeg/ffprobe trên PATH**. Chạy với `python -X utf8` trên Windows. Kiểm thử nhanh: `python -X utf8 ~/.claude/skills/stock-audio/scripts/stock_audio.py categories --type sfx`.
4. Tải file về = hành động cần **xin phép người dùng** (nêu tên file, nguồn, dung lượng); tư liệu đã `search` mới `download` được.
5. Cập nhật skill: `git -C ~/claude-skills pull && sh install.sh`.

Tài liệu đầy đủ của skill: `~/.claude/skills/stock-audio/SKILL.md` và `references/` (sources, licenses, mood-map, integration).
