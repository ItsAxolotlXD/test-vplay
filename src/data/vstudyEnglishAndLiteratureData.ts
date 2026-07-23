export type EnglishLevel = "A2" | "B1" | "B1+" | "B2";

export type ListeningQuestionType = "multiple_choice" | "fill_blank" | "listen_tick" | "listen_number";

export interface ListeningQuestion {
  id: number;
  type?: ListeningQuestionType; // default "multiple_choice"
  question: string;
  // Multiple choice
  options?: string[];
  correctIndex?: number;
  // Fill in the blank
  blankAnswer?: string;
  // Listen and Tick
  tickStatements?: string[];
  correctTickIndices?: number[];
  // Listen and Number
  numberItems?: string[];
  correctOrder?: number[]; // Array of correct 1-based order numbers e.g. [3, 1, 4, 2]
  explanation: string;
}

export interface ListeningExercise {
  id: string;
  title: string;
  level: EnglishLevel;
  topic: string;
  transcript: string;
  accent: "en-US" | "en-GB";
  questions: ListeningQuestion[];
}

export interface ReadingExercise {
  id: string;
  title: string;
  level: EnglishLevel;
  topic: string;
  passage: string;
  questions: {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface WritingExercise {
  id: string;
  title: string;
  level: EnglishLevel;
  taskType: "Task 1" | "Task 2";
  prompt: string;
  suggestedStructure: string[];
  vocabularyHints: string[];
  sampleAnswer: string;
  minWords: number;
  maxWords: number;
}

export interface SpeakingExercise {
  id: string;
  title: string;
  level: EnglishLevel;
  part: "Part 1" | "Part 2" | "Part 3";
  prompt: string;
  prepTimeSeconds: number;
  speakTimeSeconds: number;
  guidingQuestions: string[];
  sampleVocabulary: string[];
}

export interface LiteratureEssayPrompt {
  id: string;
  title: string;
  type: "Đoạn văn 200 chữ" | "Bài văn 600 chữ";
  category: "Nghị luận xã hội" | "Nghị luận văn học";
  grade: "THCS" | "THPT";
  targetWordCount: number;
  prompt: string;
  outline: {
    section: string;
    content: string;
  }[];
  keyIdeas: string[];
  samplePassage: string;
}

// ==================== ENGLISH LISTENING EXERCISES ====================
export const listeningExercises: ListeningExercise[] = [
  {
    id: "eng_list_a2_1",
    title: "Daily Routine & Hobbies",
    level: "A2",
    topic: "Cuộc sống hàng ngày & Sở thích",
    accent: "en-US",
    transcript: "Hello! My name is Sarah. I am 14 years old and I live in Hanoi. Every day, I wake up at 6:30 in the morning. I usually have bread and milk for breakfast. Then, I ride my bicycle to school. My favorite subject at school is English because I love watching movies in English. In the afternoon, I play badminton with my friends in the park near my house. In the evening, after doing my homework, I listen to acoustic pop music before going to bed at 10:00 PM.",
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "What time does Sarah wake up in the morning?",
        options: ["6:00 AM", "6:30 AM", "7:00 AM", "7:30 AM"],
        correctIndex: 1,
        explanation: "Trong bài nghe Sarah nói: 'Every day, I wake up at 6:30 in the morning'."
      },
      {
        id: 2,
        type: "fill_blank",
        question: "Sarah rides her _____ to school every morning.",
        blankAnswer: "bicycle",
        explanation: "Từ cần điền là 'bicycle' trong câu: 'Then, I ride my bicycle to school'."
      },
      {
        id: 3,
        type: "listen_tick",
        question: "Tick (✔) ALL the true statements according to Sarah's routine:",
        tickStatements: [
          "Sarah lives in Hanoi and is 14 years old.",
          "Sarah plays football with her friends in the afternoon.",
          "Sarah's favorite subject is English.",
          "Sarah goes to bed at 11:30 PM."
        ],
        correctTickIndices: [0, 2],
        explanation: "Các câu đúng: Sarah 14 tuổi sống ở Hà Nội và môn học yêu thích là Tiếng Anh. Môn thể thao là cầu lông (badminton) và giờ đi ngủ là 10:00 PM."
      }
    ]
  },
  {
    id: "eng_list_b1_1",
    title: "Airport Announcement & Travel Logistics",
    level: "B1",
    topic: "Thông báo sân bay & Hậu cần chuyến bay quốc tế",
    accent: "en-GB",
    transcript: "Attention all passengers holding boarding passes for British Airways Flight BA 178 departing for Tokyo Narita International Airport. We regret to inform you that due to severe thunderstorm activity and localized air traffic congestion over Northern Europe, the scheduled departure time has been postponed by 45 minutes. The updated boarding time will now commence at 3:15 PM precisely at Gate B12.\n\nPassengers requiring mobility assistance, elderly travelers, and families with young infants are kindly asked to present their documents at Gate B12 first for priority boarding. Additionally, please ensure that all carry-on baggage complies with our airline weight limit of 8 kilograms per bag. Complimentary meal vouchers worth 15 pounds are now available for collection at Customer Service Desk 4 upon presenting your valid passport. We sincerely apologize for this unexpected delay and appreciate your cooperation.",
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "What is the primary reason for the flight delay?",
        options: [
          "Technical engine failure",
          "Severe thunderstorm activity and air traffic congestion",
          "Security screening complications",
          "Shortage of cabin crew personnel"
        ],
        correctIndex: 1,
        explanation: "Thông báo ghi rõ: 'due to severe thunderstorm activity and localized air traffic congestion'."
      },
      {
        id: 2,
        type: "fill_blank",
        question: "The revised boarding time will begin at 3:15 PM at Gate _____.",
        blankAnswer: "B12",
        explanation: "Số cổng lên máy bay mới được nhắc tới là 'Gate B12'."
      },
      {
        id: 3,
        type: "listen_tick",
        question: "Listen and tick (✔) ALL facts confirmed in the recording:",
        tickStatements: [
          "Carry-on baggage must not exceed 8 kilograms per bag.",
          "Passengers can collect 15-pound meal vouchers at Customer Service Desk 4.",
          "Flight BA 178 is flying directly to London Heathrow Airport.",
          "Priority boarding is provided for passengers requiring mobility assistance and families with infants."
        ],
        correctTickIndices: [0, 1, 3],
        explanation: "Các thông tin đúng: Trọng lượng hành lý xách tay tối đa 8kg, voucher ăn 15 bảng tại Bàn 4, và ưu tiên lên máy bay cho người cần hỗ trợ & trẻ nhỏ."
      },
      {
        id: 4,
        type: "listen_number",
        question: "Listen and number the passenger boarding procedures in chronological order (1 to 4):",
        numberItems: [
          "Complimentary meal voucher collection at Desk 4",
          "Priority boarding for families and passengers needing assistance at Gate B12",
          "General passenger document inspection and boarding at Gate B12",
          "Announcement of flight delay due to severe weather"
        ],
        correctOrder: [2, 3, 4, 1],
        explanation: "Thứ tự trong thông báo: (1) Thông báo trễ chuyến -> (2) Lấy voucher tại Desk 4 -> (3) Ưu tiên gia đình & khách hỗ trợ -> (4) Kiểm tra giấy tờ & lên máy bay chung."
      }
    ]
  },
  {
    id: "eng_list_b1p_1",
    title: "Executive Job Interview & Digital Transformation Strategy",
    level: "B1+",
    topic: "Phỏng vấn cấp cao & Chiến lược chuyển đổi số",
    accent: "en-US",
    transcript: "Interviewer: Good morning, Alex. Thank you for making time for this final-round interview. To begin, could you synthesize your core contributions to digital strategy during your tenure at Apex Global?\n\nAlex: Good morning! Over the past four years, I led a cross-functional marketing and product development team of twelve specialists. Our primary objective was digitizing customer acquisition channels. By deploying targeted short-form video campaigns and restructuring our SEO architecture, we increased organic traffic by 65% and boosted social conversion rates by 42% within eighteen months.\n\nInterviewer: That sounds impressive. How did you handle budget constraints and resistance from senior stakeholders during that major transition?\n\nAlex: Initially, traditional executives were skeptical about reallocating 30% of our print advertising budget toward automated social platforms. To mitigate their concerns, I organized bi-weekly performance workshops and launched a low-risk pilot campaign in regional markets first. The pilot yielded a 3.5x return on ad spend within eight weeks, which decisively convinced the board to approve the full nationwide rollout.",
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "How long did Alex work at Apex Global?",
        options: ["Two years", "Three years", "Four years", "Five years"],
        correctIndex: 2,
        explanation: "Alex trả lời: 'Over the past four years, I led a cross-functional marketing...'."
      },
      {
        id: 2,
        type: "fill_blank",
        question: "Alex's team successfully increased organic web traffic by _____ percent.",
        blankAnswer: "65",
        explanation: "Alex báo cáo: 'increased organic traffic by 65%'."
      },
      {
        id: 3,
        type: "listen_tick",
        question: "Listen and tick (✔) ALL strategies Alex used to overcome stakeholder skepticism:",
        tickStatements: [
          "Organized bi-weekly performance workshops for executives.",
          "Launched a low-risk pilot campaign in regional markets first.",
          "Threatened to resign if the budget was not approved immediately.",
          "Demonstrated a 3.5x return on ad spend during the pilot phase."
        ],
        correctTickIndices: [0, 1, 3],
        explanation: "Chiến lược được đề cập: Tổ chức workshop 2 tuần/lần, làm chiến dịch thử nghiệm tại khu vực và chứng minh tỷ suất lợi nhuận 3.5x."
      },
      {
        id: 4,
        type: "listen_number",
        question: "Listen and number Alex's project execution steps in sequence (1 to 4):",
        numberItems: [
          "Full nationwide rollout of the digital strategy",
          "Launching a low-risk regional pilot campaign",
          "Reallocating 30% of the print advertising budget",
          "Organizing bi-weekly performance workshops for traditional board members"
        ],
        correctOrder: [4, 2, 3, 1],
        explanation: "Thứ tự thực hiện: (1) Đề xuất phân bổ 30% ngân sách -> (2) Tổ chức workshop -> (3) Thử nghiệm chiến dịch khu vực -> (4) Triển khai toàn quốc."
      }
    ]
  },
  {
    id: "eng_list_b2_1",
    title: "Global Climate Resilience, Smart Grids & Microclimate Science",
    level: "B2",
    topic: "Khả năng chống chịu khí hậu, Lưới điện thông minh & Vi khí hậu đô thị",
    accent: "en-GB",
    transcript: "Good evening distinguished delegates and colleagues. Welcome to the Keynote Session of the International Conference on Renewable Energy and Urban Sustainability. Today, we examine the systemic integration of distributed solar and offshore wind infrastructure across rapidly expanding metropolitan zones in Southeast Asia.\n\nAccording to the latest multi-national environmental assessment published by the Intergovernmental Panel on Climate Change, photovoltaic power generation capacity in Vietnam has surged by approximately 32% year-on-year. Urban agglomerations such as Ho Chi Minh City and Da Nang are transitioning from traditional fossil fuel dependence to floating solar arrays situated on inland reservoirs and high-capacity offshore wind turbines along coastal shelves.\n\nHowever, grid resilience presents an intricate engineering paradox. Intermittent renewable supply creates significant voltage fluctuations and grid frequency instability during peak demand hours. To counteract these operational bottlenecks, grid operators are deploying AI-driven predictive load balancing algorithms and utility-scale lithium-iron-phosphate battery storage facilities. Achieving absolute carbon neutrality by 2050 will necessitate sustained public-private venture funding, cross-border clean energy trading grids, and stringent building energy efficiency regulations.",
    questions: [
      {
        id: 1,
        type: "multiple_choice",
        question: "According to the IPCC report, what was the annual growth rate of photovoltaic generation in Vietnam?",
        options: ["18%", "25%", "Approximately 32%", "Over 45%"],
        correctIndex: 2,
        explanation: "Bài phát biểu ghi rõ: 'capacity in Vietnam has surged by approximately 32% year-on-year'."
      },
      {
        id: 2,
        type: "fill_blank",
        question: "Grid operators are deploying utility-scale _____ battery storage facilities to manage energy fluctuations.",
        blankAnswer: "lithium-iron-phosphate",
        explanation: "Loại pin lưu trữ dung lượng lớn được đề cập là 'lithium-iron-phosphate'."
      },
      {
        id: 3,
        type: "listen_tick",
        question: "Listen and tick (✔) ALL key technological solutions mentioned in the lecture:",
        tickStatements: [
          "Floating solar arrays on inland reservoirs.",
          "Offshore wind turbines deployed along coastal shelves.",
          "Subsidized coal-fired power plants for backup generation.",
          "AI-driven predictive load balancing algorithms."
        ],
        correctTickIndices: [0, 1, 3],
        explanation: "Các giải pháp công nghệ: Điện mặt trời nổi, điện gió ngoài khơi và thuật toán AI cân bằng tải."
      },
      {
        id: 4,
        type: "listen_number",
        question: "Listen and number the milestones toward carbon neutrality by 2050 in sequence (1 to 4):",
        numberItems: [
          "Achieving full carbon neutrality target by 2050",
          "Deploying AI predictive load balancing and battery storage systems",
          "Transitioning urban centers toward floating solar and offshore wind",
          "Securing sustained public-private venture funding and cross-border clean energy trading"
        ],
        correctOrder: [4, 2, 1, 3],
        explanation: "Thứ tự lộ trình: (1) Chuyển dịch năng lượng tái tạo -> (2) Triển khai pin & AI quản lý lưới -> (3) Đầu tư tài chính & giao dịch năng lượng -> (4) Đạt phát thải ròng bằng 0 vào năm 2050."
      }
    ]
  }
];

// ==================== ENGLISH READING EXERCISES ====================
export const readingExercises: ReadingExercise[] = [
  {
    id: "eng_read_a2_1",
    title: "My Hometown & Family Traditions",
    level: "A2",
    topic: "Quê hương & Truyền thống gia đình",
    passage: "Hanoi is the capital city of Vietnam. It is famous for its long history, beautiful lakes, and delicious street food. During Tet, which is the Lunar New Year holiday, families gather together to celebrate. People clean and decorate their homes with peach blossom flowers and kumquat trees. Children get red envelopes with lucky money from their grandparents and parents. Everyone enjoys eating banh chung, a traditional rice cake made with green beans and pork.",
    questions: [
      {
        id: 1,
        question: "What is Hanoi famous for according to the text?",
        options: [
          "Skyscrapers and fast food",
          "Long history, beautiful lakes, and street food",
          "Cold snow and high mountains",
          "Only modern shopping malls"
        ],
        correctIndex: 1,
        explanation: "Đoạn văn viết: 'It is famous for its long history, beautiful lakes, and delicious street food'."
      },
      {
        id: 2,
        question: "What do people decorate their houses with during Tet?",
        options: [
          "Pine trees and lights",
          "Peach blossom flowers and kumquat trees",
          "Sunflowers and roses",
          "Paper lanterns only"
        ],
        correctIndex: 1,
        explanation: "Đoạn văn viết: 'People clean and decorate their homes with peach blossom flowers and kumquat trees'."
      },
      {
        id: 3,
        question: "What ingredient is NOT mentioned in banh chung?",
        options: ["Rice", "Green beans", "Pork", "Chocolate"],
        correctIndex: 3,
        explanation: "Bánh chưng gồm 'rice, green beans, pork'. Socola (Chocolate) không được đề cập."
      }
    ]
  },
  {
    id: "eng_read_b1_1",
    title: "The Evolution of Smart Technology & Human Cognitive Habits",
    level: "B1",
    topic: "Sự phát triển của công nghệ thông minh & Thói quen tư duy",
    passage: "Over the last three decades, smartphones and ubiquitous mobile internet access have fundamentally transformed the way human beings communicate, process information, and navigate modern daily life. In the late 1990s and early 2000s, cellular phones were predominantly utilized for basic voice calls and monochrome short text messages. Today, contemporary smartphones are effectively handheld supercomputers capable of performing high-speed cloud computing, artificial intelligence processing, instant video broadcasting, and biometric authentication.\n\nWhile these technological breakthroughs have unleashed unprecedented convenience and global connectivity, psychologists and cognitive researchers express growing concern regarding their unintended consequences. Continuous digital notifications and instant gratification mechanisms frequently fragment human attention spans. Studies demonstrate that adolescents who spend more than four hours daily on social media platforms exhibit higher rates of sleep disturbance, reduced deep-reading concentration, and diminished face-to-face social empathy.\n\nTo cultivate a healthier relationship with digital tools, educational institutions and health organizations actively advocate for 'digital hygiene'. This practice encourages setting dedicated screen-free zones at home, engaging in outdoor physical recreation, and scheduling intentional offline periods during academic study hours.",
    questions: [
      {
        id: 1,
        question: "What primary functions did cellular phones serve in the late 1990s and early 2000s?",
        options: [
          "Editing high-definition videos and cloud gaming",
          "Basic voice calls and short text messages",
          "Biometric payment and satellite navigation",
          "Artificial intelligence tutoring and online voting"
        ],
        correctIndex: 1,
        explanation: "Đoạn 1 nêu rõ: 'cellular phones were predominantly utilized for basic voice calls and monochrome short text messages'."
      },
      {
        id: 2,
        question: "According to cognitive researchers, what is a negative effect of excessive smartphone usage among adolescents?",
        options: [
          "Increase in physical height",
          "Fragmented attention spans and reduced deep-reading concentration",
          "Improvement in handwriting skills",
          "Complete loss of hearing ability"
        ],
        correctIndex: 1,
        explanation: "Đoạn 2 chỉ ra: 'exhibit higher rates of sleep disturbance, reduced deep-reading concentration, and diminished face-to-face social empathy'."
      },
      {
        id: 3,
        question: "The word 'ubiquitous' in Paragraph 1 is closest in meaning to:",
        options: ["Rare and expensive", "Present and existing everywhere", "Dangerous to health", "Extremely slow"],
        correctIndex: 1,
        explanation: "'Ubiquitous' có nghĩa là phổ biến ở khắp mọi nơi."
      },
      {
        id: 4,
        question: "What is recommended as part of 'digital hygiene' practices?",
        options: [
          "Upgrading smartphones every six months",
          "Setting screen-free zones and scheduling intentional offline periods",
          "Replacing all paper books with tablet screens",
          "Studying while watching online videos continuously"
        ],
        correctIndex: 1,
        explanation: "Đoạn 3 đề xuất: 'setting dedicated screen-free zones at home... and scheduling intentional offline periods'."
      }
    ]
  },
  {
    id: "eng_read_b1p_1",
    title: "Artificial Intelligence in Modern Educational Paradigms & Ethics",
    level: "B1+",
    topic: "Trí tuệ nhân tạo trong giáo dục hiện đại & Đạo đức công nghệ",
    passage: "Artificial Intelligence (AI) is rapidly restructuring global educational paradigms, fundamentally altering how curricula are designed, delivered, and assessed. Adaptive machine learning platforms now possess the capacity to continuously analyze an individual student's learning speed, diagnostic error patterns, and cognitive preferences. By synthesizing this data, algorithmic tutors generate personalized learning pathways, offering tailored problem sets that challenge advanced learners while providing immediate scaffolding support for those struggling with foundational concepts.\n\nBeyond customized instruction, automated grading systems and natural language processors significantly alleviate administrative burdens for educators. Teachers can reallocate saved administrative hours toward mentorship, emotional guidance, and fostering collaborative group discussions. Furthermore, voice-enabled AI translation tools allow students from diverse linguistic backgrounds to access international academic repositories without insurmountable language barriers.\n\nNevertheless, the integration of generative AI in academia introduces profound ethical dilemmas. The risk of automated plagiarism, intellectual dishonesty, and algorithmic bias in grading models raises significant concerns among university boards. Educators firmly emphasize that while AI algorithms serve as exceptional pedagogical assistants, they can never supplant human educators. Human teachers remain indispensable for imparting moral philosophy, critical skepticism, empathy, and social accountability—qualities that code alone cannot replicate.",
    questions: [
      {
        id: 1,
        question: "How do adaptive machine learning platforms personalize education for students?",
        options: [
          "By grading all students using a single standardized test",
          "By analyzing learning speed and diagnostic error patterns to create tailored pathways",
          "By forcing all students to memorize identical textbook chapters",
          "By replacing school classrooms with virtual reality gaming arenas"
        ],
        correctIndex: 1,
        explanation: "Đoạn 1 nêu: 'analyze an individual student's learning speed, diagnostic error patterns... generate personalized learning pathways'."
      },
      {
        id: 2,
        question: "How can teachers benefit from automated grading systems?",
        options: [
          "By taking longer paid holidays",
          "By reallocating saved time toward mentorship, emotional guidance, and group discussions",
          "By stopping all classroom interactions completely",
          "By reducing their own academic qualifications"
        ],
        correctIndex: 1,
        explanation: "Đoạn 2 giải thích: 'Teachers can reallocate saved administrative hours toward mentorship, emotional guidance...'."
      },
      {
        id: 3,
        question: "What ethical concern regarding generative AI is highlighted in Paragraph 3?",
        options: [
          "High electricity bills in school libraries",
          "Automated plagiarism, intellectual dishonesty, and algorithmic bias",
          "Hardware overheating during winter months",
          "Inability to display colorful graphics"
        ],
        correctIndex: 1,
        explanation: "Đoạn 3 đề cập: 'The risk of automated plagiarism, intellectual dishonesty, and algorithmic bias'."
      },
      {
        id: 4,
        question: "The word 'supplant' in Paragraph 3 is closest in meaning to:",
        options: ["To assist or support", "To replace or supersede", "To congratulate", "To examine closely"],
        correctIndex: 1,
        explanation: "'Supplant' có nghĩa là thay thế, thế chỗ."
      },
      {
        id: 5,
        question: "What human quality is listed as impossible for algorithms to replicate?",
        options: [
          "Rapid mathematical computation",
          "Database retrieval speed",
          "Moral philosophy, empathy, and social accountability",
          "Spelling correction"
        ],
        correctIndex: 2,
        explanation: "Đoạn cuối nhấn mạnh: 'imparting moral philosophy, critical skepticism, empathy, and social accountability'."
      }
    ]
  },
  {
    id: "eng_read_b2_1",
    title: "Global Microclimate Transformation, Urban Heat Islands & Green Architecture",
    level: "B2",
    topic: "Biến đổi vi khí hậu toàn cầu, Đảo nhiệt đô thị & Kiến trúc xanh",
    passage: "As demographic migration and industrialization accelerate globally, over 55% of the world's population currently resides in urban agglomerations—a figure projected to reach nearly 70% by the middle of the 21st century. This rapid urbanization has severely altered local thermodynamics, giving rise to the 'Urban Heat Island' (UHI) phenomenon. Dense concrete surfaces, asphalt roadways, and tall masonry structures absorb solar radiation throughout the day and re-emit heat at night, elevating ambient city temperatures by 3°C to 8°C compared to surrounding rural landscapes.\n\nThe ecological and socio-economic ramifications of UHIs are severe. Elevated urban temperatures dramatically surge electricity demand for air conditioning, exacerbating regional greenhouse gas emissions from fossil-fuel power plants. Furthermore, heat stress disproportionately affects vulnerable urban populations, amplifying respiratory illness and heat-related mortality rates during extreme summer heatwaves.\n\nIn response, forward-thinking urban planners and architectural theorists are pioneering systemic green infrastructure interventions. Among the most prominent strategies is the integration of 'vertical forest' skyscrapers—structures enveloped in thousands of living trees and shrubs that absorb carbon dioxide, filter atmospheric particulate matter, and reduce building surface temperatures through evapotranspiration.\n\nIn addition to vegetative architecture, municipal governments are implementing cool-roof coatings with high solar reflectance and permeable pavement systems that absorb storm runoff while dissipating surface thermal buildup. Although retrofitting existing high-density cities demands substantial capital investment and complex regulatory adjustments, the long-term public health dividends, reduced energy consumption, and climate resilience far outweigh initial fiscal outlays.",
    questions: [
      {
        id: 1,
        question: "What main physical cause of the Urban Heat Island (UHI) phenomenon is identified in Paragraph 1?",
        options: [
          "Excessive rainfall in tropical coastal cities",
          "Absorption and re-emission of solar heat by dense concrete and asphalt surfaces",
          "Planting too many deciduous trees along highways",
          "Overproduction of agricultural crops near cities"
        ],
        correctIndex: 1,
        explanation: "Đoạn 1 giải thích: 'Dense concrete surfaces, asphalt roadways... absorb solar radiation throughout the day and re-emit heat at night'."
      },
      {
        id: 2,
        question: "How do Urban Heat Islands exacerbate regional greenhouse gas emissions?",
        options: [
          "By increasing electricity demand for air conditioning powered by fossil fuels",
          "By forcing citizens to drive bicycles",
          "By preventing clouds from forming over oceans",
          "By draining freshwater rivers"
        ],
        correctIndex: 0,
        explanation: "Đoạn 2 nêu: 'surge electricity demand for air conditioning, exacerbating regional greenhouse gas emissions from fossil-fuel power plants'."
      },
      {
        id: 3,
        question: "How do 'vertical forest' skyscrapers cool urban buildings according to Paragraph 3?",
        options: [
          "By spraying cold water from rooftop helipads",
          "Through natural evapotranspiration and solar shading provided by thousands of living plants",
          "By painting outer walls with metallic silver foil",
          "By blowing industrial fans downward"
        ],
        correctIndex: 1,
        explanation: "Đoạn 3 giải thích: 'enveloped in thousands of living trees and shrubs that... reduce building surface temperatures through evapotranspiration'."
      },
      {
        id: 4,
        question: "The word 'ramifications' in Paragraph 2 is closest in meaning to:",
        options: ["Initial costs", "Consequences or implications", "Types of machinery", "Architectural drawings"],
        correctIndex: 1,
        explanation: "'Ramifications' có nghĩa là hệ quả, sự ảnh hưởng phức tạp."
      },
      {
        id: 5,
        question: "What is the author's final conclusion regarding green infrastructure interventions?",
        options: [
          "They are too expensive and should be abandoned immediately",
          "They are only useful for rural agricultural villages",
          "The long-term public health dividends and energy savings far outweigh the initial fiscal costs",
          "They will cause higher municipal tax rates without any real benefit"
        ],
        correctIndex: 2,
        explanation: "Đoạn cuối kết luận: 'the long-term public health dividends, reduced energy consumption, and climate resilience far outweigh initial fiscal outlays'."
      }
    ]
  }
];

// ==================== ENGLISH WRITING EXERCISES ====================
export const writingExercises: WritingExercise[] = [
  {
    id: "eng_write_a2_1",
    title: "Invite a Friend to a Birthday Party",
    level: "A2",
    taskType: "Task 1",
    prompt: "Write a short email (60 - 80 words) to your friend Nam to invite him to your birthday party next Sunday. Include time, location, and activities.",
    suggestedStructure: [
      "Greeting (Dear Nam / Hi Nam,)",
      "State the purpose of writing (I am writing to invite you to my 15th birthday party...)",
      "Give details: Date, Time, Location (It will be on Sunday at 6 PM at my home...)",
      "Mention activities & food (We will eat pizza and play video games...)",
      "Closing (Hope to see you there! Best wishes,)"
    ],
    vocabularyHints: ["celebrate", "birthday party", "at my house", "delicious food", "have fun", "hope you can come"],
    sampleAnswer: "Hi Nam,\n\nHow are you? I am writing to invite you to my birthday party next Sunday evening. The party will start at 6:00 PM at my house.\n\nWe are going to eat pepperoni pizza, play video games, and sing karaoke together. My mother is making a big chocolate cake!\n\nPlease let me know if you can come before Friday.\n\nBest wishes,\nMinh",
    minWords: 50,
    maxWords: 100
  },
  {
    id: "eng_write_b1_1",
    title: "Essay: Should Students Wear School Uniforms?",
    level: "B1",
    taskType: "Task 2",
    prompt: "Write an opinion essay (150 - 200 words) discussing whether high school students should wear school uniforms every day.",
    suggestedStructure: [
      "Introduction: State your thesis (Uniforms create equality and pride among students).",
      "Body Paragraph 1: Uniforms reduce social inequality and financial pressure on parents.",
      "Body Paragraph 2: Uniforms save time in the morning and promote school discipline.",
      "Conclusion: Reiterate your opinion and summarize main points."
    ],
    vocabularyHints: ["school uniform", "foster equality", "sense of belonging", "financial strain", "discipline", "peer pressure"],
    sampleAnswer: "In my opinion, high school students should definitely wear school uniforms every day. Uniforms bring numerous benefits to students, parents, and schools alike.\n\nFirstly, school uniforms promote social equality among classmates. When everyone wears the same clothing, students from low-income families do not feel self-conscious or bullied about their clothes. This eliminates peer pressure regarding expensive fashion brands.\n\nSecondly, wearing uniforms fosters a strong sense of discipline and belonging. It saves valuable time every morning because students do not need to spend hours deciding what to wear. Furthermore, wearing a neat uniform with the school logo makes students proud of their school tradition.\n\nIn conclusion, school uniforms play a crucial role in creating a friendly, equal, and disciplined educational environment. Therefore, schools should maintain this meaningful dress code.",
    minWords: 140,
    maxWords: 220
  },
  {
    id: "eng_write_b1p_1",
    title: "Describe a Chart: Online vs Offline Shopping Trends",
    level: "B1+",
    taskType: "Task 1",
    prompt: "Write a summary report (150 - 180 words) describing the shifts in online versus traditional store shopping preference over a 5-year period.",
    suggestedStructure: [
      "Introduction: Paraphrase the prompt (The chart illustrates changes in consumer preferences...).",
      "Overview: Highlight main overall trends (Online shopping surged dramatically while store visits declined).",
      "Body Paragraph 1: Detail online shopping statistics with key numbers.",
      "Body Paragraph 2: Detail physical store statistics and comparison."
    ],
    vocabularyHints: ["illustrate", "upward trend", "dramatic increase", "gradual decline", "reach a peak", "in contrast"],
    sampleAnswer: "The chart illustrates the changes in consumer shopping preferences between online platforms and traditional physical stores over a five-year period from 2020 to 2025.\n\nOverall, it is clear that online shopping experienced a dramatic upward trend, whereas traditional store visits saw a continuous decline over the period shown.\n\nIn 2020, only 30% of consumers preferred shopping on e-commerce websites. However, this figure rose significantly over the next three years, reaching a peak of 68% in 2025 due to convenient mobile payment systems and fast delivery services.\n\nIn contrast, physical retail store preference stood at a dominant 70% in 2020. Over the five-year timeframe, this number dropped steadily, ending at just 32% in 2025. In conclusion, digital e-commerce has officially surpassed traditional brick-and-mortar retail in consumer popularity.",
    minWords: 140,
    maxWords: 200
  },
  {
    id: "eng_write_b2_1",
    title: "Essay: Will AI Replace Human Workers?",
    level: "B2",
    taskType: "Task 2",
    prompt: "Some people believe that Artificial Intelligence will eventually replace human workers in most industries. Discuss both views and give your own opinion. (250 - 300 words).",
    suggestedStructure: [
      "Introduction: Introduce the debate on AI automation vs human labor. State your stance.",
      "Body 1 (View 1): Why AI might replace routine jobs (Speed, accuracy, zero fatigue, cost efficiency).",
      "Body 2 (View 2): Why humans remain irreplaceable (Creativity, emotional intelligence, ethics, adaptability).",
      "Conclusion: Summarize balanced view: AI will transform jobs rather than totally eliminate humans."
    ],
    vocabularyHints: ["artificial intelligence", "automation", "displace workforce", "unrivaled efficiency", "emotional intelligence", "symbiotic relationship"],
    sampleAnswer: "The rapid advancements in Artificial Intelligence (AI) have sparked intense global debate regarding the future of the workforce. While some argue that automation will inevitably render human labor obsolete across most sectors, others maintain that human cognitive and emotional capabilities remain irreplaceable.\n\nOn the one hand, proponents of total AI integration highlight the unrivaled speed, accuracy, and cost-efficiency of intelligent algorithms. In manufacturing, customer support, and financial data analysis, AI systems operate continuously without fatigue or emotional bias. For instance, automated machine learning algorithms can analyze millions of medical scans in seconds, outperforming human radiologists in early disease detection. Consequently, routine and repetitive jobs are indeed undergoing massive displacement.\n\nOn the other hand, skeptics emphasize that fundamental human traits—such as genuine empathy, complex moral reasoning, and artistic creativity—cannot be replicated by software. Professions requiring nuanced interpersonal communication, such as psychotherapy, education, and high-level strategic leadership, demand human intuition. Furthermore, AI systems rely entirely on historical data created by humans and struggle with unprecedented, unstructured challenges.\n\nIn conclusion, while AI will undeniably automate mundane tasks and restructure the global employment landscape, I firmly believe it will serve as a powerful collaborator rather than a complete replacement for human workers.",
    minWords: 240,
    maxWords: 320
  }
];

// ==================== ENGLISH SPEAKING EXERCISES ====================
export const speakingExercises: SpeakingExercise[] = [
  {
    id: "eng_speak_a2_1",
    title: "Part 1: Self Introduction & Favorite Hobby",
    level: "A2",
    part: "Part 1",
    prompt: "Talk about yourself and your favorite hobby. (Speak for 1 to 2 minutes)",
    prepTimeSeconds: 30,
    speakTimeSeconds: 90,
    guidingQuestions: [
      "What is your name and how old are you?",
      "What is your favorite leisure activity in your free time?",
      "Who do you usually do this hobby with?",
      "Why do you enjoy this activity?"
    ],
    sampleVocabulary: ["free time", "keen on", "relax my mind", "play football", "listen to music", "every weekend"]
  },
  {
    id: "eng_speak_b1_1",
    title: "Part 2: Describe a Memorable Trip",
    level: "B1",
    part: "Part 2",
    prompt: "Describe a memorable vacation or trip you took with your family or friends.",
    prepTimeSeconds: 60,
    speakTimeSeconds: 120,
    guidingQuestions: [
      "Where did you go and who did you go with?",
      "How did you travel there?",
      "What activities did you do during the trip?",
      "Why was this trip so special and memorable to you?"
    ],
    sampleVocabulary: ["breathtaking scenery", "local delicacies", "unforgettable experience", "strengthen family bond", "refresh my energy"]
  },
  {
    id: "eng_speak_b1p_1",
    title: "Part 2 & 3: The Impact of Social Media",
    level: "B1+",
    part: "Part 2",
    prompt: "Talk about how social media applications influence young people's daily communication.",
    prepTimeSeconds: 60,
    speakTimeSeconds: 120,
    guidingQuestions: [
      "Which social media platforms do you use most frequently?",
      "What are the main advantages of social media for learning and staying connected?",
      "What negative effects can excessive social media usage cause?",
      "What advice would you give to maintain a healthy digital balance?"
    ],
    sampleVocabulary: ["instant messaging", "double-edged sword", "cyberbullying", "virtual connections", "digital detox", "enhance knowledge"]
  },
  {
    id: "eng_speak_b2_1",
    title: "Part 3: Environmental Conservation & Youth Action",
    level: "B2",
    part: "Part 3",
    prompt: "Discuss the role of young individuals and local communities in fighting global climate change.",
    prepTimeSeconds: 60,
    speakTimeSeconds: 150,
    guidingQuestions: [
      "What are the most pressing environmental threats facing your country?",
      "How can young students reduce plastic consumption and carbon footprint in daily life?",
      "Do you think governments or individuals bear a greater responsibility for environmental protection?",
      "How can technology help solve ecological crises?"
    ],
    sampleVocabulary: ["carbon footprint", "single-use plastics", "sustainable practices", "collective action", "eco-friendly mindset", "renewable energy transition"]
  }
];

// ==================== LITERATURE ESSAY PROMPTS (MÔN VĂN THCS / THPT) ====================
export const literaturePrompts: LiteratureEssayPrompt[] = [
  {
    id: "lit_200_1",
    title: "Ý Nghĩa Của Lòng Biết Ơn Trong Cuộc Sống",
    type: "Đoạn văn 200 chữ",
    category: "Nghị luận xã hội",
    grade: "THCS",
    targetWordCount: 200,
    prompt: "Viết một đoạn văn khoảng 200 chữ trình bày suy nghĩ của em về ý nghĩa của lòng biết ơn trong cuộc sống hàng ngày.",
    outline: [
      { section: "Mở đoạn (1-2 câu)", content: "Dẫn dắt và khẳng định lòng biết ơn là phẩm chất đạo đức cao đẹp truyền thống của dân tộc." },
      { section: "Thân đoạn (6-8 câu)", content: "Giải thích lòng biết ơn là gì. Biểu hiện: Trân trọng công ơn cha mẹ, thầy cô, sự hy sinh của các thế hệ đi trước. Ý nghĩa: Giúp tâm hồn thanh thản, thắt chặt tình cảm con người, tạo nền tảng xã hội văn minh." },
      { section: "Bài học & Kết đoạn (1-2 câu)", content: "Rút ra bài học hành động: Bằng lời nói, thái độ và sự cố gắng vươn lên trong học tập để đáp lại ân tình." }
    ],
    keyIdeas: ["Uống nước nhớ nguồn", "Trân trọng giá trị cuộc sống", "Gắn kết tình người", "Cống hiến và đền đáp"],
    samplePassage: "Trong hành trình trưởng thành của mỗi con người, lòng biết ơn chính là ngọn đèn hồng soi sáng tâm hồn, là thước đo phẩm giá đạo đức cao đẹp. Biết ơn là sự trân trọng, ghi nhớ công lao của những ai đã giúp đỡ, nuôi dưỡng hay cống hiến cho cuộc sống của chúng ta. Từ truyền thống 'Uống nước nhớ nguồn', lòng biết ơn được thể hiện qua sự hiếu thảo với cha mẹ, tôn kính thầy cô và tri ân các anh hùng hy sinh vì độc lập dân tộc. Khi biết sống trân trọng những gì mình đang có, con người sẽ xua tan đi sự ích kỷ, đố đố kỵ, mở rộng lòng vị tha và tình yêu thương. Lòng biết ơn không chỉ mang lại niềm vui cho người nhận mà còn gieo sự bình yên sâu thẳm vào tâm hồn người cho. Ngược lại, kẻ vô ơn sẽ dễ sa vào lối sống vô cảm, bị xã hội lên án. Là học sinh ngồi trên ghế nhà trường, chúng ta hãy nuôi dưỡng lòng biết ơn từ những việc làm nhỏ nhất: một lời cảm ơn chân thành, sự nỗ lực học tập thành tài để đền đáp công ơn sinh thành và dưỡng dục."
  },
  {
    id: "lit_200_2",
    title: "Bản Lĩnh Vượt Qua Khó Khăn Nghịch Cảnh Của Tuổi Trẻ",
    type: "Đoạn văn 200 chữ",
    category: "Nghị luận xã hội",
    grade: "THPT",
    targetWordCount: 200,
    prompt: "Viết một đoạn văn khoảng 200 chữ trình bày suy nghĩ của anh/chị về tầm quan trọng của bản lĩnh vượt qua khó khăn, nghịch cảnh đối với thế hệ trẻ hôm nay.",
    outline: [
      { section: "Mở đoạn", content: "Nêu vấn đề: Cuộc sống đầy biến động đòi hỏi tuổi trẻ phải có bản lĩnh vững vàng." },
      { section: "Thân đoạn", content: "Bản lĩnh là khả năng làm chủ bản thân, dám đối mặt với thất bại và kiên trì đuổi đuổi mục tiêu. Nghịch cảnh là chất xúc tác rèn luyện ý chí. Dẫn chứng thực tế. Phê phán lối sống ỷ lại, nhanh nản chí." },
      { section: "Kết đoạn", content: "Khẳng định: Không có áp lực không có kim cương. Khuyên tuổi trẻ chủ động rèn luyện." }
    ],
    keyIdeas: ["Làm chủ bản thân", "Thách thức tạo cơ hội", "Kiên trì vượt sóng gió", "Tôi luyện bản lĩnh"],
    samplePassage: "Cuộc sống không phải là một con đường bằng phẳng rải đầy hoa hồng, mà là chặng đua chứa đựng vô vàn khúc quanh chông gai, đòi hỏi thế hệ trẻ phải tôi luyện bản lĩnh kiên cường để vượt qua nghịch cảnh. Bản lĩnh là khả năng suy nghĩ độc lập, giữ vững niềm tin, dám bước qua nỗi sợ hãi và kiên trì vươn lên trước những thất bại, biến động của thời đại. Nghịch cảnh chính là 'phòng thí nghiệm' nghiệt xóm nhất nhưng vĩ đại nhất để mài giũa ý chí con người. Khi đối mặt với thử thách, người có bản lĩnh sẽ nhìn thấy cơ hội để học hỏi và trưởng thành, thay vì gục ngã hay đổ lỗi cho hoàn cảnh. Nhìn vào lịch sử và thực tiễn, những nhân tài kiệt xuất hay các bạn trẻ khởi nghiệp thành công đều phải đi qua muôn vàn giông bão. Rèn luyện bản lĩnh không phải là điều gì xa xôi, mà bắt đầu từ việc dám nhận lỗi, dám đương đầu với môn học khó hay kiên trì với ước mơ đến cùng. Đừng ước một cuộc đời bình yên không giông tố, hãy ước mình có đủ bản lĩnh để làm chủ mọi cơn giông."
  },
  {
    id: "lit_200_3",
    title: "Hình Tượng Sóng Trong Bài Thơ 'Sóng' Của Xuân Quỳnh",
    type: "Đoạn văn 200 chữ",
    category: "Nghị luận văn học",
    grade: "THPT",
    targetWordCount: 200,
    prompt: "Viết một đoạn văn khoảng 200 chữ phân tích hình tượng 'sóng' trong bài thơ cùng tên của nữ nhà thơ Xuân Quỳnh.",
    outline: [
      { section: "Mở đoạn", content: "Giới thiệu tác giả Xuân Quỳnh và hình tượng trung tâm 'sóng' trong bài thơ." },
      { section: "Thân đoạn", content: "Hình tượng 'sóng' là ẩn dụ nghệ thuật cho tâm trạng người phụ nữ khi yêu (Dữ dội và dịu êm, ồn ào và lặng lẽ). Sóng mang nỗi nhớ da diết cồn cào vượt không gian thời gian. Sóng thể hiện khát vọng thủy chung và tình yêu vĩnh hằng." },
      { section: "Kết đoạn", content: "Đánh giá tài năng Xuân Quỳnh: Nhịp điệu thơ dạt dào như nhịp sóng lòng." }
    ],
    keyIdeas: ["Hình tượng sóng đôi", "Nỗi nhớ vượt không gian", "Tình yêu mãnh liệt thủy chung", "Khát vọng vĩnh cửu"],
    samplePassage: "Trong nền thơ ca hiện đại Việt Nam, bài thơ 'Sóng' của Xuân Quỳnh là một kiệt tác trữ tình dạt dào cảm xúc, nơi hình tượng 'sóng' trở thành ẩn dụ nghệ thuật sáng giá cho tâm hồn người phụ nữ đang yêu. Sóng biển khơi mang những trạng thái đối lập bất ngờ: 'Dữ dội và dịu êm / Ồn ào và lặng lẽ', cũng giống như muôn vàn cung bậc phức tạp, bất biến trong trái tim nữ giới. Xuân Quỳnh đã khéo léo sáng tạo cấu trúc hình tượng sóng đôi: Sóng và Em. Khi ẩn khi hiện, sóng hòa nhập vào em để bày tỏ nỗi nhớ tha thiết, dạt dào vượt qua mọi giới hạn không gian và thời gian: 'Con sóng dưới lòng sâu / Con sóng trên mặt nước / Ôi con sóng nhớ bờ / Ngày đêm không ngủ được'. Hơn thế nữa, qua hành trình sóng tìm ra tận bể bao la, nhà thơ gửi gắm khát vọng tự do, sự thủy chung son sắt và mong muốn hòa nhập tình yêu cá nhân vào biển lớn tình yêu cuộc đời. Với thể thơ ngũ ngôn nhịp nhàng dạt dào như nhịp sóng vỗ bờ, Xuân Quỳnh đã tạc nên một tượng đài tình yêu chân thành, nồng nàn và bất tử."
  },
  {
    id: "lit_600_1",
    title: "Trí Tuệ Nhân Tạo (AI) Và Trách Nhiệm Giữ Gìn Bản Sắc Nhân Văn Của Tuổi Trẻ",
    type: "Bài văn 600 chữ",
    category: "Nghị luận xã hội",
    grade: "THPT",
    targetWordCount: 600,
    prompt: "Viết bài văn khoảng 600 chữ trình bày suy nghĩ của anh/chị về cơ hội, thách thức của Trí tuệ nhân tạo (AI) và trách nhiệm giữ gìn bản sắc nhân văn của thế hệ trẻ trong kỷ nguyên số.",
    outline: [
      { section: "Mở bài (100 chữ)", content: "Dẫn dắt về sự bùng nổ của AI. Đặt vấn đề: Giữa làn sóng công nghệ, con người cần khẳng định vị thế nhờ bản sắc nhân văn." },
      { section: "Thân bài - Giải thích & Thực trạng (150 chữ)", content: "Giải thích AI là công cụ tự động hóa thông minh. Đánh giá cơ hội: Tối ưu hóa tri thức, nâng cao năng suất, hỗ trợ y tế giáo dục." },
      { section: "Thân bài - Thách thức & Bản sắc nhân văn (200 chữ)", content: "Thách thức: Nguy cơ lười suy nghĩ, xói mòn cảm xúc, tin giả và sự tha hóa nhân cách. Phân tích: Trí tuệ nhân tạo không thể thay thế trái tim nhân ái, thấu cảm và đạo đức con người." },
      { section: "Thân bài - Phê phán & Giải pháp (100 chữ)", content: "Phê phán lối sống phụ thuộc hoàn toàn vào công nghệ. Đề xuất giải pháp cho tuổi trẻ: Học cách làm chủ công nghệ, trau dồi tri thức và đạo đức." },
      { section: "Kết bài (50 chữ)", content: "Khẳng định: Công nghệ là công cụ, trái tim con người là la bàn." }
    ],
    keyIdeas: ["Kỷ nguyên số", "Công cụ thông minh", "Trái tim thấu cảm", "Làm chủ công nghệ", "Bản sắc nhân văn"],
    samplePassage: "Chúng ta đang sống trong những năm tháng lịch sử khi cuộc cách mạng công nghiệp lần thứ tư, với tâm điểm là Trí tuệ nhân tạo (AI), đang làm thay đổi tận gốc rễ phương thức lao động, học tập và tư duy của loài người. Từ những cỗ máy tìm kiếm đến các mô hình ngôn ngữ lớn có khả năng sáng tác nhạc, viết mã lệnh hay chẩn đoán y khoa, AI thể hiện sức mạnh vượt trội. Tuy nhiên, đứng trước làn sóng công nghệ cuồng nhiệt ấy, một câu hỏi lớn đặt ra cho thế hệ trẻ: Làm thế nào để vừa tận dụng sức mạnh trí tuệ nhân tạo, vừa giữ gìn trọn vẹn bản sắc nhân văn thuần túy của con người?\n\nTrí tuệ nhân tạo (AI) thực chất là sự mô phỏng các quá trình trí tuệ của con người bởi máy tính. Không thể phủ nhận, AI mang đến những cơ hội vô giá. Nó giúp chúng ta xử lý khối lượng dữ liệu khổng lồ trong tích tắc, hỗ trợ dịch thuật đa ngôn ngữ, tối ưu hóa giao thông và biến việc học tập trở nên cá nhân hóa hơn bao giờ hết. Sự xuất hiện của AI giải phóng con người khỏi những công việc thủ công lặp đi lặp lại, mở ra không gian cho sự sáng tạo đỉnh cao.\n\nThế nhưng, công nghệ luôn là con dao hai lưỡi. Sự phụ thuộc quá mức vào AI đang gióng lên hồi chuông cảnh báo về nguy cơ xói mòn năng lực tư duy phản biện và sự chai sạn cảm xúc ở giới trẻ. Khi mọi câu hỏi đều có thể nhận được đáp án tức thì từ thuật toán, con người dễ trở nên lười biếng, giảm khả năng tự đào sâu nghiên cứu. Nguy hại hơn, máy tính có thể tạo ra văn bản hay hình ảnh chân thực nhưng chúng hoàn toàn thiếu vắng lòng trắc ẩn, sự thấu cảm sâu sắc và chuẩn mực đạo đức. Một bài thơ do AI viết có thể đúng vần điệu nhưng không hề có giọt nước mắt hay sự rung cảm của trái tim.\n\nBởi vậy, trách nhiệm lớn nhất của tuổi trẻ hôm nay không phải là chối bỏ hay sợ hãi công nghệ, mà là làm chủ công nghệ bằng một bản lĩnh nhân văn vững vàng. Chúng ta cần biến AI thành người trợ lý đắc lực, nhưng tuyệt đối không để nó trở thành người điều khiển tư duy. Hãy nuôi dưỡng sự thấu cảm, lòng bao dung, tinh thần tôn trọng sự thật và khả năng kết nối giữa người với người trong đời thực. Công nghệ phục vụ cuộc sống, nhưng chính tình yêu thương và đạo đức mới định hình giá trị đích thực của nhân loại.\n\nTóm lại, AI có thể tính toán hàng tỷ phép tính trong một giây, nhưng chỉ có con người mới biết rung động trước một nhành hoa hay rơi lệ trước nỗi đau của đồng loại. Hãy bước vào kỷ nguyên số với trí tuệ thông minh và một trái tim giàu nhân văn."
  },
  {
    id: "lit_600_2",
    title: "Giá Trị Nhân Đạo Sâu Sắc Trong Tác Phẩm 'Vợ Nhặt' Của Kim Lân",
    type: "Bài văn 600 chữ",
    category: "Nghị luận văn học",
    grade: "THPT",
    targetWordCount: 600,
    prompt: "Phân tích giá trị nhân đạo sâu sắc trong tác phẩm 'Vợ nhặt' của nhà văn Kim Lân để thấy được vẻ đẹp tình người và sức sống mãnh liệt của nhân dân lao động trong nạn đói 1945.",
    outline: [
      { section: "Mở bài", content: "Giới thiệu nhà văn Kim Lân - cây bút am hiểu sâu sắc nông thôn. Giới thiệu 'Vợ nhặt' và khẳng định giá trị nhân đạo tỏa sáng trong tác phẩm." },
      { section: "Thân bài - Hoàn cảnh & Tình huống (150 chữ)", content: "Giá trị tố cáo: Bức tranh nạn đói thảm khốc năm 1945 do phát xít Nhật và thực dân Pháp gây ra. Tình huống truyện độc đáo: Tràng 'nhặt' được vợ chỉ bằng vài bát bánh đúc." },
      { section: "Thân bài - Vẻ đẹp tình người (200 chữ)", content: "Nhân ái của Tràng: Sẵn sàng đèo bòng, cưu mang một người phụ nữ xa lạ. Tấm lòng của bà Cụ Tứ: Bao dung, thương con, nén đau thương để gieo hy vọng. Sự thay đổi của Thị: Từ đanh đá trở thành người phụ nữ hiền hậu, vun vén gia đình." },
      { section: "Thân bài - Khát vọng sống & Hướng về tương lai (150 chữ)", content: "Niềm tin vào tương lai: Bữa cơm ngày đói với nồi cháo cám đắng chát nhưng ấm áp tình thân. Hình ảnh lá cờ đỏ sao vàng ở kết bài báo hiệu con đường cách mạng." },
      { section: "Kết bài", content: "Đánh giá tài năng Kim Lân và sức sống vượt thời gian của giá trị nhân đạo trong tác phẩm." }
    ],
    keyIdeas: ["Thượng phụ tình người", "Bắt gặp mầm sống", "Bà cụ Tứ cưu mang", "Khát vọng hạnh phúc", "Lá cờ đỏ sao vàng"],
    samplePassage: "Kim Lân là một trong những cây bút truyện ngắn xuất sắc nhất của nền văn học hiện đại Việt Nam. Với tâm hồn gắn bó máu thịt với đồng quê, ông đã để lại kiệt tác 'Vợ nhặt' – một tác phẩm chứa đựng giá trị nhân đạo sâu sắc, ngợi ca tình người và sức sống vươn lên từ bóng tối cái chết của người nông dân nghèo trong nạn đói thảm khốc năm 1945.\n\nGiá trị nhân đạo trước hết được thể hiện qua niềm đồng cảm tha thiết của Kim Lân đối với số phận con người trong cơn bão đói. Tác giả đã dựng nên bức tranh xóm ngụ cư u tăm, nơi ranh giới giữa sự sống và cái chết trở nên mong manh hơn bao giờ hết. Trong bối cảnh ấy, giá trị con người bị rẻ khinh đến mức anh cu li Tràng có thể 'nhặt' được một người vợ chỉ nhờ bốn bát bánh đúc và vài câu hò đùa lả lơi. Kim Lân đã lên án tố cáo tội ác dã man của phát xít Nhật và thực dân Pháp đã đẩy nhân dân ta vào thảm cảnh đói nghèo rên siết.\n\nThế nhưng, giá trị nhân đạo đắt giá nhất của tác phẩm lại nằm ở chỗ: Ngay trên mảnh đất cằn cỗi của cái chết, mầm sống của tình yêu và sự tử tế vẫn đơm hoa. Tràng – một thanh niên thô kệch, nghèo khổ – lại sở hữu một trái tim nhân hậu vô cùng. Trong lúc thân mình chưa biết sống chết ra sao, Tràng vẫn sẵn lòng cưu mang một người phụ nữ xa lạ, đèo bòng cô về làm vợ bằng sự trân trọng chân thành. Tình yêu thương ấy đã xua tan bầu không khí u uất của xóm ngụ cư.\n\nChưa dừng lại ở đó, giá trị nhân đạo còn tỏa sáng qua hình tượng bà Cụ Tứ – người mẹ nghèo khổ nhưng giàu lòng bao dung. Khi biết con trai nhặt vợ về, sau những ngỡ ngàng đau xót cho kiếp nghèo, bà đã đón nhận người con dâu bằng tình thương bao la. Bà dặn dò các con làm ăn, nén giọt nước mắt đau thương để tạo nên niềm vui cho bữa ăn ngày cưới. Bữa cơm ngày đói chỉ có nồi cháo cám đắng chát, nhưng đậm đà tình thân gia đình.\n\nTác phẩm kết thúc bằng hình ảnh lá cờ đỏ sao vàng bay phới trên đê Sặt trong tư tưởng của Tràng. Kim Lân không đẩy con người vào ngõ tăm tối tuyệt vọng, mà mở ra ánh sáng cách mạng giải phóng số phận. 'Vợ nhặt' chính là bài ca hy vọng, khẳng định rằng dù trong hoàn cảnh nghiệt xóm nhất, tình người và khát vọng sống chân chính của dân tộc Việt Nam sẽ không bao giờ bị dập tắt."
  }
];
