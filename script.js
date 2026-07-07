document.addEventListener('DOMContentLoaded', () => {
    
    // Sticky Header
    const header = document.getElementById('header');
    const scrollBtn = document.getElementById('scroll-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
            scrollBtn.classList.add('visible');
        } else {
            header.classList.remove('scrolled');
            scrollBtn.classList.remove('visible');
        }
    });

    // Mobile Navigation Toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if(mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile nav on link click
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            
            // Set active state
            navItems.forEach(nav => nav.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Smooth Scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });

    // Testimonial Slider
    let slideIndex = 0;
    const slides = document.querySelectorAll(".testimonial-slide");
    const dots = document.querySelectorAll(".dot");
    let sliderTimer;

    function showSlides(n) {
        if(!slides.length) return;
        
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slideIndex = n !== undefined ? n : slideIndex + 1;
        
        if (slideIndex > slides.length) {slideIndex = 1}
        if (slideIndex < 1) {slideIndex = slides.length}
        
        slides[slideIndex-1].classList.add('active');
        dots[slideIndex-1].classList.add('active');
    }
    
    // Auto slide every 5 seconds
    if(slides.length) {
        showSlides(1);
        sliderTimer = setInterval(() => showSlides(), 5000);
    }
    
    // Expose dot click handler to global scope
    window.currentSlide = function(n) {
        clearInterval(sliderTimer);
        showSlides(n);
        sliderTimer = setInterval(() => showSlides(), 5000);
    }

    // Scroll Animation Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => scrollObserver.observe(el));

    // Modal Logic
    const modal = document.getElementById("actionModal");
    const closeModal = document.getElementById("closeModal");
    const sendMainBtn = document.getElementById("sendMainBtn");
    const sendSecBtn = document.getElementById("sendSecBtn");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");

    function openModal(title, text) {
        modalTitle.textContent = title;
        
        // Update WhatsApp links with the formatted text
        sendMainBtn.href = `https://wa.me/919491287501?text=${encodeURIComponent(text)}`;
        sendSecBtn.href = `https://wa.me/919618967469?text=${encodeURIComponent(text)}`;
        
        modal.style.display = "block";
    }

    if(closeModal) {
        closeModal.onclick = function() {
            modal.style.display = "none";
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Order Form Submission
    const orderForm = document.getElementById('orderForm');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const product = document.getElementById('product').value;
            const quantity = document.getElementById('quantity').value;
            const message = document.getElementById('message').value;
            
            const text = `Hello Sri Laxmi Farms,\n\nI would like to place an order:\n*Name:* ${name}\n*Phone:* ${phone}\n*Product:* ${product}\n*Quantity:* ${quantity}\n*Message:* ${message}`;
            
            openModal("Send Order Details", text);
        });
    }

    // Reviews Display Logic
    const recentReviewsContainer = document.getElementById('recentReviewsContainer');
    const reviewsList = document.getElementById('reviewsList');
    const reviewCountDisplay = document.getElementById('reviewCount');

    function renderReviews() {
        if (!recentReviewsContainer || !reviewsList) return;
        
        let reviews = JSON.parse(localStorage.getItem('farm_reviews') || '[]');
        if (reviews.length > 0) {
            recentReviewsContainer.style.display = 'block';
            reviewCountDisplay.textContent = reviews.length;
            
            reviewsList.innerHTML = '';
            // Show newest first
            reviews.slice().reverse().forEach(rev => {
                const stars = '★'.repeat(rev.rating) + '☆'.repeat(5 - rev.rating);
                const reviewHTML = `
                    <div style="background: var(--bg-color); padding: 20px; border-radius: var(--radius-md); box-shadow: var(--shadow-sm); border: 1px solid rgba(0,0,0,0.05);">
                        <div style="color: var(--accent); font-size: 1.2rem; margin-bottom: 5px;">${stars}</div>
                        <h4 style="margin-bottom: 5px; color: var(--primary-dark); font-family: 'Poppins', sans-serif;">${rev.name}</h4>
                        ${rev.review ? `<p style="color: var(--text-light); margin: 0; font-style: italic;">"${rev.review}"</p>` : ''}
                    </div>
                `;
                reviewsList.innerHTML += reviewHTML;
            });
        }
    }

    renderReviews();

    // Rating Form Submission
    const ratingForm = document.getElementById('ratingForm');
    if (ratingForm) {
        ratingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const ratingInput = document.querySelector('input[name="rating"]:checked');
            if (!ratingInput) {
                alert("Please select a star rating");
                return;
            }
            
            const rating = parseInt(ratingInput.value);
            const name = document.getElementById('reviewerName').value;
            const phone = document.getElementById('reviewerPhone').value;
            const review = document.getElementById('reviewText').value;
            
            // Save to localStorage
            const newReview = { rating, name, review, date: new Date().toISOString() };
            let reviews = JSON.parse(localStorage.getItem('farm_reviews') || '[]');
            reviews.push(newReview);
            localStorage.setItem('farm_reviews', JSON.stringify(reviews));
            
            // Re-render UI
            renderReviews();
            
            // Clear form and show modal
            ratingForm.reset();
            
            const text = `Hello Sri Laxmi Farms,\n\nI have submitted a new review:\n*Rating:* ${rating} Stars\n*Name:* ${name}\n*Phone:* ${phone}\n*Review:* ${review}`;
            
            openModal("Send Review", text);
        });
    }
});
