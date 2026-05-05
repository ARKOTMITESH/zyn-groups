// ==========================================================================
// Wait for DOM to load
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================================================
    // Loader Animation
    // ==========================================================================
    setTimeout(() => {
        gsap.to(".loader", {
            y: "-100%",
            duration: 1,
            ease: "power4.inOut",
            onComplete: () => {
                initThreeJS();
                initAnimations();
                ScrollTrigger.refresh();
            }
        });
    }, 1500);

    // ==========================================================================
    // Custom Cursor
    // ==========================================================================
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    if (window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
            gsap.to(cursorFollower, { x: e.clientX, y: e.clientY, duration: 0.3 });
        });

        const hoverElements = document.querySelectorAll('a, button, .accordion-header, select');
        
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-active');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-active');
            });
        });
    }

    // ==========================================================================
    // Navbar Scroll Blur
    // ==========================================================================
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // Theme Toggle
    // ==========================================================================
    const themeBtn = document.getElementById('theme-toggle');
    const icon = themeBtn.querySelector('i');
    
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        if (document.body.classList.contains('light-theme')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    });

    // ==========================================================================
    // Services Accordion
    // ==========================================================================
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            accordionItems.forEach(i => i.classList.remove('active'));
            
            if (!isActive) {
                item.classList.add('active');
            }
            
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 450);
        });
    });

    // ==========================================================================
    // Project Filters
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                if (filter === 'all' || item.classList.contains(filter)) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
            
            setTimeout(() => {
                ScrollTrigger.refresh();
            }, 450);
        });
    });

    // ==========================================================================
    // General GSAP Animations
    // ==========================================================================
    function initAnimations() {
        // Hero Text reveal
        gsap.from(".hero-title span, .hero-subtitle, .hero-btns", {
            y: 50,
            opacity: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power4.out",
            delay: 0.2
        });

        // Scroll reveals for sections
        const revealElements = document.querySelectorAll('.gsap-fade-up');
        revealElements.forEach((el) => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                    toggleActions: "play none none none"
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: "power2.out"
            });
        });

        // Stats Counter
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            ScrollTrigger.create({
                trigger: counter,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2000;
                    const step = target / (duration / 16);
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target + (target > 500 ? '+' : '');
                        }
                    };
                    updateCounter();
                }
            });
        });
    }

    // ==========================================================================
    // Contact Form -> WhatsApp Integration
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const whatsappMessage = `Hello ZYN GROUPS,\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/917799118561?text=${encodedMessage}`;

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                formStatus.innerHTML = '<span style="color: #00f0ff;">Redirecting to WhatsApp...</span>';
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                setTimeout(() => { formStatus.innerHTML = ''; }, 5000);
            }, 1000);
        });
    }

    // ==========================================================================
    // Three.js Background Particle/Floating Objects Engine
    // ==========================================================================
    function initThreeJS() {
        const canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // Create floating objects
        const objects = [];
        const geometries = [
            new THREE.IcosahedronGeometry(1, 0),
            new THREE.OctahedronGeometry(1, 0),
            new THREE.TetrahedronGeometry(1, 0),
            new THREE.TorusGeometry(1, 0.3, 16, 32)
        ];

        // Materials matching division colors
        const materials = [
            new THREE.MeshPhysicalMaterial({ color: 0x00f0ff, metalness: 0.5, roughness: 0.1, transparent: true, opacity: 0.6 }),
            new THREE.MeshPhysicalMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2, transparent: true, opacity: 0.6 }),
            new THREE.MeshPhysicalMaterial({ color: 0xff6b6b, metalness: 0.3, roughness: 0.4, transparent: true, opacity: 0.6 }),
            new THREE.MeshPhysicalMaterial({ color: 0x8b4513, metalness: 0.1, roughness: 0.8, transparent: true, opacity: 0.6 }) 
        ];

        for (let i = 0; i < 40; i++) {
            const geo = geometries[Math.floor(Math.random() * geometries.length)];
            const mat = materials[Math.floor(Math.random() * materials.length)];
            const mesh = new THREE.Mesh(geo, mat);

            mesh.position.x = (Math.random() - 0.5) * 40;
            mesh.position.y = (Math.random() - 0.5) * 40;
            mesh.position.z = (Math.random() - 0.5) * 20 - 10;

            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;

            const scale = Math.random() * 0.5 + 0.2;
            mesh.scale.set(scale, scale, scale);

            scene.add(mesh);
            objects.push({
                mesh: mesh,
                rx: (Math.random() - 0.5) * 0.02,
                ry: (Math.random() - 0.5) * 0.02,
                yDir: Math.random() > 0.5 ? 1 : -1,
                speed: Math.random() * 0.01 + 0.005
            });
        }

        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0x00f0ff, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);
        
        const pointLight2 = new THREE.PointLight(0x8a2be2, 1);
        pointLight2.position.set(-5, -5, 5);
        scene.add(pointLight2);

        camera.position.z = 10;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;

        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        });

        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            targetX = mouseX * 0.001;
            targetY = mouseY * 0.001;

            scene.rotation.y += 0.05 * (targetX - scene.rotation.y);
            scene.rotation.x += 0.05 * (targetY - scene.rotation.x);

            objects.forEach((obj, i) => {
                obj.mesh.rotation.x += obj.rx;
                obj.mesh.rotation.y += obj.ry;
                obj.mesh.position.y += Math.sin(elapsedTime * obj.speed * 10 + i) * 0.01 * obj.yDir;
            });

            renderer.render(scene, camera);
        }

        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

});
