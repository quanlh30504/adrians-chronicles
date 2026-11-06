# 07 — Checklist chất lượng (cổng giao tập)

## A. Script
- [ ] ≥2.800 từ (chuẩn 4.200+); thời lượng ước tính ≥20′ (mục tiêu 30–45′)
- [ ] Cold open ≤60s, có câu hỏi/nghịch lý mở; không "In today's video…"
- [ ] 5–8 chương, open loop giữa chương, re-hook ~25/50/75%
- [ ] Đúng giọng (file 02): hóm hỉnh nhẹ ≤1/60–90s, nhịp câu xen kẽ, không đều đều, không giảng đạo
- [ ] Mọi ngày/số/trích dẫn có nguồn trong research.md; sự thật ≠ giả thuyết ≠ truyền thuyết được phân biệt
- [ ] Chủ đề nhạy cảm: nhiều góc nhìn, không giễu nạn nhân
- [ ] Đã chạy `yt-script` + `yt-retention`; ranh giới Part đánh dấu ở cuối chương

## A2. Dựng cảnh & nhân vật (file 13)
- [ ] Mỗi chương ≥1 cảnh thoại; mỗi Part ≥1 cảnh điều tra/đối đầu; tỷ lệ thoại ≈40–50%
- [ ] Mỗi nhân vật có giọng nói phân biệt khi che tên; có `bible.md` + model sheet đã duyệt
- [ ] Nhịp hài/biểu cảm mỗi 60–90 s (trừ cảnh bi); số lớn có phép so sánh đời thường; hỏi–đáp giải thích mỗi chương
- [ ] research.md có bảng "Cảnh dựng" nhãn DOC/RECON/FICT; FICT không đổi sự kiện/số liệu; trích dẫn thật nói rõ là thật
- [ ] Style của tập đã được người dùng chọn sau khi xem mẫu (file 14)
- [ ] Video KHÔNG tuyên bố "tôi bịa nhân vật"; FICT dựng như người điển hình; thoại RECON có khung "imagine/probably"; mô tả + pinned comment có dòng báo dựng lại/hư cấu (file 13 §4)

## B. Giọng đọc
- [ ] Đúng voice profile đã khóa, không đổi engine/cài đặt
- [ ] Tốc độ 135–150 wpm trung bình, không đoạn >155 wpm; có nhịp ngắt theo file 02
- [ ] voice_qc: pitch ±1.5 st, loudness ±1.5 LU, pace ±15%; master -14 LUFS
- [ ] Nghe thử đoạn nối giữa các Part: cùng âm sắc

## B2. Nhạc nền (file 10)
- [ ] Nhạc từ music palette đã duyệt, lấy qua stock-audio; thấp hơn giọng 20–24 dB, có ducking, chênh LUFS ≥14 LU
- [ ] Whisper trên bản mix cuối nhận đúng lời; đã nghe thử trên loa laptop và điện thoại

## C. Hình ảnh & dựng
- [ ] `check_subsync.py` PASS: chữ và nền phụ đề fade cùng nhau (file 11)
- [ ] Đúng style/palette/font đã khóa; nhân vật dẫn (nếu có) đúng model sheet
- [ ] Mỗi câu/đoạn có hình khớp nội dung; bản đồ/timeline cho đoạn phức tạp
- [ ] Chữ trên màn hình đọc được trong 1s, ít chữ; không khung đen/lỗi
- [ ] Thông số 1080p/30fps, handle 0.5s, không fade nướng ở biên Part
- [ ] Tư liệu/nhạc có license rõ trong `assets-licenses.md`; SFX/nhạc lấy qua `stock-audio` (credit Incompetech nếu dùng)
- [ ] Chữ trên hình đúng hệ font khóa (Playfair / Source Sans 3 / Lora), phụ đề Lora 600 ≥34 px, nhãn ≥15 px, không Pinyon/Bodoni; chữ trên nền tối tương phản đủ
- [ ] `research.md` ≥8 nguồn; mọi số liệu/ngày đã kiểm chéo (file 09)

## D. Đóng gói & đăng
- [ ] Mô tả + pinned comment có dòng: "Some scenes are dramatized reconstructions. Dialogue is imagined to illustrate real events; characters such as … are fictional composites. Dates, numbers and outcomes follow the sources listed."
- [ ] Mô tả có dòng credit nhạc: `Music: "Teller of the Tales" by Kevin MacLeod (incompetech.com), Licensed under Creative Commons: By Attribution 4.0 (https://creativecommons.org/licenses/by/4.0/)` (+ mọi track Incompetech khác đã dùng)
- [ ] `yt-package`: title ≤60 ký tự trung thực, thumbnail brief, mô tả, tags, chapters (tính lại theo thời lượng ghép), pinned comment
- [ ] `yt-seo` đã tối ưu; end screen/card gợi ý video kế tiếp
- [ ] Shorts kế hoạch (`yt-shorts`)

## E. Sau đăng
- [ ] 48h/7 ngày: `yt-audit` (CTR, retention, điểm rơi) → ghi bài học vào Decision log (file 01) và cập nhật file 02/03 nếu cần

## C2. Ảnh nhập từ bên thứ 3 (file 16)
- [ ] Mỗi ảnh: nền sạch sau khi cắt, đủ biến thể (miệng đóng/mở), không cắt cụt, đủ độ phân giải, đúng style/màu bible, license ghi trong `assets-licenses.md`
- [ ] Hình đã qua contact sheet storyboard (file 15) trước khi render dài
