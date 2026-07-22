export type EducationLevel = "all" | "tieu_hoc" | "thcs" | "thpt";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  subjectTag?: string;
}

export interface Subject {
  id: string;
  name: string;
  level: "all" | "tieu_hoc" | "thcs" | "thpt";
  levelName: string;
  color: string;
  icon: string;
  grade: string;
  description: string;
  questions: Question[];
}

export const subjectsData: Subject[] = [
  // ==================== V-STUDY TIỂU HỌC (LỚP 1 - 5) ====================
  {
    id: "math_primary",
    name: "Toán Tiểu Học",
    level: "tieu_hoc",
    levelName: "Tiểu Học",
    color: "from-blue-500 to-cyan-400",
    icon: "🔢",
    grade: "Lớp 1 - 5",
    description: "Củng cố các phép tính cơ bản, bảng cửu chương, hình học đơn giản và bài toán có lời văn.",
    questions: [
      {
        id: 1,
        question: "Kết quả của phép tính 7 × 8 là bao nhiêu?",
        options: ["54", "56", "64", "48"],
        correctIndex: 1,
        explanation: "Theo bảng cửu chương 7: 7 × 8 = 56."
      },
      {
        id: 2,
        question: "Một hình chữ nhật có chiều dài 12 cm và chiều rộng 5 cm. Diện tích của hình chữ nhật đó là bao nhiêu?",
        options: ["34 cm²", "60 cm²", "17 cm²", "60 cm"],
        correctIndex: 1,
        explanation: "Diện tích hình chữ nhật = Chiều dài × Chiều rộng = 12 × 5 = 60 cm²."
      },
      {
        id: 3,
        question: "Trung bình cộng của ba số 15, 25 và 35 là bao nhiêu?",
        options: ["20", "25", "30", "75"],
        correctIndex: 1,
        explanation: "Trung bình cộng = (15 + 25 + 35) / 3 = 75 / 3 = 25."
      },
      {
        id: 4,
        question: "Chuyển phân số 3/5 thành tỷ số phần trăm ta được kết quả nào?",
        options: ["35%", "50%", "60%", "75%"],
        correctIndex: 2,
        explanation: "3/5 = 0,6 = 60%."
      },
      {
        id: 5,
        question: "Số nhỏ nhất có 4 chữ số khác nhau là số nào?",
        options: ["1000", "1023", "1234", "1001"],
        correctIndex: 1,
        explanation: "Để số nhỏ nhất, hàng nghìn là 1, hàng trăm là 0, hàng chục là 2 và hàng đơn vị là 3. Vậy số đó là 1023."
      },
      {
        id: 6,
        question: "Một lớp học có 30 học sinh, trong đó số học sinh nữ chiếm 60%. Hỏi lớp học đó có bao nhiêu học sinh nam?",
        options: ["18 học sinh", "12 học sinh", "15 học sinh", "10 học sinh"],
        correctIndex: 1,
        explanation: "Tỷ lệ học sinh nam = 100% - 60% = 40%. Số học sinh nam = 30 × 40% = 12 học sinh."
      }
    ]
  },
  {
    id: "vietnamese_primary",
    name: "Tiếng Việt Tiểu Học",
    level: "tieu_hoc",
    levelName: "Tiểu Học",
    color: "from-amber-500 to-[#cc1827]",
    icon: "📖",
    grade: "Lớp 1 - 5",
    description: "Luyện tập ngữ pháp, mở rộng vốn từ, nhận biết từ đồng nghĩa, trái nghĩa và ca dao tục ngữ.",
    questions: [
      {
        id: 1,
        question: "Từ nào sau đây đồng nghĩa với từ 'chăm chỉ'?",
        options: ["Lười biếng", "Cần cù", "Dũng cảm", "Nhanh trí"],
        correctIndex: 1,
        explanation: "'Cần cù' có nghĩa tương đồng với 'chăm chỉ', chỉ sự siêng năng trong học tập và lao động."
      },
      {
        id: 2,
        question: "Trong câu 'Bầu trời mùa thu xanh trong ngắt', bộ phận nào là chủ ngữ?",
        options: ["Bầu trời", "Bầu trời mùa thu", "Mùa thu", "Xanh trong ngắt"],
        correctIndex: 1,
        explanation: "Chủ ngữ chỉ đối tượng được miêu tả là 'Bầu trời mùa thu'."
      },
      {
        id: 3,
        question: "Điền từ thích hợp vào chỗ trống trong câu tục ngữ: 'Lá lành đùm lá...'",
        options: ["xanh", "rách", "vàng", "khô"],
        correctIndex: 1,
        explanation: "Câu tục ngữ hoàn chỉnh là 'Lá lành đùm lá rách', thể hiện truyền thống tương thân tương ái."
      },
      {
        id: 4,
        question: "Câu nào dưới đây là câu cảm?",
        options: [
          "Hôm nay trời mưa rất to.",
          "Ôi, bông hoa hồng này đẹp quá!",
          "Bạn có đi đá bóng không?",
          "Hãy giữ trật tự trong lớp học."
        ],
        correctIndex: 1,
        explanation: "Câu có từ bộc lộ cảm xúc 'Ôi' và 'quá' kết thúc bằng dấu chấm cảm là câu cảm."
      },
      {
        id: 5,
        question: "Từ nào sau đây là từ viết sai chính tả?",
        options: ["Xinh xắn", "Súp lơ", "Xao xuyến", "Sâu xắc"],
        correctIndex: 3,
        explanation: "Từ đúng chính tả phải là 'Sâu sắc' (sắc trong sâu sắc dùng s)."
      },
      {
        id: 6,
        question: "Dấu câu nào dùng để dẫn lời nói trực tiếp của nhân vật?",
        options: ["Dấu chấm phẩy", "Dấu ngoặc kép", "Dấu gạch ngang", "Dấu chấm hỏi"],
        correctIndex: 1,
        explanation: "Dấu ngoặc kép (\" \") được dùng để dẫn lời nói trực tiếp của nhân vật hoặc trích dẫn."
      }
    ]
  },
  {
    id: "english_primary",
    name: "Tiếng Anh Tiểu Học",
    level: "tieu_hoc",
    levelName: "Tiểu Học",
    color: "from-purple-500 to-indigo-500",
    icon: "🔤",
    grade: "Lớp 1 - 5",
    description: "Học từ vựng cơ bản, mẫu câu giao tiếp hàng ngày, màu sắc, động vật và gia đình.",
    questions: [
      {
        id: 1,
        question: "Choose the correct word: 'What _______ your name?'",
        options: ["are", "is", "am", "be"],
        correctIndex: 1,
        explanation: "Động từ to be đi với ngôi thứ ba số ít 'your name' là 'is'."
      },
      {
        id: 2,
        question: "Which color do you get when you mix Red and Yellow?",
        options: ["Green", "Purple", "Orange", "Blue"],
        correctIndex: 2,
        explanation: "Khi trộn màu đỏ (Red) và màu vàng (Yellow) ta thu được màu cam (Orange)."
      },
      {
        id: 3,
        question: "Choose the correct sentence:",
        options: [
          "She have a cat.",
          "She has a cat.",
          "She is a cat.",
          "She having a cat."
        ],
        correctIndex: 1,
        explanation: "Ngôi 'She' đi với động từ 'has' khi diễn tả sự sở hữu ở thì hiện tại đơn."
      },
      {
        id: 4,
        question: "How many days are there in a week?",
        options: ["Five", "Six", "Seven", "Ten"],
        correctIndex: 2,
        explanation: "Một tuần có 7 ngày (Seven days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday)."
      },
      {
        id: 5,
        question: "Look at the picture word: 'An animal with a long neck that eats tree leaves'. What is it?",
        options: ["Elephant", "Giraffe", "Tiger", "Monkey"],
        correctIndex: 1,
        explanation: "Con hươu cao cổ (Giraffe) có cổ rất dài chuyên ăn lá cây trên cao."
      },
      {
        id: 6,
        question: "Complete the dialog: 'How old are you?' - 'I am _______ years old.'",
        options: ["fine", "nine", "nine clock", "good"],
        correctIndex: 1,
        explanation: "Câu hỏi tuổi 'How old are you?' trả lời số tuổi: 'I am nine years old' (Tôi 9 tuổi)."
      }
    ]
  },
  {
    id: "science_primary",
    name: "Tự Nhiên & Khoa Học",
    level: "tieu_hoc",
    levelName: "Tiểu Học",
    color: "from-emerald-500 to-teal-400",
    icon: "🌱",
    grade: "Lớp 1 - 5",
    description: "Khám phá thế giới tự nhiên, thực vật, động vật, cơ thể người và sức khỏe môi trường.",
    questions: [
      {
        id: 1,
        question: "Cơ quan nào trong cơ thể người có chức năng co bóp để bơm máu đi nuôi cơ thể?",
        options: ["Phổi", "Dạ dày", "Tim", "Gan"],
        correctIndex: 2,
        explanation: "Tim đóng vai trò như một máy bơm sinh học, co bóp liên tục để đẩy máu qua hệ thống mạch máu đi khắp cơ thể."
      },
      {
        id: 2,
        question: "Cây xanh cần chất khí nào trong không khí để thực hiện quá trình quang hợp chế tạo chất dinh dưỡng?",
        options: ["Khí Oxy", "Khí Cacbonic", "Khí Nitơ", "Khí Hydro"],
        correctIndex: 1,
        explanation: "Trong quá trình quang hợp, cây xanh hấp thụ khí Cacbonic (CO2) và nước dưới ánh sáng mặt trời để tạo dinh dưỡng và thải ra Oxy."
      },
      {
        id: 3,
        question: "Nước tồn tại ở mấy thể chính trong tự nhiên?",
        options: ["1 thể", "2 thể", "3 thể", "4 thể"],
        correctIndex: 2,
        explanation: "Nước tồn tại ở 3 thể: Thể lỏng (nước biển, sông, suối), Thể rắn (băng, tuyết) và Thể khí (hơi nước)."
      },
      {
        id: 4,
        question: "Để phòng tránh bệnh cận thị ở lứa tuổi học sinh, chúng ta nên làm gì?",
        options: [
          "Ngồi học ở nơi đủ ánh sáng và giữ khoảng cách mắt thích hợp",
          "Đọc sách trong tối để luyện mắt",
          "Xem ti vi ở khoảng cách rất gần",
          "Chơi game liên tục nhiều giờ không nghỉ"
        ],
        correctIndex: 0,
        explanation: "Giữ khoảng cách học chuẩn (25-30cm) và học nơi đủ ánh sáng giúp bảo vệ thị lực tránh cận thị."
      },
      {
        id: 5,
        question: "Hiện tượng nào chứng tỏ không khí chuyển động?",
        options: ["Mặt trời mọc", "Lá cây rung rinh khi có gió", "Nước sôi bốc hơi", "Mưa rơi"],
        correctIndex: 1,
        explanation: "Không khí chuyển động tạo thành gió làm cho lá cây rung rinh."
      },
      {
        id: 6,
        question: "Loài động vật nào sau đây đẻ trứng?",
        options: ["Chó", "Mèo", "Gà", "Trâu"],
        correctIndex: 2,
        explanation: "Gà thuộc lớp Chim, sinh sản bằng cách đẻ trứng và ấp trứng nở thành gà con."
      }
    ]
  },
  {
    id: "it_primary",
    name: "Tin Học Tiểu Học",
    level: "tieu_hoc",
    levelName: "Tiểu Học",
    color: "from-sky-500 to-blue-600",
    icon: "💻",
    grade: "Lớp 3 - 5",
    description: "Nắm vững thao tác chuột, bàn phím, gõ tiếng Việt Unikey và sử dụng máy tính an toàn.",
    questions: [
      {
        id: 1,
        question: "Chuột máy tính thông thường gồm có mấy nút chính?",
        options: ["1 nút", "2 nút chính (Trái & Phải) và con lăn", "4 nút", "Không có nút nào"],
        correctIndex: 1,
        explanation: "Chuột máy tính chuẩn gồm nút chuột trái, nút chuột phải và nút cuộn (con lăn) ở giữa."
      },
      {
        id: 2,
        question: "Để gõ từ 'Trường' theo kiểu gõ Telex, em sẽ gõ chuỗi phím nào?",
        options: ["Truo7ng2", "Truowngs", "Truong6", "Truongwss"],
        correctIndex: 1,
        explanation: "Theo quy tắc Telex: ow = ơ, s = dấu sắc -> Truowngs = Trường."
      },
      {
        id: 3,
        question: "Phần mềm nào sau đây được dùng phổ biến để luyện vẽ trên máy tính ở Tiểu học?",
        options: ["MS Paint", "MS Word", "MS Excel", "Calculator"],
        correctIndex: 0,
        explanation: "MS Paint là phần mềm đồ họa đơn giản giúp học sinh làm quen với cọ vẽ, hình khối và tô màu."
      },
      {
        id: 4,
        question: "Thao tác nhấn nhanh nút chuột trái 2 lần liên tiếp gọi là gì?",
        options: ["Nháy chuột", "Nháy đôi chuột (Double click)", "Kéo thả chuột", "Nháy chuột phải"],
        correctIndex: 1,
        explanation: "Nháy đôi chuột (Double click) thường dùng để mở tệp tin hoặc chương trình."
      },
      {
        id: 5,
        question: "Hành vi nào sau đây là sử dụng Internet an toàn và đúng cách?",
        options: [
          "Cung cấp mật khẩu tài khoản cho người lạ trên mạng",
          "Không tự ý chia sẻ thông tin cá nhân và hỏi ý kiến cha mẹ khi gặp thông tin lạ",
          "Gặp gỡ một mình người quen qua mạng mà không báo cho gia đình",
          "Mở các đường link lạ gửi qua email"
        ],
        correctIndex: 1,
        explanation: "Giữ kín thông tin cá nhân và tham khảo ý kiến người lớn giúp bảo vệ em an toàn trên không gian mạng."
      }
    ]
  },

  // ==================== V-STUDY THCS (LỚP 6 - 9) ====================
  {
    id: "math_thcs",
    name: "Toán THCS",
    level: "thcs",
    levelName: "THCS",
    color: "from-blue-600 to-indigo-600",
    icon: "📐",
    grade: "Lớp 6 - 9",
    description: "Phương trình bậc nhất, hệ phương trình, tam giác đồng dạng, đường tròn và định lý Pytago.",
    questions: [
      {
        id: 1,
        question: "Trong tam giác vuông ABC vuông tại A có AB = 6 cm, AC = 8 cm. Độ dài cạnh huyền BC bằng bao nhiêu?",
        options: ["10 cm", "14 cm", "12 cm", "100 cm"],
        correctIndex: 0,
        explanation: "Áp dụng định lý Pytago: BC² = AB² + AC² = 6² + 8² = 36 + 64 = 100 ⟹ BC = 10 cm."
      },
      {
        id: 2,
        question: "Nghiệm của phương trình bậc nhất 2x - 6 = 0 là bao nhiêu?",
        options: ["x = -3", "x = 3", "x = 6", "x = 0"],
        correctIndex: 1,
        explanation: "2x - 6 = 0 ⇔ 2x = 6 ⇔ x = 3."
      },
      {
        id: 3,
        question: "Cho đường tròn (O; 5 cm). Một dây cung AB cách tâm O một khoảng bằng 3 cm. Độ dài dây AB bằng bao nhiêu?",
        options: ["4 cm", "8 cm", "6 cm", "10 cm"],
        correctIndex: 1,
        explanation: "Kẻ OH ⊥ AB ⟹ H là trung điểm AB. Áp dụng Pytago cho ΔOHA vuông tại H: AH = √(OA² - OH²) = √(5² - 3²) = 4 cm. Vậy AB = 2 × 4 = 8 cm."
      },
      {
        id: 4,
        question: "Giá trị của biểu thức A = √((√3 - 2)²) là bao nhiêu?",
        options: ["√3 - 2", "2 - √3", "1", "√3 + 2"],
        correctIndex: 1,
        explanation: "√(a²) = |a|. Vì √3 ≈ 1.732 < 2 nên √3 - 2 < 0 ⟹ |√3 - 2| = 2 - √3."
      },
      {
        id: 5,
        question: "Hệ phương trình { x + y = 5 ; x - y = 1 } có nghiệm (x; y) là gì?",
        options: ["(3; 2)", "(2; 3)", "(4; 1)", "(1; 4)"],
        correctIndex: 0,
        explanation: "Cộng hai phương trình: 2x = 6 ⟹ x = 3. Thay vào x + y = 5 ⟹ y = 2."
      },
      {
        id: 6,
        question: "Đồ thị hàm số y = -2x + 4 cắt trục tung tại điểm có tọa độ nào?",
        options: ["(2; 0)", "(0; 4)", "(0; -2)", "(4; 0)"],
        correctIndex: 1,
        explanation: "Cho x = 0 ⟹ y = 4. Vậy đồ thị cắt trục tung tại điểm (0; 4)."
      },
      {
        id: 7,
        question: "Phương trình x² - 5x + 6 = 0 có hai nghiệm x1, x2. Tích x1 × x2 bằng bao nhiêu?",
        options: ["5", "6", "-5", "-6"],
        correctIndex: 1,
        explanation: "Theo hệ thức Vi-ét cho phương trình ax² + bx + c = 0, tích hai nghiệm x1 × x2 = c/a = 6/1 = 6."
      }
    ]
  },
  {
    id: "literature_thcs",
    name: "Ngữ Văn THCS",
    level: "thcs",
    levelName: "THCS",
    color: "from-amber-600 to-orange-500",
    icon: "📜",
    grade: "Lớp 6 - 9",
    description: "Đọc hiểu văn bản văn học Việt Nam và thế giới, phân tích câu, các biện pháp tu từ.",
    questions: [
      {
        id: 1,
        question: "Tác phẩm 'Dế Mèn phiêu lưu ký' của nhà văn Tô Hoài gửi gắm bài học đầu tiên nào qua cái chết của Dế Choắt?",
        options: [
          "Bài học về lòng dũng cảm khi chiến đấu",
          "Thói hung hăng, xấc xược có thể gây ra tai họa cho người khác và bản thân",
          "Bài học về tình anh em trong gia đình",
          "Bài học về ý chí vượt khó vươn lên"
        ],
        correctIndex: 1,
        explanation: "Sự nông nổi và thói trêu chọc chị Cốc của Dế Mèn đã dẫn đến cái chết oan uổng của Dế Choắt, giúp Mèn nhận ra bài học đường đời đầu tiên."
      },
      {
        id: 2,
        question: "Trong bài thơ 'Lượm' của Tố Hữu, hình ảnh chú bé Lượm hiện lên với vẻ đẹp như thế nào?",
        options: [
          "Trầm mặc, suy tư",
          "Hồn nhiên, nhí nhảnh, yêu đời và anh dũng hy sinh",
          "Mệt mỏi, vất vả",
          "Lạnh lùng, nghiêm nghị"
        ],
        correctIndex: 1,
        explanation: "Lượm là chú bé liên lạc nhỏ tuổi 'Cái xắc nho nhỏ / Cái chân thoăn thoắt', hồn nhiên nhưng vô cùng dũng cảm."
      },
      {
        id: 3,
        question: "Bài thơ 'Bánh trôi nước' của Hồ Xuân Hương sử dụng hình ảnh bánh trôi nước để ẩn dụ cho điều gì?",
        options: [
          "Món ăn truyền thống dân tộc",
          "Số phận chìm nổi nhưng giữ vững tấm lòng son sắt của người phụ nữ xưa",
          "Vẻ đẹp thiên nhiên đất nước",
          "Tình mẫu tử thiêng liêng"
        ],
        correctIndex: 1,
        explanation: "'Thân em vừa trắng lại vừa tròn / 7 nổi 3 trầm với nước non' mượn chiếc bánh trôi để tôn vinh phẩm chất kiên trinh của nữ giới."
      },
      {
        id: 4,
        question: "Tác giả của kiệt tác 'Truyện Kiều' (Đoạn trường tân thanh) là ai?",
        options: ["Nguyễn Trãi", "Nguyễn Du", "Hồ Xuân Hương", "Đoàn Thị Điểm"],
        correctIndex: 1,
        explanation: "Đại thi hào dân tộc, Danh nhân văn hóa thế giới Nguyễn Du sáng tác tác phẩm kinh điển Truyện Kiều."
      },
      {
        id: 5,
        question: "Biện pháp tu từ nào được sử dụng trong câu: 'Bàn tay ta làm nên tất cả / Có sức người sỏi đá cũng thành cơm'?",
        options: ["So sánh", "Hoán dụ", "Ẩn dụ", "Nói giảm nói tránh"],
        correctIndex: 1,
        explanation: "'Bàn tay ta' là hình ảnh hoán dụ lấy bộ phận để chỉ người lao động."
      },
      {
        id: 6,
        question: "Tác phẩm 'Chiếc lá cuối cùng' của nhà văn Ô-Hen-ri mang thông điệp cao cả nào về nghệ thuật?",
        options: [
          "Nghệ thuật chân chính vì con người, mang lại sự sống và hy vọng",
          "Nghệ thuật phải đắt giá về tiền bạc",
          "Nghệ thuật chỉ dành cho giới thượng lưu",
          "Nghệ thuật phải hoàn toàn giống hệt thực tế"
        ],
        correctIndex: 0,
        explanation: "Kiệt tác chiếc lá vẽ trên tường của cụ Bơ-men đã cứu vớt tâm hồn và sự sống của Giôn-xi."
      },
      {
        id: 7,
        question: "Bài thơ 'Sang thu' của Hữu Thỉnh ghi lại khoảnh khắc biến chuyển của đất trời vào thời điểm nào?",
        options: ["Giữa mùa hè", "Chuyển giao từ cuối hạ sang đầu thu", "Đầu mùa đông", "Giữa mùa xuân"],
        correctIndex: 1,
        explanation: "Bài thơ thể hiện sự cảm nhận tinh tế trước tín hiệu giao mùa nhè nhẹ nhẹ nhàng từ hạ sang thu ('Hình như thu đã về')."
      }
    ]
  },
  {
    id: "english_thcs",
    name: "Tiếng Anh THCS",
    level: "thcs",
    levelName: "THCS",
    color: "from-purple-600 to-indigo-500",
    icon: "🇬🇧",
    grade: "Lớp 6 - 9",
    description: "Thì ngữ pháp, mệnh đề quan hệ, câu gián tiếp, câu so sánh và từ vựng giao tiếp.",
    questions: [
      {
        id: 1,
        question: "Choose the best option: 'I _______ my homework when the phone rang.'",
        options: ["was doing", "am doing", "did", "have done"],
        correctIndex: 0,
        explanation: "Diễn tả một hành động đang xảy ra trong quá khứ (was doing) thì một hành động khác cắt ngang (rang)."
      },
      {
        id: 2,
        question: "The girl _______ sat next to me on the bus is a talented singer.",
        options: ["whom", "who", "which", "whose"],
        correctIndex: 1,
        explanation: "Đại từ quan hệ 'who' thay thế cho danh từ chỉ người 'The girl' làm chủ ngữ trong mệnh đề quan hệ."
      },
      {
        id: 3,
        question: "Choose the correct passive voice: 'They built this bridge in 2010.'",
        options: [
          "This bridge is built in 2010.",
          "This bridge was built in 2010.",
          "This bridge has been built in 2010.",
          "This bridge was build in 2010."
        ],
        correctIndex: 1,
        explanation: "Thì quá khứ đơn ở dạng bị động: S + was/were + V3/ed."
      },
      {
        id: 4,
        question: "If the weather _______ fine tomorrow, we will go on a picnic.",
        options: ["is", "will be", "was", "were"],
        correctIndex: 0,
        explanation: "Câu điều kiện loại 1: Mệnh đề If dùng thì Hiện tại đơn (is)."
      },
      {
        id: 5,
        question: "She asked me where I _______ from.",
        options: ["come", "came", "have come", "am coming"],
        correctIndex: 1,
        explanation: "Trong câu lùi thì gián tiếp (Reported Speech), thì Hiện tại đơn 'come' lùi thành Quá khứ đơn 'came'."
      },
      {
        id: 6,
        question: "This computer is _______ than the one I bought last year.",
        options: ["more expensive", "expensive", "most expensive", "as expensive"],
        correctIndex: 0,
        explanation: "So sánh hơn với tính từ dài (expensive) có dạng: more + Adj + than."
      },
      {
        id: 7,
        question: "He is interested _______ learning how to play the acoustic guitar.",
        options: ["on", "at", "in", "with"],
        correctIndex: 2,
        explanation: "Cụm tính từ cố định: to be interested in + V-ing (thích thú, quan tâm làm việc gì)."
      }
    ]
  },
  {
    id: "physics_thcs",
    name: "Vật Lý THCS",
    level: "thcs",
    levelName: "THCS",
    color: "from-rose-600 to-red-500",
    icon: "⚡",
    grade: "Lớp 6 - 9",
    description: "Cơ học, nhiệt học, quang học, điện học, Định luật Ôm và tác dụng của dòng điện.",
    questions: [
      {
        id: 1,
        question: "Định luật Ôm cho đoạn mạch chứa điện trở R có công thức biểu diễn là gì?",
        options: ["I = U / R", "I = U × R", "R = I / U", "U = I / R"],
        correctIndex: 0,
        explanation: "Cường độ dòng điện chạy qua dây dẫn tỷ lệ thuận với hiệu điện thế U và tỷ lệ nghịch với điện trở R: I = U / R."
      },
      {
        id: 2,
        question: "Một ô tô di chuyển quãng đường 120 km trong thời gian 2 giờ. Vận tốc trung bình của ô tô là bao nhiêu?",
        options: ["50 km/h", "60 km/h", "240 km/h", "80 km/h"],
        correctIndex: 1,
        explanation: "Vận tốc v = s / t = 120 / 2 = 60 km/h."
      },
      {
        id: 3,
        question: "Hiện tượng tia sáng bị đổi hướng đột ngột khi truyền xiên góc qua mặt phân cách giữa hai môi trường trong suốt gọi là gì?",
        options: ["Phản xạ ánh sáng", "Khúc xạ ánh sáng", "Tán sắc ánh sáng", "Hấp thụ ánh sáng"],
        correctIndex: 1,
        explanation: "Đây là định nghĩa hiện tượng khúc xạ ánh sáng."
      },
      {
        id: 4,
        question: "Hai điện trở R1 = 10 Ω và R2 = 15 Ω mắc nối tiếp. Điện trở tương đương của đoạn mạch là bao nhiêu?",
        options: ["25 Ω", "6 Ω", "150 Ω", "5 Ω"],
        correctIndex: 0,
        explanation: "Trong đoạn mạch mắc nối tiếp: R_td = R1 + R2 = 10 + 15 = 25 Ω."
      },
      {
        id: 5,
        question: "Đơn vị đo công suất điện chuẩn trong hệ SI là gì?",
        options: ["Joule (J)", "Watt (W)", "Volt (V)", "Ampere (A)"],
        correctIndex: 1,
        explanation: "Watt (kí hiệu W) là đơn vị đo công suất điện."
      },
      {
        id: 6,
        question: "Dụng cụ nào sau đây dùng để đo cường độ dòng điện trong mạch?",
        options: ["Vôn kế", "Ampe kế", "Công tơ điện", "Nhiệt kế"],
        correctIndex: 1,
        explanation: "Ampe kế được mắc nối tiếp vào mạch để đo cường độ dòng điện."
      }
    ]
  },
  {
    id: "chemistry_thcs",
    name: "Hóa Học THCS",
    level: "thcs",
    levelName: "THCS",
    color: "from-emerald-600 to-teal-500",
    icon: "🧪",
    grade: "Lớp 8 - 9",
    description: "Nguyên tử, bảng tuần hoàn, phản ứng hóa học, Axit, Bazo, Muối và Oxit.",
    questions: [
      {
        id: 1,
        question: "Dung dịch Axit làm quỳ tím chuyển sang màu gì?",
        options: ["Xanh", "Đỏ", "Hồng", "Không đổi màu"],
        correctIndex: 1,
        explanation: "Dung dịch axit (như HCl, H2SO4) làm quỳ tím hóa đỏ."
      },
      {
        id: 2,
        question: "Công thức hóa học của khí Oxi dạng đơn chất là gì?",
        options: ["O", "O2", "O3", "2O"],
        correctIndex: 1,
        explanation: "Khí Oxi tồn tại ở dạng phân tử gồm 2 nguyên tử O liên kết với nhau: O2."
      },
      {
        id: 3,
        question: "Khí CO2 thu được từ phản ứng nào sau đây?",
        options: [
          "CaCO3 + 2HCl ➔ CaCl2 + CO2↑ + H2O",
          "2H2 + O2 ➔ 2H2O",
          "Fe + 2HCl ➔ FeCl2 + H2↑",
          "Cu + 2AgNO3 ➔ Cu(NO3)2 + 2Ag"
        ],
        correctIndex: 0,
        explanation: "Phản ứng giữa đá vôi CaCO3 và axit HCl giải phóng khí Cacbonic CO2."
      },
      {
        id: 4,
        question: "Hợp chất NaOH thuộc loại chất nào sau đây?",
        options: ["Axit", "Bazơ", "Muối", "Oxit"],
        correctIndex: 1,
        explanation: "Natri hydroxit (NaOH) là một bazơ tan mạnh (kiềm)."
      },
      {
        id: 5,
        question: "Kim loại nào sau đây phản ứng mãnh liệt với nước ở nhiệt độ thường?",
        options: ["Sắt (Fe)", "Đồng (Cu)", "Natri (Na)", "Vàng (Au)"],
        correctIndex: 2,
        explanation: "Natri (Na) là kim loại kiềm hoạt động rất mạnh, tác dụng với nước tạo NaOH và giải phóng H2."
      },
      {
        id: 6,
        question: "Khối lượng mol của khí Mêtan (CH4) bằng bao nhiêu g/mol?",
        options: ["12 g/mol", "16 g/mol", "18 g/mol", "44 g/mol"],
        correctIndex: 1,
        explanation: "M_(CH4) = 12 + 4 × 1 = 16 g/mol."
      }
    ]
  },
  {
    id: "biology_thcs",
    name: "Sinh Học THCS",
    level: "thcs",
    levelName: "THCS",
    color: "from-green-600 to-emerald-400",
    icon: "🧬",
    grade: "Lớp 6 - 9",
    description: "Tế bào học, quang hợp, cấu tạo cơ thể người, di truyền học Men-đen và sinh thái học.",
    questions: [
      {
        id: 1,
        question: "Cấu trúc nào được coi là đơn vị cơ bản cấu tạo nên mọi cơ thể sinh vật?",
        options: ["Mô", "Cơ quan", "Tế bào", "Hệ cơ quan"],
        correctIndex: 2,
        explanation: "Mọi sinh vật từ đơn bào đến đa bào đều được cấu tạo từ đơn vị cơ sở là tế bào."
      },
      {
        id: 2,
        question: "Trong quy luật di truyền Men-đen, phép lai một cặp tính trạng tương phản P: AA × aa thu được F1 có kiểu hình như thế nào?",
        options: ["100% tính trạng trội", "100% tính trạng lặn", "50% trội : 50% lặn", "75% trội : 25% lặn"],
        correctIndex: 0,
        explanation: "P: AA × aa ➔ F1: 100% Aa (đồng loạt mang kiểu hình tính trạng trội)."
      },
      {
        id: 3,
        question: "Bọ xít hút nhựa cây. Mối quan hệ giữa bọ xít và cây trồng thuộc kiểu quan hệ nào?",
        options: ["Cạnh tranh", "Ký sinh", "Cộng sinh", "Hội sinh"],
        correctIndex: 1,
        explanation: "Bọ xít sống dựa vào cơ thể cây, hút chất dinh dưỡng làm hại cây là mối quan hệ Ký sinh."
      },
      {
        id: 4,
        question: "Loại mạch máu nào dẫn máu giàu oxy từ tim đi nuôi các cơ quan trong cơ thể?",
        options: ["Động mạch", "Tĩnh mạch", "Mao mạch", "Mạch bạch huyết"],
        correctIndex: 0,
        explanation: "Động mạch chịu áp lực lớn đẩy máu giàu dinh dưỡng và O2 từ tim đến các mô."
      },
      {
        id: 5,
        question: "Phần lớn sự hấp thụ chất dinh dưỡng trong hệ tiêu hóa của người diễn ra ở đâu?",
        options: ["Dạ dày", "Ruột non", "Ruột già", "Thực quản"],
        correctIndex: 1,
        explanation: "Ruột non có diện tích bề mặt rất lớn nhờ vô số lông ruột giúp hấp thụ hầu hết chất dinh dưỡng."
      },
      {
        id: 6,
        question: "Cơ quan hô hấp chính của các loài cá sống dưới nước là gì?",
        options: ["Phổi", "Da", "Mang", "Hệ thống ống khí"],
        correctIndex: 2,
        explanation: "Cá hô hấp bằng mang thông qua dòng nước chảy qua các lá mang."
      }
    ]
  },
  {
    id: "history_geo_thcs",
    name: "Lịch Sử & Địa Lý THCS",
    level: "thcs",
    levelName: "THCS",
    color: "from-teal-600 to-sky-500",
    icon: "🗺️",
    grade: "Lớp 6 - 9",
    description: "Lịch sử dựng nước & giữ nước, vị trí địa lý, địa hình và tài nguyên thiên nhiên Việt Nam.",
    questions: [
      {
        id: 1,
        question: "Chiến thắng lịch sử trên sông Bạch Đằng năm 938 do ai lãnh đạo đã chấm dứt hơn 1000 năm Bắc thuộc?",
        options: ["Hai Bà Trưng", "Ngô Quyền", "Lý Thường Kiệt", "Trần Hưng Đạo"],
        correctIndex: 1,
        explanation: "Anh hùng dân tộc Ngô Quyền với kế sách cắm cọc nhọn trên sông Bạch Đằng đã đại phá quân Nam Hán năm 938."
      },
      {
        id: 2,
        question: "Sông nào có chiều dài lớn nhất chảy hoàn toàn trong lãnh thổ Việt Nam?",
        options: ["Sông Hồng", "Sông Mê Kông", "Sông Đồng Nai", "Sông Mã"],
        correctIndex: 2,
        explanation: "Sông Đồng Nai là lưu vực sông lớn nhất nằm hoàn toàn trong lãnh thổ Việt Nam."
      },
      {
        id: 3,
        question: "Khu vực địa hình nào chiếm phần lớn diện tích (khoảng 3/4) lãnh thổ phần đất liền Việt Nam?",
        options: ["Đồng bằng", "Đồi núi", "Hoang mạc", "Băng đảo"],
        correctIndex: 1,
        explanation: "Đồi núi chiếm khoảng 3/4 diện tích đất liền nước ta, nhưng chủ yếu là đồi núi thấp."
      },
      {
        id: 4,
        question: "Vị vua nào đã ban 'Chiếu dời đô' chuyển kinh đô từ Hoa Lư về Đại La (Hà Nội) năm 1010?",
        options: ["Lý Thái Tổ (Lý Công Uẩn)", "Trần Nhân Tông", "Lê Lợi", "Quang Trung"],
        correctIndex: 0,
        explanation: "Năm 1010, vua Lý Thái Tổ quyết định dời đô về Thăng Long mở ra thời kỳ hưng thịnh của Đại Việt."
      },
      {
        id: 5,
        question: "Đồng bằng sông Cửu Long là vùng sản xuất nông nghiệp hàng đầu Việt Nam về sản phẩm nào?",
        options: ["Lúa gạo và thủy hải sản", "Cà phê và cao su", "Chè và quế", "Rau củ ôn đới"],
        correctIndex: 0,
        explanation: "Đồng bằng sông Cửu Long là vựa lúa và trung tâm nuôi trồng xuất khẩu thủy sản lớn nhất cả nước."
      },
      {
        id: 6,
        question: "Vùng biển Việt Nam nằm trong đại dương nào?",
        options: ["Đại Tây Dương", "Ấn Độ Dương", "Thái Bình Dương", "Bắc Băng Dương"],
        correctIndex: 2,
        explanation: "Biển Đông nước ta là một biển tương đối kín thuộc Thái Bình Dương."
      }
    ]
  },

  // ==================== V-STUDY THPT (LỚP 10 - 12) ====================
  {
    id: "math_thpt",
    name: "Toán THPT",
    level: "thpt",
    levelName: "THPT",
    color: "from-blue-600 to-cyan-500",
    icon: "📐",
    grade: "Lớp 10 - 12",
    description: "Giải tích, Hình học không gian, Logarit, Nguyên hàm - Tích phân và Hình học Oxyz.",
    questions: [
      {
        id: 1,
        question: "Tìm tập xác định của hàm số y = log₂(x - 3).",
        options: ["D = (3; +∞)", "D = [3; +∞)", "D = ℝ \\ {3}", "D = (-∞; 3)"],
        correctIndex: 0,
        explanation: "Điều kiện xác định của log_a(u(x)) là u(x) > 0. Do đó, x - 3 > 0 ⇔ x > 3."
      },
      {
        id: 2,
        question: "Cho khối chóp có diện tích đáy B = 6 và chiều cao h = 4. Thể tích khối chóp đã cho bằng bao nhiêu?",
        options: ["V = 24", "V = 8", "V = 12", "V = 16"],
        correctIndex: 1,
        explanation: "Thể tích khối chóp: V = 1/3 * B * h = 1/3 * 6 * 4 = 8."
      },
      {
        id: 3,
        question: "Tìm họ nguyên hàm của hàm số f(x) = 3x² + 1.",
        options: ["F(x) = x³ + x + C", "F(x) = 6x + C", "F(x) = 3x³ + x + C", "F(x) = x³ + C"],
        correctIndex: 0,
        explanation: "∫(3x² + 1)dx = x³ + x + C."
      },
      {
        id: 4,
        question: "Trong không gian Oxyz, mặt phẳng (P): 2x - y + 3z - 5 = 0 có một vectơ pháp tuyến là gì?",
        options: ["n = (2; -1; 3)", "n = (2; 1; 3)", "n = (2; -1; -5)", "n = (-2; 1; 3)"],
        correctIndex: 0,
        explanation: "Vectơ pháp tuyến của mặt phẳng Ax + By + Cz + D = 0 là n = (A; B; C) = (2; -1; 3)."
      },
      {
        id: 5,
        question: "Tính đạo hàm của hàm số y = e^(2x).",
        options: ["y' = 2e^(2x)", "y' = e^(2x)", "y' = 2x e^(2x-1)", "y' = 1/2 e^(2x)"],
        correctIndex: 0,
        explanation: "(e^u)' = u' * e^u ⟹ (e^(2x))' = 2 e^(2x)."
      },
      {
        id: 6,
        question: "Giá trị cực đại của hàm số y = -x³ + 3x + 1 đạt tại x bằng bao nhiêu?",
        options: ["x = 1", "x = -1", "x = 3", "x = 0"],
        correctIndex: 0,
        explanation: "y' = -3x² + 3 = 0 ⇔ x = ±1. Bảng biến thiên cho thấy y đạt cực đại tại x = 1 (với y_CD = 3)."
      },
      {
        id: 7,
        question: "Cho cấp số cộng (un) có u1 = 3 và công sai d = 2. Số hạng thứ 5 (u5) bằng bao nhiêu?",
        options: ["11", "13", "10", "15"],
        correctIndex: 0,
        explanation: "u5 = u1 + 4d = 3 + 4 × 2 = 11."
      },
      {
        id: 8,
        question: "Có bao nhiêu cách chọn 3 học sinh từ một nhóm gồm 10 học sinh?",
        options: ["C(10,3) = 120", "A(10,3) = 720", "30", "10³ = 1000"],
        correctIndex: 0,
        explanation: "Số cách chọn không phân biệt thứ tự là tổ hợp chập 3 của 10: C(10,3) = (10 × 9 × 8)/(3 × 2 × 1) = 120."
      }
    ]
  },
  {
    id: "literature_thpt",
    name: "Ngữ Văn THPT",
    level: "thpt",
    levelName: "THPT",
    color: "from-amber-600 to-orange-500",
    icon: "✍️",
    grade: "Lớp 10 - 12",
    description: "Phân tích tác phẩm văn học hiện đại THPT, nghị luận văn học và nghị luận xã hội.",
    questions: [
      {
        id: 1,
        question: "Tác phẩm 'Vợ chồng A Phủ' của nhà văn Tô Hoài viết về cuộc sống của người dân ở vùng nào?",
        options: ["Tây Bắc", "Tây Nguyên", "Đông Bắc", "Nam Bộ"],
        correctIndex: 0,
        explanation: "Truyện khắc họa sâu sắc số phận và sức sống mãnh liệt của đồng bào nghèo miền núi Tây Bắc."
      },
      {
        id: 2,
        question: "Nhân vật Huấn Cao trong 'Chữ người tử tù' (Nguyễn Tuân) được lấy cảm hứng từ nguyên mẫu lịch sử nào?",
        options: ["Cao Bá Quát", "Nguyễn Trãi", "Chu Văn An", "Phan Bội Châu"],
        correctIndex: 0,
        explanation: "Huấn Cao lấy cảm hứng từ Cao Bá Quát - danh sĩ kiệt xuất viết chữ đẹp và hiên ngang chống phong kiến."
      },
      {
        id: 3,
        question: "Ai là tác giả của bài thơ 'Tây Tiến' xuất sắc về hình tượng người lính kháng Pháp?",
        options: ["Quang Dũng", "Chính Hữu", "Tố Hữu", "Nguyễn Khoa Điềm"],
        correctIndex: 0,
        explanation: "Nhà thơ Quang Dũng sáng tác 'Tây Tiến' năm 1948 tại Phù Lưu Chanh."
      },
      {
        id: 4,
        question: "Đoạn trích 'Đất Nước' (Nguyễn Khoa Điềm) thuộc trường ca nào?",
        options: [
          "Mặt đường khát vọng",
          "Những người đi tới biển",
          "Tháng Hai ở đáy giếng",
          "Sức trẻ dạt dào"
        ],
        correctIndex: 0,
        explanation: "Đoạn trích 'Đất Nước' nằm ở chương V của trường ca 'Mặt đường khát vọng' hoàn thành năm 1971."
      },
      {
        id: 5,
        question: "Bài thơ 'Sóng' của Xuân Quỳnh mượn hình tượng sóng biển để bộc lộ điều gì?",
        options: [
          "Vẻ đẹp mênh mông của biển cả",
          "Tình yêu đôi lứa mãnh liệt, thủy chung và khát vọng vĩnh hằng",
          "Nỗi đau chia ly thời chiến tranh",
          "Tình yêu thiên nhiên quê hương"
        ],
        correctIndex: 1,
        explanation: "Sóng và Em là hai hình tượng sóng đôi diễn tả muôn vàn trạng thái tâm trạng trong tình yêu của người phụ nữ."
      },
      {
        id: 6,
        question: "Nhân vật Tràng trong tác phẩm 'Vợ nhặt' của Kim Lân nhặt được vợ trong hoàn cảnh lịch sử nào?",
        options: [
          "Nạn đói khủng hếp năm 1945",
          "Cuộc kháng chiến chống Mỹ 1968",
          "Thời kỳ cải cách ruộng đất",
          "Thời kỳ bao cấp"
        ],
        correctIndex: 0,
        explanation: "Bối cảnh xóm ngụ cư trong trận đói thảm khốc năm 1945 khiến Tràng 'nhặt' được vợ chỉ bằng 4 bát bánh đúc."
      },
      {
        id: 7,
        question: "Tùy bút 'Ai đã đặt tên cho dòng sông?' của Hoàng Phủ Ngọc Tường ngợi ca vẻ đẹp của dòng sông nào?",
        options: ["Sông Hương (Huế)", "Sông Tiền", "Sông Hồng", "Sông Lam"],
        correctIndex: 0,
        explanation: "Tác phẩm là trang văn tài hoa mê đắm ngợi ca vẻ đẹp thiên nhiên và văn hóa sông Hương Huế."
      },
      {
        id: 8,
        question: "Kịch bản 'Hồn Trương Ba, da hàng thịt' của Lưu Quang Vũ đặt ra vấn đề triết lý nhân sinh nào?",
        options: [
          "Con người cần sống hòa hợp giữa thể xác và tâm hồn, không được sống vay mượn chắp vá",
          "Ưu tiên thỏa mãn nhu cầu thể xác trên hết",
          "Cuộc sống tâm hồn hoàn toàn độc lập với thể xác",
          "Sống vì đồng tiền là mục đích duy nhất"
        ],
        correctIndex: 0,
        explanation: "Vở kịch khẳng định giá trị con người chỉ thật sự hạnh phúc khi được sống là chính mình thống nhất giữa bên trong và bên ngoài."
      }
    ]
  },
  {
    id: "english_thpt",
    name: "Tiếng Anh THPT",
    level: "thpt",
    levelName: "THPT",
    color: "from-purple-600 to-indigo-500",
    icon: "🇬🇧",
    grade: "Lớp 10 - 12",
    description: "Đề thi thử THPT Quốc gia, đảo ngữ, câu điều kiện hỗn hợp, Collocations và Idioms.",
    questions: [
      {
        id: 1,
        question: "If I _______ you, I would study harder for the national high school graduation exam.",
        options: ["am", "was", "were", "had been"],
        correctIndex: 2,
        explanation: "Câu điều kiện loại 2: If + S + V2/were."
      },
      {
        id: 2,
        question: "She has been working as an English teacher in this high school _______ 2018.",
        options: ["for", "since", "in", "ago"],
        correctIndex: 1,
        explanation: "Thì Hiện tại hoàn thành tiếp diễn đi với mốc thời gian dùng 'since'."
      },
      {
        id: 3,
        question: "The more books you read, the _______ knowledge you will gain.",
        options: ["more", "much", "most", "many"],
        correctIndex: 0,
        explanation: "Cấu trúc so sánh kép: The + comparative, the + comparative."
      },
      {
        id: 4,
        question: "Hardly _______ at the bus stop when the bus arrived.",
        options: [
          "had he arrived",
          "he arrived",
          "arrived he",
          "he had arrived"
        ],
        correctIndex: 0,
        explanation: "Cấu trúc đảo ngữ: Hardly + had + S + V3/ed + when + S + V2/ed."
      },
      {
        id: 5,
        question: "Many young people choose to _______ gap year before going to university.",
        options: ["take", "do", "make", "pay"],
        correctIndex: 0,
        explanation: "Collocation chuẩn: 'take a gap year' (dành 1 năm nghỉ trải nghiệm)."
      },
      {
        id: 6,
        question: "I can't put _______ with his noisy behavior any longer.",
        options: ["up", "on", "off", "out"],
        correctIndex: 0,
        explanation: "Phrasal verb: 'put up with' có nghĩa là chịu đựng điều gì."
      },
      {
        id: 7,
        question: "Had I known about the party earlier, I _______ you.",
        options: [
          "would have joined",
          "will join",
          "would join",
          "joined"
        ],
        correctIndex: 0,
        explanation: "Đảo ngữ câu điều kiện loại 3: Had + S + V3, S + would have + V3."
      },
      {
        id: 8,
        question: "Despite _______ hard, he failed to pass the final driving test.",
        options: ["studying", "study", "studied", "he studied"],
        correctIndex: 0,
        explanation: "Despite / In spite of + V-ing / Noun phrase."
      }
    ]
  },
  {
    id: "physics_thpt",
    name: "Vật Lý THPT",
    level: "thpt",
    levelName: "THPT",
    color: "from-rose-600 to-pink-500",
    icon: "⚡",
    grade: "Lớp 10 - 12",
    description: "Dao động cơ, sóng cơ, mạch RLC nối tiếp, hạt nhân nguyên tử và quang điện ngoài.",
    questions: [
      {
        id: 1,
        question: "Chu kỳ dao động điều hòa của con lắc lò xo lý tưởng là công thức nào?",
        options: ["T = 2π √(m/k)", "T = 2π √(k/m)", "T = 2π √(g/l)", "T = 2π √(l/g)"],
        correctIndex: 0,
        explanation: "Chu kỳ con lắc lò xo: T = 2π √(m/k)."
      },
      {
        id: 2,
        question: "Sóng vô tuyến có bước sóng từ 10m đến 100m thuộc dải sóng nào?",
        options: ["Sóng dài", "Sóng trung", "Sóng ngắn", "Sóng cực ngắn"],
        correctIndex: 2,
        explanation: "Sóng ngắn có bước sóng từ 10m - 100m phản xạ tốt ở tầng điện di."
      },
      {
        id: 3,
        question: "Hiện tượng quang điện ngoài là hiện tượng bứt electron ra khỏi chất nào?",
        options: ["Chất bán dẫn", "Kim loại", "Chất điện phân", "Chất khí"],
        correctIndex: 1,
        explanation: "Quang điện ngoài xảy ra khi ánh sáng thích hợp chiếu vào bề mặt kim loại."
      },
      {
        id: 4,
        question: "Trong mạch điện xoay chiều RLC nối tiếp, hiện tượng cộng hưởng điện xảy ra khi nào?",
        options: ["ZL = ZC", "ZL > ZC", "ZL < ZC", "R = ZL"],
        correctIndex: 0,
        explanation: "Cộng hưởng điện xảy ra khi cảm kháng bằng dung kháng ZL = ZC ⇔ ω²LC = 1."
      },
      {
        id: 5,
        question: "Hạt nhân ₆C¹² có số prôtôn và số nơtron lần lượt là bao nhiêu?",
        options: ["6 prôtôn và 6 nơtron", "6 prôtôn và 12 nơtron", "12 prôtôn và 6 nơtron", "6 prôtôn và 18 nơtron"],
        correctIndex: 0,
        explanation: "Z = 6 (số proton), A = 12 (số khối) ⟹ Số nơtron N = A - Z = 12 - 6 = 6."
      },
      {
        id: 6,
        question: "Vận tốc truyền sóng v liên hệ với bước sóng λ và chu kỳ T theo công thức nào?",
        options: ["λ = v × T", "λ = v / T", "v = λ × T", "λ = v × f²"],
        correctIndex: 0,
        explanation: "Bước sóng là quãng đường sóng truyền trong 1 chu kỳ: λ = v × T."
      },
      {
        id: 7,
        question: "Tia nào sau đây có bản chất là sóng điện từ?",
        options: ["Tia Gamma (γ)", "Tia Alpha (α)", "Tia Beta cộng (β+)", "Tia Beta trừ (β-)"],
        correctIndex: 0,
        explanation: "Tia Gamma là sóng điện từ có bước sóng cực ngắn và năng lượng rất lớn."
      }
    ]
  },
  {
    id: "chemistry_thpt",
    name: "Hóa Học THPT",
    level: "thpt",
    levelName: "THPT",
    color: "from-emerald-600 to-teal-500",
    icon: "🧪",
    grade: "Lớp 10 - 12",
    description: "Este, Lipit, Polime, Kim loại kiềm, Điện phân và hóa học hữu cơ tổng hợp.",
    questions: [
      {
        id: 1,
        question: "Kim loại nào dẻo nhất có thể dát mỏng đến mức ánh sáng xuyên qua?",
        options: ["Vàng (Au)", "Bạc (Ag)", "Đồng (Cu)", "Nhôm (Al)"],
        correctIndex: 0,
        explanation: "Vàng (Au) là kim loại dẻo nhất trong tất cả các kim loại."
      },
      {
        id: 2,
        question: "Sắt (III) oxit có công thức hóa học chính xác là gì?",
        options: ["FeO", "Fe₂O₃", "Fe₃O₄", "Fe(OH)₃"],
        correctIndex: 1,
        explanation: "Sắt (III) oxit có công thức Fe₂O₃."
      },
      {
        id: 3,
        question: "Chất khí sinh ra khi đốt nhiên liệu hóa thạch gây hiệu ứng nhà kính mạnh nhất?",
        options: ["CO₂", "O₂", "N₂", "CO"],
        correctIndex: 0,
        explanation: "CO₂ giữ nhiệt bức xạ hồng ngoại gây biến đổi khí hậu toàn cầu."
      },
      {
        id: 4,
        question: "Công thức phân tử của Glucozơ là gì?",
        options: ["C₆H₁₂O₆", "C₁₂H₂₂O₁₁", "(C₆H₁₀O₅)n", "C₃H₅(OH)₃"],
        correctIndex: 0,
        explanation: "Glucozơ là một monosaccarit có công thức C₆H₁₂O₆."
      },
      {
        id: 5,
        question: "Este CH₃COOCH₃ có tên gọi hệ thống là gì?",
        options: ["Metyl axetat", "Etyl axetat", "Axetic metyl", "Metyl fomat"],
        correctIndex: 0,
        explanation: "Gốc CH3- gắn vào -COO- tạo thành Metyl axetat."
      },
      {
        id: 6,
        question: "Polime nào sau đây được dùng chế tạo tơ nilon-6,6?",
        options: [
          "Poly(hexametylen adipamit)",
          "Polyisopren",
          "Polyvinyl clorua",
          "Polystiren"
        ],
        correctIndex: 0,
        explanation: "Tơ nilon-6,6 trùng ngưng từ hexametylen điamin và axit adipic."
      },
      {
        id: 7,
        question: "Đốt cháy hoàn toàn kim loại Nhôm (Al) trong khí Clo thu được muối nào?",
        options: ["AlCl₃", "AlCl₂", "Al₂Cl₃", "AlClO"],
        correctIndex: 0,
        explanation: "2Al + 3Cl₂ ➔ 2AlCl₃ (Nhôm clorua)."
      }
    ]
  },
  {
    id: "biology_thpt",
    name: "Sinh Học THPT",
    level: "thpt",
    levelName: "THPT",
    color: "from-green-600 to-emerald-400",
    icon: "🍀",
    grade: "Lớp 10 - 12",
    description: "Di truyền cấp độ phân tử, ADN, Mã di truyền, Đột biến gen và Tiến hóa sinh học.",
    questions: [
      {
        id: 1,
        question: "Ở sinh vật nhân thực, quá trình tự nhân đôi ADN diễn ra chủ yếu ở đâu?",
        options: ["Nhân tế bào", "Tế bào chất", "Ribôxôm", "Màng tế bào"],
        correctIndex: 0,
        explanation: "ADN di truyền cuộn xoắn nằm trong nhân nên nhân đôi chủ yếu ở nhân tế bào."
      },
      {
        id: 2,
        question: "Loại ARN nào đảm nhận vận chuyển axit amin đến ribôxôm trong dịch mã?",
        options: ["tARN", "mARN", "rARN", "ADN"],
        correctIndex: 0,
        explanation: "tARN (transfer RNA) đóng vai trò người vận chuyển axit amin."
      },
      {
        id: 3,
        question: "Bộ ba mở đầu trên mARN quy định axit amin Mêtiônin ở sinh vật nhân thực là bộ ba nào?",
        options: ["5'AUG3'", "5'UAA3'", "5'UAG3'", "5'UGA3'"],
        correctIndex: 0,
        explanation: "Bộ ba 5'AUG3' vừa là tín hiệu mở đầu dịch mã vừa mã hóa cho Mêtiônin."
      },
      {
        id: 4,
        question: "Đột biến gen là những biến đổi xảy ra ở cấu trúc của cái gì?",
        options: ["Một hoặc một số cặp nuclêôtit", "Nhiễm sắc thể", "Tế bào chất", "Protein"],
        correctIndex: 0,
        explanation: "Đột biến gen là những biến đổi trong cấu trúc của gen liên quan đến 1 hoặc một số cặp nucleotit."
      },
      {
        id: 5,
        question: "Thành phần di truyền của một quần thể giao phối được đặc trưng bởi điều gì?",
        options: [
          "Tần số kiểu gen và tần số alen",
          "Số lượng cá thể",
          "Mật độ cá thể",
          "Sức sinh sản"
        ],
        correctIndex: 0,
        explanation: "Cấu trúc di truyền quần thể được thể hiện qua tần số các alen và tần số các kiểu gen."
      },
      {
        id: 6,
        question: "Theo thuyết tiến hóa hiện đại, nhân tố nào cung cấp nguồn nguyên liệu sơ cấp cho quá trình tiến hóa?",
        options: ["Đột biến", "Chọn lọc tự nhiên", "Giao phối không ngẫu nhiên", "Các yếu tố ngẫu nhiên"],
        correctIndex: 0,
        explanation: "Đột biến gen tạo ra các alen mới là nguồn nguyên liệu sơ cấp dồi dào."
      }
    ]
  },
  {
    id: "history_thpt",
    name: "Lịch Sử THPT",
    level: "thpt",
    levelName: "THPT",
    color: "from-red-600 to-rose-500",
    icon: "📜",
    grade: "Lớp 10 - 12",
    description: "Lịch sử Việt Nam hiện đại 1919-1975, các chiến dịch lớn, ASEAN và quan hệ quốc tế.",
    questions: [
      {
        id: 1,
        question: "Sự kiện lịch sử ký kết Hiệp định Giơ-ne-vơ 1954 chấm dứt ách đô hộ của ai?",
        options: ["Thực dân Pháp", "Đế quốc Mỹ", "Phát xít Nhật", "Quân Nam Hán"],
        correctIndex: 0,
        explanation: "Hiệp định Giơ-ne-vơ buộc thực dân Pháp rút hết quân chấm dứt chiến tranh."
      },
      {
        id: 2,
        question: "Hội nghị thành lập Đảng Cộng sản Việt Nam đầu năm 1930 diễn ra ở đâu?",
        options: ["Cửu Long, Hương Cảng (Trung Quốc)", "Quảng Châu", "Cao Bằng", "Tuyên Quang"],
        correctIndex: 0,
        explanation: "Nguyễn Ái Quốc chủ trì hội nghị hợp nhất tại Cửu Long, Hương Cảng từ 6/1/1930."
      },
      {
        id: 3,
        question: "Chiến dịch Hồ Chí Minh lịch sử giải phóng hoàn toàn miền Nam diễn ra vào năm nào?",
        options: ["1975", "1954", "1972", "1968"],
        correctIndex: 0,
        explanation: "Ngày 30/4/1975, Chiến dịch Hồ Chí Minh hoàn thành thắng lợi rực rỡ thống nhất đất nước."
      },
      {
        id: 4,
        question: "Tổ chức ASEAN được thành lập vào năm nào tại Băng Cốc (Thái Lan)?",
        options: ["1967", "1975", "1995", "1945"],
        correctIndex: 0,
        explanation: "ASEAN thành lập ngày 8/8/1967 thúc đẩy hòa bình hợp tác khu vực Đông Nam Á."
      },
      {
        id: 5,
        question: "Cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968 có ý nghĩa chiến lược nào?",
        options: [
          "Buộc Mỹ phải tuyên bố 'phi Mỹ hóa' chiến tranh xâm lược và ngồi vào bàn đàm phán Paris",
          "Giải phóng hoàn toàn miền Nam",
          "Đánh bại hoàn toàn chiến lược 'Chiến tranh đơn phương'",
          "Chấm dứt chiến tranh phá hoại lần 2"
        ],
        correctIndex: 0,
        explanation: "Xuân Mậu Thân 1968 giáng đòn bất ngờ làm phá sản chiến lược 'Chiến tranh cục bộ'."
      },
      {
        id: 6,
        question: "Bản Tuyên ngôn Độc lập do Chủ tịch Hồ Chí Minh đọc tại Quảng trường Ba Đình ngày tháng năm nào?",
        options: ["2/9/1945", "19/8/1945", "30/4/1975", "22/12/1944"],
        correctIndex: 0,
        explanation: "Ngày 2/9/1945, Tuyên ngôn Độc lập khai sinh ra nước Việt Nam Dân chủ Cộng hòa."
      }
    ]
  },
  {
    id: "geography_thpt",
    name: "Địa Lý THPT",
    level: "thpt",
    levelName: "THPT",
    color: "from-teal-600 to-sky-500",
    icon: "🗺️",
    grade: "Lớp 10 - 12",
    description: "Địa lý tự nhiên, địa lý dân cư, các vùng kinh tế Việt Nam và Biển Đông.",
    questions: [
      {
        id: 1,
        question: "Đất Feralit đỏ vàng là nhóm đất đặc trưng của cảnh quan khí hậu nào nước ta?",
        options: ["Nhiệt đới ẩm gió mùa", "Cận nhiệt đới", "Ôn đới", "Xích đạo khô hạn"],
        correctIndex: 0,
        explanation: "Khí hậu nhiệt đới ẩm gió mùa thúc đẩy phong hóa tích tụ oxit sắt và nhôm."
      },
      {
        id: 2,
        question: "Điểm cực Bắc đất liền Việt Nam nằm ở Lũng Cú thuộc tỉnh nào?",
        options: ["Hà Giang", "Cà Mau", "Điện Biên", "Khánh Hòa"],
        correctIndex: 0,
        explanation: "Cực Bắc tại xã Lũng Cú, huyện Đồng Văn, tỉnh Hà Giang (vĩ độ 23°23'B)."
      },
      {
        id: 3,
        question: "Gió mùa Đông Bắc hoạt động chủ yếu ở miền nào nước ta vào mùa đông?",
        options: ["Miền Bắc và Bắc Trung Bộ", "Tây Nguyên", "Nam Bộ", "Tây Nam Bộ"],
        correctIndex: 0,
        explanation: "Gió mùa Đông Bắc tràn qua miền Bắc và Bắc Trung Bộ tạo nên mùa đông lạnh."
      },
      {
        id: 4,
        question: "Vùng kinh tế nào nước ta dẫn đầu về giá trị sản xuất công nghiệp và thu hút vốn FDI?",
        options: ["Đông Nam Bộ", "Đồng bằng sông Hồng", "Duyên hải Nam Trung Bộ", "Tây Nguyên"],
        correctIndex: 0,
        explanation: "Đông Nam Bộ (TP.HCM, Bình Dương, Đồng Nai, Bà Rịa-Vũng Tàu) là vùng kinh tế năng động nhất."
      },
      {
        id: 5,
        question: "Hai quần đảo xa bờ thuộc chủ quyền thiêng liêng của Việt Nam trên Biển Đông là gì?",
        options: [
          "Hoàng Sa và Trường Sa",
          "Côn Đảo và Phú Quốc",
          "Cát Bà và Lý Sơn",
          "Phú Quý và Cô Tô"
        ],
        correctIndex: 0,
        explanation: "Hoàng Sa (Đà Nẵng) và Trường Sa (Khánh Hòa) là hai quần đảo thuộc chủ quyền Việt Nam."
      },
      {
        id: 6,
        question: "Quá trình đô thị hóa ở Việt Nam hiện nay có đặc điểm nổi bật nào?",
        options: [
          "Chuyển biến tích cực nhưng tỷ lệ dân đô thị vẫn còn thấp so với thế giới",
          "Tỷ lệ dân đô thị cao nhất thế giới",
          "Phân bố đô thị rất đồng đều giữa các vùng",
          "Không có sự xuất hiện của các đô thị lớn"
        ],
        correctIndex: 0,
        explanation: "Đô thị hóa đang diễn ra nhanh chóng song tỷ lệ dân đô thị vẫn đang tiếp tục phát triển."
      }
    ]
  }
];

export function getSuperExamSubject(): Subject {
  const allQuestions: Question[] = [];
  let globalId = 1;

  // Gather questions from all subjects with subject tags
  subjectsData.forEach((subj) => {
    subj.questions.forEach((q) => {
      allQuestions.push({
        ...q,
        id: globalId++,
        subjectTag: `${subj.name} (${subj.grade})`,
      });
    });
  });

  // Ensure exactly 100 questions (cycle through questions if needed)
  const questions100: Question[] = [];
  while (questions100.length < 100 && allQuestions.length > 0) {
    for (const q of allQuestions) {
      if (questions100.length >= 100) break;
      questions100.push({
        ...q,
        id: questions100.length + 1
      });
    }
  }

  return {
    id: "super_exam",
    name: "BÀI KIỂM TRA SIÊU TỔNG HỢP",
    level: "all",
    levelName: "Toàn Cấp Học (Lớp 1 - 12)",
    color: "from-[#cc1827] via-amber-500 to-purple-600",
    icon: "⚡",
    grade: "100 CÂU • 2 TIẾNG",
    description: "Kỳ thi thử Siêu Tổng Hợp toàn diện bao gồm 100 câu hỏi trắc nghiệm chuẩn hóa được trích từ tất cả các môn học từ Lớp 1 đến Lớp 12. Thời gian làm bài chính thức 120 phút (2 tiếng).",
    questions: questions100
  };
}
