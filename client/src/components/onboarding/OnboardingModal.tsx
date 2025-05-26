import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';

const GENDERS = ["Nam", "Nữ", "Khác"];
const GRADE_LEVELS = [
  "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12",
  "Sinh viên năm 1", "Sinh viên năm 2", "Sinh viên năm 3", "Sinh viên năm 4", "Người đi làm"
];
const PROVINCES = [
  "Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Hải Phòng", "Khác"
];
const SUBJECTS = [
  "Toán", "Lý", "Hóa", "Văn", "Anh", "Sinh", "Sử", "Địa", "Tin học", "IELTS", "TOEIC", "Lập trình", "Thiết kế", "Kỹ năng mềm"
];
const FREE_TIME_OPTIONS = ["Buổi sáng", "Buổi chiều", "Buổi tối"];

type OnboardingForm = {
  full_name: string;
  date_of_birth: string;
  gender: string;
  grade_level: string;
  school_name: string;
  province: string;
  subjects: string[];
  other_subject: string;
  free_time_slots: string[];
};

const UNDER_18_GRADES = [
  "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"
];

export default function OnboardingModal({ user, open, onClose, onProfileUpdated }: { user: any, open: boolean, onClose: () => void, onProfileUpdated?: () => void }) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<OnboardingForm>({
    full_name: user?.full_name || user?.fullName || "",
    date_of_birth: user?.date_of_birth || "",
    gender: user?.gender || "",
    grade_level: user?.grade_level || "",
    school_name: user?.school_name || "",
    province: user?.province || "",
    subjects: user?.subjects || [],
    other_subject: "",
    free_time_slots: user?.free_time_slots || [],
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [parentStep, setParentStep] = useState<'form' | 'sent' | 'skipped'>('form');
  const [parentContact, setParentContact] = useState('');
  const [parentLoading, setParentLoading] = useState(false);
  const isUnder18 = UNDER_18_GRADES.includes(form.grade_level);
  const [parentTab, setParentTab] = useState<'parent' | 'child'>('parent');

  // Instead, show the modal if the profile is incomplete on mount only
  useEffect(() => {
    const incomplete = !form.full_name || !form.date_of_birth || !form.grade_level || !form.province || form.subjects.length === 0 || form.free_time_slots.length === 0;
    setShow(incomplete);
    // eslint-disable-next-line
  }, []);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);

  const handleChange = (field: keyof OnboardingForm, value: any) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  const handleCheckboxArray = (field: Extract<keyof OnboardingForm, 'subjects' | 'free_time_slots'>, value: string) => {
    setForm(f => {
      const arr = f[field];
      if (arr.includes(value)) {
        return { ...f, [field]: arr.filter((v: string) => v !== value) };
      } else {
        return { ...f, [field]: [...arr, value] };
      }
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStep(2); // Luôn chuyển sang bước liên kết tài khoản
    return;
  };

  // Luôn có 3 bước
  const totalSteps = 3;
  const progress = step === 0 ? 100 / totalSteps : step === 1 ? 66 : 100;

  // Hàm gửi lời mời liên kết (mock)
  const handleSendLink = async () => {
    setParentLoading(true);
    await new Promise(r => setTimeout(r, 1200)); // mock API
    setParentLoading(false);
    setParentStep('sent');
  };

  // Thêm nút skip ở bước liên kết tài khoản
  const handleSkipLink = () => {
    setParentStep('skipped');
  };

  // Hàm hoàn tất onboarding (submit profile và đóng modal)
  const handleFinishOnboarding = async () => {
    setLoading(true);
    let subjects = form.subjects;
    if (form.other_subject) subjects = [...subjects, form.other_subject];
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: form.full_name,
      date_of_birth: form.date_of_birth,
      gender: form.gender,
      grade_level: form.grade_level,
      school_name: form.school_name,
      province: form.province,
      subjects,
      free_time_slots: form.free_time_slots,
    });
    setLoading(false);
    setShow(false);
    onClose();
    if (onProfileUpdated) onProfileUpdated();
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-xl shadow-lg max-w-3xl w-full p-8 relative mt-8 flex flex-col"
            style={{ maxHeight: '90vh' }}
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            {/* Progress Bar */}
            <div className="w-full h-2 bg-gray-200 rounded mb-4 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-pink-400 to-blue-400 transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            {/* Step Indicator */}
            <div className="flex items-center justify-center mb-6 gap-4">
              <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${step === 0 ? 'bg-pink-500' : 'bg-gray-300'}`}>1</div>
              <span className="font-semibold text-gray-500">Chào mừng</span>
              <div className="w-8 h-1 bg-gray-300 rounded mx-2" />
              <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${step === 1 ? 'bg-blue-500' : 'bg-gray-300'}`}>2</div>
              <span className="font-semibold text-gray-500">Thông tin cá nhân</span>
              <div className="w-8 h-1 bg-gray-300 rounded mx-2" />
              <div className={`rounded-full w-8 h-8 flex items-center justify-center font-bold text-white ${step === 2 ? 'bg-green-500' : 'bg-gray-300'}`}>3</div>
              <span className="font-semibold text-gray-500">Liên kết tài khoản</span>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: '70vh' }}>
              {step === 0 && (
                <div className="text-center flex flex-col items-center justify-center min-h-[40vh]">
                  <h2 className="text-3xl font-bold mb-2 text-pink-500">Chào mừng bạn đến với AithEduConnect!</h2>
                  <p className="mb-6 text-lg text-gray-600">Hãy hoàn thiện hồ sơ để trải nghiệm tốt nhất: tìm kiếm gia sư, gợi ý nội dung phù hợp, nạp điểm...</p>
                  <Button className="w-1/2 max-w-xs" onClick={() => setStep(1)}>Bắt đầu</Button>
                </div>
              )}
              {step === 1 && (
                <form onSubmit={handleSubmit} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="text-2xl font-semibold mb-2 text-blue-500">Hoàn thiện hồ sơ cá nhân</h3>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Họ và tên *</label>
                    <Input value={form.full_name} onChange={e => handleChange('full_name', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Ngày sinh *</label>
                    <Input type="date" value={form.date_of_birth} onChange={e => handleChange('date_of_birth', e.target.value)} required />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Giới tính</label>
                    <select className="w-full border rounded p-2" value={form.gender} onChange={e => handleChange('gender', e.target.value)}>
                      <option value="">Chọn giới tính</option>
                      {GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 font-medium">Cấp học hiện tại *</label>
                    <select className="w-full border rounded p-2" value={form.grade_level} onChange={e => handleChange('grade_level', e.target.value)} required>
                      <option value="">Chọn cấp học</option>
                      {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Trường học</label>
                    <Input value={form.school_name} onChange={e => handleChange('school_name', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Tỉnh/Thành phố *</label>
                    <select className="w-full border rounded p-2" value={form.province} onChange={e => handleChange('province', e.target.value)} required>
                      <option value="">Chọn tỉnh/thành phố</option>
                      {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Môn học quan tâm *</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {SUBJECTS.map(s => (
                        <label key={s} className="flex items-center gap-1">
                          <Checkbox checked={form.subjects.includes(s)} onCheckedChange={() => handleCheckboxArray('subjects', s)} />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                    <Input placeholder="Khác..." value={form.other_subject} onChange={e => handleChange('other_subject', e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block mb-1 font-medium">Thời gian trống để học *</label>
                    <div className="flex gap-4">
                      {FREE_TIME_OPTIONS.map(opt => (
                        <label key={opt} className="flex items-center gap-1">
                          <Checkbox checked={form.free_time_slots.includes(opt)} onCheckedChange={() => handleCheckboxArray('free_time_slots', opt)} />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" className="w-full md:w-1/3" disabled={loading}>{loading ? 'Đang lưu...' : 'Hoàn tất'}</Button>
                  </div>
                </form>
              )}
              {step === 2 && (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-6">
                  <h3 className="text-2xl font-bold text-green-600 mb-2">Liên kết tài khoản</h3>
                  <p className="text-gray-600 text-center max-w-xl mb-2">Chọn một trong hai cách liên kết tài khoản bên dưới để phụ huynh và học sinh đồng hành cùng nhau trên nền tảng. Nếu bạn không muốn liên kết, có thể bỏ qua bước này.</p>
                  <div className="flex gap-4 mb-4">
                    <Button variant={parentTab === 'parent' ? 'default' : 'outline'} onClick={() => setParentTab('parent')}>Liên kết với phụ huynh</Button>
                    <Button variant={parentTab === 'child' ? 'default' : 'outline'} onClick={() => setParentTab('child')}>Liên kết tài khoản con</Button>
                  </div>
                  {parentStep === 'form' && (
                    <div className="w-full max-w-md flex flex-col gap-4">
                      {parentTab === 'parent' ? (
                        <>
                          <Input
                            placeholder="Email hoặc số điện thoại phụ huynh"
                            value={parentContact}
                            onChange={e => setParentContact(e.target.value)}
                            type="text"
                            required
                          />
                          <div className="flex gap-2">
                            <Button className="flex-1" disabled={parentLoading || !parentContact} onClick={handleSendLink}>
                              {parentLoading ? 'Đang gửi...' : 'Gửi lời mời liên kết cho phụ huynh'}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleSkipLink}>Bỏ qua</Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Input
                            placeholder="Email hoặc số điện thoại của con"
                            value={parentContact}
                            onChange={e => setParentContact(e.target.value)}
                            type="text"
                            required
                          />
                          <div className="flex gap-2">
                            <Button className="flex-1" disabled={parentLoading || !parentContact} onClick={handleSendLink}>
                              {parentLoading ? 'Đang gửi...' : 'Gửi lời mời liên kết cho con'}
                            </Button>
                            <Button type="button" variant="outline" onClick={handleSkipLink}>Bỏ qua</Button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  {parentStep === 'sent' && (
                    <div className="w-full max-w-md flex flex-col gap-4 items-center">
                      <div className="text-green-600 font-semibold text-lg">Đã gửi lời mời liên kết thành công!</div>
                      <div className="text-gray-500 text-center">Vui lòng chờ xác nhận. Nếu chưa có tài khoản, sẽ nhận được hướng dẫn đăng ký.</div>
                      <Button className="mt-2" onClick={handleFinishOnboarding} disabled={loading}>{loading ? 'Đang lưu...' : 'Hoàn tất'}</Button>
                    </div>
                  )}
                  {parentStep === 'skipped' && (
                    <div className="w-full max-w-md flex flex-col gap-4 items-center">
                      <div className="text-gray-600 font-semibold text-lg">Bạn có thể liên kết tài khoản sau trong phần cài đặt tài khoản.</div>
                      <Button className="mt-2" onClick={handleFinishOnboarding} disabled={loading}>{loading ? 'Đang lưu...' : 'Hoàn tất'}</Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => { setShow(false); onClose(); }}>&times;</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 