document.addEventListener('DOMContentLoaded', function() {
    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // 顶部偏移，考虑固定导航栏
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // 导航栏固定效果
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > headerHeight) {
            header.classList.add('fixed');
        } else {
            header.classList.remove('fixed');
        }
    });
    
    // 阶段卡片悬停效果增强
    const phases = document.querySelectorAll('.phase');
    
    phases.forEach(phase => {
        phase.addEventListener('mouseenter', function() {
            phases.forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 初始化动画
    const sections = document.querySelectorAll('section');
    
    function checkVisibility() {
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (sectionTop < windowHeight - 100) {
                section.classList.add('visible');
            }
        });
    }
    
    // 首次加载检查
    checkVisibility();
    
    // 滚动时检查
    window.addEventListener('scroll', checkVisibility);

    // 导航栏滚动效果
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 滚动到各节点时导航栏高亮
    window.addEventListener('scroll', function() {
        const header = document.getElementById('header');
        const backToTopButton = document.getElementById('back-to-top');
        
        // 处理固定导航栏
        if (window.scrollY > 100) {
            header.classList.add('sticky');
            if (backToTopButton) {
                backToTopButton.classList.add('show');
            }
        } else {
            header.classList.remove('sticky');
            if (backToTopButton) {
                backToTopButton.classList.remove('show');
            }
        }
        
        // 处理滚动到各节点时导航栏高亮
        const sections = document.querySelectorAll('.section, #hero');
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        const navLinks = document.querySelectorAll('nav ul li a');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 添加元素进入视口时的动画
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 观察所有phase元素
    document.querySelectorAll('.phase').forEach(phase => {
        observer.observe(phase);
    });

    // 观察资源元素
    document.querySelectorAll('.resource-item').forEach(resource => {
        observer.observe(resource);
    });

    // 简单的动态计数器（例如，显示学习天数）
    const startDate = new Date('2023-01-01');
    const today = new Date();
    const daysPassed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    
    // 如果页面上有显示学习天数的元素，可以在这里更新它
    const daysElement = document.getElementById('learning-days');
    if (daysElement) {
        daysElement.textContent = daysPassed;
    }

    // 学习天数动画计数效果
    const daysCountElement = document.getElementById('days-count');
    if (daysCountElement) {
        // 添加计数动画效果
        let count = 0;
        const duration = 2000; // 动画持续时间（毫秒）
        const interval = 50; // 更新间隔（毫秒）
        const steps = duration / interval;
        const increment = daysPassed / steps;
        
        const counter = setInterval(() => {
            count += increment;
            if (count >= daysPassed) {
                count = daysPassed;
                clearInterval(counter);
            }
            daysCountElement.textContent = Math.floor(count);
        }, interval);
    }

    // 模拟进度条（如果有的话）
    const progressBars = document.querySelectorAll('.progress-bar, .progress');
    if (progressBars.length > 0) {
        progressBars.forEach(bar => {
            const target = parseInt(bar.getAttribute('data-target') || bar.getAttribute('data-width') || 0);
            let width = 0;
            const interval = setInterval(() => {
                if (width >= target) {
                    clearInterval(interval);
                } else {
                    width++;
                    bar.style.width = width + '%';
                    if (!bar.classList.contains('progress')) { // 只有progress-bar元素才设置文本内容
                        bar.textContent = width + '%';
                    }
                }
            }, 10);
        });
    }

    // 添加资源项悬停效果
    const resourceItems = document.querySelectorAll('.resource-item');
    resourceItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // 返回顶部按钮
    const backToTopButton = document.getElementById('back-to-top');
    
    if (backToTopButton) {
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 游戏化元素 - 游戏状态栏交互
    const gameStatusBar = document.querySelector('.game-status-bar');
    const expProgressBar = document.querySelector('.exp-progress');
    
    if (gameStatusBar) {
        // 初始化经验值进度条动画
        setTimeout(() => {
            expProgressBar.style.width = '35%';
        }, 1500);
    }

    // 游戏化元素 - 学习连续天数动画
    const streakDaysElement = document.getElementById('streak-days');
    if (streakDaysElement) {
        let count = 0;
        const streakDays = 7; // 假设连续学习了7天
        
        const streakCounter = setInterval(() => {
            count++;
            if (count > streakDays) {
                clearInterval(streakCounter);
            } else {
                streakDaysElement.textContent = count;
            }
        }, 200);
    }

    // 游戏化元素 - 成就弹窗
    const achievementPopup = document.getElementById('achievement-popup');
    
    if (achievementPopup) {
        setTimeout(() => {
            achievementPopup.classList.add('show');
            
            // 5秒后自动关闭
            setTimeout(() => {
                achievementPopup.classList.remove('show');
            }, 5000);
        }, 3000);
    }

    // 游戏化元素 - 任务完成交互
    const taskCheckboxes = document.querySelectorAll('.task-checkbox:not(:has(i))');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            // 添加勾选图标
            const checkIcon = document.createElement('i');
            checkIcon.classList.add('fas', 'fa-check');
            this.appendChild(checkIcon);
            
            // 添加完成动画
            this.closest('.task-item').classList.add('completed');
            
            // 更新经验值和点数
            updateGameStats(30, 15); // 假设完成任务获得30经验值和15点数
            
            // 显示通知
            showNotification('任务完成！', '获得了30经验值和15点数');
        });
    });

    // 游戏化元素 - 资源项点击交互
    const resourceLinks = document.querySelectorAll('.resource-link');
    
    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // 不阻止默认行为，允许链接正常跳转
            // e.preventDefault();
            
            // 记录学习开始状态到本地存储
            const resourceItem = this.closest('.resource-item');
            const resourceId = resourceItem.getAttribute('data-id') || `resource-${Math.random().toString(36).substr(2, 9)}`;
            const resourceTitle = this.closest('.resource-content').querySelector('.resource-title').textContent;
            
            // 获取该资源的奖励信息
            const resourceRewards = this.closest('.resource-content').querySelector('.resource-rewards');
            let expValue = 20;
            let pointsValue = 50;
            
            if (resourceRewards) {
                const expText = resourceRewards.querySelector('span:first-child').textContent;
                const pointsText = resourceRewards.querySelector('span:last-child').textContent;
                
                expValue = parseInt(expText.match(/\+(\d+)/)[1]) || 20;
                pointsValue = parseInt(pointsText.match(/\+(\d+)/)[1]) || 50;
            }
            
            // 保存学习状态到本地存储
            const learningData = {
                id: resourceId,
                title: resourceTitle,
                expValue: expValue,
                pointsValue: pointsValue,
                startTime: new Date().getTime(),
                completed: false
            };
            
            // 保存到本地存储
            saveCurrentLearning(learningData);
            
            // 显示已开始学习的通知，但不增加经验值
            showNotification('开始学习', `《${resourceTitle}》`);
        });
    });

    // 游戏化元素 - 更新游戏状态函数
    function updateGameStats(expValue, pointsValue) {
        // 更新经验值
        const userExpElement = document.getElementById('user-exp');
        const expProgressBar = document.querySelector('.exp-progress');
        
        if (userExpElement && expProgressBar) {
            let currentExp = parseInt(userExpElement.textContent);
            let newExp = currentExp + expValue;
            let currentLevel = parseInt(document.getElementById('user-level').textContent);
            
            // 如果经验值达到100，升级
            if (newExp >= 100) {
                currentLevel++;
                newExp = newExp - 100;
                document.getElementById('user-level').textContent = currentLevel;
                
                // 显示升级通知
                showLevelUpNotification(currentLevel);
            }
            
            // 更新经验值显示
            userExpElement.textContent = newExp;
            
            // 更新经验条
            expProgressBar.style.width = newExp + '%';
        }
        
        // 更新点数
        const codePointsElement = document.getElementById('code-points');
        
        if (codePointsElement) {
            let currentPoints = parseInt(codePointsElement.textContent);
            let newPoints = currentPoints + pointsValue;
            
            // 添加点数增加动画
            animateValue(codePointsElement, currentPoints, newPoints, 500);
        }
    }

    // 动画效果 - 数值增加动画
    function animateValue(element, start, end, duration) {
        const range = end - start;
        const startTime = performance.now();
        
        function updateValue(timestamp) {
            const runtime = timestamp - startTime;
            const progress = Math.min(runtime / duration, 1);
            const value = Math.floor(progress * range + start);
            
            element.textContent = value;
            
            if (runtime < duration) {
                requestAnimationFrame(updateValue);
            }
        }
        
        requestAnimationFrame(updateValue);
    }

    // 游戏化元素 - 显示通知
    function showNotification(title, message) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = 'game-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 显示动画
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 500);
        }, 3000);
    }

    // 游戏化元素 - 显示升级通知
    function showLevelUpNotification(newLevel) {
        // 创建升级通知元素
        const levelUpNotification = document.createElement('div');
        levelUpNotification.className = 'level-up-notification';
        levelUpNotification.innerHTML = `
            <div class="level-up-icon">
                <i class="fas fa-star"></i>
            </div>
            <div class="level-up-content">
                <h3>等级提升！</h3>
                <p>恭喜你达到了 <span>Level ${newLevel}</span></p>
                <div class="level-up-rewards">
                    <span><i class="fas fa-unlock"></i> 新课程解锁</span>
                    <span><i class="fas fa-coins"></i> +100点数奖励</span>
                </div>
            </div>
        `;
        
        // 添加到页面
        document.body.appendChild(levelUpNotification);
        
        // 显示动画
        setTimeout(() => {
            levelUpNotification.classList.add('show');
        }, 10);
        
        // 自动关闭
        setTimeout(() => {
            levelUpNotification.classList.remove('show');
            setTimeout(() => {
                levelUpNotification.remove();
            }, 800);
        }, 5000);
        
        // 同时增加100点数作为升级奖励
        const codePointsElement = document.getElementById('code-points');
        if (codePointsElement) {
            let currentPoints = parseInt(codePointsElement.textContent);
            animateValue(codePointsElement, currentPoints, currentPoints + 100, 1000);
        }
    }

    // 游戏化元素 - 添加CSS样式
    const gameStyles = document.createElement('style');
    gameStyles.textContent = `
        .game-notification {
            position: fixed;
            top: 20px;
            right: -300px;
            width: 280px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
            padding: 15px;
            z-index: 2000;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .game-notification.show {
            right: 20px;
        }
        
        .notification-content h4 {
            margin-bottom: 5px;
            color: var(--primary-color);
        }
        
        .notification-content p {
            margin: 0;
            color: var(--gray-color);
            font-size: 0.9rem;
        }
        
        .level-up-notification {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.8);
            display: flex;
            align-items: center;
            background: white;
            border-radius: 12px;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
            padding: 20px;
            z-index: 2000;
            opacity: 0;
            transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .level-up-notification.show {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .level-up-icon {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #4F46E5 0%, #3730A3 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            color: white;
            font-size: 2rem;
            animation: pulse 2s infinite;
        }
        
        .level-up-content h3 {
            margin-bottom: 5px;
            color: var(--primary-color);
            font-size: 1.5rem;
        }
        
        .level-up-content p {
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        
        .level-up-content p span {
            font-weight: 700;
            color: var(--primary-color);
        }
        
        .level-up-rewards {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .level-up-rewards span {
            display: flex;
            align-items: center;
            font-size: 0.9rem;
            color: var(--gray-color);
        }
        
        .level-up-rewards span i {
            margin-right: 5px;
            color: var(--accent-color);
        }
        
        .task-item.completed {
            background: rgba(16, 185, 129, 0.1);
            transition: background 0.5s ease;
        }
    `;
    
    document.head.appendChild(gameStyles);

    // 阶段展开/折叠功能
    initPhaseToggle();
    
    // 初始化计数器和进度条动画
    updateCounters();
    animateProgressBars();

    // 课程过滤功能
    initCourseFilters();

    // 初始化数据管理功能
    initDataManagement();
});

function initPhaseToggle() {
    const phaseHeaders = document.querySelectorAll('.phase-header');
    
    phaseHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const phase = this.closest('.phase');
            
            if (phase.classList.contains('expanded')) {
                phase.classList.remove('expanded');
                this.querySelector('.phase-toggle i').classList.remove('fa-chevron-down');
                this.querySelector('.phase-toggle i').classList.add('fa-chevron-right');
            } else {
                phase.classList.add('expanded');
                this.querySelector('.phase-toggle i').classList.remove('fa-chevron-right');
                this.querySelector('.phase-toggle i').classList.add('fa-chevron-down');
            }
        });
    });
}

// 更新计数器
function updateCounters() {
    // 更新学习天数计数器
    const startDate = new Date(2023, 0, 1); // 设置学习开始日期
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const daysCounter = document.getElementById('days-count');
    if (daysCounter) {
        daysCounter.textContent = diffDays;
    }
    
    // 可以添加其他计数器的更新逻辑
}

// 进度条动画
function animateProgressBars() {
    const progressBars = document.querySelectorAll('.progress');
    
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
            setTimeout(() => {
                bar.style.width = width;
            }, 300);
        }
    });
}

// 技能树交互
function initSkillTree() {
    const skillNodes = document.querySelectorAll('.skill-node');
    
    skillNodes.forEach(node => {
        node.addEventListener('click', function() {
            // 如果是锁定状态，显示解锁条件
            if (this.classList.contains('locked')) {
                showNotification('技能未解锁', '完成前置技能后才能解锁此技能');
                return;
            }
            
            // 如果已解锁，显示详细信息
            if (this.classList.contains('unlocked')) {
                const skillName = this.querySelector('span').textContent;
                showSkillDetail(skillName, '已掌握', 5);
            }
            
            // 如果正在学习中，显示进度
            if (this.classList.contains('in-progress')) {
                const skillName = this.querySelector('span').textContent;
                showSkillDetail(skillName, '学习中', 60);
            }
        });
    });
}

// 显示技能详情
function showSkillDetail(skillName, status, progress) {
    // 创建技能详情元素
    const skillDetail = document.createElement('div');
    skillDetail.className = 'skill-detail-modal';
    skillDetail.innerHTML = `
        <div class="skill-detail-content">
            <button class="close-btn"><i class="fas fa-times"></i></button>
            <h3>${skillName}</h3>
            <div class="skill-status">${status}</div>
            <div class="skill-progress">
                <div class="progress-bar-container">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                <span>${progress}%</span>
            </div>
            <div class="skill-description">
                <p>掌握${skillName}的核心知识和实践技能，为进阶学习奠定基础。</p>
            </div>
            <div class="skill-rewards">
                <div class="reward-item">
                    <i class="fas fa-bolt"></i>
                    <span>完成可获得 100 经验值</span>
                </div>
                <div class="reward-item">
                    <i class="fas fa-coins"></i>
                    <span>完成可获得 50 编程点数</span>
                </div>
            </div>
            <button class="btn btn-primary continue-btn">继续学习</button>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(skillDetail);
    
    // 显示动画
    setTimeout(() => {
        skillDetail.classList.add('show');
    }, 10);
    
    // 关闭按钮事件
    skillDetail.querySelector('.close-btn').addEventListener('click', () => {
        skillDetail.classList.remove('show');
        setTimeout(() => {
            skillDetail.remove();
        }, 300);
    });
    
    // 继续学习按钮事件
    skillDetail.querySelector('.continue-btn').addEventListener('click', () => {
        skillDetail.classList.remove('show');
        setTimeout(() => {
            skillDetail.remove();
        }, 300);
        
        if (status === '学习中') {
            showNotification('继续学习', `正在继续学习 ${skillName}`);
        } else {
            showNotification('技能回顾', `正在回顾 ${skillName} 相关知识`);
        }
    });
}

// 初始化游戏系统
window.addEventListener('load', function() {
    // 初始化技能树
    initSkillTree();
    
    // 模拟徽章收集
    collectBadges();
});

// 保存当前学习状态到本地存储
function saveCurrentLearning(learningData) {
    const learningHistory = JSON.parse(localStorage.getItem('learningHistory') || '[]');
    
    // 检查是否已存在该学习项
    const existingIndex = learningHistory.findIndex(item => item.id === learningData.id);
    
    if (existingIndex !== -1) {
        // 更新已有记录
        learningHistory[existingIndex] = learningData;
    } else {
        // 添加新记录
        learningHistory.push(learningData);
    }
    
    localStorage.setItem('learningHistory', JSON.stringify(learningHistory));
    localStorage.setItem('currentLearning', JSON.stringify(learningData));
}

// 添加任务完成按钮事件处理
document.addEventListener('DOMContentLoaded', function() {
    // 初始化完成任务按钮
    initCompleteTaskButtons();
});

// 初始化完成任务按钮
function initCompleteTaskButtons() {
    // 为当前任务卡片添加完成任务按钮
    const currentTaskActions = document.querySelector('.task-card.active .task-actions');
    
    if (currentTaskActions) {
        // 检查是否已经有完成任务按钮
        if (!currentTaskActions.querySelector('.btn-complete-task')) {
            const completeButton = document.createElement('a');
            completeButton.href = '#';
            completeButton.className = 'btn btn-success btn-complete-task';
            completeButton.textContent = '完成任务';
            completeButton.style.backgroundColor = 'var(--success-color)';
            completeButton.style.color = 'white';
            
            currentTaskActions.appendChild(completeButton);
            
            // 添加完成任务事件处理
            completeButton.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 获取当前任务信息
                const taskCard = this.closest('.task-card');
                const taskTitle = taskCard.querySelector('.task-header h3').textContent;
                const taskProgress = parseInt(taskCard.querySelector('.progress').style.width) || 0;
                
                // 只有进度达到100%才能完成
                if (taskProgress < 100) {
                    // 弹出确认对话框
                    if (confirm(`当前任务完成度为${taskProgress}%，确定要标记为完成吗？`)) {
                        completeCurrentTask(taskTitle);
                    }
                } else {
                    completeCurrentTask(taskTitle);
                }
            });
        }
    }
    
    // 初始化任务项完成按钮
    const taskItems = document.querySelectorAll('.task-item:not(.completed)');
    taskItems.forEach(taskItem => {
        const taskInfo = taskItem.querySelector('.task-info');
        
        // 添加完成按钮到任务信息区域
        if (taskInfo && !taskInfo.querySelector('.task-complete-btn')) {
            const completeButton = document.createElement('button');
            completeButton.className = 'task-complete-btn';
            completeButton.innerHTML = '标记完成';
            
            taskInfo.appendChild(completeButton);
            
            // 添加点击事件
            completeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                
                const taskTitle = this.closest('.task-info').querySelector('h4').textContent;
                
                // 标记任务完成
                if (taskItem.classList.contains('active')) {
                    // 当前活跃任务
                    completeCurrentTask(taskTitle);
                } else {
                    // 其他任务
                    showNotification('无法完成', '请先完成当前活跃的任务');
                }
            });
        }
    });
}

// 完成当前任务并获取奖励
function completeCurrentTask(taskTitle) {
    // 当前任务卡片和进度
    const taskCard = document.querySelector('.task-card.active');
    
    if (!taskCard) return;
    
    // 任务详情
    const taskHeader = taskCard.querySelector('.task-header');
    const expValue = 30; // 默认经验值
    const pointsValue = 20; // 默认点数
    
    // 更新UI显示
    // 1. 更新任务状态
    const taskBadge = taskHeader.querySelector('.task-badge');
    if (taskBadge) {
        taskBadge.textContent = '已完成';
        taskBadge.style.backgroundColor = 'rgba(16, 185, 129, 0.1)';
        taskBadge.style.color = 'var(--success-color)';
    }
    
    // 2. 更新进度条至100%
    const progressBar = taskCard.querySelector('.progress');
    if (progressBar) {
        progressBar.style.width = '100%';
    }
    
    // 3. 更新任务项状态
    const activeTaskItem = document.querySelector('.task-item.active');
    if (activeTaskItem) {
        activeTaskItem.classList.remove('active');
        activeTaskItem.classList.add('completed');
        
        // 更新复选框
        const taskCheckbox = activeTaskItem.querySelector('.task-checkbox');
        if (taskCheckbox) {
            taskCheckbox.innerHTML = '<i class="fas fa-check"></i>';
        }
        
        // 更新状态文本
        const taskStatus = activeTaskItem.querySelector('.task-status');
        if (taskStatus) {
            taskStatus.textContent = '已完成';
            taskStatus.classList.remove('active');
            taskStatus.classList.add('completed');
        }
        
        // 移除完成按钮
        const completeBtn = activeTaskItem.querySelector('.task-complete-btn');
        if (completeBtn) {
            completeBtn.remove();
        }
    }
    
    // 4. 准备下一个任务
    prepareNextTask();
    
    // 5. 奖励用户
    updateGameStats(expValue, pointsValue);
    
    // 6. 显示通知
    showNotification('任务完成！', `《${taskTitle}》 +${expValue}经验 +${pointsValue}点数`);
    
    // 7. 保存完成状态到本地存储
    saveTaskCompletion(taskTitle, expValue, pointsValue);
}

// 准备下一个任务
function prepareNextTask() {
    // 找到当前完成的任务之后的第一个未完成任务
    const taskItems = document.querySelectorAll('.task-item');
    let foundCompleted = false;
    let nextTask = null;
    
    for (let i = 0; i < taskItems.length; i++) {
        if (taskItems[i].classList.contains('completed') && !foundCompleted) {
            foundCompleted = true;
            continue;
        }
        
        if (foundCompleted && !taskItems[i].classList.contains('completed')) {
            nextTask = taskItems[i];
            break;
        }
    }
    
    // 如果找到下一个任务，设置为活跃
    if (nextTask) {
        nextTask.classList.add('active');
        
        // 更新复选框
        const taskCheckbox = nextTask.querySelector('.task-checkbox');
        if (taskCheckbox) {
            taskCheckbox.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        }
        
        // 更新状态
        const taskStatus = nextTask.querySelector('.task-status');
        if (taskStatus) {
            taskStatus.textContent = '进行中';
            taskStatus.classList.add('active');
        }
        
        // 更新当前任务卡片
        const nextTaskTitle = nextTask.querySelector('.task-info h4').textContent;
        const nextTaskDesc = nextTask.querySelector('.task-info p').textContent;
        
        // 获取下一个任务卡片
        const nextTaskCard = document.querySelector('.next-task .task-card');
        if (nextTaskCard) {
            // 替换现有卡片内容
            const currentCardTitle = document.querySelector('.task-card.active .task-header h3');
            const currentCardDesc = document.querySelector('.task-card.active .task-description p');
            
            if (currentCardTitle) currentCardTitle.textContent = nextTaskTitle;
            if (currentCardDesc) currentCardDesc.textContent = nextTaskDesc;
            
            // 查找任务资源链接
            const taskLink = nextTask.querySelector('.task-link');
            if (taskLink) {
                const hrefValue = taskLink.getAttribute('href');
                const currentCardActions = document.querySelector('.task-card.active .task-actions');
                if (currentCardActions) {
                    const continueBtn = currentCardActions.querySelector('.btn-primary');
                    if (continueBtn) {
                        continueBtn.setAttribute('href', hrefValue);
                    }
                }
            }
            
            // 更新下一个任务卡片（从后续任务中查找）
            let nextNextTask = null;
            for (let i = Array.from(taskItems).indexOf(nextTask) + 1; i < taskItems.length; i++) {
                if (!taskItems[i].classList.contains('completed')) {
                    nextNextTask = taskItems[i];
                    break;
                }
            }
            
            if (nextNextTask) {
                const nextNextTaskTitle = nextNextTask.querySelector('.task-info h4').textContent;
                const nextNextTaskDesc = nextNextTask.querySelector('.task-info p').textContent;
                
                const nextCardTitle = nextTaskCard.querySelector('.task-header h3');
                const nextCardDesc = nextTaskCard.querySelector('.task-description p');
                
                if (nextCardTitle) nextCardTitle.textContent = nextNextTaskTitle;
                if (nextCardDesc) nextCardDesc.textContent = nextNextTaskDesc;
                
                // 更新预习资源链接
                const nextTaskLink = nextNextTask.querySelector('.task-link');
                if (nextTaskLink) {
                    const nextHrefValue = nextTaskLink.getAttribute('href');
                    const nextCardActions = document.querySelector('.next-task .task-card .task-actions');
                    if (nextCardActions) {
                        const previewBtn = nextCardActions.querySelector('.btn-secondary');
                        if (previewBtn) {
                            previewBtn.setAttribute('href', nextHrefValue);
                        }
                    }
                }
            }
        }
    }
    
    // 重新初始化完成任务按钮
    initCompleteTaskButtons();
}

// 保存任务完成状态到本地存储
function saveTaskCompletion(taskTitle, expValue, pointsValue) {
    const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
    
    completedTasks.push({
        title: taskTitle,
        completedAt: new Date().getTime(),
        expValue: expValue,
        pointsValue: pointsValue
    });
    
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
}

function initCourseFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const courseCards = document.querySelectorAll('.course-card');
    
    // 为过滤按钮添加点击事件
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // 移除所有按钮的active类
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // 为当前点击的按钮添加active类
            this.classList.add('active');
            
            // 获取过滤类别
            const filterValue = this.getAttribute('data-filter');
            
            // 显示或隐藏课程卡片
            courseCards.forEach(card => {
                // 如果是"全部"或者类别匹配，显示卡片
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    // 添加淡入动画
                    setTimeout(() => {
                        card.classList.add('fade-in');
                    }, 50);
                } else {
                    card.classList.remove('fade-in');
                    // 添加淡出动画
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 添加用户数据管理功能
function initDataManagement() {
    // 创建设置面板
    createSettingsPanel();
    
    // 初始化按钮事件
    const exportBtn = document.getElementById('export-data');
    const importBtn = document.getElementById('import-data');
    const resetAllBtn = document.getElementById('reset-all-progress');
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportUserData);
    }
    
    if (importBtn) {
        importBtn.addEventListener('click', importUserData);
    }
    
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', resetAllProgress);
    }
    
    // 初始化阶段重置按钮
    for (let i = 1; i <= 4; i++) {
        const phaseResetBtn = document.getElementById(`reset-phase-${i}`);
        if (phaseResetBtn) {
            phaseResetBtn.addEventListener('click', function() {
                resetPhaseProgress(i);
            });
        }
    }
}

// 创建设置面板
function createSettingsPanel() {
    // 检查是否已存在设置面板
    if (document.getElementById('settings-panel')) {
        return;
    }
    
    // 创建设置按钮
    const settingsBtn = document.createElement('button');
    settingsBtn.id = 'settings-button';
    settingsBtn.innerHTML = '<i class="fas fa-cog"></i>';
    settingsBtn.title = '设置';
    settingsBtn.className = 'settings-toggle-btn';
    document.body.appendChild(settingsBtn);
    
    // 创建设置面板
    const settingsPanel = document.createElement('div');
    settingsPanel.id = 'settings-panel';
    settingsPanel.className = 'settings-panel';
    settingsPanel.innerHTML = `
        <div class="settings-header">
            <h3>学习进度管理</h3>
            <button class="settings-close-btn"><i class="fas fa-times"></i></button>
        </div>
        <div class="settings-content">
            <div class="settings-group">
                <h4>数据备份与恢复</h4>
                <p class="settings-desc">导出学习数据以备份，或导入之前的备份恢复学习进度。</p>
                <div class="settings-actions">
                    <button id="export-data" class="btn btn-secondary">导出数据</button>
                    <button id="import-data" class="btn btn-secondary">导入数据</button>
                </div>
            </div>
            
            <div class="settings-group">
                <h4>重置学习进度</h4>
                <p class="settings-desc">重置特定阶段或所有学习进度。此操作不可恢复！</p>
                <div class="settings-actions">
                    <button id="reset-all-progress" class="btn btn-danger">重置所有进度</button>
                </div>
                <div class="phase-reset-buttons">
                    <button id="reset-phase-1" class="btn btn-warning">重置第1阶段</button>
                    <button id="reset-phase-2" class="btn btn-warning">重置第2阶段</button>
                    <button id="reset-phase-3" class="btn btn-warning">重置第3阶段</button>
                    <button id="reset-phase-4" class="btn btn-warning">重置第4阶段</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(settingsPanel);
    
    // 绑定设置按钮点击事件
    settingsBtn.addEventListener('click', function() {
        settingsPanel.classList.toggle('show');
    });
    
    // 绑定关闭按钮事件
    const closeBtn = settingsPanel.querySelector('.settings-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            settingsPanel.classList.remove('show');
        });
    }
    
    // 添加设置面板样式
    addSettingsPanelStyles();
}

// 添加设置面板样式
function addSettingsPanelStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .settings-toggle-btn {
            position: fixed;
            bottom: 80px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--primary-color);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            z-index: 990;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.25rem;
            transition: var(--transition);
        }
        
        .settings-toggle-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
        }
        
        .settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.9);
            width: 90%;
            max-width: 500px;
            background-color: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            max-height: 80vh;
            overflow-y: auto;
        }
        
        .settings-panel.show {
            opacity: 1;
            visibility: visible;
            transform: translate(-50%, -50%) scale(1);
        }
        
        .settings-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.25rem 1.5rem;
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }
        
        .settings-header h3 {
            margin: 0;
            font-size: 1.5rem;
            color: var(--dark-color);
        }
        
        .settings-close-btn {
            background: none;
            border: none;
            font-size: 1.25rem;
            color: var(--gray-color);
            cursor: pointer;
        }
        
        .settings-content {
            padding: 1.5rem;
        }
        
        .settings-group {
            margin-bottom: 2rem;
        }
        
        .settings-group h4 {
            font-size: 1.2rem;
            margin-bottom: 0.75rem;
            color: var(--dark-color);
        }
        
        .settings-desc {
            color: var(--gray-color);
            margin-bottom: 1rem;
            font-size: 0.95rem;
        }
        
        .settings-actions {
            display: flex;
            gap: 0.75rem;
            margin-bottom: 1.25rem;
        }
        
        .phase-reset-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 0.75rem;
            margin-top: 1rem;
        }
        
        .btn-danger {
            background-color: var(--error-color);
            color: white;
        }
        
        .btn-danger:hover {
            background-color: #d63031;
        }
        
        .btn-warning {
            background-color: var(--warning-color);
            color: white;
        }
        
        .btn-warning:hover {
            background-color: #e67e22;
        }
        
        @media (prefers-color-scheme: dark) {
            .settings-panel {
                background-color: #1a202c;
            }
            
            .settings-header {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            .settings-header h3 {
                color: white;
            }
            
            .settings-group h4 {
                color: white;
            }
        }
    `;
    document.head.appendChild(styleElement);
}

// 导出用户数据
function exportUserData() {
    const userData = {
        learningHistory: JSON.parse(localStorage.getItem('learningHistory') || '[]'),
        completedTasks: JSON.parse(localStorage.getItem('completedTasks') || '[]'),
        userLevel: localStorage.getItem('userLevel'),
        userExp: localStorage.getItem('userExp'),
        codePoints: localStorage.getItem('codePoints'),
        streakDays: localStorage.getItem('streakDays'),
        timestamp: new Date().toISOString()
    };
    
    // 创建一个下载链接
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `ai-learning-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('数据导出成功', '学习进度已保存到本地文件');
}

// 导入用户数据
function importUserData() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/json';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            try {
                const userData = JSON.parse(event.target.result);
                
                // 验证数据格式
                if (!userData.learningHistory || !userData.completedTasks) {
                    throw new Error('无效的数据格式');
                }
                
                // 保存导入的数据
                localStorage.setItem('learningHistory', JSON.stringify(userData.learningHistory));
                localStorage.setItem('completedTasks', JSON.stringify(userData.completedTasks));
                
                if (userData.userLevel) localStorage.setItem('userLevel', userData.userLevel);
                if (userData.userExp) localStorage.setItem('userExp', userData.userExp);
                if (userData.codePoints) localStorage.setItem('codePoints', userData.codePoints);
                if (userData.streakDays) localStorage.setItem('streakDays', userData.streakDays);
                
                // 显示成功通知
                showNotification('数据导入成功', '你的学习记录已恢复');
                
                // 延迟刷新页面，以便用户看到通知
                setTimeout(() => window.location.reload(), 2000);
                
            } catch (error) {
                showNotification('导入失败', error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    fileInput.click();
}

// 重置全部学习进度
function resetAllProgress() {
    if (confirm('确定要重置所有学习进度吗？此操作不可恢复！')) {
        // 清除所有相关的本地存储项
        localStorage.removeItem('learningHistory');
        localStorage.removeItem('currentLearning');
        localStorage.removeItem('completedTasks');
        localStorage.removeItem('userLevel');
        localStorage.removeItem('userExp');
        localStorage.removeItem('codePoints');
        localStorage.removeItem('streakDays');
        
        // 刷新页面以应用更改
        showNotification('进度已重置', '所有学习进度已成功重置');
        
        // 延迟刷新页面，以便用户看到通知
        setTimeout(() => window.location.reload(), 2000);
    }
}

// 重置特定阶段的进度
function resetPhaseProgress(phaseNumber) {
    if (confirm(`确定要重置第${phaseNumber}阶段的所有进度吗？`)) {
        // 获取已完成任务
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        
        // 筛选出非该阶段的任务
        const filteredTasks = completedTasks.filter(task => {
            return !task.title.includes(`第${phaseNumber}阶段`);
        });
        
        // 保存过滤后的任务
        localStorage.setItem('completedTasks', JSON.stringify(filteredTasks));
        
        // 显示通知
        showNotification('阶段进度已重置', `第${phaseNumber}阶段的进度已成功重置`);
        
        // 延迟刷新页面
        setTimeout(() => window.location.reload(), 2000);
    }
} 