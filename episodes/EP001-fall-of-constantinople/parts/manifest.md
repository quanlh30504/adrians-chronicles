# EP001 — parts/manifest.md

| Part | File | Thời lượng | Chương (script) | Từ đầu → từ cuối | LUFS | Ghi chú ghép (CapCut) |
|---|---|---|---|---|---|---|
| P1 | `EP001-P1.mp4` | 11:58 (718,4 s) | Ch.1–4: Cold open · The last Roman · The boy sultan · The gunfounder | "For more than a thousand years…" → "…you'll see why." | −14,0 (TP −1,1; LRA 2,7) | Kết bằng khoảng lặng ≈0,6 s + đuôi nhạc 2,4 s (soft seam). Part 2 mở bằng "The number was four thousand…": nối thẳng hoặc crossfade 0,3–0,5 s. |
| P2 | — chưa render | — | Ch.5–6 | — | — | chưa có plan cảnh; âm thanh đã mix (`audio/mix/part2-mix.wav`) |
| P3 | — chưa render | — | Ch.7–8 | — | — | chưa có plan cảnh; âm thanh đã mix |

## Thông số đo thật của EP001-P1.mp4 (2026-11-05)
1920×1080 · 24 fps · H.264 yuv420p, Rec.709 dải giới hạn (`LEMO_COLOR=bt709`) · AAC 48 kHz stereo · −14,0 LUFS · true peak −1,1 dBFS · bitrate tổng ≈3,25 Mbps.
**Sai khác so với thông số khóa file 05:** (1) **24 fps** thay vì 30 fps (đề xuất 24 fps đã nêu ở file 05, chờ ghi Decision log); (2) **bitrate ≈3,25 Mbps**, thấp hơn mức 12–16 Mbps (CRF 19 trên đồ họa tĩnh, chưa thấy mất chi tiết trên khung mẫu); (3) **handle 0,5 s hình đệm đầu/cuối: chưa có** (khung đầu là cold open ngay; khung cuối giữ tấm "THE COUNT" ~2,4 s với nhạc).

## Cổng chất lượng Part 1
| Cổng | Kết quả |
|---|---|
| Độ dài khớp audio | video 718,417 s · audio 718,399 s ✓ |
| Khung đen (blackdetect ≥0,5 s) | không có ✓ |
| −14 LUFS / TP ≤ −1 dB | −14,0 / −1,1 ✓ |
| `check_subsync` | PASS (24 phụ đề lấy mẫu, chạy trên bản trước 3 sửa nhỏ; cơ chế phụ đề không đổi) |
| Whisper trên bản mix (audio giống hệt trong mp4) | 0,971 (bằng giọng khô) ✓ |
| Chữ trên hình ≥15 px, đúng hệ font | nhãn ≥15 px, Playfair/Source Sans 3/Lora ✓ (xem bằng mắt 32 khung) |
| `readcheck` | **CHƯA CHẠY** (film.js chưa xuất `window.TEXTS`) |
| Nghe trên loa laptop + điện thoại | **CHƯA** (cần người nghe) |
| Xem liền mạch (nhịp, chuyển cảnh) | **CHƯA** (chỉ xem khung rời) |
