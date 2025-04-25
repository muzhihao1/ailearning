# AI学习之旅网站

这是一个AI学习网站项目，旨在为零基础学习者提供系统化的AI编程学习路径，从Python基础到AI应用开发，循序渐进地提升技能。

## 项目版本

项目有两个版本：

1. **HTML/CSS/JavaScript版本**：基于本地存储的轻量级版本（位于根目录）
2. **Next.js版本**：基于Supabase和Next.js的完整功能版本（位于`ai-learning-journey`目录）

## 功能特点

* 完整的学习路径与阶段划分
* 任务进度追踪系统
* 游戏化学习体验（经验值、等级、连续学习streak）
* 成就解锁系统
* 学习资源推荐
* 用户数据存储（本地版：localStorage / Next.js版：Supabase）

## 项目结构

### 基础版本（根目录）
```
├── index.html         # 主页面
├── styles.css         # 样式文件
├── script.js          # JavaScript逻辑
└── 零基础 AI 编程学习计划.md  # 详细学习计划文档
```

### Next.js版本（ai-learning-journey目录）
```
├── components/        # React组件
├── pages/             # Next.js页面
├── lib/               # 工具函数和Supabase客户端
├── styles/            # 全局样式
├── public/            # 静态资源
└── ...                # 其他配置文件
```

## 本地开发

### 基础版本
1. 使用本地服务器打开项目
```bash
# 使用Python简易服务器
python -m http.server

# 或使用VSCode Live Server插件
# 或直接打开index.html文件
```

### Next.js版本
1. 安装依赖
```bash
cd ai-learning-journey
npm install
```

2. 创建环境变量文件
创建一个名为`.env.local`的文件，添加Supabase配置：
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. 运行开发服务器
```bash
npm run dev
```

## 部署

### 基础版本
可使用任何静态网站托管服务（如Netlify、Vercel、GitHub Pages）或Firebase：

1. 安装Firebase工具:
```bash
npm install -g firebase-tools
```

2. 登录并初始化Firebase项目:
```bash
firebase login
firebase init
```

3. 部署网站:
```bash
firebase deploy
```

### Next.js版本
推荐使用Vercel进行部署：

1. 在GitHub上创建仓库并推送代码
2. 在Vercel上注册/登录
3. 导入GitHub仓库
4. 配置环境变量（Supabase URL和密钥）
5. 点击"Deploy"按钮

## 数据存储

### 基础版本
使用浏览器的localStorage存储用户数据：
* 学习历史记录
* 已完成任务
* 用户等级和经验值
* 连续学习天数

### Next.js版本
使用Supabase数据库存储用户数据，支持：
* 用户注册和认证
* 云端数据同步
* 多设备访问
* 学习数据分析

## 功能说明

### 游戏化学习系统
1. **经验值与等级**：完成任务获得经验值，累积经验值提升等级
2. **连续学习(Streak)系统**：记录连续学习天数，提供成就激励
3. **成就系统**：完成特定里程碑解锁成就

### 学习追踪
1. **任务进度**：记录已完成任务和学习进度
2. **相位解锁**：完成前置学习任务解锁新的学习阶段
3. **学习历史**：记录学习时间和完成任务

## 后续开发计划

1. 完善Next.js版本功能
2. 添加学习社区互动功能
3. 实现学习数据分析与个性化推荐
4. 设计更完善的成就与徽章系统

## 许可证

MIT

## 联系方式

如有问题或建议，请通过GitHub Issues联系我们。 