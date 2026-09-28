import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Volume2, VolumeX, Music, Play, Pause, Volume1, Search, ArrowRight, BookOpen, Menu, ExternalLink, SquareArrowDown } from 'lucide-react';
import { useIntermissionMusic } from '../context/IntermissionMusicContext';

interface BrandTransitionScreenProps {
  onContinue: () => void;
  onStartSetup?: () => void;
}

export type MessageRegion = 'asia' | 'europe' | 'americas' | 'africa' | 'global';

interface MessageItem {
  id: string;
  flagEmojis: string[];
  title: string;
  nativeTitle: string;
  region: MessageRegion;
  text: string;
}

// Convert emoji flag to Twemoji SVG codepoints to guarantee 100% accurate flag display on Windows PC
const getTwemojiCode = (emoji: string): string => {
  return Array.from(emoji)
    .map((c) => c.codePointAt(0)?.toString(16))
    .filter(Boolean)
    .join('-');
};

interface TwemojiFlagProps {
  emoji: string;
  title?: string;
  className?: string;
}

export const TwemojiFlag: React.FC<TwemojiFlagProps> = ({
  emoji,
  title,
  className = 'w-7 h-7 sm:w-8 sm:h-8',
}) => {
  const [loadError, setLoadError] = useState(false);
  const code = getTwemojiCode(emoji);
  const primaryUrl = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${code}.svg`;

  if (loadError) {
    // If SVG fails, fallback to native emoji
    return (
      <span
        className="brand-flag-emoji text-2xl sm:text-3xl leading-none inline-block filter select-none"
        role="img"
        aria-label={title || emoji}
      >
        {emoji}
      </span>
    );
  }

  return (
    <img
      src={primaryUrl}
      alt={title || emoji}
      title={title || emoji}
      loading="eager"
      decoding="async"
      onError={() => setLoadError(true)}
      className={`${className} inline-block object-contain align-middle drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)] shrink-0 select-none`}
    />
  );
};

const MESSAGES: MessageItem[] = [
  // =================== ASIA ===================
  {
    id: 'vi',
    flagEmojis: ['🇻🇳'],
    title: 'Tiếng Việt',
    nativeTitle: 'Tiếng Việt (Vietnamese)',
    region: 'asia',
    text: 'Chào mừng tới Test VNRT ONLINE. Đây là phiên bản nhà phát triển để chúng tôi có thể thử nghiệm một vài tính năng... rất ngẫu nhiên hoặc lớn hơn là một vài tính năng mới sẽ được đưa lên phiên bản VNRT ONLINE chính thức. Vì đây là phiên bản nhà phát triển nên không thể tránh khỏi các lỗi lặt vặt, vì vậy nếu bạn muốn một trải nghiệm VNRT ONLINE tốt nhất, hãy sử dụng phiên bản chính thức. Trân trọng!',
  },
  {
    id: 'en',
    flagEmojis: ['🇬🇧', '🇺🇸', '🇦🇺', '🇨🇦'],
    title: 'English',
    nativeTitle: 'English (US / UK / International)',
    region: 'global',
    text: 'Welcome to Test VNRT ONLINE. This is a developer version for us to experiment with some features... very random ones or bigger new features that will be brought to the official VNRT ONLINE release. Since this is a developer version, minor bugs are inevitable, so if you want the best VNRT ONLINE experience, please use the official release. Sincerely!',
  },
  {
    id: 'zh-cn',
    flagEmojis: ['🇨🇳', '🇸🇬'],
    title: '中文 (简体)',
    nativeTitle: 'Simplified Chinese',
    region: 'asia',
    text: '欢迎访问 Test VNRT ONLINE。这是供我们测试部分功能的开发者版本……包括一些非常随机的功能，或是即将上线 VNRT ONLINE 正式版的新特性。由于这是开发者版本，难免会出现些许细小问题，如果您希望获得最优质的 VNRT ONLINE 体验，请使用正式版。致敬！',
  },
  {
    id: 'zh-tw',
    flagEmojis: ['🇹🇼', '🇭🇰'],
    title: '中文 (繁體)',
    nativeTitle: 'Traditional Chinese',
    region: 'asia',
    text: '歡迎造訪 Test VNRT ONLINE。這是供我們測試部分功能的開發者版本……包括一些非常隨機的功能，或是即將上線 VNRT ONLINE 正式版的新功能。由於這是開發者版本，難免會出現細微錯誤，如果您希望獲得最佳的 VNRT ONLINE 體驗，請使用正式版。謹啟！',
  },
  {
    id: 'ja',
    flagEmojis: ['🇯🇵'],
    title: '日本語',
    nativeTitle: 'Japanese',
    region: 'asia',
    text: 'Test VNRT ONLINE へようこそ。これは、非常にランダムな機能や、VNRT ONLINE 公式版に導入される大型の新機能などをテストするための開発者向けプレビュー版です。開発者版であるため軽微な不具合が発生する場合があります。最高の VNRT ONLINE 体験をお求めの場合は、公式版をご利用ください。敬具！',
  },
  {
    id: 'ko',
    flagEmojis: ['🇰🇷'],
    title: '한국어',
    nativeTitle: 'Korean',
    region: 'asia',
    text: 'Test VNRT ONLINE에 오신 것을 환영합니다. 이것은 매우 무작위적인 기능이나 VNRT ONLINE 정식 버전에 도입될 새로운 대형 기능들을 시험해 보기 위한 개발자 버전입니다. 개발자 버전 특성상 사소한 버그가 발생할 수 있으니, 최고의 VNRT ONLINE 경험을 원하신다면 정식 버전을 이용해 주시기 바랍니다. 감사합니다!',
  },
  {
    id: 'lo',
    flagEmojis: ['🇱🇦'],
    title: 'ພາສາລາວ',
    nativeTitle: 'Lao',
    region: 'asia',
    text: 'ຍິນດີຕ້ອນຮັບສູ່ Test VNRT ONLINE. ນີ້ແມ່ນເວີຊັນສຳລັບນັກພັດທະນາເພື່ອໃຫ້ພວກເຮົາໄດ້ທົດລອງຄຸນສົມບັດບາງຢ່າງ... ບໍ່ວ່າຈະເປັນຄຸນສົມບັດແບບສຸ່ມ ຫຼື ຄຸນສົມບັດໃຫມ່ທີ່ໃຫຍ່ກວ່າເຊິ່ງຈະຖືກນຳໄປໃຊ້ໃນເວີຊັນທາງການຂອງ VNRT ONLINE. ເນື່ອງຈາກນີ້ແມ່ນເວີຊັນນັກພັດທະນາ, ຂໍ້ຜິດພາດເລັກນ້ອຍຈຶ່ງຫຼີກລ່ຽງບໍ່ໄດ້, ດັ່ງນັ້ນຫາກທ່ານຕ້ອງການປະສົບການ VNRT ONLINE ທີ່ດີທີ່ສຸດ, ກະລຸນາໃຊ້ເວີຊັນທາງການ. ດ້ວຍຄວາມນັບຖື!',
  },
  {
    id: 'km',
    flagEmojis: ['🇰🇭'],
    title: 'ភាសាខ្មែរ',
    nativeTitle: 'Khmer (Cambodian)',
    region: 'asia',
    text: 'សូមស្វាគមន៍មកកាន់ Test VNRT ONLINE។ នេះជាកំណែសម្រាប់អ្នកអភិវឌ្ឍន៍ដើម្បីឱ្យពួកយើងអាចសាកល្បងមុខងារមួយចំនួន... ទាំងមុខងារចៃដន្យ ឬមុខងារថ្មីៗធំៗដែលនឹងត្រូវដាក់បញ្ចូលក្នុងកំណែផ្លូវការរបស់ VNRT ONLINE។ ដោយសារតែកំណែនេះគឺសម្រាប់អ្នកអភិវឌ្ឍន៍ កំហុសបន្តិចបន្តួចគឺមិនអាចជៀសវាងបានឡើយ ដូច្នេះប្រសិនបើអ្នកចង់បានបទពិសោធន៍ VNRT ONLINE ដ៏ល្អបំផុត សូមប្រើប្រាស់កំណែផ្លូវការ។ សូមអរគុណ!',
  },
  {
    id: 'th',
    flagEmojis: ['🇹🇭'],
    title: 'ภาษาไทย',
    nativeTitle: 'Thai',
    region: 'asia',
    text: 'ยินดีต้อนรับสู่ Test VNRT ONLINE นี่เป็นเวอร์ชันสำหรับนักพัฒนาเพื่อให้เราได้ทดลองฟีเจอร์บางอย่าง... ไม่ว่าจะเป็นฟีเจอร์แบบสุ่มหรือฟีเจอร์ใหม่ที่ใหญ่กว่าซึ่งจะถูกนำไปใช้ในเวอร์ชันทางการของ VNRT ONLINE เนื่องจากเป็นเวอร์ชันสำหรับนักพัฒนา ข้อผิดพลาดเล็กน้อยจึงเป็นสิ่งที่หลีกเลี่ยงไม่ได้ หากคุณต้องการประสบการณ์ VNRT ONLINE ที่ดีที่สุด โปรดใช้เวอร์ชันทางการ ขอแสดงความนับถือ!',
  },
  {
    id: 'my',
    flagEmojis: ['🇲🇲'],
    title: 'မြန်မာဘာသာ',
    nativeTitle: 'Burmese (Myanmar)',
    region: 'asia',
    text: 'Test VNRT ONLINE မှ ကြိုဆိုပါသည်။ ဤသည်မှာ ကျွန်ုပ်တို့အနေဖြင့် လုပ်ဆောင်ချက်အချို့အား စမ်းသပ်ရန်အတွက် ထုတ်လုပ်ထားသော Developer ဗားရှင်းဖြစ်ပါသည်... ကျပန်းလုပ်ဆောင်ချက်များ သို့မဟုတ် VNRT ONLINE တရားဝင်ဗားရှင်းသို့ ထည့်သွင်းမည့် ကြီးမားသော လုပ်ဆောင်ချက်အသစ်များ ပါဝင်ပါသည်။ Developer ဗားရှင်းဖြစ်သောကြောင့် ချို့ယွင်းချက်အသေးအမွှားများ ရှိနိုင်ပါသဖြင့် အကောင်းဆုံးသော VNRT ONLINE အတွေ့အကြုံကို ရရှိလိုပါက တရားဝင်ဗားရှင်းကို အသုံးပြုပေးပါရန် မေတ္တာရပ်ခံအပ်ပါသည်။ လေးစားစွာဖြင့်!',
  },
  {
    id: 'id',
    flagEmojis: ['🇮🇩'],
    title: 'Bahasa Indonesia',
    nativeTitle: 'Indonesian',
    region: 'asia',
    text: 'Selamat datang di Test VNRT ONLINE. Ini adalah versi pengembang bagi kami untuk bereksperimen dengan beberapa fitur... baik fitur acak maupun fitur baru yang lebih besar yang akan dihadirkan pada rilis resmi VNRT ONLINE. Karena ini adalah versi pengembang, bug kecil tidak dapat dihindari, jadi jika Anda menginginkan pengalaman VNRT ONLINE terbaik, silakan gunakan rilis resmi. Salam hormat!',
  },
  {
    id: 'ms',
    flagEmojis: ['🇲🇾', '🇧🇳'],
    title: 'Bahasa Melayu',
    nativeTitle: 'Malay',
    region: 'asia',
    text: 'Selamat datang ke Test VNRT ONLINE. Ini adalah versi pembangun untuk kami mencuba beberapa ciri... ciri rawak mahupun ciri baharu yang lebih besar yang akan dibawakan ke versi rasmi VNRT ONLINE. Memandangkan ini adalah versi pembangun, pepijat kecil tidak dapat dielakkan, jadi jika anda mahukan pengalaman VNRT ONLINE yang terbaik, sila gunakan versi rasmi. Sekian, terima kasih!',
  },
  {
    id: 'tl',
    flagEmojis: ['🇵🇭'],
    title: 'Filipino / Tagalog',
    nativeTitle: 'Filipino',
    region: 'asia',
    text: 'Maligayang pagdating sa Test VNRT ONLINE. Ito ay isang developer version para masubukan namin ang ilang mga tampok... mga napaka-random o mas malalaking bagong feature na dadalhin sa opisyal na release ng VNRT ONLINE. Dahil ito ay isang bersyon ng developer, hindi maiiwasan ang mga maliliit na bug, kaya kung nais mo ang pinakamahusay na karanasan sa VNRT ONLINE, mangyaring gamitin ang opisyal na release. Lubos na gumagalang!',
  },
  {
    id: 'hi',
    flagEmojis: ['🇮🇳'],
    title: 'हिन्दी',
    nativeTitle: 'Hindi',
    region: 'asia',
    text: 'Test VNRT ONLINE में आपका स्वागत है। यह डेवलपर्स के लिए एक परीक्षण संस्करण है ताकि हम कुछ सुविधाओं के साथ प्रयोग कर सकें... कुछ अप्रत्याशित या बड़े नए फीचर्स जिन्हें आधिकारिक VNRT ONLINE रिलीज में जोड़ा जाएगा। चूंकि यह एक डेवलपर संस्करण है, इसलिए छोटी-मोटी कमियां अपरिहार्य हैं, इसलिए यदि आप बेहतरीन VNRT ONLINE अनुभव चाहते हैं, तो कृपया आधिकारिक संस्करण का उपयोग करें। सादर!',
  },
  {
    id: 'bn',
    flagEmojis: ['🇧🇩', '🇮🇳'],
    title: 'বাংলা',
    nativeTitle: 'Bengali (Bangla)',
    region: 'asia',
    text: 'Test VNRT ONLINE-এ আপনাকে স্বাগতম। এটি একটি ডেভেলপার সংস্করণ যাতে আমরা কিছু নতুন ফিচার পরীক্ষা করতে পারি... কিছু এলোমেলো কিংবা বড় নতুন ফিচার যা অফিসিয়াল VNRT ONLINE রিলিজটিতে যুক্ত করা হবে। যেহেতু এটি একটি ডেভেলপার সংস্করণ, তাই ছোটখাটো ত্রুটি থাকা স্বাভাবিক, কাজেই সেরা VNRT ONLINE অভিজ্ঞতার জন্য দয়া করে অফিসিয়াল সংস্করণটি ব্যবহার করুন। ধন্যবাদান্তে!',
  },
  {
    id: 'ta',
    flagEmojis: ['🇮🇳', '🇱🇰', '🇸🇬'],
    title: 'தமிழ்',
    nativeTitle: 'Tamil',
    region: 'asia',
    text: 'Test VNRT ONLINE-க்கு வரவேற்கிறோம். இது சில அம்சங்களை பரிசோதிப்பதற்காக உருவாக்கப்பட்ட டெவலப்பர் பதிப்பாகும்... மிகச் சாதாரணமானவை அல்லது அதிகாரப்பூர்வ VNRT ONLINE வெளியீட்டில் கொண்டுவரப்படவுள்ள பெரிய புதிய அம்சங்கள். இது ஒரு டெவலப்பர் பதிப்பு என்பதால், சிறிய குறைபாடுகள் தவிர்க்க முடியாதவை, எனவே நீங்கள் சிறந்த VNRT ONLINE அனுபவத்தை விரும்பினால், தயவுசெய்து அதிகாரப்பூர்வ பதிப்பைப் பயன்படுத்தவும். நன்றியுடன்!',
  },
  {
    id: 'te',
    flagEmojis: ['🇮🇳'],
    title: 'తెలుగు',
    nativeTitle: 'Telugu',
    region: 'asia',
    text: 'Test VNRT ONLINE కు స్వాగతం. మేము కొన్ని ఫీచర్లను పరీక్షించడానికి ఇది డెవలపర్ వెర్షన్... యాదృచ్ఛికమైనవి లేదా అధికారిక VNRT ONLINE విడుదలలో ప్రవేశపెట్టబడే పెద్ద కొత్త ఫీచర్లు. ఇది డెవలపర్ వెర్షన్ కాబట్టి, చిన్న లోపాలు అనివార్యం, కాబట్టి మీరు ఉత్తమ VNRT ONLINE అనుభవాన్ని పొందాలనుకుంటే, దయచేసి అధికారిక వెర్షన్‌ను ఉపయోగించండి. ధన్యవాదాలు!',
  },
  {
    id: 'mr',
    flagEmojis: ['🇮🇳'],
    title: 'मराठी',
    nativeTitle: 'Marathi',
    region: 'asia',
    text: 'Test VNRT ONLINE मध्ये आपले स्वागत आहे. ही डेव्हलपर आवृत्ती आहे जेणेकरून आम्ही काही नवीन वैशिष्ट्यांची चाचणी घेऊ शकू... काही अनपेक्षित किंवा मोठी नवीन वैशिष्ट्ये जी अधिकृत VNRT ONLINE आवृत्तीमध्ये आणली जातील. ही डेव्हलपर आवृत्ती असल्याने, किरकोळ त्रुटी अपरिहार्य आहेत, म्हणूनच जर तुम्हाला सर्वोत्तम VNRT ONLINE अनुभव हवा असेल, तर कृपया अधिकृत आवृत्ती वापरा. आदरपूर्वक!',
  },
  {
    id: 'ur',
    flagEmojis: ['🇵🇰', '🇮🇳'],
    title: 'اردو',
    nativeTitle: 'Urdu',
    region: 'asia',
    text: 'Test VNRT ONLINE میں خوش آمدید۔ یہ ایک ڈویلپر ورژن ہے تاکہ ہم کچھ فیچرز کی جانچ کر سکیں... کچھ بے ترتیب یا بڑے نئے فیچرز جو سرکاری VNRT ONLINE ریلیز میں شامل کیے جائیں گے۔ چونکہ یہ ایک ڈویلپر ورژن ہے، اس لیے چھوٹی موٹی خامیاں ناگزیر ہیں، چنانچہ اگر آپ بہترین VNRT ONLINE کا تجربہ چاہتے ہیں تو براہ کرم سرکاری ریلیز استعمال کریں۔ مخلصانہ شکریہ!',
  },
  {
    id: 'ar',
    flagEmojis: ['🇸🇦', '🇦🇪', '🇪🇬'],
    title: 'العربية',
    nativeTitle: 'Arabic',
    region: 'asia',
    text: 'مرحبًا بكم في Test VNRT ONLINE. هذا إصدار للمطورين يتيح لنا تجربة بعض الميزات... سواء كانت ميزات عشوائية أو ميزات جديدة رئيسية ستتم إضافتها إلى الإصدار الرسمي من VNRT ONLINE. نظراً لأن هذا إصدار للمطورين، فإن الأخطاء البسيطة أمر لا مفر منه، لذا إذا كنت ترغب في الحصول على أفضل تجربة لـ VNRT ONLINE، يرجى استخدام الإصدار الرسمي. مع خالص التحية!',
  },
  {
    id: 'fa',
    flagEmojis: ['🇮🇷', '🇦🇫'],
    title: 'فارسی',
    nativeTitle: 'Persian (Farsi)',
    region: 'asia',
    text: 'به Test VNRT ONLINE خوش آمدید. این یک نسخه آزمایشی توسعه‌دهنده است تا بتوانیم برخی از ویژگی‌ها را آزمایش کنیم... ویژگی‌های بسیار تصادفی یا عملکردهای جدید بزرگ‌تری که به نسخه رسمی VNRT ONLINE اضافه خواهند شد. از آنجا که این یک نسخه آزمایشی است، وجود باگ‌های جزئی اجتناب‌ناپذیر است؛ بنابراین اگر خواهان بهترین تجربه از VNRT ONLINE هستید، لطفاً از نسخه رسمی استفاده نمایید. با احترام!',
  },
  {
    id: 'he',
    flagEmojis: ['🇮🇱'],
    title: 'עברית',
    nativeTitle: 'Hebrew',
    region: 'asia',
    text: 'ברוכים הבאים ל-Test VNRT ONLINE. זוהי גרסת מפתחים המאפשרת לנו לבחון תכונות מסוימות... חלקן אקראיות וחלקן תכונות חדשות ומשמעותיות שיוטמעו בגרסה הרשמית של VNRT ONLINE. מאחר ומדובר בגרסת מפתחים, תקלות קלות הן בלתי נמנעות, לכן אם ברצונכם ליהנות מחוויית השימוש הטובה ביותר ב-VNRT ONLINE, אנא השתמשו בגרסה הרשמית. בברכה!',
  },
  {
    id: 'kk',
    flagEmojis: ['🇰🇿'],
    title: 'Қазақша',
    nativeTitle: 'Kazakh',
    region: 'asia',
    text: 'Test VNRT ONLINE қызметіне қош келдіңіз. Бұл біз кейбір функцияларды сынақтан өткізу үшін жасалған әзірлеуші нұсқасы... кездейсоқ немесе VNRT ONLINE ресми нұсқасына қосылатын үлкен жаңа мүмкіндіктер. Бұл әзірлеуші нұсқасы болғандықтан, шағын қателіктер болуы мүмкін, сондықтан ең жақсы VNRT ONLINE тәжірибесін қаласаңыз, ресми нұсқаны пайдаланыңыз. Құрметпен!',
  },
  {
    id: 'uz',
    flagEmojis: ['🇺🇿'],
    title: 'Oʻzbekcha',
    nativeTitle: 'Uzbek',
    region: 'asia',
    text: 'Test VNRT ONLINE ga xush kelibsiz. Bu biz ba\'zi xususiyatlarni sinab ko\'rishimiz uchun mo\'ljallangan dasturchilar versiyasidir... juda tasodifiy yoki rasmiy VNRT ONLINE versiyasiga kiritiladigan kattaroq yangi imkoniyatlar. Bu dasturchilar versiyasi bo\'lgani uchun kichik xatolar bo\'lishi tabiiy, shuning uchun eng yaxshi VNRT ONLINE tajribasiga ega bo\'lishni istasangiz, rasmiy versiyadan foydalaning. Hurmat bilan!',
  },
  {
    id: 'mn',
    flagEmojis: ['🇲🇳'],
    title: 'Монгол',
    nativeTitle: 'Mongolian',
    region: 'asia',
    text: 'Test VNRT ONLINE-д тавтай морилно уу. Энэ нь бид зарим функцуудыг... маш санамсаргүй эсвэл албан ёсны VNRT ONLINE хувилбарт нэвтрүүлэх томоохон шинэ боломжуудыг туршиж үзэх хөгжүүлэгчийн хувилбар юм. Энэ нь хөгжүүлэгчийн хувилбар тул бага зэргийн алдаа гарах нь зайлшгүй тул хамгийн сайн VNRT ONLINE туршлагыг авахыг хүсвэл албан ёсны хувилбарыг ашиглана уу. Хүндэтгэсэн!',
  },
  {
    id: 'az',
    flagEmojis: ['🇦🇿'],
    title: 'Azərbaycanca',
    nativeTitle: 'Azerbaijani',
    region: 'asia',
    text: 'Test VNRT ONLINE-a xoş gəlmisiniz. Bu, bəzi funksiyaları... tamamilə təsadüfi və ya VNRT ONLINE-ın rəsmi buraxılışına əlavə ediləcək daha böyük yeni imkanları sınaqdan keçirməyimiz üçün tərtibatçı versiyasıdır. Tərtibatçı versiyası olduğundan xırda xətalar qaçılmazdır, buna görə də ən yaxşı VNRT ONLINE təcrübəsi istəyirsinizsə, rəsmi versiyadan istifadə edin. Hörmətlə!',
  },

  // =================== EUROPE ===================
  {
    id: 'es',
    flagEmojis: ['🇪🇸'],
    title: 'Español',
    nativeTitle: 'Spanish (España)',
    region: 'europe',
    text: '¡Bienvenido a Test VNRT ONLINE! Esta es una versión para desarrolladores para que podamos probar algunas funciones... muy aleatorias o características más importantes que se incorporarán a la versión oficial de VNRT ONLINE. Dado que se trata de una versión para desarrolladores, los pequeños errores son inevitables, por lo que si deseas la mejor experiencia con VNRT ONLINE, utiliza la versión oficial. ¡Atentamente!',
  },
  {
    id: 'fr',
    flagEmojis: ['🇫🇷', '🇧🇪', '🇨🇭'],
    title: 'Français',
    nativeTitle: 'French',
    region: 'europe',
    text: 'Bienvenue sur Test VNRT ONLINE. Ceci est une version développeur nous permettant de tester certaines fonctionnalités... très aléatoires ou de plus grandes nouveautés qui seront intégrées à la version officielle de VNRT ONLINE. Comme il s\'agit d\'une version développeur, de petits bugs sont inévitables ; pour une expérience optimale, nous vous invitons à utiliser la version officielle. Cordialement !',
  },
  {
    id: 'de',
    flagEmojis: ['🇩🇪', '🇦🇹', '🇨🇭'],
    title: 'Deutsch',
    nativeTitle: 'German',
    region: 'europe',
    text: 'Willkommen bei Test VNRT ONLINE. Dies ist eine Entwicklerversion, mit der wir einige Funktionen testen können... ganz zufällige oder auch größere neue Features, die in die offizielle Version von VNRT ONLINE übernommen werden. Da dies eine Entwicklerversion ist, lassen sich kleine Fehler nicht vermeiden. Für das beste VNRT ONLINE-Erlebnis nutzen Sie bitte die offizielle Version. Mit freundlichen Grüßen!',
  },
  {
    id: 'it',
    flagEmojis: ['🇮🇹', '🇨🇭'],
    title: 'Italiano',
    nativeTitle: 'Italian',
    region: 'europe',
    text: 'Benvenuti su Test VNRT ONLINE. Questa è una versione per sviluppatori creata per permetterci di sperimentare alcune funzionalità... molto casuali o modifiche più importanti che verranno introdotte nella versione ufficiale di VNRT ONLINE. Trattandosi di una versione per sviluppatori, piccoli bug sono inevitabili; se desideri la migliore esperienza con VNRT ONLINE, ti consigliamo di utilizzare la versione ufficiale. Cordiali saluti!',
  },
  {
    id: 'pt',
    flagEmojis: ['🇵🇹'],
    title: 'Português',
    nativeTitle: 'Portuguese (Portugal)',
    region: 'europe',
    text: 'Bem-vindo ao Test VNRT ONLINE. Esta é uma versão de programador para testarmos algumas funcionalidades... muito aleatórias ou novidades maiores que serão implementadas na versão oficial do VNRT ONLINE. Por ser uma versão de desenvolvimento, pequenas falhas são inevitáveis, portanto, para ter a melhor experiência no VNRT ONLINE, use a versão oficial. Com os melhores cumprimentos!',
  },
  {
    id: 'ru',
    flagEmojis: ['🇷🇺', '🇧🇾'],
    title: 'Русский',
    nativeTitle: 'Russian',
    region: 'europe',
    text: 'Добро пожаловать в Test VNRT ONLINE. Это версия для разработчиков, где мы тестируем некоторые функции... как совершенно случайные, так и более масштабные нововведения, которые появятся в официальной версии VNRT ONLINE. Поскольку это версия для разработчиков, мелкие ошибки неизбежны, поэтому для наилучшего взаимодействия с VNRT ONLINE используйте официальную версию. С уважением!',
  },
  {
    id: 'tr',
    flagEmojis: ['🇹🇷', '🇨🇾'],
    title: 'Türkçe',
    nativeTitle: 'Turkish',
    region: 'europe',
    text: 'Test VNRT ONLINE\'a hoş geldiniz. Bu, bazı özellikleri denememiz için hazırlanmış bir geliştirici sürümüdür... son derece rastgele veya VNRT ONLINE resmi sürümüne eklenecek daha büyük yeni özellikler. Bu bir geliştirici sürümü olduğundan küçük hatalar kaçınılmazdır, bu nedenle en iyi VNRT ONLINE deneyimini istiyorsanız lütfen resmi sürümü kullanın. Saygılarımızla!',
  },
  {
    id: 'nl',
    flagEmojis: ['🇳🇱', '🇧🇪'],
    title: 'Nederlands',
    nativeTitle: 'Dutch',
    region: 'europe',
    text: 'Welkom bij Test VNRT ONLINE. Dit is een ontwikkelaarsversie waarmee we enkele functies kunnen uitproberen... zeer willekeurige of juist grotere nieuwe functies die aan de officiële VNRT ONLINE-versie worden toegevoegd. Aangezien dit een ontwikkelaarsversie is, zijn kleine bugs onvermijdelijk; voor de beste VNRT ONLINE-ervaring raden we aan de officiële versie te gebruiken. Met vriendelijke groet!',
  },
  {
    id: 'pl',
    flagEmojis: ['🇵🇱'],
    title: 'Polski',
    nativeTitle: 'Polish',
    region: 'europe',
    text: 'Witamy w Test VNRT ONLINE. To jest wersja deweloperska, w której testujemy wybrane funkcje... zarówno drobne, eksperymentalne, jak i większe nowości, które trafią do oficjalnego wydania VNRT ONLINE. Ponieważ jest to wersja deweloperska, drobne błędy są nieuniknione, dlatego jeśli zależy Ci na najlepszych wrażeniach z VNRT ONLINE, skorzystaj z oficjalnej wersji. Z poważaniem!',
  },
  {
    id: 'uk',
    flagEmojis: ['🇺🇦'],
    title: 'Українська',
    nativeTitle: 'Ukrainian',
    region: 'europe',
    text: 'Ласкаво просимо до Test VNRT ONLINE. Це версія для розробників, призначена для тестування нових можливостей... від випадкових експериментів до великих функцій, які незабаром з\'являться в офіційному релізі VNRT ONLINE. Оскільки це версія для розробників, незначні помилки неминучі, тому для найкращого досвіду роботи з VNRT ONLINE використовуйте офіційну версію. З повагою!',
  },
  {
    id: 'cs',
    flagEmojis: ['🇨🇿'],
    title: 'Čeština',
    nativeTitle: 'Czech',
    region: 'europe',
    text: 'Vítejte v Test VNRT ONLINE. Toto je vývojářská verze, abychom mohli otestovat některé funkce... zcela náhodné nebo větší novinky, které budou přidány do oficiální verze VNRT ONLINE. Vzhledem k tomu, že se jedná o vývojářskou verzi, jsou drobné chyby nevyhnutelné. Pokud tedy chcete ten nejlepší zážitek z VNRT ONLINE, použijte oficiální verzi. S pozdravem!',
  },
  {
    id: 'sk',
    flagEmojis: ['🇸🇰'],
    title: 'Slovenčina',
    nativeTitle: 'Slovak',
    region: 'europe',
    text: 'Vitajte v Test VNRT ONLINE. Toto je vývojárska verzia, aby sme mohli otestovať niektoré funkcie... náhodné nápady alebo väčšie novinky, ktoré budú pridané do oficiálnej verzie VNRT ONLINE. Keďže ide o vývojársku verziu, drobné chyby sú nevyhnutné, preto ak chcete najlepší zážitok z VNRT ONLINE, použite oficiálnu verziu. S úctou!',
  },
  {
    id: 'hu',
    flagEmojis: ['🇭🇺'],
    title: 'Magyar',
    nativeTitle: 'Hungarian',
    region: 'europe',
    text: 'Üdvözöljük a Test VNRT ONLINE felületén. Ez egy fejlesztői verzió, amellyel néhány funkciót tesztelhetünk... teljesen véletlenszerűeket vagy nagyobb újításokat, amelyek a hivatalos VNRT ONLINE kiadásba kerülnek majd. Mivel ez egy fejlesztői verzió, az apró hibák elkerülhetetlenek, így ha a legjobb VNRT ONLINE élményre vágyik, kérjük, használja a hivatalos verziót. Tisztelettel!',
  },
  {
    id: 'ro',
    flagEmojis: ['🇷🇴', '🇲🇩'],
    title: 'Română',
    nativeTitle: 'Romanian',
    region: 'europe',
    text: 'Bine ați venit la Test VNRT ONLINE. Aceasta este o versiune pentru dezvoltatori prin care testăm anumite funcționalități... unele aleatorii sau funcții noi mai ample care vor fi incluse în versiunea oficială VNRT ONLINE. Fiind o versiune pentru dezvoltatori, micile erori sunt inevitabile, așa că dacă doriți cea mai bună experiență VNRT ONLINE, vă rugăm să utilizați versiunea oficială. Cu stimă!',
  },
  {
    id: 'bg',
    flagEmojis: ['🇧🇬'],
    title: 'Български',
    nativeTitle: 'Bulgarian',
    region: 'europe',
    text: 'Добре дошли в Test VNRT ONLINE. Това е версия за разработчици, с която тестваме определени функции... както експериментални идеи, така и по-големи новости, които ще бъдат добавени в официалната версия на VNRT ONLINE. Тъй като това е версия за разработчици, малки грешки са неизбежни, така че ако искате най-доброто изживяване с VNRT ONLINE, моля използвайте официалната версия. С уважение!',
  },
  {
    id: 'sr',
    flagEmojis: ['🇷🇸'],
    title: 'Српски',
    nativeTitle: 'Serbian',
    region: 'europe',
    text: 'Добродошли у Test VNRT ONLINE. Ово је програмерска верзија како бисмо могли да тестирамо одређене функције... насумичне или веће нове могућности које ће бити додате у званично VNRT ONLINE издање. Пошто је ово верзија за програмере, ситне грешке су неизбежне, па ако желите најбоље VNRT ONLINE искуство, користите званичну верзију. С поштовањем!',
  },
  {
    id: 'hr',
    flagEmojis: ['🇭🇷'],
    title: 'Hrvatski',
    nativeTitle: 'Croatian',
    region: 'europe',
    text: 'Dobrodošli na Test VNRT ONLINE. Ovo je razvojna verzija kako bismo mogli isprobati neke značajke... nasumične ideje ili veće novosti koje će biti dodane u službeno izdanje VNRT ONLINE. Budući da je ovo razvojna verzija, manje su pogreške neizbježne, pa ako želite najbolje VNRT ONLINE iskustvo, koristite službenu verziju. S poštovanjem!',
  },
  {
    id: 'bs',
    flagEmojis: ['🇧🇦'],
    title: 'Bosanski',
    nativeTitle: 'Bosnian',
    region: 'europe',
    text: 'Dobrodošli na Test VNRT ONLINE. Ovo je razvojna verzija kako bismo mogli isprobati određene funkcije... nasumične ili veće nove mogućnosti koje će biti dodate u zvanično VNRT ONLINE izdanje. Budući da je ovo verzija za programere, sitne greške su neizbježne, pa ako želite najbolje VNRT ONLINE iskustvo, koristite zvaničnu verziju. S poštovanjem!',
  },
  {
    id: 'sl',
    flagEmojis: ['🇸🇮'],
    title: 'Slovenščina',
    nativeTitle: 'Slovenian',
    region: 'europe',
    text: 'Dobrodošli v Test VNRT ONLINE. To je razvojna različica, namenjena preizkušanju nekaterih funkcij... naključnih eksperimentov ali večjih novosti, ki bodo dodane v uradno različico VNRT ONLINE. Ker gre za razvojno različico, so manjše napake neizogibne; če želite najboljšo izkušnjo VNRT ONLINE, uporabite uradno izdajo. Lep pozdrav!',
  },
  {
    id: 'sv',
    flagEmojis: ['🇸🇪'],
    title: 'Svenska',
    nativeTitle: 'Swedish',
    region: 'europe',
    text: 'Välkommen till Test VNRT ONLINE. Detta är en utvecklarversion där vi testar olika funktioner... såväl slumpmässiga idéer som större nya funktioner som kommer att släppas i den officiella versionen av VNRT ONLINE. Eftersom detta är en utvecklarversion kan mindre buggar förekomma. För den bästa VNRT ONLINE-upplevelsen ber vi dig använda den officiella utgåvan. Vänliga hälsningar!',
  },
  {
    id: 'da',
    flagEmojis: ['🇩🇰'],
    title: 'Dansk',
    nativeTitle: 'Danish',
    region: 'europe',
    text: 'Velkommen til Test VNRT ONLINE. Dette er en udviklerversion, hvor vi kan afprøve visse funktioner... tilfældige eksperimenter eller større nye funktioner, der vil blive inkluderet i den officielle VNRT ONLINE-udgivelse. Da dette er en udviklerversion, kan der forekomme mindre fejl. Hvis du ønsker den bedste VNRT ONLINE-oplevelse, bedes du benytte den officielle version. Med venlig hilsen!',
  },
  {
    id: 'no',
    flagEmojis: ['🇳🇴'],
    title: 'Norsk',
    nativeTitle: 'Norwegian',
    region: 'europe',
    text: 'Velkommen til Test VNRT ONLINE. Dette er en utviklerversjon der vi tester ut ulike funksjoner... tilfeldige eksperimenter eller større nye funksjoner som blir lagt til den offisielle utgaven av VNRT ONLINE. Siden dette er en utviklerversjon, kan mindre feil oppstå. For den beste VNRT ONLINE-opplevelsen anbefaler vi at du bruker den offisielle versjonen. Vennlig hilsen!',
  },
  {
    id: 'fi',
    flagEmojis: ['🇫🇮'],
    title: 'Suomi',
    nativeTitle: 'Finnish',
    region: 'europe',
    text: 'Tervetuloa Test VNRT ONLINE -palveluun. Tämä on kehittäjäversio, jolla voimme kokeilla joitain ominaisuuksia... satunnaisia ideoita tai suurempia uusia toimintoja, jotka julkaistaan virallisessa VNRT ONLINE -versiossa. Koska kyseessä on kehittäjäversio, pienet virheet ovat väistämättömiä; jos haluat parhaan VNRT ONLINE -kokemuksen, käytä virallista julkaisua. Ystävällisin terveisin!',
  },
  {
    id: 'is',
    flagEmojis: ['🇮🇸'],
    title: 'Íslenska',
    nativeTitle: 'Icelandic',
    region: 'europe',
    text: 'Velkomin í Test VNRT ONLINE. Þetta er þróunarútgáfa svo við getum prófað nokkra eiginleika... handahófskenndar hugmyndir eða stærri nýja eiginleika sem verða færðir yfir í opinberu VNRT ONLINE útgáfuna. Þar sem þetta er þróunarútgáfa eru minniháttar villur óumflýjanlegar, þannig að ef þú vilt bestu VNRT ONLINE upplifunina skaltu nota opinberu útgáfuna. Með vinsemd og virðingu!',
  },
  {
    id: 'ga',
    flagEmojis: ['🇮🇪'],
    title: 'Gaeilge',
    nativeTitle: 'Irish (Gaelic)',
    region: 'europe',
    text: 'Fáilte go Test VNRT ONLINE. Is leagan forbróra é seo dúinn chun roinnt gnéithe a thástáil... cinn randamacha nó gnéithe nua níos mó a chuirfear leis an leagan oifigiúil de VNRT ONLINE. Toisc gur leagan forbróra é seo, ní féidir mionfhabhtanna a sheachaint, mar sin más mian leat an t-eispéireas VNRT ONLINE is fearr, bain úsáid as an leagan oifigiúil. Le meas!',
  },
  {
    id: 'cy',
    flagEmojis: ['🇬🇧'],
    title: 'Cymraeg',
    nativeTitle: 'Welsh',
    region: 'europe',
    text: 'Croeso i Test VNRT ONLINE. Dyma fersiwn datblygwr i ni allu arbrofi gyda rhai nodweddion... rhai ar hap neu nodweddion newydd mwy a fydd yn cael eu cynnwys yn y fersiwn swyddogol o VNRT ONLINE. Gan mai fersiwn datblygwr yw hwn, mae mân chwilod yn anochel, felly os ydych chi eisiau\'r profiad VNRT ONLINE gorau, defnyddiwch y fersiwn swyddogol. Yn gywir!',
  },
  {
    id: 'el',
    flagEmojis: ['🇬🇷', '🇨🇾'],
    title: 'Ελληνικά',
    nativeTitle: 'Greek',
    region: 'europe',
    text: 'Καλώς ήρθατε στο Test VNRT ONLINE. Αυτή είναι μια έκδοση προγραμματιστή για να δοκιμάσουμε ορισμένες λειτουργίες... πολύ τυχαίες ή μεγαλύτερες νέες δυνατότητες που θα ενσωματωθούν στην επίσημη έκδοση του VNRT ONLINE. Καθώς πρόκειται για έκδοση προγραμματιστή, μικρά σφάλματα είναι αναπόφευκτα, οπότε αν θέλετε την καλύτερη εμπειρία VNRT ONLINE, παρακαλούμε χρησιμοποιήστε την επίσημη έκδοση. Με εκτίμηση!',
  },
  {
    id: 'ca',
    flagEmojis: ['🇪🇸', '🇦🇩'],
    title: 'Català',
    nativeTitle: 'Catalan',
    region: 'europe',
    text: 'Benvingut a Test VNRT ONLINE. Aquesta és una versió per a desenvolupadors perquè puguem provar algunes funcions... molt aleatòries o característiques més importants que s\'incorporaran a la versió oficial de VNRT ONLINE. Com que és una versió per a desenvolupadors, els petits errors són inevitables; si voleu la millor experiència amb VNRT ONLINE, utilitzeu la versió oficial. Atentament!',
  },
  {
    id: 'gl',
    flagEmojis: ['🇪🇸'],
    title: 'Galego',
    nativeTitle: 'Galician',
    region: 'europe',
    text: 'Benvido a Test VNRT ONLINE. Esta é unha versión para desenvolvedores para que poidamos probar algunhas funcións... moi aleatorias ou características máis importantes que se incorporarán á versión oficial de VNRT ONLINE. Dado que se trata dunha versión para desenvolvedores, os pequenos erros son inevitables, polo que se desexas a mellor experiencia con VNRT ONLINE, utiliza a versión oficial. Atentamente!',
  },
  {
    id: 'eu',
    flagEmojis: ['🇪🇸'],
    title: 'Euskara',
    nativeTitle: 'Basque',
    region: 'europe',
    text: 'Ongi etorri Test VNRT ONLINE-ra. Garatzaile-bertsio bat da, zenbait funtzio probatu ahal izateko... ausazko ezaugarriak zein VNRT ONLINE-ren bertsio ofizialera eramango diren funtzio berri garrantzitsuagoak. Garatzaile-bertsioa denez, akats txikiak saihestezinak dira; beraz, VNRT ONLINE esperientziarik onena nahi baduzu, mesedez erabili bertsio ofiziala. Agur bero bat!',
  },
  {
    id: 'ka',
    flagEmojis: ['🇬🇪'],
    title: 'ქართული',
    nativeTitle: 'Georgian',
    region: 'europe',
    text: 'მოგესალმებით Test VNRT ONLINE-ში. ეს არის დეველოპერის ვერსია, რათა შევძლოთ ზოგიერთი ფუნქციის გამოცდა... სრულიად შემთხვევითი თუ უფრო დიდი სიახლეების, რომლებიც VNRT ONLINE-ის ოფიციალურ გამოშვებაში ჩაერთვება. რადგან ეს დეველოპერის ვერსიაა, მცირე ხარვეზები გარდაუვალია, ამიტომ საუკეთესო VNRT ONLINE გამოცდილებისთვის, გთხოვთ გამოიყენოთ ოფიციალური ვერსია. პატივისცემით!',
  },
  {
    id: 'hy',
    flagEmojis: ['🇦🇲'],
    title: 'Հայերեն',
    nativeTitle: 'Armenian',
    region: 'europe',
    text: 'Բարի գալուստ Test VNRT ONLINE: Սա մշակողների համար նախատեսված տարբերակ է, որպեսզի մենք կարողանանք փորձարկել որոշ գործառույթներ... պատահական կամ ավելի մեծ նոր հնարավորություններ, որոնք կներառվեն VNRT ONLINE-ի պաշտոնական թողարկման մեջ: Քանի որ սա մշակողների տարբերակ է, փոքր սխալներն անխուսափելի են, ուստի եթե ցանկանում եք VNRT ONLINE-ի լավագույն փորձը, խնդրում ենք օգտագործել պաշտոնական տարբերակը: Հարգանքներով:',
  },
  {
    id: 'lt',
    flagEmojis: ['🇱🇹'],
    title: 'Lietuvių',
    nativeTitle: 'Lithuanian',
    region: 'europe',
    text: 'Sveiki atvykę į Test VNRT ONLINE. Tai kūrėjų versija, skirta išbandyti tam tikras funkcijas... atsitiktines idėjas arba didesnes naujoves, kurios bus perkeltos į oficialią VNRT ONLINE versiją. Kadangi tai kūrėjų versija, nedidelių klaidų išvengti neįmanoma, todėl jei norite geriausios VNRT ONLINE patirties, naudokite oficialią versiją. Pagarbiai!',
  },
  {
    id: 'lv',
    flagEmojis: ['🇱🇻'],
    title: 'Latviešu',
    nativeTitle: 'Latvian',
    region: 'europe',
    text: 'Laipni lūdzam Test VNRT ONLINE. Šī ir izstrādātāju versija, lai mēs varētu pārbaudīt dažas funkcijas... nejaušas idejas vai lielākus jauninājumus, kas tiks ieviesti oficiālajā VNRT ONLINE laidienā. Tā kā šī ir izstrādātāju versija, nelielas kļūdas ir neizbēgamas, tādēļ, ja vēlaties vislabāko VNRT ONLINE pieredzi, lūdzu, izmantojiet oficiālo versiju. Ar cieņu!',
  },
  {
    id: 'et',
    flagEmojis: ['🇪🇪'],
    title: 'Eesti',
    nativeTitle: 'Estonian',
    region: 'europe',
    text: 'Tere tulemast Test VNRT ONLINE keskkonda. See on arendajaversioon, et saaksime katsetada mõningaid funktsioone... nii juhuslikke ideid kui ka suuremaid uuendusi, mis jõuavad ametlikku VNRT ONLINE versiooni. Kuna tegemist on arendajaversiooniga, on pisivead paratamatud, seega kui soovite parimat VNRT ONLINE kogemust, kasutage palun ametlikku versiooni. Lugupidamisega!',
  },
  {
    id: 'sq',
    flagEmojis: ['🇦🇱', '🇽🇰'],
    title: 'Shqip',
    nativeTitle: 'Albanian',
    region: 'europe',
    text: 'Mirë se vini në Test VNRT ONLINE. Ky është një version zhvilluesi që ne të eksperimentojmë me disa veçori... ide të rastësishme ose veçori më të mëdha të reja që do të shtohen në versionin zyrtar të VNRT ONLINE. Duke qenë se ky është një version zhvilluesi, gabimet e vogla janë të pashmangshme, prandaj nëse dëshironi përvojën më të mirë të VNRT ONLINE, ju lutemi përdorni versionin zyrtar. Me respekt!',
  },
  {
    id: 'mk',
    flagEmojis: ['🇲🇰'],
    title: 'Македонски',
    nativeTitle: 'Macedonian',
    region: 'europe',
    text: 'Добредојдовте во Test VNRT ONLINE. Ова е верзија за програмери за да тестираме некои функции... случајни идеи или поголеми нови функции што ќе бидат додадени во официјалното издание на VNRT ONLINE. Бидејќи ова е верзија за програмери, малите грешки се неизбежни, па ако сакате најдобро искуство со VNRT ONLINE, користете го официјалното издание. Со почит!',
  },
  {
    id: 'la',
    flagEmojis: ['🇻🇦'],
    title: 'Latina',
    nativeTitle: 'Latin',
    region: 'europe',
    text: 'Bene venisti ad Test VNRT ONLINE. Haec est versio elaboratorum ut quasdam facultates experiamur... sive fortuitas sive maiores novas quae ad officialem editionem VNRT ONLINE adducentur. Cum sit versio elaboratorum, parvi errores evitari non possunt; quapropter si optimam experientiam VNRT ONLINE desideras, quaesumus utere editione officiali. Cum observantia!',
  },

  // =================== AMERICAS ===================
  {
    id: 'es-la',
    flagEmojis: ['🇲🇽', '🇦🇷', '🇨🇴'],
    title: 'Español (Latinoamérica)',
    nativeTitle: 'Spanish (Latin America)',
    region: 'americas',
    text: '¡Bienvenido a Test VNRT ONLINE! Esta es una versión para desarrolladores para que podamos probar algunas funciones... muy aleatorias o características más importantes que se incorporarán a la versión oficial de VNRT ONLINE. Dado que se trata de una versión para desarrolladores, los pequeños errores son inevitables, por lo que si deseas la mejor experiencia con VNRT ONLINE, utiliza la versión oficial. ¡Saludos cordiales!',
  },
  {
    id: 'pt-br',
    flagEmojis: ['🇧🇷'],
    title: 'Português (Brasil)',
    nativeTitle: 'Portuguese (Brazil)',
    region: 'americas',
    text: 'Boas-vindas ao Test VNRT ONLINE. Esta é uma versão de desenvolvedor para testarmos alguns recursos... muito aleatórios ou novidades maiores que serão levadas para a versão oficial do VNRT ONLINE. Por ser uma versão de desenvolvedor, pequenos bugs são inevitáveis, portanto, para ter a melhor experiência no VNRT ONLINE, use a versão oficial. Atenciosamente!',
  },
  {
    id: 'fr-ca',
    flagEmojis: ['🇨🇦'],
    title: 'Français (Canada)',
    nativeTitle: 'French (Canadian)',
    region: 'americas',
    text: 'Bienvenue sur Test VNRT ONLINE. Il s\'agit d\'une version développeur nous permettant de tester certaines fonctionnalités... des essais ponctuels ou des nouveautés majeures qui seront intégrées à la version officielle de VNRT ONLINE. Puisqu\'il s\'agit d\'une version développeur, de légers bogues sont inévitables. Pour profiter pleinement de l\'expérience VNRT ONLINE, veuillez utiliser la version officielle. Cordialement !',
  },

  // =================== AFRICA ===================
  {
    id: 'sw',
    flagEmojis: ['🇰🇪', '🇹🇿', '🇺🇬'],
    title: 'Kiswahili',
    nativeTitle: 'Swahili',
    region: 'africa',
    text: 'Karibu kwenye Test VNRT ONLINE. Hili ni toleo la msanidi ili tuweze kujaribu vipengele fulani... vipengele vya majaribio au vipya vikubwa vitakavyowekwa kwenye toleo rasmi la VNRT ONLINE. Kwa kuwa hili ni toleo la msanidi, hitilafu ndogo ndogo haziepukiki, kwa hivyo ukitaka matumizi bora zaidi ya VNRT ONLINE, tafadhali tumia toleo rasmi. Wako wa dhati!',
  },
  {
    id: 'af',
    flagEmojis: ['🇿🇦'],
    title: 'Afrikaans',
    nativeTitle: 'Afrikaans (South Africa)',
    region: 'africa',
    text: 'Welkom by Test VNRT ONLINE. Hierdie is \'n ontwikkelaarsweergawe sodat ons sekere kenmerke kan toets... ewekansige idees of groter nuwe funksies wat na die amptelike VNRT ONLINE-vrystelling gebring sal word. Aangesien dit \'n ontwikkelaarsweergawe is, is klein foute onvermydelik, so as jy die beste VNRT ONLINE-ervaring wil hê, gebruik asseblief die amptelike weergawe. Vriendelike groete!',
  },
  {
    id: 'am',
    flagEmojis: ['🇪🇹'],
    title: 'አማርኛ',
    nativeTitle: 'Amharic',
    region: 'africa',
    text: 'እንኳን ወደ Test VNRT ONLINE በደህና መጡ። ይህ የገንቢዎች እትም ነው፤ በዚህም አንዳንድ ባህሪያትን... በዘፈቀደ የተዘጋጁ ወይም ወደ ይፋዊው የ VNRT ONLINE እትም የሚገቡ ትልልቅ አዳዲስ ባህሪያትን መሞከር እንችላለን። ይህ የገንቢ እትም በመሆኑ ጥቃቅን ስህተቶች ሊከሰቱ ይችላሉ፤ ስለዚህ ምርጡን የ VNRT ONLINE ተሞክሮ ከፈለጉ እባክዎ ይፋዊውን እትም ይጠቀሙ። ከታላቅ አክብሮት ጋር!',
  },
  {
    id: 'yo',
    flagEmojis: ['🇳🇬'],
    title: 'Yorùbá',
    nativeTitle: 'Yoruba',
    region: 'africa',
    text: 'Ẹ kú àbọ̀ sí Test VNRT ONLINE. Èyí jẹ́ ẹ̀dà olùgbéejáde fún wa láti dán àwọn àbùdá kan wò... àwọn àbùdá àìròtẹ́lẹ̀ tàbí àwọn àbùdá tuntun títóbi tí a ó mú wá sí ẹ̀dà ìjọba ti VNRT ONLINE. Níwọ̀n bí èyí ti jẹ́ ẹ̀dà olùgbéejáde, àwọn àṣìṣe kéékèèké kò ṣe é yẹ̀ sílẹ̀, nítorí náà tí o bá fẹ́ ìrírí VNRT ONLINE tó dára jùlọ, jọ̀wọ́ lo ẹ̀dà ìjọba. Pẹ̀lú ọ̀wọ̀!',
  },
  {
    id: 'ig',
    flagEmojis: ['🇳🇬'],
    title: 'Asụsụ Igbo',
    nativeTitle: 'Igbo',
    region: 'africa',
    text: 'Nnọọ na Test VNRT ONLINE. Nke a bụ ụdị ndị mmepe iji nwalee ụfọdụ atụmatụ... atụmatụ ndị na-abụghị nke a haziri ahazi ma ọ bụ nnukwu atụmatụ ọhụrụ a ga-ebute na mwepụta gọọmentị nke VNRT ONLINE. Ebe ọ bụ na nke a bụ ụdị ndị mmepe, obere mperi enweghị ike ịzenarị, yabụ ọ bụrụ na ị chọrọ ahụmịhe VNRT ONLINE kacha mma, biko jiri mwepụta gọọmentị. Jiri nkwanye ùgwù!',
  },
  {
    id: 'ha',
    flagEmojis: ['🇳🇬', '🇳🇪'],
    title: 'Harshen Hausa',
    nativeTitle: 'Hausa',
    region: 'africa',
    text: 'Barka da zuwa Test VNRT ONLINE. Wannan sigar mai haɓakawa ce don mu gwada wasu sabbin fasaloli... fasalolin gwaji ko manyan sabbin abubuwa da za a saka a cikin sigar hukuma ta VNRT ONLINE. Tun da wannan sigar mai haɓakawa ce, ƙananan kura-kurai ba za a iya kauce musu ba, don haka idan kuna son kyakkyawan ƙwarewar VNRT ONLINE, da fatan za a yi amfani da sigar hukuma. Tare da girmamawa!',
  },

  // =================== GLOBAL ===================
  {
    id: 'eo',
    flagEmojis: ['🌍'],
    title: 'Esperanto',
    nativeTitle: 'Esperanto',
    region: 'global',
    text: 'Bonvenon al Test VNRT ONLINE. Ĉi tio estas programista versio por ke ni povu testi kelkajn funkciojn... tre hazardajn aŭ pli grandajn novajn funkciojn kiuj estos aldonitaj al la oficiala versio de VNRT ONLINE. Ĉar ĉi tio estas programista versio, malgrandaj eraroj estas neeviteblaj; tial se vi volas la plej bonan sperton de VNRT ONLINE, bonvolu uzi la oficialan version. Sincere!',
  },
];

export const BrandTransitionScreen: React.FC<BrandTransitionScreenProps> = ({ onContinue, onStartSetup }) => {
  const {
    isPlaying,
    isMuted,
    volume: volumeLevel,
    togglePlay,
    toggleMute,
    setVolume: handleSetVolume,
    boostMaxVolume,
  } = useIntermissionMusic();

  // Search and filter states (always available on the page)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<'all' | MessageRegion>('all');

  // Handle any user click or key on the page to immediately guarantee maximum volume
  const handleUserInteraction = () => {
    boostMaxVolume();
  };

  const handleSwitchReleases = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = 'https://vplay-2610.vercel.app';
  };

  const handleStartSetup = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartSetup) {
      onStartSetup();
    } else {
      onContinue();
      try {
        localStorage.removeItem('vplay_oobe_completed');
      } catch {}
      window.dispatchEvent(new CustomEvent('vplay:open_oobe'));
    }
  };

  const filteredMessages = MESSAGES.filter((msg) => {
    if (selectedRegion !== 'all' && msg.region !== selectedRegion) {
      return false;
    }
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      msg.title.toLowerCase().includes(q) ||
      msg.nativeTitle.toLowerCase().includes(q) ||
      msg.text.toLowerCase().includes(q) ||
      msg.id.toLowerCase().includes(q)
    );
  });

  const regionCounts = {
    all: MESSAGES.length,
    asia: MESSAGES.filter((m) => m.region === 'asia').length,
    europe: MESSAGES.filter((m) => m.region === 'europe').length,
    americas: MESSAGES.filter((m) => m.region === 'americas').length,
    africa: MESSAGES.filter((m) => m.region === 'africa').length,
    global: MESSAGES.filter((m) => m.region === 'global').length,
  };

  return (
    <div
      onClick={handleUserInteraction}
      className="brand-intermission-screen fixed inset-0 z-[99999] overflow-y-auto bg-[#F8FAFC] text-slate-800 antialiased select-none flex flex-col justify-between"
      style={{
        fontFamily: "'Chakra Petch', 'Rajdhani', 'Space Grotesk', system-ui, sans-serif",
      }}
    >
      {/* Explicit style tags to ensure square font family overrides global Integer !important rules */}
      <style>{`
        .brand-intermission-screen,
        .brand-intermission-screen h1,
        .brand-intermission-screen h2,
        .brand-intermission-screen h3,
        .brand-intermission-screen h4,
        .brand-intermission-screen p,
        .brand-intermission-screen span:not(.brand-flag-emoji),
        .brand-intermission-screen button,
        .brand-intermission-screen input,
        .brand-intermission-screen div:not(.brand-flag-emoji) {
          font-family: 'Chakra Petch', 'Rajdhani', 'Space Grotesk', system-ui, -apple-system, sans-serif !important;
          letter-spacing: -0.01em;
        }
        .brand-flag-emoji {
          font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Twemoji Mozilla', sans-serif !important;
          font-style: normal !important;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
        }
      `}</style>

      {/* Floating Sound Controls in top-right corner with Volume Boost indicator */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md rounded-full px-3 py-1.5 text-slate-700">
        <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shrink-0">
          <Music className="w-3 h-3 text-emerald-400 animate-pulse" />
        </div>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={togglePlay}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title={isPlaying ? 'Tạm dừng nhạc' : 'Phát tiếp nhạc'}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
        </button>

        {/* Mute/Unmute Button */}
        <button
          type="button"
          onClick={toggleMute}
          className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
          title={isMuted ? 'Bật âm thanh' : 'Tắt tiếng'}
        >
          {isMuted ? (
            <VolumeX className="w-3.5 h-3.5 text-red-500" />
          ) : (
            <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
          )}
        </button>

        {/* Volume Boost Indicator / Button */}
        <button
          type="button"
          onClick={(e) => handleSetVolume(100, e)}
          className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
            volumeLevel === 100 && !isMuted
              ? 'bg-emerald-500 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title="Âm lượng tối đa (100%)"
        >
          <Volume1 className="w-3 h-3" />
          <span>100% MAX</span>
        </button>
      </div>

      {/* Main Content Area (pt-16 sm:pt-20 for Dynamic Island safe area, pb-32 for Intermission Tab Bar clearance) */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-5 pt-16 pb-8 sm:px-10 sm:pt-20 sm:pb-12 pb-32">
        {/* Header Title Bar */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3.5 sm:gap-4">
              <img
                src="https://static.wikia.nocookie.net/ep-deo/images/5/51/New_official_vnrt_logo.png/revision/latest?cb=20260926162432"
                alt="VNRT Online"
                referrerPolicy="no-referrer"
                className="h-10 sm:h-12 w-auto max-w-[160px] object-contain shrink-0"
              />
              <div className="h-8 w-px bg-slate-200 hidden sm:block" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  VNRT ONLINE <span className="text-amber-500 font-black">TEST BUILD</span>
                </h1>
              </div>
            </div>

            {/* Quick Continue Button on top */}
            <button
              type="button"
              onClick={onContinue}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center gap-2 group"
            >
              <span>Vào trang web ngay</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* ALWAYS-VISIBLE SEARCH & FILTER BOX (Đặt trực tiếp trên trang Intermission) */}
        <div className="mb-8 bg-white border border-slate-200 rounded-2xl p-3 sm:p-3.5 shadow-xs">
          <div className="flex items-center gap-3 px-1">
            <Search className="w-5 h-5 text-slate-400 shrink-0 stroke-[2.4]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm ngôn ngữ hoặc nội dung thông báo (Tiếng Việt, English, Español, 日本語, Русский, ພາສາລາວ, ភាសាខ្មែរ...)..."
              className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none font-medium py-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer font-bold text-sm"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Region Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-slate-400 font-semibold px-1">Khu vực:</span>
              <button
                type="button"
                onClick={() => setSelectedRegion('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Tất cả ({regionCounts.all})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegion('asia')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === 'asia'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Châu Á ({regionCounts.asia})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegion('europe')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === 'europe'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Châu Âu ({regionCounts.europe})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegion('americas')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === 'americas'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Châu Mỹ ({regionCounts.americas})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegion('africa')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === 'africa'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Châu Phi ({regionCounts.africa})
              </button>
              <button
                type="button"
                onClick={() => setSelectedRegion('global')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  selectedRegion === 'global'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Toàn cầu ({regionCounts.global})
              </button>
            </div>

            {(searchQuery || selectedRegion !== 'all') && (
              <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium text-[11px]">
                  {filteredMessages.length} / {MESSAGES.length}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRegion('all');
                  }}
                  className="text-amber-600 hover:underline font-bold cursor-pointer text-[11px]"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Empty Search Result State */}
        {filteredMessages.length === 0 && (
          <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 p-8 shadow-xs my-6">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-base font-bold text-slate-700">
              Không tìm thấy ngôn ngữ phù hợp với &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Thử tìm theo tên tiếng Việt, tiếng Anh, tên bản địa hoặc mã ngôn ngữ.
            </p>
          </div>
        )}

        {/* List of Messages */}
        <div className="space-y-6">
          {filteredMessages.map((msg, index) => {
            const isRtl = ['ar', 'he', 'fa', 'ur'].includes(msg.id);
            return (
              <div key={msg.id} className="group transition-all">
                {/* Language Header with High-Resolution Twemoji SVG Flag & Name */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 shrink-0 select-none">
                    {msg.flagEmojis.map((emoji, idx) => (
                      <TwemojiFlag
                        key={idx}
                        emoji={emoji}
                        title={msg.title}
                        className="w-7 h-7 sm:w-8 sm:h-8"
                      />
                    ))}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                      <span>{msg.title}</span>
                      {msg.nativeTitle !== msg.title && (
                        <span className="text-xs sm:text-sm font-medium text-slate-400">
                          ({msg.nativeTitle})
                        </span>
                      )}
                    </h3>
                  </div>
                </div>

                {/* Message Content */}
                <p
                  className={`mt-2.5 text-sm sm:text-base text-slate-700 leading-relaxed font-normal ${isRtl ? 'text-right' : 'text-left'}`}
                  dir={isRtl ? 'rtl' : 'ltr'}
                >
                  {msg.text}
                </p>

                {/* Divider (except last item) */}
                {index < filteredMessages.length - 1 && (
                  <div className="h-px bg-slate-200/90 w-full mt-6" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button: Tiếp tục vào trang web (Continue to Website) → */}
        <div className="flex justify-center items-center pt-12 pb-8">
          <button
            type="button"
            id="btn-continue-to-website"
            onClick={onContinue}
            className="px-8 py-3.5 sm:px-10 sm:py-4 rounded-xl bg-[#0B132B] hover:bg-[#1C2541] active:scale-95 text-white font-semibold text-sm sm:text-base shadow-xl shadow-slate-900/15 hover:shadow-slate-900/25 transition-all cursor-pointer flex items-center gap-2 group border border-slate-700/30"
          >
            <span>Tiếp tục vào trang web (Continue to Website)</span>
            <span className="transition-transform group-hover:translate-x-1.5 duration-200">
              →
            </span>
          </button>
        </div>
      </main>

      {/* DEDICATED TAB VIEW BAR FOR INTERMISSION SCREEN (Tách biệt hoàn toàn, cùng style/opacity/blur như thanh tab trong app) */}
      <nav
        aria-label="Thanh điều hướng Intermission"
        className="fixed bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 select-none max-w-[95vw]"
      >
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.45)',
            backdropFilter: 'blur(2.5px)',
            WebkitBackdropFilter: 'blur(2.5px)',
          }}
          className="tab-view-pill flex items-center px-1 sm:px-1.5 py-1 sm:py-1 rounded-full border border-white/45 shadow-[0_10px_36px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-all"
        >
          {/* Tab 1: Build Notice (icon book) - Active View */}
          <div
            className="relative px-3.5 py-2 sm:px-5 sm:py-2.5 h-[44px] sm:h-[48px] rounded-full flex items-center gap-2 text-xs sm:text-sm select-none"
          >
            <motion.div
              layoutId="intermissionTabActivePill"
              className="absolute inset-0 rounded-full bg-[#FF7A00] shadow-[0_4px_16px_rgba(255,122,0,0.48)] z-0"
              transition={{
                type: 'spring',
                stiffness: 480,
                damping: 34,
                mass: 0.75,
              }}
            />
            <div className="relative z-10 flex items-center gap-2 text-white font-bold">
              <BookOpen className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.3]" />
              <span className="whitespace-nowrap">Build Notice</span>
            </div>
          </div>

          {/* Tab 2: Switch Releases (icon Menu / giống tab More), nhảy sang https://vplay-2610.vercel.app */}
          <a
            id="tab-intermission-switch-releases"
            href="https://vplay-2610.vercel.app"
            target="_top"
            rel="noopener noreferrer"
            onClick={handleSwitchReleases}
            className="relative px-3.5 py-2 sm:px-5 sm:py-2.5 h-[44px] sm:h-[48px] rounded-full flex items-center gap-2 text-xs sm:text-sm text-[#222222] hover:text-black font-semibold transition-all cursor-pointer outline-none select-none active:scale-95 group"
            title="Chuyển sang bản phát hành https://vplay-2610.vercel.app"
          >
            <div className="absolute inset-0 rounded-full hover:bg-white/20 transition-colors pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2">
              <Menu className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4]" />
              <span className="whitespace-nowrap">Switch Releases</span>
              <ExternalLink className="w-3 h-3 text-[#555555] group-hover:text-black transition-colors -ml-0.5 shrink-0" />
            </div>
          </a>

          {/* Tab 3: Start Setup (trigger Windows 11 style OOBE Setup) */}
          <button
            type="button"
            id="tab-intermission-start-setup"
            onClick={handleStartSetup}
            className="relative px-3.5 py-2 sm:px-5 sm:py-2.5 h-[44px] sm:h-[48px] rounded-full flex items-center gap-2 text-xs sm:text-sm text-[#222222] hover:text-black font-semibold transition-all cursor-pointer outline-none select-none active:scale-95 group"
            title="Bắt đầu thiết lập OOBE Setup"
          >
            <div className="absolute inset-0 rounded-full hover:bg-white/20 transition-colors pointer-events-none" />
            <div className="relative z-10 flex items-center gap-2">
              <SquareArrowDown className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.4] text-[#222222] group-hover:text-black transition-colors" />
              <span className="whitespace-nowrap">Start Setup</span>
            </div>
          </button>
        </div>
      </nav>

      {/* Footer Branding */}
      <footer className="w-full text-center py-4 text-xs text-slate-400 border-t border-slate-200/60 bg-white/40 pb-20 sm:pb-24">
        <span>Test VNRT ONLINE • Brand Transition 2026</span>
      </footer>
    </div>
  );
};
