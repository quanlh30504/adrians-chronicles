# 01 — Nhận diện kênh

**Tên:** Adrian's Chronicles · **Ngôn ngữ video:** English · **Ngách:** lịch sử thế giới kể chuyện (historical storytelling + documentary dài).

## Định vị
"Những câu chuyện lịch sử được kể như một người bạn thông minh, điềm tĩnh, hơi bí ẩn và hóm hỉnh đang kể bên lửa trại" — có chiều sâu documentary nhưng dễ theo dõi như storytelling.

## Trụ cột nội dung (không chỉ chiến tranh/vua chúa)
1. **Life stories** — cuộc đời nhân vật: "The Life of / The Untold Story of…"
2. **Rise & Fall** — đế chế, quốc gia, nền văn minh: "The Rise and Fall of…"
3. **Turning points** — quyết định/biến cố thay đổi lịch sử: "The Decision That Changed…"
4. **Secrets & mysteries** — bí mật hoàng gia, âm mưu, số phận kỳ lạ, những điều sách giáo khoa bỏ qua.
5. **Ordinary lives** (xen kẽ) — đời sống thường dân, thức ăn, bệnh dịch, tình yêu, tiền bạc thời xưa.

## Khán giả mục tiêu
Người xem tiếng Anh 18–55 thích nghe dài (nền khi làm việc/ngủ/đi lại) và học hỏi; muốn câu chuyện + bối cảnh + "tại sao nó quan trọng".

## Lời hứa với người xem
Mỗi video: (1) một câu hỏi/bí ẩn mở rõ ràng ở 30 giây đầu, (2) có nhân vật để theo dõi, (3) ít nhất 3 chi tiết bất ngờ, (4) kết luận về di sản/ý nghĩa, không kết thúc đột ngột.

## Nguyên tắc thương hiệu
- Nhất quán > mới lạ: cùng giọng, cùng style, cùng cấu trúc intro/outro.
- Trang trọng vừa phải, không giễu cợt nạn nhân/thảm họa; hóm hỉnh nhắm vào quyền lực, sự phi lý, bản chất con người.
- Trung lập chính trị; trình bày nhiều góc nhìn với chủ đề nhạy cảm.

## Decision log (thêm dòng mới ở dưới, ngày tuyệt đối)
- 2026-11-06 — ĐỔI STYLE EP001: **Low-poly → Paper Pop-up Book** (người dùng chọn sau khi có script/giọng v2). Cảnh đầu = mở sách; khung chính diện có thể phóng to cho đầy khung, không cần lộ góc sách/mặt bàn (tránh mất diện tích). Nhân vật = thẻ giấy cắt (card) vẽ 2D có biểu cảm. Thư mục `lp/` (low-poly) bỏ.
- 2026-11-06 — FPS: render **24 fps** cho EP001 (Pop-up giấy; nhanh hơn ~20%; mux --fps 24). Spec 30 fps trong file 05 coi là đề xuất, CapCut xuất 1080p vẫn ghép được. Chưa người dùng phản đối; đổi nếu họ yêu cầu.
- 2026-11-06 — LUẬT TRUNG THỰC DỰNG CẢNH: không nói "bịa" trong video; FICT = người điển hình; RECON có khung "imagine"; mô tả/pinned comment có dòng báo dựng lại (file 13 §4).
- 2026-11-06 — DỰ ÁN = TEMPLATE. (1) Style hình ảnh chọn **theo từng tập** (cổng ★ cho xem mẫu; file 14); Low-poly chỉ là của EP001. (2) Kịch bản đổi sang **dựng cảnh có nhân vật + thoại hóm hỉnh**, người kể có thể nhập vai; học từ 2 video tham khảo (explainer *Hitler*, kịch *Thảo Lược Ấn Độ Du Ký* tập 9) — file 13. Được tự viết chi tiết/thoại để diễn sự kiện thật (nhãn DOC/RECON/FICT), không đổi sự kiện. (3) Giọng người kể khóa cả dự án, **tốc độ 0.78 → 0.80**; mỗi nhân vật có giọng Kokoro riêng trong tập. (4) Pop-up Book: cảnh đầu = **mở sách** (không phải laptop). (5) **Làm lại script EP001 từ đầu** theo luật mới; voice/audio cũ của EP001 bỏ.
- 2026-11-05 — ĐỔI STYLE: bỏ Engraving + Archive Light Table, **khóa Low-poly Isometric Island (3D)**. Lý do: Part 1 EP001 quá nhiều chữ, ít hình, lặp cảnh. Đã thử cùng đoạn 36 s: Woodcut, Paper-cut, Low-poly, Picture Book, Paper Pop-up; người dùng chốt Low-poly. Quy tắc mới: mỗi câu một hình, không lặp cảnh, SFX theo sự kiện hình. Ảnh hưởng: Part 1 phải dựng lại phần hình (giọng, script, nhạc giữ nguyên).
- 2026-11-05 — KHÓA NHẠC NỀN CHÍNH: "Teller of the Tales" (Kevin MacLeod, CC BY 4.0, cần credit trong mô tả). Hệ font trên hình: Playfair + Source Sans 3 + Lora; phụ đề Lora 600. SFX: Mixkit qua stock-audio.
- 2026-11-05 — KHÓA GIỌNG: `bm_george` (Kokoro), speed 0.78, en-gb.
- 2026-11-05 — QUYẾT ĐỊNH NGƯỜI DÙNG: engine giọng = Kokoro offline của lemo-opuscar, giọng Anh-Anh nam `bm_*` (thay cho OmniVoice ở dòng dưới).
- 2026-11-05 — ĐỔI: bỏ Impasto, khóa hybrid Engraving + Archive Light Table (chuyển bằng loupe). Engine giọng: OmniVoice (Kokoro chỉ dự phòng).
- 2026-11-05 — (đã thay thế bởi dòng trên) Khóa style Impasto, narrator không hiện hình, voice brief nam trầm ấm Anh-Anh (profile ID chờ OmniVoice backend).
- 2026-11-05 — Khởi tạo dự án. Plugin chính: `youtube-agent` (chiến lược/script/SEO) + `lemo-opuscar` (kịch bản chi tiết + dựng). Video ≥20 phút (mục tiêu 30–45). Một giọng kể thống nhất. Render theo Part, ghép CapCut.
- 2026-11-06 — BÀI HỌC POP-UP (file 15): sau khi xem EP001 xong, người dùng báo nhấp nháy khi tấm giấy chồng nhau + lớp sau bị che; tự duyệt thêm: cảnh leo thang, camera cắt đầu, phụ đề khó đọc. Đúc kết luật + cổng kiểm; CHƯA sửa trong EP001.
- 2026-11-06 — CỔNG NGUỒN HÌNH VẼ (file 16): sau script/bible, hỏi người dùng tự vẽ (code) hay xuất prompt cho bên thứ 3 rồi nhập ảnh về; prompt luôn có STYLE LOCK, nền trắng, biến thể miệng; agent tự đọc/cắt/đổi cỡ.
- 2026-11-06 — ĐỊNH HÌNH LẠI THƯ MỤC: git chỉ giữ tri thức dùng chung (`CLAUDE.md`, `knowledge/`, `templates/`, `engines/`, `tools/`); mọi sản phẩm (video lẻ, series gồm các tập con, pilot) nằm trong `output/` và bị ignore hoàn toàn. Cái cần tái dùng phải nâng lên engines/tools/knowledge.
