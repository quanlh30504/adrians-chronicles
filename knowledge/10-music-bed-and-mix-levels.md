# 10 — Nhạc nền: chọn bằng `/stock-audio`, tinh chỉnh để không át giọng

Mục tiêu: nhạc chỉ tạo không khí; **người xem luôn tập trung vào giọng kể**. Nếu phải chọn giữa "hay" và "không làm phân tâm" → chọn không làm phân tâm.

> **Quyết định (2026-11-05):** nhạc nền chính của kênh = **"Teller of the Tales" (Kevin MacLeod, Incompetech, CC BY 4.0)**. Mọi mô tả video dùng track này phải có dòng credit (xem `knowledge/assets/music-palette.md`). Các track bổ sung phải được người dùng duyệt riêng.

## 1. Chọn nhạc (luôn qua skill `/stock-audio`; cài skill theo file 08)
- Quy trình: tìm bằng `search` → lập **shortlist 3–5 ứng viên** (nguồn, tên, thời lượng, cần credit?, `preview_url`) → người dùng duyệt → `download` → `probe` → `fit`. Không tự chốt nhạc cho kênh khi chưa được duyệt.
- **Từ khóa tiếng Anh** (kết hợp 2–3): `medieval`, `lute`, `harpsichord`, `baroque`, `cello`, `viola`, `solo strings`, `ancient`, `mysterious`, `dark ambient`, `calm`, `cinematic ambient`, `documentary`, `historical`. Dùng `--no-credit` trước (Mixkit); mở rộng sang Incompetech (CC BY 4.0, bắt buộc credit) khi thiếu. Nguồn thủ công (Pixabay, Musopen, YouTube Audio Library) qua `manual-url` + `import`.
- **Tiêu chí nhận:** nhạc không lời; nhịp chậm (≈ 55–85 BPM) hoặc không nhịp (drone/pad); **không trống/bass nặng**; không giai điệu chính nổi trong dải giọng nói (300 Hz–3 kHz); ít biến thiên âm lượng; không tiếng cymbal/sáng gắt; vòng lặp nghe không lộ. Loại: nhạc hùng tráng/trailer, EDM, piano lãng mạn nổi giai điệu, bất kỳ track có "build-up" lớn.
- **Bảng nhạc của kênh ("music palette")**: chỉ 3–6 track đã duyệt, dùng xoay vòng để mọi tập cùng một "họ" âm thanh (nhất quán thương hiệu như giọng kể). Ghi vào `knowledge/assets/music-palette.md` (track, nguồn, id, credit, đã duyệt ngày nào, hợp cảnh nào: bí ẩn / bi kịch / kể chuyện). Track mới → cần người dùng duyệt rồi mới thêm.
- **Mặc định hiện tại (quyết định của người dùng, 2026-11-05): dùng MỘT track duy nhất ("Teller of the Tales") và lặp lại** cho cả tập. `stock_audio.py fit <track> <bed> --duration <độ dài Part> --fade-in 1.5 --fade-out 3` sẽ tự crossfade-loop. Để vòng lặp bớt lộ: đặt `--start` khác nhau cho từng Part, giữ nhạc ở mức thấp (file này), và để ý chỗ nối trong `probe` (tránh nối ở đoạn có giai điệu rõ). Thêm track khác chỉ khi người dùng yêu cầu (xoay vòng 2–4 track bằng `fit` + `acrossfade` là phương án nâng cấp, không bắt buộc).

## 2. Mức âm lượng (số cụ thể, để nhạc "nằm dưới" giọng)
| Thông số | Giá trị |
|---|---|
| Nhạc so với giọng khi có lời | **thấp hơn 20–24 dB** (stock-audio: `--music-db -22`; khoảng cho phép −26…−18). Mục tiêu đo được: **chênh lệch LUFS giọng − nhạc ≥ 14 LU** trên đoạn có lời |
| Ducking | sidechain **−8…−10 dB** khi giọng đang nói, release ~0.6 s; nhạc nhích lên ≈ −4 dB so với mức dưới giọng ở khoảng lặng ≥1 s để "thở" |
| Lọc | high-pass nhạc **~120 Hz**; **khoét nhẹ −3 dB quanh 1–4 kHz** (vùng rõ lời) bằng EQ; low-pass ~12 kHz nếu nhạc chói |
| Nén | không để nhạc có đỉnh bất ngờ: dùng limiter, loudness ngắn hạn ổn định (LRA nhạc < 6 LU) |
| Vào/ra | fade-in 1.5 s, fade-out 3 s; đuôi 2 s ở cuối mỗi Part để crossfade bên CapCut |
| Chỗ được to hơn | chỉ khi **không có lời**: cold-open 0–3 s, end card, 2 khoảnh khắc im lặng/nhạc nổi có chủ ý mỗi Part (≤ −10 dB so với mức chuẩn master) |
| Master | -14 LUFS (mux.sh); không nâng nhạc để "bù" |
Công cụ: `stock_audio.py fit` (chuẩn −16 LUFS, fade) rồi `mix` với `--music-db -22` (+ ducking mặc định), hoặc trong `mix.py` của project: nhạc → high-pass/EQ → side-chain theo envelope giọng (đã có mẫu ở `pilot-1453/mix.py`).

## 3. Kiểm tra (cổng bắt buộc trước khi giao Part)
1. **Whisper trên bản mix cuối** (`faster-whisper base.en`) phải nhận lại đúng lời kể (không mất/nhầm từ). Pilot đã làm bước này.
2. Đo trên stem: LUFS giọng vs nhạc (đoạn có lời) chênh ≥ 14 LU.
3. **Nghe thử trên loa laptop và điện thoại** ở âm lượng thấp: nhạc không "nhảy" ra khi giọng nghỉ giữa câu; câu cuối mỗi đoạn không bị nhạc nuốt.
4. Không có phần nhạc nào có giai điệu cùng quãng giọng chính (nếu nghe thấy "hát" cạnh lời → hạ thêm 3 dB hoặc đổi track).
Nếu fail → hạ nhạc thêm 2–3 dB hoặc đổi track; **không nâng giọng quá −14 LUFS master để cứu**.

## 3b. Kết quả thử thực tế (pilot 1453 v6, 2026-11-05)
- Cách chạy: `MUSIC=<file đã fit> OUT=<tên> python mix.py` (mẫu trong `pilot-1453/mix.py`): high-pass 120 Hz, khoét −3 dB 1–4 kHz (trừ 0.3× dải), low-pass 12 kHz; nhạc ở khoảng nghỉ = **−14 dB** so với RMS giọng, **ducking thêm −8 dB** khi giọng nói (attack 50 ms, release 0.6 s), dip thêm −9 dB ở khoảnh khắc im lặng trước loupe.
- Đo (đoạn có lời 4–36 s, giọng −15.0 LUFS): **Teller of the Tales −34.9 LUFS (chênh 19.9 LU)**, Sinfonia Number 5 −33.6 (18.6 LU), Staring at the Night Sky −34.4 (19.4 LU) → cả ba vượt ngưỡng ≥14 LU.
- Whisper trên bản mix cuối: **cả ba nhận đúng 100% lời** (SequenceMatcher = 1.0).
- Độ to gốc của các track chênh rất nhiều (probe: Teller −22.3, Sinfonia −14.3, Night Sky −10.6 LUFS) → **luôn `fit` (chuẩn −16 LUFS) và canh theo RMS giọng**, không đặt mức cố định cho mọi track. Teller of the Tales có độ to ổn định nhất theo thời gian (−23…−25 LUFS ngắn hạn), phù hợp làm nền dài.
- Chưa có: đánh giá bằng tai của người dùng (loa laptop + điện thoại) → cổng bắt buộc trước khi thêm vào music palette.

## 4. Ghi chép
Mỗi track dùng phải có trong `CREDITS.md`/`assets-licenses.md` (credit Incompetech vào mô tả video), `stock_audio_manifest.json` giữ nguyên làm nguồn sự thật. **Nhạc trong pilot 1453 là nhạc tự tạo bằng code, chưa phải nhạc stock-audio** → tập thật cần chọn từ music palette theo quy trình trên.
