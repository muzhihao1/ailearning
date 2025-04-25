// 动态样式管理

// 创建根变量更新函数
function updateRootVariables(variables) {
    const root = document.documentElement;
    for (const [key, value] of Object.entries(variables)) {
        root.style.setProperty(`--${key}`, value);
    }
}

// 主题色彩设置
const lightTheme = {
    'primary-color': '#4a6bdf',
    'secondary-color': '#38b2ac',
    'accent-color': '#805ad5',
    'background-color': '#ffffff',
    'card-bg': '#f7f9fc',
    'text-color': '#2d3748',
    'text-secondary': '#4a5568',
    'border-color': '#e2e8f0',
    'shadow-color': 'rgba(0, 0, 0, 0.1)'
};

const darkTheme = {
    'primary-color': '#5a78e6',
    'secondary-color': '#4fd1c5',
    'accent-color': '#9f7aea',
    'background-color': '#1a202c',
    'card-bg': '#2d3748',
    'text-color': '#f7fafc',
    'text-secondary': '#cbd5e0',
    'border-color': '#4a5568',
    'shadow-color': 'rgba(0, 0, 0, 0.3)'
};

// 根据用户偏好设置字体大小
function initFontSize() {
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    document.body.setAttribute('data-font-size', savedFontSize);
    
    const fontSizeControls = document.querySelectorAll('.font-size-control');
    if (fontSizeControls.length) {
        fontSizeControls.forEach(control => {
            control.addEventListener('click', (e) => {
                const size = e.currentTarget.dataset.size;
                document.body.setAttribute('data-font-size', size);
                localStorage.setItem('fontSize', size);
                
                // 更新活动状态
                fontSizeControls.forEach(btn => btn.classList.remove('active'));
                e.currentTarget.classList.add('active');
            });
            
            // 设置初始活动状态
            if (control.dataset.size === savedFontSize) {
                control.classList.add('active');
            }
        });
    }
}

// 动画观察器
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window && animatedElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // 如果只想触发一次动画，可以取消观察
                    // observer.unobserve(entry.target);
                } else {
                    // 如果希望元素离开视口时重置动画
                    entry.target.classList.remove('animated');
                }
            });
        }, {
            rootMargin: '0px',
            threshold: 0.1 // 当10%的元素可见时触发
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // 对于不支持IntersectionObserver的浏览器，直接应用动画类
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
    }
}

// 响应式调整
function handleResponsiveAdjustments() {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    
    // 根据视口调整某些元素
    document.body.classList.toggle('is-mobile', isMobile);
    document.body.classList.toggle('is-tablet', isTablet);
    
    // 响应式图表调整
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach(chart => {
        if (chart.chart) {
            chart.chart.resize();
        }
    });
}

// 功能预加载
function preloadFeatures() {
    // 预加载图像
    const imageUrls = [
        'images/hero-background.jpg',
        'images/python-logo.png',
        'images/tensorflow-logo.png',
        'images/pytorch-logo.png'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
    
    // 预加载字体
    if ('fonts' in document) {
        Promise.all([
            document.fonts.load('1rem "Roboto"'),
            document.fonts.load('1rem "Roboto Mono"')
        ]).then(() => {
            document.body.classList.add('fonts-loaded');
        });
    }
}

// 初始化函数
function initializeStyles() {
    // 检查主题偏好
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    
    // 根据保存的偏好或系统偏好设置初始主题
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
        document.body.classList.add('dark-mode');
        updateRootVariables(darkTheme);
    } else {
        updateRootVariables(lightTheme);
    }
    
    // 监听主题切换
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.checked = document.body.classList.contains('dark-mode');
        
        themeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                updateRootVariables(darkTheme);
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('theme', 'light');
                updateRootVariables(lightTheme);
            }
        });
    }
    
    // 监听系统主题更改
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', e => {
        // 只有用户没有明确设置主题时，才遵循系统主题
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                updateRootVariables(darkTheme);
            } else {
                document.body.classList.remove('dark-mode');
                updateRootVariables(lightTheme);
            }
        }
    });
    
    // 初始化字体大小控制
    initFontSize();
    
    // 初始化滚动动画
    initScrollAnimations();
    
    // 处理响应式调整
    handleResponsiveAdjustments();
    window.addEventListener('resize', handleResponsiveAdjustments);
    
    // 预加载功能
    preloadFeatures();
}

// 当DOM内容加载完成后初始化样式
document.addEventListener('DOMContentLoaded', initializeStyles); 