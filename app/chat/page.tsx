
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthStore, useChatStore, ChatMessage } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';
import { FormattedContent } from '@/components/ui/FormattedContent';

// Component để render nội dung AI với formatting đẹp
const FormattedAIResponse = ({ content }: { content: string }) => {
  return <FormattedContent content={content} />;
};

export default function ChatPage() {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, isAuthenticated } = useAuthStore();
  const { messages, isLoading, addMessage, setLoading } = useChatStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // Thêm tin nhắn người dùng
    addMessage({
      content: userMessage,
      role: 'user'
    });

    setLoading(true);

    try {
      // Mô phỏng gọi AI API
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Tạo phản hồi mẫu từ AI với formatting đẹp hơn
      const aiResponses = [
        `**🔮 Thông điệp từ vũ trụ về "${userMessage}"**
        
Tôi cảm nhận được năng lượng mạnh mẽ từ câu hỏi của bạn. Đây là những gì các vì sao muốn truyền tải:
        
**✨ Phân tích chi tiết:**
        
🌟 **Tình hình hiện tại:** Bạn đang đứng tại một ngã ba quan trọng trong cuộc đời. Những gì bạn đang trải qua không phải là ngẫu nhiên.
        
💫 **Cơ hội phát triển:**
• Hãy tin tưởng vào trực giác bản thân
• Đừng để sợ hãi ngăn cản bạn tiến lên
• Thời điểm này rất thuận lợi để bắt đầu điều gì đó mới
        
**🎯 Lời khuyên từ các vì sao:**
        
Vũ trụ đang sắp xếp những điều tốt đẹp cho bạn. Hãy kiên nhẫn và giữ tâm thế tích cực. Câu trả lời bạn tìm kiếm sẽ đến vào đúng thời điểm.`,
        
        `**💖 Khám phá năng lượng xung quanh "${userMessage}"**
        
Tôi nhìn thấy những luồng năng lượng thú vị đang bao quanh chủ đề này:
        
**🌈 Góc nhìn tâm linh:**
        
🔥 **Nguyên tố chi phối:** Hỏa - mang đến sự năng động và đam mê
🌊 **Cảm xúc hiện tại:** Như dòng nước chảy, đôi khi êm đềm, đôi khi sóng gió
        
**💡 Những điều cần lưu ý:**
        
• Không vội vàng đưa ra quyết định quan trọng
• Lắng nghe tiếng nói bên trong nhiều hơn
• Tìm kiếm sự cân bằng trong mọi việc
        
**✨ Thông điệp cuối:**
        
Hãy nhớ rằng mọi thử thách đều là cơ hội để bạn trưởng thành. Vũ trụ tin tưởng vào khả năng vượt qua mọi khó khăn của bạn.`,

        `**🌟 Dự đoán và hướng dẫn về "${userMessage}"**
        
Các vì sao đã sắp xếp để tôi nhận được câu hỏi này từ bạn vào đúng thời điểm:
        
**📊 Phân tích tổng quan:**
        
🎭 **Quá khứ:** Những trải nghiệm trước đây đã tạo nền tảng vững chắc
🎪 **Hiện tại:** Giai đoạn chuyển tiếp với nhiều cơ hội
🎨 **Tương lai:** Ánh sáng hy vọng đang dần hiện ra
        
**🏆 Điểm mạnh của bạn:**
        
• Khả năng thích ứng tuyệt vời
• Trái tim nhân ái và khao khát học hỏi
• Sức mạnh tiềm ẩn chưa được khai phá hết
        
**⚠️ Những điều cần cân nhắc:**
        
• Đừng quá khắt khe với bản thân
• Học cách tin tưởng vào quá trình phát triển
• Tìm kiếm sự hỗ trợ từ những người xung quanh
        
**🎯 Kết luận:**
        
Vũ trụ đang dẫn dắt bạn đến những điều kỳ diệu. Hãy mở lòng đón nhận!`
      ];

      const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

      addMessage({
        content: randomResponse,
        role: 'assistant'
      });

    } catch (error) {
      toast.error('Có lỗi xảy ra khi kết nối với AI');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-950" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <Sidebar />

      <main className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AI Chat Huyền Thuật</h1>
              <p className="text-sm text-gray-400">Trò chuyện với AI về thế giới bí ẩn</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl"
                >
                  <Sparkles className="w-10 h-10 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-4">Chào mừng đến với AI Chat</h2>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Hãy bắt đầu cuộc trò chuyện với AI huyền thuật. Tôi có thể giúp bạn khám phá những bí ẩn của vũ trụ.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Tử vi hôm nay của tôi thế nào?",
                    "Ý nghĩa của giấc mơ tôi vừa có?",
                    "Làm thế nào để tìm được tình yêu?",
                    "Sự nghiệp của tôi sẽ ra sao?"
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(suggestion)}
                      className="px-4 py-2 bg-gray-800/60 backdrop-blur-sm rounded-full text-sm text-gray-300 hover:text-white hover:bg-gray-700/60 transition-all cursor-pointer border border-gray-600/30"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence>
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} user={user} />
                  ))}
                </AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start space-x-4"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-lg">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl px-4 py-3 max-w-xs">
                      <LoadingSpinner size="sm" />
                      <span className="text-sm text-gray-400 ml-2">AI đang suy nghĩ...</span>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="w-full px-4 py-3 bg-gray-800/60 backdrop-blur-sm border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

const MessageBubble = ({ message, user }: { message: ChatMessage; user: any }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start space-x-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
        isUser
          ? 'bg-gradient-to-br from-red-600 to-red-700'
          : 'bg-gradient-to-br from-purple-600 to-purple-700'
      }`}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>
      <div className={`max-w-3xl ${isUser ? 'text-right' : ''}`}>
        <div className={`inline-block px-6 py-4 rounded-2xl ${
          isUser
            ? 'bg-gradient-to-r from-red-600/30 to-red-700/30 border border-red-500/30 text-white'
            : 'bg-gray-800/60 backdrop-blur-xl border border-gray-700/30 text-white'
        }`}>
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <FormattedAIResponse content={message.content} />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {message.timestamp.toLocaleTimeString('vi-VN', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </motion.div>
  );
};
