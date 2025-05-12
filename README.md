# DiaDiemVR - Nền tảng Tour Ảo 3D Tương tác

![DiaDiemVR Logo](./public/android-chrome-192x192.png)

## 📖 Tổng quan

DiaDiemVR là một nền tảng tour ảo tiên tiến kết hợp bản đồ tương tác, các điểm tham quan địa lý và trải nghiệm toàn cảnh 360°. Được xây dựng bằng React, 3D Vista và các công nghệ web hiện đại, ứng dụng này mang đến trải nghiệm khám phá ảo mượt mà và hấp dẫn.

## 🌟 Tính năng chính

- **Tour 3D/VR Tương tác**: Trải nghiệm góc nhìn toàn cảnh 360° của các địa điểm khác nhau
- **Bản đồ tương tác**: Điều hướng địa lý với các điểm đánh dấu và thông tin chi tiết
- **Điểm tham quan dựa trên vị trí**: Di chuyển giữa các điểm quan tâm khác nhau
- **Tìm kiếm thời gian thực**: Tìm địa điểm nhanh chóng với chức năng gợi ý tự động
- **Thiết kế đáp ứng**: Hoạt động trên máy tính, tablet và điện thoại di động
- **Hỗ trợ đa ngôn ngữ**: Hỗ trợ giao diện tiếng Việt và tiếng Anh

## 🛠️ Công nghệ sử dụng

- **Frontend**: React.js, Tailwind CSS, Mantine UI
- **Bản đồ**: MapLibre GL JS
- **Trải nghiệm VR**: 3D Vista
- **Backend**: Supabase (PostgreSQL)
- **Quản lý trạng thái**: Zustand
- **API**: RESTful API với TypeScript

## 📋 Yêu cầu trước khi bắt đầu

Trước khi bắt đầu, hãy đảm bảo bạn đã có các công cụ sau:

- Node.js (v16.x trở lên)
- npm hoặc yarn
- Git
- Tài khoản Supabase (cho backend)
- Giấy phép 3D Vista (để tạo nội dung VR)
- Khóa API của Goong Maps (cho chức năng bản đồ)

## 🚀 Bắt đầu

### Cài đặt

```bash
# Sao chép dự án
git clone https://github.com/yourusername/diadiemvr.git
cd diadiemvr/frontend

# Cài đặt các gói phụ thuộc
npm install

# Thiết lập biến môi trường
cp .env.example .env.local
```

### Biến môi trường

Tạo một tệp `.env.local` trong thư mục gốc của dự án và thêm các mục sau:

```
VITE_SUPABASE_URL=url_supabase_của_bạn
VITE_SUPABASE_ANON_KEY=key_supabase_của_bạn
VITE_GOONG_MAP_API_KEY=key_api_goong_của_bạn
VITE_GOONG_MAP_TILES_KEY=key_tiles_goong_của_bạn
```

### Thiết lập cơ sở dữ liệu

Thực hiện các lệnh SQL sau trong trình soạn thảo SQL của Supabase để tạo các bảng cần thiết:

```sql
-- Tạo bảng panorama để lưu trữ hình ảnh toàn cảnh VR
CREATE TABLE panorama (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255),
  preview_image_url VARCHAR(255)
);

-- Tạo bảng hotspots cho các điểm tham quan
CREATE TABLE hotspots (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  preview_image_url VARCHAR(255),
  click_panorama_id VARCHAR(255),
  address VARCHAR(255),
  url VARCHAR(255),
  geolocation JSONB, -- Lưu trữ tọa độ lat/lon
  FOREIGN KEY (click_panorama_id) REFERENCES panorama(id)
);
```

### Chạy máy chủ phát triển

```bash
# Khởi động máy chủ phát triển
npm run dev

# Ứng dụng sẽ khả dụng tại http://localhost:5173
```

## 🧩 Cấu trúc dự án

```
frontend/
├── public/             # Tài sản tĩnh
│   └── vr_core/        # Nội dung VR 3D Vista
├── src/
│   ├── components/     # Các thành phần có thể tái sử dụng
│   ├── constants/      # Hằng số ứng dụng
│   ├── hooks/          # Các hook React tùy chỉnh
│   ├── library/        # Kết nối thư viện bên ngoài
│   ├── pages/          # Các thành phần trang
│   ├── services/       # Dịch vụ API
│   ├── store/          # Quản lý trạng thái Zustand
│   ├── styles/         # Kiểu chung
│   ├── App.jsx         # Thành phần ứng dụng chính
│   └── main.jsx        # Điểm vào
├── .env.local          # Biến môi trường
└── package.json        # Phụ thuộc và tập lệnh
```

## 🔄 Quy trình phát triển

### Thêm điểm tham quan mới

1. Tạo toàn cảnh mới trong 3D Vista và xuất sang thư mục `public/vr_core`
2. Thêm thông tin toàn cảnh vào bảng `panorama` trong Supabase
3. Tạo điểm tham quan mới trong bảng `hotspots`, liên kết với toàn cảnh

### Tùy chỉnh bản đồ

Chức năng bản đồ được xử lý trong `MapModal.jsx`. Bạn có thể tùy chỉnh:

- Tọa độ trung tâm mặc định
- Mức thu phóng
- Kiểu điểm đánh dấu
- Nội dung cửa sổ bật lên

```jsx
// Ví dụ tùy chỉnh điểm đánh dấu
const markerEl = document.createElement("div");
markerEl.className = "map-marker";
markerEl.style.width = "24px";
markerEl.style.height = "24px";
markerEl.style.borderRadius = "50%";
markerEl.style.backgroundColor = "#4285F4";
markerEl.style.border = "2px solid white";
```

### Quản lý trạng thái

Ứng dụng sử dụng Zustand để quản lý trạng thái:

- `hotspot.store.js` quản lý dữ liệu điểm tham quan
- Sử dụng hook `useHotspotStore` để truy cập và cập nhật trạng thái

```jsx
const { currentHotspot, setCurrentHotspot } = useHotspotStore((state) => ({
  currentHotspot: state.currentHotspot,
  setCurrentHotspot: state.setCurrentHotspot,
}));
```

## 🌐 Tích hợp với 3D Vista

1. Tạo tour ảo của bạn trong 3D Vista
2. Xuất dự án dưới dạng HTML
3. Đặt các tệp đã xuất trong thư mục `public/vr_core`
4. Sử dụng hàm `showMedia` để điều hướng giữa các toàn cảnh

```jsx
// Hiển thị toàn cảnh với ID cụ thể
showMedia("PANORAMA_ID");
```

## 📊 Tham khảo API

### Dịch vụ điểm tham quan

```typescript
// Lấy tất cả điểm tham quan
getAllHotspots(): Promise<Hotspot[]>

// Tìm kiếm điểm tham quan theo tiêu đề
searchHotspotsByTitle(title: string): Promise<Hotspot[]>

// Lấy điểm tham quan theo ID
getHotspotById(id: string): Promise<Hotspot>

// Tạo điểm tham quan mới
createHotspot(hotspotData: HotspotData): Promise<Hotspot>
```

## 📱 Tối ưu hóa cho thiết bị di động

Ứng dụng được thiết kế để đáp ứng trên tất cả các thiết bị:

- Sử dụng hook `useMediaQuery` từ Mantine cho bố cục đáp ứng
- Kiểm tra trên nhiều kích thước màn hình trong quá trình phát triển
- Tối ưu hóa tương tác cảm ứng cho người dùng di động

## 🔍 Xử lý sự cố

### Vấn đề thường gặp

**Bản đồ không tải:**

- Xác minh khóa API Goong Maps của bạn là chính xác
- Kiểm tra các yêu cầu mạng để tìm lỗi
- Đảm bảo container có chiều cao xác định

**Nội dung VR không xuất hiện:**

- Xác minh cài đặt xuất 3D Vista
- Kiểm tra console để tìm lỗi kịch bản
- Đảm bảo iframe có quyền chính xác

**Điểm tham quan không hiển thị:**

- Kiểm tra kết nối Supabase
- Xác minh dữ liệu điểm tham quan bao gồm tọa độ hợp lệ
- Kiểm tra lỗi JavaScript trong console

## 🤝 Đóng góp

1. Fork kho lưu trữ
2. Tạo nhánh tính năng của bạn (`git checkout -b feature/tinh-nang-tuyet-voi`)
3. Commit các thay đổi của bạn (`git commit -m 'Thêm tính năng tuyệt vời'`)
4. Đẩy lên nhánh (`git push origin feature/tinh-nang-tuyet-voi`)
5. Mở Pull Request

## 📄 Giấy phép

Dự án này được cấp phép theo Giấy phép MIT - xem tệp LICENSE để biết chi tiết.

## 🙏 Lời cảm ơn

- [React.js](https://reactjs.org/)
- [Mantine UI](https://mantine.dev/)
- [3D Vista](https://3dvista.com/)
- [MapLibre GL](https://maplibre.org/)
- [Supabase](https://supabase.io/)
- [Goong Maps](https://goong.io/)

---

Được phát triển với ❤️ bởi [@vrdiachido](https://github.com/vrdiachido)
