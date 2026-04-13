# 久坐赎罪健身项目部署指南

## 项目简介

久坐赎罪健身是一个基于 React + TypeScript + Supabase 的健身追踪应用，旨在帮助用户记录锻炼情况，追踪身体变化。

## 环境要求

- Node.js 16.0 或更高版本
- npm 7.0 或更高版本
- Supabase 账号（用于数据库和认证）

## 本地部署

### 1. 克隆项目

```bash
git clone <项目仓库地址>
cd <项目目录>
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

创建 `.env` 文件，添加以下内容：

```env
# Supabase 配置
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### 4. 数据库设置

1. 登录 Supabase 控制台
2. 创建新的项目
3. 在 SQL Editor 中执行以下 SQL 语句创建所需表结构：

```sql
-- 健身计划表
CREATE TABLE fitness_plans (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  goal TEXT NOT NULL,
  duration_date INT4 NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 训练日程表
CREATE TABLE workout_schedules (
  id UUID PRIMARY KEY,
  plan_id UUID REFERENCES fitness_plans(id),
  day INT4 NOT NULL,
  workout_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 训练动作表
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY,
  schedule_id UUID REFERENCES workout_schedules(id),
  name TEXT NOT NULL,
  sets INT4 NOT NULL,
  reps INT4,
  duration INT4,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 锻炼记录表
CREATE TABLE workout_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  plan_id UUID REFERENCES fitness_plans(id),
  schedule_id UUID REFERENCES workout_schedules(id),
  exercise_id UUID REFERENCES workout_exercises(id),
  date DATE NOT NULL,
  sets_completed INT4 NOT NULL,
  reps_completed INT4,
  weight NUMERIC,
  duration INT4,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 身体数据表
CREATE TABLE body_measurements (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  date DATE NOT NULL,
  weight NUMERIC NOT NULL,
  waist NUMERIC NOT NULL,
  hip NUMERIC NOT NULL,
  chest NUMERIC NOT NULL,
  arm NUMERIC NOT NULL,
  leg NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 饮食计划表
CREATE TABLE diet_plans (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  goal TEXT NOT NULL,
  duration INT4 NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 饮食记录表
CREATE TABLE diet_records (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  plan_id UUID REFERENCES diet_plans(id),
  date DATE NOT NULL,
  meal_type TEXT NOT NULL,
  food TEXT NOT NULL,
  calories NUMERIC NOT NULL,
  protein NUMERIC,
  carbs NUMERIC,
  fat NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 5. 启动开发服务器

```bash
npm run dev
```

项目将在 http://localhost:3000 启动（如果端口被占用，会自动使用其他端口）。

## 云服务器部署

### 1. 准备服务器

- 选择云服务器提供商（如 AWS, Azure, GCP, 阿里云等）
- 选择 Linux 操作系统（推荐 Ubuntu 20.04 或更高版本）
- 确保服务器有至少 2GB 内存

### 2. 服务器配置

#### 2.1 安装必要软件

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 安装 npm 最新版本
npm install -g npm@latest

# 安装 Git
sudo apt install -y git

# 安装 PM2（用于进程管理）
npm install -g pm2
```

#### 2.2 克隆项目

```bash
git clone <项目仓库地址>
cd <项目目录>
```

#### 2.3 安装依赖

```bash
npm install
```

#### 2.4 配置环境变量

创建 `.env` 文件，添加以下内容：

```env
# Supabase 配置
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

#### 2.5 构建项目

```bash
npm run build
```

### 3. 部署选项

#### 3.1 使用 PM2 部署

```bash
# 安装 serve 包
npm install -g serve

# 使用 PM2 启动服务
pm run build
pm run preview

# 或者使用 serve 命令
pm run build
pm install -g serve
pm run preview
```

#### 3.2 使用 Nginx 部署

1. 安装 Nginx：

```bash
sudo apt install -y nginx
```

2. 配置 Nginx：

```bash
sudo nano /etc/nginx/sites-available/fitness-app
```

添加以下配置：

```nginx
server {
    listen 80;
    server_name <your-domain>;

    location / {
        root /path/to/your/project/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

3. 启用配置：

```bash
sudo ln -s /etc/nginx/sites-available/fitness-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 4. 域名和 HTTPS

1. 配置域名 A 记录指向服务器 IP
2. 安装 Certbot 获取 HTTPS 证书：

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d <your-domain>
```

## 部署检查清单

- [ ] 环境变量配置正确
- [ ] Supabase 项目创建并配置
- [ ] 数据库表结构创建完成
- [ ] 依赖安装完成
- [ ] 项目构建成功
- [ ] 服务正常运行
- [ ] 域名和 HTTPS 配置完成

## 常见问题

### 1. 端口被占用

如果默认端口 3000 被占用，可以使用 `--port` 参数指定其他端口：

```bash
npm run dev -- --port 3001
```

### 2. Supabase 连接失败

- 检查 `.env` 文件中的 Supabase URL 和 API 密钥是否正确
- 确保网络连接正常
- 检查 Supabase 项目是否处于活跃状态

### 3. 数据库权限问题

- 确保 Supabase 项目的权限设置正确
- 检查表的外键约束是否正确
- 确保用户有足够的权限操作数据库

### 4. 构建失败

- 检查依赖是否安装完整
- 检查 TypeScript 类型错误
- 检查环境变量是否正确设置

## 维护建议

1. **定期备份数据库**：使用 Supabase 的备份功能或手动导出数据
2. **监控服务状态**：使用 PM2 的监控功能或其他监控工具
3. **更新依赖**：定期运行 `npm update` 更新依赖包
4. **安全更新**：及时更新系统和依赖包的安全补丁

## 联系方式

如果在部署过程中遇到问题，请联系项目维护人员获取帮助。
