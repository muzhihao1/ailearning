document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化...');
    
    // 直接在文档加载完成后初始化重置按钮
    const resetProgressBtn = document.getElementById('reset-all-progress');
    if (resetProgressBtn) {
        console.log('找到重置进度按钮，立即添加事件监听器');
        resetProgressBtn.addEventListener('click', function() {
            console.log('重置按钮被点击 - 直接绑定');
            resetAllProgress();
        });
    } else {
        console.error('DOMContentLoaded时找不到重置进度按钮，ID: reset-all-progress');
    }
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
    // 这部分代码已经被新的updateStreakDays()函数替代
    // const streakDaysElement = document.getElementById('streak-days');
    // if (streakDaysElement) {
    //     let count = 0;
    //     const streakDays = 7; // 假设连续学习了7天
    //     
    //     const streakCounter = setInterval(() => {
    //         count++;
    //         if (count > streakDays) {
    //             clearInterval(streakCounter);
    //         } else {
    //             streakDaysElement.textContent = count;
    //         }
    //     }, 200);
    // }

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

    // 添加设置面板和数据管理功能
    console.log('正在初始化设置面板...');
    initSettingsPanel();
    
    // 数据管理功能
    console.log('正在初始化数据管理功能...');
    initDataManagement();
    
    // 显示用户ID和学习起始日期
    displayUserInfo();

    // 添加调用检查和更新streak天数的函数
    updateStreakDays();
    
    // 初始化完成任务按钮
    initCompleteTaskButtons();
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
    
    // 更新连续学习天数
    updateStreakDays();
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

// 初始化设置面板控制
function initSettingsPanel() {
    console.log('初始化设置面板...');
    
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings');
    const closeSettingsBtn = document.getElementById('close-settings');
    
    if (!settingsModal) {
        console.error('找不到settings-modal元素!');
        return;
    }
    
    if (!openSettingsBtn) {
        console.error('找不到open-settings按钮!');
    } else {
        console.log('找到open-settings按钮，添加点击事件');
        // 打开设置面板
        openSettingsBtn.addEventListener('click', function(e) {
            console.log('点击了打开设置按钮');
            e.preventDefault();
            settingsModal.classList.add('show');
            document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
    }
    
    if (!closeSettingsBtn) {
        console.error('找不到close-settings按钮!');
    } else {
        // 关闭设置面板
        closeSettingsBtn.addEventListener('click', function() {
            console.log('点击了关闭设置按钮');
            settingsModal.classList.remove('show');
            document.body.style.overflow = ''; // 恢复背景滚动
        });
    }
    
    // 点击背景关闭设置面板
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            console.log('点击了设置面板背景');
            settingsModal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });
    
    console.log('设置面板初始化完成');
}

// 初始化数据管理功能
function initDataManagement() {
    // 用户ID管理
    initUserIdManagement();
    
    // 重置进度按钮
    const resetBtn = document.getElementById('reset-all-progress');
    if (resetBtn) {
        console.log('找到重置进度按钮，添加事件监听器');
        resetBtn.addEventListener('click', function() {
            console.log('重置按钮被点击');
            resetAllProgress();
        });
    } else {
        console.error('找不到重置进度按钮，ID: reset-all-progress');
    }
    
    // 阶段重置按钮
    const phaseResetButtons = document.querySelectorAll('.phase-reset-btn');
    phaseResetButtons.forEach(button => {
        button.addEventListener('click', function() {
            const phaseNumber = this.getAttribute('data-phase');
            resetPhaseProgress(phaseNumber);
        });
    });
    
    // 数据导出按钮
    document.getElementById('export-data').addEventListener('click', exportUserData);
    
    // 数据导入按钮
    document.getElementById('import-data').addEventListener('click', importUserData);
}

// 初始化用户ID管理
function initUserIdManagement() {
    // 生成用户ID
    let userId = localStorage.getItem('userId');
    if (!userId) {
        userId = generateUserId();
        localStorage.setItem('userId', userId);
    }
    
    // 设置学习开始日期
    let startDate = localStorage.getItem('learningStartDate');
    if (!startDate) {
        startDate = new Date().toISOString();
        localStorage.setItem('learningStartDate', startDate);
    }
}

// 生成用户ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substring(2, 15) + 
        Math.random().toString(36).substring(2, 15);
}

// 显示用户信息
function displayUserInfo() {
    const userIdElement = document.getElementById('user-id');
    const startDateElement = document.getElementById('learning-start-date');
    
    if (userIdElement) {
        userIdElement.textContent = localStorage.getItem('userId') || '本地用户';
    }
    
    if (startDateElement) {
        const startDate = localStorage.getItem('learningStartDate');
        if (startDate) {
            const formattedDate = new Date(startDate).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            startDateElement.textContent = formattedDate;
        }
    }
}

// 重置所有进度
function resetAllProgress() {
    console.log('resetAllProgress 函数被调用');
    
    if (confirm('确定要重置所有学习进度吗？此操作不可恢复！')) {
        console.log('用户确认重置进度');
        
        try {
            // 保留用户ID和学习开始日期
            const userId = localStorage.getItem('userId');
            console.log('保存的用户ID：', userId);
            
            // 记录重置前的存储状态
            console.log('重置前localStorage包含的键：', Object.keys(localStorage));
            console.log('重置前localStorage的内容：', JSON.stringify(localStorage));
            
            // 清除所有本地存储（包括学习记录和streak相关数据）
            localStorage.clear();
            console.log('已清除所有本地存储');
            
            // 仅恢复用户ID，并设置新的学习开始日期
            if (userId) localStorage.setItem('userId', userId);
            localStorage.setItem('learningStartDate', new Date().toISOString());
            
            // 确保所有学习记录被完全重置
            localStorage.setItem('userLevel', '1');
            localStorage.setItem('userExp', '0');
            localStorage.setItem('codePoints', '50');
            localStorage.setItem('streakDays', '0');
            localStorage.setItem('completedTasks', '[]');
            localStorage.setItem('learningHistory', '[]');
            localStorage.setItem('currentLearning', '{}');
            
            // 移除lastVisitDate让streak重新开始
            localStorage.removeItem('lastVisitDate');
            
            // 移除可能影响重置的其他键
            const keysToRemove = [
                'phase1Progress', 'phase2Progress', 'phase3Progress', 'phase4Progress', 'phase5Progress',
                'taskProgress', 'lastTaskCompleted', 'achievements', 'skills', 'lastLogin'
            ];
            
            keysToRemove.forEach(key => localStorage.removeItem(key));
            
            // 记录重置后的状态
            console.log('重置后localStorage包含的键：', Object.keys(localStorage));
            console.log('重置后localStorage的内容：', JSON.stringify(localStorage));
            
            // 刷新页面以应用更改
            showNotification('进度已重置', '所有学习进度已成功重置，页面将在2秒后刷新');
            setTimeout(() => {
                console.log('即将刷新页面...');
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('重置进度时发生错误：', error);
            alert('重置进度时发生错误：' + error.message);
        }
    } else {
        console.log('用户取消了重置操作');
    }
}

// 重置特定阶段进度
function resetPhaseProgress(phaseNumber) {
    if (confirm(`确定要重置第${phaseNumber}阶段的所有进度吗？`)) {
        // 获取已完成任务
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks') || '[]');
        
        // 筛选出非该阶段的任务
        const filteredTasks = completedTasks.filter(task => {
            // 检查任务是否属于指定阶段
            return !task.title.includes(`第${phaseNumber}阶段`) && 
                   !task.phaseNumber || task.phaseNumber !== parseInt(phaseNumber);
        });
        
        // 保存过滤后的任务
        localStorage.setItem('completedTasks', JSON.stringify(filteredTasks));
        
        // 刷新页面
        showNotification('阶段进度已重置', `第${phaseNumber}阶段的进度已成功重置`);
        setTimeout(() => window.location.reload(), 2000);
    }
}

// 导出用户数据
function exportUserData() {
    const userData = {
        userId: localStorage.getItem('userId'),
        learningStartDate: localStorage.getItem('learningStartDate'),
        learningHistory: JSON.parse(localStorage.getItem('learningHistory') || '[]'),
        completedTasks: JSON.parse(localStorage.getItem('completedTasks') || '[]'),
        userLevel: localStorage.getItem('userLevel') || 1,
        userExp: localStorage.getItem('userExp') || 0,
        codePoints: localStorage.getItem('codePoints') || 50,
        streakDays: localStorage.getItem('streakDays') || 0,
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
    
    showNotification('数据导出成功', '您的学习记录已成功导出');
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
                if (!userData.learningHistory && !userData.completedTasks) {
                    throw new Error('无效的数据格式');
                }
                
                // 确认导入
                if (confirm('确定要导入此数据吗？当前的学习记录将被覆盖。')) {
                    // 保存用户ID和学习开始日期
                    const currentUserId = localStorage.getItem('userId');
                    
                    // 清除所有本地存储
                    localStorage.clear();
                    
                    // 保留当前用户ID或使用导入的ID
                    localStorage.setItem('userId', currentUserId || userData.userId || generateUserId());
                    
                    // 保存导入的数据
                    if (userData.learningStartDate) {
                        localStorage.setItem('learningStartDate', userData.learningStartDate);
                    } else {
                        localStorage.setItem('learningStartDate', new Date().toISOString());
                    }
                    
                    localStorage.setItem('learningHistory', JSON.stringify(userData.learningHistory || []));
                    localStorage.setItem('completedTasks', JSON.stringify(userData.completedTasks || []));
                    
                    if (userData.userLevel) localStorage.setItem('userLevel', userData.userLevel);
                    if (userData.userExp) localStorage.setItem('userExp', userData.userExp);
                    if (userData.codePoints) localStorage.setItem('codePoints', userData.codePoints);
                    if (userData.streakDays) localStorage.setItem('streakDays', userData.streakDays);
                    
                    // 刷新页面
                    showNotification('数据导入成功', '您的学习记录已恢复');
                    setTimeout(() => window.location.reload(), 2000);
                }
            } catch (error) {
                showNotification('导入失败', error.message);
            }
        };
        
        reader.readAsText(file);
    };
    
    fileInput.click();
}

// 更新连续学习天数
function updateStreakDays() {
    // 获取今天的日期（只保留年月日，不考虑时间）
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // 获取上次访问的日期
    let lastVisit = localStorage.getItem('lastVisitDate');
    let streakDays = parseInt(localStorage.getItem('streakDays') || '0');
    const oldStreakDays = streakDays; // 保存旧的streak值用于比较
    
    if (!lastVisit) {
        // 首次访问，设置streak为1
        streakDays = 1;
    } else {
        // 转换为Date对象
        const lastVisitDate = new Date(lastVisit);
        lastVisitDate.setHours(0, 0, 0, 0);
        
        // 计算日期差
        const timeDiff = today.getTime() - lastVisitDate.getTime();
        const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));
        
        if (dayDiff === 0) {
            // 今天已经访问过，保持streak不变
        } else if (dayDiff === 1) {
            // 连续访问，streak+1
            streakDays += 1;
            showNotification('连续学习', `恭喜！您已经连续学习${streakDays}天了！`);
        } else {
            // 中断了连续访问，重置streak为1
            streakDays = 1;
            showNotification('开始新的学习旅程', '欢迎回来！开始新的学习连续记录吧！');
        }
    }
    
    // 检查是否达到连续学习里程碑，给予奖励
    checkStreakMilestones(oldStreakDays, streakDays);
    
    // 更新本地存储
    localStorage.setItem('lastVisitDate', today.toISOString());
    localStorage.setItem('streakDays', streakDays.toString());
    
    // 更新UI显示
    const streakDaysElement = document.getElementById('streak-days');
    if (streakDaysElement) {
        streakDaysElement.textContent = streakDays;
    }
}

// 检查连续学习天数里程碑，给予奖励
function checkStreakMilestones(oldStreak, newStreak) {
    // 定义里程碑和对应的奖励
    const milestones = [
        { days: 3, expReward: 30, pointsReward: 20, message: '连续学习3天！坚持就是胜利！' },
        { days: 7, expReward: 70, pointsReward: 50, message: '连续学习一周！你已经建立了良好的学习习惯！' },
        { days: 14, expReward: 140, pointsReward: 100, message: '连续学习两周！你的毅力令人钦佩！' },
        { days: 30, expReward: 300, pointsReward: 200, message: '连续学习一个月！你已经成为学习的大师！' },
        { days: 60, expReward: 600, pointsReward: 400, message: '连续学习两个月！你的恒心值得尊敬！' },
        { days: 100, expReward: 1000, pointsReward: 800, message: '连续学习100天！你是学习界的传奇！' },
        { days: 365, expReward: 3650, pointsReward: 3000, message: '连续学习一年！你已经超越了99%的人！' }
    ];
    
    // 检查是否达到了任何里程碑
    for (const milestone of milestones) {
        if (oldStreak < milestone.days && newStreak >= milestone.days) {
            // 达到了新的里程碑，给予奖励
            updateGameStats(milestone.expReward, milestone.pointsReward);
            
            // 显示成就通知
            const achievementPopup = document.createElement('div');
            achievementPopup.className = 'achievement-popup show';
            achievementPopup.innerHTML = `
                <div class="achievement-content">
                    <h3>学习成就解锁！</h3>
                    <div class="achievement-icon">
                        <i class="fas fa-trophy"></i>
                    </div>
                    <div class="achievement-details">
                        <h4>${milestone.message}</h4>
                        <p>奖励：+${milestone.expReward}经验值，+${milestone.pointsReward}编程点数</p>
                    </div>
                    <button class="btn-close">知道了</button>
                </div>
            `;
            
            document.body.appendChild(achievementPopup);
            
            // 5秒后自动关闭
            setTimeout(() => {
                achievementPopup.classList.remove('show');
                setTimeout(() => {
                    achievementPopup.remove();
                }, 500);
            }, 5000);
            
            // 关闭按钮事件
            const closeBtn = achievementPopup.querySelector('.btn-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    achievementPopup.classList.remove('show');
                    setTimeout(() => {
                        achievementPopup.remove();
                    }, 500);
                });
            }
        }
    }
} 