# 11 — Quy tắc đồng bộ chữ trên hình (phụ đề, nhãn, chú thích)

## Sự cố đã gặp (2026-11-05) và nguyên nhân
- Triệu chứng: chữ phụ đề hiện **trước** tấm giấy nền vài chục ms (và biến mất trễ hơn nền).
- **Nguyên nhân: lỗi của tôi, không phải do font.** Hàm `engraveText` của engine đặt lại `ctx.globalAlpha` về tham số `alpha` của nó (mặc định 1). Từ bản v2, khi đổi phụ đề từ `writeScript(..., {alpha: a})` sang `engraveText(...)` tôi không truyền `alpha`, nên tấm giấy mờ dần theo `globalAlpha = a` nhưng chữ luôn đậm 100% ngay từ khung đầu. Bản v1 (script) đồng bộ vì có truyền alpha. Đo lại bản lỗi: ở t0+0.05 s chữ gần như đen (pixel ≈ 11) trong khi nền mới hiện ≈ 20%.
- Sửa: **vẽ tấm giấy + chữ vào một lớp offscreen rồi ghép bằng MỘT alpha** (`subLayer` trong `episodes/pilot-1453/film.js`). Thêm cổng tự động `episodes/pilot-1453/tools/check_subsync.py` (đã xác nhận: bản lỗi fail với vi phạm 87, bản sửa pass).

## Quy tắc (bắt buộc)
1. **Chữ và nền của nó (tấm giấy, tấm chú thích tối, khung nhãn) luôn là MỘT lớp, MỘT alpha, MỘT bộ mốc thời gian (t0/t1/easing).** Không bao giờ dựa vào `ctx.globalAlpha` rồi gọi `engraveText`/`writeScript`/hàm engine khác — chúng tự reset alpha. Hoặc truyền `alpha` tường minh, hoặc (ưu tiên) vẽ vào canvas offscreen rồi `drawImage` với alpha.
2. Hiệu ứng "chữ được khắc dần" (`p` < 1) chỉ dùng cho tiêu đề/nhãn trên bản khắc, **không dùng cho phụ đề** (phụ đề: hiện cùng nền, `p = 1`).
3. Khi đổi font, đổi hàm vẽ chữ hay sửa `drawSubs`: **chạy lại `check_subsync.py`**; đây là cổng bắt buộc trong `build.sh` trước khi render hình.
4. Nhãn archive (chấm neo → leader → tấm tối → chữ) dùng cùng một alpha `lp`; kiểm bằng mắt ở 3 khung: bắt đầu, giữa, cuối của fade.
5. Phụ đề giữ ≥ max(1.8 s, thời lượng lời + 0.6 s); hết câu trước khi câu sau vào (`end = min(t1+0.6, next.t0-0.05)`); không che nhãn.
6. Kiểm tra bằng mắt thêm: render still tại `t0+0.05`, `t0+0.12`, `end-0.12`, `end-0.05` của mỗi phụ đề và xem chữ có mờ theo nền không (script làm tự động).

## Cách chạy cổng
```bash
export MSYS_NO_PATHCONV=1 PYTHONUTF8=1
python <project>/tools/check_subsync.py <project>     # in OK/FAIL từng khung; exit 1 nếu có FAIL
```
Script đọc các mốc `t0/t1` của phụ đề trong `film.js` (định dạng `{ t0: …, t1: …, text: … }`), render hai lần (có/không `?nosub=1`) và so từng pixel với giới hạn "không tối hơn mức alpha cho phép". Tập thật phải giữ cùng định dạng mảng `subs` để script hoạt động.
