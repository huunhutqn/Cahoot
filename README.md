# Cahoot Socket Server

WebSocket server cho Cahoot - một bản clone open-source của nền tảng Kahoot!

## 🧩 Giới thiệu

Đây là package **socket server** cho hệ thống Cahoot, chịu trách nhiệm xử lý:
- Real-time communication giữa players và manager
- Game state management
- Quiz configuration loading

## ⚙️ Yêu cầu

- Node.js: phiên bản 20 trở lên
- npm hoặc pnpm

## 📖 Cài đặt & Chạy

### 1. Clone và cài đặt dependencies

```bash
git clone <repository-url>
cd Cahoot-socket
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Các biến môi trường:

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `WEB_ORIGIN` | URL của web client (CORS) | `http://localhost:3000` |
| `SOCKET_PORT` | Port cho socket server | `3001` |
| `CONFIG_PATH` | Đường dẫn thư mục config (cho Docker) | - |

### 3. Chạy ứng dụng

```bash
# Development mode (với hot-reload)
npm run dev

# Production mode
npm run build
npm start
```

Socket server sẽ chạy tại: `ws://localhost:3001`

## 📁 Cấu trúc Project

```
├── config/                  # Thư mục cấu hình game
│   ├── game.json           # Cấu hình chung
│   └── quizz/              # Thư mục chứa các quiz
│       └── example.json    # Quiz mẫu
├── src/
│   ├── index.ts            # Entry point
│   ├── env.ts              # Environment variables
│   ├── common/
│   │   ├── types/          # TypeScript types
│   │   └── validators/     # Zod validators
│   ├── services/
│   │   ├── config.ts       # Config loader
│   │   ├── game.ts         # Game logic
│   │   └── registry.ts     # Game registry
│   └── utils/              # Utility functions
└── dist/                   # Built output
```

## ⚙️ Cấu hình

### 1. Game Configuration (`config/game.json`)

Cấu hình chung cho game:

```json
{
  "managerPassword": "PASSWORD",
  "music": true
}
```

| Option | Mô tả |
|--------|-------|
| `managerPassword` | Mật khẩu để truy cập giao diện quản lý |
| `music` | Bật/tắt nhạc trong game |

### 2. Quiz Configuration (`config/quizz/*.json`)

Tạo các file quiz trong thư mục `config/quizz/`. Bạn có thể có nhiều file quiz và chọn quiz khi bắt đầu game.

Ví dụ (`config/quizz/example.json`):

```json
{
  "subject": "Example Quiz",
  "questions": [
    {
      "question": "Đâu là câu trả lời đúng?",
      "answers": ["Không", "Đúng", "Không", "Không"],
      "image": "https://example.com/image.jpg",
      "solution": 1,
      "cooldown": 5,
      "time": 15
    }
  ]
}
```

| Option | Mô tả |
|--------|-------|
| `subject` | Tiêu đề/chủ đề của quiz |
| `questions` | Mảng các câu hỏi |
| `question` | Nội dung câu hỏi |
| `answers` | Mảng các đáp án (2-4 lựa chọn) |
| `image` | URL hình ảnh (tùy chọn) |
| `solution` | Index của đáp án đúng (bắt đầu từ 0) |
| `cooldown` | Thời gian chờ trước khi hiện câu hỏi (giây) |
| `time` | Thời gian trả lời (giây) |

## 🔌 Socket Events

### Client → Server

| Event | Payload | Mô tả |
|-------|---------|-------|
| `manager:auth` | `password: string` | Xác thực manager |
| `manager:reconnect` | `{ gameId: string }` | Kết nối lại cho manager |
| `game:create` | `quizzId: string` | Tạo game mới |
| `player:join` | `inviteCode: string` | Player tham gia game |
| `player:reconnect` | `{ gameId: string }` | Player kết nối lại |

### Server → Client

| Event | Payload | Mô tả |
|-------|---------|-------|
| `manager:quizzList` | `QuizzWithId[]` | Danh sách quiz |
| `manager:errorMessage` | `string` | Thông báo lỗi cho manager |
| `game:errorMessage` | `string` | Thông báo lỗi chung |
| `game:reset` | `string` | Reset game (game không tồn tại) |

## 🛠️ Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy development với hot-reload |
| `npm run build` | Build production |
| `npm start` | Chạy production build |
| `npm run lint` | Kiểm tra linting |

## 📝 License

ISC
