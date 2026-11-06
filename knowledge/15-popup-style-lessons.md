# 15 — Bài học style Paper Pop-up Book (rút từ EP001, tự duyệt video 2026-11-06)

> Nguồn: xem lại 10 contact sheet (mỗi 15 s, cả 3 Part) + nhận xét của người dùng. Áp dụng cho **mọi tập dùng style Pop-up** (engine `pu/`). Nhãn: **[THẤY]** = quan sát trực tiếp trên khung hình; **[NGHI]** = nguyên nhân suy ra từ code, chưa thử sửa/đo → kiểm lại khi sửa.
> Mỗi mục có **Luật** (làm gì lần sau) + **Cổng kiểm** (cách bắt lỗi trước khi render dài).

## A. Nhấp nháy / giật khi lớp giấy chồng lên nhau (người dùng báo — lỗi nặng nhất)
- **[THẤY/người dùng]** Nhân vật–đồ vật, nhân vật–nhân vật, đồ vật–đồ vật chồng chéo thì viền/mặt giấy chớp, rung (đám kỵ binh xếp nhiều tấm sát nhau; lính trước tường; cửa trước tường; nhân vật trước bàn/bản đồ).
- **[NGHI] Nguyên nhân (cộng dồn):**
  1. Các tấm đặt **cách nhau 1–5 mm** theo trục sâu (vd. lính z .131 trên tường z .13; cửa .112 trên tường .11) trong khi camera `near=.004, far=30` (tỉ lệ 7500:1) → độ phân giải depth buffer không đủ → **z-fighting**.
  2. `alphaTest .5 + alphaToCoverage` nhưng renderer tạo với `antialias:false` → alpha-to-coverage không có MSAA để làm mượt → mép cắt **răng cưa, chớp theo từng frame** khi camera/tấm nhúc nhích.
  3. Mỗi tấm vừa `castShadow` vừa `receiveShadow` với tấm sát bên (bias −.00006) → **shadow acne / bóng lật** giữa hai tấm gần nhau.
  4. Hai mặt (front + back mesh cùng phẳng) cùng độ sâu.
- **Luật:**
  - **Khoảng cách tối thiểu giữa hai tấm có chồng nhau trên màn hình: ≥ 0.012 (đơn vị cảnh)**; đặt "tầng" cố định: nền .00 · bối cảnh .04 · tường/đạo cụ lớn .08 · nhân vật phụ .12 · nhân vật chính .16 · đạo cụ trước mặt .20. Không dùng chênh .001–.005.
  - Đặt `near ≥ .05` (không .004), `far ≤ 6`; bật `logarithmicDepthBuffer` hoặc `polygonOffset` cho tấm sát nhau nếu buộc phải gần.
  - Bật MSAA thật (`antialias:true` hoặc render-target samples ≥4) **hoặc** bỏ `alphaToCoverage` và dùng viền mềm; không để A2C chạy khi không có MSAA.
  - Tấm nhỏ/ở xa: `castShadow=false` (bóng giả bằng `blobShadow` dưới chân); chỉ tấm lớn cast shadow.
  - Chuyển động có chồng lấn (kỵ binh, đoàn quân) phải **tăng z theo hàng** và dùng nhiều mốc z, không xếp đè cùng z.
- **Cổng kiểm:** thêm `tools/check_flicker.mjs`: render ảnh tĩnh tại t, t+1/24, t+2/24 ở mọi cảnh có ≥2 tấm chồng; so khác biệt pixel vùng chồng (camera đứng yên) → phải ≈0 ngoài chuyển động có chủ đích. Trước đó: render thử 2 s ở cảnh nặng nhất và xem frame-by-frame.

## B. Bố cục nhiều lớp — lớp sau bị lớp trước che (người dùng báo)
- **[THẤY]** Pháo/đạo cụ lớn ở tiền cảnh che mất nhân vật (Part 1 cảnh "three suspects": khẩu pháo chiếm nửa khung, nhân vật bị chôn sau); bàn gỗ che nửa thân nhân vật (Constantine/Mehmed/Urban sau bàn chỉ thấy đầu+vai); bản đồ trên bàn che người ngồi; đồi xanh che hạm đội ở cảnh hạm đội leo đồi; tường tiền cảnh che chân nhân vật ("So let's talk about those walls": nhân vật đứng trên tường chỉ thấy bắp chân); tàu che thủy thủ.
- **Luật:**
  - **Nhân vật đang nói luôn ở lớp trước nhất hoặc không bị che quá 20% diện tích.** Đạo cụ tiền cảnh ≤ 25% chiều cao khung và đặt ở **mép dưới/góc**, không cắt qua giữa mặt–thân người nói.
  - Đạo cụ "che có chủ ý" (bàn, lan can) phải **thấp hơn eo** nhân vật hoặc thấp hơn 35% chiều cao khung; nếu nhân vật ngồi sau bàn → nâng nhân vật (bệ/ghế) hoặc dùng bàn nhìn-từ-trên rất mỏng.
  - Cảnh ≥3 lớp: lập **bảng lớp (z, chiều cao, che-bao-nhiêu)** trong `scenes.js` comment trước khi dựng; lớp sau cao hơn lớp trước ≥ 25% chiều cao tấm trước (kiểu sân khấu bậc thang) để thấy cả hai.
  - Đồi/hạm đội/đám đông: **lớp xa phải cao hơn** lớp gần (đặt cao dần), hoặc camera cao hơn nhìn xuống.
- **Cổng kiểm (storyboard):** với mỗi shot, render 1 still và đánh dấu: người nói thấy đủ mặt+miệng? nhãn/đạo cụ chính không bị che >30%? Nếu fail → đổi z/y/camera trước khi render phim. Làm **contact sheet 4×3 toàn tập trước khi render dài** (quy trình hôm nay chỉ làm sau).

## C. Cảnh leo thang vào tường (đầu Part 1) — lỗi dựng chuyển động
- **[THẤY]** Thang là 3 tấm phẳng dựng đứng song song, "nổi" cách tường, không tựa vào tường; lính chỉ nhích lên (y tăng) như thang máy nhỏ, không leo; lính quá nhỏ (≈5% khung) nên không đọc được hành động; cảnh dùng 5 s cho cả "hàng trăm lần leo" → ý "thử rồi thất bại" không hiện.
- **Luật:** hành động lịch sử (leo thang, kéo pháo, kéo tàu) phải **đọc được ở cỡ ≥15% chiều cao khung**; mỗi hành động có **bắt đầu–giữa–kết** trong hình (leo → bị đẩy ngã → rơi), không chỉ một biến đổi y. Thang phải **nghiêng tựa vào đỉnh tường** (rz theo hình học), chân thang cắm đất, đỉnh chạm tường; nhân vật leo = đổi vị trí dọc thang + hơi lắc. Nếu không dựng được rõ → dùng **một thang, một lính, cận cảnh** thay vì nhiều thang xa.
- **Cổng kiểm:** xem 3 still (đầu/giữa/cuối) của mọi cảnh hành động; nếu người xem không đoán được hành động khi tắt tiếng → làm lại.

## D. Camera & khung hình
- **[THẤY]** Nhiều cú cận cắt đầu nhân vật ở mép trên (vd. Part 1 "Under seven thousand men on a four-mile wall", nhiều khung night-wall chỉ thấy nửa mặt); nhân vật dạt ra mép khung (Mehmed ở rìa trái); cú zoom vào tường trơn (gạch trống ~2 s "We'll be back") — khung chết, không có chủ thể.
- **Luật:** đầu người nói **luôn nằm trọn trong khung** với lề trên ≥ 6% chiều cao; không cắt ngang mặt. Cảnh "vòng tròn/loupe trên tường" phải có chủ thể (vật hiện ra), không để tường trơn >1.5 s. Khi cover (cắt qua người nói), cả hai người vẫn phải ở trong khung ở cú two-shot mở cảnh.

## E. Phụ đề & chữ
- **[THẤY]** Phụ đề cream trên nền sáng (tường, cát, nền hồng sáng) khó đọc dù có viền tối; phụ đề đè lên đầu nhân vật/mép bàn; **nhãn người nói chồng lên dòng phụ đề** (khung "DIMITRI · They're not very good" thấy chữ chồng); phụ đề mờ dần (ghost) trên khung tiền cảnh đỏ-trắng (Part 1 ~14 s "For more than a thousand years…").
- **Luật:** phụ đề đặt trên **thanh tối mờ cố định** (alpha ≥.55) như file 02, không dựa viền; nhãn người nói **trên** thanh (không cùng dòng với chữ); không đặt nội dung chính (mặt) dưới 14% đáy khung; giữ khung phụ đề không đổi vị trí giữa cảnh.
- **Cổng kiểm:** `check_subsync` (chưa chỉnh cho style Pop-up — việc cần làm) + kiểm tương phản: lấy mẫu pixel sau dải phụ đề, độ chênh WCAG ≥4.5.

## F. Nhân vật & biểu cảm (từ khung quan sát)
- **[THẤY]** Hai nhân vật dùng lại cùng bộ khuôn (nhiều nhân vật "người điển hình" giống hệt nhau, đám đông lặp mẫu); nhân vật mặt quá nhỏ ở cảnh đám đông nên miệng không đọc được; trong cảnh hai người nói, người không nói đứng đơ (không thở, không nghiêng đầu).
- **Luật:** đám đông ≥3 mẫu màu/mũ/râu khác nhau và xoay vòng; thêm chuyển động nền cho người nghe (nhún nhẹ, quay đầu 5–10° khi đối phương nói). Mặt người nói lớn ≥10% chiều cao khung khi có thoại.
- Bài học đã sửa trong lúc làm (giữ cho tập sau): khăn xếp phải đặt **trên** mắt; râu phải ngắn để **không che miệng** (miệng là cơ chế nói); mũ Janissary/bork không che mặt; tàu không che thủy thủ — **mọi phụ kiện đầu/mặt phải qua kiểm "mắt+miệng thấy rõ"** trên model sheet trước khi dựng.

## G. Quy trình rút ra (thêm vào pipeline mọi tập Pop-up)
1. **Model sheet + set sheet** render still trước (đã có trong file 14) — thêm **"bảng lớp"** cho mỗi cảnh ≥3 lớp.
2. **Storyboard contact sheet 4×3 mỗi Part** (mỗi 15 s, `ffmpeg fps=1/15,tile=4x3`) được xem **trước** khi render đầy đủ — tự duyệt B, C, D, E ở đây. (Tập EP001 mới làm sau khi render xong → tốn ~2,5 h render.)
3. **Render thử 3–5 s** ở các cảnh nặng (kỵ binh, đám đông, tàu chồng, tường nhiều tháp) để bắt nhấp nháy (A) trước.
4. Chạy cổng: `check_flicker` (A), `check_subsync` (E), blackdetect, LUFS, whisper (file 07/10/11).
5. **Báo cáo trung thực:** không viết "xong" khi chưa xem contact sheet.

## H. Việc cần làm kỹ thuật (backlog engine `pu/`; chưa làm)
- [ ] Sửa near/far, MSAA/A2C, shadow flag theo luật A; viết lại hàm `put()` để nhận **tầng z** có tên thay vì số lẻ.
- [ ] Viết `tools/check_flicker.mjs` và chỉnh `check_subsync.py` cho overlay phụ đề canvas.
- [ ] Thang/hoạt cảnh "leo" dựng lại (mục C); kiểm lại các cảnh bị che ở mục B bằng bảng lớp.
- [ ] Phụ đề: thanh tối cố định + nhãn người nói trên thanh.
- Các lỗi trên **chưa sửa trong EP001** (theo yêu cầu: chỉ đúc kết tri thức, không render lại).
