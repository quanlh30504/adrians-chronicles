# 04 — Quy trình sản xuất & map skill

## Giai đoạn → skill (dùng tối đa youtube-agent)
| # | Giai đoạn | Skill / công cụ | Đầu ra |
|---|---|---|---|
| 0 | Hiểu thị trường, kênh đối thủ | `youtube-agent:yt-audit`, `yt-viral`, `youtube` (competitor research); đọc `06-reference-channels.md` | ghi chú học hỏi |
| 1 | Chiến lược & lịch nội dung | `yt-plan` | content calendar |
| 2 | Chọn/đánh giá ý tưởng | `yt-viral` + chấm điểm ở file 03 | `episodes/EPxxx/brief.md` |
| 3 | Nghiên cứu sự thật | WebSearch/WebFetch (+ `itv-research` nếu cần dossier sâu) | `research.md` (nguồn, ngày, số liệu, tranh cãi) |
| 2b | **Chọn style ★ (mỗi tập)** | cho xem thư viện mẫu (file 14), người dùng chọn | `STYLE.md` + mục Style trong brief |
| 3c | **Bible nhân vật + kiến trúc** | file 13 §5; chọn giọng nhân vật (file 14 §5) | `bible.md` (model sheet, set list, giọng, gag) |
| 4 | Viết script **dạng cảnh có thoại** | `yt-script` + `knowledge/02` (giọng người kể) + **`knowledge/13`** | `script.md` (NARRATOR:/NAME: theo cảnh, có timestamp ước tính) |
| 4b | **Cổng nguồn hình vẽ ★ (file 16)** | hỏi: agent tự vẽ / prompt cho bên thứ 3 / ảnh có sẵn; xuất `art-brief/`; nhập ảnh `ingest_art.py` | `art-ready/` + manifest |
| 5 | Giữ chân | `yt-retention` (hook, re-hook, open loop) | script đã sửa |
| 6 | Chương/timestamps | `yt-chapters` | danh sách chapter |
| 7 | **Lên lại kịch bản chi tiết (shot-level)** | `lemo-opuscar:lemo-opuscar` | `shots/` mỗi Part |
| 8 | Giọng đọc | **Kokoro `bm_*` của lemo-opuscar** (`core/tts/tts.py`, giọng khóa) + kiểm `asr_check.py` | `audio/partN.wav` + word timings |
| 9 | Âm thanh/nhạc | **`/stock-audio` cho cả SFX lẫn nhạc** (SFX: file 08; nhạc nền + mức mix: file 10; tổng hợp bằng code chỉ dự phòng) | bed nhạc + SFX + license |
| 3b | Thu thập tư liệu hình | giao thức file 09 (Commons/LoC/Met/Rijks…), xin phép tải theo lô | `archive/` + `assets-licenses.md` |
| 10 | Dựng & render theo Part | `lemo-opuscar` (code film) | `parts/EPxxx-P1.mp4`… |
| 11 | Ghép cuối | **Người dùng làm bằng CapCut** | video hoàn chỉnh |
| 12 | Thumbnail/title/mô tả/tag | `yt-package`, `yt-seo`, `yt-chapters` | `package.md` |
| 13 | Shorts tái sử dụng | `yt-shorts` (và `make-reel`) | clip ngắn |
| 14 | Sau đăng | `yt-audit`, `yt-comment` | bài học → cập nhật knowledge |
`yt-edit` dùng khi cần tư vấn nhịp dựng/B-roll/phụ đề.

## Lưu ý kỹ thuật lemo-opuscar (đã kiểm tra 2026-11-05)
- Thư viện ở `~/lemo-opuscar` (`LIB`), clone bởi `setup.sh`; cài gói: `sh setup.sh deps`. Hiện thiếu Python 3.11+/uv.
- Tool chạy từ `$LIB` với đường dẫn tuyệt đối của project; không sửa `core/` hay `styles/`.
- Mặc định của thư viện là clip 30–60s; video >2–3 phút tốn nhiều thời gian/token → **luôn làm theo Part** (file 05) và tái sử dụng bộ asset/khung cho cả tập.
- Giọng: **Kokoro (offline) `bm_*`** theo quy trình thư viện: `tts.py lines.json out/` → kiểm từng đoạn bằng faster-whisper (`core/tts/asr_check.py`, tải model ~145 MB lần đầu) để lấy word timings → nén giọng rồi cân bằng ~10 dB trên nhạc → master -14 LUFS. Cài bằng `setup.sh deps voice`.
- Archive light-table là style "Edit & Documentary": thu thập tư liệu thật trước khi viết treatment.

## Bài học kỹ thuật từ pilot (Windows, 2026-11-05)
- **Git Bash làm hỏng đường dẫn bắt đầu bằng `/`**: luôn `export MSYS_NO_PATHCONV=1 PYTHONUTF8=1` trước khi chạy tool lemo; chạy `setup.sh` từ thư mục skill, không từ trong `$LIB`. Tên thư mục dự án có dấu `’` vẫn chạy được với still/video/mux; script python truyền đường dẫn qua `cd` vào thư mục rồi dùng đường dẫn tương đối nếu lỗi.
- `asr_check.py` cần `PYTHONUTF8=1` (nếu không lỗi ký tự mũi tên). Năm đọc thành chữ ("fourteen fifty-three") luôn lệch với "1453" khi kiểm: chỉ diff mong đợi, hoặc thêm trường `asr`.
- Cấu trúc project chuẩn: `index.html` + `film.js` (render theo thời gian) + `assets/audio/sfx/` (stock-audio) + `engine/` (copy từ `styles/engraving/demo/engine`) + `fonts/` + `archive/` (+ `archive.json`: file, label_top, reading, source) + `lines.json` + `mix.py` + `build.sh`. Dùng `pilot-1453/` làm khuôn cho tập mới.
- Tư liệu archive: tải từ Wikimedia Commons bằng `Special:FilePath/<tên>?width=2400` (cần User-Agent), **xin phép người dùng trước khi tải**, ghi nguồn vào `CREDITS`. Ảnh BnF tải về chỉ 1297×1851: ưu tiên nguồn độ phân giải cao hơn cho tập thật.
- Font OFL lấy từ `raw.githubusercontent.com/google/fonts/main/ofl/...` (đã có trong `pilot-1453/fonts/`).
- Hướng dẫn thư viện: không để lộ chữ ký/credit LemoLab trong phim của kênh.

## Quy ước làm việc cho agent
- **Bắt đầu mỗi tập bằng brief** (template ở `templates/episode-brief.md`): chủ đề, góc nhìn, câu hỏi mở, độ dài mục tiêu, số Part, nguồn chính.
- **Hỏi tối thiểu**: chỉ hỏi người dùng khi quyết định thật sự của họ (style, giọng, chủ đề). Còn lại chọn mặc định hợp lý và nói rõ.
- **Script là hợp đồng**: sau khi duyệt script, shot-level script (lemo-opuscar) bám sát từng câu; mỗi câu/đoạn có hình tương ứng, ghi nguồn ảnh/tư liệu.
- **Tách Part ngay từ script**: đánh dấu `=== PART n ===` tại chương kết; mỗi Part có cold-open/recap 1–2 câu *không* lặp thừa khi ghép liền (xem file 05: dùng "soft seam").
- **Pilot trước khi render dài:** render 30–60s thử (cảnh + voice + nhạc) để người dùng duyệt style/giọng, rồi mới render Part.
- **Lưu mọi thứ vào folder tập**; không để tệp rải rác. Ghi license vào `assets-licenses.md`.
- Dùng task list; báo cáo trung thực những gì chưa kiểm chứng.

## Phụ thuộc cần có (kiểm tra khi bắt đầu)
Plugin `youtube-agent`, `lemo-opuscar` (kèm Kokoro, faster-whisper); Node; ffmpeg; Python 3.11+ hoặc `uv`. Nếu thiếu → cài/hỏi trước khi làm.
