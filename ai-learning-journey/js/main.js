document.addEventListener('DOMContentLoaded', () => {
    // 导航栏滚动效果
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 移动端菜单切换
    const menuToggle = document.getElementById('menu-toggle');
    const navList = document.querySelector('nav ul');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navList.classList.toggle('show');
        });
    }

    // 学习路径点击展开详情
    const learningPaths = document.querySelectorAll('.learning-path');
    
    learningPaths.forEach(path => {
        const pathHeader = path.querySelector('h3');
        if (pathHeader) {
            pathHeader.addEventListener('click', () => {
                path.classList.toggle('expanded');
            });
        }
    });

    // 平滑滚动到锚点
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70,
                    behavior: 'smooth'
                });
                
                // 关闭移动菜单（如果打开）
                if (navList.classList.contains('show')) {
                    navList.classList.remove('show');
                }
            }
        });
    });

    // 动态加载项目示例
    const loadMoreBtn = document.getElementById('load-more-projects');
    const projectsContainer = document.querySelector('.projects-grid');
    
    if (loadMoreBtn && projectsContainer) {
        let projectCount = 3; // 初始显示的项目数量
        
        loadMoreBtn.addEventListener('click', function() {
            // 模拟从服务器加载更多项目
            const newProjects = [
                {
                    title: '情感分析应用',
                    description: '使用自然语言处理技术分析文本情感',
                    image: 'sentiment-analysis.jpg',
                    tags: ['NLP', 'Python', 'BERT']
                },
                {
                    title: '图像分类器',
                    description: '基于CNN的图像分类系统',
                    image: 'image-classifier.jpg',
                    tags: ['计算机视觉', 'PyTorch', '深度学习']
                },
                {
                    title: '推荐系统',
                    description: '基于用户行为的内容推荐引擎',
                    image: 'recommender.jpg',
                    tags: ['协同过滤', 'TensorFlow', '机器学习']
                }
            ];
            
            // 添加新项目到网格
            newProjects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project-item';
                projectElement.innerHTML = `
                    <div class="project-image">
                        <img src="images/${project.image}" alt="${project.title}" onerror="this.src='images/placeholder.jpg'">
                    </div>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                    <a href="#" class="btn btn-secondary">查看详情</a>
                `;
                projectsContainer.appendChild(projectElement);
            });
            
            projectCount += newProjects.length;
            
            // 如果已加载足够多的项目，隐藏加载按钮
            if (projectCount >= 9) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

    // 表单验证
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            let isValid = true;
            
            // 简单验证
            if (!nameInput.value.trim()) {
                markInvalid(nameInput, '请输入您的姓名');
                isValid = false;
            } else {
                markValid(nameInput);
            }
            
            if (!emailInput.value.trim()) {
                markInvalid(emailInput, '请输入您的邮箱');
                isValid = false;
            } else if (!isValidEmail(emailInput.value)) {
                markInvalid(emailInput, '请输入有效的邮箱地址');
                isValid = false;
            } else {
                markValid(emailInput);
            }
            
            if (!messageInput.value.trim()) {
                markInvalid(messageInput, '请输入您的留言');
                isValid = false;
            } else {
                markValid(messageInput);
            }
            
            if (isValid) {
                // 模拟表单提交
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.textContent = '发送中...';
                
                setTimeout(() => {
                    const successMessage = document.createElement('div');
                    successMessage.className = 'success-message';
                    successMessage.textContent = '您的消息已发送！我们会尽快回复您。';
                    
                    contactForm.reset();
                    contactForm.appendChild(successMessage);
                    
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    
                    setTimeout(() => {
                        successMessage.remove();
                    }, 5000);
                }, 1500);
            }
        });
    }

    // 工具函数
    function markInvalid(input, message) {
        input.classList.add('invalid');
        
        let errorMessage = input.nextElementSibling;
        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
            errorMessage = document.createElement('div');
            errorMessage.className = 'error-message';
            input.parentNode.insertBefore(errorMessage, input.nextSibling);
        }
        
        errorMessage.textContent = message;
    }
    
    function markValid(input) {
        input.classList.remove('invalid');
        
        const errorMessage = input.nextElementSibling;
        if (errorMessage && errorMessage.classList.contains('error-message')) {
            errorMessage.remove();
        }
    }
    
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 暗色模式切换
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        // 检查用户偏好
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('theme');
        
        // 根据保存的偏好或系统偏好设置初始主题
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            document.body.classList.add('dark-mode');
            themeToggle.checked = true;
        }
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
            }
        });
    }
}); 