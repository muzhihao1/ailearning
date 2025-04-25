# Supabase初始化指南

本文档将指导您如何在Supabase中初始化AI学习平台的数据库，包括创建表、权限策略和初始数据。

## 前提条件

1. 已有Supabase账户并创建了项目
2. 已获取Supabase项目URL和anon key
3. 已将Supabase配置添加到Vercel环境变量中

## 初始化步骤

### 1. 创建数据库表和权限

1. 登录您的Supabase账户，进入项目
2. 点击左侧导航栏中的"SQL Editor"
3. 创建新的查询，将`DEPLOYMENT.md`文件中的SQL脚本（从第19行开始到"CREATE OR REPLACE FUNCTION update_login_streak"函数结束）复制到编辑器中
4. 点击"Run"执行脚本

这个脚本将创建以下表：
- `users` - 用户信息表
- `tasks` - 任务信息表
- `user_tasks` - 用户-任务关联表（记录完成情况）
- `logs` - 操作日志表
- `user_achievements` - 用户成就表

同时设置了Row Level Security (RLS)策略，确保用户只能访问自己的数据。

### 2. 添加任务和资源数据

1. 再创建一个新的查询
2. 将`init-tasks.sql`文件中的全部内容复制到编辑器中
3. 点击"Run"执行脚本

这个脚本将：
- 创建并添加所有学习任务（四个阶段共24个任务）
- 创建学习资源表并添加示例资源
- 创建成就表并添加成就数据
- 添加用于检查和授予成就的函数

### 3. 配置认证设置

1. 点击左侧导航栏中的"Authentication"
2. 点击"Settings"
3. 在"Site URL"设置中，添加您的Vercel部署URL: `https://ailearning-lime.vercel.app`
4. 在"Redirect URLs"中添加：
   - `https://ailearning-lime.vercel.app/auth/callback`
   - `https://ailearning-lime.vercel.app/`
   - `http://localhost:3000/auth/callback` (用于本地开发)

5. 保存设置

### 4. 设置Email提供商（可选但推荐）

如果您希望用户能够通过Email注册和验证：

1. 在"Authentication" > "Providers"中，确保Email提供商已启用
2. 可以根据需要设置自定义邮件模板

### 5. 启用GitHub登录（如果需要）

1. 在"Authentication" > "Providers"中，找到GitHub
2. 打开开关启用
3. 在GitHub开发者设置中创建OAuth应用：
   - 前往 https://github.com/settings/developers
   - 点击"New OAuth App"
   - 应用名称：AI学习之旅
   - 主页URL：您的Vercel URL
   - 回调URL：`https://[YOUR-PROJECT-REF].supabase.co/auth/v1/callback`

4. 将Client ID和Client Secret复制到Supabase中对应的字段
5. 保存设置

## 测试数据库连接

完成上述步骤后，您可以通过以下方式测试数据库连接：

1. 前往您的Vercel部署：https://ailearning-lime.vercel.app
2. 尝试注册新用户
3. 登录后，系统应该会创建新的用户记录并能够正常操作

## 数据迁移（从localStorage到Supabase）

如果您此前已有用户使用本地存储版本的应用，可以：

1. 登录到Supabase版本的应用
2. 访问 `/import-data` 页面
3. 点击"导入数据"按钮，系统会自动将本地数据迁移到云端

## 注意事项

1. **不要分享项目密钥**：确保`anon key`和其他密钥不会被公开
2. **定期备份数据**：在Supabase Dashboard中设置定期备份
3. **监控用量**：关注数据库大小和API调用次数，以免超出免费额度
4. **启用最小权限**：使用RLS确保用户只能访问自己的数据

## 常见问题解决

### Row Level Security错误

如果遇到权限错误，通常是RLS策略配置问题。检查：
- 是否为所有表启用了RLS
- 是否正确创建了权限策略
- 用户是否正确认证

### 无法连接到数据库

- 检查环境变量是否正确设置
- 确认Supabase项目是否处于活动状态
- 检查网络连接是否稳定

如需更多帮助，请参考[Supabase官方文档](https://supabase.com/docs)。 