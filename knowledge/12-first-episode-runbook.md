# 12 — Runbook: cách làm một tập (dùng cho EP001 và mọi tập sau)

Nguyên tắc vận hành: **bạn duyệt ở các cổng (★), agent làm phần còn lại**. Mỗi tập là một thư mục `episodes/EPxxx-slug/`. Agent không chuyển sang bước sau khi cổng ★ trước chưa được duyệt.

## Việc cần biết trước khi bắt đầu (trung thực về hiện trạng)
- **Đã chạy ổn:** giọng (Kokoro `bm_george`), hệ font, style khắc + archive light table, SFX/nhạc (stock-audio), mix + kiểm bằng Whisper, render theo Part, cổng `check_subsync`. Bằng chứng: `episodes/pilot-1453/` (42 s).
- **Chưa có (sẽ phải xây trong EP001):**
  1. Pilot là một cảnh viết tay 42 s. Tập 30–45 phút cần **bộ cảnh dùng lại được + dựng theo dữ liệu** (kịch bản chia chương → danh sách cảnh → render từng Part). EP001 sẽ vừa là video vừa là lúc xây "episode engine" từ `pilot-1453`.
  2. **Chân dung/người/đám đông**: style khắc hiện chỉ vẽ tốt bản đồ, kiến trúc, vật thể. Cần công cụ `engrave-from-image` (khắc từ tranh PD thật) — backlog ở file 09. Trước khi có, chân dung được đưa bằng cảnh **archive light-table** (tranh thật) chứ chưa khắc.
  3. Công cụ tìm tư liệu hàng loạt (`fetch_assets.py`) chưa viết; hiện tìm bằng WebSearch + Commons API từng phần.
- **Thời gian ước tính EP001 (30 phút phim):** nghiên cứu + script ~1 phiên làm việc; shot script + xây cảnh/engine ~2–4 phiên; voice + mix ~1 phiên; render ~25 phút/Part × 3 Part (chạy nền); ghép CapCut do bạn. Những con số này là ước tính, sẽ hiệu chỉnh sau tập đầu.
- **Nhạc nền:** mặc định dùng **một track duy nhất và lặp lại** (quyết định của người dùng 2026-11-05): "Teller of the Tales". Xem file 10.

## Quy trình theo cổng
**0. Kiểm tra môi trường** (đầu mỗi phiên trên máy mới) — file 00; chạy lại `episodes/pilot-1453/build.sh` nếu nghi ngờ.

**1. Chọn chủ đề + brief ★**
- Nói với agent: *"Đề xuất 5 chủ đề cho tập 1, chấm điểm theo file 03, ưu tiên chủ đề nhiều tư liệu public domain."* Agent dùng `yt-viral` + `yt-plan`, trả bảng chấm điểm (≥16/20, Chất liệu ≥4) và hỏi bạn chọn.
- Gợi ý tự nhiên cho EP001: **The Fall of Constantinople (1453)** — pilot đã có tư liệu, bản đồ, giọng và mở bài; nhưng chỉ nên chọn nếu bạn thích chủ đề, vì tập đầu cần hấp dẫn thật.
- Đầu ra: `episodes/EP001-slug/brief.md` (từ `templates/episode-brief.md`). **Bạn duyệt brief.**

**1b. Chọn style ★ (mới, mỗi tập)**: agent cho xem thư viện mẫu (file 14), người dùng chọn style cho tập này → `STYLE.md`.

**2. Nghiên cứu ★**
- Nói: *"Nghiên cứu EP001 theo file 09, lập research.md."* Agent: dàn ý chương, ≥8 nguồn (≥3 học thuật), bảng claim · nguồn · mức chắc, các tranh cãi (quân số, ngày, nguyên nhân).
- Đầu ra: `research.md`. **Bạn duyệt dàn ý chương và các chỗ gây tranh cãi** (ví dụ chọn cách nói con số).

**2b. Bible ★ (mới)**: `bible.md` — nhân vật (tính cách, cách nói, giọng), kiến trúc/đạo cụ, set list, cảnh dựng gắn nhãn DOC/RECON/FICT, gag/callback (file 13 §5). Bạn duyệt trước khi viết script.

**3. Kịch bản ★ (cổng quan trọng nhất)** — viết theo file 13 (cảnh có thoại, người kể nhập vai), không phải bài kể một giọng.
- Nói: *"Viết script EP001 theo voice bible (file 02), 30 phút."* Agent dùng `yt-script` → `yt-retention` → `yt-chapters`; script chia `=== PART n ===` theo chương, có hook, re-hook ~25/50/75%, ≥4.200 từ, tự kiểm với checklist A (file 07) và đọc lại bằng "test giọng điệu".
- Đầu ra: `script.md`. **Bạn đọc to một vài đoạn và sửa giọng điệu/độ hài trước khi sang bước 4.** Sửa script sau khi đã dựng hình rất tốn.

**3b. Nguồn hình vẽ ★ (file 16)**: agent hỏi từng nhóm (nhân vật/bối cảnh/đạo cụ/hiệu ứng) tự vẽ hay dùng prompt cho bên thứ 3; nếu prompt → `art-brief/` (STYLE LOCK, nền trắng, biến thể miệng, tên tệp); bạn dán ảnh về `art-in/`, agent tự đọc/cắt/đổi cỡ/báo lỗi.

**4. Tư liệu hình ★**
- Nói: *"Lập assets-needs.md và danh sách ứng viên tư liệu cho EP001."* Agent liệt kê nhu cầu hình theo chương, tìm ứng viên (Commons/LoC/Met/Rijksmuseum…), ghi licence + độ phân giải, **trình bạn danh sách + dung lượng để xin phép tải theo lô**.
- Đầu ra: `archive/` + `assets-licenses.md` + `FACTS.md` (claim ↔ nguồn). Chương nào thiếu tư liệu: agent đề xuất gộp, bản đồ vẽ code, hoặc đổi nội dung.

**5. Kịch bản dựng (shot script) + storyboard ★**
- Nói: *"Lên shot script cho PART 1 bằng lemo-opuscar và render storyboard 6–9 khung."* Agent viết `TREATMENT`/shot list bám từng câu của script, dựng cảnh bằng engine, render sheet khung chính.
- **Bạn duyệt storyboard của Part 1** (style, nhịp, chữ). Các Part sau dùng lại cùng bộ cảnh.

**6. Giọng**: agent chia script thành lines theo đoạn văn, `tts.py` (người kể bm_george speed ~0.80; mỗi nhân vật giọng riêng theo bible, thu theo cảnh có nhãn speaker), `asr_check`, đo wpm (mục tiêu 135–150), cắt theo ranh giới Part. **Bạn nghe 2–3 đoạn mẫu (bí ẩn, hài, kể) trước khi chạy cả tập.**

**7. Âm thanh**: SFX từ stock-audio (bảng ánh xạ ở file 08), nhạc "Teller of the Tales" lặp (file 10; `fit` crossfade-loop theo độ dài Part; đổi điểm bắt đầu giữa các Part để đỡ lặp lộ), kiểm LUFS gap ≥14 LU + Whisper trên bản mix.

**8. Render từng Part** (nền, ~25 phút/10 phút phim): cổng tự động trước khi giao: `check_subsync`, `readcheck`, blackdetect, -14 LUFS, Whisper. Agent giao `parts/EP001-P1.mp4…` + `manifest.md`. **Bạn xem từng Part rồi mới render Part tiếp theo** (lỗi style sửa ở Part 1 rẻ hơn nhiều).

**9. Bạn ghép CapCut** theo `manifest.md` (crossfade 0.3–0.5 s, kiểm âm lượng ở biên).

**10. Đóng gói ★**: `yt-package` + `yt-seo` + `yt-chapters` (tính lại theo thời lượng thật), thumbnail brief, mô tả có **credit nhạc** + nguồn tư liệu quan trọng, `yt-shorts` kế hoạch cắt. **Bạn duyệt title/thumbnail trước khi upload.**

**11. Sau đăng**: 48 h/7 ngày dán số liệu vào, `yt-audit` → ghi bài học vào Decision log (file 01) và cập nhật file 02/03.

## Cách nói chuyện hiệu quả với agent
- Mỗi lệnh nêu **mã tập + bước**: "EP001 bước 2: nghiên cứu".
- Muốn đổi quyết định đã khóa (giọng, font, style): nói rõ "đổi X", agent sẽ cập nhật knowledge + decision log.
- Gặp lỗi (chữ lệch, tiếng to…): mô tả triệu chứng + thời điểm (mm:ss); agent tìm nguyên nhân, sửa, và thêm cổng kiểm nếu chưa có (như `check_subsync`).
- Nếu một phiên bị ngắt: nói "tiếp tục EP001"; agent đọc `CLAUDE.md` → `episodes/EP001/` (brief/research/script/manifest) và tiếp tục từ cổng gần nhất.

## Thư mục tập chuẩn
```
episodes/EP001-slug/
  brief.md · research.md · script.md · FACTS.md · assets-needs.md · assets-licenses.md
  archive/            # tư liệu thật + archive.json
  shots/              # shot script mỗi Part
  audio/              # voice, stems, mix mỗi Part
  parts/              # EP001-P1.mp4 …  + manifest.md
  package.md          # title, mô tả, tags, chapters, credit, thumbnail brief
```
Khuôn code: copy từ `episodes/pilot-1453/` (index.html, film.js, engine/, fonts/, mix.py, build.sh, tools/).
