import type {
  SourceReference,
  RightsHolderRoleType,
  PermissionStatus,
  VersionType,
  OriginalCondition,
  VerificationLevel,
  ImageRightsStatus,
} from '../types/heritage';

export const RECORD_DOCUMENT_TYPES = [
  'Mộc bản',
  'Châu bản',
  'Văn bia',
  'Gia phả',
  'Văn bản Hán Nôm',
  'Văn thơ trên kiến trúc',
  'Bản đúc nổi trên kim loại',
  'Sắc phong',
  'Thư từ',
  'Nhật ký',
  'Ảnh tư liệu',
  'Bản đồ cổ',
  'Hiện vật có hình ảnh số hóa',
];

export const RIGHTS_HOLDER_ROLES: RightsHolderRoleType[] = [
  'Chủ sở hữu hiện vật',
  'Người lưu giữ',
  'Người tạo lập tư liệu',
  'Chủ sở hữu quyền tác giả',
  'Người chụp ảnh',
  'Chủ thể có quyền cho phép công bố',
  'Người được ủy quyền khai thác',
  'Người số hóa',
  'Người đại diện gia đình',
  'Người đại diện dòng họ',
  'Đơn vị quản lý',
];

export const IMAGE_RIGHTS_STATUSES: ImageRightsStatus[] = [
  'Ảnh được phép xem',
  'Ảnh được phép công bố',
  'Ảnh được phép tải xuống',
  'Ảnh chỉ được sử dụng trong phạm vi nhất định',
  'Ảnh chưa xác minh quyền',
  'Ảnh bị yêu cầu tạm ẩn',
  'Ảnh bị thu hồi sự đồng ý',
  'Ảnh không được phép khai thác',
];

export const PERMISSION_STATUSES: PermissionStatus[] = [
  'Chưa yêu cầu',
  'Đã gửi yêu cầu',
  'Đang chờ xác nhận',
  'Đã xác nhận',
  'Chỉ cho phép xem',
  'Cho phép hiển thị ảnh',
  'Cho phép tải bản giới hạn',
  'Cho phép tải bản độ phân giải cao',
  'Cho phép sử dụng trong học tập',
  'Cho phép sử dụng trong nghiên cứu',
  'Không cho phép sử dụng',
  'Hết hiệu lực',
  'Đã rút lại',
  'Chưa đủ bằng chứng',
];

export const VERSION_TYPES: VersionType[] = [
  'Bản gốc',
  'Bản sao',
  'Bản số hóa',
  'Ảnh chụp',
  'Tư liệu phái sinh',
  'Bản số của bản gốc',
  'Bản số của bản sao',
];

export const ORIGINAL_CONDITIONS: OriginalCondition[] = [
  'Tốt',
  'Hư hại nhẹ',
  'Hư hại nặng',
  'Không rõ',
];

export const VERIFICATION_LEVELS: VerificationLevel[] = [
  'Đã kiểm',
  'Chưa kiểm',
  'Chưa đọc được',
];

// Official verified documentary heritage & legal anchor directory (verified live on 2026-11-18)
export const INITIAL_OFFICIAL_SOURCES: SourceReference[] = [
  {
    id: 'src_dsvh_doc_heritage',
    name: 'Danh mục Di sản tư liệu Việt Nam — Cục Di sản văn hóa',
    organizationOrAuthor: 'Cục Di sản văn hóa — Bộ Văn hóa, Thể thao và Du lịch',
    sourceType: 'Nguồn chính thống',
    url: 'https://dsvh.gov.vn/di-san-tu-lieu-1761',
    publishedDate: 'Cập nhật đến 2024',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Danh sách chính thức 10 Di sản tư liệu Việt Nam được UNESCO ghi danh (2009–2024), năm ghi danh và địa điểm lưu giữ.',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_unesco_mow_woodblocks',
    name: 'UNESCO Memory of the World — Woodblocks of Nguyen Dynasty',
    organizationOrAuthor: 'UNESCO Memory of the World Programme',
    sourceType: 'Nguồn chính thống',
    url: 'https://www.unesco.org/en/memory-world/woodblocks-nguyen-dynasty',
    publishedDate: '31/07/2009',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Hồ sơ ghi danh Di sản tư liệu thế giới Mộc bản triều Nguyễn trên cổng UNESCO chính thức.',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_unesco_mow_woodblocks_pdf',
    name: 'Hồ sơ đề cử UNESCO Mộc bản triều Nguyễn (PDF)',
    organizationOrAuthor: 'UNESCO / Cục Văn thư và Lưu trữ nhà nước Việt Nam',
    sourceType: 'Nguồn lưu trữ',
    url: 'https://media.unesco.org/sites/default/files/webform/mow001/vietnam_woodblocks_of_nguyen_dynasty.pdf',
    publishedDate: '2008',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Tài liệu đề cử gốc mô tả khối lượng 34.555 tấm mộc bản, chủ đề, ngôn ngữ Hán-Nôm và bảo quản tại Trung tâm Lưu trữ quốc gia IV.',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_archives_cb_intro',
    name: 'Châu bản triều Nguyễn — Di sản tư liệu thế giới (Giới thiệu)',
    organizationOrAuthor: 'Cục Văn thư và Lưu trữ nhà nước — Trung tâm Lưu trữ quốc gia I',
    sourceType: 'Nguồn lưu trữ',
    url: 'https://www.archives.org.vn/chau-ban-trieu-nguyen/gioi-thieu.htm',
    publishedDate: '17/07/2019',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Giới thiệu khối Châu bản triều Nguyễn (1802–1945), bút tích châu phê của hoàng đế và giá trị lịch sử – hành chính.',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_archives_cb_mgmt',
    name: 'Hình thành và quản lý Châu bản trong hệ thống lưu trữ triều Nguyễn (1802–1945)',
    organizationOrAuthor: 'Cục Văn thư và Lưu trữ nhà nước',
    sourceType: 'Nguồn lưu trữ',
    url: 'https://www.archives.org.vn/gioi-thieu-tai-lieu-nghiep-vu/hinh-thanh-va-quan-ly-chau-ban-trong-he-thong-luu-tru-trieu-nguyen-1802-1945.htm',
    publishedDate: '22/01/2026',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Phân tích quá trình hình thành văn thư Nội các triều Nguyễn và hiện trạng bảo quản bản gốc độc bản tại Trung tâm Lưu trữ quốc gia I (Hà Nội).',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_archives_exhibition',
    name: 'Triển lãm trực tuyến Chạm dấu thời gian hành chính Việt Nam 1802–1945',
    organizationOrAuthor: 'Cục Văn thư và Lưu trữ nhà nước',
    sourceType: 'Nguồn lưu trữ',
    url: 'https://www.archives.org.vn/tin-noi-bat/trien-lam-truc-tuyen-cham-dau-thoi-gian-hanh-chinh-viet-nam-1802-1945.htm',
    publishedDate: 'CHƯA XÁC ĐỊNH',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Thông tin triển lãm trực tuyến về tài liệu hành chính triều Nguyễn (ghi nhận phản hồi HTTP 200 từ kiểm tra tiêu đề ban đầu, cần kiểm tra độ ổn định kết nối trực tiếp).',
    linkStatus: 'Chưa kiểm tra',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_unesco_mow_list',
    name: 'Danh mục Di sản tư liệu Ký ức Thế giới UNESCO (International Register)',
    organizationOrAuthor: 'UNESCO',
    sourceType: 'Nguồn chính thống',
    url: 'https://www.unesco.org/en/memory-world/list',
    publishedDate: 'Cập nhật định kỳ',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Danh mục quốc tế xác nhận các hồ sơ Việt Nam đã được UNESCO ghi danh ở cấp độ toàn cầu.',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_unesco_saving_woodblocks',
    name: 'Bài viết UNESCO: Saving Nguyen Dynasty Woodblocks',
    organizationOrAuthor: 'UNESCO',
    sourceType: 'Nguồn chính thống',
    url: 'https://www.unesco.org/en/articles/saving-nguyen-dynasty-woodblocks',
    publishedDate: 'CHƯA XÁC ĐỊNH',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Tài liệu tham khảo UNESCO về công tác bảo tồn Mộc bản triều Nguyễn (kiểm tra tự động ngày 18/11/2026 gặp ngắt kết nối TCP từ máy chủ, cần kiểm tra trực tiếp lại).',
    linkStatus: 'Không truy cập được',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_vanban_luat_di_san_45_2024',
    name: 'Luật Di sản văn hóa số 45/2024/QH15 (CSDL Văn bản Chính phủ)',
    organizationOrAuthor: 'Quốc hội nước CHXHCN Việt Nam — Cổng TTĐT Chính phủ',
    sourceType: 'Nguồn chính thống',
    url: 'https://vanban.chinhphu.vn/?classid=1&docid=212473&pageid=27160&typegroupid=3',
    publishedDate: '23/11/2024',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Văn bản quy phạm pháp luật gốc quy định về di sản tư liệu (Chương IV, Điều 53–63), bản sao di sản tư liệu (Điều 63) và khai thác môi trường số.',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_vanban_luat_shtt_160_2026',
    name: 'Văn bản hợp nhất số 160/2026/VBHN-LQ-VPQH: Luật Sở hữu trí tuệ',
    organizationOrAuthor: 'Văn phòng Quốc hội — Cổng TTĐT Chính phủ',
    sourceType: 'Nguồn chính thống',
    url: 'https://vanban.chinhphu.vn/?docid=219876&pageid=27160',
    publishedDate: '29/09/2026',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Văn bản hợp nhất Luật Sở hữu trí tuệ dùng để đối chiếu quyền tác giả, tác phẩm phái sinh, ảnh chụp và phạm vi ngoại lệ nghiên cứu – lưu trữ.',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_dublin_core_dcmi',
    name: 'Dublin Core Metadata Initiative (DCMI)',
    organizationOrAuthor: 'Dublin Core Metadata Initiative',
    sourceType: 'Nguồn học thuật',
    url: 'https://www.dublincore.org',
    publishedDate: 'Chuẩn ISO 15836',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Chuẩn mô tả 15 trường lõi Dublin Core Metadata Element Set áp dụng cho hồ sơ tư liệu số.',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
  {
    id: 'src_cong_bao_chinh_phu',
    name: 'Công báo nước Cộng hòa Xã hội Chủ nghĩa Việt Nam',
    organizationOrAuthor: 'Văn phòng Chính phủ',
    sourceType: 'Nguồn chính thống',
    url: 'https://congbao.chinhphu.vn',
    publishedDate: 'Cập nhật thường xuyên',
    accessedDate: '2026-11-18',
    usedContentSummary: 'Đầu mối đối chiếu Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 và các văn bản dưới luật đã công bố chính thức.',
    linkStatus: 'Hoạt động',
    isOfficialSource: true,
    createdAt: '2026-11-18T00:00:00.000Z',
  },
];

export interface LegalTopicEntry {
  id: string;
  topic: string;
  category: string;
  summaryPrinciple: string;
  referencedDocuments: string[];
  verificationStatus: 'ĐÃ ĐỐI CHIẾU CỔNG VĂN BẢN CHÍNH PHỦ' | 'ĐANG CHỜ ĐỐI CHIẾU VĂN BẢN GỐC' | 'CHUẨN KỸ THUẬT QUỐC TẾ';
  practicalGuidance: string;
  officialCheckUrl: string;
}

export const LEGAL_HANDBOOK_TOPICS: LegalTopicEntry[] = [
  {
    id: 'legal-01',
    topic: 'Khái niệm, phân loại và quản lý di sản tư liệu (Chương IV Luật Di sản văn hóa 2024)',
    category: 'Luật Di sản văn hóa 45/2024/QH15',
    summaryPrinciple:
      'Luật Di sản văn hóa số 45/2024/QH15 (thông qua 23/11/2024, có hiệu lực 01/07/2025) quy định riêng Chương IV (Điều 53–63) cho Di sản tư liệu. Điều 53 xác định di sản tư liệu gồm hai thành tố là nội dung thông tin và vật mang tin (bao gồm tài liệu số). Điều 60 quy định chế độ quản lý, bảo vệ và nghiêm cấm kinh doanh, mua bán, chuyển giao trái phép di sản tư liệu thuộc sở hữu toàn dân.',
    referencedDocuments: [
      'Luật Di sản văn hóa số 45/2024/QH15 — Chương IV (Điều 53 đến Điều 63)',
      'Đầu mối xác thực docid=212473 trên vanban.chinhphu.vn (luat45.pdf, luat45_tiep.pdf)',
    ],
    verificationStatus: 'ĐÃ ĐỐI CHIẾU CỔNG VĂN BẢN CHÍNH PHỦ',
    practicalGuidance:
      'Tách biệt rõ chủ sở hữu vật mang tin (gia đình, dòng họ, cơ quan lưu trữ) với quyền công bố và quyền khai thác hình ảnh số trên môi trường mạng.',
    officialCheckUrl: 'https://vanban.chinhphu.vn/?classid=1&docid=212473&pageid=27160&typegroupid=3',
  },
  {
    id: 'legal-02',
    topic: 'Bản sao di sản tư liệu và phân biệt bản gốc – bản sao – bản số hóa – ảnh chụp – phái sinh',
    category: 'Bản sao & Phiên bản tư liệu',
    summaryPrinciple:
      'Điều 63 Luật Di sản văn hóa số 45/2024/QH15 quy định về bản sao di sản tư liệu phục vụ bảo vệ bản gốc, trưng bày và nghiên cứu. Trên môi trường số, bản sao, bản số hóa, ảnh chụp và tư liệu phái sinh bắt buộc phải ghi rõ nguồn gốc tạo lập, đơn vị thực hiện và không được trình bày sai lệch thành bản gốc.',
    referencedDocuments: [
      'Luật Di sản văn hóa số 45/2024/QH15 — Điều 63 về bản sao di sản tư liệu',
      'Nghị định và thông tư hướng dẫn thi hành Luật 45/2024/QH15 (đang chờ đối chiếu toàn văn bản hướng dẫn)',
    ],
    verificationStatus: 'ĐANG CHỜ ĐỐI CHIẾU VĂN BẢN GỐC',
    practicalGuidance:
      'Luôn gắn nhãn phân loại cụ thể (Bản gốc, Bản sao, Bản số hóa, Ảnh chụp, Tư liệu phái sinh) và giữ tệp chủ gốc riêng khỏi tệp hiển thị công khai.',
    officialCheckUrl: 'https://vanban.chinhphu.vn/?classid=1&docid=212473&pageid=27160&typegroupid=3',
  },
  {
    id: 'legal-03',
    topic: 'Quyền tác giả, quyền đối với ảnh chụp và tác phẩm phái sinh',
    category: 'Luật Sở hữu trí tuệ',
    summaryPrinciple:
      'Một ảnh chụp hiện vật hoặc bản số hóa có thể làm phát sinh quyền tác giả hoặc quyền liên quan của người chụp/người thực hiện nếu có tính sáng tạo, đồng thời vẫn chịu sự chi phối của chủ sở hữu vật mang tin gốc và quy chế của nơi lưu giữ (bảo tàng, trung tâm lưu trữ, dòng họ). Không tự suy diễn hình ảnh nhìn thấy trên Internet là được phép tải xuống hoặc tái sử dụng.',
    referencedDocuments: [
      'Văn bản hợp nhất số 160/2026/VBHN-LQ-VPQH ngày 29/09/2026: Luật Sở hữu trí tuệ',
      'Đầu mối tra cứu toàn văn docid=219876 trên CSDL Văn bản Chính phủ',
    ],
    verificationStatus: 'ĐÃ ĐỐI CHIẾU CỔNG VĂN BẢN CHÍNH PHỦ',
    practicalGuidance:
      'Quản lý trạng thái quyền độc lập cho từng tệp ảnh theo 8 mức độ cụ thể và khóa tải xuống khi chưa có văn bản chấp thuận hoặc giấy phép hợp lệ.',
    officialCheckUrl: 'https://vanban.chinhphu.vn/?docid=219876&pageid=27160',
  },
  {
    id: 'legal-04',
    topic: 'Bảo vệ dữ liệu cá nhân, quyền riêng tư gia đình – dòng họ và rút lại sự đồng ý',
    category: 'Dữ liệu cá nhân & Quyền riêng tư',
    summaryPrinciple:
      'Tư liệu gia đình, gia phả, thư từ, nhật ký thường chứa thông tin của người còn sống, địa chỉ nhà riêng, vị trí cất giữ tài sản quý hoặc các chi tiết đời tư. Chủ thể quyền có quyền đặt điều kiện phạm vi sử dụng và có quyền rút lại sự đồng ý hoặc yêu cầu tạm ẩn bất cứ lúc nào.',
    referencedDocuments: [
      'Luật Bảo vệ dữ liệu cá nhân số 91/2025/QH15 (thông qua 26/06/2025, có hiệu lực 01/01/2026)',
    ],
    verificationStatus: 'ĐANG CHỜ ĐỐI CHIẾU VĂN BẢN GỐC',
    practicalGuidance:
      'Không công khai số điện thoại, địa chỉ nhà riêng của người lưu giữ hay dữ liệu biểu mẫu người gửi. Duy trì kênh công khai tiếp nhận khiếu nại và rút lại đồng ý.',
    officialCheckUrl: 'https://congbao.chinhphu.vn',
  },
  {
    id: 'legal-05',
    topic: 'Quy tắc khai thác, chụp ảnh và trích dẫn tại bảo tàng – trung tâm lưu trữ',
    category: 'Bảo tàng & Trung tâm Lưu trữ',
    summaryPrinciple:
      'Việc tham khảo hoặc chụp ảnh tại bảo tàng, di tích hay phòng đọc Trung tâm Lưu trữ quốc gia phải tuân theo nội quy khai thác tài liệu và quy định bản quyền công bố của đơn vị quản lý. Tệp hiển thị trực tuyến không đồng nghĩa mở quyền tải xuống bản độ phân giải cao.',
    referencedDocuments: [
      'Luật Di sản văn hóa số 45/2024/QH15 — Chương V (Bảo tàng) và Chương VI (Chuyển đổi số, khai thác hình ảnh)',
      'Hệ thống quy chế phòng đọc Cục Văn thư và Lưu trữ nhà nước (archives.org.vn)',
    ],
    verificationStatus: 'ĐANG CHỜ ĐỐI CHIẾU VĂN BẢN GỐC',
    practicalGuidance:
      'Ghi rõ nguồn trích dẫn, mã hồ sơ, đơn vị lưu giữ và ngày truy cập; hướng dẫn người cần bản độ phân giải cao gửi đơn xin phép chính thức.',
    officialCheckUrl: 'https://www.archives.org.vn',
  },
  {
    id: 'legal-06',
    topic: 'Chuẩn mô tả Dublin Core (15 trường lõi) và Chương trình Ký ức Thế giới UNESCO',
    category: 'Chuẩn mô tả & Lưu trữ quốc tế',
    summaryPrinciple:
      'Áp dụng 15 trường lõi Dublin Core Metadata Element Set kết hợp hệ thống tiêu chí tính xác thực, tính độc đáo và tiếp cận minh bạch của Chương trình Ký ức Thế giới UNESCO. Mọi thông tin thiếu bằng chứng phải hiển thị trạng thái chưa xác minh.',
    referencedDocuments: [
      'Dublin Core Metadata Element Set (dublincore.org)',
      'UNESCO Memory of the World Programme (unesco.org/en/memory-world/list)',
    ],
    verificationStatus: 'CHUẨN KỸ THUẬT QUỐC TẾ',
    practicalGuidance:
      'Mỗi hồ sơ trình bày đủ nhận diện, nơi lưu giữ, nguồn tạo, tình trạng bản gốc, quyền độc lập theo ảnh và tối thiểu 2 nguồn đối chiếu.',
    officialCheckUrl: 'https://www.dublincore.org',
  },
];

export function normalizeVietnameseSearch(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .trim();
}
