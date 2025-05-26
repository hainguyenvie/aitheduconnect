import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { requestParentLink } from '@/lib/linkParent';

export default function LinkParentForm({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setResult(null);
    const studentName = user.fullName || user.email || '';
    try {
      await requestParentLink(email, user.id, studentName);
      setResult('Đã gửi email xác nhận cho phụ huynh!');
      if (onSuccess) onSuccess();
    } catch (err) {
      setResult('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        Email phụ huynh:
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="border p-2 rounded ml-2"
          required
        />
      </label>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
        {loading ? 'Đang gửi...' : 'Gửi yêu cầu liên kết'}
      </button>
      {result && <div className="mt-2 text-green-600">{result}</div>}
    </form>
  );
} 