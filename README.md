# 🛠️ Стек технологий

### **Frontend**
- React
- TypeScript
- React Router DOM
- useSWR
- React DnD (react-dnd + HTML5 Backend)
- Material-UI (MUI)
- @emotion/react / @emotion/styled (CSS-in-JS)
- localStorage (локальное хранение данных)
- Axios (предполагается по структуре сервисов)
- MobX (указан в зависимостях, вероятно используется)

### **Backend**
- Node.js
- TypeScript
- Express
- Express-ws (WebSocket поддержка)
- PostgreSQL
- Sequelize (ORM)
- Bcrypt (хеширование паролей)
- JSON Web Token (JWT)
- CORS
- Dotenv (переменные окружения)
- Swagger (API документация)
- Nodemon (автоперезагрузка сервера)
- ts-node
- Jest (тестирование)

---

# 📦 Инструкция по запуску проекта

Следуйте этим шагам, чтобы запустить проект локально.

---

### 1. Клонируйте репозиторий

```bash
git clone <ссылка-на-ваш-репозиторий>
cd <название-папки-проекта>
```

---

### 2. Установите зависимости

Убедитесь, что у вас установлен `npm` и `Node.js` (версия 16+).

```bash
npm install
```


> Повторите `npm install` в папках `front/` и `back/`.

---

### 3. Настройте базу данных

1. Установите и запустите **PostgreSQL**.
2. Создайте новую базу данных:

```sql
CREATE DATABASE your_database_name;
```

3. (Опционально) Создайте пользователя и дайте права:

```sql
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE your_database_name TO your_user;
```

---

### 4. Настройте переменные окружения

Создайте файл `.env` в папке **backend** (`back/.env`):

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_user
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

> Замените значения на свои.  
> Пример: `DB_NAME=taskboard_db`, `DB_USER=postgres`, `DB_PASSWORD=12345`, `JWT_SECRET=secret123`

---

### 5. Запустите проект

#### Вариант A: Если проекты в одной папке (monorepo)

Откройте два терминала:

**Терминал 1 — Backend:**

```bash
cd back
npm run dev
```

> Сервер запустится на `http://localhost:5000`

**Терминал 2 — Frontend:**

```bash
cd front
npm start
```

> Приложение откроется в браузере на `http://localhost:3000`

---

#### Вариант B: Если проекты разделены

Запускайте каждый проект отдельно, как описано выше.
