# AXIOM 运维指南

本文档包含项目开发与运维的常用指令，方便快速查阅。

## 一、本地开发

### 启动开发服务器

此命令会启动 Next.js 的本地开发服务器，默认监听在 `http://localhost:3000`。

```bash
npm run dev
```

### 构建生产版本

此命令会为您的应用创建生产环境的优化版本。

```bash
npm run build
```

### 启动生产服务器

在运行 `npm run build` 之后，使用此命令来启动生产模式的服务器。

```bash
npm start
```

### 代码风格检查与修复

运行 ESLint 来检查代码中的风格问题。

```bash
npm run lint
```

## 二、数据库 (Supabase)

### 数据迁移与种子文件

- **中文种子文件**: `supabase/seed_zh.sql`

当需要重置数据库并填充中文测试数据时，请在 Supabase SQL Editor 中执行此文件的内容。

**操作步骤:**

1.  登录到您的 Supabase 项目仪表盘。
2.  在左侧导航栏中选择 "SQL Editor"。
3.  点击 "New query"。
4.  将 `supabase/seed_zh.sql` 文件中的全部内容复制并粘贴到编辑器中。
5.  点击 "RUN" 按钮执行脚本。

**注意**: 执行此操作会清空 `posts` 和 `profiles` 表中的所有现有数据，请谨慎操作。

### Supabase 类型生成

当您修改了数据库的表结构后，需要更新本地的 TypeScript 类型定义。请在项目根目录运行以下指令：

```bash
npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > lib/types/supabase.ts
```

请将 `<YOUR_PROJECT_ID>` 替换为您自己的 Supabase 项目 ID。
