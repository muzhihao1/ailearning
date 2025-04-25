// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 导航栏激活状态
    const navLinks = document.querySelectorAll('nav ul li a');
    const sections = document.querySelectorAll('section');
    
    // 导航链接点击事件
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // 设置激活状态
            navLinks.forEach(link => link.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 滚动监听，更新导航激活状态
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === current) {
                link.classList.add('active');
            }
        });
    });
    
    // 选项卡切换功能
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 移除所有激活状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));
            
            // 激活当前选项卡
            button.classList.add('active');
            const target = button.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
        });
    });
    
    // 学习路径节点功能
    const nodes = document.querySelectorAll('.node:not(.locked)');
    
    nodes.forEach(node => {
        node.addEventListener('click', function() {
            // 获取相关数据
            const level = this.getAttribute('data-level');
            const week = this.getAttribute('data-week');
            const nodeName = this.querySelector('.node-name').textContent;
            
            // 可以在这里添加显示学习内容的逻辑
            // 示例：打开详情面板或弹窗
            showNodeDetails(level, week, nodeName);
        });
    });
    
    // 显示节点详情的函数
    function showNodeDetails(level, week, name) {
        // 创建一个模态窗口
        const modal = document.createElement('div');
        modal.className = 'node-modal';
        
        let levelName;
        let levelColor;
        
        switch (level) {
            case '1':
                levelName = 'Python基础';
                levelColor = 'var(--python-color)';
                break;
            case '2':
                levelName = '数据科学与机器学习';
                levelColor = 'var(--data-color)';
                break;
            case '3':
                levelName = '深度学习';
                levelColor = 'var(--deep-color)';
                break;
            case '4':
                levelName = '项目实践';
                levelColor = 'var(--project-color)';
                break;
        }
        
        // 根据节点名称和级别添加对应的内容
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header" style="background-color: ${levelColor}">
                    <h3>${name}</h3>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <p><strong>阶段:</strong> ${levelName}</p>
                    <p><strong>周数:</strong> 第${week}周</p>
                    <div class="modal-progress">
                        <div class="progress-label">学习进度</div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 0%"></div>
                        </div>
                        <div class="progress-text">0%</div>
                    </div>
                    <div class="modal-resources">
                        <h4>学习资源</h4>
                        <p>这里将显示与"${name}"相关的学习资源。</p>
                        <ul>
                            <li><a href="#" target="_blank">查看教程</a></li>
                            <li><a href="#" target="_blank">相关练习</a></li>
                            <li><a href="#" target="_blank">参考资料</a></li>
                        </ul>
                    </div>
                    <div class="modal-buttons">
                        <button class="btn-start">开始学习</button>
                        <button class="btn-mark">标记为完成</button>
                    </div>
                </div>
            </div>
        `;
        
        // 添加模态窗口到body
        document.body.appendChild(modal);
        
        // 添加CSS样式
        const style = document.createElement('style');
        style.textContent = `
            .node-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                opacity: 0;
                transition: opacity 0.3s;
            }
            
            .modal-content {
                background-color: white;
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                transform: translateY(-20px);
                transition: transform 0.3s;
            }
            
            .modal-header {
                padding: 1.5rem;
                color: white;
                border-radius: 15px 15px 0 0;
                position: relative;
            }
            
            .modal-header h3 {
                color: white;
                margin: 0;
            }
            
            .modal-close {
                position: absolute;
                top: 1rem;
                right: 1.5rem;
                font-size: 1.5rem;
                cursor: pointer;
            }
            
            .modal-body {
                padding: 1.5rem;
            }
            
            .modal-progress {
                margin: 1.5rem 0;
            }
            
            .progress-label {
                font-weight: bold;
                margin-bottom: 0.5rem;
            }
            
            .progress-bar {
                height: 10px;
                background-color: #f1f1f1;
                border-radius: 5px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background-color: ${levelColor};
                border-radius: 5px;
                transition: width 1s;
            }
            
            .progress-text {
                text-align: right;
                font-size: 0.9rem;
                margin-top: 0.3rem;
            }
            
            .modal-resources {
                margin: 1.5rem 0;
            }
            
            .modal-resources h4 {
                margin-bottom: 1rem;
            }
            
            .modal-resources ul {
                padding-left: 1.5rem;
            }
            
            .modal-resources ul li {
                margin-bottom: 0.5rem;
            }
            
            .modal-buttons {
                display: flex;
                gap: 1rem;
                margin-top: 1.5rem;
            }
            
            .btn-start, .btn-mark {
                padding: 0.8rem 1.5rem;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s;
            }
            
            .btn-start {
                background-color: ${levelColor};
                color: white;
            }
            
            .btn-mark {
                background-color: #f1f1f1;
                color: #333;
            }
            
            .btn-start:hover, .btn-mark:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            }
        `;
        
        document.head.appendChild(style);
        
        // 动画
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.querySelector('.modal-content').style.transform = 'translateY(0)';
        }, 10);
        
        // 进度条动画
        setTimeout(() => {
            const progressFill = modal.querySelector('.progress-fill');
            const progressText = modal.querySelector('.progress-text');
            
            if (name === 'Python入门') {
                progressFill.style.width = '100%';
                progressText.textContent = '100%';
            } else {
                progressFill.style.width = '0%';
                progressText.textContent = '0%';
            }
        }, 500);
        
        // 关闭按钮事件
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.style.opacity = '0';
            modal.querySelector('.modal-content').style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        });
        
        // 点击外部关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.opacity = '0';
                modal.querySelector('.modal-content').style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    document.body.removeChild(modal);
                }, 300);
            }
        });
        
        // 开始学习按钮
        modal.querySelector('.btn-start').addEventListener('click', () => {
            alert(`开始学习 ${name}`);
            // 这里可以添加实际的学习资源链接或内容
        });
        
        // 标记完成按钮
        modal.querySelector('.btn-mark').addEventListener('click', function() {
            const progressFill = modal.querySelector('.progress-fill');
            const progressText = modal.querySelector('.progress-text');
            
            progressFill.style.width = '100%';
            progressText.textContent = '100%';
            
            this.textContent = '已完成';
            this.disabled = true;
            this.style.backgroundColor = '#2ecc71';
            this.style.color = 'white';
            
            // 这里可以添加更新学习进度的逻辑
        });
    }
    
    // 为已解锁的节点添加悬停效果
    document.querySelectorAll('.node:not(.locked)').forEach(node => {
        node.addEventListener('mouseover', function() {
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.1)';
        });
        
        node.addEventListener('mouseout', function() {
            this.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
    });
}); 