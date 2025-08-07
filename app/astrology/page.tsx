
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Calendar, MapPin, Eye, Heart, Network, Home } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore, useProfileStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { FormattedContent } from '@/components/ui/FormattedContent';
import AstrologyScene3D from '@/components/astrology/AstrologyScene3D';
import HouseChart3D from '@/components/astrology/HouseChart3D';
import StarMap3D from '@/components/astrology/StarMap3D';
import toast from 'react-hot-toast';

const zodiacSigns = [
  { name: 'Bạch Dương', date: '21/3 - 19/4', element: 'Hỏa', traits: 'Năng động, dũng cảm, lãnh đạo' },
  { name: 'Kim Ngưu', date: '20/4 - 20/5', element: 'Thổ', traits: 'Bền bỉ, thực tế, đáng tin cậy' },
  { name: 'Song Tử', date: '21/5 - 20/6', element: 'Khí', traits: 'Thông minh, linh hoạt, giao tiếp' },
  { name: 'Cự Giải', date: '21/6 - 22/7', element: 'Thủy', traits: 'Nhạy cảm, chu đáo, bảo vệ' },
  { name: 'Sư Tử', date: '23/7 - 22/8', element: 'Hỏa', traits: 'Tự tin, hào phóng, sáng tạo' },
  { name: 'Xử Nữ', date: '23/8 - 22/9', element: 'Thổ', traits: 'Hoàn hảo, phân tích, tỉ mỉ' },
  { name: 'Thiên Bình', date: '23/9 - 22/10', element: 'Khí', traits: 'Cân bằng, hòa hợp, thẩm mỹ' },
  { name: 'Hổ Cáp', date: '23/10 - 21/11', element: 'Thủy', traits: 'Mạnh mẽ, bí ẩn, đam mê' },
  { name: 'Nhân Mã', date: '22/11 - 21/12', element: 'Hỏa', traits: 'Tự do, phiêu lưu, triết học' },
  { name: 'Ma Kết', date: '22/12 - 19/1', element: 'Thổ', traits: 'Kỷ luật, tham vọng, truyền thống' },
  { name: 'Bảo Bình', date: '20/1 - 18/2', element: 'Khí', traits: 'Độc lập, sáng tạo, nhân đạo' },
  { name: 'Song Ngư', date: '19/2 - 20/3', element: 'Thủy', traits: 'Trực giác, nghệ thuật, đồng cảm' }
];

const generateStarAnalysis = (birthDate: string, birthTime: string, birthPlace: string) => {
  const date = new Date(birthDate);
  const [hour] = birthTime.split(':').map(Number);

  const stars = [
    { name: 'Sao Bắc Đẩu', position: `${(hour * 15) % 360}°`, influence: 'Định hướng cuộc sống' },
    { name: 'Sao Kim', position: `${(date.getMonth() * 30 + hour) % 360}°`, influence: 'Tình yêu và nghệ thuật' },
    { name: 'Sao Hỏa', position: `${(date.getDate() * 12 + hour) % 360}°`, influence: 'Năng lượng và hành động' },
    { name: 'Sao Mộc', position: `${(date.getFullYear() % 12 * 30) % 360}°`, influence: 'May mắn và mở rộng' },
    { name: 'Sao Thổ', position: `${(date.getDate() * 6) % 360}°`, influence: 'Kỷ luật và trách nhiệm' },
  ];

  return stars;
};

const getZodiacSign = (dateString: string) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[0];
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[1];
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[2];
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[3];
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[4];
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[5];
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[6];
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[7];
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[8];
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return zodiacSigns[9];
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[10];
  return zodiacSigns[11];
};

const AstrologyPage = () => {
  const [mode, setMode] = useState<'general' | 'love' | 'staranalysis' | 'relations'>('general');
  const [birthPlace, setBirthPlace] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [userZodiac, setUserZodiac] = useState<any>(null);
  const [showRelationChart, setShowRelationChart] = useState(false);
  const [showStarMap, setShowStarMap] = useState(false);
  const [starMapGenerated, setStarMapGenerated] = useState(false);
  const { user, isAuthenticated } = useAuthStore();
  const { partner, breakupData } = useProfileStore();
  const [showLoveConfirmDialog, setShowLoveConfirmDialog] = useState(false);
  const [proceedWithGeneralLove, setProceedWithGeneralLove] = useState(false);

  const generateLoveAnalysis = () => {
    if (!partner && !breakupData?.isActive) {
      return "Bạn hiện không có người phụ thuộc về mặt tình cảm. Nếu bạn vẫn muốn tiếp tục thì chúng tôi sẽ phân tích chung về mặt tình cảm của bạn một cách tổng quan và diễn biến trong những tháng tới.";
    }

    if (breakupData?.isActive) {
      return `Sau khi chia tay với ${breakupData.partnerName}, các vì sao cho thấy đây là thời kỳ bạn cần tập trung vào việc tái tạo năng lượng cá nhân. Hãy kiên nhẫn, vì tình yêu mới sẽ đến khi bạn đã sẵn sàng.`;
    }

    if (partner) {
      const currentUserZodiac = userZodiac || getZodiacSign(user?.birthDate || '');
      const partnerZodiac = getZodiacSign(partner.birthDate);
      const compatibility = currentUserZodiac?.element === partnerZodiac?.element ? "rất hợp" :
                             (currentUserZodiac?.element === 'Hỏa' && partnerZodiac?.element === 'Khí') ||
                             (currentUserZodiac?.element === 'Thổ' && partnerZodiac?.element === 'Thủy') ||
                             (currentUserZodiac?.element === 'Khí' && partnerZodiac?.element === 'Hỏa') ||
                             (currentUserZodiac?.element === 'Thủy' && partnerZodiac?.element === 'Thổ') ? "tương hợp" : "cần nỗ lực";

      return `Mối quan hệ giữa bạn (${currentUserZodiac?.name || 'Chưa xác định'}) và ${partner.name} (${partnerZodiac?.name || 'Chưa xác định'}) có độ tương hợp ${compatibility}. Nguyên tố của bạn (${currentUserZodiac?.element || 'Chưa xác định'}) và của ${partner.name} (${partnerZodiac?.element || 'Chưa xác định'}) tạo nên một sự kết hợp độc đáo. Hãy tận dụng điểm mạnh này để xây dựng mối quan hệ bền vững.`;
    }

    return "";
  };

  const handleLoveAnalysis = () => {
    if (!partner && !breakupData?.isActive && !proceedWithGeneralLove) {
      setShowLoveConfirmDialog(true);
      return;
    }

    analyzeChart();
  };

  const confirmGeneralLoveAnalysis = () => {
    setProceedWithGeneralLove(true);
    setShowLoveConfirmDialog(false);
    analyzeChart();
  };

  const generateGeneralLoveAnalysis = () => {
    if (!partner && !breakupData?.isActive && proceedWithGeneralLove) {
      const currentZodiac = userZodiac || getZodiacSign(user?.birthDate || '');

      return `**PHÂN TÍCH TÌNH DUYÊN TỔNG QUAN**
  
**Tính cách tình cảm theo cung ${currentZodiac?.name || 'Chưa xác định'}:**
${currentZodiac?.name === 'Bạch Dương' || currentZodiac?.name === 'Sư Tử' || currentZodiac?.name === 'Nhân Mã' ?
        'Bạn là người đam mê, yêu mạnh mẽ và không ngại bày tỏ cảm xúc. Trong tình yêu, bạn luôn muốn chinh phục và bảo vệ người mình yêu.' :
        currentZodiac?.name === 'Kim Ngưu' || currentZodiac?.name === 'Xử Nữ' || currentZodiac?.name === 'Ma Kết' ?
        'Bạn yêu một cách chậm rãi nhưng sâu sắc. Tình yêu với bạn cần thời gian để nảy nở, nhưng một khi đã yêu, bạn sẽ trở thành người đối tác đáng tin cậy nhất.' :
        currentZodiac?.name === 'Song Tử' || currentZodiac?.name === 'Thiên Bình' || currentZodiac?.name === 'Bảo Bình' ?
        'Trí tuệ và sự giao tiếp là chìa khóa trong tình yêu của bạn. Bạn cần một người bạn đời có thể trò chuyện và cùng khám phá thế giới.' :
        'Bạn yêu bằng cả trái tim và có khả năng cảm nhận rất sâu sắc cảm xúc của người khác. Trực giác mạnh mẽ giúp bạn hiểu được những điều chưa được nói ra.'
      }

  **Diễn biến tình duyên trong những tháng tới:**

**Tháng ${new Date().getMonth() + 2}:** Có thể gặp được người đặc biệt qua bạn bè hoặc hoạt động xã hội. Hãy mở lòng và tự tin thể hiện bản thân.

**Tháng ${new Date().getMonth() + 3}:** Thời kỳ phát triển tình cảm thuận lợi. Nếu đã có người ấy trong lòng, đây là lúc để bày tỏ.

**Tháng ${new Date().getMonth() + 4}:** Cần kiên nhẫn và không nên vội vàng trong các quyết định tình cảm quan trọng.

**Lời khuyên cho tình yêu:**
• Tập trung phát triển bản thân để thu hút đúng người
• Tham gia nhiều hoạt động để mở rộng mối quan hệ
• Tin tưởng vào trực giác khi gặp được người phù hợp
• Đừng quá khắt khe với tiêu chuẩn, hãy cho tình yêu cơ hội

  Các vì sao cho thấy tình yêu sẽ đến với bạn khi bạn ít mong đợi nhất!`;
    }

    return generateLoveAnalysis();
  };

  const analyzeChart = async () => {
    if (mode === 'love' && !partner && !breakupData?.isActive && !proceedWithGeneralLove) {
      handleLoveAnalysis();
      return;
    }

    if (!birthPlace.trim()) {
      toast.error('Vui lòng nhập nơi sinh của bạn');
      return;
    }

    setIsAnalyzing(true);
    setStarMapGenerated(false);
    setAnalysis('');

    const zodiac = getZodiacSign(user?.birthDate || '');
    setUserZodiac(zodiac);

    if (mode === 'staranalysis') {
      setShowStarMap(true);

      const waitForStarMap = new Promise<void>((resolve) => {
        const checkInterval = setInterval(() => {
          if (starMapGenerated) {
            clearInterval(checkInterval);
            resolve();
          }
        }, 100);

        setTimeout(() => {
          clearInterval(checkInterval);
          resolve();
        }, 10000);
      });

      try {
        await waitForStarMap;

        await new Promise(resolve => setTimeout(resolve, 2000));

        const stars = generateStarAnalysis(user?.birthDate || '', user?.birthTime || '', birthPlace);

        const starAnalysisText = `**PHÂN TÍCH BẢN ĐỒ SAO CHI TIẾT**
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

**Thông tin cá nhân:** ${user?.name}
**Thời gian sinh:** ${user?.birthDate} lúc ${user?.birthTime}
**Nơi sinh:** ${birthPlace}
**Cung chủ đạo:** ${zodiac.name} (Nguyên tố ${zodiac.element})

 **VỊ TRÍ CÁC VÌ SAO QUYỀN LỰC:**

${stars.map((star, index) => `**${star.name.toUpperCase()}**
Vị trí: ${star.position} trong hệ tọa độ thiên văn
Ảnh hưởng chính: ${star.influence}
Phân tích chuyên sâu:
${star.name === 'Sao Bắc Đẩu' ?
  '• Định hướng cuộc đời: Bạn sinh ra với năng lực lãnh đạo tự nhiên\\\\n• Khả năng chỉ đạo và dẫn dắt người khác rất mạnh\\\\n• Luôn tìm được hướng đi đúng đắn trong mọi tình huống' :
  star.name === 'Sao Kim' ?
  '• Nghệ thuật & tình yêu: Có khiếu thẩm mỹ và cảm nhận cái đẹp\\\\n• Từ tính cá nhân mạnh, dễ thu hút người khác\\\\n• Tình yêu đóng vai trò động lực quan trọng trong cuộc sống' :
  star.name === 'Sao Hỏa' ?
  '• Năng lượng & hành động: Sức sống dồi dào, thích thử thách\\\\n• Có khả năng hành động nhanh chóng và quyết đoán\\\\n• Cần học cách kiểm soát cơn giận để tránh xung đột' :
  star.name === 'Sao Mộc' ?
  '• Vận may & phát triển: Người có số tốt trong cuộc sống\\\\n• Dễ gặp được cơ hội và quý nhân phù trợ\\\\n• Có tiềm năng kinh doanh và mở rộng sự nghiệp' :
  '• Kỷ luật & trách nhiệm: Con người có nguyên tắc và kỷ luật cao\\\\n• Đáng tin cậy và có trách nhiệm với công việc\\\\n• Đôi khi quá khắt khe với bản thân, cần học cách thư giãn'
}`).join('\\\\n\\\\n')}

**TỔNG HỢP NĂNG LƯỢNG VŨ TRỤ:**

Dựa trên bản đồ sao 3D được tạo ra từ thông tin sinh của bạn, các vì sao đã sắp xếp tạo nên một tổ hợp năng lượng ${zodiac.element === 'Hỏa' ? 'năng động, nhiệt huyết và đầy sức sống' : zodiac.element === 'Thổ' ? 'ổn định, thực tế và đáng tin cậy' : zodiac.element === 'Khí' ? 'linh hoạt, thông minh và có khả năng giao tiếp tốt' : 'nhạy cảm, trực quan và có khả năng cảm thụ sâu sắc'}.
  
Sự kết hợp độc đáo này ban cho bạn những đặc điểm nổi bật: ${zodiac.traits.toLowerCase()}, tạo nên một cá tính riêng biệt và thu hút.

**DỰ ĐOÁN THEO BẢN ĐỒ SAO:**

**Thời kỳ vàng trong năm:**
• Tháng ${Math.floor(Math.random() * 6) + 1}: Giai đoạn khởi đầu thuận lợi cho dự án mới
• Tháng ${Math.floor(Math.random() * 6) + 7}: Đỉnh cao của vận may và thành công
• Đặc biệt chú ý đến các ngày rằm và ngày mới của tháng

**Lĩnh vực phát triển mạnh:**
${zodiac.element === 'Hỏa' ?
  '• Lãnh đạo, quản lý và khởi nghiệp\\\\n• Thể thao, nghệ thuật biểu diễn\\\\n• Các ngành cần sự năng động và quyết đoán' :
  zodiac.element === 'Thổ' ?
  '• Bất động sản, tài chính, ngân hàng\\\\n• Nông nghiệp, xây dựng, kiến trúc\\\\n• Các ngành cần sự kiên nhẫn và tỉ mỉ' :
  zodiac.element === 'Khí' ?
  '• Truyền thông, báo chí, xuất bản\\\\n• Giáo dục, đào tạo, tư vấn\\\\n• Công nghệ thông tin và truyền thông' :
  '• Nghệ thuật, âm nhạc, hội họa\\\\n• Y tế, chăm sóc sức khỏe\\\\n• Tâm linh, tâm lý học và tư vấn'
}

**Thách thức cần vượt qua:**
${zodiac.element === 'Hỏa' ?
  '• Kiểm soát sự nóng vội và thiếu kiên nhẫn\\\\n• Học cách lắng nghe ý kiến của người khác\\\\n• Cân bằng giữa công việc và cuộc sống cá nhân' :
  zodiac.element === 'Thổ' ?
  '• Tránh quá cứng nhắc và bảo thủ\\\\n• Mở lòng với những thay đổi tích cực\\\\n• Đừng quá lo lắng về tương lai' :
  zodiac.element === 'Khí' ?
  '• Tập trung hoàn thành công việc đã bắt đầu\\\\n• Tránh lan man và thiếu quyết đoán\\\\n• Học cách kiên trì với mục tiêu dài hạn' :
  '• Không để cảm xúc chi phối quá nhiều quyết định\\\\n• Tăng cường sự tự tin và quyết đoán\\\\n• Bảo vệ năng lượng cá nhân khỏi tác động tiêu cực'
}

**THÔNG ĐIỆP TỪ VŨ TRỤ:**

Các vì sao đã xếp đặt một cách hoàn hảo khi bạn chào đời, tạo nên một bản đồ năng lượng độc nhất vô nhị. Hãy tin tưởng vào những món quà thiên bẩm mà vũ trụ đã ban tặng và sử dụng chúng để tạo ra những điều kỳ diệu trong cuộc sống.

Mỗi ngày là một cơ hội để bạn kết nối với năng lượng vũ trụ và phát huy tối đa tiềm năng bản thân. Hãy luôn nhớ rằng, bạn là người viết nên câu chuyện của chính mình dưới ánh sáng dẫn đường của các vì sao!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*"Khi hiểu được vị trí của mình trong vũ trụ, ta sẽ tìm thấy sức mạnh vô tận từ bên trong."*
`;
        setAnalysis(starAnalysisText);
        toast.success(' Đã hoàn tất phân tích bản đồ sao chính xác!');
      } catch (error) {
        console.error('Error in star analysis:', error);
        toast.error('Có lỗi xảy ra khi tạo bản đồ sao');
      }
    } else if (mode === 'relations') {
      setShowRelationChart(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Đã tải xong sơ đồ quan hệ cung!');
    } else if (mode === 'love') {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const loveAnalysisText = `**Phân Tích Tình Duyên Chi Tiết - ${user?.name}**

**Cung Hoàng Đạo Tình Yêu:** ${zodiac.name} (${zodiac.date})
**Nguyên tố tình cảm:** ${zodiac.element}
**Vị trí các vì sao:** ${birthPlace}
**Thời điểm sinh:** ${user?.birthTime}

**PHÂN TÍCH TÌNH DUYÊN CHUYÊN SÂU:**

${generateGeneralLoveAnalysis()}

**THÔNG ĐIỆP TỪ VŨ TRỤ:**

Các vì sao nhắn gửi rằng tình yêu là hành trình, không phải đích đến. Hãy tận hưởng từng khoảnh khắc và tin tưởng rằng người phù hợp sẽ xuất hiện đúng thời điểm.

*"Khi bạn yêu thương chính mình, cả vũ trụ sẽ âm thầm sắp đặt để đưa tình yêu đến với bạn."*`;

      setAnalysis(loveAnalysisText);
      toast.success(' Đã hoàn tất phân tích tình duyên!');
    } else {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const careerStrength = zodiac.element === 'Hỏa' ? 'lãnh đạo và sáng tạo' :
                            zodiac.element === 'Thổ' ? 'xây dựng và ổn định' :
                            zodiac.element === 'Khí' ? 'giao tiếp và học hỏi' :
                            'cảm nhận và thấu hiểu';

      const healthFocus = zodiac.element === 'Hỏa' ? 'hệ tim mạch và năng lượng' :
                       zodiac.element === 'Thổ' ? 'hệ tiêu hóa và xương khớp' :
                       zodiac.element === 'Khí' ? 'hệ hô hấp và thần kinh' :
                       'hệ tuần hoàn và cảm xúc';

      const analysisText = `**Biểu đồ chiêm tinh của ${user?.name}**

**Cung Hoàng Đạo:** ${zodiac.name} (${zodiac.date})
**Nguyên tố:** ${zodiac.element}
**Đặc điểm chính:** ${zodiac.traits}

Vị trí các hành tinh khi bạn sinh cho thấy bạn là người có khả năng đặc biệt trong việc ${careerStrength}.

**Sự nghiệp:** Trong năm này, các vì sao báo hiệu rằng sự nghiệp của bạn sẽ có những bước tiến tích cực. Đặc biệt vào các tháng 6, 9 và 12, bạn sẽ gặp nhiều cơ hội phát triển.

**Tình yêu:** ${generateLoveAnalysis()}

**Sức khỏe:** Cần chú ý đến ${healthFocus}. Hãy duy trì lối sống lành mạnh và cân bằng.

**Lời khuyên từ các vì sao:** Hãy tin tưởng vào trực giác của mình và không ngại thử những điều mới. Vũ trụ đang mỉm cười với bạn!`;

      setAnalysis(analysisText);
      toast.success(' Đã hoàn tất phân tích biểu đồ chiêm tinh!');
    }

    setIsAnalyzing(false);
  };

  const resetAnalysis = () => {
    setAnalysis('');
    setUserZodiac(null);
    setBirthPlace('');
    setMode('general');
    setShowRelationChart(false);
    setShowStarMap(false);
    setStarMapGenerated(false);
  };

  const handleStarMapGenerated = () => {
    console.log('Star map generated callback triggered');
    setStarMapGenerated(true);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-950 relative" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <AstrologyScene3D isActive={isAnalyzing || showRelationChart || showStarMap} mode={mode === 'love' ? 'love' : 'general'} />

      <Sidebar />

      <main className="flex-1 overflow-auto relative z-10">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-full flex items-center justify-center shadow-lg">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Chiêm Tinh Học 3D</h1>
              <p className="text-gray-400">Khám phá vận mệnh qua vị trí các vì sao với công nghệ 3D</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-1 border border-gray-700/30">
                <button
                  onClick={() => setMode('general')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'general' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Tổng quan
                </button>
                <button
                  onClick={() => setMode('love')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'love' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Heart className="w-4 h-4 inline mr-2" />
                  Tình duyên
                </button>
                <button
                  onClick={() => setMode('staranalysis')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'staranalysis' ? 'bg-gradient-to-r from-purple-600 to-blue-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Star className="w-4 h-4 inline mr-2" />
                  Phân tích sao
                </button>
                <button
                  onClick={() => setMode('relations')}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'relations' ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Network className="w-4 h-4 inline mr-2" />
                  Quan hệ cung
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Thông tin sinh của bạn
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-600/20">
                    <p className="text-sm text-gray-400 mb-1">Ngày sinh</p>
                    <p className="text-white font-medium">{user?.birthDate || 'Chưa có thông tin'}</p>
                  </div>
                  <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-600/20">
                    <p className="text-sm text-gray-400 mb-1">Giờ sinh</p>
                    <p className="text-white font-medium">{user?.birthTime || 'Chưa có thông tin'}</p>
                  </div>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nơi sinh của bạn (Thành phố, Quốc gia)"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50 transition-all"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <Button
                onClick={analyzeChart}
                disabled={isAnalyzing}
                className={`${mode === 'staranalysis' ? 'bg-gradient-to-r from-purple-600 to-blue-700 hover:from-purple-700 hover:to-blue-800' : mode === 'relations' ? 'bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800' : 'bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800'}`}
              >
                {isAnalyzing ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {mode === 'staranalysis' ? 'Đang tạo bản đồ sao...' : mode === 'relations' ? 'Đang tính toán quan hệ cung...' : 'Đang phân tích biểu đồ...'}
                  </>
                ) : (
                  <>
                    {mode === 'love' ? <Heart className="w-5 h-5 mr-2" /> : mode === 'staranalysis' ? <Star className="w-5 h-5 mr-2" /> : mode === 'relations' ? <Network className="w-5 h-5 mr-2" /> : <Eye className="w-5 h-5 mr-2" />}
                    {mode === 'love' ? 'Phân tích tình duyên' : mode === 'staranalysis' ? 'Phân tích bản đồ sao' : mode === 'relations' ? 'Xem sơ đồ quan hệ cung' : 'Xem biểu đồ chiêm tinh'}
                  </>
                )}
              </Button>
            </motion.div>

            <AnimatePresence>
              {showStarMap && user?.birthDate && user?.birthTime && birthPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <StarMap3D
                    birthDate={user.birthDate}
                    birthTime={user.birthTime}
                    birthPlace={birthPlace}
                    onMapGenerated={handleStarMapGenerated}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showRelationChart && user?.birthDate && user?.birthTime && birthPlace && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-8"
                >
                  <HouseChart3D
                    birthDate={user.birthDate}
                    birthTime={user.birthTime}
                    birthPlace={birthPlace}
                    userZodiac={userZodiac}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {analysis && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-lg">
                    <div className="text-center mb-6">
                      {mode === 'love' ? <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" /> : mode === 'staranalysis' ? <Star className="w-12 h-12 mx-auto mb-4 text-purple-400" /> : <Star className="w-12 h-12 mx-auto mb-4 text-yellow-400" />}
                      <h3 className="text-2xl font-bold text-white">
                        {mode === 'love' ? 'Phân Tích Tình Duyên' : mode === 'staranalysis' ? 'Phân Tích Bản Đồ Sao' : 'Biểu Đồ Chiêm Tinh'}
                      </h3>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <FormattedContent content={analysis} className="text-gray-300 leading-relaxed" />
                    </div>

                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={resetAnalysis}
                        variant="secondary"
                        className="whitespace-nowrap"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        Xem lại
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {(showRelationChart || showStarMap) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mt-8"
              >
                <Button
                  onClick={resetAnalysis}
                  variant="secondary"
                  className="whitespace-nowrap"
                >
                  <Star className="w-4 h-4 mr-2" />
                 Khám phá thêm
                </Button>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-12"
            >
              <h2 className="text-2xl font-bold text-white text-center mb-8">12 Cung Hoàng Đạo</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {zodiacSigns.map((sign, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all"
                  >
                    <h3 className="text-lg font-bold text-white mb-1">{sign.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{sign.date}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-1 rounded-full">
                        {sign.element}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <AnimatePresence>
        {showLoveConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowLoveConfirmDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-8 max-w-md mx-4 border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" />
                <h3 className="text-xl font-bold text-white mb-4">Thông báo</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Bạn hiện không có người phụ thuộc về mặt tình cảm. Nếu bạn vẫn muốn tiếp tục thì chúng tôi sẽ phân tích chung về mặt tình cảm của bạn một cách tổng quan và diễn biến trong những tháng tới.
                </p>
                <div className="flex gap-4">
                  <Button
                    onClick={() => setShowLoveConfirmDialog(false)}
                    variant="secondary"
                    className="flex-1 whitespace-nowrap"
                  >
                    Hủy bỏ
                  </Button>
                  <Button
                    onClick={confirmGeneralLoveAnalysis}
                    className="flex-1 bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 whitespace-nowrap"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AstrologyPage;
