# EP001 — HANDOFF (đọc đầu phiên sau khi compact) · cập nhật 2026-11-05

## Trạng thái
- Chủ đề: **The Fall of Constantinople (1453)**, góc "ba nghi phạm → một chuỗi nhân quả" (cannon · Kerkoporta · vết thương Giustiniani). 3 Part, 4.220 từ, ≈32 phút.
- Xong: `brief.md`, `research.md` (nguồn: Pears 1903 + Runciman 1965/1990 + WHE + Wikipedia; **cổng nguồn đã được người dùng chốt ở mức này**, 1/3 sách hiện đại), `script.md` (đã duyệt), `assets-needs/licenses.md`, `archive/` (19 tư liệu PD/CC0, 32 MB), `shots/part1-shots.md` + storyboard 11 khung, giọng **Kokoro bm_george 0,78** cả 3 Part (`audio/part{1,2,3}`, QC trong `audio/QC.md`), mix 3 Part (`mix.py` → `audio/mix/part{n}-mix.wav`, −14 LUFS, nhạc "Teller of the Tales" −21 LU dưới giọng), **Part 1 đã render: `parts/EP001-P1.mp4`** (11:58, Rec.709, 24 fps, 3,25 Mbps) + `parts/manifest.md`.
- Chưa có: plan cảnh + render Part 2, 3; `readcheck`; SFX khớp hình; nghe trên loa laptop/điện thoại; người dùng chưa xem liền mạch P1.
- Pipeline: `tools/align.py <proj> <n>` (timing câu/phụ đề từ voice) → `plan/part<n>.json` (cảnh theo câu) → `film.js` (engine) → `node core/render/video.mjs` (3 workers, ≈810 s cho P1) → `LEMO_COLOR=bt709 sh core/render/mux.sh`. Cổng: `tools/check_subsync.py <proj> <n>`.
- Thư viện: `~/lemo-opuscar` (LIB), Python venv `.venv/Scripts/python`; Git Bash cần `export MSYS_NO_PATHCONV=1 PYTHONUTF8=1`. Đường dẫn có dấu ’ → luôn đặt trong dấu nháy kép, dùng mảng bash cho nhiều file.

## Phản hồi của người dùng sau khi xem P1 (cần xử lý)
1. **Quá nhiều chữ, ít hình minh họa/animation, cảnh lặp (nhất là cảnh 1 city plate)** → cần nhiều hình minh họa hơn, sinh động, lôi cuốn.
2. **SFX lệch toàn bộ so với hình.** Nguyên nhân thật (đã xác minh trong `mix.py`): foley chỉ là **tiếng nét khắc rải ngẫu nhiên theo thời gian của từng đoạn lời** (`rng.exponential`, ~1,1 nét/giây), **không gắn với sự kiện hình**; `film.js` trả `EV: []`. KHÔNG phải do render dài. Cách sửa: xuất `EV` từ mỗi cảnh (nét mực đang cắt, chuyển cảnh, loupe) → `events.mjs` → đặt SFX từ `events.json`.
3. **Muốn đổi style sang thứ sinh động, nhiều hình/action hơn Copperplate Engraving.** Cần quyết định style mới (sẽ phải cập nhật `knowledge/02`, CLAUDE.md "Đã khóa", Decision log file 01).

## Hướng đề xuất (chờ người dùng quyết)
Giữ cố định: giọng, script, nhạc, nhịp Part, cổng chất lượng. Thay đổi: **ngôn ngữ hình ảnh** — nhiều hình minh họa (cảnh có nhân vật/chuyển động: đội quân hành quân trên bản đồ, tàu kéo qua đồi, đại bác bắn, cảnh Hagia Sophia đêm), tư liệu thật chuyển động (Ken Burns/parallax), giảm chữ (chỉ nhãn quan trọng), mỗi câu một hình khác nhau, SFX tạo từ sự kiện hình.


## CẬP NHẬT 2026-11-05 (sau thử style) — ĐỌC PHẦN NÀY TRƯỚC
- **Người dùng đã chốt style: Low-poly Isometric Island 3D.** knowledge/02, CLAUDE.md, Decision log (file 01) đã cập nhật. Part 1 Engraving cũ bị bỏ (giữ file làm lịch sử).
- Mẫu chuẩn: `styletest/lowpoly/` (three.js; `main.js` dựng bán đảo Constantinople, tường 3 lớp, Hagia Sophia, tàu, doanh trại, kỵ binh, sultan, cửa nhỏ; 7 cảnh cho 36 s đầu). Các bản thử khác (woodcut/papercut/picturebook/popup) và `TEST_*.mp4` chỉ để tham khảo.
- Render: `node core/render/video.mjs <proj> --fps 24 --workers 2` (36 s ≈ 5–6 phút), mux `LEMO_COLOR=bt709 sh core/render/mux.sh`. Đường dẫn Windows dạng `E:/Adrian’s Chronicles/...` (không dùng `/e/...` cho node).
- Việc cần làm: (1) tách mô hình thế giới thành module dùng lại + `plan/part<n>` cho 3 Part (mỗi câu một cảnh khác nhau, camera chuyển động, ít chữ); (2) xuất `window.EV` từ cảnh → `events.mjs` → `events.json` → `mix.py` đặt SFX theo sự kiện (bỏ foley ngẫu nhiên); (3) làm lại nhân vật (sultan, Giustiniani, kỵ binh) và bản đồ cảnh Part 2–3 (tàu qua đồi, đại bác, Kerkoporta); (4) render P1→duyệt→P2→P3; cổng check_subsync (cần chỉnh cho phụ đề mới), readcheck, nghe loa, bitrate/fps.

## CẬP NHẬT 2026-11-06 (sau khi người dùng đưa yêu cầu mới + 2 video tham khảo)
- Dự án = TEMPLATE; style chọn theo từng tập (file 14); kịch bản dựng cảnh có nhân vật + thoại (file 13); giọng người kể bm_george @0.80; nhân vật giọng riêng theo tập; Pop-up mở đầu = mở sách.
- Knowledge/CLAUDE.md đã cập nhật (xem Decision log file 01, dòng 2026-11-06).
- **Script EP001 viết lại từ đầu** (script.md v2). Bản cũ: `script-v1-narration-only.md`. **Audio/timing/plan cũ của EP001 (voice bm_george 0.78, audio/, timing/, plan/) đã LỖI THỜI** — thu lại sau khi duyệt script v2 + bible.md + nghe thử giọng nhân vật.
- Chờ duyệt: `bible.md` (nhân vật, giọng đề xuất, kiến trúc, nhãn DOC/RECON/FICT, ⚠ cần kiểm: Halil Pasha, chi tiết "giữ kín" census, câu "turban/mitre" của Notaras) và `script.md`.

## CẬP NHẬT 2026-11-06 (đêm) — chuyển sang PAPER POP-UP BOOK, dựng cả 3 Part
- Người dùng đổi EP001 sang **Paper Pop-up Book** (cảnh đầu = mở sách; khung chính diện phóng to, không lộ góc sách). Thư mục: `pu/` (Part 1), `pu2/`, `pu3/` (mỗi cái: index.html, main.js, scenes.js, art.js, timeline.json, events.json). Low-poly `lp/` bỏ.
- Script v2 (dựng cảnh có nhân vật; Dimitri & Stavros "người điển hình", không nói "bịa" trong video) ; giọng: người kể bm_george @0.80 + 11 giọng nhân vật (khóa trong `tools/build_lines.py`).
- Voice: `audio/v2/part{1,2,3}/` (wav theo dòng + lines.json); mix: `tools/mix_part.py N` → `audio/v2/mix/partN-mix.wav` (−14 LUFS); SFX Mixkit trong `assets/audio/sfx/` (đã được người dùng cho phép tải).
- Pipeline tự động: `tools/pipeline.sh` (render 24 fps → mix → mux → full cut `parts/EP001-FULL.mp4`), log: `pipeline.log`.
- Cần người dùng nghe: giọng nhân vật; kiểm bảng ⚠ trong bible (Halil, census, câu Notaras); credit nhạc trong mô tả; dòng báo "dramatized" trong mô tả/pinned comment.
