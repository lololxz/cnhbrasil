(function() {
    console.log("Automated Checkout Script Loaded");

    const CONFIG = {
        CPF_LENGTH: 11,
        MIN_NAME_WORDS: 2,
        PHONE_LENGTH: 11, // Including DDD
        DEBOUNCE_MS: 800
    };

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function getUnmaskedLength(val) {
        return val.replace(/\D/g, '').length;
    }

    function triggerNext() {
        // Try various buttons that indicate "Next"
        const nextButtons = [
            ...document.querySelectorAll('button'),
            ...document.querySelectorAll('div[role="button"]')
        ];
        
        const targetText = ["Continuar", "Confirmar", "Avançar", "Prosseguir", "Finalizar Cadastro", "PAGAR AGORA"];
        
        const btn = nextButtons.find(b => {
             const text = b.innerText.trim();
             return targetText.some(t => text.includes(t));
        });

        if (btn && !btn.disabled) {
            console.log("Auto-clicking:", btn.innerText);
            btn.click();
        }
    }

    let searchTimeout;
    
    document.addEventListener('input', (e) => {
        const target = e.target;
        if (!target.tagName === 'INPUT') return;

        const val = target.value;
        const placeholder = target.placeholder || "";
        const id = target.id || "";

        // CPF Detection
        if (id === 'cpf' || placeholder.includes('CPF')) {
            if (getUnmaskedLength(val) === CONFIG.CPF_LENGTH) {
                setTimeout(triggerNext, 300);
            }
        }

        // Email Detection
        if (target.type === 'email' || placeholder.toLowerCase().includes('email')) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                if (validateEmail(val)) {
                    triggerNext();
                }
            }, CONFIG.DEBOUNCE_MS);
        }

        // Name Detection
        if (placeholder.toLowerCase().includes('nome')) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const words = val.trim().split(/\s+/);
                if (words.length >= CONFIG.MIN_NAME_WORDS && words[words.length-1].length >= 2) {
                    triggerNext();
                }
            }, CONFIG.DEBOUNCE_MS);
        }

        // Phone Detection
        if (placeholder.includes('99999') || placeholder.toLowerCase().includes('telefone') || placeholder.toLowerCase().includes('whatsapp')) {
            if (getUnmaskedLength(val) >= 10) { // Support 10 or 11
                 clearTimeout(searchTimeout);
                 searchTimeout = setTimeout(() => {
                     triggerNext();
                 }, CONFIG.DEBOUNCE_MS);
            }
        }
    });

    // Auto-click selection buttons which are already "alone" but we ensure it
    document.addEventListener('click', (e) => {
        // This is handled by the app's own React logic mostly, 
        // but we could add more logic here if needed.
    });

})();
