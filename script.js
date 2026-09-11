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
       5. ANIMAÇÃO DE HOLOFOTE NEON (HERO GLOW)
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
    /* ==========================================
       6. MODAL DO PORTFÓLIO COM CARROSSEL DE FOTOS
       ========================================== */
    const projectModal = document.getElementById('project-modal');
    const modalClose = document.getElementById('modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalDescription = document.getElementById('modal-description');
    const carouselImg = document.getElementById('carousel-img');
    const carouselPrev = document.getElementById('carousel-prev');
    const carouselNext = document.getElementById('carousel-next');
    const carouselDots = document.getElementById('carousel-dots');

    let currentImages = [];
    let currentSlideIndex = 0;

    function updateCarouselSlide(index) {
        if (!currentImages.length) return;
        currentSlideIndex = (index + currentImages.length) % currentImages.length;
        
        carouselImg.style.opacity = '0.3';
        carouselImg.style.transform = 'scale(0.97)';
        
        setTimeout(() => {
            carouselImg.src = currentImages[currentSlideIndex];
            carouselImg.style.opacity = '1';
            carouselImg.style.transform = 'scale(1)';
        }, 150);

        const dots = carouselDots.querySelectorAll('.dot');
        dots.forEach((dot, idx) => {
            if (idx === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    function renderCarouselDots() {
        carouselDots.innerHTML = '';
        currentImages.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (idx === 0) dot.classList.add('active');
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                updateCarouselSlide(idx);
            });
            carouselDots.appendChild(dot);
        });
    }

    function openProjectModal(card) {
        const title = card.getAttribute('data-title') || card.querySelector('h3')?.innerText || 'Projeto';
        const tag = card.getAttribute('data-tag') || card.querySelector('.category-tag')?.innerText || '';
        const desc = card.getAttribute('data-desc') || card.querySelector('p')?.innerText || '';
        const rawImages = card.getAttribute('data-images');

        try {
            currentImages = rawImages ? JSON.parse(rawImages) : [];
        } catch (err) {
            currentImages = [];
        }

        if (!currentImages.length) {
            const mainImgSrc = card.querySelector('img')?.src;
            if (mainImgSrc) currentImages = [mainImgSrc];
        }

        // Pré-carregamento das imagens (Preload) para remover o delay ao trocar fotos
        currentImages.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        modalTitle.innerText = title;
        modalCategory.innerText = tag;
        modalDescription.innerText = desc;

        renderCarouselDots();
        updateCarouselSlide(0);

        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');

        if (window.lucide) {
            lucide.createIcons();
        }
    }

    function closeProjectModal() {
        if (!projectModal) return;
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    // Ouvinte para cada card do portfólio
    portfolioCards.forEach(card => {
        card.addEventListener('click', () => {
            openProjectModal(card);
        });
    });

    // Botão de fechar (X)
    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }

    // Clicar fora do card (no overlay) para fechar
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeProjectModal();
            }
        });
    }

    // Botões Próximo e Anterior
    if (carouselNext) {
        carouselNext.addEventListener('click', (e) => {
            e.stopPropagation();
            updateCarouselSlide(currentSlideIndex + 1);
        });
    }

    if (carouselPrev) {
        carouselPrev.addEventListener('click', (e) => {
            e.stopPropagation();
            updateCarouselSlide(currentSlideIndex - 1);
        });
    }

    // Atalhos do Teclado (ESC e Setas Direcionais)
    window.addEventListener('keydown', (e) => {
        if (!projectModal || !projectModal.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeProjectModal();
        } else if (e.key === 'ArrowRight') {
            updateCarouselSlide(currentSlideIndex + 1);
        } else if (e.key === 'ArrowLeft') {
            updateCarouselSlide(currentSlideIndex - 1);
        }
    });
});






