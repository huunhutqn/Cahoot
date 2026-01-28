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
- npm hoặc yarn
- Cahoot Socket Server đang chạy

## 📖 Cài đặt

1. Clone repository:

```bash
git clone https://github.com/huunhutqn/Cahoot.git
cd Cahoot
```

2. Cài đặt dependencies:

```bash
npm install
```

3. **Environment Variables**

Project sử dụng các file env sau:

- `.env.development` - Tự động load khi chạy `npm run dev`
- `.env.production` - Tự động load khi chạy `npm run build` và `npm start`
- `.env.local` - Override cho cấu hình local (không commit vào git)

**Development** (mặc định):
```env
SOCKET_URL=http://localhost:3001
```

**Production** (đã có sẵn trong `.env.production`):
```env
SOCKET_URL=https://cahoot-socket.nhut95.me
```

**Custom local** (tùy chọn - tạo file `.env.local`):
```bash
# Override bất kỳ env nào
SOCKET_URL=http://your-custom-socket-url:3001
```

4. Chạy development server:

```bash
npm run dev
```

5. Mở http://localhost:3000

## 🚀 Build Production

Next.js được cấu hình với `output: "standalone"`, nên cần sử dụng Node.js trực tiếp để chạy server.

**Cách nhanh nhất (khuyến nghị):**

```bash
# Build và start production server (một lệnh)
npm run prod
```

**Hoặc build và start riêng biệt:**

```bash
# Build với production env
npm run build:prod

# Start production server
npm start:prod
```

**Hoặc chạy Node.js trực tiếp:**

```bash
NODE_ENV=production node .next/standalone/server.js
```

> **Lưu ý:** Với cấu hình `output: "standalone"`, phải sử dụng `node .next/standalone/server.js` thay vì `next start`.

## 🐳 Docker

### Build cho Production

```bash
# Build với production socket URL (mặc định: https://cahoot-socket.nhut95.me)
docker build -t cahoot-web .

# Hoặc build với custom socket URL
docker build -t cahoot-web --build-arg SOCKET_URL=https://your-socket-server.com .
```

### Chạy container

```bash
docker run -d -p 3000:3000 cahoot-web
```

### Sử dụng Docker Compose

```bash
# Production
docker compose up -d

# Development (với local socket server)
docker compose --profile dev up cahoot-web-dev
```

## 🌐 Production URLs

- **Web**: https://cahoot.nhut95.me
- **Socket Server**: https://cahoot-socket.nhut95.me

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
