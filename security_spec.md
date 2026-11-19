# Đặc tả Bảo mật Firestore — Dự án Di Sản Số (J02)

## 1. Bất biến Dữ liệu (Data Invariants)
1. **Bảo vệ thông tin riêng tư & Bằng chứng (PII & Evidence Isolation)**:
   - Không khách truy cập công khai nào được đọc `rights_evidence`, `usage_requests`, `takedown_requests`, `users/{uid}/private/*`, hoặc `record_files` loại `original_master` / `rights_evidence`.
2. **Phân quyền Chặt chẽ (RBAC Enforcement)**:
   - Khách truy cập công khai không được tạo/sửa/xóa `heritage_records`, `permissions`, `consent_records`, `rights_holders`, `source_references`.
   - `editor` (Người biên tập) không được tự xác minh hồ sơ (`verificationLevel = 'Đã kiểm'`) và không được tự phê duyệt quyền/sự đồng ý (`canVerifyOrApproveRights()`).
   - Người dùng mới không được tự gán vai trò `admin` hay nâng quyền trong `users/{uid}`.
3. **Ẩn Tư liệu Nhạy cảm & Rút lại Sự đồng ý**:
   - Truy vấn công khai (`allow read` / `allow list`) trên `heritage_records` chỉ trả về hồ sơ có `visibilityStatus == 'public'`. Các hồ sơ `hidden`, `takedown_pending`, `draft` bị chặn ở tầng rule.
4. **Nhật ký Bất biến**:
   - `audit_logs` và `verification_logs` không cho phép sửa hoặc xóa (`allow update, delete: if false`).
5. **Khách gửi Yêu cầu Không cần Đăng nhập Nhưng Không được Đọc Dữ liệu Người khác**:
   - `usage_requests` và `takedown_requests` cho phép `create` công khai với dữ liệu hợp lệ và trạng thái khởi tạo cố định (`Mới tiếp nhận` / `Tiếp nhận khẩn`), nhưng `read` / `update` chỉ dành cho nhân sự có thẩm quyền.

## 2. Bộ 12 Payload Tấn công ("Dirty Dozen" Payloads)
1. **Self-Privilege Escalation (`users/{uid}`)**: Tạo user mới với `roleId: "admin"` bởi người dùng thường -> `PERMISSION_DENIED`.
2. **Role Tampering (`users/{uid}`)**: Cập nhật `roleId` từ `"editor"` lên `"admin"` -> `PERMISSION_DENIED`.
3. **Public Record Tampering (`heritage_records/{id}`)**: Khách ẩn danh tạo/sửa hồ sơ di sản -> `PERMISSION_DENIED`.
4. **Shadow Field Injection (`heritage_records/{id}`)**: Nhân sự gửi thêm trường lạ `isApprovedByMagic: true` -> `PERMISSION_DENIED`.
5. **Editor Self-Verification Bypass (`heritage_records/{id}`)**: `editor` tự đổi `verificationLevel` thành `"Đã kiểm"` hoặc `canDisplayImage: true` khi không có quyền xác minh -> `PERMISSION_DENIED`.
6. **Evidence Leak (`rights_evidence/{id}`)**: Khách công khai gọi `get`/`list` trên `rights_evidence` -> `PERMISSION_DENIED`.
7. **Master File Leak (`record_files/{id}`)**: Khách công khai đọc tệp `fileCategory: "original_master"` -> `PERMISSION_DENIED`.
8. **Hidden Record Scraping (`heritage_records`)**: Khách công khai query danh sách hồ sơ `hidden` hoặc `takedown_pending` -> `PERMISSION_DENIED`.
9. **Audit Log Tampering (`audit_logs/{id}`)**: Bất kỳ tài khoản nào sửa/xóa bản ghi `audit_logs` -> `PERMISSION_DENIED`.
10. **Usage Request PII Leak (`usage_requests`)**: Khách công khai hoặc người gửi yêu cầu đọc danh sách `usage_requests` chứa email/SĐT người khác -> `PERMISSION_DENIED`.
11. **Usage Request Status Spoofing (`usage_requests/{id}`)**: Khách công khai tạo đơn với `status: "Chấp thuận có điều kiện"` -> `PERMISSION_DENIED`.
12. **ID Poisoning (`heritage_records/{id}`)**: Ghi tài liệu với document ID chứa ký tự đặc biệt hoặc dài > 128 ký tự -> `PERMISSION_DENIED`.
