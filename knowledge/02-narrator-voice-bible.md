# 02 — Narrator Voice Bible (BẮT BUỘC cho mọi script & voice)

Mục tiêu: người xem nghe 10 video khác nhau vẫn thấy **cùng một người kể**.

## Persona (khóa)
- Người kể chuyện thông thái, **điềm tĩnh, chắc tay, pha chút bí ẩn**, hóm hỉnh khô (dry wit) — nháy mắt chứ không pha trò.
- Nói như người thật: câu ngắn xen câu dài, thỉnh thoảng nói thẳng với người nghe ("Here's the thing…", "Now, you'd think…"), có thể tự sửa lời, tự mỉa nhẹ.
- Không giảng đạo, không khoe chữ, không giọng MC quảng cáo, không giọng robot đều đều.

## Văn phong (script)
- Tiếng Anh tự nhiên, thân mật vừa phải; ưu tiên từ phổ thông, giải thích thuật ngữ ngay khi dùng.
- **Nhịp:** xen kẽ câu 4–8 từ (đấm) với câu 15–25 từ (mở). Đoạn 3–6 câu. Không quá 2 câu dài liên tiếp.
- **Hài hước:** tối đa 1 câu hóm hỉnh / 60–90 giây; châm biếm quyền lực/sự vô lý, không châm biếm nạn nhân.
- **Bí ẩn:** dùng open loop ("But that was the least of his problems."), hé lộ muộn, câu cuối đoạn tạo kéo.
- Dùng "you" đôi khi để kéo người nghe vào cảnh ("Picture the scene…"). Tránh "guys", "like and subscribe" lặp thừa; CTA tối đa 2 lần/video, nhẹ nhàng.
- Số liệu: làm tròn khi nói, nêu 1 mốc so sánh dễ hình dung. Ngày tháng: không đọc quá 2 con số liền nhau.
- **Cấm:** clickbait nói quá không có nội dung, "literally/insane/crazy" lạm dụng, mở đầu "In today's video…", cụm sáo rỗng ("little did he know" ≤1 lần/video), lặp cấu trúc câu >3 lần.

## Cụm đặc trưng (dùng tiết chế để thành "chữ ký")
Mở: một cảnh cụ thể, một câu hỏi, hoặc một nghịch lý. Chuyển ý: "Which brings us to…", "But history had other plans." Kết: quay lại hình ảnh/câu hỏi mở đầu.

## Voice (TTS) — nhịp & nhất quán
- **Nhịp đọc mục tiêu: 135–150 từ/phút trung bình có tính ngắt nghỉ** (không nhanh hơn 155 wpm ở bất kỳ đoạn nào; khán giả phải theo kịp).
- Điềm tĩnh, trầm vừa, tông ấm; đẩy chậm + hạ giọng ở khoảnh khắc bí ẩn/bi kịch; nhanh nhẹ ở đoạn hóm hỉnh. **Không đều đều.**
- Ngắt nghỉ: dấu phẩy ~0.25–0.35s, chấm ~0.5–0.7s, ngắt đoạn ~0.9–1.2s, trước twist/cliffhanger 1.2–1.6s. Dùng dấu câu & ngắt dòng trong script để điều khiển, không dựa hậu kỳ.
- **Ghi âm theo đoạn văn (paragraph takes), không theo từng câu** để giữ ngữ điệu liền mạch. Thu best-of-N, chọn take đạt.
- **Voice lock (2026-11-05): engine = Kokoro TTS của lemo-opuscar** (`core/tts/tts.py`, chạy offline, tiếng Anh). Giọng **Anh-Anh nam: họ `bm_*`** (British male). Không dùng OmniVoice (quyết định của người dùng).
  - Voice brief: nam, trung niên, trầm ấm, điềm tĩnh, Anh-Anh trung tính, narrator documentary, hơi bí ẩn.
  - **CẬP NHẬT 2026-11-06: tốc độ mặc định NÂNG LÊN `0.80`** (khoảng 0.76–0.84 theo từng đoạn, ±15%); người dùng muốn nhanh hơn 0.78 một chút. Giọng người kể khóa cho **cả dự án**; mỗi nhân vật có giọng Kokoro riêng, khóa trong tập (file 14). Các chỗ ghi 0.78 bên dưới là lịch sử.
  - **ĐÃ KHÓA (2026-11-05): voice = `bm_george`, lang `en-gb`, tốc độ mặc định `0.78`→`0.80`** (khoảng 0.75–0.84; ở 0.75 đo được ≈147 wpm lời nói thuần). Mẫu chuẩn: `knowledge/assets/voice-samples/slow/bm_george_s075.wav`. **Không đổi giọng/engine nữa** trừ khi cập nhật file này kèm Decision log. Lệnh: `cd $LIB && .venv/bin/python core/tts/tts.py lines.json out/` với mỗi line `{"id","text","voice":"bm_george","speed":0.78,"lang":"en-gb"}`.
  - **Đã đo (2026-11-05, đoạn mẫu 77 từ, đã cắt lặng đầu/cuối):** ở tốc độ mặc định 0.92 các giọng `bm_*` đọc quá nhanh: george ≈192 wpm, lewis ≈182, daniel ≈236, fable ≈232. Ở **speed 0.75**: george ≈147 wpm, lewis ≈141 wpm. → **Tốc độ khởi điểm cho kênh: 0.75–0.80** (ứng viên chính: `bm_george`, `bm_lewis`; `bm_daniel`/`bm_fable` nhanh và sáng hơn, ít hợp tông điềm tĩnh). Mẫu nghe thử: `knowledge/assets/voice-samples/` (và `slow/`). Vì khoảng lặng thêm vào ở bước mix, đo lại wpm trung bình thật sau khi mix.
  - **Hạn chế của Kokoro (không có điều khiển cảm xúc/instruct):** nhịp & sắc thái phải điều khiển bằng (1) dấu câu và độ dài đoạn trong script, (2) tham số tốc độ theo từng line (chậm hơn ở đoạn bi/bí ẩn, nhanh nhẹ ở đoạn hóm hỉnh; luôn trong ±15% tốc độ mặc định), (3) chèn khoảng lặng theo bảng ngắt nghỉ ở bước mix. Chia script thành line = một đoạn văn (3–6 câu), không theo từng câu.
  - Viết số thành chữ trong text đưa TTS (phụ đề dùng chữ số). Tên riêng khó đọc: thử trước, viết lại phiên âm trong text TTS nếu cần.
- **Gate đo được (voice_qc):** cao độ trong ±1.5 semitone, loudness trong ±1.5 LU, tốc độ trong ±15% giữa các đoạn/Part. Master -14 LUFS.
- Không đổi voice/engine/cài đặt giữa các Part hay các tập (trừ khi cập nhật file này kèm Decision log).

## Hình ảnh người dẫn truyện
- **Mặc định: không hiện nhân vật dẫn truyện.** Sự nhất quán đến từ giọng + motif đồ họa (khung bản đồ, chữ nổi, thanh timeline, bảng màu).
- Nếu dùng nhân vật hiện hình: chốt 1 model sheet (mặt, trang phục, màu, nét vẽ) trong `knowledge/assets/narrator-model-sheet.*`; mọi tập chỉ dùng lại, không vẽ lại.

> **Từ 2026-11-06: style hình ảnh chọn THEO TỪNG TẬP** (file 14). Mục dưới đây là style đã chọn cho **EP001**, không còn là luật cho cả kênh. Cách viết/kể xem file 13.

## Phong cách hình ảnh — EP001 (chọn 2026-11-05): **Low-poly Isometric Island (3D)**
> Thay thế toàn bộ khối "hybrid Engraving + Archive Light Table" bên dưới (giữ lại làm lịch sử). Lý do: Part 1 dựng bằng Engraving bị đánh giá nhiều chữ, ít hình minh họa, lặp cảnh; người dùng muốn 3D, sinh động, nhân vật/tòa nhà nét chuẩn, trừu tượng. Đã thử 5 style trên cùng đoạn lời mở đầu (Woodcut, Paper-cut, Low-poly, Picture Book, Pop-up); người dùng chốt **Low-poly 3D**.
- **Style:** `lowpoly-island` của lemo-opuscar: mô hình thu nhỏ low-poly (khối hình học, flat shading, không texture), camera trực giao isometric, ánh sáng đổi màu từng mặt, đổ bóng, GTAO, tilt-shift nhẹ, bloom, nước low-poly. Mẫu chuẩn: `output/EP001-fall-of-constantinople/styletest/lowpoly/` (`main.js` + `sea.js` + `post.js`).
- **Quy tắc kể chuyện bằng hình (bắt buộc):** mỗi câu/đoạn lời một hình khác nhau (góc máy, địa điểm hoặc hành động), **không lặp cảnh**; camera luôn chuyển động; chữ trên màn hình chỉ là phụ đề + tối đa nhãn quan trọng (ít chữ). Không dùng tấm chữ/timeline thay cho hình.
- **Thế giới 3D dùng lại cả tập:** bán đảo Constantinople (tường ba lớp, Hagia Sophia, vịnh, tàu, doanh trại, quân) dựng một lần, mỗi Part chỉ đổi camera/ánh sáng/hoạt cảnh.
- **Bảng màu (tạm, từ bản thử):** bầu trời/ánh sáng theo thời điểm (vàng chiều, xanh đêm, đỏ bình minh), tường đá kem `#d9d3c6`, mái ngói đỏ/cam, cỏ `#8fc46a`, nước xanh; màu nhấn đỏ madder cho khoảnh khắc bi kịch. Font phụ đề: **Lora 600** trên thanh tối mờ (≥40 px). Hệ font trên hình giữ theo khóa cũ (Playfair/Source Sans 3/Lora).
- **Tư liệu thật (tranh, bản đồ PD):** không còn là trục chính; có thể dùng như vật thể trong thế giới 3D hoặc cắt chèn ngắn, nhưng không thay hình minh họa.
- **Nhân vật:** người low-poly nhỏ (thân trụ, đầu, nón/khăn, giáo); sultan và nhân vật chính cần bản model riêng khi làm lại (backlog: kỵ binh, sultan, Giustiniani).
- **SFX phải khớp hình:** xuất sự kiện hình (`window.EV`) từ chính cảnh (bước chân, thang chạm tường, cửa mở, tàu, cờ rơi…) rồi đặt SFX từ danh sách đó; **cấm rải SFX ngẫu nhiên**.
- Render ≈ 5–6 phút cho 36 s ở SSAA 1.5, 2 worker (ước tính Part 10 phút ≈ 80–100 phút).

## (Cũ, đã thay thế 2026-11-05) Phong cách hình ảnh (khóa 1 lần — ĐANG MỞ)
- **ĐÃ KHÓA (2026-11-05): hybrid `engraving` (Copperplate Engraving) + `archive-lighttable` (Archive Light Table)** của lemo-opuscar. (Đã bỏ Impasto: quá nặng và quá "đồ họa" cho video dài.) Mọi tập dùng đúng hai style này.
  - **Vai trò:** *Engraving* = hình kể chuyện chính (chân dung, cảnh, bản đồ, bảng khắc có tiêu đề La Mã + tên nghiêng, roundel phóng to chi tiết). Tông mực đen trên giấy kem; **màu tô tay (wash) chỉ xuất hiện như một sự kiện** ở khoảnh khắc cao trào.
  - *Archive light-table* = các khoảnh khắc **bằng chứng**: tư liệu thật (thư, bản đồ, tranh, bản thảo, ảnh) trên bàn sáng, kính lúp hạ xuống, nhãn + nguồn + mã catalog. Chỉ dùng tư liệu thật public-domain/CC0; **không bao giờ dùng ảnh AI thay cho đồ vật lưu trữ**. Giữ `FACTS.md` (claim, nguồn, trích dẫn) mỗi tập.
  - **Quy tắc chuyển:** engraving ↔ light-table chuyển bằng kính lúp (loupe) — một kiểu chuyển cố định cho cả kênh. Tỉ lệ gợi ý ~70% engraving / 30% archive.
  - **Palette & font (pilot 1453, 2026-11-05 — đề xuất chờ người dùng duyệt):** giấy kem `#f1e8d2`, mực `#1c1510`, **màu tín hiệu madder `#a63a2a`** (nhãn archive + wash tường), wash đất `#c9a45e`, bàn sáng xám lạnh `#eef1f3→#c9d0d6`. Font **Bodoni Moda** (tiêu đề/nhãn, OFL) + **Pinyon Script** (ghi chú/phụ đề, OFL), file trong `output/pilot-1453/fonts/`.
  - **Phụ đề:** mảnh giấy rách nhẹ, chữ **Lora 600 đứng ~35 px** (xem dòng khóa font bên dưới), tối đa 2 dòng ~900 px; không dùng Pinyon/Bodoni (đã bị đánh giá khó đọc).
  - **Font phụ đề ĐÃ KHÓA (2026-11-05, người dùng chọn): Lora 600 (OFL), ~35 px** (file `Lora.ttf` trong `output/pilot-1453/fonts/` và `knowledge/assets/font-candidates/`). Ảnh so sánh gốc: `knowledge/assets/font-candidates/specimen_0.jpg`. Tiêu đề/nhãn xem bảng hệ font bên dưới (Playfair + Source Sans 3 + Lora). Với Lora, gạch nối thường (-) hiển thị tốt (không cần gạch dài như Bodoni).
  - **HỆ FONT TRÊN HÌNH — ĐÃ KHÓA (2026-11-05, người dùng chọn "Bộ 2 Playfair")**; ảnh duyệt: `knowledge/assets/font-candidates/header_sets_0.jpg`. Tất cả OFL, file trong `output/pilot-1453/fonts/`:
    | Vai trò | Font | Cỡ (1080p) |
    |---|---|---|
    | Tiêu đề chính (`CONSTANTINOPLE.`), chữ ký kênh | **Playfair Display 700**, chữ hoa, tracking 0.1–0.2em | 50 / 21 |
    | Dòng phụ (`Anno Domini…`), tên Latin, chú thích nghiêng (`the great bombard`), số leader | **Playfair Display italic 400** | 25 / 21 / 21 / 16 |
    | Nhãn `FIG. 1 · …`, nhãn bản đồ (`CORNU AUREUM`) | **Source Sans 3 700/600**, chữ hoa, tracking 0.14–0.2em | 17 / 15 |
    | Ghi chú trong roundel/mô tả | **Lora italic 400** | 27 |
    | Phụ đề | **Lora 600** | 35 |
    | Tấm chú thích archive (nền tối) | nhãn **Source Sans 3 700** màu `#ee9a86` (madder sáng, vì `#a63a2a` quá tối trên nền tối), nội dung **Lora 600**, nguồn **Source Sans 3 400** | 15 / 26 / 16 |
    Quy tắc: **không dùng Pinyon Script và Bodoni Moda nữa** (khó đọc ở cỡ nhỏ). Không hạ nhãn xuống dưới 15 px; chữ trên nền tối phải dùng tint sáng của màu tín hiệu.
  - **Mẫu chuẩn đã dựng:** `output/pilot-1453/` (source + `build.sh`). Khung: plate mark + viền; tiêu đề `CONSTANTINOPLE.` + dòng italic `Anno Domini MCDLIII`; roundel FIG. 1 + leader; phụ đề = mảnh giấy script dưới đáy; **loupe iris** chuyển sang light table (đối tượng thật + chấm neo + tấm chú thích tối + nguồn); wash màu nở ở cuối; chữ ký `ADRIAN'S CHRONICLES` cắt lên bản khắc.
  - Nguồn tư liệu: Library of Congress, Smithsonian Open Access (CC0), Rijksmuseum (CC0), NARA, Europeana (kiểm tra rights từng mục). CC BY-SA / "no known restrictions" → hỏi người dùng trước.
- Narrator: **không hiện hình** (khóa). Nhất quán bằng giọng + motif đồ họa.
- Bảng màu, font tiêu đề/phụ đề, kiểu chuyển cảnh, kiểu bản đồ, kiểu lower-third: ghi tại đây khi chốt.
- Sau khi khóa: **mọi tập dùng đúng style + palette + font này.**

## Test giọng điệu (tự kiểm trước khi giao script)
Đọc to 3 đoạn bất kỳ. Nếu (a) không có câu nào hóm hỉnh nhẹ trong 2 phút, (b) có >3 câu liên tiếp cùng độ dài, (c) nghe như Wikipedia hoặc như quảng cáo → viết lại.
