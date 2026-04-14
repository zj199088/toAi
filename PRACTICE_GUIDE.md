# 久坐赎罪健身项目实践指南

## 项目概述

**久坐赎罪健身**是一个基于 React + TypeScript + Supabase 的健身追踪应用，旨在帮助用户记录锻炼情况，追踪身体变化，养成健康的运动习惯。

### 核心功能
- 个性化健身计划生成
- 锻炼跟踪与记录
- 身体数据管理
- 饮食计划管理
- 锻炼记录查询与筛选

## 技术栈

- **前端框架**: React 18 + TypeScript
- **状态管理**: Zustand
- **UI 样式**: Tailwind CSS
- **图标库**: Lucide React
- **后端服务**: Supabase (数据库 + 认证)
- **构建工具**: Vite

## 开发环境搭建

### 1. 初始化项目

```bash
# 克隆仓库
git clone <项目地址>
cd <项目目录>

# 安装依赖
npm install

# 配置环境变量
# 创建 .env 文件，添加 Supabase 配置
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

### 2. 数据库设置

登录 Supabase 控制台，执行以下 SQL 语句创建所需表结构：

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

### 3. 启动开发服务器

```bash
npm run dev
```

项目将在 http://localhost:3000 启动。

## 核心功能实现

### 1. 健身计划管理

**功能说明**: 支持生成个性化健身计划，包括目标设置、时长选择等。

**实现要点**:
- 使用 `useFitnessPlanStore` 管理计划状态
- 支持模板选择和自定义计划创建
- 自动生成训练日程和动作

**关键文件**: [src/store/index.ts](file:///workspace/src/store/index.ts#L217-L430)

### 2. 锻炼跟踪

**功能说明**: 记录每次锻炼的详细信息，包括组数、次数、时长等。

**实现要点**:
- 实时更新锻炼进度
- 自动创建训练日程（如果不存在）
- 保存锻炼记录到数据库

**关键文件**: [src/pages/Track.tsx](file:///workspace/src/pages/Track.tsx)

### 3. 锻炼记录查询

**功能说明**: 支持按日期范围和计划名称查询锻炼记录。

**实现要点**:
- 日期范围筛选
- 计划名称模糊搜索
- 分页显示结果

**关键文件**: [src/pages/WorkoutRecords.tsx](file:///workspace/src/pages/WorkoutRecords.tsx)

### 4. 用户认证

**功能说明**: 支持邮箱密码登录和微信登录。

**实现要点**:
- 使用 Supabase Auth 进行身份验证
- 本地存储用户信息
- 登出时清空所有数据

**关键文件**: [src/store/index.ts](file:///workspace/src/store/index.ts#L15-L215)

## 部署流程

### 1. 构建项目

```bash
npm run build
```

### 2. 部署选项

#### 选项 1: 使用 PM2 + serve

```bash
# 安装 serve 和 PM2
npm install -g serve pm2

# 启动服务
pm run build
pm run preview
```

#### 选项 2: 使用 Nginx

1. **配置 Nginx**:
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     
     location / {
       root /path/to/your/project/dist;
       index index.html;
       try_files $uri $uri/ /index.html;
     }
   }
   ```

2. **重启 Nginx**:
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

### 3. 配置 HTTPS

使用 Certbot 获取免费的 Let's Encrypt 证书：

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 常见问题与解决方案

### 1. 500 Internal Server Error

**原因**: Nginx 没有权限访问静态文件目录

**解决方案**:
```bash
# 修复文件权限
sudo chown -R www-data:www-data /path/to/your/project/dist
sudo chmod -R 755 /path/to/your/project/dist

# 修复父目录权限
sudo chmod 755 /home/ubuntu
sudo chmod 755 /home/ubuntu/soft
sudo chmod 755 /home/ubuntu/soft/toAi
```

### 2. Node.js 版本不兼容

**错误信息**: `npm error code EBADENGINE`

**解决方案**:
```bash
# 安装 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# 安装 Node.js 20.17.0+
nvm install 20.17.0
nvm use 20.17.0
```

### 3. 登出后数据仍显示

**原因**: 登出时未重置所有 store 数据

**解决方案**: 在 `signOut` 方法中重置所有相关 store：

```javascript
signOut: async () => {
  // 其他代码...
  // 重置所有store
  useFitnessPlanStore.getState().plans = []
  useFitnessPlanStore.getState().currentPlan = null
  useWorkoutRecordStore.getState().records = []
  useWorkoutRecordStore.getState().totalCountLastYear = 0
  useBodyMeasurementStore.getState().measurements = []
  useDietPlanStore.getState().plans = []
  useDietPlanStore.getState().currentPlan = null
  useDietRecordStore.getState().records = []
  // 其他代码...
}
```

## 项目结构

```
/src
  /pages          # 页面组件
    Home.tsx      # 首页
    Track.tsx     # 锻炼跟踪
    WorkoutRecords.tsx  # 锻炼记录
    Login.tsx     # 登录页面
    PlanGenerate.tsx    # 生成计划
    PlanTemplates.tsx   # 模板选择
    PlanCustom.tsx      # 自定义计划
  /store          # 状态管理
    index.ts      # 所有 store 定义
  /lib            # 工具库
    supabase.ts   # Supabase 配置
    utils.ts      # 工具函数
  /components     # 通用组件
  App.tsx         # 应用入口
  main.tsx        # 主文件
```

## 总结

本项目实现了一个功能完整的健身追踪系统，具有以下特点：

1. **完整的健身计划管理**：支持生成、选择和自定义健身计划
2. **详细的锻炼跟踪**：记录每次锻炼的详细信息
3. **强大的查询功能**：支持按日期范围和计划名称查询
4. **美观的界面设计**：科技健身动态风格
5. **可靠的部署方案**：支持多种部署方式

通过本项目，用户可以方便地管理健身计划，跟踪锻炼进度，养成健康的运动习惯。同时，项目也展示了如何使用 React + TypeScript + Supabase 构建一个完整的全栈应用。