# AI学习之旅网站

这是一个使用HTML、CSS和JavaScript构建的AI学习网站，旨在为零基础学习者提供系统化的AI编程学习路径，从Python基础到AI应用开发，循序渐进地提升技能。

## 功能特点

- 完整的学习路径与阶段划分
- 任务进度追踪系统
- 游戏化学习体验
- 经验值与成就系统
- 学习资源推荐
- 本地进度保存

## 技术栈

- HTML5
- CSS3
- JavaScript (原生)
- 本地存储 (localStorage)

## 项目部署指南

### 已完成的部分

1. 项目代码已上传至GitHub仓库: https://github.com/muzhihao1/ailearning.git

### Firebase部署步骤

1. 安装Firebase工具:
```bash
npm install -g firebase-tools
```

2. 登录Firebase账户:
```bash
firebase login
```

3. 在Firebase控制台创建新项目:
   - 访问 https://console.firebase.google.com/
   - 点击"添加项目"
   - 输入项目名称: "ailearning-web"
   - 按照提示完成项目创建

4. 初始化Firebase项目:
```bash
firebase init
```
   - 选择"Hosting"服务
   - 选择刚才创建的Firebase项目
   - 使用"."作为公共目录
   - 配置为单页应用: 是
   - 覆盖index.html: 否

5. 部署网站:
```bash
firebase deploy
```

6. 部署完成后，Firebase会提供一个托管URL，访问该URL即可查看已部署的网站。

## 数据备份与恢复

### 数据存储

本网站使用浏览器的localStorage来存储用户数据。主要存储的数据包括:

- `learningHistory`: 学习历史记录
- `currentLearning`: 当前学习内容
- `completedTasks`: 已完成的任务
- `userLevel`: 用户等级
- `userExp`: 用户经验值
- `codePoints`: 编程点数
- `streakDays`: 连续学习天数

### 实现数据备份功能

用户可以通过点击"导出数据"按钮来备份他们的学习进度，生成的JSON文件可以保存在本地。

### 实现数据恢复功能

用户可以通过点击"导入数据"按钮来上传先前导出的JSON文件，恢复学习进度。

### 重置进度功能

用户可以通过"重置进度"按钮清除所有本地存储的数据，重新开始学习。

## 后续开发计划

1. **第一阶段**: 增强本地存储功能
   - 实现数据备份/恢复功能
   - 添加进度重置选项
   - 优化状态持久化

2. **第二阶段**: 实现基础服务器端存储
   - 集成Firebase数据库
   - 添加匿名认证
   - 实现数据同步

3. **第三阶段**: 完善用户系统
   - 添加用户注册/登录功能
   - 实现学习数据统计
   - 添加学习排行榜功能

4. **第四阶段**: 高级功能
   - 实现学习分析与建议
   - 添加学习社区互动
   - 设计成就与徽章系统

## 许可证

MIT 