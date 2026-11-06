# 14 — Style theo TỪNG TẬP + thư viện mẫu + chọn giọng nhân vật

> Quyết định người dùng (2026-11-06): **style hình ảnh chỉ khóa cho MỘT video, không khóa cho cả dự án.** Folder này là *template + bộ luật chung*; mỗi câu chuyện lịch sử là một sản phẩm riêng, có style riêng. Cái gì khóa cho cả kênh: **giọng người kể**, tông/hóm hỉnh, quy trình, cổng chất lượng, nhạc chính, luật nguồn/bản quyền.

## 1. Cổng "Chọn style" (★ bắt buộc ở đầu mỗi tập, ngay sau brief)
1. Agent trình bày **thư viện mẫu** (bảng dưới) kèm clip/ảnh mẫu thật để người dùng xem (gửi file bằng SendUserFile hoặc mở ảnh). Với style mới: dựng mẫu ≤40 s trên đoạn mở bài của tập đó.
2. Người dùng chọn style → ghi vào `brief.md` mục **Style** + dòng trong Decision log (file 01) + `episodes/EPxxx/STYLE.md` (palette, font, camera, mẫu mở đầu, khung SFX).
3. Không dựng gì trước khi style được chọn. Không áp style tập trước cho tập sau nếu chưa hỏi.

## 2. Thư viện style (mẫu có sẵn trong `episodes/EP001-fall-of-constantinople/styletest/`)
| Style | Mẫu | Hợp với | Ghi chú dựng |
|---|---|---|---|
| **Low-poly Isometric Island (3D)** (từng chọn cho EP001, sau đó đổi sang Pop-up 2026-11-06) | `lowpoly/` + `TEST_lowpoly.mp4` | chiến trận, thành phố, đế chế, nhiều nhân vật nhỏ | three.js, camera isometric; render nặng (~5–6 phút/36 s ở SSAA 1.5) |
| **Paper Pop-up Book** — **chọn cho EP001 (2026-11-06)** | `popup/` + `TEST_popup.mp4` | câu chuyện cổ tích-hóa, hoàng gia, thần thoại, cảm giác "sách kể chuyện" | Cảnh mở đầu riêng, xem mục 3 |
| **Picture Book (tranh minh họa)** | `picturebook/` + `TEST_picturebook.mp4` | nhân vật/đời sống, ấm áp | render nhanh (~79 s/36 s) |
| **Paper-cut (giấy cắt)** | `papercut/` + `TEST_papercut.mp4` | cổ tích, phương Đông | người dùng đánh giá chưa ưng ở lần thử |
| **Woodcut (khắc gỗ)** | `woodcut/` + `TEST_woodcut.mp4` | trung cổ, nghiêm | người dùng chưa ưng |
| **Engraving + Archive Light Table** (cũ) | `pilot-1453/`, `plan/` | tài liệu, tư liệu thật | bị đánh giá nhiều chữ, ít hình |
| *Cartoon "nhân vật búp bê" 2D (kiểu video tham khảo)* | khung trong `knowledge/assets/ref-frames/` nếu có | kịch nhiều nhân vật, thoại | mẫu *chưa* dựng bằng code |
Mọi mẫu mới sau này: thêm một dòng vào bảng + lưu thư mục mẫu.

## 3. Mẫu mở đầu riêng của từng style
- **Paper Pop-up Book:** *khung chính diện phóng to cho đầy khung (không lộ góc sách/bàn) để không lãng phí diện tích; chỉ cảnh mở đầu và vài cảnh thiết lập mới lộ cả quyển sách trên bàn.* Cảnh đầu = **mở sách** (người dùng chốt 2026-11-06): quyển sách khép trên bàn → bìa mở → các trang bật lên thành cảnh; sau đó tiêu đề tập + giới thiệu ngắn rồi mới vào lời kể. Phần mở này có thời lượng riêng (≈10–20 s) và có SFX riêng (giấy, lật trang). *(Ghi chú: các ý "màn hình/laptop" ban đầu đã được người dùng sửa thành "mở sách".)*
- **Style khác:** mỗi style định nghĩa một "cold-open frame" trong `STYLE.md` (vd. camera bay vào đảo với low-poly; chương mở trang với picture book).

## 4. Thiết kế nhân vật & kiến trúc theo style
`bible.md` (file 13, mục 5) phải có model sheet **trong style của tập**: render ảnh nhân vật (đứng, mặt các biểu cảm chính, silhouette), ảnh kiến trúc chính. Người dùng duyệt ảnh trước khi dựng cảnh. Nhân vật nhất quán trong cả tập (luật 3 cũ nay áp dụng *trong tập*).

## 5. Chọn giọng (voice casting)
- **Người kể: khóa cho cả dự án** — Kokoro `bm_george`, en-gb, **tốc độ mặc định 0.80** (khoảng 0.76–0.84 theo từng đoạn, trong ±15%). Không đổi giữa các tập.
- **Mỗi nhân vật: một giọng Kokoro riêng, khóa trong phạm vi tập**, không trùng người kể, dễ phân biệt khi che tên: ví dụ họ giọng `bm_*` (Anh nam: george/lewis/daniel/fable), `am_*` (Mỹ nam), `bf_*` (Anh nữ), `af_*` (Mỹ nữ). Phân biệt thêm bằng tốc độ (0.85–1.0) và độ chậm dứt khoát. Danh sách giọng thực tế: chạy `core/tts/tts.py` thử mẫu, ghi lựa chọn vào `bible.md`.
- Mẫu nghe thử mỗi giọng nhân vật (1 câu đặc trưng) trình người dùng duyệt **trước** khi thu cả tập.
- Giọng nhân vật chỉ nhất quán trong tập đó; tập khác có thể chọn lại.
- Thu theo đoạn thoại (một cảnh = vài line ngắn); nối bằng khoảng lặng ngắn (0.15–0.35 s giữa các câu thoại, ngắt lời cho tự nhiên). Gate voice_qc áp riêng cho từng nhân vật.
- `asr_check` + word timings giữ nguyên quy trình; thêm nhãn người nói vào `lines.json` (`speaker`).

## 6. Thay đổi so với luật cũ
- Luật cũ "một style cho cả kênh" → **một style cho mỗi tập**.
- Luật cũ "một giọng cho cả video" → **người kể một giọng cho cả dự án; nhân vật có giọng riêng trong tập**.
