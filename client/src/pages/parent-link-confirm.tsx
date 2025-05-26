import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContext';
import { confirmParentLink } from '@/lib/linkParent';

export default function ParentLinkConfirm() {
  const { user } = useAuth();
  const [location] = useLocation();
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  );
  const [message, setMessage] = useState('');

  // Parse token from query string
  const token = (() => {
    const params = new URLSearchParams(location.split('?')[1]);
    return params.get('token');
  })();

  useEffect(() => {
    if (user && token) {
      setStatus('loading');
      confirmParentLink(token, user.id)
        .then(() => {
          setStatus('success');
          setMessage('Liên kết phụ huynh-học sinh đã được xác nhận thành công!');
        })
        .catch(() => {
          setStatus('error');
          setMessage('Có lỗi xảy ra hoặc liên kết đã được xác nhận trước đó.');
        });
    }
  }, [user, token]);

  if (!user) {
    return <div>Vui lòng đăng nhập để xác nhận liên kết phụ huynh-học sinh.</div>;
  }

  if (status === 'loading') {
    return <div>Đang xác nhận liên kết...</div>;
  }

  return (
    <div className="p-8 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Xác nhận liên kết phụ huynh-học sinh</h1>
      <div>{message}</div>
    </div>
  );
} 