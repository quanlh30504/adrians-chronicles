# 09 — Nghiên cứu nội dung & nguồn tư liệu hình ảnh (giao thức bắt buộc)

## Thực trạng đã kiểm tra (pilot 1453, 2026-11-05) — nói thẳng
- **Nội dung pilot viết theo trí nhớ, KHÔNG tra nguồn** (xem `pilot-1453/FACTS.md`, ghi rõ "chưa kiểm chứng"). Đủ cho thử giọng/style, **không đủ cho tập thật**.
- **Ảnh pilot = 1 ảnh**: tìm bằng 1 lần WebSearch rồi tải trực tiếp từ Wikimedia Commons. Đủ để thử, **chưa phải quy trình** đủ cho video 30–45 phút.
- Tập thật cần số lượng tư liệu lớn hơn nhiều (ước tính phía dưới) và quy trình có kiểm chứng.

## Ngân sách tư liệu cho 1 tập 30–45 phút (ước tính, hiệu chỉnh sau tập đầu)
- Mỗi chương (3–6′) cần ≥ **6–10 tư liệu thật** (tranh, bản đồ, thư/bản thảo, chân dung, hiện vật) → mỗi tập ~**50–90 tư liệu**, nhiều tư liệu dùng lại 2–3 cảnh (zoom vào chi tiết khác nhau, loupe).
- Phần còn lại (engraving) là hình **vẽ bằng code** (bản đồ, sơ đồ, roundel, cảnh đơn giản). **Rủi ro đã biết:** chân dung, đám đông, cảnh chiến trận vẽ bằng code rất khó; hiện style chỉ làm tốt bản đồ/kiến trúc/vật thể. → Hướng giải quyết cần phát triển (mục "Việc cần làm"): **khắc từ tranh public-domain thật** (chuyển tranh/chân dung PD thành các nét hatch theo tông, ví dụ dùng `B.hatch` với trường tông lấy từ độ sáng ảnh).
- Chủ đề ít tư liệu PD (hiện đại, sau ~1930) → tránh hoặc dùng bản đồ/biểu đồ tự vẽ. Ưu tiên chủ đề cổ/trung/cận đại (nhiều tranh, bản đồ PD).

## Giao thức nghiên cứu nội dung (cho `research.md`)
1. **Lập dàn ý câu hỏi** trước (chương, mốc, nhân vật, tranh cãi).
2. **≥ 8 nguồn/tập**, trong đó ≥ 3 nguồn học thuật (sách chuyên khảo, bài báo, bách khoa học thuật như Britannica/Oxford/Cambridge, biên niên sử gốc qua bản dịch uy tín) và nguồn gốc (chronicle, thư từ) khi có. Wikipedia chỉ để định hướng, **không là nguồn trích duy nhất**.
3. Tool: `WebSearch` (mode `standard`; `extended` cho chủ đề khó/mới), `WebFetch` để đọc trang, và `itv-research` khi cần dossier sâu (skill có `dossier_check.py` cổng ≥10 nguồn). Bắt buộc ghi: claim · nguồn (URL/tác giả/năm/trang) · mức chắc (sự thật / ước lượng / giả thuyết / truyền thuyết).
4. **Số liệu gây tranh cãi** (quân số, ngày tháng, nguyên nhân): nêu khoảng/nhiều quan điểm trong lời kể, ghi nguồn từng quan điểm.
5. **Kiểm chứng chéo**: mỗi claim số liệu/ngày cần ≥2 nguồn độc lập hoặc 1 nguồn học thuật mạnh. Claim không kiểm chứng được → bỏ hoặc nói rõ "tradition holds".
6. Cổng: không viết `script.md` khi `research.md` chưa có chương trình + bảng nguồn.

## Nguồn tư liệu hình ảnh (ưu tiên theo thứ tự) — chỉ CC0/Public Domain/giấy phép rõ
| Nguồn | Có API không key? | Dùng cho | Ghi chú |
|---|---|---|---|
| **Wikimedia Commons** (`commons.wikimedia.org/w/api.php`) | Có (cần User-Agent riêng) | mọi loại, rất nhiều | Kiểm tra `Template:PD-old`/licence **từng file**; ảnh chụp bảo tàng của bên thứ ba có thể có ghi chú riêng. Thử nghiệm: tìm "Mehmed II portrait" → 626 file |
| **Library of Congress** (loc.gov, tile.loc.gov, SRU) | Có | bản đồ, ảnh, bản thảo | Có record catalog + ID |
| **The Met Open Access** | Có (dùng **`/v1.1/search`**; `/v1/search` đã ngừng 2026-10-01) | tranh, hiện vật CC0 | `isPublicDomain=true` |
| **Rijksmuseum** | Cần API key miễn phí | tranh Hà Lan, bản đồ, in ấn (CC0) | |
| **Smithsonian Open Access** | Cần key api.data.gov miễn phí | CC0 | |
| **Europeana**, **Gallica (BnF)**, **British Library** (Flickr/Commons), **NARA** | Một số cần key | bản thảo, bản đồ cổ | kiểm tra rights statement từng mục |
| Internet Archive / HathiTrust / Biodiversity Heritage | Có | sách cổ, atlas, minh họa | PD theo năm xuất bản |
Quy tắc: **không dùng Google Images/Pinterest/ảnh không rõ giấy phép; không dùng ảnh AI thay đồ vật lưu trữ.** Mỗi tư liệu ghi vào `FACTS.md`/`assets-licenses.md`: tên, người tạo/năm, kho lưu giữ + số catalog, URL gốc, giấy phép, **ngày kiểm tra**. Xin phép người dùng trước khi tải (nêu tên file, nguồn, dung lượng); có thể xin **một lần cho cả lô** của một tập.
Chất lượng: ưu tiên bản gốc ≥ 2000px cạnh dài (ảnh BnF pilot chỉ 1297×1851, mờ khi zoom → tìm bản cao hơn trên Gallica/Commons "original file").

## Quy trình thu thập tư liệu cho 1 tập
1. Từ `research.md` + chương, lập **bảng nhu cầu hình** (`episodes/EPxxx/assets-needs.md`): mỗi chương cần gì (chân dung X, bản đồ Y, tài liệu Z).
2. Tìm theo bảng (Commons API trước, rồi các kho trên), lập danh sách ứng viên (thumbnail + licence + độ phân giải).
3. **Trình người dùng danh sách ứng viên + dung lượng, xin phép tải cả lô**; tải về `episodes/EPxxx/archive/` + `archive.json` (hoặc `assets.json` nhiều mục).
4. Nếu một chương thiếu tư liệu → báo ngay: đổi chương (gộp/bỏ), hoặc dùng hình vẽ code (bản đồ/sơ đồ), hoặc khắc từ tranh PD gần nhất.
5. Cổng trước khi dựng: mọi câu có hình (tư liệu thật hoặc hình code) và mọi tư liệu có licence trong bảng.

## Việc cần làm (backlog kỹ thuật, ghi để lần sau)
- [ ] Công cụ `engrave-from-image`: tranh/chân dung PD → hatch nhiều lớp theo độ sáng (đưa tư liệu thật vào phong cách khắc).
- [ ] Script `fetch_assets.py` (Commons + Met v1.1 + LoC) để tìm ứng viên + licence + kích thước hàng loạt, xuất `candidates.json`.
- [ ] Thử nghiệm quy mô: dựng danh sách tư liệu cho tập 1 thật để xác nhận ≥50 mục khả thi.
