# Quiz CRUD API Examples

Dưới đây là các ví dụ sử dụng Socket.IO client để quản lý quiz.

## Setup Socket.IO Client

```javascript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');
```

## 1. Lấy tất cả quiz

```javascript
// Emit event
socket.emit('quizz:getAll');

// Listen response
socket.on('quizz:list', (quizzes) => {
  console.log('All quizzes:', quizzes);
  // Output: Array of QuizzWithId
});

socket.on('quizz:error', (error) => {
  console.error('Error:', error);
});
```

## 2. Lấy một quiz theo ID

```javascript
socket.emit('quizz:getById', 'example');

socket.on('quizz:single', (quiz) => {
  console.log('Quiz:', quiz);
});
```

## 3. Tạo quiz mới

```javascript
socket.emit('quizz:create', {
  id: 'my-new-quiz',
  data: {
    subject: 'JavaScript Quiz',
    questions: [
      {
        question: 'What is the result of 2 + 2?',
        answers: ['3', '4', '5', '22'],
        solution: 1,
        cooldown: 3,
        time: 10
      },
      {
        question: 'Which is a JavaScript framework?',
        answers: ['React', 'Django', 'Laravel', 'Rails'],
        image: 'https://example.com/frameworks.png',
        solution: 0,
        cooldown: 3,
        time: 15
      }
    ]
  }
});

socket.on('quizz:created', (quiz) => {
  console.log('Created quiz:', quiz);
});

// Listen for broadcast update (tất cả clients sẽ nhận)
socket.on('quizz:updated', () => {
  console.log('Quiz list has been updated!');
  // Refetch quiz list
  socket.emit('quizz:getAll');
});
```

## 4. Cập nhật quiz

```javascript
socket.emit('quizz:update', {
  id: 'my-new-quiz',
  data: {
    subject: 'Updated JavaScript Quiz',
    questions: [
      {
        question: 'What is the result of 2 + 2?',
        answers: ['3', '4', '5', '22'],
        solution: 1,
        cooldown: 5,
        time: 20
      }
    ]
  }
});

socket.on('quizz:updated', (quiz) => {
  console.log('Updated quiz:', quiz);
});
```

## 5. Xóa quiz

```javascript
socket.emit('quizz:delete', {
  id: 'my-new-quiz'
});

socket.on('quizz:deleted', (result) => {
  console.log('Deleted quiz ID:', result.id);
});
```

## Validation Rules

### Quiz ID
- Chỉ chứa: chữ cái, số, dấu gạch ngang (-), và gạch dưới (_)
- Ví dụ hợp lệ: `my-quiz`, `quiz_1`, `javascript-basics`

### Questions
- Minimum 1 question
- Mỗi question phải có:
  - `question`: string không rỗng
  - `answers`: array 2-4 items
  - `solution`: số integer >= 0 (index của đáp án đúng)
  - `cooldown`: số integer >= 0 (giây)
  - `time`: số integer >= 1 (giây)
  - `image`: URL hợp lệ (optional)

## Error Handling

Tất cả errors sẽ được emit qua event `quizz:error`:

```javascript
socket.on('quizz:error', (errorMessage) => {
  console.error('Quiz operation failed:', errorMessage);
  
  // Possible errors:
  // - "Quiz already exists" (create)
  // - "Quiz not found" (update, delete, getById)
  // - "Quiz ID can only contain letters, numbers, hyphens and underscores"
  // - "At least 1 question required"
  // - "At least 2 answers required"
  // - etc.
});
```

## Complete Example: Quiz Manager

```javascript
import { io } from 'socket.io-client';

const socket = io('ws://localhost:3001');

// Setup error handler
socket.on('quizz:error', (error) => {
  console.error('❌ Error:', error);
});

// Setup update listener (for real-time sync)
socket.on('quizz:updated', () => {
  console.log('📢 Quiz list updated!');
  loadAllQuizzes();
});

// Load all quizzes
function loadAllQuizzes() {
  socket.emit('quizz:getAll');
}

socket.on('quizz:list', (quizzes) => {
  console.log('📚 All quizzes:', quizzes);
});

// Create new quiz
function createQuiz(id, data) {
  socket.emit('quizz:create', { id, data });
}

socket.on('quizz:created', (quiz) => {
  console.log('✅ Quiz created:', quiz);
});

// Update quiz
function updateQuiz(id, data) {
  socket.emit('quizz:update', { id, data });
}

socket.on('quizz:updated', (quiz) => {
  if (quiz) {
    console.log('✅ Quiz updated:', quiz);
  }
});

// Delete quiz
function deleteQuiz(id) {
  socket.emit('quizz:delete', { id });
}

socket.on('quizz:deleted', (result) => {
  console.log('✅ Quiz deleted:', result.id);
});

// Usage
loadAllQuizzes();

// Create a new quiz
createQuiz('javascript-basics', {
  subject: 'JavaScript Basics',
  questions: [
    {
      question: 'What is JavaScript?',
      answers: ['Programming Language', 'Database', 'OS', 'Browser'],
      solution: 0,
      cooldown: 3,
      time: 15
    }
  ]
});
```

## Files Structure

Sau khi tạo quiz, file sẽ được lưu tại:

```
config/
  └── quizz/
      ├── example.json
      ├── my-new-quiz.json
      └── javascript-basics.json
```

Mỗi file JSON có cấu trúc:

```json
{
  "subject": "Quiz Subject",
  "questions": [
    {
      "question": "Question text?",
      "answers": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "image": "https://example.com/image.png",
      "solution": 0,
      "cooldown": 5,
      "time": 20
    }
  ]
}
```
