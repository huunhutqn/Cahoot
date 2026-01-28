# Cahoot Socket Server

WebSocket + REST API server cho Cahoot - một bản clone open-source của nền tảng Kahoot!

## 🧩 Giới thiệu

Đây là package **socket server** cho hệ thống Cahoot, chịu trách nhiệm xử lý:
- Real-time communication giữa players và manager (Socket.IO)
- Game state management
- Quiz CRUD operations (REST API + Socket.IO)
- Quiz configuration loading

## 🛠️ Tech Stack

- **Framework**: Express.js
- **WebSocket**: Socket.IO
- **Language**: TypeScript
- **Build**: esbuild
- **Runtime**: Node.js 20+

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

Hoặc sử dụng file `.env.production` có sẵn cho production.

Các biến môi trường:

| Biến | Mô tả | Mặc định |
|------|-------|----------|
| `NODE_ENV` | Môi trường (development/production) | `development` |
| `PORT` | Port cho socket server | `3001` |
| `WEB_ORIGIN` | URL của web client (CORS) | `http://localhost:3000` |

**Development (`.env`):**
```env
NODE_ENV=development
PORT=3001
WEB_ORIGIN=http://localhost:3000
```

**Production (`.env.production`):**
```env
NODE_ENV=production
PORT=3001
WEB_ORIGIN=https://cahoot.nhut95.me
```

### 3. Chạy ứng dụng

**Development:**
```bash
npm run dev
```

**Production (với .env.production):**
```bash
# Install dependencies
npm install

# Build và start production (một lệnh)
npm run prod

# Hoặc chạy riêng rẽ:
npm run build          # Build
npm run start:prod     # Start với .env.production
```

**Production (với PM2):**
```bash
# Start với .env.production
pm2 start dist/index.cjs --name cahoot-socket --node-args="-r dotenv/config" --update-env -- dotenv_config_path=.env.production

# Hoặc dùng ecosystem file (xem phần Deploy)
pm2 start ecosystem.config.js
```

Socket server sẽ chạy tại:
- Development: `ws://localhost:3001`
- Production: `wss://cahoot-socket.nhut95.me` (qua reverse proxy)

## 📁 Cấu trúc Project

```
├── config/                  # Thư mục cấu hình game
│   ├── game.json           # Cấu hình chung
│   └── quizz/              # Thư mục chứa các quiz
│       └── example.json    # Quiz mẫu
├── src/
│   ├── index.ts            # Entry point (Express + Socket.IO)
│   ├── env.ts              # Environment variables
│   ├── routes/             # REST API routes
│   │   └── quizz.ts        # Quiz CRUD endpoints
│   ├── common/
│   │   ├── types/          # TypeScript types
│   │   └── validators/     # Zod validators
│   ├── services/
│   │   ├── config.ts       # Config loader
│   │   ├── quizz.ts        # Quiz service (with caching)
│   │   ├── game.ts         # Game logic
│   │   └── registry.ts     # Game registry
│   └── utils/              # Utility functions
└── dist/                   # Built output (index.js)
```

## 🌐 API Endpoints

### Health Check

**GET /**
```json
{
  "status": "ok",
  "service": "Cahoot Socket Server",
  "version": "1.0.0",
  "framework": "Express + Socket.IO",
  "uptime": 123.45
}
```

**GET /health**
```json
{
  "status": "healthy",
  "connections": 5,
  "games": 2,
  "uptime": 123.45
}
```

### Quiz REST API

Base URL: `/api/quizz`

**GET /api/quizz**
- Lấy tất cả quizzes
- Response: `QuizzWithId[]`

**GET /api/quizz/:id**
- Lấy một quiz theo ID
- Response: `QuizzWithId`

**POST /api/quizz**
- Tạo quiz mới
- Body: `{ id: string, data: Quizz }`
- Response: `QuizzWithId` (201)

**PUT /api/quizz/:id**
- Cập nhật quiz
- Body: `Quizz`
- Response: `QuizzWithId`

**DELETE /api/quizz/:id**
- Xóa quiz
- Response: `{ message: string, id: string }`
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

### Game Events

#### Client → Server

| Event | Payload | Mô tả |
|-------|---------|-------|
| `manager:auth` | `password: string` | Xác thực manager |
| `manager:reconnect` | `{ gameId: string }` | Kết nối lại cho manager |
| `game:create` | `quizzId: string` | Tạo game mới |
| `player:join` | `inviteCode: string` | Player tham gia game |
| `player:reconnect` | `{ gameId: string }` | Player kết nối lại |

#### Server → Client

| Event | Payload | Mô tả |
|-------|---------|-------|
| `manager:quizzList` | `QuizzWithId[]` | Danh sách quiz |
| `manager:errorMessage` | `string` | Thông báo lỗi cho manager |
| `game:errorMessage` | `string` | Thông báo lỗi chung |
| `game:reset` | `string` | Reset game (game không tồn tại) |

### Quiz Management Events (CRUD)

#### Client → Server

| Event | Payload | Mô tả |
|-------|---------|-------|
| `quizz:getAll` | - | Lấy danh sách tất cả quiz |
| `quizz:getById` | `string` (id) | Lấy một quiz theo ID |
| `quizz:create` | `{ id: string, data: Quizz }` | Tạo quiz mới |
| `quizz:update` | `{ id: string, data: Quizz }` | Cập nhật quiz |
| `quizz:delete` | `{ id: string }` | Xóa quiz |

#### Server → Client

| Event | Payload | Mô tả |
|-------|---------|-------|
| `quizz:list` | `QuizzWithId[]` | Danh sách tất cả quiz |
| `quizz:single` | `QuizzWithId` | Chi tiết một quiz |
| `quizz:created` | `QuizzWithId` | Quiz vừa tạo |
| `quizz:updated` | `QuizzWithId` hoặc broadcast | Quiz vừa cập nhật |
| `quizz:deleted` | `{ id: string }` | ID quiz vừa xóa |
| `quizz:error` | `string` | Thông báo lỗi |

#### Quiz Data Structure

```typescript
{
  id: string,  // Quiz ID (tên file không có .json)
  data: {
    subject: string,  // Tiêu đề quiz
    questions: [
      {
        question: string,      // Câu hỏi
        answers: string[],     // Mảng đáp án (2-4 items)
        image?: string,        // URL hình ảnh (optional)
        solution: number,      // Index đáp án đúng (0-based)
        cooldown: number,      // Thời gian chờ (giây)
        time: number          // Thời gian trả lời (giây)
      }
    ]
  }
}
```

#### Ví dụ sử dụng Quiz CRUD

**1. Lấy tất cả quiz:**
```javascript
socket.emit('quizz:getAll');
socket.on('quizz:list', (quizzes) => {
  console.log(quizzes);
});
```

**2. Tạo quiz mới:**
```javascript
socket.emit('quizz:create', {
  id: 'my-quiz',
  data: {
    subject: 'My Quiz',
    questions: [
      {
        question: 'What is 2+2?',
        answers: ['3', '4', '5', '6'],
        solution: 1,
        cooldown: 3,
        time: 10
      }
    ]
  }
});

socket.on('quizz:created', (quiz) => {
  console.log('Created:', quiz);
});

socket.on('quizz:error', (error) => {
  console.error(error);
});
```

**3. Cập nhật quiz:**
```javascript
socket.emit('quizz:update', {
  id: 'my-quiz',
  data: {
    subject: 'Updated Quiz',
    questions: [...]
  }
});
```

**4. Xóa quiz:**
```javascript
socket.emit('quizz:delete', { id: 'my-quiz' });
socket.on('quizz:deleted', (result) => {
  console.log('Deleted:', result.id);
});
```

## 🛠️ Scripts

| Script | Mô tả |
|--------|-------|
| `npm run dev` | Chạy development với hot-reload |
| `npm run build` | Build production |
| `npm start` | Chạy production build |
| `npm run start:prod` | Start với .env.production |
| `npm run prod` | **Build và start production (all-in-one)** |
| `npm run lint` | Kiểm tra linting |

## � Deploy lên Production Server

### 1. Chuẩn bị server

```bash
# Clone code
git clone <repository-url>
cd Cahoot-socket

# Install dependencies
npm install

# File .env.production đã có sẵn với cấu hình production
# Hoặc tạo/edit file .env.production nếu cần:
# NODE_ENV=production
# PORT=3001
# WEB_ORIGIN=https://cahoot.nhut95.me

# Build và start (một lệnh) - Test thử trước
npm run prod

# Nếu chạy OK, stop và chuyển sang dùng PM2
```

### 2. Setup với PM2 (Khuyên dùng)

**Cách 1: Dùng script có sẵn**
```bash
# Install PM2
npm install -g pm2

# Start với .env.production
npm run start:prod

# Hoặc dùng PM2 trực tiếp
pm2 start npm --name cahoot-socket -- run start:prod

# Enable auto-restart on server reboot
pm2 startup
pm2 save
```

**Cách 2: Dùng PM2 Ecosystem File** (khuyên dùng)

Tạo file `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'cahoot-socket',
    script: 'dist/index.cjs',
    env_file: '.env.production',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    error_file: 'logs/error.log',
    out_file: 'logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z'
  }]
};
```

Chạy với ecosystem:
```bash
# Start
pm2 start ecosystem.config.js

# Enable auto-restart
pm2 startup
pm2 save
```

**PM2 Useful Commands:**
```bash
pm2 logs cahoot-socket      # Xem logs
pm2 restart cahoot-socket   # Restart
pm2 stop cahoot-socket      # Stop
pm2 delete cahoot-socket    # Remove
pm2 monit                   # Monitor real-time
pm2 list                    # List all processes
```

### 3. Setup Nginx Reverse Proxy

Tạo file `/etc/nginx/sites-available/cahoot-socket`:

```nginx
server {
    listen 80;
    server_name cahoot-socket.nhut95.me;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/cahoot-socket /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 4. Setup SSL với Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d cahoot-socket.nhut95.me
```

### Production URLs:
- Socket Server: `wss://cahoot-socket.nhut95.me`
- Web Frontend: `https://cahoot.nhut95.me`

## �📝 License

ISC
