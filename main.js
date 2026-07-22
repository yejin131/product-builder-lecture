document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const partnershipForm = document.getElementById('partnership-form');
    const submitBtn = document.getElementById('submit-btn');
    const formStatus = document.getElementById('form-status');
    const formCard = document.getElementById('form-card');
    const successView = document.getElementById('success-view');
    const receiptId = document.getElementById('receipt-id');
    const resetFormBtn = document.getElementById('reset-form-btn');
    const messageInput = document.getElementById('message');
    const charNum = document.getElementById('char-num');
    const togglePrivacyDetail = document.getElementById('toggle-privacy-detail');
    const privacyDetail = document.getElementById('privacy-detail');
    const toast = document.getElementById('toast');
    const faqItems = document.querySelectorAll('.faq-item');

    // --- Theme Management ---
    function initTheme() {
        const savedTheme = localStorage.getItem('partnership-theme');
        if (savedTheme) {
            applyTheme(savedTheme);
        } else {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            applyTheme(prefersDark ? 'dark' : 'light');
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('partnership-theme', theme);
        
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
            themeToggleBtn.setAttribute('title', '라이트 모드로 전환');
        } else {
            icon.className = 'fa-solid fa-moon';
            themeToggleBtn.setAttribute('title', '다크 모드로 전환');
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // --- Character Count Handler ---
    if (messageInput && charNum) {
        messageInput.addEventListener('input', () => {
            charNum.textContent = messageInput.value.length;
        });
    }

    // --- Privacy Detail Toggle ---
    if (togglePrivacyDetail && privacyDetail) {
        togglePrivacyDetail.addEventListener('click', () => {
            privacyDetail.classList.toggle('hidden');
            togglePrivacyDetail.textContent = privacyDetail.classList.contains('hidden') ? '약관 보기' : '약관 닫기';
        });
    }

    // --- Toast Notification ---
    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // --- FAQ Accordion Handler ---
    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        questionBtn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all
            faqItems.forEach(el => el.classList.remove('active'));

            // Toggle current if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // --- Formspree AJAX Submission ---
    if (partnershipForm) {
        partnershipForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Disable submit button & show loading state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>전송 중...</span>';

            // Reset status message
            formStatus.className = 'form-status';
            formStatus.style.display = 'none';

            const formData = new FormData(partnershipForm);

            try {
                const response = await fetch(partnershipForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Generate random receipt ID
                    const randomId = `#REQ-${Math.floor(10000 + Math.random() * 90000)}`;
                    if (receiptId) receiptId.textContent = randomId;

                    // Switch view to Success View
                    partnershipForm.classList.add('hidden');
                    successView.classList.remove('hidden');
                    showToast('제휴 문의가 성공적으로 전송되었습니다! 📩');
                } else {
                    const data = await response.json();
                    let errorMsg = '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.';
                    if (data && data.errors && data.errors.length > 0) {
                        errorMsg = data.errors.map(err => err.message).join(', ');
                    }
                    formStatus.className = 'form-status error';
                    formStatus.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> ${errorMsg}`;
                    formStatus.style.display = 'flex';
                }
            } catch (err) {
                formStatus.className = 'form-status error';
                formStatus.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> 네트워크 연결 오류가 발생했습니다.';
                formStatus.style.display = 'flex';
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }

    // --- Reset Form Button Handler ---
    if (resetFormBtn) {
        resetFormBtn.addEventListener('click', () => {
            partnershipForm.reset();
            if (charNum) charNum.textContent = '0';
            successView.classList.add('hidden');
            partnershipForm.classList.remove('hidden');
            formStatus.style.display = 'none';
        });
    }

    // Initialize Theme
    initTheme();
});
