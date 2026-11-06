# Adrian's Chronicles — Project Rules (đọc đầu tiên mỗi phiên)

Kênh YouTube **tiếng Anh** về lịch sử thế giới: nhân vật, đế chế, quốc gia, nền văn minh, sự kiện thay đổi lịch sử, bí mật hoàng gia, quyết định định mệnh. Folder này là kho tri thức + xưởng sản xuất. Người dùng nói tiếng Việt → **trao đổi bằng tiếng Việt, mọi thứ ra video (kịch bản, title, mô tả, voice) bằng tiếng Anh.**

## Tri thức cốt lõi (import tự động)
@knowledge/00-setup-new-machine.md
@knowledge/01-channel-identity.md
@knowledge/02-narrator-voice-bible.md
@knowledge/03-content-strategy.md
@knowledge/04-production-pipeline.md
@knowledge/05-render-strategy.md
@knowledge/06-reference-channels.md
@knowledge/07-quality-checklist.md
@knowledge/08-sfx-and-music-sourcing.md
@knowledge/09-research-and-asset-sourcing.md
@knowledge/10-music-bed-and-mix-levels.md
@knowledge/11-onscreen-text-sync-rules.md
@knowledge/12-first-episode-runbook.md
@knowledge/13-dramatized-screenwriting.md
@knowledge/14-style-per-episode-and-casting.md
@knowledge/15-popup-style-lessons.md
@knowledge/16-art-sourcing-and-prompts.md

> **Folder này là TEMPLATE + bộ luật dùng chung (cập nhật 2026-11-06).** Mỗi câu chuyện lịch sử = một tập riêng, **style hình ảnh chọn lại cho từng tập** (hỏi + cho xem mẫu, file 14). Kịch bản theo kiểu **dựng cảnh có nhân vật + thoại hóm hỉnh** chứ không chỉ một người kể (file 13).

## 10 luật bất biến
1. **Giọng NGƯỜI KỂ khóa cho cả dự án** (`bm_george`, speed 0.80): không đổi persona/giọng giữa các video (file 02). **Mỗi nhân vật có một giọng riêng, nhất quán từ đầu đến cuối của tập đó** (file 14); người kể có thể "nhập vai" trong cảnh nhưng vẫn là giọng khóa.
2. **Độ dài tối thiểu 20 phút; mục tiêu 30–45 phút.** Chủ đề không đủ chất liệu cho ≥20 phút (≈2.800 từ) thì gộp/mở rộng góc nhìn hoặc bỏ, không độn.
3. **Nhân vật dẫn truyện (nếu hiện hình) phải nhất quán**: cùng thiết kế, bảng màu, trang phục, kiểu vẽ ở mọi video. Không tạo biến thể mới nếu chưa được duyệt.
4. **Một phong cách hình ảnh cho MỖI TẬP, chọn ở đầu tập** (cổng ★ "Chọn style": cho xem mẫu, người dùng chọn; file 14). Trong một tập không đổi style. EP001 = Paper Pop-up Book (đổi 2026-11-06 từ Low-poly; xem file 14). Mọi style: mỗi câu một hình khác nhau, không lặp cảnh, ít chữ; SFX theo sự kiện hình. Tư liệu lưu trữ (nếu dùng) phải là thật, không dùng ảnh AI thay thế.
5. **Dùng tối đa skill `youtube-agent`** cho mọi khâu chiến lược/kịch bản/SEO/packaging (bảng map ở file 04). Không tự chế khi đã có skill.
6. **Dùng `lemo-opuscar` để lên lại kịch bản chi tiết (shot-level) và dựng video**, sau khi script đã qua yt-script + yt-retention.
7. **Render theo từng Part (8–12 phút), người dùng ghép bằng CapCut.** Tuân thủ thông số kỹ thuật ở file 05 để ghép không lệch.
8. **Sự thật lịch sử phải kiểm chứng**: mọi ngày tháng, số liệu, trích dẫn cần nguồn trong `research.md`. Phân biệt rõ sự thật / giả thuyết / truyền thuyết. **Được dựng cảnh và tự viết thoại hóm hỉnh/chi tiết cảnh** để diễn một sự kiện thật (nhãn DOC/RECON/FICT trong research.md; file 13 mục 4), miễn không đổi sự kiện/số liệu/kết quả và không đưa lời tự viết thành "trích dẫn có thật". **Không nói "bịa" trong video**; thay bằng khung "người điển hình / imagine" + dòng báo dựng lại trong mô tả & pinned comment (file 13 §4).
9. **Chỉ dùng tư liệu có bản quyền rõ ràng** (public domain, CC0, tự tạo/code-drawn). Ghi nguồn vào `assets-licenses.md`. **SFX và nhạc: luôn lấy bằng skill `/stock-audio`** (SFX tổng hợp bằng code chỉ là dự phòng); nếu máy chưa có skill → cài theo `08-sfx-and-music-sourcing.md` (repo `quanlh30504/claude-skills`). Ghi license.
11. **Nội dung và hình phải có nguồn thật, theo giao thức `09-research-and-asset-sourcing.md`**: ≥8 nguồn/tập trong `research.md`, danh sách tư liệu ứng viên (có licence, độ phân giải) trình người dùng xin phép tải theo lô. Không viết kịch bản từ trí nhớ rồi coi là đã kiểm chứng.
13. **Nhạc nền: chỉ chọn qua `/stock-audio`, từ "music palette" đã được người dùng duyệt; mix thấp hơn giọng 20–24 dB, có ducking, chênh LUFS ≥14 LU** (file 10). Giọng kể luôn là ưu tiên số 1.
14. **Chữ và nền của nó phải đồng bộ tuyệt đối** (một lớp, một alpha); trước khi render hình chạy `tools/check_subsync.py` (file 11).
12. **Chữ trên hình phải dễ đọc, theo hệ font đã khóa (file 02)**: tiêu đề/chữ ký **Playfair Display**, nhãn nhỏ **Source Sans 3**, ghi chú + phụ đề **Lora**. Cấm Pinyon Script và Bodoni Moda. Nhãn ≥15 px; chữ trên nền tối dùng tint sáng của màu tín hiệu.
10. **Không bỏ cổng chất lượng**: mỗi tập phải qua checklist `07-quality-checklist.md` trước khi giao.

## Quy trình ngắn (chi tiết ở file 04)
`Ý tưởng → yt-plan/yt-viral → research → yt-script → yt-retention → yt-chapters → lemo-opuscar (shot script + dựng, theo Part) → voice (1 giọng khóa) → render từng Part → CapCut ghép → yt-package/yt-seo → upload → yt-audit`

## Cấu trúc thư mục (định hình lại 2026-11-06)
```
CLAUDE.md, knowledge/, templates/   # TRI THỨC CHUNG  → có trong git
engines/                            # engine dựng dùng lại (vd. engines/popup/) → có trong git
tools/                              # công cụ dùng chung (check_subsync.py, ingest_art.py…) → có trong git
output/                             # MỌI SẢN PHẨM — KHÔNG vào git (ignore cả thư mục)
  <video-don>/                      # video lẻ: output/EP001-fall-of-constantinople/ (brief, research, script, bible, audio/, parts/, …)
  <series>/                         # video nhiều tập: một thư mục lớn
    <ep-con>/                       # các tập con bên trong: output/<series>/EP01-slug/
  pilot-1453/                       # bản thử cũng là output
```
Quy ước: **mọi thứ do dự án tạo ra cho một video (kể cả brief/script/bible/mã dựng riêng của tập) nằm trong `output/`**, và bị ignore. Cái gì muốn dùng lại cho tập sau (luật, quy trình, engine, công cụ, template) phải **nâng lên** `knowledge/`, `engines/`, `tools/` hoặc `templates/` — đó mới là phần vào git. Đặt tên tập: `EP001-slug-ngan-gon`. Mỗi tập có `brief.md` (từ `templates/episode-brief.md`) trước khi làm bất cứ gì.

## Cách cập nhật tri thức
Khi người dùng đưa quyết định/ưu tiên mới (giọng, style, kênh tham khảo, chiến lược): **cập nhật file tương ứng trong `knowledge/`** và ghi dòng vào "Decision log" cuối file 01. Không để tri thức chỉ nằm trong chat.

## Các quyết định còn MỞ (hỏi người dùng khi cần, rồi ghi lại)
- Palette (màu tín hiệu), font tiêu đề/chú thích, kiểu loupe: chốt khi làm pilot hình ảnh.
## Đã khóa (2026-11-05)
- Style hình ảnh: ~~Engraving + Archive Light Table~~ → **Low-poly Isometric Island 3D** (lemo-opuscar, đổi 2026-11-05 sau khi thử 5 style), chi tiết ở file 02. Narrator: **không hiện hình**.
- Giọng người kể: **Kokoro TTS offline của lemo-opuscar, voice `bm_george` (Anh-Anh nam), speed 0.80** (nâng từ 0.78, 2026-11-06). Không dùng OmniVoice. Không đổi. Nhân vật: giọng Kokoro riêng, khóa theo tập (file 14).
- Quy trình mỗi tập: brief → **chọn style ★** → research → **bible nhân vật/kiến trúc (file 13)** → script dạng cảnh có thoại → **cổng nguồn hình vẽ ★ (file 16: agent tự vẽ hay xuất prompt cho bên thứ 3, rồi nhập ảnh về)** → storyboard (contact sheet, file 15) → voice → dựng.
- Pilot cần làm đầu tiên: render 30–60s để chốt palette, font, kiểu loupe, và nghe giọng. Cần cài deps lemo-opuscar (`setup.sh deps` rồi `deps voice`; trước đó thiếu Python 3.11+/uv).
- Tên/ý nghĩa persona "Adrian" nếu muốn nhân cách hóa.
