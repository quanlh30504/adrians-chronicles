# 16 — Cổng "Nguồn hình vẽ" (★) + chuẩn prompt gửi bên thứ 3 + nhập ảnh về

> Quyết định người dùng (2026-11-06): sau khi xong script + bible, **trước khi dựng đồ họa/storyboard**, agent phải **hỏi người dùng ai vẽ nhân vật/bối cảnh/đạo cụ**. Người dùng có thể mang prompt sang bên thứ 3 (công cụ AI/họa sĩ), rồi **dán ảnh về** để agent tự đọc, cắt nền, đổi cỡ, dùng. Áp dụng cho nhân vật, bối cảnh, đạo cụ, sự kiện/sự vật khác.

## 1. Câu hỏi cổng (★ bắt buộc, đặt ngay sau khi bible + script được duyệt)
Hỏi bằng AskUserQuestion, **theo từng nhóm tài sản** (có thể chọn khác nhau cho mỗi nhóm):
| Nhóm | Gồm | Lựa chọn |
|---|---|---|
| Nhân vật | người kể (nếu hiện), nhân vật chính/phụ, đám đông | **(A) Agent tự vẽ theo style bằng code** · **(B) Agent viết prompt, người dùng nhờ bên thứ 3 vẽ rồi dán về** · (C) Người dùng đã có ảnh sẵn |
| Bối cảnh | phông nền, tường/thành, nội thất, bản đồ | như trên |
| Đạo cụ/sự vật | pháo, tàu, cửa, thang, biểu tượng, logo… | như trên |
| Sự kiện/hiệu ứng | cháy, nổ, lễ hội, thời tiết, đám đông… | như trên |
- Nêu rõ **đánh đổi**: (A) nhanh, nhất quán tuyệt đối, nhưng hình đơn giản/hình học; (B) đẹp & nhiều chi tiết hơn, nhưng cần thêm vòng tay người dùng + nguy cơ lệch style/giấy phép; (C) nhanh nhất.
- Khuyến nghị mặc định: (A) cho đạo cụ hình học/bối cảnh; (B) cho nhân vật chính và cảnh "ăn tiền" nếu người dùng muốn chất lượng cao hơn. Hỏi 1 lần cho cả tập, ghi kết quả vào `bible.md` mục **Nguồn hình** (bảng: tài sản → A/B/C → trạng thái).
- Với (B): agent **xuất trọn gói** `episodes/EPxxx/art-brief/` (xem §3) và một danh sách đánh số; người dùng dán ảnh về theo mã.

## 2. Điều kiện chung BẮT BUỘC trong MỌI prompt (copy nguyên khối "STYLE LOCK" của tập vào đầu mỗi prompt)
1. **Cùng style cả video**: mở đầu bằng khối `STYLE LOCK` lấy từ `STYLE.md` của tập (tên style, chất liệu, độ dày viền, bảng màu mã hex, kiểu đổ bóng, mức chi tiết). Không đổi từ ngữ giữa các prompt. Kèm 1–2 ảnh tham chiếu (model sheet đã duyệt/ảnh mẫu style) và dòng "match the attached reference exactly".
2. **Nền trắng tinh để cắt**: "isolated on a pure flat white background (#FFFFFF), no gradient, no vignette, no floor, no cast shadow, no ground line, no reflections, no texture on the background, nothing else in the frame". Đổ bóng/hiệu ứng ghi riêng "soft shadow NOT included — I add it in the engine".
3. **Viền kín, tách nền rõ**: "clean closed outline, uniform paper-cut sticker border (white edge ~3% of height) around the whole silhouette" (hoặc theo STYLE); **không để chi tiết chạm mép ảnh**, chừa lề trống ≥8% mọi phía; **không** cắt cụt phần nào của vật thể (đủ từ đầu đến chân/ toàn bộ vật).
4. **Một vật/nhân vật một ảnh** (hoặc một lưới cố định, §4); không chữ, không logo, không watermark, không ký tên, không khung, không UI.
5. **Góc nhìn khóa**: nhân vật = chính diện phẳng 2D, đứng thẳng, tay buông (pose "A/neutral"), đầu thẳng, ánh mắt nhìn thẳng; vật = chính diện hoặc 3/4 nhẹ theo bảng bên dưới; **không** phối cảnh mạnh, không cắt cảnh.
6. **Tỉ lệ & độ phân giải mục tiêu**: yêu cầu ≥2048 px cạnh dài, PNG; **không bắt buộc đúng tỉ lệ** — agent tự xử lý (§5). Nhưng nên yêu cầu tỉ lệ gần với bảng cỡ ở mục 3.
7. **Màu & ánh sáng**: "flat even lighting, no strong highlights, no colored light spill", màu theo hex trong bible; **không** tông màu nền (colour cast) trên nền trắng.
8. **Biểu cảm/miệng** (nhân vật nói): yêu cầu **2 bản** — miệng đóng (closed) và miệng mở (open "ah"), **cùng khung, cùng tỉ lệ, chỉ khác miệng** (cơ chế mouth-swap của engine). Thêm bản biểu cảm khác (ngạc nhiên, giận, buồn) nếu bible cần.
9. **Tách phần di động (tùy chọn, nâng cao)**: cánh tay/đồ cầm tách thành mảnh riêng cùng nền trắng + vị trí khớp; nếu không đủ khả năng, ghi "single piece" và agent tự xử lý (chỉ bob/lắc cả tấm).
10. **Nhất quán qua nhiều ảnh**: yêu cầu ghi "same character as reference, same outfit, same face proportions"; với công cụ hỗ trợ seed/reference/character-ID → dùng cho cả tập.
11. **Giấy phép**: "original artwork, not imitating any living artist, no copyrighted characters" — người dùng chịu trách nhiệm về quyền sử dụng ảnh công cụ bên thứ 3; agent ghi nguồn/công cụ/ngày vào `assets-licenses.md`.
12. **Prompt phủ định (negative)**: `text, watermark, signature, frame, border box, background scene, floor, shadow on ground, gradient background, extra limbs, cropped, cut off, blurry, low resolution, photo, 3D render` (điều chỉnh theo style).
13. **Số lượng chính xác**: "exactly one character", "exactly N items" khi vẽ lưới.
14. **Tên tệp** do người dùng đặt theo mã trong brief (vd. `CH-03-mehmed-closed.png`) để agent ghép tự động.

## 3. Cấu trúc gói prompt agent phải xuất (`episodes/EPxxx/art-brief/`)
- `00-README.md`: cách dùng, khối STYLE LOCK, danh sách ảnh tham chiếu cần đính kèm, công cụ gợi ý, hạn chế, cách đặt tên tệp, cách dán về.
- `assets.csv`: mỗi dòng 1 tài sản — `id, loại(character|prop|set|fx), tên, cảnh dùng, cỡ mục tiêu (đơn vị so với khung), biến thể cần (closed/open/…), ghi chú lịch sử (nguồn tham khảo thật)`.
- `prompts/<id>.md`: **một prompt hoàn chỉnh bằng tiếng Anh** (dán thẳng vào công cụ), gồm: STYLE LOCK → mô tả nhân vật/vật (tuổi, trang phục, màu hex, phụ kiện, biểu cảm) → pose/góc → điều kiện §2 → negative prompt. Thêm 1 dòng "Historical accuracy notes" (nguồn tham chiếu thật, vd. "Mehmed II: green-and-gold turban, per Bellini portrait").
- **Nhóm prompt theo công cụ** nếu người dùng nói công cụ: ghi hậu tố cú pháp riêng (vd. tham số tỉ lệ, seed); khi chưa biết, viết trung lập.
- **Bối cảnh (set)**: thường gồm **các lớp tách rời** (nền xa, lớp giữa, lớp gần) — xuất mỗi lớp một prompt với nền trắng/nền trong, ghi **thứ tự lớp** và **tỉ lệ khớp nhau**; phông liền cho khung trước: nền không trắng được, ghi rõ "full-bleed background, no characters".
- Bảng cỡ gợi ý: nhân vật 2:3–3:5 (cao); đạo cụ lớn (tàu, pháo, tháp) 4:3–16:9; tường/panorama 3:1 (rộng); phông xa 16:9.
- **Thư mục nhập về**: `episodes/EPxxx/art-in/` (ảnh gốc, không sửa) → `art-cut/` (đã cắt) → `art-ready/` (đã đổi cỡ, đặt tên engine).

## 4. Nhập ảnh về: agent tự đọc → cắt → đổi cỡ → kiểm tra (người dùng chỉ việc dán/đặt file)
Quy trình `tools/ingest_art.py` (viết khi cần; dùng PIL/numpy/opencv hoặc rembg nếu có; **hỏi trước khi cài thư viện**):
1. **Đọc** mọi file mới trong `art-in/`: kích thước, định dạng, có alpha không, nền gần-trắng hay không (đo mép), có chữ/watermark (nghi ngờ nếu nhiều cạnh sắc ở góc), có bị cắt cụt ở mép không.
2. **Tách nền**: nếu nền trắng thuần → ngưỡng + flood-fill từ mép (giữ viền sticker trắng của vật: chỉ xóa vùng trắng **liên thông với mép ngoài**, không xóa trắng bên trong); nếu nền không trắng/gradient/có bóng → báo, thử `rembg`/GrabCut, đánh dấu **cần xem lại**. Làm mượt alpha 1–2 px, khử viền trắng thừa (decontaminate/erode 1 px), kiểm lỗ.
3. **Cắt sát (trim)** theo bbox alpha + lề đồng đều (vd. 4% cạnh dài); lưu anchor (chân/trọng tâm) theo quy ước: nhân vật = giữa đáy; vật = giữa đáy hoặc theo ghi chú.
4. **Đổi cỡ phù hợp video**: tính từ `assets.csv` (chiều cao mục tiêu theo đơn vị cảnh/phần khung); canvas chuẩn theo texture của engine (vd. ppm 4200–7000), **downscale bằng Lanczos**, không upscale >1.5× (nếu nguồn thấp hơn → báo cáo "độ phân giải thấp, có thể mờ khi zoom"); đảm bảo texture 2ⁿ khi cần; tạo mipmap cho mép sạch.
5. **Chuẩn hóa màu**: so mã màu chủ đạo với bible (ΔE); nếu lệch lớn → báo; **không tự đổi màu** thương hiệu nhân vật khi chưa hỏi; có thể cân bằng gamma/độ bão hòa nhẹ để đồng bộ với cảnh.
6. **Cặp miệng**: kiểm 2 bản closed/open cùng kích thước, căn theo điểm neo (so khớp phần giống nhau, chênh vị trí ≤2 px); nếu lệch → tự căn (phase correlation) hoặc báo.
7. **Kiểm nhất quán style**: so với model sheet/ảnh tham chiếu (độ dày viền, bão hòa, mức chi tiết); báo "lệch style" kèm so sánh cạnh nhau để người dùng quyết định giữ/vẽ lại.
8. **Xuất** `art-ready/<id>.png` + `art-ready/manifest.json` (id, cỡ gốc, cỡ sau, anchor, lề, cảnh dùng, cờ cảnh báo) + contact sheet để người dùng xem nhanh; ghi `assets-licenses.md` (công cụ bên thứ 3, ngày, ghi chú).
9. **Báo cáo**: bảng tài sản → OK / cần sửa (lý do: cắt cụt, nền bẩn, thiếu biến thể, lệch style, độ phân giải thấp, sai lịch sử) và **prompt chỉnh sửa** cho ảnh cần làm lại.
10. **Cổng trước khi dựng cảnh:** mọi tài sản của cảnh phải ở trạng thái OK hoặc có phương án thay (A: agent vẽ code).

## 5. Quy tắc tự động hóa & đoán nhận
- **Không giả định kích thước**: ảnh người dùng dán về có thể to/nhỏ, tỉ lệ bất kỳ, có/không alpha, nền hơi xám/ngả kem. Agent đọc số đo thật (mép, histogram nền) rồi quyết định, ghi lại trong manifest.
- Ảnh có **nhiều vật trong một ảnh** (lưới): agent tách theo thành phần liên thông; đối chiếu số lượng với `assets.csv`; nếu thiếu/thừa → báo.
- **Giữ ảnh gốc nguyên** (`art-in/`) để làm lại khi sửa thông số cắt.
- Bối cảnh liền (full-bleed): không cắt nền; agent cắt/crop theo tỉ lệ 16:9 hoặc vừa trang sách (engine), đặt vào lớp xa nhất; kiểm ánh sáng/màu để khớp với lớp 3D.

## 6. Điều agent tự thêm để dễ dùng (đề xuất, giữ trong mọi prompt)
- Cho **kích thước tương đối trong prompt**: "character height = 1.0; hat adds up to 0.12" để các nhân vật cùng tỉ lệ.
- **Màu mã hex** từng bộ phận (áo, viền, mũ, da, râu) lấy từ bible; không dùng tên màu mơ hồ.
- **Danh sách phụ kiện không được che mặt** (file 15 mục F): "headgear sits above the eyebrows, beard stops below the mouth, mouth fully visible".
- **Mặt & miệng**: chỉ rõ vị trí miệng ở khoảng 62–68% chiều cao đầu từ trên xuống; kích thước miệng đủ lớn (≥12% chiều rộng mặt).
- **Vùng an toàn**: "keep 8% empty margin; the white background must touch all four edges".
- **Bóng giả**: "no baked shadow; flat fill only" (engine tự đổ bóng).
- **Độ dày viền đồng nhất** giữa mọi ảnh trong tập: nêu số px theo cạnh dài (vd. 0.8% chiều cao).
- **Tham chiếu lịch sử** (ảnh PD) kèm URL/mã trong `assets.csv` để người dùng/bên thứ 3 đối chiếu; ghi "stylize, do not copy" nếu cần.
- **Dự phòng**: ghi cho mỗi tài sản phương án A (vẽ code) nếu ảnh bên thứ 3 không đạt.

## 7. Tích hợp quy trình
- File 04: thêm bước **3d — Cổng nguồn hình vẽ ★** giữa 3c (bible) và 4 (script)? **Thứ tự đúng:** bible → script → **cổng nguồn hình vẽ (§1) → art-brief/prompt → (người dùng vẽ/dán) → ingest → storyboard → dựng**.
- Nếu người dùng chọn (A) cho tất cả → bỏ qua `art-brief/`, agent làm model sheet như file 14 §4 và xin duyệt.
- `checklist 07`: thêm mục "ảnh nhập: nền sạch, cùng style, đủ biến thể, đủ độ phân giải, license ghi".
