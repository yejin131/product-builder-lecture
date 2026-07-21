document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate-btn');
    const copyAllBtn = document.getElementById('copy-all-btn');
    const resultsContainer = document.getElementById('results-container');
    const toast = document.getElementById('toast');

    let currentSets = [];

    // 로또 번호 6개 생성 함수 (1~45, 중복 없음, 오름차순 정렬)
    function generateSingleSet() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNum = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNum);
        }
        return Array.from(numbers).sort((a, b) => a - b);
    }

    // 5세트 번호 생성
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

    // 번호 범위에 맞는 CSS 클래스 반환
    function getBallColorClass(number) {
        if (number <= 10) return 'ball-yellow';
        if (number <= 20) return 'ball-blue';
        if (number <= 30) return 'ball-red';
        if (number <= 40) return 'ball-gray';
        return 'ball-green';
    }

    // UI에 로또 세트들 렌더링
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
                
                // 두 자릿수 포맷팅 (예: 5 -> 05)
                const formattedNum = num < 10 ? `0${num}` : `${num}`;
                ball.textContent = formattedNum;

                // 순차적 등장 애니메이션 딜레이 설정
                const globalDelay = (setIndex * 6 + numIndex) * 0.04;
                ball.style.setProperty('--delay', `${globalDelay}s`);

                ballsContainer.appendChild(ball);
            });

            card.appendChild(label);
            card.appendChild(ballsContainer);
            resultsContainer.appendChild(card);
        });
    }

    // 토스트 알림 표시
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2200);
    }

    // 전체 번호 클립보드 복사
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

    // Event Listeners
    generateBtn.addEventListener('click', () => {
        // 모바일 터치 피드백 (지원되는 경우)
        if (navigator.vibrate) {
            navigator.vibrate(25);
        }

        const newSets = generate5Sets();
        renderSets(newSets);
    });

    copyAllBtn.addEventListener('click', copyAllNumbers);
});
