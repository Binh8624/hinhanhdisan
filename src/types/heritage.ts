export type VersionType =
  | 'Bản gốc'
  | 'Bản sao'
  | 'Bản số hóa'
  | 'Ảnh chụp'
  | 'Tư liệu phái sinh'
  | 'Bản số của bản gốc'
  | 'Bản số của bản sao';

export type OriginalCondition =
  | 'Tốt'
  | 'Hư hại nhẹ'
  | 'Hư hại nặng'
  | 'Không rõ';

export type VerificationLevel =
  | 'Đã kiểm'
  | 'Chưa kiểm'
  | 'Chưa đọc được';

export type VisibilityStatus = 'public' | 'hidden' | 'takedown_pending' | 'draft';

export type ImageRightsStatus =
  | 'Ảnh được phép xem'
  | 'Ảnh được phép công bố'
  | 'Ảnh được phép tải xuống'
  | 'Ảnh chỉ được sử dụng trong phạm vi nhất định'
  | 'Ảnh chưa xác minh quyền'
  | 'Ảnh bị yêu cầu tạm ẩn'
  | 'Ảnh bị thu hồi sự đồng ý'
  | 'Ảnh không được phép khai thác';

export type FileCategory =
  | 'original_master'
  | 'preservation_copy'
  | 'access_copy'
  | 'rights_evidence'
  | 'display_web'
  | 'copy_file';

export type PermissionStatus =
  | 'Chưa yêu cầu'
  | 'Đã gửi yêu cầu'
  | 'Đang chờ xác nhận'
  | 'Đã xác nhận'
  | 'Chỉ cho phép xem'
  | 'Cho phép hiển thị ảnh'
  | 'Cho phép tải bản giới hạn'
  | 'Cho phép tải bản độ phân giải cao'
  | 'Cho phép sử dụng trong học tập'
  | 'Cho phép sử dụng trong nghiên cứu'
  | 'Không cho phép sử dụng'
  | 'Hết hiệu lực'
  | 'Đã rút lại'
  | 'Chưa đủ bằng chứng';

export type RightsHolderRoleType =
  | 'Chủ sở hữu hiện vật'
  | 'Chủ sở hữu vật mang tin'
  | 'Người lưu giữ'
  | 'Người đang lưu giữ'
  | 'Người tạo lập tư liệu'
  | 'Người tạo ra nội dung'
  | 'Tác giả'
  | 'Chủ sở hữu quyền tác giả'
  | 'Người chụp ảnh'
  | 'Người số hóa'
  | 'Người đại diện gia đình'
  | 'Người đại diện dòng họ'
  | 'Đơn vị quản lý'
  | 'Người được ủy quyền khai thác'
  | 'Người được ủy quyền'
  | 'Chủ thể có quyền cho phép công bố'
  | 'Người cho phép công bố';

export type SourceType =
  | 'Nguồn chính thống'
  | 'Nguồn lưu trữ'
  | 'Nguồn bảo tàng'
  | 'Nguồn học thuật'
  | 'Nguồn xuất bản'
  | 'Nguồn do người đang lưu giữ cung cấp';

export type LinkCheckStatus = 'Chưa kiểm tra' | 'Hoạt động' | 'Không truy cập được';

export type RightsVerdict =
  | 'ĐƯỢC PHÉP THEO PHẠM VI ĐÃ XÁC NHẬN'
  | 'CẦN XIN PHÉP'
  | 'CHỈ ĐƯỢC XEM'
  | 'CHƯA ĐỦ BẰNG CHỨNG'
  | 'KHÔNG ĐƯỢC PHÉP';

export interface HeritageRecord {
  id: string;
  // 15 Dublin Core Core Elements
  dcTitle: string;
  dcCreator: string;
  dcSubject: string;
  dcDescription: string;
  dcPublisher: string;
  dcContributor: string;
  dcDate: string;
  dcType: string;
  dcFormat: string;
  dcIdentifier: string;
  dcSource: string;
  dcLanguage: string;
  dcRelation: string;
  dcCoverage: string;
  dcRights: string;
  // 23 Extended Fields (16-38)
  currentCustodyLocation: string;
  historicalCreationLocation: string;
  displayedVersionType: VersionType;
  originalCondition: OriginalCondition;
  registrationNumber: string;
  publicationAuthorizer: string;
  authorizerRole: string;
  consentDate: string;
  allowedScope: string;
  allowedDuration: string;
  usageConditions: string;
  nonDisclosedParts: string;
  verificationLevel: VerificationLevel;
  verifierName: string;
  verificationDate: string;
  digitizerName: string;
  digitizationDate: string;
  originalFileInfo: string;
  displayFileInfo: string;
  originalDigitalRelation: string;
  rightsHistorySummary: string;
  uncertainPoints: string;
  sourceReferenceIds: string[];
  // Operational status fields
  rightsStatus: string;
  visibilityStatus: VisibilityStatus;
  canDisplayImage: boolean;
  canDownload: boolean;
  recordGroup?: string;
  publicVerificationBasis?: string;
  dimensions?: string;
  material?: string;
  identifyingFeatures?: string;
  locationDisclosureLevel?: string;
  createdByUid?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordVersion {
  id: string;
  recordId: string;
  versionType: VersionType;
  derivedFromVersionId?: string;
  derivedFromDescription: string;
  creatorOrDigitizer: string;
  digitizingUnit?: string;
  createdDateLabel: string;
  conditionOrQuality?: string;
  notes?: string;
  createdAt: string;
}

export interface RecordFile {
  id: string;
  recordId: string;
  fileCategory: FileCategory;
  caption: string;
  sourceCredit: string;
  photographerOrProvider?: string;
  versionType: VersionType;
  imageStatus: ImageRightsStatus;
  allowedImageScope?: string;
  rightsBasisSummary?: string;
  resolution?: string;
  fileSizeKb?: number;
  createdDateLabel?: string;
  displayAllowed: boolean;
  downloadAllowed: boolean;
  isPubliclyReadable: boolean;
  viewScope?: 'Toàn trang' | 'Cận cảnh' | 'Khác';
  mediaUrl?: string;
  createdAt: string;
}

export interface RecordHolder {
  id: string;
  recordId: string;
  holderName: string;
  holderType: 'Gia đình' | 'Dòng họ' | 'Ban quản lý di tích' | 'Bảo tàng' | 'Trung tâm lưu trữ' | 'Cá nhân' | 'Tổ chức khác';
  publicLocationGeneral: string;
  custodyBasis?: string;
  disclosurePolicy: 'Công khai địa danh hành chính chung' | 'Hạn chế vị trí chi tiết';
  verificationStatus: 'Đã kiểm' | 'Chưa kiểm' | 'Chưa đủ bằng chứng';
  createdAt: string;
}

export interface RightsHolder {
  id: string;
  recordId: string;
  subjectName: string;
  roleType: RightsHolderRoleType;
  roleBasis: string;
  relatedRightsScope: string;
  evidenceSummary: string;
  verificationStatus: 'Đã xác minh' | 'Chưa xác minh' | 'Đang chờ bổ sung';
  createdByUid?: string;
  createdAt: string;
}

export interface PermissionRecord {
  id: string;
  recordId: string;
  status: PermissionStatus;
  allowsDisplay: boolean;
  allowsDownloadLimited: boolean;
  allowsDownloadHighRes: boolean;
  allowsStudy: boolean;
  allowsResearch: boolean;
  allowsEdit: boolean;
  allowsPrint: boolean;
  allowsCommercial: boolean;
  prohibitedActs?: string;
  updatedAt: string;
}

export interface PermissionScope {
  id: string;
  permissionId: string;
  recordId: string;
  scopeName: string;
  isAllowed: boolean;
  conditions?: string;
  expiryDate?: string;
  createdAt: string;
}

export interface SourceReference {
  id: string;
  name: string;
  organizationOrAuthor: string;
  sourceType: SourceType;
  url: string;
  publishedDate?: string;
  accessedDate: string;
  usedContentSummary: string;
  linkStatus: LinkCheckStatus;
  isOfficialSource: boolean;
  createdAt: string;
}

export interface RecordSourceLink {
  id: string;
  recordId: string;
  sourceId: string;
  supportedInfo: string;
  createdAt: string;
}

export interface VerificationLog {
  id: string;
  recordId: string;
  previousLevel: VerificationLevel;
  newLevel: VerificationLevel;
  verifierUid?: string;
  verifierName: string;
  notes: string;
  verifiedAt: string;
}

export interface UsageRequest {
  id: string;
  requesterName: string;
  organization: string;
  contactInfo: string;
  recordIdentifier: string;
  purpose: string;
  scope: string;
  usageFormat: string;
  duration: string;
  pledgeAccepted?: boolean;
  additionalNotes?: string;
  status: 'Mới tiếp nhận' | 'Đang xem xét' | 'Chấp thuận có điều kiện' | 'Từ chối' | 'Cần bổ sung hồ sơ';
  createdAt: string;
  updatedAt: string;
}

export type ComplaintRequestCategory =
  | 'Báo cáo sử dụng hình ảnh trái phép'
  | 'Yêu cầu tạm ẩn hình ảnh'
  | 'Yêu cầu gỡ bỏ tư liệu'
  | 'Yêu cầu chỉnh sửa thông tin sai lệch';

export interface AttachmentMetadata {
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}

export interface TakedownRequest {
  id: string;
  requestCategory: ComplaintRequestCategory;
  requesterName: string;
  requesterRole: string;
  contactInfo: string;
  recordIdentifier: string;
  reason: string;
  affectedScope: string;
  rightsBasisDescription?: string;
  supportingUrl?: string;
  attachmentMeta?: AttachmentMetadata;
  status: 'Tiếp nhận khẩn' | 'Đã tạm ẩn hiển thị' | 'Đang xác minh căn cứ' | 'Đã xử lý' | 'Đã khôi phục có căn cứ';
  createdAt: string;
  updatedAt: string;
}

export interface ConsentRecord {
  id: string;
  recordIds: string[];
  consenterName: string;
  consenterRole: string;
  consentDate: string;
  allowedScopes: string[];
  conditions?: string;
  expiryDate?: string;
  evidenceSummary: string;
  effectiveStatus: PermissionStatus;
  recordedByName: string;
  receivedDate?: string;
  withdrawnAt?: string;
  withdrawalReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordRelationship {
  id: string;
  sourceRecordId: string;
  targetRecordId: string;
  sourceVersionType: VersionType;
  targetVersionType: VersionType;
  relationshipType:
    | 'Tạo bản sao từ bản gốc'
    | 'Số hóa từ bản gốc'
    | 'Số hóa từ bản sao'
    | 'Phục dựng từ tư liệu'
    | 'Chụp lại từ xuất bản phẩm'
    | 'Tư liệu cùng bộ';
  notes?: string;
  createdAt: string;
}

export type AppRoute =
  | '/'
  | '/tra-cuu'
  | '/tu-lieu'
  | '/quyen-so-huu'
  | '/su-dong-y'
  | '/ban-goc-ban-sao'
  | '/kiem-tra-quyen'
  | '/yeu-cau-su-dung'
  | '/khieu-nai-go-bo'
  | '/nguon-tu-lieu'
  | '/cam-nang-phap-ly'
  | '/tro-ly-ai'
  | '/gioi-thieu'
  | '/bao-cao-kiem-thu';
