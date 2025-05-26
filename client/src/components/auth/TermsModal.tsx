import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Điều Khoản và Điều Kiện
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <h3 className="font-semibold text-lg">1. Điều Khoản Chung</h3>
            <p>
              Bằng việc đăng ký và sử dụng nền tảng AithEduConnect, bạn đồng ý tuân thủ các điều khoản và điều kiện sau đây.
            </p>

            <h3 className="font-semibold text-lg">2. Tài Khoản Người Dùng</h3>
            <p>
              - Bạn phải cung cấp thông tin chính xác và đầy đủ khi đăng ký tài khoản.<br />
              - Bạn chịu trách nhiệm bảo mật thông tin đăng nhập của mình.<br />
              - Mỗi người chỉ được đăng ký một tài khoản duy nhất.
            </p>

            <h3 className="font-semibold text-lg">3. Quyền và Nghĩa Vụ</h3>
            <p>
              - Tôn trọng quyền sở hữu trí tuệ của nội dung trên nền tảng.<br />
              - Không được sử dụng nền tảng cho mục đích bất hợp pháp.<br />
              - Tuân thủ các quy định về bảo mật và an toàn thông tin.
            </p>

            <h3 className="font-semibold text-lg">4. Nội Dung Học Tập</h3>
            <p>
              - Nội dung học tập được cung cấp bởi các giáo viên có chuyên môn.<br />
              - Người dùng không được phép sao chép, phân phối lại nội dung học tập.<br />
              - Nền tảng có quyền cập nhật hoặc thay đổi nội dung khi cần thiết.
            </p>

            <h3 className="font-semibold text-lg">5. Bảo Mật Thông Tin</h3>
            <p>
              - Chúng tôi cam kết bảo vệ thông tin cá nhân của người dùng.<br />
              - Thông tin cá nhân chỉ được sử dụng cho mục đích cung cấp dịch vụ.<br />
              - Không chia sẻ thông tin cá nhân cho bên thứ ba khi chưa được sự đồng ý.
            </p>

            <h3 className="font-semibold text-lg">6. Giới Hạn Trách Nhiệm</h3>
            <p>
              - Nền tảng không chịu trách nhiệm về nội dung do người dùng đăng tải.<br />
              - Không chịu trách nhiệm về việc mất mát dữ liệu do lỗi kỹ thuật.<br />
              - Có quyền tạm ngưng hoặc chấm dứt tài khoản vi phạm điều khoản.
            </p>

            <h3 className="font-semibold text-lg">7. Thay Đổi Điều Khoản</h3>
            <p>
              - Chúng tôi có quyền thay đổi điều khoản và điều kiện khi cần thiết.<br />
              - Người dùng sẽ được thông báo về các thay đổi quan trọng.<br />
              - Việc tiếp tục sử dụng nền tảng sau khi thay đổi đồng nghĩa với việc chấp nhận điều khoản mới.
            </p>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default TermsModal; 