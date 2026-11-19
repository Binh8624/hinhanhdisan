/**
 * Bộ kiểm thử đặc tả bảo mật Firestore Rules cho kiến trúc Website Công khai Không Quản trị
 */

export interface SecurityTestCase {
  id: string;
  name: string;
  collection: string;
  operation: 'create' | 'update' | 'get' | 'list' | 'delete';
  actor: 'anonymous' | 'authenticated_client';
  expected: 'PERMISSION_DENIED' | 'ALLOWED';
  payloadSummary: string;
}

export const PUBLIC_ONLY_SECURITY_TESTS: SecurityTestCase[] = [
  {
    id: 'SEC-01',
    name: 'Legacy users collection fully locked',
    collection: 'users/{uid}',
    operation: 'get',
    actor: 'authenticated_client',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Mọi truy cập đọc/ghi tới users hoặc users/private đều bị từ chối tuyệt đối',
  },
  {
    id: 'SEC-02',
    name: 'Legacy roles collection fully locked',
    collection: 'roles/{roleId}',
    operation: 'list',
    actor: 'anonymous',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Danh mục phân quyền cũ bị khóa hoàn toàn ở Firestore Rules',
  },
  {
    id: 'SEC-03',
    name: 'Client write to heritage_records denied',
    collection: 'heritage_records/{id}',
    operation: 'create',
    actor: 'authenticated_client',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Không cho phép bất kỳ client nào tự tạo/sửa/xóa hồ sơ tư liệu trên trình duyệt',
  },
  {
    id: 'SEC-04',
    name: 'Hidden or draft record list scraping denied',
    collection: 'heritage_records',
    operation: 'list',
    actor: 'anonymous',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Truy vấn không kèm where visibilityStatus == "public" bị từ chối',
  },
  {
    id: 'SEC-05',
    name: 'Original master file leak to public denied',
    collection: 'record_files/{id}',
    operation: 'get',
    actor: 'anonymous',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Tệp có fileCategory = "original_master" hoặc "rights_evidence" luôn bị chặn',
  },
  {
    id: 'SEC-06',
    name: 'Private rights_evidence collection locked',
    collection: 'rights_evidence/{id}',
    operation: 'list',
    actor: 'authenticated_client',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Bằng chứng pháp lý nhạy cảm bị khóa đọc/ghi hoàn toàn khỏi phía client',
  },
  {
    id: 'SEC-07',
    name: 'Audit logs collection locked from client reads/writes',
    collection: 'audit_logs/{id}',
    operation: 'list',
    actor: 'authenticated_client',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Nhật ký nội bộ cũ bị khóa hoàn toàn trên Firestore',
  },
  {
    id: 'SEC-08',
    name: 'Usage request PII read/list denied',
    collection: 'usage_requests',
    operation: 'list',
    actor: 'authenticated_client',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Chặn đọc/liệt kê thông tin liên hệ cá nhân trong usage_requests',
  },
  {
    id: 'SEC-09',
    name: 'Usage request status spoofing denied',
    collection: 'usage_requests/{id}',
    operation: 'create',
    actor: 'anonymous',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Gửi đơn với status khác "Mới tiếp nhận" bị từ chối',
  },
  {
    id: 'SEC-10',
    name: 'Takedown request PII read denied',
    collection: 'takedown_requests/{id}',
    operation: 'get',
    actor: 'anonymous',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Chặn đọc lại nội dung khiếu nại hoặc thông tin liên hệ người gửi',
  },
  {
    id: 'SEC-11',
    name: 'Takedown attachment oversized (>5MB) denied',
    collection: 'takedown_requests/{id}',
    operation: 'create',
    actor: 'anonymous',
    expected: 'PERMISSION_DENIED',
    payloadSummary: 'Gửi attachmentMeta có sizeBytes > 5242880 hoặc mimeType lạ bị từ chối',
  },
  {
    id: 'SEC-12',
    name: 'Valid public usage request create allowed',
    collection: 'usage_requests/{id}',
    operation: 'create',
    actor: 'anonymous',
    expected: 'ALLOWED',
    payloadSummary: 'Khách công khai gửi đơn hợp lệ với status: "Mới tiếp nhận" được chấp nhận',
  },
];
