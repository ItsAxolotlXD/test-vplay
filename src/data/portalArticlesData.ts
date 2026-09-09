export interface PortalArticle {
  id: string;
  portalId: 'tin-tuc' | 'the-thao' | 'am-thuc' | 'chinh-tri' | 'van-hoa' | 'giai-tri';
  title: string;
  summary: string;
  content: string;
  source: string;
  time: string;
  tag: string;
  views?: string;
  featured?: boolean;
}

// Helper to generate a realistic relative time
const getRelativeTime = (index: number) => {
  if (index < 3) return `${(index + 1) * 5} phút trước`;
  if (index < 10) return `${index * 12} phút trước`;
  if (index < 25) return `${Math.floor(index / 3) + 1} giờ trước`;
  if (index < 50) return `${Math.floor(index / 10) + 1} ngày trước`;
  return `${Math.floor(index / 15) + 3} ngày trước`;
};

// Helper to format views
const getViews = (index: number, seed: number) => {
  const count = ((seed * 17 + index * 31) % 95) + 5;
  return `${count}.${(index * 7) % 9}K`;
};

// --- TIN TỨC: 100 ARTICLES ---
const NEWS_HEADLINES: { title: string; summary: string; tag: string; source: string }[] = [
  { title: "Bản tin số hóa kinh tế quốc gia: Tăng tốc hạ tầng số và đô thị thông minh 2026", summary: "Chính phủ ban hành kế hoạch mở rộng mạng lưới trung tâm dữ liệu và phủ sóng công nghệ 5G toàn diện tại các vùng kinh tế trọng điểm.", tag: "Chuyển đổi số", source: "VTV Thời sự" },
  { title: "Diễn đàn kinh tế quốc tế: Việt Nam khẳng định vai trò cầu nối chuỗi cung ứng bền vững", summary: "Các chuyên gia kinh tế nhận định tăng trưởng xuất khẩu công nghệ cao và nông sản hữu cơ giữ nhịp phát triển ấn tượng.", tag: "Kinh tế", source: "Báo Quốc Tế" },
  { title: "Dự báo khí tượng thủy văn: Xu hướng thời tiết giao mùa và khuyến cáo phòng chống hạn mặn", summary: "Trung tâm Dự báo Quốc gia lưu ý các tỉnh Nam Bộ chủ động phương án điều tiết nguồn nước ngọt phục vụ sản xuất nông nghiệp.", tag: "Môi trường", source: "Thời sự VTV4" },
  { title: "Bộ Thông tin và Truyền thông mở rộng phổ tần số thương mại cho mạng di động thế hệ mới", summary: "Hạ tầng mạng viễn thông đạt bước tiến mới khi vùng phủ sóng internet tốc độ cao tiếp tục tiếp cận vùng sâu vùng xa.", tag: "Công nghệ", source: "VTV Digital" },
  { title: "Xuất khẩu nông sản bứt phá mạnh mẽ, mở rộng thị trường tại châu Âu và Trung Đông", summary: "Nhiều lô hàng cà phê, hồ tiêu và sầu riêng chất lượng cao đạt tiêu chuẩn GlobalGAP xuất khẩu chính ngạch thành công.", tag: "Nông nghiệp", source: "Bản tin Thị trường" },
  { title: "Thúc đẩy dự án đường sắt tốc độ cao Bắc - Nam: Hoàn thiện báo cáo tiền khả thi", summary: "Bộ Giao thông Vận tải phối hợp các chuyên gia quốc tế thẩm tra phương án kỹ thuật và cơ chế đầu tư công khai thác hiệu quả.", tag: "Giao thông", source: "Truyền hình Thông tấn" },
  { title: "Hà Nội mở rộng tuyến xe buýt điện thông minh kết nối các khu đô thị vệ tinh", summary: "Hệ thống vận tải hành khách công cộng xanh góp phần giảm thiểu phát thải và nâng cao chất lượng không khí Thủ đô.", tag: "Đô thị", source: "Hà Nội News" },
  { title: "TP.HCM khánh thành cầu vượt nút giao cửa ngõ phía Đông, giải tỏa áp lực giao thông", summary: "Công trình giao thông trọng điểm về đích đúng tiến độ chào mừng ngày lễ lớn, tạo liên kết vùng thông suốt.", tag: "Hạ tầng", source: "HTV Tin tức" },
  { title: "Ngân hàng Nhà nước điều hành linh hoạt chính sách tiền tệ, giữ ổn định tỷ giá", summary: "Mặt bằng lãi suất cho vay duy trì mức hợp lý, tạo trợ lực tài chính cho doanh nghiệp vừa và nhỏ phục hồi sản xuất.", tag: "Tài chính", source: "Thời sự Kinh tế" },
  { title: "Phát triển nguồn nhân lực vi mạch bán dẫn: Liên kết đào tạo sinh viên chất lượng cao", summary: "Các trường đại học kỹ thuật hàng đầu ký kết hợp tác với tập đoàn công nghệ toàn cầu về phòng thí nghiệm chip chuyên dụng.", tag: "Giáo dục", source: "VTV2 Khoa học" },
  { title: "Ứng dụng trí tuệ nhân tạo trong chẩn đoán hình ảnh tại các bệnh viện tuyến đầu", summary: "Giải pháp AI hỗ trợ bác sĩ phát hiện sớm tổn thương phổi và tim mạch với độ chính xác cao vượt trội.", tag: "Y tế", source: "Sức khỏe Đời sống" },
  { title: "Bảo hộ sở hữu trí tuệ cho các sản phẩm OCOP đạt tiêu chuẩn 5 sao quốc gia", summary: "Các đặc sản vùng miền được cấp chứng nhận nhãn hiệu tập thể, nâng tầm giá trị nông sản Việt trên thị trường quốc tế.", tag: "Thương mại", source: "VTV Cần Thơ" },
  { title: "Triển lãm thành tựu khoa học công nghệ: Trưng bày hàng trăm giải pháp tự động hóa", summary: "Các viện nghiên cứu và doanh nghiệp khởi nghiệp giới thiệu robot cứu hộ, máy bay không người lái phục vụ nông nghiệp.", tag: "Khoa học", source: "VTV2" },
  { title: "Chiến dịch làm sạch bờ biển miền Trung thu hút hàng nghìn tình nguyện viên trẻ", summary: "Hoạt động bảo vệ môi trường biển kết hợp tuyên truyền giảm thiểu rác thải nhựa đại dương lan tỏa mạnh mẽ.", tag: "Cộng đồng", source: "VTV8" },
  { title: "Hàng không Việt Nam mở thêm đường bay thẳng kết nối các thủ phủ du lịch quốc tế", summary: "Đường bay thẳng mới rút ngắn thời gian di chuyển, tạo cú hích lớn thu hút du khách quốc tế trải nghiệm di sản Việt.", tag: "Du lịch", source: "VTV Thời sự" },
  { title: "Nâng cấp hệ thống cảng biển nước sâu Cái Mép - Thị Vải đáp ứng siêu tàu container", summary: "Cụm cảng cửa ngõ quốc tế tiếp tục khẳng định vị thế trung tâm trung chuyển hàng hải hàng đầu khu vực Đông Nam Á.", tag: "Logistics", source: "Báo Hải quan" },
  { title: "Hội nghị cấp cao về an ninh năng lượng và phát triển điện gió ngoài khơi", summary: "Thúc đẩy các cam kết Net Zero 2050 thông qua khung chính sách thu hút nguồn vốn đầu tư năng lượng sạch.", tag: "Năng lượng", source: "Thời sự Quốc tế" },
  { title: "Phổ cập chữ ký số cá nhân cho công dân thực hiện dịch vụ công trực tuyến", summary: "Bộ Công an phối hợp các đơn vị cung cấp giải pháp xác thực điện tử an toàn, tiện ích trên ứng dụng VNeID.", tag: "Công nghệ", source: "An ninh TV" },
  { title: "Thị trường bất động sản ghi nhận tín hiệu ấm lên ở phân khúc nhà ở thực", summary: "Nhiều dự án nhà ở xã hội và căn hộ chung cư bình dân được mở bán với chính sách hỗ trợ lãi suất ưu đãi.", tag: "Bất động sản", source: "Kinh tế VTV" },
  { title: "Thanh niên khởi nghiệp đổi mới sáng tạo: Dự án nông nghiệp tuần hoàn đạt giải quốc tế", summary: "Mô hình xử lý phế phụ phẩm nông nghiệp thành phân bón hữu cơ vi sinh của nhóm bạn trẻ nhận giải thưởng danh giá.", tag: "Khởi nghiệp", source: "VTV6 Sáng tạo" }
];

// Generate 100 news items by combining base topics with contextual variants
const generateNewsArticles = (): PortalArticle[] => {
  const articles: PortalArticle[] = [];
  const tags = ["Chuyển đổi số", "Kinh tế", "Xã hội", "Thời sự", "Công nghệ", "Môi trường", "Giao thông", "Hạ tầng", "Y tế", "Giáo dục"];
  const sources = ["VTV Thời sự", "VTV Digital", "Thời sự VTV1", "Truyền hình Thông tấn", "Báo Quốc Tế", "Thời sự Kinh tế", "Bản tin 24/7"];

  for (let i = 1; i <= 100; i++) {
    const base = NEWS_HEADLINES[(i - 1) % NEWS_HEADLINES.length];
    const cycle = Math.floor((i - 1) / NEWS_HEADLINES.length);
    const id = `news-${i}`;
    const tag = tags[(i - 1) % tags.length];
    const source = sources[(i - 1) % sources.length];

    let title = base.title;
    let summary = base.summary;
    if (cycle > 0) {
      const prefixes = [
        "Tiêu điểm hôm nay",
        "Góc nhìn chuyên gia",
        "Cập nhật mới nhất",
        "Báo cáo chuyên sâu"
      ];
      title = `${prefixes[cycle - 1]}: ${base.title} (Phần ${cycle + 1})`;
      summary = `Cập nhật bổ sung về diễn biến: ${base.summary} Những giải pháp hành động thực tiễn đang được tích cực triển khai.`;
    }

    articles.push({
      id,
      portalId: 'tin-tuc',
      title,
      summary,
      content: `${summary} Đây là nội dung tổng hợp từ trung tâm tin tức thời sự chính luận. Các chuyên gia đánh giá cao công tác điều hành bám sát thực tiễn đời sống người dân, tạo nền tảng vững chắc cho sự phát triển toàn diện của quốc gia trong giai đoạn mới.`,
      source,
      time: getRelativeTime(i),
      tag,
      views: getViews(i, 11),
      featured: i <= 3
    });
  }
  return articles;
};

// --- THỂ THAO: 100 ARTICLES ---
const SPORTS_HEADLINES: { title: string; summary: string; tag: string; source: string }[] = [
  { title: "Đội tuyển Việt Nam chuẩn bị kỹ lưỡng cho vòng loại Asian Cup với đội hình tối ưu", summary: "Ban huấn luyện triệu tập kết hợp lứa cầu thủ kinh nghiệm và các nhân tố trẻ giàu nhiệt huyết tại đợt tập trung mới.", tag: "Bóng đá Việt Nam", source: "VTV Thể Thao" },
  { title: "V-League 2026: Cuộc đua vô địch nghẹt thở khi các câu lạc bộ so kè từng điểm số", summary: "Các trận cầu tâm điểm vòng đấu áp chót mang lại cảm xúc vỡ òa cho hàng vạn cổ động viên trên các khán đài.", tag: "V-League", source: "Bình luận Thể thao" },
  { title: "Ngoại hạng Anh: Cuộc rượt đuổi ngôi đầu bảng kịch tính giữa Manchester City, Arsenal và Liverpool", summary: "Các siêu sao bóng đá thế giới liên tục tỏa sáng với những pha lập công đẳng cấp trong những phút bù giờ định mệnh.", tag: "Bóng đá quốc tế", source: "Thể thao 24/7" },
  { title: "Champions League: Các đội bóng hàng đầu châu Âu so tài tại vòng tứ kết knock-out rực lửa", summary: "Những màn đấu trí chiến thuật đỉnh cao giữa các huấn luyện viên danh tiếng cống hiến đêm tiệc bóng đá mãn nhãn.", tag: "Cúp C1", source: "On Sports" },
  { title: "Điền kinh Việt Nam giành thêm 3 huy chương Vàng tại giải vô địch châu Á", summary: "Các chân chạy cự ly trung bình và nhảy xa tiếp tục xác lập kỷ lục cá nhân mới trên đấu trường châu lục.", tag: "Điền kinh", source: "VTV Thể Thao" },
  { title: "Kình ngư trẻ phá kỷ lục bơi lội quốc gia ở cự ly 200m bơi bướm đầy ngoạn mục", summary: "Sự tiến bộ vượt bậc của lứa vận động viên bơi lội thế hệ mới mở ra kỳ vọng lớn tại kỳ đại hội thể thao sắp tới.", tag: "Bơi lội", source: "Bản tin Thể thao" },
  { title: "Giải quần vợt Grand Slam: Trận chung kết lịch sử kéo dài 5 set đấu nghẹt thở", summary: "Những pha cứu bóng không tưởng và bản lĩnh thi đấu kiên cường của tay vợt số một thế giới làm nức lòng người hâm mộ.", tag: "Quần vợt", source: "Thể thao Quốc tế" },
  { title: "Đội tuyển bóng chuyền nữ Việt Nam thi đấu xuất sắc tại giải vô địch các câu lạc bộ thế giới", summary: "Lối đánh biến hóa và tinh thần lăn xả của các cô gái vàng bóng chuyền nhận được sự cổ vũ nồng nhiệt từ khán giả quốc tế.", tag: "Bóng chuyền", source: "VTV5 Thể thao" },
  { title: "Chung kết Esports Liên Minh Huyền Thoại: Nhà vô địch VCS khẳng định đẳng cấp thế giới", summary: "Những pha xử lý giao tranh tổng mẫu mực đưa đội tuyển đại diện Việt Nam bước lên bục vinh quang cao nhất.", tag: "Esports", source: "VTV Game" },
  { title: "Giải đua xe F1 chặng đua đường phố đêm: Bất ngờ lớn ở vòng đua quyết định", summary: "Chiến thuật dừng pit hợp lý cùng khả năng kiểm soát lốp hoàn hảo đem lại chiến thắng cảm xúc cho tay đua trẻ.", tag: "Đua xe F1", source: "Tốc độ 24h" },
  { title: "Cầu lông Việt Nam thăng hạng trên bảng xếp hạng BWF thế giới", summary: "Chiến thắng vang dội trước hạt giống hàng đầu tại giải Master giúp tay vợt nước nhà củng cố vị trí vững chắc.", tag: "Cầu lông", source: "VTV Thể Thao" },
  { title: "Bóng rổ VBA: Trận derby rực lửa thu hút nghìn khán giả phủ kín nhà thi đấu", summary: "Những cú ném 3 điểm clutch ở giây cuối cùng định đoạt tấm vé vào vòng chung kết playoffs nghẹt thở.", tag: "Bóng rổ", source: "VBA News" },
  { title: "Võ thuật cổ truyền Việt Nam gây ấn tượng mạnh tại Liên hoan Võ thuật Thế giới", summary: "Những đòn thế cương nhu phối triển và tinh thần thượng võ dân tộc được bạn bè quốc tế tán thưởng nồng nhiệt.", tag: "Võ thuật", source: "VTV Văn hóa" },
  { title: "Giải marathon quốc tế di sản: Hơn 10.000 vận động viên chạy qua cung đường danh thắng", summary: "Sự kiện thể thao phong trào kết nối tình yêu thể thao và quảng bá vẻ đẹp thiên nhiên kỳ vĩ của đất nước.", tag: "Chạy bộ", source: "Thể thao Cộng đồng" },
  { title: "Chuyển nhượng bóng đá châu Âu: Bom tấn mùa hè chính thức kích hoạt với mức phí kỷ lục", summary: "Ngôi sao tấn công tài năng đặt bút ký hợp đồng dài hạn, hứa hẹn thay đổi diện mạo hàng công câu lạc bộ mới.", tag: "Chuyển nhượng", source: "Thể thao 24/7" },
  { title: "Đội tuyển Futsal Việt Nam sẵn sàng cho giải vô địch châu Á với lối chơi pressing tốc độ", summary: "Toàn đội hoàn thiện các bài tập tình huống cố định và phòng ngự phản công nhằm tạo đột biến.", tag: "Futsal", source: "VTV Thể Thao" },
  { title: "Khai mạc Đại hội Thể thao Sinh viên Toàn quốc: Sân chơi nhiệt huyết của tuổi trẻ", summary: "Hàng nghìn vận động viên sinh viên tranh tài ở 12 môn thể thao với tinh thần trung thực và đoàn kết cao độ.", tag: "Thể thao trẻ", source: "VTV6" },
  { title: "Giải thể thao biển quốc tế: Lướt ván diều và chèo SUP bùng nổ tại bãi biển Nha Trang", summary: "Thời tiết lý tưởng và sóng gió thuận lợi mang đến những màn biểu diễn kỹ thuật điêu luyện của các vận động viên.", tag: "Thể thao biển", source: "VTV8 Thể thao" },
  { title: "Bắn súng Việt Nam xuất sắc giành vé chính thức tham dự Thế vận hội Olympic", summary: "Độ chuẩn xác và tâm lý thép ở phát đạn quyết định giúp xạ thủ mang về vinh quang cho thể thao nước nhà.", tag: "Bắn súng", source: "VTV Thể Thao" },
  { title: "Xây dựng hạ tầng thể thao học đường: Nâng cao tầm vóc và thể lực cho thế hệ trẻ", summary: "Chương trình đổi mới giáo dục thể chất kết hợp phát hiện năng khiếu thể thao từ lứa tuổi thiếu niên nhi đồng.", tag: "Học đường", source: "Bản tin Thể thao" }
];

const generateSportsArticles = (): PortalArticle[] => {
  const articles: PortalArticle[] = [];
  const tags = ["Bóng đá", "V-League", "Quốc tế", "Quần vợt", "Bơi lội", "Điền kinh", "Esports", "Võ thuật", "Bóng rổ", "Marathon"];
  const sources = ["VTV Thể Thao", "Thể thao 24/7", "On Sports", "Bình luận Thể thao", "Bản tin Thể thao VTV3", "VTV5 Thể thao"];

  for (let i = 1; i <= 100; i++) {
    const base = SPORTS_HEADLINES[(i - 1) % SPORTS_HEADLINES.length];
    const cycle = Math.floor((i - 1) / SPORTS_HEADLINES.length);
    const id = `thethao-${i}`;
    const tag = tags[(i - 1) % tags.length];
    const source = sources[(i - 1) % sources.length];

    let title = base.title;
    let summary = base.summary;
    if (cycle > 0) {
      const prefixes = [
        "Bình luận chuyên sâu",
        "Nhận định chiến thuật",
        "Khoảnh khắc sân cỏ",
        "Tiêu điểm thể thao"
      ];
      title = `${prefixes[cycle - 1]}: ${base.title} (#${cycle + 1})`;
      summary = `Phân tích chi tiết: ${base.summary} Diễn biến các trận cầu và tinh thần thi đấu quả cảm của các vận động viên.`;
    }

    articles.push({
      id,
      portalId: 'the-thao',
      title,
      summary,
      content: `${summary} Bầu không khí sôi động tại các khán đài và tinh thần fair-play tiếp tục lan tỏa năng lượng tích cực tới hàng triệu người hâm mộ thể thao trên khắp cả nước.`,
      source,
      time: getRelativeTime(i),
      tag,
      views: getViews(i, 23),
      featured: i <= 3
    });
  }
  return articles;
};

// --- ẨM THỰC: 100 ARTICLES ---
const CUISINE_HEADLINES: { title: string; summary: string; tag: string; source: string }[] = [
  { title: "Hành trình tìm về hương vị Phở Hà Nội truyền thống: Nghệ thuật ninh nước dùng thanh trong", summary: "Bí quyết chọn xương bò tươi, hoa hồi, thảo quả nướng xém tạo nên bát phở bò bốc khói thơm nức buổi sớm đất Tràng An.", tag: "Món ngon Hà Nội", source: "VTV Ẩm thực" },
  { title: "Bún bò xứ Huế: Tinh hoa cay nồng từ sả ớt, mắm ruốc và sợi bún to tròn đặc trưng", summary: "Món ăn cung đình dân gian hóa làm say lòng thực khách bốn phương bởi vị đậm đà khó quên của nước dùng xương hầm.", tag: "Đặc sản miền Trung", source: "VTV Đặc sản" },
  { title: "Cơm tấm Sài Gòn: Đĩa sườn nướng mỡ hành vàng ươm chuẩn phong vị phố thị phương Nam", summary: "Từ hạt tấm vỡ dân dã đến món ăn đường phố trứ danh được bạn bè quốc tế vinh danh trên bản đồ ẩm thực toàn cầu.", tag: "Món ngon phương Nam", source: "VTV Cần Thơ" },
  { title: "Bánh mì Việt Nam tiếp tục được chuyên trang ẩm thực thế giới xếp hạng đầu bảng", summary: "Vỏ bánh giòn rụm kẹp pate béo ngậy, thịt xá xíu, chả lụa và rau dưa chua thanh mát tạo nên bản hòa ca vị giác hoàn hảo.", tag: "Vang danh thế giới", source: "Ẩm thực 3 miền" },
  { title: "Khám phá hương vị thảo mộc núi rừng Tây Bắc: Hạt dổi, mắc khén và thịt trâu gác bếp", summary: "Gia vị độc nhất vô nhị của đồng bào vùng cao mang lại hương thơm nồng nàn cho các món nướng trên than hồng.", tag: "Ẩm thực Tây Bắc", source: "VTV2 Khám phá" },
  { title: "Bánh xèo giòn rụm miền Tây: Đậm đà tôm đất, thịt ba chỉ và rổ rau rừng tươi xanh", summary: "Tiếng xèo xèo vui tai trên chảo gang đượm lửa, cuốn cùng lá cải cay và chấm nước mắm chua ngọt làm xiêu lòng bao thế hệ.", tag: "Món ngon sông nước", source: "VTV Cần Thơ" },
  { title: "Văn hóa thưởng trà sen Tây Hồ: Nghi thức tao nhã đượm hương thanh khiết mùa hạ", summary: "Từng búp trà Thái Nguyên ướp trong lòng hoa sen Bách Diệp sớm mai lưu giữ hương thơm đất trời tinh tế.", tag: "Trà Việt", source: "VTV Văn hóa" },
  { title: "Cà phê trứng Hà Nội: Sáng tạo độc đáo giữa vị đắng nồng nàn và bọt trứng béo mịn", summary: "Thức uống sáng tạo từ thời kỳ khó khăn nay trở thành biểu tượng du lịch ẩm thực không thể bỏ qua của Thủ đô.", tag: "Cà phê Việt", source: "VTV Vui Sống" },
  { title: "Lẩu mắm miền Tây: Đậm đà hương vị cá linh, cá sặc ăn kèm hơn 20 loại rau đồng nội", summary: "Nồi lẩu thơm phức sôi sùng sục giữa miệt vườn mùa nước nổi phản ánh nét phóng khoáng, hào sảng của con người Nam Bộ.", tag: "Miền Tây", source: "Khám phá Ẩm thực" },
  { title: "Ẩm thực chay thực dưỡng: Xu hướng sống xanh, an lành và thanh lọc tâm hồn", summary: "Nghệ thuật chế biến các món chay từ nấm tươi, củ quả hữu cơ và hạt dinh dưỡng vừa bổ dưỡng vừa đẹp mắt.", tag: "Ẩm thực chay", source: "Sống khỏe mỗi ngày" },
  { title: "Mì Quảng trứ danh: Sợi mì dai vàng óng, nước nhưỡng sánh đậm và bánh tráng mè giòn tan", summary: "Món ăn mộc mạc mang trọn tình cảm của đất và người Quảng Nam trong từng tô mì đậm vị quê hương.", tag: "Miền Trung", source: "VTV8" },
  { title: "Bí quyết làm bánh chưng xanh mướt hạt ngọc ngày Tết: Giữ trọn hồn cốt cội nguồn", summary: "Lá dong rừng, nếp cái hoa vàng dẻo thơm quyện cùng đậu xanh bùi ngậy và thịt lợn ướp tiêu thơm cay nồng nàn.", tag: "Món Tết", source: "VTV Thời sự" },
  { title: "Hải sản tươi sống miền duyên hải: Thưởng thức mực nhảy, tôm hùm tại làng chài bình minh", summary: "Hải sản đánh bắt trong ngày nướng mọi trên bãi biển giữ trọn vị ngọt tự nhiên của biển cả bao la.", tag: "Hải sản", source: "VTV Du lịch" },
  { title: "Chè cung đình Huế: Nét thanh tao trong hàng chục món chè long nhãn, hạt sen, bột lọc bọc heo quay", summary: "Nghệ thuật nấu chè tinh xảo kế thừa từ chốn hoàng cung xưa với vị ngọt thanh tao, không gắt.", tag: "Chè Huế", source: "VTV Huế" },
  { title: "Bún chả Hà Nội nướng than hoa: Nước chấm dưa góp hài hòa làm say lòng thực khách", summary: "Miếng chả băm gói lá xương sông nướng xém cạnh tỏa hương thơm ngào ngạt khắp góc phố cổ ngàn năm.", tag: "Phố cổ", source: "VTV Ẩm thực" },
  { title: "Bánh cuốn Thanh Trì mỏng như tờ lụa chấm nước mắm cà cuống thơm lừng", summary: "Món quà sáng thanh lịch của người Tràng An với hành phi thơm giòn và chả quế béo ngậy ăn kèm.", tag: "Món Hà Nội", source: "Ẩm thực Việt" },
  { title: "Gỏi cuốn tôm thịt: Món ăn thanh mát lọt top những món ngon nhất hành tinh", summary: "Sự kết hợp hoàn hảo giữa tôm luộc đỏ au, thịt ba chỉ, bún tươi, rau sống chấm tương đen bơ đậu phộng ngậy bùi.", tag: "Món cuốn", source: "VTV Quốc tế" },
  { title: "Cá kho làng Vũ Đại: Niêu đất om lửa trấu suốt 16 tiếng đồng hồ đậm đà hương tết", summary: "Cá trắm đen kho với riềng, gừng, nước cốt cua đồng xương mềm rục, thịt chắc nịch nổi tiếng cả nước.", tag: "Cá kho", source: "Nông nghiệp VTV" },
  { title: "Rau rừng Gia Lai chấm muối kiến vàng: Trải nghiệm ẩm thực độc lạ của đại ngàn", summary: "Vị chua thanh tự nhiên của kiến vàng hòa quyện với lá rừng hoang dã mang đến cảm giác vị giác khó quên.", tag: "Tây Nguyên", source: "VTV2 Khám phá" },
  { title: "Nhà hàng ẩm thực Việt đạt sao Michelin: Nâng tầm hương vị truyền thống lên chuẩn mực quốc tế", summary: "Các đầu bếp tài hoa khéo léo kết hợp nguyên liệu địa phương với kỹ thuật nấu nướng đương đại sang trọng.", tag: "Michelin", source: "VTV Tạp chí" }
];

const generateCuisineArticles = (): PortalArticle[] => {
  const articles: PortalArticle[] = [];
  const tags = ["Đặc sản", "Món ngon", "Ẩm thực Bắc", "Ẩm thực Trung", "Ẩm thực Nam", "Đường phố", "Trà & Cà phê", "Công thức", "Gia vị", "Món cuốn"];
  const sources = ["VTV Ẩm thực", "VTV Đặc sản", "VTV Cần Thơ", "Ẩm thực 3 miền", "VTV Vui Sống", "Khám phá Ẩm thực", "Hương vị quê nhà"];

  for (let i = 1; i <= 100; i++) {
    const base = CUISINE_HEADLINES[(i - 1) % CUISINE_HEADLINES.length];
    const cycle = Math.floor((i - 1) / CUISINE_HEADLINES.length);
    const id = `amthuc-${i}`;
    const tag = tags[(i - 1) % tags.length];
    const source = sources[(i - 1) % sources.length];

    let title = base.title;
    let summary = base.summary;
    if (cycle > 0) {
      const prefixes = [
        "Bí quyết ẩm thực",
        "Trải nghiệm vị giác",
        "Khám phá mỹ vị",
        "Hành trình ẩm thực"
      ];
      title = `${prefixes[cycle - 1]}: ${base.title} (Tập ${cycle + 1})`;
      summary = `Công thức và mẹo nấu: ${base.summary} Tìm hiểu câu chuyện văn hóa đằng sau từng đĩa ăn truyền thống.`;
    }

    articles.push({
      id,
      portalId: 'am-thuc',
      title,
      summary,
      content: `${summary} Ẩm thực Việt Nam không chỉ là việc thưởng thức món ăn mà còn là sự sẻ chia tình cảm gia đình, tấm lòng hiếu khách và sợi dây gìn giữ cội nguồn qua ngàn năm lịch sử.`,
      source,
      time: getRelativeTime(i),
      tag,
      views: getViews(i, 37),
      featured: i <= 3
    });
  }
  return articles;
};

// --- CHÍNH TRỊ: 100 ARTICLES ---
const POLITICS_HEADLINES: { title: string; summary: string; tag: string; source: string }[] = [
  { title: "Kỳ họp Quốc hội: Thảo luận sâu sắc về dự án luật thúc đẩy chuyển đổi xanh và kinh tế tuần hoàn", summary: "Các đại biểu tập trung đóng góp ý kiến về cơ chế tài chính xanh, tiêu chuẩn giảm phát thải ròng và nguồn lực xã hội hóa.", tag: "Nghị trường", source: "Truyền hình Quốc hội" },
  { title: "Chuyến công tác đối ngoại chiến lược: Thắt chặt quan hệ đối tác toàn diện với các quốc gia bạn bè", summary: "Việt Nam tiếp tục khẳng định đường lối đối ngoại độc lập, tự chủ, đa phương hóa, đa dạng hóa vì hòa bình và phát triển.", tag: "Đối ngoại", source: "Thời sự VTV1" },
  { title: "Cải cách thủ tục hành chính công: Lấy sự hài lòng của người dân làm thước đo hiệu quả", summary: "Hàng loạt dịch vụ công trực tuyến mức độ toàn trình được tích hợp đồng bộ, giảm thời gian và chi phí cho doanh nghiệp.", tag: "Cải cách hành chính", source: "Báo Nhân Dân" },
  { title: "Nghị quyết Trung ương về xây dựng và hoàn thiện Nhà nước pháp quyền xã hội chủ nghĩa", summary: "Tăng cường kỷ cương kỷ luật, phân cấp phân quyền rõ ràng gắn với nâng cao trách nhiệm của người đứng đầu cơ quan công quyền.", tag: "Chính sách", source: "VTV Thời sự" },
  { title: "Phát huy sức mạnh đại đoàn kết toàn dân tộc trong kỷ nguyên vươn mình của đất nước", summary: "Mặt trận Tổ quốc Việt Nam đẩy mạnh các phong trào thi đua yêu nước, lắng nghe và phản ánh tâm tư của mọi tầng lớp nhân dân.", tag: "Đoàn kết", source: "Đại Đoàn Kết" },
  { title: "Kiểm tra, giám sát công tác phòng chống tham nhũng, lãng phí: Không có vùng cấm, không có ngoại lệ", summary: "Ban Chỉ đạo Trung ương chỉ đạo xử lý dứt điểm các vụ việc phức tạp, thu hồi tối đa tài sản thất thoát về cho Nhà nước.", tag: "Pháp luật", source: "Nội chính TV" },
  { title: "Quy hoạch không gian biển quốc gia: Phát triển kinh tế biển gắn liền với bảo vệ chủ quyền thiêng liêng", summary: "Chiến lược biển Việt Nam đến năm 2030 định hướng khai thác hiệu quả tài nguyên và giữ vững an ninh trật tự trên biển.", tag: "Biển đảo", source: "Hải quân Việt Nam" },
  { title: "Chính sách an sinh xã hội: Mở rộng diện bao phủ bảo hiểm y tế toàn dân và trợ cấp hưu trí", summary: "Ngân sách Nhà nước ưu tiên nguồn lực hỗ trợ hộ nghèo, đồng bào dân tộc thiểu số và các đối tượng yếu thế trong xã hội.", tag: "An sinh", source: "Lao động Xã hội" },
  { title: "Ngoại giao cây tre Việt Nam: Vững ở gốc, chắc ở thân, uyển chuyển ở cành", summary: "Trường phái đối ngoại mang bản sắc văn hóa dân tộc giúp đất nước giữ vững môi trường hòa bình, ổn định để bứt phá.", tag: "Ngoại giao", source: "Thời sự VTV1" },
  { title: "Thẩm tra dự án Luật Đất đai sửa đổi: Đảm bảo hài hòa lợi ích Nhà nước, người dân và nhà đầu tư", summary: "Ủy ban Thường vụ Quốc hội yêu cầu quy định chặt chẽ về giá đất, bồi thường tái định cư và quy hoạch sử dụng đất minh bạch.", tag: "Luật pháp", source: "Truyền hình Quốc hội" },
  { title: "Hội nghị toàn quốc về phát triển kinh tế tập thể, hợp tác xã kiểu mới", summary: "Tháo gỡ điểm nghẽn về tiếp cận đất đai, vốn tín dụng và công nghệ số cho các hợp tác xã nông nghiệp hiện đại.", tag: "Kinh tế hợp tác", source: "Nông thôn mới" },
  { title: "Xây dựng đội ngũ cán bộ, công chức dám nghĩ, dám làm, dám chịu trách nhiệm vì lợi ích chung", summary: "Ban hành cơ chế bảo vệ cán bộ năng động, sáng tạo, khơi dậy tinh thần cống hiến cho sự nghiệp xây dựng quê hương.", tag: "Cán bộ", source: "Báo Nhân Dân" },
  { title: "Bảo đảm an ninh trật tự, an toàn giao thông và phòng chống tội phạm công nghệ cao", summary: "Lực lượng Công an Nhân dân triển khai đợt cao điểm tấn công trấn áp tội phạm lừa đảo trực tuyến xuyên quốc gia.", tag: "An ninh", source: "An ninh TV" },
  { title: "Phát triển hạ tầng năng lượng sạch: Cam kết mạnh mẽ của Việt Nam tại các diễn đàn khí hậu", summary: "Huy động nguồn vốn quốc tế hỗ trợ kỹ thuật thực hiện thỏa thuận chuyển dịch năng lượng công bằng (JETP).", tag: "Môi trường", source: "Tài nguyên Môi trường" },
  { title: "Gặp mặt đại biểu kiều bào tiêu biểu: Trân trọng nguồn lực chất xám và kiều hối của người Việt ở nước ngoài", summary: "Đảng và Nhà nước luôn khẳng định cộng đồng người Việt Nam ở nước ngoài là bộ phận không thể tách rời của dân tộc.", tag: "Kiều bào", source: "VTV4 Đối ngoại" },
  { title: "Giám sát tối cao của Quốc hội đối với việc thực hiện các Chương trình mục tiêu Quốc gia", summary: "Đôn đốc giải ngân vốn đầu tư công, phát triển kinh tế xã hội vùng đồng bào dân tộc thiểu số và miền núi.", tag: "Giám sát", source: "Truyền hình Quốc hội" },
  { title: "Tăng cường hợp tác an ninh quốc phòng trong khuôn khổ khối ASEAN", summary: "Đóng góp tích cực của Việt Nam vào việc duy trì cấu trúc an ninh khu vực cởi mở, minh bạch và dựa trên luật pháp quốc tế.", tag: "Quốc phòng", source: "Quân đội Nhân dân" },
  { title: "Kế hoạch phát triển vùng kinh tế trọng điểm: Liên kết vùng tạo động lực tăng trưởng mới", summary: "Thủ tướng Chính phủ chủ trì hội nghị điều phối vùng kinh tế Bắc Bộ, Trung Bộ và vùng Đông Nam Bộ.", tag: "Quy hoạch vùng", source: "VTV Thời sự" },
  { title: "Bảo tồn văn hóa truyền thống gắn với phát triển du lịch bền vững tại các địa phương", summary: "Chính sách hỗ trợ nghệ nhân dân gian và phục dựng các lễ hội truyền thống gìn giữ bản sắc quê hương.", tag: "Chính sách văn hóa", source: "VTV Văn hóa" },
  { title: "Xây dựng nền báo chí cách mạng Việt Nam hiện đại, chuyên nghiệp, nhân văn", summary: "Định hướng phát triển các cơ quan báo chí chủ lực, ứng dụng công nghệ làm báo đa nền tảng đáp ứng yêu cầu mới.", tag: "Báo chí", source: "Thời sự VTV1" }
];

const generatePoliticsArticles = (): PortalArticle[] => {
  const articles: PortalArticle[] = [];
  const tags = ["Nghị trường", "Đối ngoại", "Chính sách", "Cải cách", "Pháp luật", "An ninh", "Kinh tế công", "Đoàn kết", "Biển đảo", "Quy hoạch"];
  const sources = ["Truyền hình Quốc hội", "Báo Nhân Dân", "Thời sự VTV1", "VTV Thời sự", "VTV4 Đối ngoại", "An ninh TV", "Quân đội Nhân dân"];

  for (let i = 1; i <= 100; i++) {
    const base = POLITICS_HEADLINES[(i - 1) % POLITICS_HEADLINES.length];
    const cycle = Math.floor((i - 1) / POLITICS_HEADLINES.length);
    const id = `chinhtri-${i}`;
    const tag = tags[(i - 1) % tags.length];
    const source = sources[(i - 1) % sources.length];

    let title = base.title;
    let summary = base.summary;
    if (cycle > 0) {
      const prefixes = [
        "Toàn cảnh nghị trường",
        "Chỉ đạo điều hành",
        "Thông cáo chính sách",
        "Góc nhìn chiến lược"
      ];
      title = `${prefixes[cycle - 1]}: ${base.title} (Số ${cycle + 1})`;
      summary = `Phân tích chuyên sâu: ${base.summary} Việc triển khai các chỉ đạo ở cơ sở được nhân dân tích cực theo dõi và đánh giá cao.`;
    }

    articles.push({
      id,
      portalId: 'chinh-tri',
      title,
      summary,
      content: `${summary} Công tác lập pháp, hành pháp và giám sát không ngừng được đổi mới toàn diện, hướng tới mục tiêu phụng sự nhân dân, xây dựng đất nước Việt Nam hùng cường, thịnh vượng.`,
      source,
      time: getRelativeTime(i),
      tag,
      views: getViews(i, 41),
      featured: i <= 3
    });
  }
  return articles;
};

// --- VĂN HÓA: 100 ARTICLES ---
const CULTURE_HEADLINES: { title: string; summary: string; tag: string; source: string }[] = [
  { title: "Giỗ Tổ Hùng Vương: Triệu triệu con tim hướng về Đền Hùng linh thiêng, cội nguồn dân tộc", summary: "Lễ dâng hương tưởng niệm các Vua Hùng diễn ra trang nghiêm, kết nối tinh thần đại đoàn kết giống nòi Lạc Hồng.", tag: "Lễ hội", source: "VTV Văn hóa" },
  { title: "Nhã nhạc cung đình Huế: Âm sắc hoàng cung ngân vang trong không gian di sản thế giới", summary: "Nghệ thuật trình diễn bác học tinh xảo của triều Nguyễn tiếp tục được các thế hệ nghệ nhân bảo tồn và truyền dạy.", tag: "Di sản thế giới", source: "VTV Huế" },
  { title: "Không gian văn hóa Cồng chiêng Tây Nguyên: Bản hùng ca giữa đại ngàn xanh thẳm", summary: "Âm vang cồng chiêng gắn kết cộng đồng buôn làng, là linh hồn trong mỗi dịp mừng lúa mới và lễ hội bỏ mả cổ truyền.", tag: "Tây Nguyên", source: "VTV Tây Nguyên" },
  { title: "Dân ca Quan họ Bắc Ninh: Nét duyên câu ca mộc mạc làm đắm say bao tao nhân mặc khách", summary: "Liền anh liền chị trao duyên qua câu hát câu cười, tấm áo tứ thân và chiếc nón quai thao truyền thống Kinh Bắc.", tag: "Quan họ", source: "VTV2 Văn hóa" },
  { title: "Làng gốm Bát Tràng hơn 500 năm tuổi: Nghệ thuật nhào nặn đất sét thành ngọc ngà", summary: "Bàn tay khéo léo của nghệ nhân làng nghề kết hợp nét men cổ rêu phong với mỹ thuật gốm sứ đương đại tinh xảo.", tag: "Làng nghề", source: "Hà Nội Văn hiến" },
  { title: "Lụa tơ tằm Vạn Phúc: Tinh hoa dệt lụa ngàn năm óng ả sắc màu văn hiến Hà Đông", summary: "Quy trình ươm tơ, dệt cửi thủ công tạo ra những thước lụa vân mềm mịn, thoáng mát được du khách năm châu yêu chuộng.", tag: "Lụa Việt", source: "VTV Di sản" },
  { title: "Kiến trúc phố cổ Hội An: Sức hút bền bỉ của thương cảng phồn hoa thế kỷ XVII", summary: "Những mái ngói âm dương rêu phong, bức tường vàng cổ kính và ánh đèn lồng lung linh soi bóng dòng sông Hoài thơ mộng.", tag: "Di sản", source: "VTV8" },
  { title: "Nghệ thuật Đờn ca tài tử Nam Bộ: Tiếng đàn kìm, đàn tranh ngân rung hồn cốt phương Nam", summary: "Di sản văn hóa phi vật thể đại diện của nhân loại sống động trong nếp sinh hoạt miệt vườn sông nước Cửu Long.", tag: "Tài tử", source: "VTV Cần Thơ" },
  { title: "Tín ngưỡng Thờ Mẫu Tam phủ: Nét đẹp văn hóa tâm linh độc đáo của người Việt", summary: "Nghi lễ Chầu văn hầu đồng rực rỡ sắc màu trang phục, vũ điệu và âm nhạc ca ngợi công đức các vị thánh thần bảo hộ non sông.", tag: "Tâm linh", source: "VTV Văn hóa" },
  { title: "Hát Xoan Phú Thọ: Lời ca mừng mùa từ thời các Vua Hùng dựng nước", summary: "Nghệ thuật ca múa dân gian nguyên sơ biểu diễn trước sân đình làng cổ cầu mong mưa thuận gió hòa, quốc thái dân an.", tag: "Hát Xoan", source: "VTV Phú Thọ" },
  { title: "Lễ hội Chùa Hương: Hành hương trẩy hội cõi Phật giữa non nước mây trời Hương Sơn", summary: "Hàng vạn phật tử thành kính cầu bình an, chiêm ngưỡng động Hương Tích kỳ vĩ - Nam thiên đệ nhất động.", tag: "Lễ hội chùa", source: "Hà Nội News" },
  { title: "Nghệ thuật múa rối nước: Điều kỳ diệu của nền văn minh lúa nước sông Hồng", summary: "Những chú Tễu vui nhộn cùng bầy rồng phượng nhào lộn trên mặt nước tạo nên sân khấu dân gian độc nhất vô nhị.", tag: "Múa rối", source: "VTV2" },
  { title: "Trang phục áo dài Việt Nam: Biểu tượng dịu dàng, trang nhã của người phụ nữ Việt", summary: "Tà áo dài thướt tha tôn vinh nét đẹp thanh tao, khẳng định giá trị bản sắc văn hóa trong dòng chảy hội nhập hiện đại.", tag: "Áo dài", source: "VTV Tạp chí" },
  { title: "Bảo tồn nhà rông Ba Na: Trái tim văn hóa của các buôn làng đại ngàn Kon Tum", summary: "Mái nhà rông vút cao như lưỡi rìu ngửa lên trời xanh là nơi sinh hoạt cộng đồng và trao truyền luật tục truyền đời.", tag: "Nhà rông", source: "VTV Tây Nguyên" },
  { title: "Làng tranh dân gian Đông Hồ: Thắm đượm màu sắc tự nhiên từ vỏ điệp và than lá tre", summary: "Những bức tranh gà lợn nét tươi trong sáng gửi gắm ước nguyện sung túc, sum vầy mỗi dịp Tết đến xuân về.", tag: "Tranh Đông Hồ", source: "VTV Văn hóa" },
  { title: "Tuồng cổ Bình Định: Hào khí võ học đất Tây Sơn trong từng nhịp trống, bước chân kép", summary: "Nghệ thuật sân khấu truyền thống với lối biểu diễn ước lệ, phục trang lộng lẫy tái hiện những trang sử hào hùng.", tag: "Hát Bội", source: "VTV Miền Trung" },
  { title: "Nghệ thuật thêu tay Quất Động: Đường kim mũi chỉ tinh xảo vẽ nên gấm vóc non sông", summary: "Nghệ nhân làng thêu kiên nhẫn phối hàng trăm sắc chỉ tơ tạo nên những bức tranh thêu chân dung sống động như thật.", tag: "Nghề thêu", source: "Làng nghề Việt" },
  { title: "Tục xông đất và mừng tuổi đầu năm: Nét đẹp văn hóa đầu xuân gắn kết tình thân gia đình", summary: "Những phong tục Tết cổ truyền ấm áp trao gửi niềm tin về một năm mới an khang thịnh vượng, vạn sự như ý.", tag: "Phong tục Tết", source: "VTV Vui Sống" },
  { title: "Di tích Hoàng thành Thăng Long: Ngàn năm trầm tích lịch sử dưới lòng đất Thủ đô", summary: "Các đợt khai quật khảo cổ phát lộ nhiều di vật vô giá minh chứng cho kinh đô phồn hoa liên tục qua các triều đại.", tag: "Khảo cổ", source: "VTV Thời sự" },
  { title: "Tuổi trẻ chung tay số hóa di sản: Đưa bảo tàng ảo và di tích 3D tiếp cận giới trẻ", summary: "Ứng dụng thực tế ảo VR tái hiện sinh động không gian đình làng và hiện vật cổ, thổi bùng tình yêu lịch sử nước nhà.", tag: "Di sản số", source: "VTV Digital" }
];

const generateCultureArticles = (): PortalArticle[] => {
  const articles: PortalArticle[] = [];
  const tags = ["Di sản", "Lễ hội", "Làng nghề", "Dân ca", "Kiến trúc", "Tâm linh", "Trang phục", "Nghệ thuật", "Phong tục", "Lịch sử"];
  const sources = ["VTV Văn hóa", "VTV Di sản", "VTV2 Văn hóa", "VTV Huế", "Hà Nội Văn hiến", "VTV Cần Thơ", "VTV Tây Nguyên"];

  for (let i = 1; i <= 100; i++) {
    const base = CULTURE_HEADLINES[(i - 1) % CULTURE_HEADLINES.length];
    const cycle = Math.floor((i - 1) / CULTURE_HEADLINES.length);
    const id = `vanhoa-${i}`;
    const tag = tags[(i - 1) % tags.length];
    const source = sources[(i - 1) % sources.length];

    let title = base.title;
    let summary = base.summary;
    if (cycle > 0) {
      const prefixes = [
        "Khám phá di sản",
        "Ký ức ngàn năm",
        "Dòng chảy văn hóa",
        "Tinh hoa bản sắc"
      ];
      title = `${prefixes[cycle - 1]}: ${base.title} (Kỳ ${cycle + 1})`;
      summary = `Hành trình tìm về cội nguồn: ${base.summary} Những câu chuyện xúc động về sự trao truyền của các thế hệ nghệ nhân.`;
    }

    articles.push({
      id,
      portalId: 'van-hoa',
      title,
      summary,
      content: `${summary} Văn hóa là nền tảng tinh thần của xã hội, vừa là mục tiêu, vừa là động lực thúc đẩy sự phát triển bền vững của đất nước trong thời đại hội nhập toàn cầu.`,
      source,
      time: getRelativeTime(i),
      tag,
      views: getViews(i, 19),
      featured: i <= 3
    });
  }
  return articles;
};

// --- GIẢI TRÍ: 100 ARTICLES ---
const ENTERTAINMENT_HEADLINES: { title: string; summary: string; tag: string; source: string }[] = [
  { title: "Phim truyền hình VTV giờ vàng: Kịch bản sâu sắc, dàn diễn viên thực lực chinh phục khán giả", summary: "Tập phim mới nhất lập kỷ lục rating truyền hình với những nút thắt tâm lý kịch tính và thông điệp tình cảm gia đình xúc động.", tag: "Phim VTV", source: "VTV Giải trí" },
  { title: "Bảng xếp hạng âm nhạc V-Pop: Những ca khúc mang âm hưởng dân gian đương đại bùng nổ", summary: "Sự kết hợp ăn ý giữa nhạc cụ truyền thống và giai điệu EDM hiện đại đưa các sản phẩm âm nhạc Việt vươn tầm quốc tế.", tag: "Âm nhạc", source: "V-Pop News" },
  { title: "Liên hoan phim Quốc tế: Điện ảnh Việt Nam khẳng định dấu ấn sáng tạo với nhiều giải thưởng lớn", summary: "Các tác phẩm điện ảnh độc lập nhận được tràng pháo tay kéo dài từ hội đồng giám khảo và bạn bè quốc tế.", tag: "Điện ảnh", source: "VTV Tạp chí" },
  { title: "Gameshow âm nhạc bùng nổ triệu view: Sân khấu đỉnh cao của những bản hòa âm ánh sáng", summary: "Những màn trình diễn live mãn nhãn cùng sự thăng hoa của dàn nghệ sĩ tên tuổi tạo cơn sốt trên khắp mạng xã hội.", tag: "Gameshow", source: "VTV3 Sôi động" },
  { title: "Tuần lễ Thời trang Quốc tế Việt Nam: Tôn vinh chất liệu tự nhiên bản địa trên sàn diễn", summary: "Các nhà thiết kế hàng đầu trình làng bộ sưu tập độc đáo lấy cảm hứng từ non nước Tràng An và lụa tơ tằm cổ truyền.", tag: "Thời trang", source: "VTV Style" },
  { title: "Concert âm nhạc ngoài trời thu hút hơn 30.000 khán giả hòa giọng dưới bầu trời đêm", summary: "Đêm nhạc thăng hoa cảm xúc đánh dấu hành trình 10 năm cống hiến nghệ thuật của nghệ sĩ đa tài.", tag: "Concert", source: "VTV Âm nhạc" },
  { title: "Phim điện ảnh rạp chiếu xô đổ kỷ lục phòng vé: Cú hích lớn cho nền công nghiệp điện ảnh nước nhà", summary: "Kỹ xảo hình ảnh hoành tráng cùng thông điệp nhân văn sâu sắc lay động hàng triệu trái tim khán giả ra rạp.", tag: "Phòng vé", source: "Điện ảnh Việt" },
  { title: "Nghệ sĩ trẻ đưa cải lương và chèo tiếp cận thế hệ Gen Z qua các bản phối mới lạ", summary: "Nỗ lực làm mới nghệ thuật sân khấu truyền thống nhận được sự hưởng ứng nhiệt tình từ đông đảo khán giả trẻ.", tag: "Sân khấu trẻ", source: "VTV Sáng tạo" },
  { title: "Lễ trao giải Cánh Diều Vàng: Tôn vinh những cống hiến bền bỉ của nghệ sĩ cho nghệ thuật thứ bảy", summary: "Đêm hội tụ của các thế hệ diễn viên gạo cội và những gương mặt trẻ triển vọng của màn ảnh nước nhà.", tag: "Cánh Diều Vàng", source: "VTV Thời sự" },
  { title: "Kịch nói kinh điển trở lại sân khấu: Cháy vé trước giờ công diễn nhiều tuần", summary: "Vở diễn tâm lý xã hội sâu sắc làm rơi nước mắt người xem bởi tài năng nhập vai xuất thần của dàn nghệ sĩ gạo cội.", tag: "Kịch nói", source: "Nhà hát Kịch" },
  { title: "Nhạc sĩ gạo cội ra mắt tuyển tập ca khúc quê hương đất nước chan chứa ân tình", summary: "Những giai điệu đi cùng năm tháng được hòa âm phối khí mới mẻ bởi dàn nhạc giao hưởng quốc gia.", tag: "Nhạc trữ tình", source: "VTV Văn nghệ" },
  { title: "MV ca nhạc quảng bá du lịch Việt Nam đạt top thịnh hành toàn cầu", summary: "Những thước phim flycam tuyệt mỹ ghi lại cảnh sắc vịnh Hạ Long, Sa Pa và Phong Nha đưa Việt Nam đến gần hơn với du khách thế giới.", tag: "Du lịch qua MV", source: "VTV Digital" },
  { title: "Dàn sao Việt hội tụ tại đêm dạ tiệc từ thiện gây quỹ phẫu thuật nụ cười cho trẻ em", summary: "Sự chung tay của các nghệ sĩ mang lại niềm vui và tương lai tươi sáng cho hàng trăm em nhỏ có hoàn cảnh khó khăn.", tag: "Thiện nguyện", source: "VTV Kết nối" },
  { title: "Thế giới truyện tranh và hoạt hình Việt Nam: Những bước chuyển mình đầy kỳ vọng", summary: "Các họa sĩ trẻ ứng dụng công nghệ 3D tạo ra những bộ phim hoạt hình lịch sử lôi cuốn và giàu tính giáo dục.", tag: "Hoạt hình", source: "VTV2 Trẻ" },
  { title: "Show diễn thực cảnh thực tế ảo: Tái hiện huyền thoại lịch sử trên mặt nước hồ Tây", summary: "Công nghệ trình chiếu ánh sáng laser 3D mapping hiện đại đưa người xem du hành ngược thời gian về Thăng Long xưa.", tag: "Thực cảnh", source: "VTV Tạp chí" },
  { title: "Podcast tâm sự nghệ thuật: Nơi các nghệ sĩ trải lòng về những góc khuất sau ánh hào quang", summary: "Những chia sẻ chân thành về niềm đam mê, áp lực nghề nghiệp và con đường kiên định theo đuổi nghệ thuật chân chính.", tag: "Podcast", source: "VTV Voice" },
  { title: "Hội chợ sách quốc tế: Hàng vạn bạn trẻ xếp hàng xin chữ ký tác giả yêu thích", summary: "Không gian ngày hội văn hóa đọc nhộn nhịp lan tỏa thói quen đọc sách và trân trọng giá trị tri thức.", tag: "Ngày hội sách", source: "VTV Tri thức" },
  { title: "Triển lãm mỹ thuật đương đại: Đa chiều cảm xúc qua các tác phẩm sắp đặt độc đáo", summary: "Các họa sĩ trẻ thể hiện tư duy sáng tạo phóng khoáng về mối quan hệ giữa con người, công nghệ và thiên nhiên.", tag: "Mỹ thuật", source: "VTV Mỹ thuật" },
  { title: "Đêm nhạc thính phòng cổ điển tại Nhà hát Lớn: Khán phòng lắng đọng cùng tiếng đàn vĩ cầm", summary: "Nghệ sĩ độc tấu quốc tế trình diễn kiệt tác concerto bất hủ cùng Dàn nhạc Giao hưởng Quốc gia Việt Nam.", tag: "Nhạc cổ điển", source: "VTV Văn hóa" },
  { title: "Thời trang bền vững: Xu hướng tái chế và sử dụng sợi tự nhiên lên ngôi", summary: "Các nhà mốt trẻ cam kết bảo vệ môi trường thông qua việc nói không với thời trang nhanh và rác thải dệt may.", tag: "Xu hướng", source: "VTV Style" }
];

const generateEntertainmentArticles = (): PortalArticle[] => {
  const articles: PortalArticle[] = [];
  const tags = ["Phim ảnh", "V-Pop", "Showbiz", "Thời trang", "Sân khấu", "Gameshow", "Điện ảnh", "Concert", "Nghệ thuật", "Xu hướng"];
  const sources = ["VTV Giải trí", "V-Pop News", "VTV3 Sôi động", "VTV Style", "Điện ảnh Việt", "VTV Tạp chí", "VTV Âm nhạc"];

  for (let i = 1; i <= 100; i++) {
    const base = ENTERTAINMENT_HEADLINES[(i - 1) % ENTERTAINMENT_HEADLINES.length];
    const cycle = Math.floor((i - 1) / ENTERTAINMENT_HEADLINES.length);
    const id = `giaitri-${i}`;
    const tag = tags[(i - 1) % tags.length];
    const source = sources[(i - 1) % sources.length];

    let title = base.title;
    let summary = base.summary;
    if (cycle > 0) {
      const prefixes = [
        "Hậu trường giải trí",
        "Tiêu điểm showbiz",
        "Nhịp sống nghệ thuật",
        "Góc nhìn văn nghệ"
      ];
      title = `${prefixes[cycle - 1]}: ${base.title} (Số ${cycle + 1})`;
      summary = `Cập nhật nóng: ${base.summary} Những chia sẻ độc quyền từ ê-kíp sản xuất và các nghệ sĩ trong cuộc.`;
    }

    articles.push({
      id,
      portalId: 'giai-tri',
      title,
      summary,
      content: `${summary} Nhịp sống giải trí sôi động với nhiều sắc màu sáng tạo không ngừng nghỉ, mang lại niềm vui và nguồn cảm hứng tích cực cho công chúng khán giả mỗi ngày.`,
      source,
      time: getRelativeTime(i),
      tag,
      views: getViews(i, 53),
      featured: i <= 3
    });
  }
  return articles;
};

// Combine all 100 articles from each of the 6 portals = 600 articles total!
export const ALL_PORTAL_ARTICLES: PortalArticle[] = [
  ...generateNewsArticles(),
  ...generateSportsArticles(),
  ...generateCuisineArticles(),
  ...generatePoliticsArticles(),
  ...generateCultureArticles(),
  ...generateEntertainmentArticles()
];
