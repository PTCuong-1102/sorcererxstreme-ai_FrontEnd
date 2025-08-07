
'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hash, Calculator, Eye, RefreshCw, Heart } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore, useProfileStore } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { FormattedContent } from '@/components/ui/FormattedContent';

const numerologyMeanings = {
  1: {
    title: 'Người Lãnh Đạo',
    traits: 'Độc lập, sáng tạo, tham vọng, tiên phong',
    description: 'Bạn là người có khả năng lãnh đạo tự nhiên, luôn muốn đi đầu và khởi xướng những điều mới mẻ.',
    career: 'CEO, doanh nhân, nhà phát minh, lãnh đạo',
    lucky: 'Màu đỏ, kim cương, ngày Chủ nhật'
  },
  2: {
    title: 'Người Hòa Giải',
    traits: 'Hợp tác, nhạy cảm, kiên nhẫn, hòa thuận',
    description: 'Bạn là người có khả năng làm việc nhóm tốt, luôn tạo được sự hòa hợp trong mọi mối quan hệ.',
    career: 'Ngoại giao, tư vấn, giáo dục, dịch vụ khách hàng',
    lucky: 'Màu cam, ngọc trai, ngày Thứ hai'
  },
  3: {
    title: 'Người Sáng Tạo',
    traits: 'Nghệ thuật, giao tiếp, lạc quan, sáng tạo',
    description: 'Bạn có tài năng nghệ thuật và khả năng giao tiếp xuất sắc, luôn mang đến niềm vui cho mọi người.',
    career: 'Nghệ sĩ, nhà văn, diễn viên, designer',
    lucky: 'Màu vàng, topaz, ngày Thứ ba'
  },
  4: {
    title: 'Người Xây Dựng',
    traits: 'Thực tế, tổ chức, kỷ luật, đáng tin cậy',
    description: 'Bạn là người thực tế, có khả năng tổ chức tốt và luôn hoàn thành công việc một cách chỉn chu.',
    career: 'Kỹ sư, kiến trúc sư, kế toán, quản lý dự án',
    lucky: 'Màu xanh lá, ngọc lục bảo, ngày Thứ tư'
  },
  5: {
    title: 'Người Tự Do',
    traits: 'Phiêu lưu, linh hoạt, tò mò, năng động',
    description: 'Bạn yêu thích tự do và khám phá, không thích bị ràng buộc bởi những quy tắc cứng nhắc.',
    career: 'Du lịch, báo chí, bán hàng, marketing',
    lucky: 'Màu xanh dương, sapphire, ngày Thứ năm'
  },
  6: {
    title: 'Người Nuôi Dưỡng',
    traits: 'Quan tâm, trách nhiệm, gia đình, chữa lành',
    description: 'Bạn có bản tính quan tâm đến người khác, luôn muốn giúp đỡ và bảo vệ những người mình yêu thương.',
    career: 'Y tế, giáo dục, tư vấn tâm lý, dịch vụ xã hội',
    lucky: 'Màu hồng, ruby, ngày Thứ sáu'
  },
  7: {
    title: 'Người Tìm Kiếm',
    traits: 'Trí tuệ, tâm linh, phân tích, bí ẩn',
    description: 'Bạn là người có tư duy sâu sắc, thích nghiên cứu và tìm hiểu những điều bí ẩn của cuộc sống.',
    career: 'Nghiên cứu, triết học, tâm linh, khoa học',
    lucky: 'Màu tím, amethyst, ngày Thứ bảy'
  },
  8: {
    title: 'Người Thành Đạt',
    traits: 'Quyền lực, vật chất, tổ chức, thành công',
    description: 'Bạn có khả năng quản lý tài chính và kinh doanh xuất sắc, luôn hướng tới thành công vật chất.',
    career: 'Kinh doanh, tài chính, bất động sản, quản lý cấp cao',
    lucky: 'Màu đen, onyx, ngày Thổ'
  },
  9: {
    title: 'Người Nhân Đạo',
    traits: 'Từ bi, rộng lượng, hoàn thiện, phục vụ',
    description: 'Bạn có tấm lòng nhân ái, luôn muốn đóng góp cho xã hội và giúp đỡ những người khó khăn.',
    career: 'Từ thiện, phi lợi nhuận, nghệ thuật, giáo dục',
    lucky: 'Màu trắng, kim cương, tất cả các ngày'
  }
};

export default function NumerologyPage() {
  const [mode, setMode] = useState<'general' | 'love'>('general');
  const [customName, setCustomName] = useState('');
  const [customBirthDate, setCustomBirthDate] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [useProfile, setUseProfile] = useState(true);
  const { user, isAuthenticated } = useAuthStore();
  const { partner, breakupData } = useProfileStore();
  const [showLoveConfirmDialog, setShowLoveConfirmDialog] = useState(false);
  const [proceedWithGeneralLove, setProceedWithGeneralLove] = useState(false);

  const calculateLifePath = (birthDate: string) => {
    const numbers = birthDate.replace(/\D/g, '');
    let sum = 0;
    for (let digit of numbers) {
      sum += parseInt(digit);
    }

    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      const digits = sum.toString().split('');
      sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
    }

    return sum > 9 ? sum : sum;
  };

  const calculateNameNumber = (name: string) => {
    const letterValues: { [key: string]: number } = {
      'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
      'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
      'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
      'À': 1, 'Á': 1, 'Ả': 1, 'Ã': 1, 'Ạ': 1,
      'Ê': 5, 'È': 5, 'É': 5, 'Ẻ': 5, 'Ẽ': 5, 'Ẹ': 5,
      'Ô': 6, 'Ò': 6, 'Ó': 6, 'Ỏ': 6, 'Õ': 6, 'Ọ': 6,
      'Ư': 3, 'Ù': 3, 'Ú': 3, 'Ủ': 3, 'Ũ': 3, 'Ụ': 3,
      'Ì': 9, 'Í': 9, 'Ỉ': 9, 'Ĩ': 9, 'Ị': 9,
    };

    let sum = 0;
    const cleanName = name.toUpperCase().replace(/[^A-ZÀÁẢÃẠÊÈÉẺẼẸÔÒÓỎÕỌƯÙÚỦŨỤÌÍỈĨỊ]/g, '');

    for (let char of cleanName) {
      sum += letterValues[char] || 0;
    }

    while (sum > 9) {
      const digits = sum.toString().split('');
      sum = digits.reduce((acc, digit) => acc + parseInt(digit), 0);
    }

    return sum;
  };

  const generateLoveAnalysis = () => {
    if (!result) return "";

    if (!partner && !breakupData?.isActive) {
      return "Bạn hiện không có người phụ thuộc về mặt tình cảm. Nếu bạn vẫn muốn tiếp tục thì chúng tôi sẽ phân tích chung về mặt tình cảm của bạn một cách tổng quan và diễn biến trong những tháng tới.";
    }

    if (breakupData?.isActive) {
      return `Con số ${result.finalNumber} khuyên bạn hãy kiên nhẫn trong giai đoạn hồi phục sau khi chia tay với ${breakupData.partnerName}. Đây là thời kỳ để bạn tìm lại chính mình và chuẩn bị cho tình yêu mới.`;
    }

    if (partner) {
      const partnerLifePath = calculateLifePath(partner.birthDate);
      const partnerNameNumber = calculateNameNumber(partner.name);
      const compatibility = Math.abs(result.finalNumber - partnerLifePath) <= 2 ? "rất hợp" : "tương hợp";

      return `Mối quan hệ với ${partner.name} có độ tương hợp ${compatibility} theo thần số học. Con số của bạn (${result.finalNumber}) và của ${partner.name} (${partnerLifePath}) tạo nên một sự kết hợp đầy tiềm năng.`;
    }

    return "";
  };

  const handleLoveAnalysis = () => {
    if (!partner && !breakupData?.isActive && !proceedWithGeneralLove) {
      setShowLoveConfirmDialog(true);
      return;
    }

    performCalculation();
  };

  const confirmGeneralLoveAnalysis = () => {
    setProceedWithGeneralLove(true);
    setShowLoveConfirmDialog(false);
    performCalculation();
  };

  const generateGeneralLoveAnalysis = () => {
    if (!partner && !breakupData?.isActive && proceedWithGeneralLove && result) {
      const finalNumber = result.finalNumber;

      return `💫 **PHÂN TÍCH TÌNH DUYÊN TỔNG QUAN THEO CON SỐ ${finalNumber}**\n\n🔢 **Bản chất tình cảm con số ${finalNumber}:**\n${finalNumber === 1 ?
        'Trong tình yêu, bạn là người dẫn dắt và chủ động. Bạn thích được ngưỡng mộ và tôn trọng trong mối quan hệ. Hãy học cách lắng nghe và nhường nhịn nhiều hơn.' :
        finalNumber === 2 ?
          'Bạn là người đối tác lý tưởng với khả năng thấu hiểu và hỗ trợ tuyệt vời. Trong tình yêu, bạn luôn đặt người ấy lên hàng đầu và sẵn sàng hi sinh.' :
          finalNumber === 3 ?
            'Tình yêu với bạn luôn tràn đầy tiếng cười và niềm vui. Bạn biết cách làm cho mối quan hệ trở nên thú vị và không bao giờ nhàm chán.' :
            finalNumber === 4 ?
              'Bạn yêu một cách chắc chắn và bền vững. Cam kết và lòng trung thành là những giá trị cốt lõi trong tình yêu của bạn.' :
              finalNumber === 5 ?
                'Tự do là yếu tố quan trọng nhất trong tình yêu của bạn. Bạn cần một người bạn đời hiểu và tôn trọng nhu cầu khám phá của mình.' :
                finalNumber === 6 ?
                  'Bạn là người yêu bằng cả trái tim và luôn muốn chăm sóc, bảo vệ người mình yêu. Gia đình và tình yêu là ưu tiên hàng đầu.' :
                  finalNumber === 7 ?
                    'Tình yêu với bạn có chiều sâu tâm linh đặc biệt. Bạn tìm kiếm một người bạn đời kết nối được về tâm hồn.' :
                    finalNumber === 8 ?
                      'Trong tình yêu, bạn mong muốn được tôn trọng và ngưỡng mộ. Bạn thể hiện tình cảm qua những hành động cụ thể.' :
                      'Bạn yêu bằng tình yêu vô điều kiện và luôn sẵn sàng tha thứ. Trái tim rộng lượng có thể bao dung mọi khuyết điểm.'
      }\n\n🌈 **Diễn biến tình duyên những tháng tới:**\n\n💝 **Tháng ${new Date().getMonth() + 2}:** Con số ${finalNumber} báo hiệu thời kỳ thuận lợi cho việc gặp gỡ người mới. Hãy tham gia nhiều hoạt động xã hội.\n\n💕 **Tháng ${new Date().getMonth() + 3}:** Giai đoạn phát triển tình cảm mạnh mẽ. Nếu có ai đó đặc biệt, đây là lúc để bày tỏ.\n\n💖 **Tháng ${new Date().getMonth() + 4}:** Cần kiên nhẫn và không vội vàng. Tình yêu đích thực cần thời gian để nở rộ.\n\n🎯 **Con số tương hợp nhất:**\n${finalNumber === 1 ? 'Số 3, 5, 9' : finalNumber === 2 ? 'Số 6, 8, 9' : finalNumber === 3 ? 'Số 1, 5, 7' : finalNumber === 4 ? 'Số 2, 6, 8' : finalNumber === 5 ? 'Số 1, 3, 7' : finalNumber === 6 ? 'Số 2, 4, 9' : finalNumber === 7 ? 'Số 3, 5, 9' : finalNumber === 8 ? 'Số 2, 4, 6' : 'Số 1, 6, 7'} - Tìm hiểu những người có con số đường đời này.\n\n💫 **Lời khuyên từ thần số học:**\n• Tập trung phát triển những phẩm chất tích cực của con số ${finalNumber}\n• Tham gia các hoạt động phù hợp với bản chất số học của mình\n• Tin tưởng vào trực giác khi gặp người có "rung động số học" phù hợp\n• Đừng cưỡng ép, hãy để tình yêu đến một cách tự nhiên\n\n✨ Con số ${finalNumber} của bạn cho thấy tình yêu sẽ xuất hiện khi bạn sống đúng với bản chất của mình!`;
    }

    return generateLoveAnalysis();
  };

  const performCalculation = async () => {
    if (mode === 'love' && !partner && !breakupData?.isActive && !proceedWithGeneralLove) {
      handleLoveAnalysis();
      return;
    }

    const nameToUse = useProfile ? (user?.name || '') : customName;
    const birthDateToUse = useProfile ? (user?.birthDate || '') : customBirthDate;

    if (!nameToUse || !birthDateToUse) {
      toast.error('Vui lòng cung cấp đầy đủ tên và ngày sinh');
      return;
    }

    setIsCalculating(true);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const lifePath = calculateLifePath(birthDateToUse);
    const nameNumber = calculateNameNumber(nameToUse);

    const finalNumber = lifePath <= 9 ? lifePath : lifePath;
    const meaning = numerologyMeanings[finalNumber as keyof typeof numerologyMeanings];

    if (mode === 'love') {
      const loveAnalysisResult = {
        name: nameToUse,
        birthDate: birthDateToUse,
        lifePath,
        nameNumber,
        finalNumber,
        meaning,
        analysis: `💖 Thần Số Học Tình Duyên Chi Tiết - ${nameToUse}\n\n🔢 Con số tình yêu của bạn: ${finalNumber} - ${meaning.title}\n📅 Từ ngày sinh: ${birthDateToUse}\n🎯 Con số đường đời: ${lifePath}\n✨ Con số tên gọi: ${nameNumber}\n\n💕 **PHÂN TÍCH TÌNH DUYÊN CHUYÊN SÂU:**\n\n${generateGeneralLoveAnalysis()}\n\n💫 **THÔNG ĐIỆP CUỐI:**\n\nCon số ${finalNumber} nhắn gửi rằng tình yêu đích thực đến khi bạn sống trọn vẹn với bản chất của mình. Hãy tin tưởng vào sức mạnh của những con số!\n\n✨ *"Con số không bao giờ nói dối về vận mệnh tình duyên. Hãy sẵn sàng đón nhận!"*`
      };

      setResult(loveAnalysisResult);
    } else {
      const analysisResult = {
        name: nameToUse,
        birthDate: birthDateToUse,
        lifePath,
        nameNumber,
        finalNumber,
        meaning,
        analysis: `📊 Phân tích thần số học cho ${nameToUse}\n\n🔢 Con số đường đời: ${lifePath}\n✨ Con số tên gọi: ${nameNumber}\n🎯 Con số chủ đạo: ${finalNumber}\n\n🌟 Tính cách cốt lõi: ${meaning.title}\n${meaning.description}\n\n💎 Đặc điểm nổi bật:\n${meaning.traits.split(', ').map(trait => `• ${trait}`).join('\n')}\n\n💼 Hướng nghề nghiệp phù hợp:\n${meaning.career}\n\n💕 Tình duyên: ${generateLoveAnalysis()}\n\n🍀 Yếu tố may mắn:\n${meaning.lucky}\n\n📈 Khuyến nghị phát triển:\n${finalNumber <= 3 ?
          'Hãy tập trung vào việc phát triển khả năng lãnh đạo và sáng tạo của bản thân. Đừng ngại đi tiên phong trong những ý tưởng mới.' :
          finalNumber <= 6 ?
            'Bạn nên phát huy khả năng hợp tác và xây dựng mối quan hệ. Sự ổn định sẽ đem lại thành công cho bạn.' :
            'Hãy tin tưởng vào trực giác và khả năng tâm linh của mình. Bạn có thể đạt được nhiều điều tuyệt vời thông qua sự hiểu biết sâu sắc.'
        }\n\n🌟 Lời khuyên từ các con số: Hãy sống đúng với bản chất của mình và không ngại thể hiện những phẩm chất đặc biệt mà số phận đã ban cho bạn.`
      };

      setResult(analysisResult);
    }

    setIsCalculating(false);
    toast.success('Đã hoàn tất phân tích thần số học!');
  };

  const resetCalculation = () => {
    setResult(null);
    setCustomName('');
    setCustomBirthDate('');
    setMode('general');
    setProceedWithGeneralLove(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-950" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                <Hash className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Thần Số Học</h1>
              <p className="text-gray-400">Khám phá bản chất qua sức mạnh của con số</p>
            </motion.div>

            {/* Mode Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-1 border border-gray-700/30">
                <button
                  onClick={() => setMode('general')}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'general' ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Eye className="w-4 h-4 inline mr-2" />
                  Tổng quan
                </button>
                <button
                  onClick={() => setMode('love')}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${mode === 'love' ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  <Heart className="w-4 h-4 inline mr-2" />
                  Tình duyên
                </button>
              </div>
            </motion.div>

            {/* Input Mode Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex justify-center mb-8"
            >
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-xl p-1 border border-gray-700/30">
                <button
                  onClick={() => { setUseProfile(true); resetCalculation(); }}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${useProfile ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Dùng hồ sơ của tôi
                </button>
                <button
                  onClick={() => { setUseProfile(false); resetCalculation(); }}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${!useProfile ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                >
                  Nhập thông tin khác
                </button>
              </div>
            </motion.div>

            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl mx-auto mb-8"
            >
              <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30">
                <h3 className="text-lg font-bold text-white mb-4">
                  {useProfile ? 'Thông tin từ hồ sơ' : 'Nhập thông tin mới'}
                </h3>

                {useProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-sm text-gray-400 mb-1">Tên</p>
                      <p className="text-white font-medium">{user?.name || 'Chưa có thông tin'}</p>
                    </div>
                    <div className="bg-gray-900/50 rounded-xl p-4">
                      <p className="text-sm text-gray-400 mb-1">Ngày sinh</p>
                      <p className="text-white font-medium">{user?.birthDate || 'Chưa có thông tin'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Họ và tên</label>
                      <input
                        type="text"
                        placeholder="Nhập họ tên đầy đủ"
                        value={customName}
                        onChange={(e) => setCustomName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2">Ngày sinh</label>
                      <input
                        type="date"
                        value={customBirthDate}
                        onChange={(e) => setCustomBirthDate(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Calculate Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-8"
            >
              <Button
                onClick={handleLoveAnalysis}
                disabled={isCalculating}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-lg font-medium whitespace-nowrap"
              >
                {isCalculating ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Đang tính toán...
                  </>
                ) : (
                  <>
                    {mode === 'love' ? <Heart className="w-5 h-5 mr-2" /> : <Calculator className="w-5 h-5 mr-2" />}
                    {mode === 'love' ? 'Phân tích tình duyên' : 'Phân tích thần số'}
                  </>
                )}
              </Button>
            </motion.div>

            {/* Results Display */}
            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="max-w-4xl mx-auto"
                >
                  {/* Numbers Display */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">{result.lifePath}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Con số đường đời</h3>
                      <p className="text-sm text-gray-400">Từ ngày sinh</p>
                    </div>

                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">{result.nameNumber}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Con số tên gọi</h3>
                      <p className="text-sm text-gray-400">Từ họ tên</p>
                    </div>

                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/30 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-2xl font-bold text-white">{result.finalNumber}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Con số chủ đạo</h3>
                      <p className="text-sm text-gray-400">{result.meaning.title}</p>
                    </div>
                  </div>

                  {/* Analysis Display */}
                  <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-lg">
                    <div className="text-center mb-6">
                      {mode === 'love' ? <Heart className="w-12 h-12 mx-auto mb-4 text-pink-400" /> : <Hash className="w-12 h-12 mx-auto mb-4 text-green-400" />}
                      <h3 className="text-2xl font-bold text-white">
                        {mode === 'love' ? 'Phân Tích Tình Duyên Chi Tiết' : 'Phân Tích Chi Tiết'}
                      </h3>
                    </div>

                    <div className="prose prose-invert max-w-none">
                      <FormattedContent content={result.analysis} className="text-gray-300 leading-relaxed" />
                    </div>

                    <div className="flex justify-center mt-8">
                      <Button
                        onClick={resetCalculation}
                        variant="secondary"
                        className="whitespace-nowrap"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Tính toán mới
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Numbers Reference */}
            {!result && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <h2 className="text-2xl font-bold text-white text-center mb-8">Ý Nghĩa Các Con Số</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(numerologyMeanings).map(([number, meaning]) => (
                    <div
                      key={number}
                      className="bg-gray-800/40 backdrop-blur-sm rounded-xl p-4 border border-gray-700/30 hover:bg-gray-800/60 transition-all"
                    >
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg mr-3">
                          <span className="text-lg font-bold text-white">{number}</span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{meaning.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400 mb-2">{meaning.traits}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
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
}
