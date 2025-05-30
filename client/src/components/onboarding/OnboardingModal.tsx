import { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { motion, AnimatePresence } from 'framer-motion';
import LinkParentForm from '@/components/LinkParentForm';

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
  phone?: string; // <-- add this
};
const UNDER_18_GRADES = [
  "Lớp 6", "Lớp 7", "Lớp 8", "Lớp 9", "Lớp 10", "Lớp 11", "Lớp 12"
];

// 1. Add tutor application form state
type TutorApplicationForm = {
  phone: string;
  email: string;
  address: string;
  avatar: File | null;
  education_level: string;
  university: string;
  major: string;
  graduation_year: string;
  experience: string;
  teaching_subjects: string[];
  teaching_levels: string;
  self_intro: string;
  intro_video: string;
  rate: string;
  availability: string;
  id_document: File | null;
  certificate_files: File[];
  student_card: File | null;
  agree_policy: boolean;
};
const EDUCATION_LEVELS = [
  'THPT', 'Cao đẳng', 'Đại học', 'Thạc sĩ', 'Tiến sĩ'
];

// Add explicit types for TutorWizardForm props and function parameters
interface TutorWizardFormProps {
  tutorForm: TutorApplicationForm;
  setTutorForm: React.Dispatch<React.SetStateAction<TutorApplicationForm>>;
  tutorLoading: boolean;
  setTutorLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleTutorSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

function TutorWizardForm({ tutorForm, setTutorForm, tutorLoading, setTutorLoading, handleTutorSubmit }: TutorWizardFormProps) {
  const [step, setStep] = useState<number>(0);
  const steps = [
    'Thông tin cá nhân',
    'Học vấn & Chuyên môn',
    'Kinh nghiệm & Môn dạy',
    'Tài liệu xác minh',
    'Xác nhận & Gửi'
  ];
  // Helper for tag input
  const [subjectInput, setSubjectInput] = useState<string>('');
  const addSubject = () => {
    if (subjectInput.trim() && !tutorForm.teaching_subjects.includes(subjectInput.trim())) {
      setTutorForm((f: TutorApplicationForm) => ({ ...f, teaching_subjects: [...f.teaching_subjects, subjectInput.trim()] }));
      setSubjectInput('');
    }
  };
  const removeSubject = (subj: string) => {
    setTutorForm((f: TutorApplicationForm) => ({ ...f, teaching_subjects: f.teaching_subjects.filter((s: string) => s !== subj) }));
  };
  // Drag-and-drop for files (basic)
  const handleDrop = (field: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    if (field === 'certificate_files') {
      setTutorForm((f: TutorApplicationForm) => ({ ...f, certificate_files: [...f.certificate_files, ...Array.from(files)] }));
    } else {
      setTutorForm((f: TutorApplicationForm) => ({ ...f, [field]: files[0] }));
    }
  };
  // Stepper UI
  return (
    <div>
      <div className="flex items-center mb-4">
        {steps.map((label, idx) => (
          <div key={label} className="flex items-center">
            <div className={`rounded-full w-7 h-7 flex items-center justify-center font-bold text-white text-sm ${step === idx ? 'bg-pink-500' : 'bg-gray-300'}`}>{idx + 1}</div>
            {idx < steps.length - 1 && <div className="w-8 h-1 bg-gray-300 mx-1 rounded" />}
          </div>
        ))}
      </div>
      <div className="mb-4 text-center font-semibold text-pink-600">{steps[step]}</div>
      {/* Step 0: Personal Info */}
      {step === 0 && (
        <div className="space-y-3">
          <Input type="tel" value={tutorForm.phone} onChange={e => setTutorForm(f => ({ ...f, phone: e.target.value }))} placeholder="Số điện thoại *" required />
          <Input type="email" value={tutorForm.email} disabled placeholder="Email của bạn" />
          <Input value={tutorForm.address} onChange={e => setTutorForm(f => ({ ...f, address: e.target.value }))} placeholder="Địa chỉ thường trú *" required />
          <div className="flex flex-col gap-2">
            <label className="block font-medium mb-1">Ảnh đại diện *</label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-2 flex flex-col items-center cursor-pointer" onDrop={e => { e.preventDefault(); handleDrop('avatar', e.dataTransfer.files); }} onDragOver={e => e.preventDefault()}>
              <input type="file" accept="image/*" style={{ display: 'none' }} id="avatar-upload" onChange={e => handleDrop('avatar', e.target.files)} />
              <label htmlFor="avatar-upload" className="cursor-pointer text-blue-600 underline">Chọn hoặc kéo thả ảnh</label>
              {tutorForm.avatar && typeof tutorForm.avatar !== 'string' && (
                <img src={URL.createObjectURL(tutorForm.avatar)} alt="avatar preview" className="h-16 w-16 rounded-full object-cover mt-2" />
              )}
            </div>
          </div>
        </div>
      )}
      {/* Step 1: Education */}
      {step === 1 && (
        <div className="space-y-3">
          <select className="w-full border rounded p-2" value={tutorForm.education_level} onChange={e => setTutorForm(f => ({ ...f, education_level: e.target.value }))} required>
            <option value="">Trình độ học vấn cao nhất *</option>
            {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <Input value={tutorForm.university} onChange={e => setTutorForm(f => ({ ...f, university: e.target.value }))} placeholder="Trường đã/đang theo học *" required />
          <Input value={tutorForm.major} onChange={e => setTutorForm(f => ({ ...f, major: e.target.value }))} placeholder="Chuyên ngành *" required />
          <Input type="number" min="1950" max="2100" value={tutorForm.graduation_year} onChange={e => setTutorForm(f => ({ ...f, graduation_year: e.target.value }))} placeholder="Năm tốt nghiệp (hoặc dự kiến) *" required />
        </div>
      )}
      {/* Step 2: Experience & Subjects */}
      {step === 2 && (
        <div className="space-y-3">
          <textarea className="w-full border rounded p-2 min-h-[80px]" value={tutorForm.experience} onChange={e => setTutorForm(f => ({ ...f, experience: e.target.value }))} minLength={30} placeholder="Kinh nghiệm giảng dạy/làm việc *" required />
          <div>
            <div className="mb-1 font-medium">Môn học/Lĩnh vực đăng ký dạy *</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {tutorForm.teaching_subjects.map(subj => (
                <span key={subj} className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full flex items-center gap-1 text-sm">
                  {subj}
                  <button type="button" className="ml-1 text-pink-500 hover:text-pink-700" onClick={() => removeSubject(subj)}>×</button>
                </span>
              ))}
              <input
                className="border rounded px-2 py-1 text-sm"
                value={subjectInput}
                onChange={e => setSubjectInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSubject(); } }}
                placeholder="Thêm môn..."
                style={{ minWidth: 100 }}
              />
              <Button type="button" size="sm" variant="outline" onClick={addSubject}>Thêm</Button>
            </div>
          </div>
          <Input value={tutorForm.teaching_levels} onChange={e => setTutorForm(f => ({ ...f, teaching_levels: e.target.value }))} placeholder="Cấp độ có thể dạy" />
          <textarea className="w-full border rounded p-2 min-h-[120px]" value={tutorForm.self_intro} onChange={e => setTutorForm(f => ({ ...f, self_intro: e.target.value }))} minLength={150} placeholder="Mô tả bản thân & Phong cách giảng dạy (tối thiểu 150 từ) *" required />
          <Input value={tutorForm.intro_video} onChange={e => setTutorForm(f => ({ ...f, intro_video: e.target.value }))} placeholder="Video giới thiệu (link YouTube/Vimeo)" />
          <Input type="number" min="0" value={tutorForm.rate} onChange={e => setTutorForm(f => ({ ...f, rate: e.target.value }))} placeholder="Giá dạy đề xuất (VNĐ/giờ hoặc Điểm/giờ) *" required />
          <Input value={tutorForm.availability} onChange={e => setTutorForm(f => ({ ...f, availability: e.target.value }))} placeholder="Lịch dạy rảnh *" required />
        </div>
      )}
      {/* Step 3: Documents */}
      {step === 3 && (
        <div className="space-y-3">
          <div className="mb-2">
            <label className="block font-medium mb-1">CMND/CCCD/Hộ chiếu *</label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-2 flex flex-col items-center cursor-pointer" onDrop={e => { e.preventDefault(); handleDrop('id_document', e.dataTransfer.files); }} onDragOver={e => e.preventDefault()}>
              <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} id="id-upload" onChange={e => handleDrop('id_document', e.target.files)} />
              <label htmlFor="id-upload" className="cursor-pointer text-blue-600 underline">Chọn hoặc kéo thả file</label>
              {tutorForm.id_document && typeof tutorForm.id_document !== 'string' && <span className="text-xs text-gray-500 mt-1">{tutorForm.id_document.name}</span>}
            </div>
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Bằng cấp/Chứng chỉ liên quan</label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-2 flex flex-col items-center cursor-pointer" onDrop={e => { e.preventDefault(); handleDrop('certificate_files', e.dataTransfer.files); }} onDragOver={e => e.preventDefault()}>
              <input type="file" accept=".pdf,image/*" multiple style={{ display: 'none' }} id="cert-upload" onChange={e => handleDrop('certificate_files', e.target.files)} />
              <label htmlFor="cert-upload" className="cursor-pointer text-blue-600 underline">Chọn hoặc kéo thả file</label>
              {tutorForm.certificate_files.length > 0 && (
                <ul className="text-xs text-gray-500 mt-1 list-disc list-inside">
                  {tutorForm.certificate_files.map((file, idx) => <li key={idx}>{file.name}</li>)}
                </ul>
              )}
            </div>
          </div>
          <div className="mb-2">
            <label className="block font-medium mb-1">Thẻ sinh viên (nếu là sinh viên)</label>
            <div className="border-dashed border-2 border-gray-300 rounded-lg p-2 flex flex-col items-center cursor-pointer" onDrop={e => { e.preventDefault(); handleDrop('student_card', e.dataTransfer.files); }} onDragOver={e => e.preventDefault()}>
              <input type="file" accept=".pdf,image/*" style={{ display: 'none' }} id="student-upload" onChange={e => handleDrop('student_card', e.target.files)} />
              <label htmlFor="student-upload" className="cursor-pointer text-blue-600 underline">Chọn hoặc kéo thả file</label>
              {tutorForm.student_card && typeof tutorForm.student_card !== 'string' && <span className="text-xs text-gray-500 mt-1">{tutorForm.student_card.name}</span>}
            </div>
          </div>
        </div>
      )}
      {/* Step 4: Review & Submit */}
      {step === 4 && (
        <div className="space-y-3">
          <div className="font-semibold text-gray-700 mb-2">Vui lòng kiểm tra lại thông tin trước khi gửi:</div>
          <ul className="text-sm text-gray-700 space-y-1">
            <li><b>Số điện thoại:</b> {tutorForm.phone}</li>
            <li><b>Email:</b> {tutorForm.email}</li>
            <li><b>Địa chỉ:</b> {tutorForm.address}</li>
            <li><b>Trình độ học vấn:</b> {tutorForm.education_level}</li>
            <li><b>Trường:</b> {tutorForm.university}</li>
            <li><b>Chuyên ngành:</b> {tutorForm.major}</li>
            <li><b>Năm tốt nghiệp:</b> {tutorForm.graduation_year}</li>
            <li><b>Kinh nghiệm:</b> {tutorForm.experience}</li>
            <li><b>Môn dạy:</b> {tutorForm.teaching_subjects.join(', ')}</li>
            <li><b>Cấp độ:</b> {tutorForm.teaching_levels}</li>
            <li><b>Mô tả bản thân:</b> {tutorForm.self_intro.slice(0, 100)}...</li>
            <li><b>Video:</b> {tutorForm.intro_video}</li>
            <li><b>Giá dạy:</b> {tutorForm.rate}</li>
            <li><b>Lịch dạy rảnh:</b> {tutorForm.availability}</li>
            <li><b>CMND/CCCD:</b> {tutorForm.id_document && typeof tutorForm.id_document !== 'string' ? tutorForm.id_document.name : ''}</li>
            <li><b>Bằng cấp/Chứng chỉ:</b> {tutorForm.certificate_files.map(f => f.name).join(', ')}</li>
            <li><b>Thẻ sinh viên:</b> {tutorForm.student_card && typeof tutorForm.student_card !== 'string' ? tutorForm.student_card.name : ''}</li>
          </ul>
          <div className="flex items-center gap-2 mt-4">
            <Checkbox checked={tutorForm.agree_policy} onCheckedChange={v => setTutorForm(f => ({ ...f, agree_policy: !!v }))} required />
            <span className="text-sm">Tôi đã đọc và đồng ý với <a href="/tutor-policy" target="_blank" className="text-blue-600 underline">Bộ quy tắc & Hướng dẫn cho Gia sư</a></span>
          </div>
        </div>
      )}
      {/* Stepper navigation */}
      <div className="flex justify-between mt-4">
        {step > 0 && <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>Quay lại</Button>}
        {step < steps.length - 1
          ? <Button type="button" onClick={() => setStep(step + 1)}>Tiếp tục</Button>
          : <Button type="submit" disabled={tutorLoading || !tutorForm.agree_policy}>{tutorLoading ? 'Đang gửi...' : 'Gửi đăng ký'}</Button>
        }
      </div>
    </div>
  );
}

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
    phone: "", // <-- add this
  });
  const [loading, setLoading] = useState(false);
  const [parentStep, setParentStep] = useState<'form' | 'sent' | 'skipped'>('form');
  const [parentContact, setParentContact] = useState('');
  const [parentLoading, setParentLoading] = useState(false);
  const isUnder18 = UNDER_18_GRADES.includes(form.grade_level);
  const [parentTab, setParentTab] = useState<'parent' | 'child'>('parent');

  // 2. Update step logic
  const totalSteps = 3;
  const progress = step === 0 ? 100 / totalSteps : step === 1 ? 100 * 2 / totalSteps : 100;

  // 3. Add handler for tutor form
  const [tutorStep, setTutorStep] = useState(0);
  const [tutorForm, setTutorForm] = useState<TutorApplicationForm>({
    phone: '',
    email: user?.email || '',
    address: '',
    avatar: null,
    education_level: '',
    university: '',
    major: '',
    graduation_year: '',
    experience: '',
    teaching_subjects: [],
    teaching_levels: '',
    self_intro: '',
    intro_video: '',
    rate: '',
    availability: '',
    id_document: null,
    certificate_files: [],
    student_card: null,
    agree_policy: false,
  });
  const [tutorLoading, setTutorLoading] = useState(false);

  // Add state to track expanded section in step 2
  const [expandedSection, setExpandedSection] = useState<null | 'link' | 'tutor'>('link');

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

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
    if (!user?.id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
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
    if (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu hồ sơ. Vui lòng thử lại.",
        variant: "destructive",
      });
      return; // Do not close modal if error
    }
    onClose();
    if (onProfileUpdated) onProfileUpdated();
  };

  // 3. Add handler for tutor form
  const handleTutorChange = (field: keyof TutorApplicationForm, value: any) => {
    setTutorForm(f => ({ ...f, [field]: value }));
  };

  const handleTutorFileChange = (field: keyof TutorApplicationForm, files: FileList | null) => {
    if (!files) return;
    if (field === 'certificate_files') {
      setTutorForm(f => ({ ...f, certificate_files: Array.from(files) }));
    } else {
      setTutorForm(f => ({ ...f, [field]: files[0] }));
    }
  };

  const handleTutorSubmit = async (e: any) => {
    e.preventDefault();
    setTutorLoading(true);
    // TODO: API integration for tutor application
    setTimeout(() => {
      setTutorLoading(false);
      setStep(3); // Move to final confirmation step
    }, 1200);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
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
              <span className="font-semibold text-gray-500">Kết nối & Đăng ký gia sư</span>
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
                <>
                  <div className="flex flex-col md:flex-row gap-6 items-stretch justify-center min-h-[40vh]">
                    {/* Account Linking Section */}
                    <div className="flex-1 bg-white rounded-lg p-6 shadow border flex flex-col mb-4 md:mb-0" style={{ minWidth: 320, maxWidth: 420 }}>
                      <h3 className="text-xl font-bold text-green-600 mb-2">Liên kết tài khoản</h3>
                      <p className="text-gray-600 text-sm mb-2">Kết nối với phụ huynh hoặc tài khoản con để đồng hành trên nền tảng.</p>
                      <div className="flex gap-2 mb-4 flex-wrap">
                        <Button variant={parentTab === 'parent' ? 'default' : 'outline'} onClick={() => setParentTab('parent')}>Liên kết với phụ huynh</Button>
                        <Button variant={parentTab === 'child' ? 'default' : 'outline'} onClick={() => setParentTab('child')}>Liên kết tài khoản con</Button>
                      </div>
                      {parentStep === 'form' && (
                        <div className="w-full flex flex-col gap-4">
                          {parentTab === 'parent' ? (
                            <>
                              <label className="text-sm font-medium">Email phụ huynh:</label>
                              <Input value={parentContact} onChange={e => setParentContact(e.target.value)} type="text" placeholder="Nhập email phụ huynh" />
                              <Button className="w-fit" disabled={parentLoading || !parentContact} onClick={handleSendLink}>
                                {parentLoading ? 'Đang gửi...' : 'Gửi yêu cầu liên kết'}
                              </Button>
                            </>
                          ) : (
                            <>
                              <label className="text-sm font-medium">Email hoặc số điện thoại của con:</label>
                              <Input value={parentContact} onChange={e => setParentContact(e.target.value)} type="text" placeholder="Nhập email hoặc số điện thoại" />
                              <Button className="w-fit" disabled={parentLoading || !parentContact} onClick={handleSendLink}>
                                {parentLoading ? 'Đang gửi...' : 'Gửi yêu cầu liên kết'}
                              </Button>
                            </>
                          )}
                        </div>
                      )}
                      {parentStep === 'sent' && (
                        <div className="w-full flex flex-col gap-4 items-center">
                          <div className="text-green-600 font-semibold text-lg">Đã gửi lời mời liên kết thành công!</div>
                          <div className="text-gray-500 text-center">Vui lòng chờ xác nhận. Nếu chưa có tài khoản, sẽ nhận được hướng dẫn đăng ký.</div>
                        </div>
                      )}
                      {parentStep === 'skipped' && (
                        <div className="w-full flex flex-col gap-4 items-center">
                          <div className="text-gray-600 font-semibold text-lg">Bạn có thể liên kết tài khoản sau trong phần cài đặt tài khoản.</div>
                        </div>
                      )}
                    </div>
                    {/* Tutor Application Section - Advanced UI */}
                    <div className="flex-1 bg-white rounded-lg p-6 shadow border flex flex-col" style={{ minWidth: 320, maxWidth: 480 }}>
                      <h3 className="text-xl font-bold text-pink-600 mb-2">Đăng ký làm gia sư</h3>
                      <p className="text-gray-600 text-sm mb-4">Trở thành gia sư để chia sẻ kiến thức và nhận thu nhập từ việc dạy học!</p>
                      {/* Multi-step wizard for tutor form */}
                      <TutorWizardForm tutorForm={tutorForm} setTutorForm={setTutorForm} tutorLoading={tutorLoading} setTutorLoading={setTutorLoading} handleTutorSubmit={handleTutorSubmit} />
                    </div>
                  </div>
                  {/* Done button for optional step */}
                  <div className="flex justify-end mt-6">
                    <Button onClick={handleFinishOnboarding} className="px-8 py-2 text-base font-semibold">Hoàn tất</Button>
                  </div>
                </>
              )}
            </div>
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 