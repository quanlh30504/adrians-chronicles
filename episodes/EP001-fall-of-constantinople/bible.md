# EP001 — BIBLE (nhân vật · giọng · kiến trúc · cảnh dựng · gag)  — v1, 2026-11-06

Style tập này: **Low-poly Isometric Island (3D)** (người dùng chọn 2026-11-05). Luật: file 13 (dựng cảnh) + file 14 (casting). **Bộ giọng ĐÃ CHỐT 2026-11-06** (người dùng nghe mẫu 12 giọng trong `audio/voice-test/`). Map giọng/tốc độ nằm trong `tools/build_lines.py`.

## 1. Người kể (khóa cả dự án)
**NARRATOR** — `bm_george` en-gb speed 0.80. Điềm tĩnh, hóm khô. Vai "thanh tra hồ sơ" (ba nghi phạm): đôi khi hỏi cung nhân chứng, đôi khi nói thẳng với khán giả ("these two I made up"). Không lạm dụng.

## 2. Dàn nhân vật (low-poly: thân trụ, đầu hình cầu/khối, đạo cụ nhận diện; mỗi người đọc được từ silhouette)

| Nhân vật | Loại | Tính cách / muốn gì / sợ gì | Cách nói | Model (low-poly) | Giọng đề xuất |
|---|---|---|---|---|---|
| **Constantine XI** | thật | mệt mỏi, tự trọng, hài khô; muốn giữ thành, sợ làm hoàng đế cuối cùng; không có tiền | câu ngắn, mỉa nhẹ chính mình | áo choàng tím + mũ vành vàng, râu; lưng hơi gù | `bm_fable` @0.9 |
| **Sphrantzes** | thật (chancellor, nhà biên niên) | lo âu, thích đếm, tin con số hơn lời hứa | nói nhanh, đính chính, "technically…" | áo xám + cuộn giấy/bút lông to | `bm_daniel` @0.95 |
| **Mehmed II** | thật, 21 tuổi | nóng, sắc, tự tin, tàn nhẫn khi cần; muốn Constantinople; sợ thất bại thứ ba | câu cụt, ra lệnh, bất ngờ trích thơ | khăn xanh lục + áo đỏ thẫm, dáng thẳng, nhỏ nhất nhưng đứng cao nhất (trên gò) | `am_liam` @0.95 |
| **Halil Pasha** ⚠ | thật (đại vizier) | thận trọng, thở dài; ngại cuộc vây | giọng già, "my lord, with respect…" | khăn trắng to, râu bạc | `am_echo` @0.85 |
| **Urban** | thật | thợ đúc pháo; bán hàng giỏi, tham lương, tự tin thái quá | khoe, nói "guarantee" | tạp dề đen, kìm lớn, mặt bồ hóng | `am_adam` @0.92 |
| **Giustiniani** | thật | lính đánh thuê Genoa, chuyên nghiệp, thẳng, mệt; muốn trả công + danh tiếng; sợ bị mắc kẹt | trầm, thực tế, cụt | giáp bạc, mũ sắt, mặt chữ nhật | `am_fenrir` @0.9 |
| **Notaras** | thật (grand duke) | kiêu, giữ của, thù Latin; "đừng đụng pháo của quận tôi" | giọng quý tộc, cao ngạo | áo vàng-xanh, mũ lông | `am_eric` @0.9 |
| **Gennadius** | thật (tu sĩ) | tiên tri điềm gở; cảnh báo | giọng sâu, chậm, kịch | áo đen, mũ tu sĩ, gậy | `am_onyx` @0.8 |
| **Barbaro / các nhân chứng** | thật (qua nhật ký) | Barbaro: Venice, thù Genoa | cằn nhằn | (không cần model, chỉ hiện trong cảnh "nhân chứng") | `am_michael` @0.92 — **một giọng "WITNESS" chung**, tên hiện trên phụ đề |
| **Dimitri** | **FICT** | lính gác trẻ, lo âu, đếm lửa, hay hỏi | hỏi tới tấp, nói mỉa không chủ ý | giáp da, mũ quá rộng, nhỏ | `am_puck` @1.0 |
| **Stavros** | **FICT** | lính già, cụt lủn, chẳng sợ gì, chỉ muốn ăn bánh mì | một-hai chữ, khô | râu bạc, khiên cũ, ăn bánh mì | `bm_lewis` @0.88 |
| **Thuyền trưởng brigantine** | thật (ẩn danh) | thủy thủ bỏ phiếu quay lại | trang trọng | mũ thủy thủ | `am_onyx` @0.9 (trùng giọng Gennadius nhưng khác Part/cảnh) |

Halil Pasha: đã kiểm 2026-11-06 — nguồn thứ cấp (Wikipedia, blog sử) cùng nói ông phản đối cuộc vây (có thể bị nghi nhận hối lộ; tranh cãi). Chưa kiểm bằng Runciman. Census "giữ kín": nguồn thứ cấp trích Sphrantzes: "con số thật chỉ hoàng đế và tôi biết" — đạt mức RECON.

Phiên âm khó: Mehmed (MEH-met), Giustiniani (joo-stin-YAH-nee), Sphrantzes (SFRAN-tzes), Notaras (no-TAH-ras), Gennadius (jen-AY-dee-us), Urban/Orban (ER-ban), Rumeli Hisarı (roo-MEL-ee hiss-ar-UH), Kerkoporta (ker-ko-POR-ta), Mesoteichion (mez-oh-TIE-kee-on).

## 3. Kiến trúc & đạo cụ (mô tả để dựng 3D)
- **Tường Theodosian (trên bộ)**: ~4 dặm, 3 lớp — hào ~60 ft rộng, tường ngoài ~25 ft, tường trong ≥40 ft; tháp vuông/chữ nhật ngắt quãng (low-poly: khối kem `#d9d3c6`, chân tường sẫm hơn, mái tháp ngói đỏ). Thung lũng **Lycus / Mesoteichion**: tường hạ thấp, chỗ trũng, cổng ở đáy, **chỗ đánh chính** (đặt Giustiniani + khu rào chắn).
- **Rào chắn (stauroma)**: đống thùng, đất, gỗ, da thú — khối nâu xám dựng trước tường ngoài bị thủng; ban đêm có người dựng lại (đèn).
- **Kerkoporta**: cửa nhỏ nửa khuất sau tháp ở góc Blachernae (gặp tường Theodosian); cánh gỗ nâu, ô sáng ấm, bậc đá. (tư liệu D: Ducas / Runciman).
- **Hagia Sophia**: khối vuông lớn + vòm chính tròn xám xanh + bán vòm, 4 tháp góc (minaret thêm SAU 1453 — không dựng minaret trước cảnh vào thành).
- **Rumeli Hisarı**: pháo đài hẹp dài, 3 tháp lớn tròn + tháp nhỏ, dựng sát bờ Bosphorus ở chỗ hẹp (~660 m), cờ đỏ.
- **Xích chắn Golden Horn**: dây phao gỗ nổi từ tháp Eugenius sang tường Pera.
- **Đại bác "Basilica" (Urban)**: ống đồng khổng lồ trên bệ gỗ, miệng rộng, dài hơn nhiều so với người; kéo bởi 60 bò (low-poly: bò khối nâu + dây thừng) + 200 người đi hai bên + thợ đường.
- **Trại Ottoman**: lều đỏ/xanh, lửa trại (ánh cam), lều sultan lớn vàng-đỏ trên gò.
- **Tàu**: galley Venice/Genoa (buồm vuông), thuyền Ottoman thấp; **70–80 tàu trên con lăn bôi mỡ** qua đồi Pera.
- **Cầu thùng**: ~1.000 thùng nổi bắc qua thượng nguồn Golden Horn.

## 4. Set list (thế giới 3D dùng lại cả tập)
1. Tháp tường Theodosian (đêm) · 2. Mesoteichion + rào chắn · 3. Kerkoporta · 4. Hagia Sophia (nội/ngoại) · 5. Cung hoàng đế (sơ đẳng) · 6. Hội đồng Edirne (lều/điện) · 7. Rumeli Hisarı + eo biển · 8. Xưởng đúc pháo Urban · 9. Đường kéo pháo (bò) · 10. Golden Horn + xích + đồi Pera + hạm đội · 11. Trại Ottoman đêm · 12. Bến Genoa/tàu · 13. Biển (brigantine) · 14. Quảng trường sau thất thủ.

## 5. Cảnh dựng & nhãn trung thực (DOC / RECON / FICT)
| # | Cảnh | Nhãn | Cơ sở / ghi chú |
|---|---|---|---|
| P1-1 | Dimitri & Stavros đếm lửa (đêm 28/5) | FICT | Số lực lượng: Runciman 110 (<7.000 vs ~80.000) |
| P1-2 | Constantine & Sphrantzes: bản đồ "chấm", tìm cô dâu | RECON | B#2,3,7,8 (đế quốc co lại; hôn nhân hỏng) |
| P1-3 | Dimitri học tường từ Stavros | FICT | Pears 237–242 (ba lớp, Lycus) |
| P1-4 | Hợp nhất Giáo hội 12/12/1452, Gennadius cảnh báo; cãi nhau ngoài phố | RECON/FICT | Pears 203–205; **câu "turban/mitre" của Notaras (Doukas) — ⚠ cần kiểm trong Pears trước khi giữ** |
| P1-5 | Mehmed & Halil bàn pháo đài | RECON ⚠ | Runciman (Rumeli xong 31/8/1452); lập trường Halil chưa trong bảng |
| P1-6 | Thuyền Venice, Rizzo | DOC (tường thuật) | Runciman — không đùa |
| P1-7 | Urban chào hàng Constantine → Mehmed | RECON | Runciman (lương ×4, "phá tường Babylon") |
| P1-8 | Sphrantzes điều tra dân số bí mật: 4.983 | RECON ⚠ | Pears 247–248; chi tiết "giữ kín" cần xác minh trong Phrantzes |
| P2-1 | Giustiniani đến, nhận chức Protostrator | RECON | B#10 |
| P2-2 | Dimitri/Stavros: rào chắn "chiếc sofa" | FICT | Pears 307–310 |
| P2-3 | Hạm đội: 4 tàu vượt, Baltoglu bị đánh | DOC | Pears 260ff |
| P2-4 | Tàu "đi bộ" qua đồi (22/4) | RECON/FICT | Pears; Runciman |
| P2-5 | John Grant đào hầm ngược | RECON | Pears |
| P2-6 | Notaras ≠ Giustiniani: pháo của quận | RECON | Pears 300–307 |
| P2-7 | Điềm báo + Dimitri/Stavros | FICT | Pears 298 ("khó nói phần nào là huyền thoại"); nguyệt thực 22/5 (Runciman, E) |
| P2-8 | Brigantine quay về thành (3→23/5) | DOC/RECON | Pears: "duty is to return" |
| P3-1 | Mehmed chia thứ tự tấn công | RECON | Pears 334–352 |
| P3-2 | Giustiniani trúng đạn; Constantine năn nỉ | RECON | Runciman 163–165 |
| P3-3 | Kerkoporta: Dimitri/Stavros + Bocchiardi | FICT/RECON | Ducas vs Runciman — nói rõ là tranh cãi |
| P3-4 | "Phiên tòa": nhân chứng về cái chết Constantine | DOC (tóm tắt 5/8 nguồn) | Pears 352–357 |
| P3-5 | Mehmed vào Hagia Sophia; bài thơ nhện; Gennadius | DOC/RECON | Pears 372–384 (câu "What a city we have given…" **không dùng**, nguồn ?) |

## 6. Running gags / callback
1. **Đếm** — Dimitri không đếm nổi lửa (P1) → Sphrantzes đếm quân: 4.983 (P1) → Critobulus đếm người chết/nô lệ (P3), lúc đó không còn đùa.
2. **"Eat your bread"** — Stavros → bánh mì cuối cùng (P3, im lặng thay vì lời).
3. **Chiếc cửa không ai khóa** — "who's closing it?" (P1 bàn về cửa; P3 trả lại).
4. **Gratitude is not on the payroll** — Urban / Mehmed trả lương gấp bốn (P1) → Giustiniani "where's the pay" (P2).
5. **"The soft part"** — Mesoteichion (P1) → Giustiniani (P2) → chuỗi nhân quả (P3).
