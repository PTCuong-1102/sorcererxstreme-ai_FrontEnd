
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';

export default function CompleteProfilePage() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, completeProfile, isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    } else if (user?.isProfileComplete) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !birthDate || !birthTime) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      completeProfile(name, birthDate, birthTime);
      toast.success('Hồ sơ đã được hoàn tất!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-950" style={{ fontFamily: 'Be Vietnam Pro, sans-serif' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-gray-800/60 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/30 shadow-2xl">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg"
            >
              <User className="w-8 h-8 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Hoàn tất hồ sơ
            </h1>
            <p className="text-gray-400">Để có trải nghiệm tốt nhất, vui lòng cung cấp thông tin cá nhân</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Họ và tên"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-gray-900/50 border border-gray-600/50 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all duration-200"
                disabled={isLoading}
              />
            </div>

            <div className="bg-amber-600/20 border border-amber-500/30 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-sm text-amber-300">
                💡 <strong>Lưu ý:</strong> Thông tin này sẽ được sử dụng để tạo ra các dự đoán chính xác nhất cho bạn.
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Đang lưu...' : 'Hoàn tất'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
