# EP001 — voice QC, cả tập (2026-11-05)

Engine/giọng: Kokoro `bm_george`, en-gb, offline. Tốc độ mặc định 0,78. Biến thiên theo đoạn trong ±15%: 0,72–0,82 (xem `lines.json` mỗi Part). Đọc theo đoạn văn (51 line). Chưa mix nhạc/SFX, chưa chèn ngắt nghỉ theo file 02 (bản nháp dùng ngắt cố định 1,0 s giữa các đoạn).
Cách đọc tên trong text TTS: Mehmed → "Meh-met"; Giustiniani → "Joostinyahnee". Các tên khác giữ nguyên chính tả.

| Chỉ số | Kết quả | Gate | Đạt? |
|---|---|---|---|
| Tổng lời (51 line, 4.220 từ) | 31,71 phút lời thuần; ≈32,6 phút với ngắt 1,0 s | ≥20 phút, mục tiêu 30–45 | ✓ |
| Nhịp trung bình | 133 wpm (P1 130 · P2 136 · P3 135), **chưa tính** ngắt nghỉ | 135–150 wpm **có tính ngắt nghỉ** | ✗ thấp ~5–8% |
| Nhịp từng đoạn | 110 (L06) … 152 (L33b) wpm | không đoạn >155 | ✓ (sau retake) |
| Cao độ (ước lượng bằng tự tương quan, median mỗi line) | 139 Hz; lệch −0,30…+0,20 st | ±1,5 st | ✓ |
| Loudness mỗi line (ebur128) | median −21,8 LUFS; lệch −0,40…+0,40 LU | ±1,5 LU | ✓ |
| Whisper (base.en) | mọi lệch là số/định dạng hoặc tên riêng; không thiếu/thừa nội dung (L09, L15, L27, L34: Whisper bỏ mệnh đề, kiểm lại không điều kiện hóa → đủ lời) | khớp từng chữ trừ số | ✓ có chú thích |
| Pace giữa các Part | 130/136/135 wpm | ±15% | ✓ |

**Retake:** L31 (0,72), L36 (0,73), L38 (0,73), L45 (0,74) vì >155 wpm ở lượt đầu (159/157/157/155 wpm).

**Hạn chế phép đo:** cao độ do tôi ước lượng bằng numpy (không có công cụ `voice_qc` trong lemo-opuscar); thang này dùng để bắt lệch lớn giữa các đoạn, không thay tai nghe. Loudness đo trên từng file thô, chưa qua chain master −14 LUFS.

## Tên riêng cần tai người nghe
Whisper nghe lệch (chưa chắc TTS đọc sai): Genoese ("genos"), Palaiologos, Mesoteichion ("mesotician"), Gennadius, Akshamsaddin, Orhan ("orhen"), Bosphorus, Boghaz-kesen, Sphrantzes/Phrantzes ("francis"), Baltoghlu ("bolterglue"), Critobulus ("cretobulus"), Mytilene, Kerkoporta ("kirkaporter"), Bocchiardi, Runciman, Chios ("shios"), Hagia ("hadja"), Isidore, Mesih. Cần nghe `part{n}-draft.mp3`.

## Việc còn lại
1. Bạn nghe 3 bản nháp (`part1/part1-draft.mp3`, `part2/…`, `part3/…`) và đánh dấu mm:ss những chỗ tên sai/nhịp lạ.
2. Quyết định nhịp: giữ 0,78 (≈133 wpm trước khi thêm ngắt) hay tăng.
3. Mix: ngắt nghỉ theo file 02, nhạc "Teller of the Tales" (−22 dB, ducking), SFX; đo lại wpm thực.
4. Cắt theo ranh giới Part; xuất word timings (`words.json`) cho phụ đề và shot script.

---

# Mix (music + SFX) — 2026-11-05 (`mix.py`, bản nghe thử, SFX tạm)

Nhạc: **một track duy nhất, lặp** — "Teller of the Tales" (Kevin MacLeod, CC BY 4.0), đã được duyệt trong music palette; lấy từ kho `pilot-1453/assets/audio/music/` (đã tải qua stock-audio ở pilot) và copy sang `assets/audio/music/`. Mỗi Part `fit` bằng `stock_audio.py fit` (crossfade-loop 4 s, fade-in 1,5 s, fade-out 3 s) với điểm bắt đầu khác nhau: P1 0 s · P2 64 s · P3 128 s. EQ: high-pass 120 Hz, khoét −3 dB ở 1–4 kHz, low-pass 12 kHz. Mức nhạc −14 dB so với RMS giọng trong khoảng nghỉ, ducking thêm −8 dB khi giọng nói (release 0,6 s).
Ngắt nghỉ: mặc định 1,0 s giữa các đoạn; trước twist 1,2–1,6 s; 0,6 s trước L19 và L35 (soft seam, sát cuối Part); lead-in P1 3,0 s (cold open có nhạc), P2/P3 1,2 s; đuôi 2,4 s mỗi Part.
SFX: **chỉ P1 và chỉ là foley tạm** đặt theo shot script (bút/burin, lật tờ, kính lúp, đồng hồ) từ Mixkit qua stock-audio (không cần credit); P2/P3 chưa có shot script nên chỉ có giọng + nhạc + tiếng phòng rất nhỏ. Sẽ đặt lại theo `events.json` khi có hình.

| Part | Thời lượng | Master | Giọng (stem) | Nhạc dưới giọng | Chênh | Whisper trên bản mix | Whisper trên giọng khô |
|---|---|---|---|---|---|---|---|
| 1 | 11,97 phút | −14,0 LUFS | −15,3 | −36,5 | **21,2 LU** | 0,971 | 0,967 |
| 2 | 9,87 phút | −14,0 LUFS | −15,1 | −36,3 | **21,2 LU** | 0,960 | 0,961 |
| 3 | 10,93 phút | −14,0 LUFS | −15,4 | −36,3 | **20,9 LU** | 0,968 | 0,965 |
Gate file 10: chênh ≥14 LU ✓ (mục tiêu 20–24 dB ✓); Whisper trên mix **bằng** trên giọng khô (khác ở tên riêng/số, nhạc không làm mất chữ) ✓; master −14 LUFS ✓.
**Chưa kiểm:** nghe trên loa laptop và điện thoại ở âm lượng thấp (cổng bắt buộc theo file 10; cần tai bạn); đo true peak của bản mp3; SFX chưa khớp hình.
