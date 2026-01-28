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

# Build
npm run build

# Start với .env.production
npm run start:prod
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

# Build
npm run build
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
