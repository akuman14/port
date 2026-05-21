document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. CABEÇALHO COM ESTILO NO SCROLL
       ========================================== */
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================
       2. MENU MOBILE (ABRIR E FECHAR)
       ========================================== */
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = document.getElementById('menu-icon');

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isActive = navMenu.classList.contains('active');
        
        // Altera o ícone do menu usando os nomes dos ícones do Lucide
        if (isActive) {
            menuIcon.setAttribute('data-lucide', 'x');
        } else {
            menuIcon.setAttribute('data-lucide', 'menu');
        }
        // Recria os ícones do Lucide para aplicar a mudança
        lucide.createIcons();
    });

    // Fechar o menu ao clicar em qualquer link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuIcon.setAttribute('data-lucide', 'menu');
            lucide.createIcons();
        });
    });

    /* ==========================================
       3. LINKS ATIVOS COM BASE NA SEÇÃO DO SCROLL
       ========================================== */
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset para compensar o cabeçalho fixo
            const sectionId = current.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
            
            if (correspondingLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                    correspondingLink.classList.add('active');
                }
            }
        });
    });

    /* ==========================================
       4. FILTRO DO PORTFÓLIO (OBRAS)
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove a classe active de todos e adiciona no clicado
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.classList.remove('hide');
                    // Efeito de transição suave de entrada
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.transition = 'all 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.classList.add('hide');
                }
            });
        });
    });

    /* ==========================================
       5. FORMULÁRIO DE ORÇAMENTO COM FEEDBACK TOAST
       ========================================== */
    const quoteForm = document.getElementById('quote-form');
    const toast = document.getElementById('toast');

    if (quoteForm) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Impede o recarregamento padrão da página
            
            // Aqui você capturaria os dados do formulário
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                projectType: document.getElementById('project-type').value,
                message: document.getElementById('message').value
            };
            
            // Exibindo no console para que Fernando veja o fluxo de dados
            console.log('Dados do Orçamento Recebidos:', formData);
            
            // Efeito visual do botão de envio
            const submitBtn = quoteForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = 'Enviando... <i data-lucide="loader" class="animate-spin"></i>';
            submitBtn.disabled = true;
            lucide.createIcons();
            
            // Simular uma requisição de rede (1.5 segundos)
            setTimeout(() => {
                // Exibe o Toast de Sucesso
                toast.classList.add('show');
                
                // Limpa o formulário
                quoteForm.reset();
                
                // Restaura o botão
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
                lucide.createIcons();
                
                // Oculta o toast após 4 segundos
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 4000);
                
            }, 1500);
        });
    }

    /* ==========================================
       6. ANIMAÇÃO DE HOLOFOTE NEON (HERO GLOW)
       ========================================== */
    const heroSection = document.getElementById('inicio');
    const heroGlow = document.querySelector('.hero-glow');
    
    if (heroSection && heroGlow) {
        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            heroSection.style.setProperty('--mouse-x', `${x}px`);
            heroSection.style.setProperty('--mouse-y', `${y}px`);
        });
    }
});
