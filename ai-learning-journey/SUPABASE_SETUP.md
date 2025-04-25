# Supabase 认证集成配置指南

本指南将帮助您在项目中设置和测试 Supabase 认证功能，包括在本地开发环境和 Vercel 部署环境中的配置步骤。

## 目录

1. [Supabase 项目设置](#1-supabase-项目设置)
2. [数据库表设置](#2-数据库表设置)
3. [本地环境配置](#3-本地环境配置)
4. [Vercel 集成](#4-vercel-集成)
5. [测试认证功能](#5-测试认证功能)
6. [常见问题](#6-常见问题)

## 1. Supabase 项目设置

### 创建 Supabase 项目

1. 访问 [Supabase 官网](https://supabase.com/) 并登录您的账户
2. 点击 "New Project" 创建新项目
3. 填写项目信息:
   - 项目名称: 例如 "ai-learning-journey"
   - 数据库密码: 设置一个安全的密码
   - 区域: 选择离您用户最近的区域
4. 点击 "Create project" 等待项目创建完成

### 配置认证设置

1. 在 Supabase 项目面板，导航到 "Authentication" > "Settings"
2. 确保 "Email Auth" 已启用，并设置以下选项:
   - 启用 "Enable Email Signups"
   - 可选: 配置 "Confirm email" 设置
   - 配置邮件模板，自定义欢迎邮件
3. 保存更改

## 2. 数据库表设置

我们需要创建几个表来支持用户认证和资料管理。

1. 在 Supabase 项目面板，导航到 "SQL Editor"
2. 创建新查询，并粘贴本仓库中 `database_setup.sql` 文件的内容
3. 点击 "Run" 执行 SQL 脚本
4. 验证表是否创建成功:
   - 导航到 "Table Editor"
   - 应该能看到 `profiles`, `tasks`, `user_tasks` 和 `logs` 表

## 3. 本地环境配置

### 获取 API 凭据

1. 在 Supabase 项目控制面板，导航到 "Project Settings" > "API"
2. 在 "Project API keys" 部分，您将看到两个重要的值:
   - `URL`: 项目 URL
   - `anon public`: 公共匿名密钥

### 设置环境变量

使用我们提供的脚本自动设置环境变量:

```bash
# 方法1: 通过提示输入
node setup-env.js

# 方法2: 直接通过命令行参数提供
node setup-env.js --url=YOUR_SUPABASE_URL --key=YOUR_SUPABASE_ANON_KEY
```

脚本将创建 `.env.local` 文件，包含必要的环境变量。

## 4. Vercel 集成

### 部署项目到 Vercel

1. 将项目代码推送到 GitHub 仓库
2. 登录 [Vercel](https://vercel.com/)
3. 点击 "New Project" 并选择您的仓库
4. 配置项目设置并部署

### 添加 Supabase 集成

1. 在 Vercel 控制面板，导航到您的项目
2. 点击 "Settings" > "Integrations"
3. 搜索 "Supabase" 并点击 "Add Integration"
4. 按照提示连接您的 Supabase 账户并选择您的项目
5. 完成集成后，Vercel 将自动添加环境变量:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. 重新部署您的项目以应用更改

## 5. 测试认证功能

### 验证配置

1. 访问配置检查页面: `/auth/config-checker`
2. 页面将检查 Supabase 配置是否正确设置
3. 如果一切正常，您将看到绿色的 "连接正常" 提示

### 测试注册流程

1. 访问注册页面: `/auth/register-simple`
2. 填写用户信息:
   - 用户名
   - 电子邮箱
   - 密码
3. 提交表单
4. 如果配置了邮箱确认，您将收到一封确认邮件
5. 确认邮箱后，您可以登录

### 测试登录流程

1. 访问登录页面: `/auth/login-simple`
2. 输入您的电子邮箱和密码
3. 提交表单
4. 登录成功后，您将被重定向到首页

## 6. 常见问题

### Supabase 连接错误

如果配置检查页面显示连接错误:

1. 确认环境变量是否正确设置
2. 检查 Supabase 项目是否处于活动状态
3. 确认数据库表是否已正确创建
4. 确认 RLS (Row Level Security) 策略是否正确设置

### 注册后无法收到确认邮件

1. 检查垃圾邮件文件夹
2. 在 Supabase 控制面板中确认邮件发送记录
3. 确认邮件设置是否正确配置

### 用户资料不显示

1. 确认 `profiles` 表是否正确创建
2. 检查注册流程中是否正确创建了用户资料记录
3. 验证数据库查询权限

---

如有其他问题，请参考 [Supabase 官方文档](https://supabase.com/docs) 或 [Vercel 官方文档](https://vercel.com/docs) 