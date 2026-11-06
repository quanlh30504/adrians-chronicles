# Music palette của kênh (nhạc nền đã được người dùng duyệt)

Quy trình: `knowledge/10-music-bed-and-mix-levels.md`. Bảng "Đã duyệt" chỉ ghi track người dùng đã nghe và đồng ý.

## Đã duyệt
| Track | Nguồn / id | Thời lượng | Credit? | Hợp cảnh | Ngày duyệt |
|---|---|---|---|---|---|
| **Teller of the Tales** (Kevin MacLeod) — nhạc nền CHÍNH của kênh | incompetech `USUAN1400020` | 212 s | **Bắt buộc** (CC BY 4.0): `Music: "Teller of the Tales" by Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 (https://creativecommons.org/licenses/by/4.0/)` — dán vào mô tả mọi video dùng nó | kể chuyện chính, bí ẩn–trầm lắng; độ to ổn định, hợp nền dài | 2026-11-05 |

**Quy định hiện tại (2026-11-05): mỗi tập dùng một track này và lặp lại** (crossfade-loop bằng `fit`), không cần thêm track. #2 và #4 đã tải/thử nhưng **chưa duyệt**, giữ lại làm dự phòng nếu sau này muốn xoay vòng.

## Đã tải và thử mix vào pilot (2026-11-05) — chờ người dùng nghe và duyệt chính thức
Tải trong `pilot-1453/assets/audio/music/` (+ `CREDITS.md`, `stock_audio_manifest.json`): **#1 Teller of the Tales (dùng cho pilot v6)**, **#2 Sinfonia Number 5**, **#4 Staring at the Night Sky**. Kết quả đo: xem file 10 mục 3b (cả ba chênh giọng/nhạc ≈19–20 LU, Whisper nhận đúng 100% lời). Bản nghe thử: `pilot-1453/out/audition/pilot_music_*.mp3`. Chưa ghi vào bảng "Đã duyệt" cho đến khi người dùng đồng ý.

## Shortlist ban đầu (tìm bằng `/stock-audio`, 2026-11-05)
Mixkit **không có** nhạc lute / harpsichord / baroque / medieval phù hợp (chỉ có "Condor", "Games Worldbeat" nhưng có percussion/nhạc vui). Vì vậy ứng viên đàn dây cổ điển nằm ở Incompetech (cần credit).

| # | Track | Nguồn / id | Dài | Credit | Nhạc cụ / tâm trạng | Nghe thử |
|---|---|---|---|---|---|---|
| 1 | **Teller of the Tales** (Kevin MacLeod) | incompetech `USUAN1400020` | 212 s | **CC BY 4.0** | lute + guitar; calming, mysterious, somber — hợp nhất với kênh | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Teller%20of%20the%20Tales.mp3 |
| 2 | **Sinfonia Number 5** (Kevin MacLeod) | incompetech `USUAN1100673` | 128 s | **CC BY 4.0** | harpsichord; dark, relaxed, somber (kiểu Bach) | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Sinfonia%20Number%205.mp3 |
| 3 | **Blue Feather** (Kevin MacLeod) | incompetech `USUAN1100524` | 278 s | **CC BY 4.0** | piano cổ điển; calming, dark, mysterious, somber | https://incompetech.com/music/royalty-free/mp3-royaltyfree/Blue%20Feather.mp3 |
| 4 | **Staring at the Night Sky** (Alejandro Magaña) | mixkit `168` | 142 s | không | cello + piano; mysterious, atmospheric | https://assets.mixkit.co/music/168/168.mp3 |
| 5 | **Selpan** (Eugenio Mininni) | mixkit `612` | 194 s | không | drone, eerie, documentary (có thể cần kiểm tra tiếng guitar điện/hiệu ứng) | https://assets.mixkit.co/music/612/612.mp3 |
| 6 | **Feedback Dreams** (Eugenio Mininni) | mixkit `588` | 149 s | không | ambient pad, documentary, ít giai điệu — nền an toàn cho đoạn dài | https://assets.mixkit.co/music/588/588.mp3 |

Dự phòng (không credit): Mixkit `545` Rebecca on the Shore (piano+strings, documentary, 112 s), `890` Unforgiven (drone, 134 s), `148` Forest Mist Whispers (piano/synth, 151 s).
Lưu ý: mỗi track chỉ 2–5 phút → video 30–45 phút cần xoay vòng ≥4 track (crossfade), không loop một track. Chưa kiểm tra bằng tai: cần nghe xem có giai điệu nổi/percussion ẩn; sau khi duyệt sẽ `download` → `probe` → `fit` và thử mix vào pilot theo file 10.
Credit nếu dùng Incompetech (dán vào mô tả video): "Music by Kevin MacLeod (incompetech.com), licensed under CC BY 4.0" kèm tên bài (lấy chính xác từ `attribution_text` khi `download`).
