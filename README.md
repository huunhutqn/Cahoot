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

Project tự động load `.env.development` khi chạy `npm run dev`.

Cho production, set environment variables trực tiếp trên server (Docker/hosting):

```bash
# Server environment
export SOCKET_URL=https://cahoot-socket.nhut95.me
export NEXT_PUBLIC_SOCKET_URL=https://cahoot-socket.nhut95.me
```

**Hoặc tạo file `.env.local` cho custom config:**
```bash
# Development override
SOCKET_URL=http://your-socket-server:3001
NEXT_PUBLIC_SOCKET_URL=http://your-socket-server:3001
```

**.env files:**
- `.env.example` - Template (commit vào git)
- `.env.development` - Development defaults (commit vào git)
- `.env.local` - Custom local config (không commit)

4. Chạy development server:

```bash
npm run dev
```

5. Mở http://localhost:3000

## 🚀 Build Production

Build và start production:

```bash
# Build
npm run build

# Start (mặc định port 3000)
npm start

# Hoặc specify port
PORT=8080 npm start
```

**Với environment variables:**

```bash
# Set env trước khi build/start
export SOCKET_URL=https://cahoot-socket.nhut95.me
export NEXT_PUBLIC_SOCKET_URL=https://cahoot-socket.nhut95.me

npm run build
npm start
```

> **Lưu ý:** Với cấu hình `output: "standalone"`, `next start` tự động chạy `.next/standalone/server.js`

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
