# AITheduConnect - Online Education Platform

A modern online education platform connecting students with teachers for live interactive learning sessions.

## 🚀 Features

### Core Features

- [x] User Authentication (Student/Teacher roles)
- [x] Real-time video conferencing (WebRTC)
- [x] Basic chat system
- [x] File sharing capabilities
- [x] Payment integration (Stripe)
- [x] Course management system
- [x] Teacher search and filtering
- [x] Booking system

### User Flow

1. [x] User registration/login
2. [x] Teacher search and discovery
3. [x] Course/lesson booking
4. [x] Payment processing
5. [x] Live learning sessions
6. [x] Post-session reviews

### Course Structure

- [x] Course creation and management
- [x] Course syllabus/curriculum
- [ ] Assignment system
- [ ] File upload for assignments
- [ ] Assignment submission and grading
- [ ] Progress tracking

### Communication

- [x] 1:1 chat between student and teacher
- [x] Course group chat
- [x] Real-time notifications
- [ ] File sharing in chat
- [ ] Message history

### Teacher Features

- [x] Teacher profile creation
- [x] Course creation
- [x] Schedule management
- [x] Rating system
- [ ] Teaching materials upload
- [ ] Student progress tracking
- [ ] Double camera support for teaching

### Search & Discovery

- [x] Basic teacher search
- [ ] Advanced filtering:
  - [ ] By subject/category
  - [ ] By price range
  - [ ] By location
  - [ ] By availability
  - [ ] By rating
  - [ ] By student count
  - [ ] By teaching level

### Payment System

- [x] Per-course payment
- [x] Per-session payment
- [ ] Subscription model
- [ ] Refund system
- [ ] Payment history

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **Real-time**: Socket.IO + WebRTC
- **UI**: Tailwind CSS + Radix UI
- **Auth**: Passport.js + Express Session
- **Payment**: Stripe
- **Storage**: Supabase

## 🚧 Todo List

### High Priority

1. [ ] Implement assignment system
2. [ ] Add file upload for assignments
3. [ ] Complete advanced teacher search filters
4. [ ] Add double camera support for teachers
5. [ ] Implement course group chat
6. [ ] Add teaching materials management
7. [ ] Create student progress tracking

### Medium Priority

1. [ ] Add subscription payment model
2. [ ] Implement refund system
3. [ ] Add message history
4. [ ] Create payment history view
5. [ ] Add student analytics dashboard
6. [ ] Implement teacher analytics

### Low Priority

1. [ ] Add gamification elements
2. [ ] Implement referral system
3. [ ] Add certificate generation
4. [ ] Create mobile app version

## 🔧 Setup

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

4. Run development server:

```bash
npm run dev
```

# AITHEduConnect: Tính năng và Yêu cầu Chi tiết

**Tài liệu mô tả chi tiết các tính năng và yêu cầu cho nền tảng kết nối gia sư - học viên AITHEduConnect, được soạn thảo dựa trên yêu cầu ban đầu và phân tích đối tượng người dùng, thị hiếu thị trường Việt Nam.**

*(Lưu ý: Các tên tính năng, tên trường, tên nút... được đề xuất trong tài liệu này có thể được điều chỉnh trong quá trình thiết kế và phát triển để đảm bảo tính nhất quán và thân thiện nhất với người dùng.)*

---



# Phần 1: Hệ thống đăng ký và xác minh

Phân hệ này chịu trách nhiệm quản lý quá trình người dùng tạo tài khoản mới trên nền tảng AITHEduConnect, bao gồm cả học viên, gia sư và phụ huynh, đồng thời đảm bảo tính xác thực và chất lượng của các tài khoản, đặc biệt là tài khoản gia sư.

## 1.1 Đăng ký học viên (Student Registration)

**Mô tả:** Cung cấp một quy trình đăng ký tài khoản đơn giản, nhanh chóng và thân thiện cho học viên mới, thu thập đủ thông tin cần thiết để cá nhân hóa trải nghiệm học tập và kết nối với gia sư phù hợp. Quy trình này cần đặc biệt chú trọng đến nhóm đối tượng học sinh cấp 2, cấp 3, cho phép phụ huynh dễ dàng tham gia quản lý.

**Tính năng chi tiết:**

*   **Phương thức đăng ký linh hoạt:**
    *   **Tên tính năng:** `Đăng ký bằng Email/Số điện thoại`
    *   **Mô tả:** Cho phép người dùng đăng ký bằng địa chỉ email hoặc số điện thoại cá nhân. Hệ thống sẽ gửi mã xác thực (OTP - One-Time Password) đến email hoặc số điện thoại đã đăng ký để hoàn tất quá trình.
    *   **Tên tính năng:** `Đăng ký bằng Tài khoản Mạng xã hội (Social Login)`
    *   **Mô tả:** Hỗ trợ đăng ký nhanh thông qua các tài khoản mạng xã hội phổ biến tại Việt Nam như Google, Facebook, Zalo (nếu có thể tích hợp). Hệ thống sẽ tự động lấy thông tin cơ bản (họ tên, email) từ tài khoản mạng xã hội sau khi người dùng cấp quyền.
*   **Thu thập thông tin cơ bản:**
    *   **Tên trường:** `Họ và tên` (Full Name): Bắt buộc nhập.
    *   **Tên trường:** `Ngày sinh` (Date of Birth): Bắt buộc nhập, dùng để xác định độ tuổi và cấp học phù hợp.
    *   **Tên trường:** `Giới tính` (Gender): Tùy chọn (Nam, Nữ, Khác).
    *   **Tên trường:** `Số điện thoại` (Phone Number): Bắt buộc nếu không đăng ký bằng SĐT, cần xác minh OTP.
    *   **Tên trường:** `Email`: Bắt buộc nếu không đăng ký bằng Email, cần xác minh qua link.
    *   **Tên trường:** `Mật khẩu` (Password): Bắt buộc, yêu cầu độ phức tạp (ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số).
    *   **Tên trường:** `Xác nhận Mật khẩu` (Confirm Password): Bắt buộc, phải khớp với mật khẩu đã nhập.
    *   **Tên trường:** `Cấp học hiện tại` (Current Grade Level): Danh sách chọn (ví dụ: Lớp 6, Lớp 7,... Lớp 12, Sinh viên năm 1,... Người đi làm). Quan trọng cho việc gợi ý gia sư và nội dung phù hợp.
    *   **Tên trường:** `Trường học` (School Name): Tùy chọn nhập.
    *   **Tên trường:** `Tỉnh/Thành phố` (Province/City): Danh sách chọn, bắt buộc, giúp lọc gia sư theo khu vực (nếu cần học offline hoặc gia sư cùng múi giờ).
    *   **Tên trường:** `Môn học quan tâm` (Subjects of Interest): Cho phép chọn nhiều môn từ danh sách có sẵn (Toán, Lý, Hóa, Văn, Anh, Sinh, Sử, Địa, Tin học, IELTS, TOEIC, Lập trình, Thiết kế, Kỹ năng mềm...). Có thể thêm ô "Khác" để người dùng tự nhập.
*   **Liên kết tài khoản Phụ huynh (Parent Account Linking - Dành cho học sinh dưới 18 tuổi):**
    *   **Tên tính năng:** `Liên kết với Phụ huynh`
    *   **Mô tả:** Khi đăng ký, nếu học viên chọn cấp học dưới 18 tuổi, hệ thống sẽ hiển thị tùy chọn mời phụ huynh liên kết tài khoản. Học viên có thể nhập email hoặc số điện thoại của phụ huynh. Hệ thống sẽ gửi lời mời đến phụ huynh. Nếu phụ huynh chưa có tài khoản, lời mời sẽ kèm link đăng ký tài khoản phụ huynh. Nếu phụ huynh đã có tài khoản, lời mời sẽ xuất hiện trong thông báo của phụ huynh để xác nhận liên kết.
    *   **Luồng thay thế:** Phụ huynh cũng có thể chủ động tạo tài khoản cho con từ giao diện của mình.
*   **Xác minh tài khoản (Account Verification):**
    *   **Tên tính năng:** `Xác minh Email`
    *   **Mô tả:** Gửi email chứa liên kết xác minh đến địa chỉ email đã đăng ký. Người dùng cần nhấp vào liên kết để kích hoạt tài khoản.
    *   **Tên tính năng:** `Xác minh Số điện thoại`
    *   **Mô tả:** Gửi mã OTP (thường gồm 6 chữ số) qua SMS đến số điện thoại đã đăng ký. Người dùng cần nhập mã OTP này vào form đăng ký/xác minh để hoàn tất.
*   **Điều khoản và Chính sách:**
    *   **Tên tính năng:** `Đồng ý Điều khoản Sử dụng & Chính sách Bảo mật`
    *   **Mô tả:** Hiển thị rõ ràng liên kết đến trang "Điều khoản Sử dụng" (Terms of Service) và "Chính sách Bảo mật" (Privacy Policy). Yêu cầu người dùng đánh dấu vào ô xác nhận đã đọc và đồng ý trước khi hoàn tất đăng ký. Nội dung cần được viết bằng tiếng Việt rõ ràng, dễ hiểu.
*   **Hướng dẫn ban đầu (Onboarding Guide):**
    *   **Tên tính năng:** `Chào mừng & Hướng dẫn nhanh`
    *   **Mô tả:** Sau khi đăng ký thành công, hiển thị một màn hình chào mừng và hướng dẫn ngắn gọn các bước tiếp theo (ví dụ: hoàn thiện hồ sơ, cách tìm kiếm gia sư, cách nạp điểm...). Có thể dưới dạng pop-up hoặc chuỗi các tooltip hướng dẫn.

## 1.2 Đăng ký gia sư (Tutor Registration)

**Mô tả:** Thiết lập một quy trình đăng ký và kiểm duyệt nhiều bước, chặt chẽ nhằm đảm bảo chất lượng, uy tín và chuyên môn của đội ngũ gia sư trên nền tảng. Quy trình này cần thể hiện sự chuyên nghiệp nhưng vẫn đủ thân thiện để thu hút các gia sư tiềm năng, đặc biệt là nhóm sinh viên giỏi và các coach/chuyên gia tư vấn.

**Tính năng chi tiết:**

*   **Thu thập thông tin toàn diện:**
    *   **Thông tin cá nhân:** `Họ và tên`, `Ngày sinh`, `Giới tính`, `Số điện thoại` (xác minh OTP), `Email` (xác minh link), `Địa chỉ thường trú`, `Ảnh đại diện` (rõ mặt, lịch sự).
    *   **Thông tin học vấn & chuyên môn:**
        *   `Trình độ học vấn cao nhất`: Danh sách chọn (THPT, Cao đẳng, Đại học, Thạc sĩ, Tiến sĩ...).
        *   `Trường đã/đang theo học`: Tên trường, Chuyên ngành, Năm tốt nghiệp (hoặc dự kiến).
        *   `Kinh nghiệm giảng dạy/làm việc`: Mô tả chi tiết kinh nghiệm, số năm kinh nghiệm.
        *   `Môn học/Lĩnh vực đăng ký dạy`: Cho phép chọn nhiều môn/lĩnh vực từ danh sách chuẩn hóa, kèm cấp độ có thể dạy (ví dụ: Toán lớp 10, IELTS 6.5+, Lập trình Python cơ bản, Tư vấn hướng nghiệp...).
        *   `Mô tả bản thân & Phong cách giảng dạy`: Đoạn văn tự giới thiệu (tối thiểu 150 từ), nêu bật điểm mạnh, kinh nghiệm, phương pháp sư phạm.
    *   **Thông tin bổ sung:**
        *   `Video giới thiệu ngắn (Intro Video)`: Tùy chọn nhưng khuyến khích mạnh mẽ (30-90 giây). Hướng dẫn gia sư cách tạo video chuyên nghiệp, nội dung cần có (giới thiệu bản thân, kinh nghiệm, tại sao học viên nên chọn bạn).
        *   `Giá dạy đề xuất (Rate per hour/session)`: Gia sư tự đề xuất mức giá theo giờ hoặc theo buổi học (đơn vị: Điểm hoặc VNĐ, hệ thống sẽ quy đổi). Có thể đề xuất các gói (packages) nhiều buổi.
        *   `Lịch dạy rảnh (Availability)`: Cung cấp giao diện lịch (calendar view) để gia sư đánh dấu các khung giờ có thể nhận lớp trong tuần.
*   **Tải lên hồ sơ & Chứng chỉ (Document Upload):**
    *   **Tên tính năng:** `Tải lên Giấy tờ Xác minh`
    *   **Mô tả:** Yêu cầu bắt buộc tải lên bản scan/ảnh chụp rõ nét của:
        *   `CMND/CCCD/Hộ chiếu`: Để xác minh danh tính.
        *   `Bằng cấp/Chứng chỉ liên quan`: Bằng tốt nghiệp ĐH/CĐ, chứng chỉ ngoại ngữ (IELTS, TOEIC...), chứng chỉ chuyên môn, giấy khen thành tích học tập...
        *   `Thẻ sinh viên` (nếu là sinh viên).
    *   **Yêu cầu:** Định dạng file cho phép (PDF, JPG, PNG), dung lượng tối đa.
*   **Quy trình phê duyệt nhiều bước (Multi-step Approval Process):**
    *   **Bước 1: Sàng lọc hồ sơ tự động & thủ công (Profile Screening):**
        *   **Tên trạng thái:** `Chờ duyệt hồ sơ` (Pending Profile Review)
        *   **Mô tả:** Hệ thống tự động kiểm tra tính đầy đủ của thông tin. Bộ phận kiểm duyệt (Admin/Moderator) xem xét hồ sơ, kiểm tra sự phù hợp của thông tin khai báo và giấy tờ tải lên.
        *   **Hành động:** `Yêu cầu bổ sung thông tin` (Request More Info), `Từ chối hồ sơ` (Reject Profile), `Chuyển sang Bước 2` (Proceed to Interview).
    *   **Bước 2: Xác minh giấy tờ & Phỏng vấn video (Verification & Video Interview):**
        *   **Tên trạng thái:** `Chờ xác minh & PV` (Pending Verification & Interview)
        *   **Mô tả:** Bộ phận kiểm duyệt xác minh tính xác thực của bằng cấp, chứng chỉ (có thể liên hệ trường/đơn vị cấp). Lên lịch và thực hiện phỏng vấn video ngắn (15-20 phút) để đánh giá khả năng giao tiếp, thái độ, và xác nhận lại thông tin.
        *   **Hành động:** `Yêu cầu bổ sung`, `Từ chối hồ sơ`, `Chuyển sang Bước 3` (Proceed to Skill Assessment).
    *   **Bước 3: Đánh giá năng lực giảng dạy (Teaching Skill Assessment - Tùy chọn/Áp dụng cho một số môn):**
        *   **Tên trạng thái:** `Chờ đánh giá năng lực` (Pending Skill Assessment)
        *   **Mô tả:** Có thể yêu cầu gia sư thực hiện một bài kiểm tra chuyên môn ngắn hoặc dạy thử một chủ đề nhỏ (demo lesson) qua video call với chuyên gia/gia sư có kinh nghiệm khác.
        *   **Hành động:** `Yêu cầu bổ sung`, `Từ chối hồ sơ`, `Chuyển sang Bước 4` (Proceed to Final Approval).
    *   **Bước 4: Phê duyệt cuối cùng & Kích hoạt hồ sơ (Final Approval & Activation):**
        *   **Tên trạng thái:** `Đã phê duyệt` (Approved) / `Hoạt động` (Active)
        *   **Mô tả:** Sau khi vượt qua tất cả các bước, hồ sơ gia sư được phê duyệt và kích hoạt, chính thức hiển thị trên kết quả tìm kiếm.
        *   **Tên trạng thái:** `Bị từ chối` (Rejected): Nêu rõ lý do từ chối.
        *   **Tên trạng thái:** `Tạm khóa` (Suspended): Dành cho các trường hợp vi phạm sau này.
    *   **Thông báo:** Hệ thống tự động gửi email/thông báo trong ứng dụng cập nhật trạng thái hồ sơ cho gia sư sau mỗi bước.
*   **Hướng dẫn & Chính sách cho Gia sư:**
    *   **Tên tính năng:** `Chào mừng Gia sư & Bộ quy tắc`
    *   **Mô tả:** Cung cấp tài liệu hướng dẫn chi tiết cách sử dụng nền tảng (tạo lịch, nhận lớp, sử dụng phòng học ảo, nhận thanh toán...), các chính sách quan trọng (quy tắc ứng xử, tỷ lệ hoa hồng, quy trình xử lý vi phạm...). Yêu cầu gia sư xác nhận đã đọc và đồng ý.

## 1.3 Tài khoản phụ huynh-con (Parent-Child Account)

**Mô tả:** Tính năng cốt lõi nhắm vào nhóm đối tượng học sinh cấp 2, 3, cho phép phụ huynh đồng hành, giám sát và quản lý quá trình học tập của con một cách hiệu quả và minh bạch trên nền tảng.

**Tính năng chi tiết:**

*   **Thiết lập liên kết (Linking Setup):**
    *   **Tên tính năng:** `Mời liên kết tài khoản con` (Invite Child Account)
    *   **Mô tả:** Từ tài khoản phụ huynh, cho phép nhập email/SĐT của con để gửi lời mời liên kết. Nếu con chưa có tài khoản, hướng dẫn tạo tài khoản học viên và tự động liên kết.
    *   **Tên tính năng:** `Chấp nhận lời mời từ phụ huynh` (Accept Parent Invitation)
    *   **Mô tả:** Học viên nhận thông báo mời liên kết từ phụ huynh và có quyền chấp nhận hoặc từ chối.
    *   **Tên tính năng:** `Tạo tài khoản cho con` (Create Child Account)
    *   **Mô tả:** Phụ huynh có thể trực tiếp tạo tài khoản học viên cho con từ giao diện của mình, tài khoản này mặc định được liên kết.
    *   **Giới hạn:** Một tài khoản học viên chỉ có thể liên kết với một tài khoản phụ huynh. Một tài khoản phụ huynh có thể liên kết với nhiều tài khoản con.
*   **Quyền hạn và Giao diện Phụ huynh (Parent Dashboard & Permissions):**
    *   **Tên tính năng:** `Bảng điều khiển Phụ huynh` (Parent Dashboard)
    *   **Mô tả:** Giao diện riêng biệt hiển thị thông tin tổng quan về hoạt động học tập của (các) con đã liên kết.
    *   **Các mục chính:** Lịch học sắp tới, Báo cáo tiến độ gần đây, Số dư điểm chung (nếu phụ huynh quản lý ví), Thông báo quan trọng.
    *   **Quyền xem thông tin con:** Xem hồ sơ học viên của con, lịch sử học tập, đánh giá đã nhận/viết, báo cáo tiến độ từ gia sư.
    *   **Quản lý tài chính:**
        *   `Nạp điểm vào ví chung/ví con`: Phụ huynh có thể nạp điểm và quản lý ngân sách học tập.
        *   `Xem lịch sử giao dịch`: Theo dõi chi tiết các khoản thanh toán cho buổi học.
        *   `Đặt ngân sách chi tiêu hàng tháng/tuần` (Optional): Thiết lập giới hạn chi tiêu cho tài khoản con.
    *   **Quản lý lịch học:**
        *   `Xem lịch học của con`.
        *   `Nhận thông báo về đặt lịch/hủy lịch`.
        *   `Phê duyệt đặt lịch học (Tùy chọn)`: Phụ huynh có thể cấu hình yêu cầu phê duyệt cho mỗi lần con đặt lịch, hoặc chỉ phê duyệt khi vượt ngân sách đã đặt.
    *   **Nhận báo cáo & Thông báo:** Nhận bản sao báo cáo tiến độ từ gia sư, nhận thông báo về các hoạt động quan trọng của con trên nền tảng.
*   **Giao diện Học sinh (Student View under Parent Supervision):**
    *   **Mô tả:** Giao diện của học sinh về cơ bản không thay đổi nhiều, nhưng có thể có các chỉ báo cho thấy tài khoản đang được liên kết với phụ huynh.
    *   **Minh bạch:** Học sinh cần được biết những thông tin nào phụ huynh có thể xem và những hành động nào cần phụ huynh phê duyệt (nếu có).
*   **Tùy chỉnh mức độ kiểm soát (Control Level Customization):**
    *   **Tên tính năng:** `Cài đặt Quyền riêng tư & Giám sát`
    *   **Mô tả:** Phụ huynh (và có thể cả học viên lớn hơn một chút) có thể tùy chỉnh mức độ giám sát. Ví dụ:
        *   `Thông báo đầy đủ`: Nhận mọi thông báo.
        *   `Chỉ thông báo quan trọng`: Nhận thông báo về lịch học, báo cáo, thanh toán.
        *   `Yêu cầu phê duyệt đặt lịch`: Bật/tắt.
        *   `Yêu cầu phê duyệt chi tiêu`: Bật/tắt (hoặc đặt ngưỡng).


---



# Phần 2: Hồ sơ người dùng (User Profiles)

Phân hệ này quản lý thông tin chi tiết của cả học viên và gia sư, đóng vai trò quan trọng trong việc tạo sự tin tưởng, giúp người dùng thể hiện bản thân và là cơ sở cho thuật toán kết nối hoạt động hiệu quả.

## 2.1 Hồ sơ học viên (Student Profile)

**Mô tả:** Cung cấp một không gian để học viên giới thiệu về bản thân, nhu cầu học tập và quản lý thông tin cá nhân. Hồ sơ này cần đủ chi tiết để gia sư hiểu rõ về học viên tiềm năng, nhưng cũng phải đảm bảo quyền riêng tư cho người dùng, đặc biệt là học sinh nhỏ tuổi.

**Tính năng chi tiết:**

*   **Thông tin cá nhân cơ bản (Basic Personal Information):**
    *   `Ảnh đại diện (Profile Picture)`: Cho phép tải lên hoặc chọn từ avatar mặc định. Khuyến khích ảnh thật nhưng không bắt buộc đối với học viên.
    *   `Họ và tên (Full Name)`: Hiển thị tên đã đăng ký, có thể cho phép đặt biệt danh (Nickname).
    *   `Tuổi/Cấp học (Age/Grade Level)`: Hiển thị thông tin đã đăng ký.
    *   `Giới thiệu ngắn (Short Bio)`: Khung văn bản tự do để học viên viết vài dòng giới thiệu về sở thích, tính cách hoặc mong muốn học tập (tùy chọn).
*   **Mục tiêu và Nhu cầu học tập (Learning Goals & Needs):**
    *   **Tên mục:** `Mục tiêu học tập (Learning Goals)`
    *   **Mô tả:** Cho phép học viên mô tả cụ thể mục tiêu muốn đạt được (ví dụ: "Đạt 7.0 IELTS trong 6 tháng", "Cải thiện điểm môn Toán từ 6 lên 8", "Nắm vững kiến thức Hóa học lớp 11", "Học lập trình Python để làm dự án cá nhân"). Có thể chọn từ các mục tiêu gợi ý hoặc tự nhập.
    *   **Tên mục:** `Môn học quan tâm (Subjects of Interest)`
    *   **Mô tả:** Hiển thị các môn học đã chọn khi đăng ký, cho phép cập nhật, thêm/bớt môn học.
    *   **Tên mục:** `Phong cách học tập ưa thích (Preferred Learning Style)`
    *   **Mô tả:** Tùy chọn, cho phép học viên chọn các đặc điểm phong cách học mong muốn từ gia sư (ví dụ: "Kiên nhẫn", "Vui vẻ", "Nghiêm khắc", "Tập trung vào bài tập", "Giải thích cặn kẽ lý thuyết"...). Giúp thuật toán gợi ý gia sư phù hợp hơn.
*   **Thông tin bổ sung (Additional Information):**
    *   **Tên mục:** `Lịch học mong muốn (Desired Schedule)`
    *   **Mô tả:** Cho phép học viên chỉ định các khung giờ ưu tiên hoặc không thể học trong tuần, giúp gia sư biết được tính khả dụng.
    *   **Tên mục:** `Ngân sách học tập (Learning Budget)`
    *   **Mô tả:** Tùy chọn, học viên có thể chỉ định khoảng giá mong muốn cho mỗi buổi học (theo Điểm hoặc VNĐ) để lọc kết quả tìm kiếm.
*   **Lịch sử và Hoạt động (History & Activity):**
    *   **Tên mục:** `Lịch sử buổi học (Session History)`
    *   **Mô tả:** Liệt kê các buổi học đã diễn ra, bao gồm thông tin gia sư, môn học, thời gian, trạng thái (hoàn thành, bị hủy).
    *   **Tên mục:** `Đánh giá đã viết (Reviews Given)`
    *   **Mô tả:** Hiển thị các đánh giá mà học viên đã viết cho gia sư.
    *   **Tên mục:** `Gia sư đã lưu (Saved Tutors)`
    *   **Mô tả:** Danh sách các gia sư mà học viên đã đánh dấu quan tâm/lưu lại để tiện liên hệ sau.
*   **Cài đặt riêng tư (Privacy Settings):**
    *   **Tên tính năng:** `Quản lý hiển thị thông tin`
    *   **Mô tả:** Cho phép học viên kiểm soát thông tin nào trên hồ sơ sẽ hiển thị công khai cho các gia sư xem (ví dụ: có thể ẩn họ tên đầy đủ, chỉ hiển thị tên/biệt danh; ẩn trường học; ẩn giới thiệu ngắn...). Mặc định, các thông tin nhạy cảm như số điện thoại, email luôn được ẩn.
    *   **Đối với tài khoản liên kết phụ huynh:** Phụ huynh có thể xem toàn bộ thông tin hồ sơ của con.

## 2.2 Hồ sơ gia sư (Tutor Profile)

**Mô tả:** Đây là trang thông tin quan trọng nhất của gia sư, đóng vai trò như một CV trực tuyến và công cụ marketing để thu hút học viên. Hồ sơ cần được trình bày chuyên nghiệp, đầy đủ thông tin, minh bạch và đáng tin cậy, làm nổi bật kinh nghiệm, chuyên môn và phản hồi tích cực từ học viên.

**Tính năng chi tiết:**

*   **Thông tin cơ bản & Chuyên môn (Basic & Professional Information):**
    *   `Ảnh đại diện (Profile Picture)`: Bắt buộc ảnh thật, rõ mặt, chuyên nghiệp, lịch sự.
    *   `Họ và tên (Full Name)`: Hiển thị tên thật đã xác minh.
    *   `Chức danh/Giới thiệu ngắn (Headline/Tagline)`: Một câu ngắn gọn mô tả chuyên môn chính (ví dụ: "Gia sư Toán chuyên luyện thi Đại học", "IELTS Examiner 8.5+", "Chuyên gia Tư vấn Hướng nghiệp", "Sinh viên Ngoại thương dạy Tiếng Anh giao tiếp").
    *   `Video giới thiệu (Intro Video)`: Hiển thị nổi bật nếu có. Cung cấp trình phát video tích hợp.
    *   `Giới thiệu chi tiết (Detailed Introduction)`: Khung văn bản để gia sư trình bày chi tiết về bản thân, kinh nghiệm giảng dạy, phương pháp sư phạm, thành tích nổi bật. Khuyến khích viết bằng giọng văn thu hút, chân thành.
    *   `Trình độ học vấn (Education)`: Liệt kê các bằng cấp, trường học, chuyên ngành đã được xác minh.
    *   `Kinh nghiệm làm việc/giảng dạy (Work/Teaching Experience)`: Liệt kê các vị trí công việc, kinh nghiệm giảng dạy liên quan.
    *   `Chứng chỉ & Giải thưởng (Certificates & Awards)`: Hiển thị danh sách các chứng chỉ, giải thưởng đã được xác minh.
*   **Thông tin giảng dạy (Teaching Details):**
    *   **Tên mục:** `Môn học & Cấp độ giảng dạy (Subjects & Levels Taught)`
    *   **Mô tả:** Liệt kê rõ ràng các môn học/lĩnh vực và cấp độ tương ứng mà gia sư đăng ký dạy (ví dụ: Vật lý lớp 10-12, Tiếng Anh giao tiếp cơ bản, Luyện thi TOEIC 500-750...).
    *   **Tên mục:** `Giá dạy & Gói học (Rate & Packages)`
    *   **Mô tả:** Hiển thị mức giá theo giờ/buổi học (quy đổi ra Điểm). Nếu gia sư có tạo các gói học (ví dụ: gói 10 buổi giảm giá), chúng sẽ được hiển thị ở đây.
    *   **Tên mục:** `Lịch dạy (Availability Calendar)`
    *   **Mô tả:** Hiển thị lịch trống của gia sư dưới dạng trực quan (tuần/tháng), cho phép học viên xem và chọn khung giờ phù hợp để đặt lịch.
    *   **Tên mục:** `Ngôn ngữ giảng dạy (Teaching Languages)`: Ghi rõ ngôn ngữ sử dụng trong buổi học (ví dụ: Tiếng Việt, Tiếng Anh).
*   **Uy tín và Hiệu quả (Credibility & Performance):**
    *   **Tên mục:** `Xác minh & Chứng nhận (Verifications & Badges)`
    *   **Mô tả:** Hiển thị các huy hiệu (badges) chứng nhận gia sư đã hoàn thành các bước xác minh: `Đã xác minh danh tính` (Identity Verified), `Đã xác minh bằng cấp` (Credentials Verified), `Đã qua phỏng vấn` (Interview Passed), `Kiểm tra lý lịch` (Background Checked - nếu có). Huy hiệu `Gia sư Nổi bật` (Top Tutor) hoặc `Gia sư được yêu thích` (Featured Tutor) có thể được trao dựa trên hiệu suất và đánh giá.
    *   **Tên mục:** `Đánh giá từ học viên (Student Reviews)`
    *   **Mô tả:** Hiển thị điểm đánh giá trung bình (số sao) và danh sách các bình luận chi tiết từ những học viên đã học. Cung cấp bộ lọc (mới nhất, điểm cao nhất, điểm thấp nhất) và phân trang.
    *   **Tên mục:** `Thống kê hiệu suất (Performance Statistics)`
    *   **Mô tả:** Hiển thị các chỉ số quan trọng (có thể tùy chọn ẩn/hiện bởi gia sư):
        *   `Tổng số buổi đã dạy (Total Sessions Taught)`
        *   `Tổng số giờ đã dạy (Total Hours Taught)`
        *   `Tỷ lệ phản hồi tin nhắn (Response Rate)`: Phần trăm tin nhắn/yêu cầu đặt lịch được trả lời.
        *   `Thời gian phản hồi trung bình (Average Response Time)`: Thời gian trung bình để trả lời tin nhắn/yêu cầu.
        *   `Tỷ lệ hoàn thành buổi học (Session Completion Rate)`: Tỷ lệ các buổi học đã đặt được hoàn thành (không bị hủy bởi gia sư).
        *   `Số học viên thường xuyên (Regular Students)`: Số lượng học viên học lặp lại nhiều lần (tùy chọn).
*   **Công cụ quản lý hồ sơ (Profile Management Tools - Dành cho Gia sư):**
    *   Giao diện chỉnh sửa dễ dàng các thông tin trên hồ sơ.
    *   Xem trước hồ sơ sẽ hiển thị như thế nào đối với học viên.
    *   Quản lý lịch dạy, cập nhật trạng thái rảnh/bận.
    *   Xem và phản hồi các đánh giá mới.
    *   Theo dõi thống kê hiệu suất cá nhân.


---



# Phần 3: Hệ thống tìm kiếm và kết nối (Search & Connection System)

Đây là trung tâm của nền tảng, nơi học viên có thể chủ động tìm kiếm gia sư phù hợp với nhu cầu của mình, hoặc nhận được gợi ý thông minh từ hệ thống. Phân hệ này cũng bao gồm quy trình đặt lịch học một cách thuận tiện và minh bạch.

## 3.1 Tìm kiếm gia sư (Tutor Search)

**Mô tả:** Cung cấp một công cụ tìm kiếm mạnh mẽ, linh hoạt và dễ sử dụng, cho phép học viên (và phụ huynh) lọc và tìm thấy gia sư phù hợp nhất trong số hàng ngàn hồ sơ dựa trên nhiều tiêu chí khác nhau. Giao diện tìm kiếm cần trực quan và trả về kết quả nhanh chóng, chính xác.

**Tính năng chi tiết:**

*   **Thanh tìm kiếm chính (Main Search Bar):**
    *   **Tên tính năng:** `Tìm kiếm theo Từ khóa`
    *   **Mô tả:** Cho phép người dùng nhập từ khóa liên quan đến môn học (ví dụ: "Toán lớp 9", "Luyện thi IELTS", "Tiếng Anh giao tiếp"), tên gia sư, hoặc kỹ năng cụ thể.
*   **Bộ lọc đa tiêu chí (Multi-criteria Filters):**
    *   **Tên tính năng:** `Bộ lọc Nâng cao`
    *   **Mô tả:** Cung cấp một loạt các bộ lọc chi tiết để thu hẹp kết quả tìm kiếm. Các bộ lọc cần được nhóm một cách logic và dễ dàng truy cập.
    *   **Các bộ lọc chính:**
        *   `Môn học/Lĩnh vực (Subject/Field)`: Danh sách đa chọn các môn học (Toán, Lý, Hóa, Văn, Anh, Sinh, Sử, Địa, Tin học, Ngoại ngữ khác, Năng khiếu, Kỹ năng mềm, Lập trình, Thiết kế, Hướng nghiệp...). Có thể phân cấp (ví dụ: Ngoại ngữ -> Tiếng Anh -> IELTS).
        *   `Cấp độ (Level)`: Danh sách đa chọn cấp học/trình độ (Tiểu học, THCS, THPT, Luyện thi ĐH, Đại học, Người đi làm, Mọi cấp độ).
        *   `Khoảng giá (Price Range)`: Thanh trượt hoặc ô nhập để xác định mức giá mong muốn cho mỗi buổi học (theo Điểm hoặc VNĐ).
        *   `Thời gian rảnh (Availability)`: Cho phép chọn ngày cụ thể trong tuần (Thứ 2 - CN) và/hoặc khung giờ cụ thể (Sáng, Chiều, Tối) mà học viên muốn học.
        *   `Đánh giá tối thiểu (Minimum Rating)`: Chọn mức đánh giá sao tối thiểu (ví dụ: từ 3 sao trở lên, từ 4 sao trở lên).
        *   `Ngôn ngữ giảng dạy (Teaching Language)`: Chọn ngôn ngữ chính được sử dụng (Tiếng Việt, Tiếng Anh, Song ngữ...).
        *   `Giới tính gia sư (Tutor Gender)`: Tùy chọn lọc theo giới tính (Nam, Nữ, Không yêu cầu).
        *   `Kinh nghiệm (Experience)`: Lọc theo số năm kinh nghiệm (ví dụ: Dưới 1 năm, 1-3 năm, 3-5 năm, Trên 5 năm).
        *   `Loại buổi học (Session Type)`: Lọc gia sư dạy lớp 1:1 hay có dạy lớp nhóm.
        *   `Có xác minh (Verified Tutors)`: Chỉ hiển thị gia sư đã hoàn thành các bước xác minh quan trọng (Danh tính, Bằng cấp).
*   **Hiển thị kết quả tìm kiếm (Search Results Display):**
    *   **Tên tính năng:** `Danh sách Kết quả Gia sư`
    *   **Mô tả:** Hiển thị danh sách các hồ sơ gia sư phù hợp với tiêu chí tìm kiếm dưới dạng thẻ (cards) hoặc danh sách (list).
    *   **Thông tin hiển thị trên mỗi thẻ/mục:** Ảnh đại diện, Họ tên, Chức danh/Giới thiệu ngắn, Đánh giá trung bình (số sao và số lượt đánh giá), Giá dạy cơ bản, Các môn dạy chính, Trạng thái trực tuyến (Online/Offline), Nút "Xem hồ sơ", Nút "Lưu gia sư".
    *   **Tùy chọn sắp xếp kết quả (Sorting Options):**
        *   `Phù hợp nhất (Best Match)`: Mặc định, dựa trên thuật toán kết nối thông minh (xem mục 3.2).
        *   `Đánh giá cao nhất (Highest Rated)`: Sắp xếp theo điểm đánh giá trung bình từ cao xuống thấp.
        *   `Giá thấp nhất (Lowest Price)`: Sắp xếp theo giá dạy từ thấp đến cao.
        *   `Giá cao nhất (Highest Price)`: Sắp xếp theo giá dạy từ cao đến thấp.
        *   `Mới nhất (Newest)`: Hiển thị các gia sư mới tham gia gần đây.
    *   **Hiển thị lịch trống nhanh (Quick Availability View):** Có thể tích hợp một lịch nhỏ hoặc chỉ báo trực quan ngay trên thẻ kết quả để xem nhanh các khung giờ trống của gia sư trong tuần tới.
    *   **Phân trang (Pagination):** Chia kết quả thành nhiều trang nếu có quá nhiều gia sư phù hợp.
*   **Xem trước hồ sơ (Profile Preview):**
    *   **Tên tính năng:** `Xem nhanh Hồ sơ Gia sư`
    *   **Mô tả:** Khi di chuột qua hoặc nhấp vào một phần của thẻ kết quả, có thể hiển thị một cửa sổ pop-up nhỏ (tooltip/modal) chứa thêm thông tin chi tiết về gia sư (giới thiệu ngắn, các môn dạy đầy đủ, video giới thiệu nếu có) mà không cần rời khỏi trang kết quả.
*   **So sánh gia sư (Tutor Comparison):**
    *   **Tên tính năng:** `So sánh Gia sư`
    *   **Mô tả:** Cho phép học viên chọn nhiều gia sư (tối đa 3-4) từ kết quả tìm kiếm để đặt cạnh nhau và so sánh các thông tin chính (giá, kinh nghiệm, đánh giá, môn dạy, lịch trống) trên một màn hình duy nhất, giúp đưa ra quyết định dễ dàng hơn.

## 3.2 Thuật toán kết nối thông minh (Smart Matching Algorithm)

**Mô tả:** Hệ thống sử dụng thuật toán (có thể kết hợp AI/Machine Learning) để phân tích dữ liệu và gợi ý những gia sư phù hợp nhất với nhu cầu, mục tiêu và phong cách học tập của từng học viên. Thuật toán này hoạt động ngầm và ảnh hưởng đến thứ tự sắp xếp "Phù hợp nhất" trong kết quả tìm kiếm, cũng như có thể đưa ra các gợi ý trực tiếp cho học viên.

**Tính năng chi tiết:**

*   **Phân tích hồ sơ học viên (Student Profile Analysis):**
    *   **Mô tả:** Thuật toán phân tích các thông tin trong hồ sơ học viên:
        *   `Môn học quan tâm` và `Cấp độ`.
        *   `Mục tiêu học tập` đã khai báo.
        *   `Phong cách học tập ưa thích` (nếu có).
        *   `Lịch học mong muốn`.
        *   `Ngân sách` (nếu có).
        *   `Lịch sử học tập`: Các gia sư đã học trước đây, đánh giá đã cho/nhận.
*   **Phân tích hồ sơ gia sư (Tutor Profile Analysis):**
    *   **Mô tả:** Thuật toán phân tích thông tin từ hồ sơ gia sư:
        *   `Môn học` và `Cấp độ` giảng dạy.
        *   `Kinh nghiệm` và `Chuyên môn`.
        *   `Phong cách giảng dạy` mô tả trong giới thiệu.
        *   `Đánh giá` và `Phản hồi` từ các học viên khác (phân tích cả nội dung bình luận).
        *   `Lịch trống` có khớp với lịch mong muốn của học viên.
        *   `Tỷ lệ thành công` với các học viên tương tự (nếu có đủ dữ liệu).
*   **Cơ chế gợi ý (Recommendation Engine):**
    *   **Tên tính năng:** `Gợi ý Gia sư cho Bạn` (Recommended Tutors for You)
    *   **Mô tả:** Hiển thị một khu vực riêng trên Bảng điều khiển (Dashboard) của học viên hoặc sau khi học viên cập nhật nhu cầu học tập, đề xuất danh sách các gia sư được cho là phù hợp nhất dựa trên phân tích của thuật toán.
    *   **Giải thích gợi ý:** Cung cấp lý do ngắn gọn tại sao gia sư đó được gợi ý (ví dụ: "Phù hợp môn Toán lớp 10 và lịch học của bạn", "Được đánh giá cao về sự kiên nhẫn", "Có kinh nghiệm luyện thi IELTS cho mục tiêu 7.0+").
*   **Học hỏi từ phản hồi (Feedback Loop):**
    *   **Mô tả:** Thuật toán liên tục cải thiện độ chính xác dựa trên hành vi của người dùng:
        *   Học viên có nhấp vào xem hồ sơ gia sư được gợi ý không?
        *   Học viên có đặt lịch học với gia sư được gợi ý không?
        *   Đánh giá của học viên sau khi học với gia sư đó như thế nào?
        *   Học viên có lưu gia sư đó vào danh sách yêu thích không?

## 3.3 Đặt lịch học (Booking System)

**Mô tả:** Cung cấp một quy trình đặt lịch học trực quan, linh hoạt và an toàn, cho phép học viên dễ dàng chọn khung giờ phù hợp từ lịch trống của gia sư và hoàn tất việc đặt chỗ bằng hệ thống điểm.

**Tính năng chi tiết:**

*   **Xem lịch trống của gia sư (View Tutor Availability):**
    *   **Tên tính năng:** `Lịch làm việc của Gia sư`
    *   **Mô tả:** Trên hồ sơ gia sư, hiển thị một lịch trực quan (theo tuần hoặc tháng) làm nổi bật các khung giờ mà gia sư sẵn sàng nhận lớp. Các khung giờ đã có lớp hoặc không khả dụng sẽ được đánh dấu khác đi.
    *   **Hiển thị múi giờ:** Rõ ràng múi giờ đang hiển thị (mặc định theo múi giờ của người dùng) để tránh nhầm lẫn.
*   **Quy trình đặt lịch (Booking Process):**
    *   **Bước 1: Chọn khung giờ:** Học viên nhấp vào một khung giờ trống trên lịch của gia sư.
    *   **Bước 2: Chọn loại buổi học:** Chọn thời lượng buổi học (ví dụ: 60 phút, 90 phút, 120 phút - tùy theo cấu hình của gia sư) và loại hình (1:1 hoặc tham gia lớp nhóm nếu có).
    *   **Bước 3: Mô tả nhu cầu (Optional but Recommended):** Cung cấp một ô văn bản để học viên ghi chú cụ thể về nội dung muốn học trong buổi đó (ví dụ: "Ôn tập chương 3 Đại số", "Luyện nói chủ đề Travel", "Review bài essay đã viết"). Giúp gia sư chuẩn bị tốt hơn.
    *   **Bước 4: Xác nhận thông tin & Thanh toán:** Hiển thị tóm tắt thông tin buổi học (gia sư, môn học, thời gian, số điểm sẽ bị trừ). Yêu cầu học viên xác nhận đặt lịch. Hệ thống sẽ tự động trừ số điểm tương ứng từ ví của học viên.
    *   **Kiểm tra số dư:** Hệ thống kiểm tra xem học viên có đủ điểm để đặt lịch hay không. Nếu không đủ, hiển thị thông báo và nút dẫn đến trang nạp điểm.
*   **Đặt lịch định kỳ (Recurring Booking):**
    *   **Tên tính năng:** `Đặt lịch Lặp lại`
    *   **Mô tả:** Khi đặt lịch, cho phép học viên chọn tùy chọn lặp lại buổi học vào cùng giờ, cùng ngày hàng tuần hoặc hai tuần một lần (trong một khoảng thời gian nhất định, ví dụ: 4 tuần, 8 tuần). Hệ thống sẽ kiểm tra tính khả dụng của gia sư cho tất cả các buổi học định kỳ trước khi xác nhận.
*   **Xác nhận và Thông báo (Confirmation & Notifications):**
    *   **Thông báo tức thì:** Sau khi đặt lịch thành công, cả học viên và gia sư đều nhận được thông báo xác nhận qua email/SMS và thông báo trong ứng dụng.
    *   **Thông tin xác nhận:** Bao gồm chi tiết buổi học, liên kết tham gia phòng học ảo (sẽ kích hoạt trước giờ học).
*   **Nhắc nhở buổi học (Session Reminders):**
    *   **Tên tính năng:** `Nhắc nhở Lịch học`
    *   **Mô tả:** Hệ thống tự động gửi thông báo nhắc nhở cho cả học viên và gia sư trước buổi học (ví dụ: 24 giờ trước và 1 giờ trước) qua email/SMS/thông báo trong ứng dụng.
*   **Quản lý lịch đã đặt (Manage Bookings):**
    *   **Tên tính năng:** `Lịch học của tôi` (My Schedule)
    *   **Mô tả:** Cung cấp một trang riêng cho cả học viên và gia sư để xem danh sách các buổi học sắp tới và đã diễn ra.
    *   **Hành động:** Cho phép xem chi tiết, tham gia phòng học ảo (khi đến giờ), và thực hiện hủy/đổi lịch.
*   **Hủy và Đổi lịch (Cancellation & Rescheduling):**
    *   **Tên tính năng:** `Hủy/Đổi lịch học`
    *   **Mô tả:** Cho phép học viên hoặc gia sư yêu cầu hủy hoặc đổi lịch buổi học đã đặt.
    *   **Chính sách rõ ràng:** Áp dụng chính sách hủy/đổi lịch linh hoạt nhưng công bằng (ví dụ: hủy trước 24 giờ được hoàn 100% điểm, hủy trong vòng 24 giờ có thể bị trừ một phần phí, gia sư hủy phải có lý do chính đáng và có thể bị ảnh hưởng đến uy tín). Chính sách cần được hiển thị rõ ràng trong quá trình đặt lịch và trong mục Trợ giúp.
    *   **Quy trình:** Người yêu cầu hủy/đổi lịch cần nêu lý do. Hệ thống thông báo cho bên còn lại. Nếu đổi lịch, cần chọn lại khung giờ mới phù hợp với cả hai.
    *   **Hoàn điểm tự động:** Nếu hủy lịch hợp lệ, điểm sẽ được tự động hoàn lại vào ví học viên.
*   **Phê duyệt của Phụ huynh (Parental Approval - Nếu áp dụng):**
    *   **Mô tả:** Nếu tài khoản học viên được cấu hình yêu cầu phê duyệt, sau khi học viên thực hiện Bước 4 (Xác nhận thông tin), yêu cầu đặt lịch sẽ được gửi đến phụ huynh để phê duyệt trước khi chính thức xác nhận và trừ điểm. Phụ huynh nhận thông báo và có thể phê duyệt/từ chối từ Bảng điều khiển của mình.


---



# Phần 4: Phòng học ảo (Virtual Classroom)

Đây là không gian học tập trực tuyến cốt lõi của AITHEduConnect, nơi diễn ra các buổi học 1:1 hoặc lớp học nhóm. Phòng học ảo cần được trang bị đầy đủ công cụ tương tác hiện đại, đảm bảo chất lượng kết nối ổn định và mang lại trải nghiệm học tập liền mạch, hiệu quả như lớp học truyền thống, thậm chí ưu việt hơn nhờ các tính năng số.

## 4.1 Giao tiếp video và âm thanh (Video & Audio Communication)

**Mô tả:** Cung cấp khả năng giao tiếp hai chiều bằng hình ảnh và âm thanh chất lượng cao, ổn định, là nền tảng cho sự tương tác trực tiếp giữa gia sư và học viên.

**Tính năng chi tiết:**

*   **Chất lượng truyền tải (Stream Quality):**
    *   **Tên tính năng:** `Video HD & Âm thanh Rõ ràng`
    *   **Mô tả:** Hỗ trợ truyền video với độ phân giải cao (HD 720p hoặc cao hơn tùy thuộc băng thông) và âm thanh trong, rõ, giảm thiểu tiếng ồn và độ trễ.
    *   **Tên tính năng:** `Tự động điều chỉnh chất lượng (Adaptive Bitrate)`
    *   **Mô tả:** Hệ thống tự động điều chỉnh chất lượng video/âm thanh dựa trên tốc độ đường truyền internet của người dùng để đảm bảo buổi học diễn ra liên tục, tránh giật lag tối đa.
    *   **Tên tính năng:** `Chế độ Tiết kiệm Băng thông (Low Bandwidth Mode)`
    *   **Mô tả:** Cung cấp tùy chọn thủ công cho người dùng chuyển sang chế độ chỉ âm thanh (tắt video) hoặc giảm chất lượng video khi kết nối yếu.
*   **Điều khiển cơ bản (Basic Controls):**
    *   **Tên nút:** `Bật/Tắt Camera` (Turn Camera On/Off): Cho phép người dùng chủ động bật hoặc tắt webcam của mình.
    *   **Tên nút:** `Bật/Tắt Micro` (Mute/Unmute Microphone): Cho phép người dùng tắt tiếng hoặc bật tiếng micro.
    *   **Tên nút:** `Chọn Thiết bị (Device Selection)`: Cho phép người dùng chọn camera, micro và loa muốn sử dụng nếu có nhiều thiết bị kết nối với máy tính.
*   **Trải nghiệm trước và trong buổi học (Session Experience):**
    *   **Tên tính năng:** `Kiểm tra Thiết bị & Kết nối (Pre-session Check)`
    *   **Mô tả:** Trước khi vào phòng học chính thức, cung cấp một bước kiểm tra nhanh micro, loa, camera và tốc độ mạng để đảm bảo mọi thứ hoạt động tốt.
    *   **Tên tính năng:** `Phòng chờ (Waiting Room)`
    *   **Mô tả:** Cho phép người tham gia vào phòng chờ trước giờ học chính thức. Gia sư có quyền cho phép từng người hoặc tất cả vào phòng học chính.
    *   **Tên tính năng:** `Chế độ xem Lưới/Người nói (Grid/Speaker View)`
    *   **Mô tả:** Cho phép người dùng chuyển đổi giữa các chế độ hiển thị video: xem tất cả người tham gia trên màn hình (Grid View) hoặc tự động phóng to video của người đang nói (Speaker View). Đặc biệt hữu ích cho lớp học nhóm.
*   **Tương tác phi ngôn ngữ (Non-verbal Interaction):**
    *   **Tên tính năng:** `Giơ tay Phát biểu (Raise Hand)`
    *   **Mô tả:** Học viên có thể nhấp vào nút "Giơ tay" để báo hiệu muốn phát biểu hoặc đặt câu hỏi mà không làm gián đoạn lời giảng. Gia sư sẽ thấy danh sách những người đang giơ tay.
    *   **Tên tính năng:** `Biểu tượng Cảm xúc (Reactions)`
    *   **Mô tả:** Cho phép người tham gia gửi các biểu tượng cảm xúc nhanh (như 👍, ❤️, 😂, 😮, 🎉) để thể hiện phản ứng tức thì mà không cần bật micro.

## 4.2 Bảng trắng tương tác (Interactive Whiteboard)

**Mô tả:** Cung cấp một không gian làm việc trực quan dùng chung, nơi gia sư và học viên có thể viết, vẽ, chèn hình ảnh và cộng tác giải quyết vấn đề như trên một tấm bảng thật.

**Tính năng chi tiết:**

*   **Công cụ vẽ và viết (Drawing & Writing Tools):**
    *   **Tên công cụ:** `Bút vẽ (Pen Tool)`: Cho phép vẽ tự do với các tùy chọn màu sắc và độ dày nét vẽ khác nhau.
    *   **Tên công cụ:** `Bút đánh dấu (Highlighter Tool)`: Tô sáng nội dung với màu trong suốt.
    *   **Tên công cụ:** `Tẩy (Eraser Tool)`: Xóa các nét vẽ hoặc đối tượng trên bảng.
    *   **Tên công cụ:** `Công cụ Hình học (Shape Tool)`: Vẽ nhanh các hình cơ bản như đường thẳng, mũi tên, hình tròn, elip, hình chữ nhật, tam giác.
    *   **Tên công cụ:** `Công cụ Văn bản (Text Tool)`: Gõ chữ trực tiếp lên bảng với các tùy chọn font chữ, kích thước, màu sắc.
    *   **Tên công cụ:** `Công cụ Công thức Toán học (Math Equation Tool)`: Hỗ trợ nhập các công thức toán học phức tạp một cách chuẩn xác (tích hợp trình soạn thảo LaTeX hoặc tương tự).
*   **Quản lý nội dung bảng (Content Management):**
    *   **Tên tính năng:** `Tải lên & Chú thích Hình ảnh/PDF (Image/PDF Upload & Annotation)`
    *   **Mô tả:** Cho phép tải lên các tệp hình ảnh (JPG, PNG) hoặc PDF trực tiếp lên bảng trắng và sau đó dùng các công cụ vẽ/viết để chú thích, đánh dấu lên đó.
    *   **Tên tính năng:** `Nhiều trang Bảng trắng (Multiple Whiteboard Pages)`
    *   **Mô tả:** Cho phép tạo nhiều trang bảng trắng trong một buổi học, dễ dàng chuyển đổi giữa các trang để tổ chức nội dung.
    *   **Tên tính năng:** `Lưu & Xuất Bảng trắng (Save & Export Whiteboard)`
    *   **Mô tả:** Cho phép lưu lại toàn bộ nội dung các trang bảng trắng của buổi học dưới dạng hình ảnh (PNG, JPG) hoặc PDF để học viên xem lại sau.
    *   **Tên tính năng:** `Xóa toàn bộ bảng (Clear All)`: Nút để xóa nhanh toàn bộ nội dung trên trang bảng hiện tại.
*   **Tương tác và Cộng tác (Interaction & Collaboration):**
    *   **Tên tính năng:** `Quyền điều khiển Bảng trắng (Whiteboard Control)`
    *   **Mô tả:** Mặc định, gia sư có quyền vẽ/viết chính. Gia sư có thể cấp quyền tương tác trên bảng trắng cho một hoặc tất cả học viên tham gia.
    *   **Tên tính năng:** `Cộng tác Thời gian thực (Real-time Collaboration)`
    *   **Mô tả:** Nhiều người (gia sư và học viên được cấp quyền) có thể cùng lúc viết, vẽ trên bảng trắng, các thay đổi được cập nhật tức thì cho mọi người.

## 4.3 Chia sẻ tài liệu và màn hình (Document & Screen Sharing)

**Mô tả:** Cho phép gia sư (và đôi khi cả học viên) chia sẻ nội dung từ máy tính của mình, bao gồm màn hình, cửa sổ ứng dụng cụ thể hoặc các tệp tài liệu, nhằm minh họa bài giảng hoặc trình bày bài làm.

**Tính năng chi tiết:**

*   **Chia sẻ Màn hình (Screen Sharing):**
    *   **Tên tính năng:** `Chia sẻ Toàn bộ Màn hình (Share Entire Screen)`: Chia sẻ mọi thứ hiển thị trên màn hình của người chia sẻ.
    *   **Tên tính năng:** `Chia sẻ Cửa sổ Ứng dụng (Share Application Window)`: Chỉ chia sẻ cửa sổ của một ứng dụng cụ thể (ví dụ: trình duyệt web, phần mềm Word), các cửa sổ khác vẫn riêng tư.
    *   **Tên tính năng:** `Chia sẻ Tab Trình duyệt (Share Browser Tab)`: Chỉ chia sẻ nội dung của một tab cụ thể trên trình duyệt (nếu dùng trình duyệt hỗ trợ).
    *   **Tên tính năng:** `Chia sẻ Âm thanh Máy tính (Share Computer Audio)`: Tùy chọn cho phép chia sẻ cả âm thanh phát ra từ máy tính khi chia sẻ màn hình (hữu ích khi xem video hoặc nghe audio).
    *   **Quyền chia sẻ:** Mặc định chỉ gia sư có quyền chia sẻ màn hình, nhưng có thể cấp quyền cho học viên khi cần.
*   **Chia sẻ Tài liệu (Document Sharing):**
    *   **Tên tính năng:** `Tải lên & Trình chiếu Tài liệu`
    *   **Mô tả:** Cho phép gia sư tải lên các tệp tài liệu phổ biến (PDF, DOC/DOCX, PPT/PPTX, XLS/XLSX) vào phòng học. Hệ thống sẽ hiển thị nội dung tài liệu trong một cửa sổ xem riêng.
    *   **Tên tính năng:** `Công cụ Chú thích trên Tài liệu (Annotation on Shared Document)`
    *   **Mô tả:** Cung cấp các công cụ tương tự bảng trắng (bút vẽ, đánh dấu, văn bản) để gia sư/học viên có thể chú thích trực tiếp lên tài liệu đang được chia sẻ.
    *   **Tên tính năng:** `Điều khiển Slide (Slide Control - cho PPT)`: Khi chia sẻ file PowerPoint, người chia sẻ có thể điều khiển chuyển slide tới/lui.
    *   **Tên tính năng:** `Cho phép Tải xuống (Allow Download)`: Gia sư có thể cho phép học viên tải về các tệp tài liệu đã được chia sẻ trong buổi học.
*   **Thư viện Tài liệu Khóa học (Course Material Library):**
    *   **Tên tính năng:** `Kho Tài liệu Buổi học`
    *   **Mô tả:** Tạo một khu vực lưu trữ liên kết với mỗi buổi học (hoặc chuỗi buổi học định kỳ), nơi gia sư có thể tải lên trước các tài liệu cần thiết và học viên có thể truy cập trước/trong/sau buổi học.

## 4.4 Ghi âm/ghi hình buổi học (Session Recording)

**Mô tả:** Cung cấp khả năng ghi lại toàn bộ nội dung buổi học (video, âm thanh, chia sẻ màn hình, bảng trắng) để học viên có thể xem lại bất cứ lúc nào, củng cố kiến thức hoặc xem lại phần đã bỏ lỡ.

**Tính năng chi tiết:**

*   **Bắt đầu và Kết thúc Ghi (Start/Stop Recording):**
    *   **Tên nút:** `Bắt đầu Ghi` (Start Recording) / `Dừng Ghi` (Stop Recording).
    *   **Quyền ghi:** Mặc định chỉ gia sư có quyền bắt đầu/dừng ghi hình.
    *   **Thông báo:** Khi bắt đầu ghi, tất cả người tham gia trong phòng học phải nhận được thông báo rõ ràng (ví dụ: một biểu tượng chấm đỏ nhấp nháy và thông báo "Buổi học đang được ghi lại"). Cần có sự đồng ý ngầm hoặc tùy chọn cài đặt yêu cầu sự đồng ý rõ ràng từ học viên/phụ huynh.
*   **Tùy chọn Ghi (Recording Options):**
    *   **Tên tính năng:** `Ghi Toàn bộ (Video + Audio + Screen)`: Ghi lại mọi thứ diễn ra.
    *   **Tên tính năng:** `Chỉ Ghi Âm thanh (Audio Only)`: Tùy chọn ghi lại âm thanh của buổi học, tạo ra file nhỏ hơn, tiết kiệm dung lượng lưu trữ.
*   **Lưu trữ và Truy cập (Storage & Access):**
    *   **Lưu trữ:** Bản ghi được xử lý và lưu trữ an toàn trên máy chủ của AITHEduConnect.
    *   **Thời gian lưu trữ:** Quy định rõ thời gian lưu trữ tối thiểu (ví dụ: 30 ngày, 60 ngày) hoặc cho phép lưu trữ lâu hơn với các gói nâng cao.
    *   **Truy cập bản ghi:** Sau buổi học, liên kết xem lại bản ghi sẽ có sẵn trong trang Lịch sử buổi học của học viên và gia sư đã tham gia buổi học đó.
    *   **Kiểm soát quyền truy cập:** Chỉ những người đã tham gia buổi học mới có quyền xem lại bản ghi. Không chia sẻ công khai.
*   **Xem lại Bản ghi (Playback):**
    *   **Trình phát tích hợp:** Cung cấp trình phát video/audio trực tiếp trên nền tảng.
    *   **Tùy chọn tải xuống:** Cho phép học viên (và gia sư) tải về bản ghi để xem ngoại tuyến (có thể là tính năng tùy chọn hoặc trả phí).
    *   **Chỉ mục thời gian (Timestamps/Chapters - Nâng cao):** Nếu có thể, tự động hoặc cho phép gia sư đánh dấu các mốc thời gian quan trọng trong bản ghi (ví dụ: bắt đầu phần lý thuyết mới, giải bài tập khó) để dễ dàng điều hướng khi xem lại.

## 4.5 Chat và ghi chú (Chat & Notes)

**Mô tả:** Cung cấp các kênh giao tiếp bằng văn bản và công cụ ghi chú trong suốt buổi học để trao đổi nhanh, đặt câu hỏi, chia sẻ liên kết hoặc ghi lại những điểm quan trọng.

**Tính năng chi tiết:**

*   **Hệ thống Chat (Chat System):**
    *   **Tên tính năng:** `Chat Chung (Public Chat)`
    *   **Mô tả:** Khung chat hiển thị cho tất cả mọi người trong phòng học. Dùng để thông báo chung, đặt câu hỏi công khai, thảo luận.
    *   **Tên tính năng:** `Chat Riêng (Private Chat)`
    *   **Mô tả:** Cho phép người tham gia gửi tin nhắn riêng tư cho một người khác trong phòng học (ví dụ: học viên hỏi riêng gia sư, gia sư nhắc nhở riêng học viên).
    *   **Chức năng:** Hỗ trợ gửi văn bản, biểu tượng cảm xúc (emoji), chia sẻ liên kết (tự động nhận diện và tạo hyperlink), tải lên và chia sẻ hình ảnh nhanh.
    *   **Lưu lịch sử chat:** Lịch sử chat của buổi học được lưu lại và có thể xem lại cùng với bản ghi buổi học.
*   **Hệ thống Ghi chú (Note-taking System):**
    *   **Tên tính năng:** `Ghi chú Cá nhân (Personal Notes)`
    *   **Mô tả:** Mỗi người tham gia có một không gian ghi chú riêng tư, không chia sẻ với người khác. Dùng để tự ghi lại những điểm cần nhớ trong buổi học.
    *   **Tên tính năng:** `Ghi chú Chung (Shared Notes)`
    *   **Mô tả:** Một không gian ghi chú chung mà cả gia sư và học viên (được cấp quyền) có thể cùng nhau chỉnh sửa. Hữu ích để tóm tắt bài học, liệt kê bài tập về nhà, hoặc brainstorm ý tưởng.
    *   **Định dạng:** Hỗ trợ định dạng văn bản cơ bản (đậm, nghiêng, gạch đầu dòng).
    *   **Lưu và Xuất:** Nội dung ghi chú (cả cá nhân và chung) được lưu lại sau buổi học. Cung cấp tùy chọn xuất ghi chú ra các định dạng phổ biến như văn bản thuần túy (.txt), Markdown (.md) hoặc PDF.
*   **Đánh dấu Nội dung Quan trọng (Highlighting/Bookmarking):**
    *   **Tên tính năng:** `Đánh dấu Tin nhắn/Ghi chú`
    *   **Mô tả:** Cho phép người dùng đánh dấu các tin nhắn chat hoặc đoạn ghi chú quan trọng để dễ dàng tìm lại sau này.


---



# Phần 5: Hệ thống thanh toán và quản lý điểm (Payment & Credit System)

Phân hệ này quản lý toàn bộ luồng tài chính trên nền tảng, từ việc học viên nạp tiền mua "Điểm" (Credit) - đơn vị tiền tệ nội bộ dùng để thanh toán cho các buổi học, đến việc quản lý giao dịch và cuối cùng là thanh toán thu nhập cho gia sư sau khi trừ phí hoa hồng. Hệ thống cần đảm bảo tính minh bạch, an toàn, tiện lợi và phù hợp với các phương thức thanh toán phổ biến tại Việt Nam.

## 5.1 Hệ thống điểm (Credit System)

**Mô tả:** Sử dụng một hệ thống điểm trả trước (prepaid credits) làm đơn vị trung gian để thanh toán cho các buổi học. Điều này giúp đơn giản hóa giao dịch, tạo cơ hội cho các chương trình khuyến mãi và quản lý dòng tiền hiệu quả hơn. Giá trị của điểm cần được định nghĩa rõ ràng và dễ hiểu đối với người dùng.

**Tính năng chi tiết:**

*   **Định nghĩa và Quy đổi Điểm (Credit Definition & Conversion):**
    *   **Tên đơn vị:** `Điểm` (Credit)
    *   **Tỷ lệ quy đổi cơ bản:** Cần xác định một tỷ lệ quy đổi gốc, ví dụ: `1 Điểm = 20.000 VNĐ`. Tỷ lệ này cần được hiển thị rõ ràng tại trang nạp điểm.
    *   **Hiển thị số dư:** Số dư điểm hiện có của học viên/phụ huynh được hiển thị nổi bật tại khu vực tài khoản cá nhân (ví dụ: trên thanh điều hướng hoặc trong dashboard).
*   **Gói Nạp Điểm (Credit Packages):**
    *   **Tên tính năng:** `Mua Gói Điểm`
    *   **Mô tả:** Cung cấp nhiều gói nạp điểm với các mệnh giá khác nhau, kèm theo ưu đãi giảm giá hoặc tặng thêm điểm khi mua gói lớn hơn để khuyến khích người dùng nạp nhiều.
    *   **Ví dụ các gói (cần được xác nhận lại về giá):**
        *   `Gói Tiết Kiệm`: 500.000 VNĐ = 25 Điểm (Giá gốc: 20.000 VNĐ/Điểm)
        *   `Gói Thông Dụng`: 900.000 VNĐ = 50 Điểm (Ưu đãi: 18.000 VNĐ/Điểm)
        *   `Gói Ưu Đãi`: 1.600.000 VNĐ = 100 Điểm (Ưu đãi: 16.000 VNĐ/Điểm)
        *   `Gói Tùy Chọn`: Cho phép người dùng nhập số tiền muốn nạp (với mức tối thiểu) và hệ thống tự quy đổi ra điểm theo tỷ lệ gốc.
    *   **Hiển thị rõ ràng:** Mỗi gói cần ghi rõ số tiền VNĐ, số Điểm nhận được và giá trị quy đổi tương ứng (hoặc % ưu đãi).
*   **Điểm Thưởng và Khuyến mãi (Bonus & Promotional Credits):**
    *   **Tên tính năng:** `Điểm Thưởng Giới thiệu (Referral Bonus)`
    *   **Mô tả:** Tặng một lượng điểm nhất định cho cả người giới thiệu và người được giới thiệu khi người được giới thiệu đăng ký thành công và/hoặc hoàn thành buổi học đầu tiên.
    *   **Tên tính năng:** `Điểm Khuyến mãi (Promotional Credits)`
    *   **Mô tả:** Tặng điểm trong các chương trình khuyến mãi đặc biệt (ví dụ: dịp lễ, Tết, sinh nhật nền tảng, nạp lần đầu...). Điểm khuyến mãi có thể có hạn sử dụng ngắn hơn.
    *   **Phân biệt:** Hệ thống cần phân biệt rõ ràng giữa điểm gốc (mua bằng tiền) và điểm thưởng/khuyến mãi (có thể có điều kiện sử dụng hoặc hạn sử dụng khác nhau).
*   **Hạn sử dụng Điểm (Credit Expiry):**
    *   **Tên tính năng:** `Hạn sử dụng Điểm`
    *   **Mô tả:** Quy định thời hạn sử dụng cho điểm đã nạp (ví dụ: 6 tháng, 12 tháng kể từ ngày nạp) để khuyến khích sử dụng và tránh tồn đọng điểm không hoạt động. Điểm thưởng/khuyến mãi có thể có hạn sử dụng ngắn hơn.
    *   **Thông báo hết hạn:** Hệ thống tự động gửi thông báo (email/in-app) cho người dùng khi điểm sắp hết hạn (ví dụ: trước 30 ngày, trước 7 ngày).

## 5.2 Phương thức thanh toán (Payment Methods)

**Mô tả:** Tích hợp đa dạng các cổng thanh toán trực tuyến phổ biến và an toàn tại Việt Nam để người dùng có thể dễ dàng nạp điểm vào tài khoản.

**Tính năng chi tiết:**

*   **Tích hợp Cổng thanh toán (Payment Gateway Integration):**
    *   **Yêu cầu:** Lựa chọn các nhà cung cấp cổng thanh toán uy tín tại Việt Nam (ví dụ: VNPay, Momo, ZaloPay, OnePay, Napas...) có hỗ trợ nhiều phương thức.
*   **Các phương thức hỗ trợ:**
    *   **Tên phương thức:** `Thẻ Tín dụng/Ghi nợ Quốc tế (International Cards)`: Hỗ trợ các loại thẻ phổ biến như Visa, Mastercard, JCB.
    *   **Tên phương thức:** `Thẻ ATM Nội địa/Internet Banking (Domestic Cards/Banking)`: Hỗ trợ thanh toán qua thẻ ATM của các ngân hàng nội địa thông qua cổng Napas hoặc Internet Banking trực tiếp.
    *   **Tên phương thức:** `Ví điện tử (E-wallets)`: Tích hợp các ví điện tử được ưa chuộng nhất tại Việt Nam như Momo, ZaloPay, VNPay Wallet, ShopeePay...
    *   **Tên phương thức:** `Quét mã QR (QR Code Payment)`: Hỗ trợ thanh toán nhanh bằng cách quét mã QR qua ứng dụng ngân hàng hoặc ví điện tử (thường được cung cấp bởi cổng VNPay).
    *   **Tên phương thức:** `Chuyển khoản Ngân hàng (Manual Bank Transfer - Hạn chế)`: Có thể cung cấp như một phương án dự phòng, nhưng cần quy trình đối soát thủ công hoặc bán tự động, ít được khuyến khích do tốn thời gian và dễ sai sót.
*   **Bảo mật Thanh toán (Payment Security):**
    *   **Tuân thủ PCI DSS:** Đảm bảo toàn bộ quy trình xử lý thông tin thẻ tuân thủ tiêu chuẩn bảo mật PCI DSS (Payment Card Industry Data Security Standard). Nền tảng không lưu trữ trực tiếp thông tin thẻ nhạy cảm của người dùng mà xử lý qua cổng thanh toán.
    *   **Mã hóa:** Sử dụng mã hóa SSL/TLS cho toàn bộ quá trình giao dịch.
    *   **Xác thực giao dịch:** Áp dụng các biện pháp xác thực bổ sung như OTP qua SMS/Email hoặc xác thực qua ứng dụng ngân hàng/ví điện tử.
*   **Lưu thông tin Thanh toán (Saved Payment Methods - Optional):**
    *   **Tên tính năng:** `Lưu thẻ/ví để thanh toán sau`
    *   **Mô tả:** Cho phép người dùng (sau khi đồng ý) lưu lại thông tin thẻ hoặc liên kết ví điện tử một cách an toàn (thông qua cơ chế tokenization của cổng thanh toán) để các lần nạp điểm sau diễn ra nhanh chóng hơn. Người dùng có quyền quản lý và xóa các phương thức đã lưu.
*   **Hóa đơn và Xác nhận (Invoicing & Confirmation):**
    *   **Tên tính năng:** `Hóa đơn Điện tử`
    *   **Mô tả:** Sau mỗi giao dịch nạp điểm thành công, hệ thống tự động tạo và gửi hóa đơn điện tử (hoặc phiếu xác nhận giao dịch) đến email của người dùng. Hóa đơn cần ghi rõ thông tin giao dịch, số điểm đã nạp.
    *   **Thông báo thành công:** Hiển thị thông báo xác nhận giao dịch thành công ngay trên giao diện web/app và cập nhật số dư điểm ngay lập tức.

## 5.3 Quản lý giao dịch (Transaction Management)

**Mô tả:** Cung cấp cho người dùng (học viên, phụ huynh) và quản trị viên hệ thống khả năng theo dõi, quản lý và kiểm soát tất cả các giao dịch liên quan đến điểm và thanh toán một cách minh bạch và chi tiết.

**Tính năng chi tiết:**

*   **Lịch sử Giao dịch (Transaction History):**
    *   **Tên tính năng:** `Lịch sử Điểm` (Credit History) / `Lịch sử Giao dịch` (Transaction History)
    *   **Mô tả:** Hiển thị danh sách chi tiết tất cả các giao dịch làm thay đổi số dư điểm của người dùng, bao gồm:
        *   `Nạp điểm`: Ngày giờ, số tiền VNĐ, số điểm nạp, phương thức thanh toán, mã giao dịch.
        *   `Thanh toán buổi học`: Ngày giờ, tên gia sư, môn học, số điểm bị trừ, mã buổi học.
        *   `Hoàn điểm`: Ngày giờ, lý do hoàn (hủy lịch hợp lệ, khiếu nại...), số điểm được hoàn, mã buổi học liên quan.
        *   `Điểm thưởng/khuyến mãi`: Ngày giờ, lý do nhận điểm, số điểm nhận, hạn sử dụng (nếu có).
        *   `Điểm hết hạn`: Ngày giờ, số điểm bị hết hạn.
    *   **Bộ lọc & Tìm kiếm:** Cho phép lọc lịch sử theo loại giao dịch (nạp, trừ, hoàn, thưởng...), theo khoảng thời gian, tìm kiếm theo mã giao dịch hoặc tên gia sư.
*   **Báo cáo Chi tiêu (Spending Reports):**
    *   **Tên tính năng:** `Thống kê Chi tiêu`
    *   **Mô tả:** Cung cấp các báo cáo trực quan (biểu đồ cột, tròn) tóm tắt tình hình chi tiêu điểm theo thời gian (tuần, tháng, năm), theo môn học, hoặc theo từng gia sư. Giúp người dùng quản lý ngân sách học tập hiệu quả hơn.
    *   **Xuất báo cáo:** Cho phép xuất dữ liệu lịch sử giao dịch hoặc báo cáo chi tiêu ra file (CSV, Excel) để lưu trữ hoặc phân tích thêm.
*   **Chính sách và Quy trình Hoàn tiền (Refund Policy & Process):**
    *   **Tên tính năng:** `Yêu cầu Hoàn điểm`
    *   **Mô tả:** Xây dựng chính sách hoàn điểm rõ ràng, công bằng cho các trường hợp như: buổi học bị hủy bởi gia sư, hủy lịch bởi học viên trong thời gian cho phép, chất lượng buổi học không đảm bảo (sau khi được xác minh qua khiếu nại).
    *   **Hoàn tiền tự động:** Tự động hoàn điểm cho các trường hợp hủy lịch hợp lệ theo chính sách.
    *   **Hoàn tiền thủ công:** Quy trình xử lý các yêu cầu hoàn điểm phức tạp hơn thông qua bộ phận hỗ trợ khách hàng.
*   **Giải quyết Tranh chấp Thanh toán (Payment Dispute Resolution):**
    *   **Tên tính năng:** `Khiếu nại về Giao dịch`
    *   **Mô tả:** Cung cấp kênh để người dùng gửi khiếu nại liên quan đến các giao dịch bị lỗi, bị trừ điểm không chính xác, hoặc các vấn đề thanh toán khác. Xây dựng quy trình tiếp nhận, xác minh và xử lý khiếu nại một cách nhanh chóng và minh bạch.

## 5.4 Thanh toán cho gia sư (Tutor Payout)

**Mô tả:** Thiết lập một quy trình tự động, minh bạch và đáng tin cậy để thanh toán thu nhập cho gia sư sau khi họ hoàn thành các buổi dạy, dựa trên số điểm họ kiếm được trừ đi phí hoa hồng của nền tảng.

**Tính năng chi tiết:**

*   **Tính toán Thu nhập (Income Calculation):**
    *   **Mô tả:** Sau mỗi buổi học hoàn thành, hệ thống tự động ghi nhận số điểm tương ứng vào tài khoản thu nhập tạm tính của gia sư.
    *   **Phí hoa hồng (Commission Fee):** Áp dụng một tỷ lệ phí hoa hồng cố định (ví dụ: 10% - 20% tùy chính sách kinh doanh) trên số điểm kiếm được từ mỗi buổi học. Tỷ lệ này cần được công bố rõ ràng cho gia sư.
    *   **Công thức:** `Thu nhập thực nhận (Điểm) = Tổng điểm buổi học - (Tổng điểm buổi học * Tỷ lệ hoa hồng)`.
    *   **Quy đổi sang VNĐ:** Khi đến kỳ thanh toán, tổng số điểm thực nhận sẽ được quy đổi sang VNĐ theo một tỷ lệ cố định (có thể khác tỷ lệ nạp điểm của học viên, cần công bố rõ, ví dụ: 1 Điểm = 15.000 VNĐ).
*   **Phương thức Nhận tiền (Payout Methods):**
    *   **Tên tính năng:** `Cài đặt Thanh toán`
    *   **Mô tả:** Gia sư cần cung cấp thông tin tài khoản ngân hàng hoặc ví điện tử (Momo, ZaloPay...) để nhận thanh toán trong phần cài đặt tài khoản của mình. Hệ thống cần xác minh tính hợp lệ của thông tin này.
    *   **Ưu tiên:** Ưu tiên chuyển khoản ngân hàng trực tiếp tại Việt Nam. Hỗ trợ thêm ví điện tử phổ biến.
*   **Lịch Thanh toán (Payout Schedule):**
    *   **Tên tính năng:** `Chu kỳ Thanh toán`
    *   **Mô tả:** Thiết lập các chu kỳ thanh toán cố định cho gia sư (ví dụ: hàng tuần, hai tuần một lần, hàng tháng vào một ngày cụ thể). Gia sư có thể được chọn chu kỳ mong muốn (nếu có nhiều lựa chọn).
    *   **Ngưỡng thanh toán tối thiểu (Minimum Payout Threshold):** Có thể đặt ra một ngưỡng thu nhập tối thiểu (ví dụ: 200.000 VNĐ) để thực hiện thanh toán, nhằm giảm chi phí giao dịch cho các khoản tiền nhỏ.
*   **Báo cáo Thu nhập (Income Reports):**
    *   **Tên tính năng:** `Thống kê Thu nhập`
    *   **Mô tả:** Cung cấp cho gia sư một bảng điều khiển (dashboard) chi tiết hiển thị:
        *   Thu nhập tạm tính (chưa đến kỳ thanh toán).
        *   Lịch sử các khoản thanh toán đã nhận.
        *   Chi tiết thu nhập từ từng buổi học (số điểm gốc, phí hoa hồng, điểm thực nhận).
        *   Tổng thu nhập theo các khoảng thời gian (tuần, tháng, năm).
    *   **Xuất báo cáo:** Cho phép gia sư xuất báo cáo thu nhập chi tiết ra file (CSV, Excel) để phục vụ mục đích thuế hoặc quản lý tài chính cá nhân.
*   **Thông báo Thanh toán (Payout Notifications):**
    *   **Mô tả:** Hệ thống tự động gửi thông báo (email/in-app) cho gia sư khi có một khoản thanh toán mới được thực hiện, kèm theo thông tin chi tiết về số tiền và kỳ thanh toán.
*   **Theo dõi Trạng thái Thanh toán (Payout Status Tracking):**
    *   **Mô tả:** Cho phép gia sư theo dõi trạng thái của các khoản thanh toán đang chờ xử lý (Pending), đang thực hiện (Processing), đã hoàn thành (Completed) hoặc thất bại (Failed - kèm lý do).


---



# Phần 6: Lớp học nhóm (Group Classes)

Ngoài hình thức học 1:1, AITHEduConnect cung cấp tính năng Lớp học nhóm, cho phép gia sư tạo ra các khóa học hoặc buổi học chuyên đề với nhiều học viên tham gia cùng lúc. Tính năng này mở rộng cơ hội thu nhập cho gia sư, cung cấp lựa chọn học tập tiết kiệm hơn cho học viên, và tạo môi trường học tập tương tác, cộng tác.

## 6.1 Tạo lớp học nhóm (Create Group Class)

**Mô tả:** Cung cấp công cụ cho phép gia sư dễ dàng thiết lập, cấu hình và quảng bá các lớp học nhóm của mình trên nền tảng.

**Tính năng chi tiết:**

*   **Thiết lập Thông tin Cơ bản (Basic Class Setup):**
    *   **Tên trường:** `Tên Lớp học (Class Title)`: Đặt tên hấp dẫn, rõ ràng về nội dung (ví dụ: "Khóa học Lấy gốc Hình học lớp 9", "Workshop Kỹ năng Viết CV Tiếng Anh", "Lớp Luyện nói IELTS Chủ đề Gia đình").
    *   **Tên trường:** `Mô tả Chi tiết (Detailed Description)`: Cung cấp mô tả đầy đủ về nội dung khóa học, mục tiêu học tập, đối tượng phù hợp, yêu cầu đầu vào (nếu có), và những gì học viên sẽ nhận được sau khóa học.
    *   **Tên trường:** `Môn học & Cấp độ (Subject & Level)`: Chọn môn học và cấp độ tương ứng từ danh sách chuẩn hóa của hệ thống.
    *   **Tên trường:** `Ảnh bìa Lớp học (Class Cover Image)`: Cho phép tải lên hình ảnh đại diện cho lớp học, hiển thị trên trang chi tiết và kết quả tìm kiếm.
*   **Cấu hình Lớp học (Class Configuration):**
    *   **Tên trường:** `Số lượng Học viên Tối đa (Max Students)`: Gia sư đặt giới hạn số lượng học viên có thể tham gia (ví dụ: 5-15 người, tùy thuộc vào tính chất lớp học và khả năng quản lý của gia sư).
    *   **Tên trường:** `Lịch học (Schedule)`: Thiết lập lịch trình cho lớp học:
        *   `Buổi học Một lần (Single Session)`: Chọn ngày và giờ cụ thể cho một buổi học duy nhất (workshop, chuyên đề).
        *   `Nhiều Buổi học (Multiple Sessions)`: Thiết lập lịch học định kỳ (ví dụ: Thứ 3, 5 hàng tuần từ 19:00-20:30 trong 8 tuần). Cung cấp giao diện lịch để chọn ngày giờ, tần suất lặp lại.
    *   **Tên trường:** `Giá mỗi Học viên (Price per Student)`: Đặt mức giá (bằng Điểm) mà mỗi học viên cần trả để tham gia toàn bộ lớp học (nếu là khóa nhiều buổi) hoặc cho một buổi học (nếu là lớp đơn lẻ).
    *   **Tên trường:** `Chế độ Lớp học (Class Mode)`:
        *   `Công khai (Public)`: Lớp học sẽ hiển thị trong kết quả tìm kiếm và bất kỳ ai đủ điều kiện đều có thể đăng ký.
        *   `Riêng tư (Private)`: Lớp học không hiển thị công khai, chỉ những học viên nhận được liên kết mời trực tiếp từ gia sư mới có thể đăng ký.
*   **Chuẩn bị Nội dung (Content Preparation):**
    *   **Tên tính năng:** `Tải lên Tài liệu Học trước (Pre-class Materials Upload)`
    *   **Mô tả:** Cho phép gia sư tải lên các tài liệu (slide bài giảng, bài đọc, bài tập...) mà học viên cần xem trước hoặc chuẩn bị trước khi buổi học đầu tiên diễn ra.
*   **Công cụ Quảng bá (Promotional Tools):**
    *   **Tên tính năng:** `Tạo Mã giảm giá (Discount Codes)`
    *   **Mô tả:** Cho phép gia sư tạo các mã giảm giá (ví dụ: giảm 10%, giảm 50 Điểm) cho lớp học của mình để thu hút học viên đăng ký sớm hoặc trong các chiến dịch quảng bá riêng.
    *   **Tên tính năng:** `Chia sẻ Lớp học (Share Class)`
    *   **Mô tả:** Cung cấp nút chia sẻ để gia sư dễ dàng gửi thông tin lớp học lên mạng xã hội (Facebook, Zalo) hoặc sao chép liên kết để gửi trực tiếp.

## 6.2 Đăng ký lớp học nhóm (Register for Group Class)

**Mô tả:** Cho phép học viên tìm kiếm, xem thông tin chi tiết và đăng ký tham gia các lớp học nhóm phù hợp với nhu cầu và sở thích của mình.

**Tính năng chi tiết:**

*   **Tìm kiếm Lớp học (Class Search):**
    *   **Tên tính năng:** `Tìm kiếm Lớp học Nhóm`
    *   **Mô tả:** Tích hợp bộ lọc lớp học nhóm vào hệ thống tìm kiếm chung hoặc tạo một trang tìm kiếm riêng cho lớp học nhóm. Các bộ lọc tương tự tìm kiếm gia sư (Môn học, Cấp độ, Thời gian, Giá...) nhưng áp dụng cho lớp học.
*   **Xem Thông tin Lớp học (View Class Details):**
    *   **Tên tính năng:** `Trang Chi tiết Lớp học`
    *   **Mô tả:** Hiển thị đầy đủ thông tin về lớp học: Tên lớp, Ảnh bìa, Mô tả chi tiết, Thông tin gia sư (có link đến hồ sơ gia sư), Lịch học cụ thể, Giá, Số lượng học viên đã đăng ký / Số lượng tối đa, Đánh giá lớp học (nếu đã có các khóa trước).
*   **Quy trình Đăng ký (Registration Process):**
    *   **Nút hành động:** `Đăng ký Ngay` (Enroll Now) / `Thêm vào Giỏ hàng` (Add to Cart - nếu muốn đăng ký nhiều lớp cùng lúc).
    *   **Xác nhận và Thanh toán:** Hiển thị tóm tắt thông tin lớp học và số điểm cần thanh toán. Yêu cầu xác nhận và trừ điểm từ ví học viên.
    *   **Thông báo Xác nhận:** Gửi thông báo (email/in-app) xác nhận đăng ký thành công, kèm theo lịch học chi tiết và liên kết truy cập tài liệu (nếu có).
*   **Quản lý Lớp đã Đăng ký (Manage Enrolled Classes):**
    *   **Tên tính năng:** `Lớp học của tôi` (My Classes)
    *   **Mô tả:** Học viên có một khu vực riêng để xem danh sách các lớp học nhóm đã đăng ký, lịch học sắp tới, truy cập tài liệu và tham gia phòng học ảo khi đến giờ.
*   **Hủy Đăng ký (Unenrollment):**
    *   **Tên tính năng:** `Hủy tham gia Lớp học`
    *   **Mô tả:** Cho phép học viên hủy đăng ký tham gia lớp học theo chính sách hủy của nền tảng hoặc của gia sư (ví dụ: hủy trước ngày bắt đầu bao nhiêu ngày được hoàn bao nhiêu % điểm). Chính sách cần được hiển thị rõ ràng trước khi đăng ký.
*   **Xem Danh sách Học viên khác (View Classmates - Optional):**
    *   **Tên tính năng:** `Xem bạn cùng lớp`
    *   **Mô tả:** Tùy thuộc vào cài đặt của gia sư và nền tảng, có thể cho phép học viên xem danh sách (tên/biệt danh) của những người cùng tham gia lớp học để tăng tính cộng đồng (cần cân nhắc yếu tố riêng tư).
*   **Đánh giá Lớp học (Rate Class):**
    *   **Mô tả:** Sau khi lớp học kết thúc, học viên được khuyến khích đánh giá về chất lượng lớp học (nội dung, phương pháp, sự tương tác, gia sư...). Đánh giá này sẽ hiển thị trên trang chi tiết lớp học cho các học viên sau tham khảo.

## 6.3 Công cụ tương tác nhóm (Group Interaction Tools)

**Mô tả:** Bổ sung các công cụ đặc thù vào Phòng học ảo khi diễn ra lớp học nhóm, nhằm thúc đẩy sự tham gia, tương tác và cộng tác giữa các học viên, không chỉ giữa gia sư và học viên.

**Tính năng chi tiết:**

*   **Chia nhóm nhỏ (Breakout Rooms):**
    *   **Tên tính năng:** `Phòng Thảo luận Nhóm`
    *   **Mô tả:** Cho phép gia sư chia lớp học thành các nhóm nhỏ hơn (tự động hoặc thủ công) để thảo luận, làm bài tập nhóm trong một khoảng thời gian nhất định. Mỗi nhóm nhỏ có không gian video/audio và bảng trắng riêng. Gia sư có thể di chuyển giữa các phòng để hỗ trợ.
*   **Công cụ Thảo luận & Brainstorming:**
    *   **Tên tính năng:** `Bảng trắng Cộng tác Nhóm`
    *   **Mô tả:** Cho phép nhiều học viên cùng lúc viết, vẽ, dán ý tưởng lên bảng trắng chung hoặc bảng trắng của nhóm nhỏ.
    *   **Tên tính năng:** `Ghi chú Chung Nâng cao`
    *   **Mô tả:** Phiên bản nâng cao của Ghi chú chung, hỗ trợ nhiều người cùng chỉnh sửa, có thể dùng để tổng hợp ý kiến, lập kế hoạch.
*   **Thu thập Ý kiến Nhanh (Quick Feedback & Polling):**
    *   **Tên tính năng:** `Bình chọn Nhanh (Quick Polls)`
    *   **Mô tả:** Gia sư có thể tạo nhanh các câu hỏi trắc nghiệm hoặc câu hỏi Đúng/Sai để kiểm tra mức độ hiểu bài hoặc thu thập ý kiến của cả lớp. Kết quả có thể hiển thị ẩn danh hoặc công khai.
    *   **Tên tính năng:** `Khảo sát Ngắn (Short Surveys)`
    *   **Mô tả:** Tạo các khảo sát ngắn với nhiều loại câu hỏi hơn để lấy phản hồi chi tiết hơn từ học viên.
*   **Quản lý Câu hỏi (Q&A Management):**
    *   **Tên tính năng:** `Đặt câu hỏi Ẩn danh (Anonymous Q&A)`
    *   **Mô tả:** Cho phép học viên đặt câu hỏi mà không cần hiển thị tên, khuyến khích những người còn e ngại tham gia.
    *   **Tên tính năng:** `Xếp hàng Câu hỏi (Q&A Queue)`
    *   **Mô tả:** Hệ thống hóa các câu hỏi được đặt ra, cho phép gia sư dễ dàng quản lý và trả lời lần lượt. Học viên khác có thể "upvote" các câu hỏi mà họ cũng quan tâm.
*   **Gamification (Trò chơi hóa):**
    *   **Tên tính năng:** `Bảng xếp hạng Tương tác (Engagement Leaderboard)`
    *   **Mô tả:** Tùy chọn, hiển thị bảng xếp hạng dựa trên mức độ tham gia của học viên (trả lời câu hỏi, phát biểu, hoàn thành nhiệm vụ...) để tạo không khí thi đua, vui vẻ.
    *   **Tên tính năng:** `Điểm thưởng/Huy hiệu (Points/Badges)`: Tặng điểm hoặc huy hiệu ảo cho các hoạt động tích cực trong lớp.
*   **Chia sẻ Màn hình Đồng thời (Simultaneous Screen Sharing - Nâng cao):**
    *   **Mô tả:** Trong một số trường hợp (ví dụ: lớp học lập trình, thiết kế), có thể cho phép nhiều học viên chia sẻ màn hình của họ cùng lúc (hiển thị dưới dạng các cửa sổ nhỏ) để gia sư và các bạn khác cùng xem và góp ý.

## 6.4 Quản lý lớp học (Class Management - for Tutors)

**Mô tả:** Cung cấp các công cụ cần thiết để gia sư quản lý lớp học nhóm một cách hiệu quả, từ việc theo dõi học viên, giao bài tập đến việc báo cáo và phân tích.

**Tính năng chi tiết:**

*   **Quản lý Học viên (Student Management):**
    *   **Tên tính năng:** `Danh sách Học viên Lớp`
    *   **Mô tả:** Xem danh sách tất cả học viên đã đăng ký lớp học, trạng thái thanh toán, thông tin liên hệ cơ bản.
    *   **Tên tính năng:** `Điểm danh (Attendance Tracking)`
    *   **Mô tả:** Cung cấp công cụ điểm danh tự động (dựa trên việc tham gia phòng học ảo) và thủ công. Lưu lại lịch sử tham dự của từng học viên.
    *   **Tên tính năng:** `Tắt tiếng/Mời rời khỏi lớp (Mute/Remove Student)`: Gia sư có quyền tắt tiếng học viên gây ồn hoặc mời học viên có hành vi không phù hợp ra khỏi lớp học.
*   **Giao tiếp và Thông báo (Communication & Announcements):**
    *   **Tên tính năng:** `Gửi Thông báo cho Cả lớp`
    *   **Mô tả:** Cho phép gia sư gửi thông báo quan trọng (ví dụ: thay đổi lịch học, nhắc nhở bài tập) đến tất cả học viên đã đăng ký qua email/thông báo trong ứng dụng.
*   **Bài tập và Đánh giá (Assignments & Assessment):**
    *   **Tên tính năng:** `Giao Bài tập về nhà`
    *   **Mô tả:** Cho phép gia sư giao bài tập (dạng file đính kèm hoặc mô tả text), đặt hạn nộp bài.
    *   **Tên tính năng:** `Nộp Bài tập Trực tuyến`
    *   **Mô tả:** Học viên có thể nộp bài làm của mình (tải lên file) trực tiếp trên nền tảng.
    *   **Tên tính năng:** `Chấm điểm và Phản hồi Bài tập`
    *   **Mô tả:** Gia sư có thể xem bài nộp, cho điểm và gửi phản hồi riêng cho từng học viên.
*   **Quản lý Tài liệu (Material Management):**
    *   **Tên tính năng:** `Thư viện Tài liệu Lớp học`
    *   **Mô tả:** Khu vực để gia sư tải lên, sắp xếp và quản lý tất cả tài liệu liên quan đến lớp học (bài giảng, bài tập, tài liệu tham khảo...). Học viên có thể truy cập và tải về.
*   **Báo cáo và Phân tích (Reporting & Analytics):**
    *   **Tên tính năng:** `Báo cáo Tổng kết Buổi học`
    *   **Mô tả:** Sau mỗi buổi học nhóm, hệ thống có thể tự động tạo báo cáo tóm tắt (số người tham dự, thời lượng, các hoạt động chính...).
    *   **Tên tính năng:** `Phân tích Tương tác Học viên`
    *   **Mô tả:** Cung cấp cho gia sư cái nhìn tổng quan về mức độ tham gia và tương tác của học viên trong lớp (ai hay phát biểu, ai hoàn thành bài tập...) để điều chỉnh phương pháp giảng dạy phù hợp.
*   **Lưu trữ Lịch sử Lớp học (Class History Archive):**
    *   **Mô tả:** Lưu trữ lại toàn bộ thông tin của các lớp học đã kết thúc (danh sách học viên, tài liệu, bản ghi buổi học - nếu có, lịch sử chat...) để gia sư có thể tham khảo lại khi cần.


---



# Phần 7: Đánh giá và phản hồi (Rating & Feedback)

Phân hệ này đóng vai trò quan trọng trong việc xây dựng lòng tin, đảm bảo chất lượng dịch vụ và thúc đẩy sự cải thiện liên tục trên nền tảng. Nó bao gồm hệ thống đánh giá hai chiều giữa gia sư và học viên, cơ chế báo cáo tiến độ học tập, và quy trình xử lý phản hồi, khiếu nại một cách hiệu quả.

## 7.1 Hệ thống đánh giá (Rating System)

**Mô tả:** Cung cấp một cơ chế minh bạch và công bằng để học viên và gia sư đánh giá lẫn nhau sau mỗi buổi học hoặc khóa học hoàn thành. Hệ thống đánh giá này là nguồn thông tin tham khảo quan trọng cho người dùng khác và là động lực để gia sư duy trì chất lượng giảng dạy.

**Tính năng chi tiết:**

*   **Đánh giá Hai chiều (Two-way Rating):**
    *   **Tên tính năng:** `Đánh giá Gia sư` (Rate Tutor) / `Đánh giá Học viên` (Rate Student)
    *   **Mô tả:** Sau khi một buổi học 1:1 hoặc lớp học nhóm kết thúc, cả gia sư và học viên (hoặc phụ huynh đại diện) đều được khuyến khích (và có thể là bắt buộc sau một khoảng thời gian nhất định) để lại đánh giá cho đối phương.
    *   **Ẩn danh tương đối:** Đánh giá của bên này chỉ hiển thị sau khi bên kia cũng đã gửi đánh giá, hoặc sau một khoảng thời gian nhất định (ví dụ: 7 ngày), để tránh việc đánh giá bị ảnh hưởng bởi đánh giá của người kia.
*   **Thang điểm và Tiêu chí (Rating Scale & Criteria):**
    *   **Tên tính năng:** `Đánh giá Sao (Star Rating)`
    *   **Mô tả:** Sử dụng thang điểm 5 sao trực quan để đánh giá tổng thể về buổi học/gia sư/học viên.
    *   **Tên tính năng:** `Đánh giá theo Tiêu chí Chi tiết (Detailed Criteria Rating - Dành cho Học viên đánh giá Gia sư)`
    *   **Mô tả:** Ngoài đánh giá sao tổng thể, học viên có thể đánh giá gia sư dựa trên các tiêu chí cụ thể hơn (cũng có thể dùng thang 5 sao hoặc các mức độ như Tốt/Khá/Trung bình/Yếu):
        *   `Kiến thức Chuyên môn`: Mức độ am hiểu và chính xác về nội dung giảng dạy.
        *   `Phương pháp Giảng dạy`: Cách truyền đạt có dễ hiểu, logic, thu hút không?
        *   `Thái độ & Sự nhiệt tình`: Gia sư có thân thiện, kiên nhẫn, tạo động lực không?
        *   `Khả năng Tương tác`: Mức độ tương tác, khuyến khích học viên tham gia.
        *   `Sự chuẩn bị & Tài liệu`: Bài giảng có được chuẩn bị kỹ lưỡng, tài liệu có hữu ích không?
        *   `Đúng giờ & Chuyên nghiệp`: Gia sư có vào lớp đúng giờ, tác phong chuyên nghiệp không?
    *   **Tên tính năng:** `Đánh giá theo Tiêu chí Chi tiết (Detailed Criteria Rating - Dành cho Gia sư đánh giá Học viên)`
    *   **Mô tả:** Gia sư đánh giá học viên dựa trên các tiêu chí:
        *   `Thái độ Học tập`: Mức độ nghiêm túc, chủ động, ham học hỏi.
        *   `Mức độ Tương tác`: Khả năng tham gia vào bài học, đặt câu hỏi.
        *   `Sự chuẩn bị bài`: Mức độ hoàn thành bài tập, chuẩn bị bài trước khi vào lớp.
        *   `Tiến bộ`: Mức độ cải thiện qua các buổi học (nếu là học dài hạn).
*   **Bình luận Chi tiết (Detailed Comments):**
    *   **Tên tính năng:** `Viết Nhận xét`
    *   **Mô tả:** Bên cạnh đánh giá sao và tiêu chí, người dùng bắt buộc hoặc được khuyến khích mạnh mẽ viết thêm nhận xét bằng lời để giải thích rõ hơn cho điểm số của mình, chia sẻ trải nghiệm cụ thể hoặc góp ý xây dựng.
*   **Hiển thị Đánh giá (Rating Display):**
    *   **Trên Hồ sơ Gia sư:** Hiển thị điểm đánh giá trung bình tổng thể (số sao) và tổng số lượt đánh giá nhận được. Hiển thị danh sách các bình luận chi tiết từ học viên (có thể lọc/sắp xếp). Điểm đánh giá theo từng tiêu chí chi tiết có thể được tổng hợp và hiển thị dưới dạng biểu đồ hoặc điểm số trung bình cho từng tiêu chí.
    *   **Trên Hồ sơ Học viên:** Đánh giá từ gia sư thường không hiển thị công khai cho các gia sư khác xem (để đảm bảo tính riêng tư và tránh định kiến), nhưng có thể được sử dụng nội bộ bởi thuật toán gợi ý hoặc để phụ huynh theo dõi.
*   **Nhắc nhở Đánh giá (Rating Reminders):**
    *   **Mô tả:** Hệ thống tự động gửi thông báo (email/in-app) nhắc nhở người dùng thực hiện đánh giá sau khi buổi học kết thúc một khoảng thời gian (ví dụ: 1 giờ, 24 giờ).
*   **Xác minh và Chống gian lận (Verification & Anti-fraud):**
    *   **Tên tính năng:** `Chỉ người tham gia mới được đánh giá`
    *   **Mô tả:** Chỉ những tài khoản đã thực sự tham gia và hoàn thành buổi học mới có quyền đánh giá.
    *   **Tên tính năng:** `Hệ thống Phát hiện Đánh giá Giả mạo`
    *   **Mô tả:** Áp dụng các thuật toán hoặc quy tắc để phát hiện các hành vi đánh giá bất thường (ví dụ: nhiều đánh giá 5 sao hoặc 1 sao liên tục từ cùng một người dùng/IP trong thời gian ngắn, nội dung bình luận trùng lặp hoặc không liên quan...). Các đánh giá đáng ngờ sẽ được gắn cờ để quản trị viên xem xét.
    *   **Báo cáo Đánh giá không phù hợp:** Cho phép người dùng báo cáo các đánh giá mà họ cho là sai sự thật, có chứa ngôn từ công kích, hoặc vi phạm quy tắc cộng đồng. Quản trị viên sẽ xem xét và có hành động phù hợp (ẩn/xóa đánh giá, cảnh cáo người viết).

## 7.2 Báo cáo tiến độ (Progress Reports)

**Mô tả:** Cung cấp một cơ chế để gia sư ghi nhận và chia sẻ thông tin về tiến độ học tập của học viên sau mỗi buổi học hoặc định kỳ, giúp học viên và phụ huynh nắm bắt được tình hình, điểm mạnh, điểm yếu và định hướng cho các buổi học tiếp theo.

**Tính năng chi tiết:**

*   **Tạo Báo cáo (Report Creation - Dành cho Gia sư):**
    *   **Tên tính năng:** `Viết Báo cáo Buổi học`
    *   **Mô tả:** Sau mỗi buổi học (đặc biệt là các buổi học 1:1 hoặc các buổi học định kỳ), gia sư được yêu cầu hoặc khuyến khích điền vào một mẫu báo cáo tiến độ.
    *   **Nội dung Mẫu Báo cáo Chuẩn:**
        *   `Thông tin Buổi học`: Ngày giờ, Môn học, Chủ đề chính đã học.
        *   `Nội dung đã Hoàn thành`: Liệt kê các kiến thức, kỹ năng đã được học/luyện tập trong buổi.
        *   `Đánh giá Mức độ Hiểu bài`: Nhận xét của gia sư về khả năng tiếp thu của học viên đối với nội dung buổi học (ví dụ: Hiểu tốt, Cần ôn tập thêm, Chưa nắm vững...).
        *   `Điểm mạnh`: Nêu bật những điểm học viên đã làm tốt.
        *   `Điểm cần Cải thiện`: Chỉ ra những khó khăn, lỗi sai hoặc phần kiến thức học viên cần tập trung hơn.
        *   `Bài tập về nhà/Đề xuất Học tập`: Giao bài tập cụ thể hoặc gợi ý các hoạt động tự học thêm.
        *   `Kế hoạch cho Buổi học Tiếp theo (Optional)`: Đề xuất nội dung dự kiến cho buổi học sau.
*   **Gửi và Xem Báo cáo (Report Delivery & Viewing):**
    *   **Gửi tự động:** Sau khi gia sư hoàn thành và lưu báo cáo, hệ thống tự động gửi thông báo và bản báo cáo đến tài khoản của học viên và tài khoản phụ huynh (nếu có liên kết).
    *   **Lưu trữ và Truy cập:** Tất cả các báo cáo tiến độ được lưu trữ an toàn và có thể truy cập lại bất cứ lúc nào từ trang Lịch sử học tập của học viên hoặc Bảng điều khiển của phụ huynh.
*   **Theo dõi Tiến độ Dài hạn (Long-term Progress Tracking):**
    *   **Tên tính năng:** `Tổng hợp Tiến độ Học tập`
    *   **Mô tả:** Hệ thống tổng hợp thông tin từ các báo cáo định kỳ để tạo ra một cái nhìn tổng quan về sự tiến bộ của học viên theo thời gian.
    *   **Biểu đồ và Trực quan hóa:** Sử dụng biểu đồ đường, cột... để trực quan hóa sự cải thiện về điểm số (nếu có chấm điểm bài tập/kiểm tra), mức độ hoàn thành mục tiêu, hoặc các nhận xét định tính theo thời gian.
    *   **So sánh với Mục tiêu:** Đối chiếu tiến độ thực tế với mục tiêu học tập mà học viên đã đặt ra ban đầu.
*   **Phản hồi về Báo cáo (Feedback on Reports - Optional):**
    *   **Mô tả:** Có thể cho phép học viên hoặc phụ huynh để lại phản hồi ngắn gọn hoặc câu hỏi trực tiếp trên báo cáo để trao đổi thêm với gia sư.

## 7.3 Hệ thống phản hồi và khiếu nại (Feedback & Complaint System)

**Mô tả:** Xây dựng một kênh chính thức và quy trình rõ ràng để người dùng (học viên, phụ huynh, gia sư) có thể gửi phản hồi, góp ý về nền tảng hoặc báo cáo các vấn đề, khiếu nại gặp phải trong quá trình sử dụng dịch vụ. Hệ thống này giúp giải quyết sự cố kịp thời và thu thập thông tin để cải thiện sản phẩm.

**Tính năng chi tiết:**

*   **Kênh Tiếp nhận Phản hồi/Khiếu nại (Submission Channels):**
    *   **Tên tính năng:** `Gửi Phản hồi/Báo cáo Sự cố`
    *   **Mô tả:** Cung cấp một form liên hệ dễ dàng truy cập trên nền tảng (ví dụ: trong mục Trợ giúp, hoặc nút "Phản hồi" cố định).
    *   **Thông tin cần thu thập:** Phân loại vấn đề (ví dụ: Lỗi kỹ thuật, Vấn đề thanh toán, Chất lượng gia sư, Nội dung không phù hợp, Góp ý tính năng...), Mô tả chi tiết vấn đề, Thông tin buổi học/giao dịch liên quan (nếu có), Tệp đính kèm (ảnh chụp màn hình, video...). Cho phép gửi ẩn danh đối với các góp ý chung.
    *   **Các kênh khác:** Có thể bổ sung kênh hỗ trợ qua email, hotline, hoặc live chat (tùy nguồn lực).
*   **Quy trình Xử lý (Handling Process):**
    *   **Tiếp nhận và Phân loại:** Hệ thống tự động ghi nhận và tạo mã ticket cho mỗi phản hồi/khiếu nại. Bộ phận hỗ trợ khách hàng (Customer Support) tiếp nhận, phân loại mức độ ưu tiên (Thấp, Trung bình, Cao, Khẩn cấp) và chuyển đến bộ phận/người xử lý phù hợp.
    *   **Xác minh và Điều tra:** Bộ phận xử lý tiến hành xác minh thông tin, xem xét lịch sử hoạt động, bản ghi buổi học (nếu cần và được phép), hoặc liên hệ các bên liên quan để làm rõ vấn đề.
    *   **Phản hồi và Giải quyết:** Cập nhật trạng thái xử lý cho người gửi khiếu nại qua email/thông báo trong ứng dụng. Đưa ra hướng giải quyết (ví dụ: sửa lỗi, hoàn điểm, cảnh cáo/xử lý vi phạm, ghi nhận góp ý...).
    *   **Thời gian Phản hồi Cam kết (SLA):** Đặt ra mục tiêu về thời gian phản hồi ban đầu và thời gian giải quyết cho từng loại vấn đề/mức độ ưu tiên.
*   **Theo dõi Trạng thái (Status Tracking):**
    *   **Tên tính năng:** `Kiểm tra Trạng thái Yêu cầu Hỗ trợ`
    *   **Mô tả:** Cho phép người dùng xem trạng thái xử lý của các phản hồi/khiếu nại mà họ đã gửi (ví dụ: Mới, Đang xử lý, Chờ phản hồi, Đã giải quyết, Đã đóng).
*   **Cơ chế Hòa giải Tranh chấp (Dispute Mediation):**
    *   **Mô tả:** Đối với các tranh chấp phức tạp giữa học viên và gia sư (ví dụ: bất đồng về chất lượng buổi học, nội dung báo cáo tiến độ...), nền tảng đóng vai trò trung gian hòa giải, xem xét bằng chứng từ cả hai phía và đưa ra quyết định cuối cùng dựa trên chính sách và quy định.
*   **Chính sách Bồi thường/Hoàn tiền (Compensation/Refund Policy):**
    *   **Mô tả:** Xây dựng chính sách rõ ràng về việc bồi thường hoặc hoàn điểm cho người dùng trong trường hợp lỗi thuộc về nền tảng hoặc đối tác (gia sư) gây ảnh hưởng đến trải nghiệm học tập.
*   **Phân tích Phản hồi để Cải thiện (Feedback Analysis for Improvement):**
    *   **Mô tả:** Thu thập, tổng hợp và phân tích dữ liệu từ các phản hồi, khiếu nại, góp ý để xác định các vấn đề phổ biến, các điểm cần cải thiện trong tính năng, quy trình hoặc chính sách của nền tảng. Đây là nguồn thông tin đầu vào quan trọng cho việc phát triển sản phẩm.


---



# Phần 8: Bảo mật và quản lý rủi ro (Security & Risk Management)

Phân hệ này tập trung vào việc bảo vệ dữ liệu người dùng, đảm bảo an toàn và tin cậy cho toàn bộ nền tảng, đồng thời xây dựng các quy trình để phòng ngừa và xử lý các rủi ro tiềm ẩn có thể ảnh hưởng đến hoạt động và uy tín của AITHEduConnect.

## 8.1 Bảo mật dữ liệu (Data Security)

**Mô tả:** Triển khai các biện pháp kỹ thuật và quy trình nghiêm ngặt để bảo vệ thông tin cá nhân, dữ liệu học tập và thông tin thanh toán của người dùng khỏi các truy cập trái phép, lạm dụng hoặc tiết lộ.

**Tính năng chi tiết:**

*   **Mã hóa Dữ liệu (Data Encryption):**
    *   **Tên tính năng:** `Mã hóa khi Truyền (Encryption in Transit)`
    *   **Mô tả:** Sử dụng giao thức HTTPS (SSL/TLS) cho toàn bộ kết nối giữa trình duyệt/ứng dụng của người dùng và máy chủ của AITHEduConnect để mã hóa dữ liệu đang được truyền đi.
    *   **Tên tính năng:** `Mã hóa khi Lưu trữ (Encryption at Rest)`
    *   **Mô tả:** Mã hóa các dữ liệu nhạy cảm (như mật khẩu, thông tin cá nhân, thông tin thanh toán được token hóa) khi lưu trữ trong cơ sở dữ liệu, sử dụng các thuật toán mã hóa mạnh (ví dụ: AES-256).
    *   **Tên tính năng:** `Mã hóa Đầu cuối cho Tin nhắn (End-to-End Encryption for Chat - Nâng cao)`
    *   **Mô tả:** Cân nhắc áp dụng mã hóa đầu cuối cho tính năng chat riêng tư trong phòng học ảo để đảm bảo chỉ người gửi và người nhận mới đọc được nội dung tin nhắn.
*   **Xác thực và Quản lý Truy cập (Authentication & Access Control):**
    *   **Tên tính năng:** `Xác thực Hai Yếu tố (Two-Factor Authentication - 2FA)`
    *   **Mô tả:** Cung cấp tùy chọn cho người dùng (đặc biệt là gia sư và phụ huynh) bật 2FA để tăng cường bảo mật cho tài khoản. Khi đăng nhập, ngoài mật khẩu, người dùng cần nhập mã OTP từ ứng dụng xác thực (Google Authenticator, Authy) hoặc SMS/Email.
    *   **Tên tính năng:** `Quản lý Phiên đăng nhập (Session Management)`
    *   **Mô tả:** Áp dụng các cơ chế quản lý phiên đăng nhập an toàn, bao gồm tự động đăng xuất sau một thời gian không hoạt động, giới hạn số lượng phiên đăng nhập đồng thời, thông báo cho người dùng về các lần đăng nhập đáng ngờ từ thiết bị/vị trí lạ.
    *   **Tên tính năng:** `Kiểm soát Quyền Truy cập Dựa trên Vai trò (Role-Based Access Control - RBAC)`
    *   **Mô tả:** Phân quyền truy cập dữ liệu và tính năng một cách chặt chẽ dựa trên vai trò của người dùng (Học viên, Gia sư, Phụ huynh, Quản trị viên). Đảm bảo người dùng chỉ có thể truy cập những thông tin và thực hiện những hành động phù hợp với vai trò của mình.
*   **Tuân thủ Quy định (Compliance):**
    *   **Tên tính năng:** `Tuân thủ Nghị định Bảo vệ Dữ liệu Cá nhân Việt Nam (NĐ 13/2023/NĐ-CP)`
    *   **Mô tả:** Đảm bảo các quy trình thu thập, xử lý, lưu trữ và xóa dữ liệu cá nhân tuân thủ đầy đủ các quy định của pháp luật Việt Nam về bảo vệ dữ liệu cá nhân.
    *   **Tên tính năng:** `Tuân thủ GDPR (nếu có người dùng EU)`: Nếu nền tảng có kế hoạch thu hút người dùng từ Liên minh Châu Âu, cần đảm bảo tuân thủ Quy định Chung về Bảo vệ Dữ liệu (GDPR).
    *   **Tên tính năng:** `Tuân thủ PCI DSS (cho thanh toán)`: Đảm bảo tuân thủ tiêu chuẩn bảo mật dữ liệu ngành thẻ thanh toán khi xử lý giao dịch thẻ.
*   **Kiểm tra và Giám sát Bảo mật (Security Auditing & Monitoring):**
    *   **Tên tính năng:** `Kiểm tra Bảo mật Định kỳ (Regular Security Audits)`
    *   **Mô tả:** Thực hiện đánh giá, kiểm thử xâm nhập (penetration testing) định kỳ bởi các đơn vị độc lập hoặc đội ngũ nội bộ để phát hiện và khắc phục các lỗ hổng bảo mật.
    *   **Tên tính năng:** `Giám sát Hoạt động Hệ thống (System Activity Monitoring)`
    *   **Mô tả:** Triển khai hệ thống giám sát liên tục để ghi log (nhật ký) các hoạt động quan trọng trên hệ thống, phát hiện và cảnh báo sớm các hành vi truy cập bất thường hoặc đáng ngờ.
*   **Chính sách Lưu trữ và Xóa Dữ liệu (Data Retention & Deletion Policy):**
    *   **Mô tả:** Xây dựng và công bố chính sách rõ ràng về thời gian lưu trữ các loại dữ liệu khác nhau (hồ sơ người dùng, lịch sử học tập, bản ghi buổi học, log hệ thống...). Cung cấp cơ chế cho người dùng yêu cầu xóa tài khoản và dữ liệu cá nhân của họ theo quy định pháp luật.

## 8.2 Xác minh và kiểm duyệt (Verification & Moderation)

**Mô tả:** Thiết lập các quy trình và công cụ để xác minh danh tính, năng lực của gia sư và kiểm duyệt nội dung do người dùng tạo ra (hồ sơ, tài liệu, đánh giá, tin nhắn) nhằm duy trì một môi trường học tập an toàn, chất lượng và đáng tin cậy.

**Tính năng chi tiết:**

*   **Xác minh Danh tính Gia sư (Tutor Identity Verification):**
    *   **Quy trình:** Như đã mô tả chi tiết trong Phần 1.2 (Đăng ký gia sư), bao gồm kiểm tra CMND/CCCD/Hộ chiếu, có thể tích hợp thêm các giải pháp eKYC (Electronic Know Your Customer) nếu phù hợp để tự động hóa một phần quy trình.
    *   **Tên tính năng:** `Kiểm tra Lý lịch Tư pháp (Background Check - Tùy chọn/Nâng cao)`
    *   **Mô tả:** Cân nhắc việc yêu cầu hoặc cung cấp tùy chọn cho gia sư thực hiện kiểm tra lý lịch tư pháp (tại Việt Nam là Phiếu Lý lịch Tư pháp) để tăng thêm mức độ tin cậy, đặc biệt khi làm việc với đối tượng học sinh nhỏ tuổi. Cần tuân thủ quy định pháp luật và có sự đồng ý của gia sư.
*   **Xác minh Bằng cấp và Chứng chỉ (Credential Verification):**
    *   **Quy trình:** Như mô tả trong Phần 1.2, bộ phận kiểm duyệt cần kiểm tra tính hợp lệ của các bằng cấp, chứng chỉ do gia sư cung cấp (đối chiếu thông tin, kiểm tra mẫu dấu, có thể liên hệ đơn vị cấp nếu cần thiết và được phép).
*   **Phỏng vấn và Đánh giá Năng lực (Interview & Skill Assessment):**
    *   **Quy trình:** Như mô tả trong Phần 1.2, bao gồm phỏng vấn video và có thể có bài kiểm tra/dạy thử để đánh giá năng lực thực tế.
*   **Kiểm duyệt Nội dung (Content Moderation):**
    *   **Tên tính năng:** `Kiểm duyệt Hồ sơ Người dùng (Profile Moderation)`
    *   **Mô tả:** Kiểm duyệt các thông tin, hình ảnh, video giới thiệu trong hồ sơ gia sư (và có thể cả học viên nếu cần) để đảm bảo tính phù hợp, chuyên nghiệp, không chứa nội dung vi phạm chính sách.
    *   **Tên tính năng:** `Kiểm duyệt Tài liệu Học tập (Material Moderation)`
    *   **Mô tả:** Có cơ chế kiểm tra (ngẫu nhiên hoặc dựa trên báo cáo) các tài liệu do gia sư tải lên để đảm bảo không vi phạm bản quyền, không chứa nội dung độc hại hoặc không phù hợp.
    *   **Tên tính năng:** `Kiểm duyệt Đánh giá và Bình luận (Review & Comment Moderation)`
    *   **Mô tả:** Sử dụng bộ lọc từ khóa tự động và/hoặc kiểm duyệt thủ công để phát hiện và xử lý các đánh giá, bình luận chứa ngôn từ công kích, thù địch, spam, hoặc thông tin cá nhân nhạy cảm.
    *   **Tên tính năng:** `Giám sát Tin nhắn và Chat (Chat Monitoring - Cân nhắc kỹ về riêng tư)`
    *   **Mô tả:** Có thể áp dụng bộ lọc từ khóa tự động cho tin nhắn chat (công khai và riêng tư) để phát hiện các hành vi chia sẻ thông tin liên hệ cá nhân (vi phạm quy định nền tảng), ngôn từ không phù hợp, hoặc các dấu hiệu lừa đảo. Việc giám sát cần được thông báo rõ ràng trong chính sách bảo mật và cân bằng với quyền riêng tư của người dùng.
    *   **Tên tính năng:** `Giám sát Ngẫu nhiên Buổi học (Random Session Auditing - Cân nhắc kỹ về riêng tư)`
    *   **Mô tả:** Có thể thực hiện giám sát ngẫu nhiên một số buổi học (chỉ bởi nhân viên được ủy quyền và có quy trình rõ ràng) để đánh giá chất lượng giảng dạy và đảm bảo môi trường học tập an toàn. Cần thông báo trước và có sự đồng ý (ít nhất là ngầm định qua điều khoản sử dụng).
*   **Hệ thống Báo cáo Vi phạm (Violation Reporting System):**
    *   **Tên tính năng:** `Báo cáo Hành vi/Nội dung Không phù hợp`
    *   **Mô tả:** Cung cấp nút báo cáo dễ thấy trên hồ sơ người dùng, trong phòng học ảo, trên các bình luận/đánh giá, cho phép bất kỳ người dùng nào cũng có thể báo cáo các hành vi (quấy rối, lừa đảo, thái độ không đúng mực...) hoặc nội dung (tài liệu vi phạm, bình luận xúc phạm...) mà họ cho là vi phạm quy tắc của nền tảng.
    *   **Quy trình xử lý báo cáo:** Tương tự quy trình xử lý khiếu nại (Phần 7.3), cần tiếp nhận, xác minh, điều tra và đưa ra biện pháp xử lý kịp thời.
*   **Biện pháp Xử lý Vi phạm (Enforcement Actions):**
    *   **Mô tả:** Xây dựng một khung chế tài rõ ràng và công bằng cho các hành vi vi phạm, tùy theo mức độ nghiêm trọng:
        *   `Nhắc nhở/Cảnh cáo (Warning)`
        *   `Gỡ bỏ nội dung vi phạm (Content Removal)`
        *   `Tạm khóa tài khoản (Temporary Suspension)`
        *   `Khóa tài khoản vĩnh viễn (Permanent Ban)`
        *   `Giảm uy tín/hạ bậc gia sư (Reputation Penalty)`
    *   Quy trình xử lý cần đảm bảo người bị cáo buộc có cơ hội giải trình (trừ trường hợp vi phạm nghiêm trọng, rõ ràng).

## 8.3 Quản lý rủi ro (Risk Management)

**Mô tả:** Xây dựng các kế hoạch và quy trình để ứng phó với các sự cố kỹ thuật, gián đoạn dịch vụ hoặc các tình huống khẩn cấp khác, nhằm giảm thiểu tác động tiêu cực đến người dùng và đảm bảo hoạt động kinh doanh liên tục.

**Tính năng chi tiết:**

*   **Kế hoạch Dự phòng Sự cố Kỹ thuật (Technical Incident Response Plan):**
    *   **Tên tính năng:** `Sao lưu Dữ liệu Thường xuyên (Regular Data Backups)`
    *   **Mô tả:** Thực hiện sao lưu toàn bộ cơ sở dữ liệu và các dữ liệu quan trọng khác một cách thường xuyên (ví dụ: hàng ngày) và lưu trữ bản sao lưu ở một vị trí địa lý khác hoặc trên một nhà cung cấp đám mây khác.
    *   **Tên tính năng:** `Hệ thống Dự phòng và Chuyển đổi dự phòng (Redundancy & Failover)`
    *   **Mô tả:** Thiết kế hạ tầng máy chủ có tính sẵn sàng cao (High Availability), sử dụng các cơ chế cân bằng tải (load balancing) và dự phòng (redundancy) cho các thành phần quan trọng (máy chủ ứng dụng, cơ sở dữ liệu, mạng...). Có kế hoạch chuyển đổi dự phòng (failover) tự động hoặc bán tự động khi có sự cố xảy ra với hệ thống chính.
    *   **Tên tính năng:** `Quy trình Khôi phục Sau Thảm họa (Disaster Recovery Plan - DRP)`
    *   **Mô tả:** Xây dựng tài liệu chi tiết về quy trình khôi phục hệ thống trong trường hợp xảy ra thảm họa nghiêm trọng (mất trung tâm dữ liệu, tấn công ransomware...). Bao gồm các bước khôi phục dữ liệu từ bản sao lưu, dựng lại hạ tầng, kiểm tra và đưa hệ thống hoạt động trở lại. Cần kiểm thử DRP định kỳ.
*   **Xử lý Gián đoạn Buổi học (Session Disruption Handling):**
    *   **Tên tính năng:** `Phát hiện Mất kết nối (Disconnection Detection)`
    *   **Mô tả:** Phòng học ảo cần có cơ chế phát hiện khi người dùng bị mất kết nối đột ngột và cố gắng tự động kết nối lại trong một khoảng thời gian ngắn.
    *   **Tên tính năng:** `Quy trình Xử lý khi Gia sư/Học viên Gặp sự cố`
    *   **Mô tả:** Xây dựng quy trình rõ ràng để xử lý các tình huống như gia sư hoặc học viên không thể tham gia buổi học vào phút chót do sự cố kỹ thuật hoặc lý do cá nhân đột xuất:
        *   `Thông báo sớm`: Khuyến khích người gặp sự cố thông báo cho bên kia và/hoặc bộ phận hỗ trợ càng sớm càng tốt.
        *   `Tìm gia sư thay thế (Tùy chọn)`: Nếu gia sư gặp sự cố, nền tảng có thể cố gắng tìm một gia sư khác có chuyên môn tương tự để dạy thay (nếu có thể và học viên đồng ý).
        *   `Lên lịch lại (Reschedule)`: Ưu tiên việc thỏa thuận để dời buổi học sang một thời điểm khác phù hợp với cả hai bên.
        *   `Hoàn điểm (Refund)`: Nếu không thể lên lịch lại, học viên sẽ được hoàn lại 100% số điểm đã thanh toán cho buổi học đó.
*   **Phương án Dự phòng cho Tình huống Khẩn cấp (Emergency Contingency Plans):**
    *   **Tên tính năng:** `Phòng học ảo Dự phòng (Backup Virtual Classroom)`
    *   **Mô tả:** Có thể tích hợp sẵn một giải pháp phòng học ảo thứ hai từ nhà cung cấp khác làm phương án dự phòng, trong trường hợp nhà cung cấp chính gặp sự cố trên diện rộng.
    *   **Tên tính năng:** `Kênh Liên lạc Thay thế (Alternative Communication Channels)`
    *   **Mô tả:** Đảm bảo có các kênh liên lạc khác ngoài nền tảng (email, SMS, thông báo trên mạng xã hội) để thông báo cho người dùng trong trường hợp hệ thống chính bị sập hoàn toàn.
*   **Hỗ trợ Kỹ thuật (Technical Support):**
    *   **Tên tính năng:** `Hỗ trợ Kỹ thuật 24/7 (hoặc trong giờ cao điểm)`
    *   **Mô tả:** Cung cấp đội ngũ hoặc quy trình hỗ trợ kỹ thuật sẵn sàng giúp đỡ người dùng giải quyết các sự cố liên quan đến việc sử dụng phòng học ảo, thanh toán, hoặc các tính năng khác của nền tảng, đặc biệt là trong các khung giờ có nhiều lớp học diễn ra.


---



# Phần 9: Phân tích dữ liệu và AI (Data Analytics & AI)

Phân hệ này tận dụng sức mạnh của dữ liệu và trí tuệ nhân tạo để nâng cao trải nghiệm người dùng, cá nhân hóa lộ trình học tập, đưa ra các gợi ý thông minh và đảm bảo tính công bằng, an toàn cho nền tảng.

## 9.1 Phân tích học tập (Learning Analytics)

**Mô tả:** Thu thập, xử lý và phân tích dữ liệu về quá trình học tập của học viên để cung cấp cái nhìn sâu sắc về tiến độ, hiệu quả học tập, điểm mạnh, điểm yếu, từ đó đưa ra các đề xuất cải thiện cho cả học viên, phụ huynh và gia sư.

**Tính năng chi tiết:**

*   **Theo dõi Tiến độ Học tập (Track Learning Progress):**
    *   **Mô tả:** Hệ thống tự động ghi nhận và tổng hợp dữ liệu từ nhiều nguồn: báo cáo tiến độ của gia sư, kết quả bài tập/kiểm tra (nếu có), mức độ hoàn thành mục tiêu, thời gian học, tần suất học...
    *   **Tên tính năng:** `Bảng điều khiển Tiến độ Học viên (Student Progress Dashboard)`
    *   **Mô tả:** Cung cấp cho học viên và phụ huynh một giao diện trực quan hiển thị các chỉ số tiến độ chính, biểu đồ thể hiện sự thay đổi theo thời gian, so sánh với mục tiêu đã đặt ra.
*   **Xác định Điểm mạnh và Điểm yếu (Identify Strengths & Weaknesses):**
    *   **Mô tả:** Phân tích dữ liệu học tập (ví dụ: kết quả bài tập theo từng dạng bài, nhận xét của gia sư về các kỹ năng cụ thể) để xác định những lĩnh vực kiến thức hoặc kỹ năng mà học viên đang làm tốt và những lĩnh vực cần cải thiện thêm.
    *   **Tên tính năng:** `Báo cáo Phân tích Điểm mạnh/Yếu`
    *   **Mô tả:** Tạo ra các báo cáo định kỳ hoặc theo yêu cầu, nêu bật các điểm mạnh và điểm yếu của học viên một cách cụ thể, kèm theo gợi ý từ hệ thống hoặc gia sư về cách phát huy điểm mạnh và khắc phục điểm yếu.
*   **Phân tích Mức độ Tương tác và Tham gia (Analyze Engagement & Participation):**
    *   **Mô tả:** Đối với lớp học nhóm hoặc các hoạt động học tập có tính tương tác, hệ thống phân tích mức độ tham gia của học viên (tần suất phát biểu, đặt câu hỏi, tham gia thảo luận, tương tác trên bảng trắng...). Dữ liệu này giúp gia sư hiểu rõ hơn về động lực và sự tham gia của từng học viên.
*   **Cung cấp Báo cáo cho các Bên liên quan (Provide Reports to Stakeholders):**
    *   **Học viên & Phụ huynh:** Nhận báo cáo tiến độ, phân tích điểm mạnh/yếu để hiểu rõ tình hình học tập và có kế hoạch cải thiện.
    *   **Gia sư:** Nhận báo cáo tổng hợp về tiến độ của học viên (đặc biệt là học viên dài hạn) để điều chỉnh phương pháp giảng dạy cho phù hợp. Nhận phân tích về mức độ tương tác trong lớp học nhóm.
    *   **Quản trị viên:** Xem các báo cáo tổng hợp về hiệu quả học tập trên toàn nền tảng, xác định các xu hướng, môn học/gia sư hiệu quả để có chiến lược phát triển phù hợp.

## 9.2 Cá nhân hóa lộ trình học (Personalized Learning Path)

**Mô tả:** Sử dụng AI để đề xuất một lộ trình học tập, tài liệu và bài tập phù hợp với trình độ, tốc độ tiếp thu, mục tiêu và phong cách học tập riêng của từng học viên.

**Tính năng chi tiết:**

*   **Đánh giá Năng lực Đầu vào (Initial Assessment - Optional):**
    *   **Mô tả:** Khi bắt đầu học một môn mới hoặc tham gia nền tảng, học viên có thể thực hiện một bài kiểm tra đầu vào ngắn để hệ thống AI đánh giá trình độ hiện tại.
*   **Đề xuất Lộ trình Học tập (Learning Path Recommendation):**
    *   **Tên tính năng:** `Lộ trình Học tập Gợi ý`
    *   **Mô tả:** Dựa trên kết quả đánh giá đầu vào (nếu có), mục tiêu học tập đã đặt ra và dữ liệu từ các học viên tương tự, AI đề xuất một chuỗi các chủ đề, bài học hoặc kỹ năng cần học theo một trình tự logic để đạt được mục tiêu.
    *   **Linh hoạt:** Lộ trình này có thể được điều chỉnh bởi gia sư hoặc chính học viên.
*   **Gợi ý Tài liệu và Bài tập Phù hợp (Adaptive Content Recommendation):**
    *   **Tên tính năng:** `Tài liệu/Bài tập Đề xuất`
    *   **Mô tả:** Dựa trên chủ đề đang học và kết quả học tập gần đây, AI gợi ý các tài liệu bổ sung (bài đọc, video, slide) hoặc các dạng bài tập phù hợp với trình độ hiện tại của học viên (không quá dễ, không quá khó).
    *   **Ví dụ:** Nếu học viên làm sai nhiều bài tập về một dạng toán cụ thể, hệ thống sẽ gợi ý thêm các bài tập tương tự hoặc tài liệu giải thích sâu hơn về dạng toán đó.
*   **Điều chỉnh Tốc độ Học (Pacing Adjustment):**
    *   **Mô tả:** AI theo dõi tốc độ hoàn thành bài học và mức độ hiểu bài của học viên để đưa ra gợi ý điều chỉnh tốc độ học phù hợp (học nhanh hơn nếu tiếp thu tốt, học chậm lại và ôn tập kỹ hơn nếu gặp khó khăn).

## 9.3 Gợi ý gia sư thông minh (Intelligent Tutor Recommendation)

**Mô tả:** Nâng cao thuật toán kết nối (đã đề cập ở Phần 3.2) bằng cách sử dụng AI/Machine Learning để hiểu sâu hơn về nhu cầu của học viên và đặc điểm của gia sư, từ đó đưa ra những gợi ý kết nối chính xác và hiệu quả hơn.

**Tính năng chi tiết:**

*   **Phân tích Nhu cầu Sâu hơn (Deeper Needs Analysis):**
    *   **Mô tả:** AI không chỉ dựa vào các bộ lọc cứng (môn học, cấp độ, lịch) mà còn phân tích cả các yếu tố mềm như `Mục tiêu học tập` (ví dụ: cần gia sư có kinh nghiệm luyện thi chứng chỉ cụ thể), `Phong cách học tập ưa thích` (ví dụ: cần gia sư kiên nhẫn, hài hước), và thậm chí phân tích nội dung `Mô tả nhu cầu` khi đặt lịch.
*   **Phân tích Đặc điểm Gia sư (Tutor Characteristic Analysis):**
    *   **Mô tả:** AI phân tích hồ sơ gia sư, bao gồm `Mô tả bản thân & Phong cách giảng dạy`, `Video giới thiệu`, và đặc biệt là `Nội dung bình luận` từ các học viên trước để hiểu rõ hơn về phương pháp, tính cách và điểm mạnh của từng gia sư.
*   **Học từ Lịch sử Kết nối Thành công (Learning from Successful Matches):**
    *   **Mô tả:** Thuật toán học hỏi từ các cặp kết nối thành công trong quá khứ (học viên học lâu dài, đánh giá cao) để xác định các yếu tố tương đồng và áp dụng cho việc gợi ý các kết nối mới.
*   **Gợi ý Đa dạng (Diverse Recommendations):**
    *   **Mô tả:** Ngoài việc gợi ý những gia sư phù hợp nhất, thuật toán cũng có thể đưa ra một vài gợi ý khác biệt (ví dụ: gia sư mới tiềm năng, gia sư có phương pháp dạy khác lạ) để mở rộng lựa chọn cho học viên.

## 9.4 Phát hiện gian lận và Bất thường (Fraud & Anomaly Detection)

**Mô tả:** Sử dụng AI để tự động phát hiện các hành vi gian lận hoặc bất thường trên nền tảng, góp phần đảm bảo tính công bằng, minh bạch và an toàn cho cộng đồng người dùng.

**Tính năng chi tiết:**

*   **Phát hiện Gian lận Đánh giá (Review Fraud Detection):**
    *   **Mô tả:** AI phân tích các mẫu đánh giá (thời gian gửi, địa chỉ IP, nội dung bình luận, mối quan hệ giữa người đánh giá và người được đánh giá) để phát hiện các trường hợp đánh giá giả mạo (tự đánh giá, nhờ bạn bè đánh giá tốt, đối thủ đánh giá xấu...). Các đánh giá đáng ngờ sẽ được gắn cờ để kiểm duyệt viên xem xét.
*   **Phát hiện Gian lận trong Học tập/Thi cử (Academic Dishonesty Detection - Nếu có tính năng kiểm tra/thi):**
    *   **Mô tả:** Nếu nền tảng tích hợp các bài kiểm tra hoặc thi trực tuyến, AI có thể được sử dụng để phát hiện các hành vi gian lận như sao chép bài làm, sử dụng tài liệu không được phép (thông qua giám sát webcam hoặc phân tích hành vi làm bài), hoặc nhờ người khác làm hộ.
*   **Phát hiện Tài khoản Giả mạo/Spam (Fake/Spam Account Detection):**
    *   **Mô tả:** AI phân tích hành vi đăng ký và hoạt động của tài khoản mới để phát hiện các tài khoản được tạo tự động (bots) nhằm mục đích spam hoặc lừa đảo.
*   **Phát hiện Giao dịch Bất thường (Transaction Anomaly Detection):**
    *   **Mô tả:** AI theo dõi các mẫu giao dịch thanh toán và sử dụng điểm để phát hiện các hoạt động đáng ngờ có thể liên quan đến rửa tiền, lạm dụng khuyến mãi, hoặc tài khoản bị xâm nhập.
*   **Cảnh báo Sớm (Early Warning System):**
    *   **Mô tả:** Khi phát hiện các hành vi đáng ngờ, hệ thống AI tự động gửi cảnh báo đến quản trị viên hoặc bộ phận liên quan để có biện pháp kiểm tra và can thiệp kịp thời.


---



# Phần 10: Giao diện người dùng và trải nghiệm người dùng (UI/UX)

Phân hệ này không phải là một tập hợp tính năng riêng lẻ mà là yếu tố xuyên suốt, quyết định cảm nhận và mức độ hài lòng của người dùng khi tương tác với nền tảng AITHEduConnect. Mục tiêu là tạo ra một giao diện trực quan, thẩm mỹ, dễ sử dụng và mang lại trải nghiệm mượt mà, hiệu quả cho tất cả các nhóm đối tượng, đặc biệt là phù hợp với văn hóa và thị hiếu của người dùng Việt Nam.

## 10.1 Thiết kế giao diện (User Interface - UI Design)

**Mô tả:** Tập trung vào yếu tố "nhìn" của nền tảng - cách bố trí các thành phần, màu sắc, font chữ, hình ảnh, biểu tượng - nhằm tạo ra một giao diện hấp dẫn, chuyên nghiệp và nhất quán.

**Yêu cầu chi tiết:**

*   **Phong cách Thiết kế (Design Style):**
    *   `Hiện đại & Sạch sẽ (Modern & Clean)`: Sử dụng các nguyên tắc thiết kế phẳng (Flat Design) hoặc bán phẳng (Material Design), tập trung vào không gian trắng, bố cục rõ ràng, tránh các chi tiết rườm rà.
    *   `Thân thiện & Tiếp cận (Friendly & Approachable)`: Sử dụng màu sắc tươi sáng nhưng hài hòa (có thể lấy cảm hứng từ màu sắc thương hiệu), icon dễ hiểu, hình ảnh minh họa gần gũi (có thể sử dụng hình ảnh người Việt hoặc phong cách đồ họa phù hợp văn hóa Việt).
    *   `Chuyên nghiệp & Đáng tin cậy (Professional & Trustworthy)`: Đảm bảo sự nhất quán trong toàn bộ giao diện, sử dụng font chữ dễ đọc, hình ảnh chất lượng cao, tránh các lỗi chính tả hoặc hiển thị.
*   **Bố cục và Điều hướng (Layout & Navigation):**
    *   `Bố cục Trực quan (Intuitive Layout)`: Sắp xếp các thành phần trên trang một cách logic, ưu tiên nội dung quan trọng. Sử dụng hệ thống lưới (grid system) để đảm bảo sự cân đối và thẳng hàng.
    *   `Điều hướng Rõ ràng (Clear Navigation)`: Cung cấp thanh điều hướng chính (header menu), menu phụ (sidebar) hoặc chân trang (footer) nhất quán trên các trang, giúp người dùng dễ dàng di chuyển giữa các khu vực chức năng chính (Tìm gia sư, Lịch học, Hồ sơ, Nạp điểm...). Sử dụng breadcrumbs (đường dẫn điều hướng) cho các trang con sâu hơn.
    *   `Ưu tiên Hành động Chính (Prioritize Key Actions)`: Các nút kêu gọi hành động quan trọng (Call-to-Action - CTA) như "Tìm gia sư", "Đặt lịch", "Nạp điểm", "Đăng ký" cần được làm nổi bật về màu sắc, kích thước hoặc vị trí.
*   **Yếu tố Hình ảnh và Đồ họa (Visuals & Graphics):**
    *   `Biểu tượng Nhất quán (Consistent Icons)`: Sử dụng một bộ biểu tượng (icon set) đồng nhất về phong cách và ý nghĩa trong toàn bộ nền tảng.
    *   `Hình ảnh Chất lượng cao (High-Quality Images)`: Sử dụng ảnh đại diện, ảnh bìa lớp học, ảnh minh họa có độ phân giải tốt, không bị vỡ nét. Ưu tiên hình ảnh thực tế hoặc đồ họa chuyên nghiệp, phù hợp với bối cảnh giáo dục.
    *   `Trực quan hóa Dữ liệu (Data Visualization)`: Sử dụng biểu đồ (cột, tròn, đường...) một cách hiệu quả để trình bày các dữ liệu thống kê (tiến độ học tập, thu nhập gia sư, phân tích...) giúp người dùng dễ dàng nắm bắt thông tin.
*   **Typography (Kiểu chữ):**
    *   `Font chữ Dễ đọc (Readable Fonts)`: Chọn các font chữ (cả tiếng Việt và tiếng Anh) rõ ràng, dễ đọc trên màn hình ở nhiều kích thước khác nhau. Phân cấp thông tin bằng cách sử dụng các kích thước và độ đậm nhạt khác nhau của font chữ.
    *   `Hỗ trợ Tiếng Việt Tốt`: Đảm bảo font chữ hiển thị đầy đủ và chính xác tất cả các ký tự và dấu tiếng Việt.

## 10.2 Trải nghiệm người dùng (User Experience - UX Design)

**Mô tả:** Tập trung vào yếu tố "cảm nhận" và "hiệu quả" khi người dùng tương tác với nền tảng - luồng thực hiện tác vụ có dễ dàng, logic và hiệu quả không, người dùng có đạt được mục tiêu của họ một cách nhanh chóng và ít gặp trở ngại không.

**Yêu cầu chi tiết:**

*   **Luồng Công việc Mượt mà (Smooth Workflows):**
    *   `Giảm thiểu Số bước (Minimize Steps)`: Thiết kế các quy trình (đăng ký, tìm kiếm, đặt lịch, thanh toán...) với số bước thực hiện ít nhất có thể mà vẫn đảm bảo thu thập đủ thông tin cần thiết.
    *   `Hướng dẫn Rõ ràng (Clear Instructions)`: Cung cấp các hướng dẫn ngắn gọn, dễ hiểu tại mỗi bước của quy trình, đặc biệt là các quy trình phức tạp như đăng ký gia sư hoặc thiết lập lớp học nhóm.
    *   `Phản hồi Tức thì (Instant Feedback)`: Hệ thống cần cung cấp phản hồi ngay lập tức cho các hành động của người dùng (ví dụ: thông báo thành công khi gửi form, hiệu ứng loading khi chờ xử lý, thông báo lỗi rõ ràng khi có vấn đề xảy ra).
*   **Thiết kế Hướng đến Người dùng (User-Centered Design):**
    *   `Hiểu rõ Đối tượng (Understand Target Audience)`: Thiết kế cần xem xét đến đặc điểm và nhu cầu của từng nhóm đối tượng ưu tiên (học sinh cấp 2-3, phụ huynh, sinh viên làm gia sư, coach...). Ví dụ: giao diện cho phụ huynh cần tập trung vào tính năng quản lý và theo dõi, giao diện cho học sinh cần thân thiện và có thể có yếu tố gamification, giao diện cho người lớn tuổi cần đơn giản và chữ to rõ.
    *   `Cá nhân hóa (Personalization)`: Cung cấp các yếu tố cá nhân hóa như gợi ý gia sư/lớp học phù hợp, hiển thị thông tin liên quan trên dashboard, cho phép tùy chỉnh một số cài đặt giao diện (nếu có thể).
*   **Xử lý Lỗi Thân thiện (Graceful Error Handling):**
    *   `Thông báo Lỗi Rõ ràng (Clear Error Messages)`: Khi có lỗi xảy ra, hiển thị thông báo lỗi bằng ngôn ngữ dễ hiểu (tiếng Việt), giải thích nguyên nhân (nếu có thể) và hướng dẫn cách khắc phục. Tránh các thông báo lỗi kỹ thuật khó hiểu.
    *   `Validation Đầu vào Thông minh (Smart Input Validation)`: Kiểm tra dữ liệu người dùng nhập vào form ngay lập tức (inline validation) và chỉ dẫn lỗi cụ thể tại trường bị sai (ví dụ: "Email không đúng định dạng", "Mật khẩu phải có ít nhất 8 ký tự").
*   **Tối ưu Hiệu suất (Performance Optimization):**
    *   `Tốc độ Tải trang Nhanh (Fast Loading Speed)`: Tối ưu hóa hình ảnh, mã nguồn (code), truy vấn cơ sở dữ liệu để đảm bảo các trang web tải nhanh chóng, giảm thời gian chờ đợi của người dùng.
    *   `Phản hồi Nhanh chóng (Responsiveness)`: Đảm bảo giao diện phản hồi nhanh với các tương tác của người dùng (nhấp chuột, cuộn trang...).

## 10.3 Tương thích đa nền tảng (Cross-Platform Compatibility)

**Mô tả:** Đảm bảo người dùng có thể truy cập và sử dụng AITHEduConnect một cách hiệu quả trên nhiều loại thiết bị và trình duyệt khác nhau.

**Yêu cầu chi tiết:**

*   **Thiết kế Đáp ứng (Responsive Web Design):**
    *   **Mô tả:** Giao diện web phải tự động điều chỉnh bố cục và kích thước các thành phần để hiển thị tốt trên mọi kích thước màn hình, từ máy tính để bàn (desktops), máy tính xách tay (laptops) đến máy tính bảng (tablets) và điện thoại di động (smartphones).
    *   **Ưu tiên Thiết bị Di động (Mobile-First Approach - Cân nhắc):** Có thể cân nhắc thiết kế ưu tiên cho trải nghiệm trên di động trước, sau đó mở rộng cho màn hình lớn hơn, do xu hướng sử dụng di động ngày càng tăng tại Việt Nam.
*   **Tương thích Trình duyệt (Browser Compatibility):**
    *   **Mô tả:** Đảm bảo nền tảng hoạt động ổn định và hiển thị đúng trên các trình duyệt web phổ biến nhất hiện nay (Google Chrome, Firefox, Safari, Microsoft Edge phiên bản mới nhất).
*   **Ứng dụng Di động (Mobile App - Giai đoạn sau):**
    *   **Mô tả:** Có thể xem xét phát triển ứng dụng di động riêng (Native App) cho iOS và Android trong các giai đoạn phát triển sau để mang lại trải nghiệm tối ưu hơn trên thiết bị di động, tận dụng các tính năng như thông báo đẩy (push notifications), truy cập ngoại tuyến (offline access - nếu có).

## 10.4 Hỗ trợ người dùng (User Support & Guidance)

**Mô tả:** Cung cấp các tài nguyên và công cụ hỗ trợ để người dùng có thể dễ dàng tìm hiểu cách sử dụng nền tảng và giải quyết các vấn đề gặp phải.

**Yêu cầu chi tiết:**

*   **Trung tâm Trợ giúp (Help Center / Knowledge Base):**
    *   **Tên tính năng:** `Cơ sở Tri thức`
    *   **Mô tả:** Xây dựng một khu vực tập hợp các bài viết hướng dẫn chi tiết, câu hỏi thường gặp (FAQ) được phân loại theo chủ đề (Đăng ký, Tìm gia sư, Phòng học ảo, Thanh toán, Chính sách...) và có công cụ tìm kiếm hiệu quả.
    *   **Nội dung:** Cần được viết bằng tiếng Việt rõ ràng, dễ hiểu, có hình ảnh minh họa hoặc video hướng dẫn (nếu cần).
*   **Hướng dẫn Ban đầu (Onboarding):**
    *   **Tên tính năng:** `Hướng dẫn Nhanh cho Người mới`
    *   **Mô tả:** Cung cấp một chuỗi hướng dẫn ngắn gọn (dạng tooltip, pop-up hoặc video) cho người dùng mới sau khi đăng ký, giới thiệu các tính năng chính và cách bắt đầu sử dụng nền tảng.
*   **Hỗ trợ theo Ngữ cảnh (Contextual Help):**
    *   **Mô tả:** Đặt các biểu tượng trợ giúp (?) hoặc các tooltip nhỏ bên cạnh các tính năng hoặc thuật ngữ phức tạp để giải thích nhanh ngay tại chỗ mà không cần người dùng phải rời khỏi trang hiện tại.
*   **Thông báo và Cập nhật (Notifications & Updates):**
    *   **Mô tả:** Sử dụng hệ thống thông báo trong ứng dụng (in-app notifications) và email/SMS để cập nhật cho người dùng về các hoạt động quan trọng (lịch học, thanh toán, tin nhắn mới, cập nhật tính năng...).

---



# Phần 11: Quản trị hệ thống (Admin Panel)

Đây là giao diện quản lý nội bộ dành riêng cho đội ngũ quản trị viên (Administrators) và nhân viên hỗ trợ (Support Staff) của AITHEduConnect. Admin Panel cung cấp các công cụ cần thiết để giám sát hoạt động, quản lý người dùng, kiểm duyệt nội dung, xử lý giao dịch, cấu hình hệ thống và trích xuất báo cáo, đảm bảo nền tảng vận hành trơn tru, an toàn và hiệu quả.

## 11.1 Quản lý người dùng (User Management)

**Mô tả:** Cung cấp các công cụ để quản trị viên xem, tìm kiếm, chỉnh sửa thông tin, quản lý trạng thái và thực hiện các hành động cần thiết đối với tài khoản của học viên, gia sư và phụ huynh.

**Tính năng chi tiết:**

*   **Danh sách và Tìm kiếm Người dùng (User List & Search):**
    *   **Tên tính năng:** `Quản lý Tài khoản Người dùng`
    *   **Mô tả:** Hiển thị danh sách tất cả các tài khoản người dùng trên hệ thống (có thể phân theo tab: Học viên, Gia sư, Phụ huynh, Admin).
    *   **Thông tin hiển thị:** ID người dùng, Họ tên, Email, Số điện thoại, Loại tài khoản, Trạng thái (Hoạt động, Chờ duyệt, Tạm khóa, Bị cấm), Ngày đăng ký.
    *   **Bộ lọc & Tìm kiếm:** Cho phép tìm kiếm người dùng theo ID, tên, email, SĐT; lọc theo loại tài khoản, trạng thái, ngày đăng ký.
*   **Xem và Chỉnh sửa Thông tin (View & Edit User Details):**
    *   **Tên tính năng:** `Chi tiết Tài khoản Người dùng`
    *   **Mô tả:** Cho phép quản trị viên xem chi tiết hồ sơ của một người dùng cụ thể, bao gồm tất cả thông tin cá nhân, lịch sử hoạt động (đăng nhập, buổi học, giao dịch...), các báo cáo liên quan.
    *   **Hành động:** Cho phép quản trị viên (với quyền hạn phù hợp) chỉnh sửa một số thông tin cơ bản (ví dụ: cập nhật email/SĐT nếu người dùng yêu cầu và xác minh), đặt lại mật khẩu (gửi link đặt lại cho người dùng), hoặc thêm ghi chú nội bộ về tài khoản.
*   **Quản lý Trạng thái Tài khoản (Manage Account Status):**
    *   **Tên tính năng:** `Thay đổi Trạng thái Tài khoản`
    *   **Mô tả:** Cho phép quản trị viên thực hiện các hành động quản lý trạng thái tài khoản:
        *   `Phê duyệt/Từ chối Hồ sơ Gia sư`: Thực hiện các bước trong quy trình duyệt gia sư (xem Phần 1.2).
        *   `Kích hoạt/Vô hiệu hóa Tài khoản (Activate/Deactivate)`: Tạm thời vô hiệu hóa tài khoản mà không xóa dữ liệu.
        *   `Tạm khóa Tài khoản (Suspend)`: Khóa tài khoản trong một thời gian nhất định do vi phạm.
        *   `Cấm Tài khoản (Ban)`: Khóa tài khoản vĩnh viễn do vi phạm nghiêm trọng.
        *   `Xóa Tài khoản (Delete)`: Xóa tài khoản và dữ liệu liên quan theo yêu cầu của người dùng hoặc chính sách.
*   **Quản lý Vai trò và Quyền hạn (Role & Permission Management - cho Admin):**
    *   **Tên tính năng:** `Quản lý Tài khoản Quản trị`
    *   **Mô tả:** Cho phép quản trị viên cấp cao (Super Admin) tạo và quản lý các tài khoản quản trị khác (Admin, Support Staff), gán vai trò và phân quyền truy cập các chức năng trong Admin Panel.

## 11.2 Quản lý nội dung (Content Management)

**Mô tả:** Cung cấp các công cụ để quản trị viên kiểm duyệt, chỉnh sửa hoặc gỡ bỏ các nội dung do người dùng tạo ra nhằm đảm bảo chất lượng và sự phù hợp của thông tin trên nền tảng.

**Tính năng chi tiết:**

*   **Kiểm duyệt Hồ sơ Gia sư (Tutor Profile Moderation):**
    *   **Tên tính năng:** `Duyệt Hồ sơ Gia sư`
    *   **Mô tả:** Giao diện chuyên biệt để xem xét các hồ sơ gia sư đang chờ duyệt, kiểm tra thông tin, xem giấy tờ đính kèm, ghi chú phỏng vấn và ra quyết định phê duyệt/từ chối/yêu cầu bổ sung.
*   **Kiểm duyệt Đánh giá và Bình luận (Review & Comment Moderation):**
    *   **Tên tính năng:** `Quản lý Đánh giá & Bình luận`
    *   **Mô tả:** Hiển thị danh sách các đánh giá/bình luận mới hoặc các đánh giá/bình luận bị người dùng báo cáo. Cho phép quản trị viên xem nội dung, thông tin người viết/người bị đánh giá, và thực hiện hành động (Phê duyệt, Ẩn, Xóa, Cảnh cáo người viết).
*   **Kiểm duyệt Tài liệu (Material Moderation):**
    *   **Tên tính năng:** `Quản lý Tài liệu Tải lên`
    *   **Mô tả:** Cung cấp giao diện để xem xét các tài liệu do gia sư tải lên (có thể kiểm tra ngẫu nhiên hoặc dựa trên báo cáo), kiểm tra vi phạm bản quyền hoặc nội dung không phù hợp. Cho phép quản trị viên ẩn hoặc xóa tài liệu vi phạm.
*   **Quản lý Nội dung Tĩnh (Static Content Management):**
    *   **Tên tính năng:** `Chỉnh sửa Trang Tĩnh`
    *   **Mô tả:** Cho phép quản trị viên chỉnh sửa nội dung các trang thông tin tĩnh của nền tảng như Giới thiệu, Điều khoản Sử dụng, Chính sách Bảo mật, Câu hỏi Thường gặp (FAQ) thông qua một trình soạn thảo văn bản (WYSIWYG editor).

## 11.3 Quản lý giao dịch (Transaction Management)

**Mô tả:** Cung cấp công cụ để quản trị viên theo dõi, kiểm tra, và xử lý các vấn đề liên quan đến giao dịch nạp điểm, thanh toán buổi học, hoàn tiền và thanh toán cho gia sư.

**Tính năng chi tiết:**

*   **Theo dõi Giao dịch Nạp điểm (Monitor Top-up Transactions):**
    *   **Tên tính năng:** `Lịch sử Nạp điểm Toàn hệ thống`
    *   **Mô tả:** Xem danh sách tất cả các giao dịch nạp điểm của người dùng, bao gồm thông tin người nạp, số tiền, số điểm, phương thức thanh toán, trạng thái giao dịch (Thành công, Thất bại, Đang chờ), mã giao dịch từ cổng thanh toán.
    *   **Hành động:** Cho phép quản trị viên kiểm tra chi tiết giao dịch, đối soát với cổng thanh toán nếu cần.
*   **Theo dõi Giao dịch Buổi học (Monitor Session Payments):**
    *   **Tên tính năng:** `Lịch sử Thanh toán Buổi học`
    *   **Mô tả:** Xem danh sách các giao dịch trừ điểm khi học viên đặt lịch hoặc thanh toán cho buổi học, bao gồm thông tin học viên, gia sư, buổi học, số điểm trừ.
*   **Xử lý Hoàn tiền (Handle Refunds):**
    *   **Tên tính năng:** `Quản lý Yêu cầu Hoàn điểm`
    *   **Mô tả:** Xem danh sách các yêu cầu hoàn điểm từ người dùng hoặc các trường hợp cần hoàn điểm do hệ thống/gia sư hủy lịch. Cho phép quản trị viên xem xét lý do, phê duyệt hoặc từ chối yêu cầu, và thực hiện hoàn điểm thủ công nếu cần.
*   **Quản lý Thanh toán Gia sư (Manage Tutor Payouts):**
    *   **Tên tính năng:** `Quản lý Thanh toán cho Gia sư`
    *   **Mô tả:** Xem danh sách các gia sư đủ điều kiện nhận thanh toán trong kỳ, số tiền dự kiến thanh toán. Cho phép quản trị viên xem lại chi tiết thu nhập, phí hoa hồng, và khởi tạo lệnh thanh toán (có thể tích hợp với hệ thống thanh toán hàng loạt của ngân hàng hoặc xử lý thủ công/bán tự động).
    *   **Theo dõi trạng thái:** Cập nhật trạng thái thanh toán cho từng gia sư (Đang chờ, Đang xử lý, Hoàn thành, Thất bại).
*   **Quản lý Mã giảm giá (Manage Discount Codes):**
    *   **Tên tính năng:** `Quản lý Mã khuyến mãi`
    *   **Mô tả:** Cho phép quản trị viên tạo, quản lý (sửa, xóa, kích hoạt/vô hiệu hóa) các mã giảm giá chung cho toàn nền tảng hoặc các mã giảm giá đặc biệt cho các chiến dịch marketing.

## 11.4 Quản lý hệ thống và Báo cáo (System Management & Reporting)

**Mô tả:** Cung cấp các công cụ để quản trị viên cấu hình các tham số hệ thống, theo dõi sức khỏe hệ thống và trích xuất các báo cáo tổng hợp về hoạt động kinh doanh và người dùng.

**Tính năng chi tiết:**

*   **Cấu hình Hệ thống (System Configuration):**
    *   **Tên tính năng:** `Cài đặt Chung`
    *   **Mô tả:** Cho phép quản trị viên cấu hình các tham số chung của nền tảng như: tỷ lệ hoa hồng mặc định, các gói nạp điểm, hạn sử dụng điểm, các môn học/cấp độ chuẩn hóa, chính sách hủy lịch mặc định, cài đặt email thông báo...
*   **Bảng điều khiển Tổng quan (Admin Dashboard):**
    *   **Tên tính năng:** `Dashboard Quản trị`
    *   **Mô tả:** Hiển thị các chỉ số quan trọng và tổng quan về tình hình hoạt động của nền tảng trên một màn hình duy nhất:
        *   Số lượng người dùng mới (học viên, gia sư) trong ngày/tuần/tháng.
        *   Số lượng buổi học diễn ra.
        *   Tổng doanh thu nạp điểm.
        *   Tổng thu nhập của gia sư.
        *   Số lượng hồ sơ/đánh giá chờ duyệt.
        *   Số lượng yêu cầu hỗ trợ đang mở.
*   **Báo cáo Thống kê (Statistical Reports):**
    *   **Tên tính năng:** `Trích xuất Báo cáo`
    *   **Mô tả:** Cung cấp khả năng tạo và trích xuất các báo cáo chi tiết về nhiều khía cạnh khác nhau:
        *   `Báo cáo Người dùng`: Thống kê nhân khẩu học, mức độ hoạt động, tỷ lệ giữ chân...
        *   `Báo cáo Gia sư`: Thống kê số lượng gia sư theo môn học, hiệu suất (đánh giá, thu nhập), tỷ lệ được đặt lịch...
        *   `Báo cáo Buổi học`: Thống kê số lượng buổi học theo môn học, thời gian, trạng thái hoàn thành...
        *   `Báo cáo Tài chính`: Thống kê doanh thu, chi phí hoa hồng, lợi nhuận...
        *   `Báo cáo Marketing`: Hiệu quả của các mã giảm giá, kênh giới thiệu...
    *   **Định dạng:** Cho phép xuất báo cáo ra các định dạng phổ biến (CSV, Excel, PDF).
*   **Theo dõi Sức khỏe Hệ thống (System Health Monitoring):**
    *   **Tên tính năng:** `Giám sát Hệ thống`
    *   **Mô tả:** Tích hợp hoặc cung cấp liên kết đến các công cụ giám sát hiệu năng máy chủ, tình trạng cơ sở dữ liệu, nhật ký lỗi hệ thống (system logs) để đội ngũ kỹ thuật có thể theo dõi và phát hiện sớm các vấn đề.
*   **Quản lý Thông báo Hệ thống (System Announcement Management):**
    *   **Tên tính năng:** `Gửi Thông báo Toàn hệ thống`
    *   **Mô tả:** Cho phép quản trị viên soạn và gửi các thông báo quan trọng (ví dụ: bảo trì hệ thống, cập nhật tính năng mới, chương trình khuyến mãi) đến tất cả người dùng hoặc một nhóm người dùng cụ thể qua email/thông báo trong ứng dụng.



