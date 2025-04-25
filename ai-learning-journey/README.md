# AI学习之旅 - 游戏化AI学习平台

AI学习之旅是一个游戏化的AI编程学习平台，为零基础学习者提供系统化的AI学习路径。通过游戏化元素如经验值、等级、连续学习（streak）和成就系统，使学习过程更有趣更有成就感。

## 技术栈

- **前端框架**: Next.js
- **样式**: TailwindCSS
- **认证与数据库**: Supabase
- **部署**: Vercel

## 主要功能

- 用户注册和认证系统
- 个性化学习仪表板
- 分阶段学习路径
- 任务完成与经验值系统
- 连续学习（streak）机制
- 成就解锁系统
- 学习资源推荐
- 本地数据迁移到云端

## 安装与设置

### 前提条件

- Node.js 14.x 或更高版本
- NPM 或 Yarn
- Supabase 账户

### 安装步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/yourusername/ai-learning-journey.git
   cd ai-learning-journey
   ```

2. 安装依赖
   ```bash
   npm install
   # 或
   yarn install
   ```

3. 创建环境变量文件
   创建一个名为`.env.local`的文件，添加以下内容：
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

4. 在Supabase中设置数据库表结构
   - 使用部署文档中的SQL脚本创建所需的表和策略
   - 或者使用Supabase界面手动创建表结构

5. 运行开发服务器
   ```bash
   npm run dev
   # 或
   yarn dev
   ```

## 部署到Vercel

1. 在GitHub上创建一个仓库并推送代码
2. 在Vercel上注册/登录
3. 导入GitHub仓库
4. 配置环境变量（Supabase URL和密钥）
5. 点击"Deploy"按钮

## 数据迁移

如果您之前使用的是localStorage版本的平台，可以使用数据导入功能：

1. 登录到您的账户
2. 访问 `/import-data` 页面
3. 按照页面指引导入您的本地数据到云端

## 项目结构

```
/components        - React组件
  /layout          - 布局组件（Header, Footer等）
  /learning        - 学习相关组件
  /gamification    - 游戏化元素组件
  /ui              - 通用UI组件
/pages             - Next.js页面
  /api             - API路由
  /auth            - 认证相关页面
/lib               - 工具函数和Supabase客户端
/styles            - 全局样式
/public            - 静态资源
```

## 自定义与扩展

### 添加新任务

在Supabase的`tasks`表中添加新任务，包括：
- 任务标题
- 描述
- 所属阶段（phase）
- 经验值奖励
- 点数奖励

### 修改游戏化机制

游戏化机制的主要逻辑在以下文件中：
- `/lib/supabase.js` - 任务完成和连续学习逻辑
- `/pages/api/tasks/complete.js` - 任务完成API
- `/pages/api/user/update-streak.js` - 连续学习更新API

## 贡献

欢迎提交问题和改进建议。如需贡献代码，请遵循以下步骤：
1. Fork本仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启Pull Request

## 许可证

本项目采用MIT许可证。详见 `LICENSE` 文件。

## 联系我们

如有问题或建议，请通过以下方式联系我们：
- 邮件: your-email@example.com
- 微信: your-wechat-id 