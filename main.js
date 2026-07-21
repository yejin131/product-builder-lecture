document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const copyAllBtn = document.getElementById('copy-all-btn');
    const resultsContainer = document.getElementById('results-container');
    const toast = document.getElementById('toast');
    const themeToggleBtn = document.getElementById('theme-toggle');

    let currentSets = [];

    // --- 테마 관리 (Dark / Light Mode) ---
    function initTheme() {
        const savedTheme = localStorage.getItem('lotto-theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            // System preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('lotto-theme', theme);
        
        // 아이콘 변경
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            themeToggleBtn.setAttribute('title', '라이트 모드로 전환');
        } else {
            icon.className = 'fa-solid fa-moon';
            themeToggleBtn.setAttribute('title', '다크 모드로 전환');
        }
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    }

    // --- 로또 번호 생성 로직 ---
    function generateSingleSet() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNum);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    function generate5Sets() {
        const sets = [];
        const labels = ['A 세트', 'B 세트', 'C 세트', 'D 세트', 'E 세트'];
        
        for (let i = 0; i < 5; i++) {
            sets.push({
                label: labels[i],
                numbers: generateSingleSet()
            });
        }
        return sets;
    }

    function getBallColorClass(number) {
        if (number <= 10) return 'ball-yellow';
        if (number <= 20) return 'ball-blue';
        if (number <= 30) return 'ball-red';
        if (number <= 40) return 'ball-gray';
        return 'ball-green';
    }

    function renderSets(sets) {
        currentSets = sets;
        resultsContainer.innerHTML = '';

        sets.forEach((set, setIndex) => {
            const card = document.createElement('div');
            card.className = 'lotto-card';

            const label = document.createElement('div');
            label.className = 'set-label';
            label.textContent = set.label;

            const ballsContainer = document.createElement('div');
            ballsContainer.className = 'balls-container';

            set.numbers.forEach((num, numIndex) => {
                const ball = document.createElement('div');
                const colorClass = getBallColorClass(num);
                ball.className = `lotto-ball ${colorClass}`;
                
                const formattedNum = num < 10 ? `0${num}` : `${num}`;
                ball.textContent = formattedNum;

                const globalDelay = (setIndex * 6 + numIndex) * 0.04;
                ball.style.setProperty('--delay', `${globalDelay}s`);

                ballsContainer.appendChild(ball);
            });

            card.appendChild(label);
            card.appendChild(ballsContainer);
            resultsContainer.appendChild(card);
        });
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    async function copyAllNumbers() {
        if (currentSets.length === 0) {
            showToast('먼저 번호를 생성해주세요!');
            return;
        }

        const formattedText = currentSets.map(set => {
            const numsStr = set.numbers.map(n => (n < 10 ? `0${n}` : `${n}`)).join(', ');
            return `[${set.label}] ${numsStr}`;
        }).join('\n');

        try {
            await navigator.clipboard.writeText(formattedText);
            showToast('5세트 번호가 클립보드에 복사되었습니다! 🍀');
        } catch (err) {
            showToast('복사에 실패했습니다.');
        }
    }

    // --- 초기화 및 이벤트 리스너 ---
    initTheme();

    themeToggleBtn.addEventListener('click', toggleTheme);

    generateBtn.addEventListener('click', () => {
        if (navigator.vibrate) {
            navigator.vibrate(25);
        }
        const newSets = generate5Sets();
        renderSets(newSets);
    });

    copyAllBtn.addEventListener('click', copyAllNumbers);
});
