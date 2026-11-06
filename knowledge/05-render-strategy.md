# 05 — Chiến lược render theo Part & ghép CapCut

Video 30–45′ render một lần rất lâu, dễ hỏng, khó sửa. → **Chia thành Part độc lập (8–12′), render riêng, người dùng ghép CapCut.**

## Nguyên tắc chia
- 20′ → 2 Part · 30′ → 3 Part · 40–45′ → 4 Part (mỗi Part ≤12′, lý tưởng 8–10′).
- Cắt tại **ranh giới chương** (cliffhanger hoặc kết cảnh), không giữa câu/đoạn. Cold open nằm trong Part 1; outro nằm trong Part cuối.
- Mỗi Part là đơn vị **sửa/render lại độc lập**: lỗi ở Part 2 chỉ render lại Part 2.

## Thông số kỹ thuật KHÓA (mọi Part, mọi tập — để ghép không lệch)
- Độ phân giải **1920×1080**, **30 fps**, codec H.264, yuv420p, màu sRGB/Rec.709, bitrate ổn định (~12–16 Mbps).
- Âm thanh **48 kHz, stereo, -14 LUFS** từng Part (cùng chain master). Cùng giọng đọc, cùng mức nhạc nền (nhạc -22 đến -26 dB dưới thoại, ducking).
- **Handle:** mỗi Part có 0.5s hình đệm đầu và cuối; **không** fade-to-black đã nướng ở biên (để người dùng chuyển cảnh trong CapCut). Âm thanh có đuôi tự nhiên 0.4s (không cắt cụt).
- **Soft seam:** cuối Part không kết bằng "see you next time"; đầu Part tiếp theo không recap dài. Biên nằm ở nhịp thở tự nhiên (~1s lặng) để ghép liền.
- **Nhạc:** dùng cùng bed trong 1 tập; nếu đổi theo Part, kết thúc/bắt đầu có đuôi 2s để crossfade ở CapCut.

## Đặt tên & manifest
`parts/EPxxx-P1.mp4`, `EPxxx-P2.mp4`… + `parts/manifest.md` (từ `templates/part-manifest.md`): thứ tự, thời lượng, từ-đầu/từ-cuối câu, chương nằm trong Part, LUFS đo được, ghi chú ghép (vd. "crossfade 0.5s ở P2→P3").

## Số đo thực tế (pilot 1453, 2026-11-05, máy của người dùng)
- Render hình 1080p/24fps, 2 worker: **42.7 giây phim ≈ 104 giây render (~2.4× thời gian thực)**. Ngoại suy: Part 10 phút ≈ 25 phút nếu cảnh phức tạp như pilot; cảnh nặng hơn (nhiều roundel/khắc dày) có thể chậm hơn → thử `--workers 3`.
- Phần dựng giọng + mix + mux ≈ dưới 1 phút cho 42 s.
- **Cập nhật 2026-11-06:** EP001 (Pop-up) render 24 fps, 1920×1080, grain 0, `LEMO_COLOR=bt709`, mux −14 LUFS; Part 1/2/3 ≈ 11,2 / 8,9 / 7,9 phút; render ≈ 45 phút/Part (3 worker). **Quy trình tự động:** `output/EP001-.../tools/pipeline.sh`.
- **Lưu ý fps:** thư viện mặc định 24 fps (pilot dùng 24); tài liệu trên ghi 30 fps khóa → thống nhất: **chọn một fps cho cả kênh** (đề xuất 24 để render nhanh hơn 20% và hợp phong cách khắc/archive) và ghi vào Decision log. Pilot hiện tại: 1920×1080, 24 fps, -14 LUFS.

## Quy trình render hiệu quả
1. **Pilot 30–60s** → duyệt style/giọng.
2. Ghi âm **toàn bộ narration trước**, đo voice_qc, cắt theo ranh giới Part → có độ dài chính xác từng Part trước khi dựng hình.
3. Dựng & render **Part 1 → duyệt → Part 2…** (hoặc chạy song song nếu máy đủ; sau khi duyệt style từ Part 1).
4. Cache asset (ảnh/font/bản đồ) dùng chung toàn tập; render bằng nhiều luồng (Remotion `--concurrency`); chạy nền, không chờ tương tác.
5. Kiểm tra mỗi Part: thời lượng khớp audio, không khung đen, nhạc/giọng không clip, LUFS đúng. Xem vài khung mẫu + đoạn nối.
6. Giao người dùng: các file Part + manifest + hướng dẫn ghép (thứ tự, crossfade gợi ý).

## Hướng dẫn ghép CapCut (đưa cho người dùng)
Kéo Part theo thứ tự → đặt crossfade 0.3–0.5s (hoặc nối thẳng) → kiểm tra mức âm lượng ở biên → xuất 1080p/30fps, H.264, bitrate cao → upload. Chapters/timestamps lấy từ `yt-chapters` (tính lại theo thời lượng thật sau ghép).

## Dự phòng
Máy yếu/tập quá dài → giảm còn 1080p@24fps hoặc chia Part 6–8′; không giảm chất lượng giọng. Luôn giữ bản voice + shot script để render lại.
