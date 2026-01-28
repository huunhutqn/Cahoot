# Cahoot Web

Web frontend cho Cahoot - một bản clone mã nguồn mở của Kahoot!

## 🧩 Giới thiệu

Đây là phần **web frontend** của dự án Cahoot, được xây dựng bằng Next.js 16 và React 19. Web app này kết nối với [Cahoot Socket Server](https://github.com/huunhutqn/Cahoot-socket) để tạo trải nghiệm quiz game realtime.

## 🛠️ Tech Stack

- **Framework**: Next.js 16
- **UI**: React 19, TailwindCSS 4
- **State Management**: Zustand
- **Realtime**: Socket.IO Client
- **Animation**: Motion (Framer Motion)
- **Form Validation**: Yup, Zod

## ⚙️ Yêu cầu

- Node.js >= 20
- PNPM (khuyến nghị) hoặc npm
- Cahoot Socket Server đang chạy

## 📖 Cài đặt

1. Clone repository:

```bash
git clone https://github.com/huunhutqn/Cahoot.git
cd Cahoot
```

2. Cài đặt dependencies:

```bash
pnpm install
```

3. Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

4. Cấu hình biến môi trường:

```env
SOCKET_URL=http://localhost:3001
```

5. Chạy development server:

```bash
pnpm dev
```

6. Mở http://localhost:3000

## 🚀 Build Production

```bash
pnpm build
pnpm start
```

## 🐳 Docker

### Sử dụng Docker Compose (khuyến nghị)

```bash
docker compose up -d
```

### Sử dụng Docker trực tiếp

```bash
docker build -t cahoot-web .
docker run -d -p 3000:3000 -e SOCKET_URL=http://your-socket-server:3001 cahoot-web
```

## 📁 Cấu trúc thư mục

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth pages (login, manager)
│   ├── game/              # Game pages
│   └── socket/            # Socket API route
├── common/                 # Shared types và validators
├── components/            # React components
│   ├── game/              # Game-specific components
│   └── icons/             # Icon components
├── contexts/              # React contexts (Socket provider)
├── hooks/                 # Custom hooks
├── stores/                # Zustand stores
└── utils/                 # Utility functions và constants

config/                    # Config files (for socket server)
public/
└── sounds/               # Game sound effects
```

## 🎮 Cách chơi

1. **Quản trị viên**: Truy cập `/manager`, nhập mật khẩu và chọn quiz
2. **Người chơi**: Truy cập trang chủ `/`, nhập mã phòng và tên
3. Quản trị viên bắt đầu game khi tất cả người chơi đã tham gia
4. Trả lời câu hỏi nhanh và chính xác để ghi điểm!

## 🔗 Liên kết

- [Cahoot Socket Server](https://github.com/huunhutqn/Cahoot-socket) - Backend WebSocket server
- [Báo lỗi / Góp ý](https://github.com/huunhutqn/Cahoot/issues)

## 📝 Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feat/my-feature`)
3. Commit changes (`git commit -m 'Add my feature'`)
4. Push to branch (`git push origin feat/my-feature`)
5. Tạo Pull Request
