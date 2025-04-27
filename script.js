/**
 * Photo Gallery JavaScript
 * This script handles all the interactive functionality for the gallery
 * including filtering, lightbox, search, and view switching
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all gallery functionality
    initGallery();
});

/**
 * Initialize all gallery functionality
 */
function initGallery() {
    // Only run gallery code if we're on the gallery page
    if (document.querySelector('.gallery-grid')) {
        setupFilters();
        setupSearch();
        setupViewToggle();
        setupLightbox();
        setupLoadMore();
    }
    
    // Mobile menu toggle (works on all pages)
    setupMobileMenu();
}

/**
 * Set up category filtering
 */
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Check if URL has a hash for direct category access
    if (window.location.hash) {
        const category = window.location.hash.substring(1);
        filterGallery(category);
        
        // Update active button
        filterButtons.forEach(btn => {
            if (btn.dataset.filter === category) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get filter value
            const filterValue = this.dataset.filter;
            
            // Filter gallery
            filterGallery(filterValue);
        });
    });
    
    function filterGallery(filter) {
        galleryItems.forEach(item => {
            if (filter === 'all' || item.dataset.category === filter) {
                item.style.display = 'block';
                // Add animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }
}

/**
 * Set up search functionality
 */
function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Search when button is clicked
    searchButton.addEventListener('click', performSearch);
    
    // Search when Enter key is pressed
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show all items
            galleryItems.forEach(item => {
                item.style.display = 'block';
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            });
            return;
        }
        
        galleryItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(item.querySelectorAll('.gallery-item-tags span')).map(tag => tag.textContent.toLowerCase());
            
            // Check if search term is in title, description, or tags
            if (title.includes(searchTerm) || description.includes(searchTerm) || tags.some(tag => tag.includes(searchTerm))) {
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
                }, 300);
            }
        });
    }
}

/**
 * Set up view toggle (grid/list)
 */
function setupViewToggle() {
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const galleryGrid = document.getElementById('gallery');
    
    gridViewBtn.addEventListener('click', function() {
        galleryGrid.classList.remove('list-view');
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        
        // Save preference to localStorage
        localStorage.setItem('galleryView', 'grid');
    });
    
    listViewBtn.addEventListener('click', function() {
        galleryGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
        
        // Save preference to localStorage
        localStorage.setItem('galleryView', 'list');
    });
    
    // Check if user has a saved preference
    const savedView = localStorage.getItem('galleryView');
    if (savedView === 'list') {
        galleryGrid.classList.add('list-view');
        listViewBtn.classList.add('active');
        gridViewBtn.classList.remove('active');
    }
}

/**
 * Set up lightbox functionality
 */
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDescription = document.getElementById('lightbox-description');
    const lightboxTags = document.getElementById('lightbox-tags');
    const currentIndex = document.getElementById('current-index');
    const totalImages = document.getElementById('total-images');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const closeBtn = document.getElementById('close-lightbox');
    
    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImageIndex = 0;
    
    // Set total images count
    totalImages.textContent = galleryItems.length;
    
    // Add click event to all gallery items
    galleryItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.view-btn');
        
        viewBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openLightbox(index);
        });
    });
    
    // Open lightbox with specific image
    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Update lightbox content based on current index
    function updateLightboxContent() {
        const item = galleryItems[currentImageIndex];
        const img = item.querySelector('.gallery-img');
        const title = item.querySelector('h3').textContent;
        const description = item.querySelector('p').textContent;
        const tags = item.querySelectorAll('.gallery-item-tags span');
        
        // Update image and text
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lightboxTitle.textContent = title;
        lightboxDescription.textContent = description;
        
        // Update tags
        lightboxTags.innerHTML = '';
        tags.forEach(tag => {
            const span = document.createElement('span');
            span.textContent = tag.textContent;
            lightboxTags.appendChild(span);
        });
        
        // Update counter
        currentIndex.textContent = currentImageIndex + 1;
        
        // Add a fade effect
        lightboxImage.style.opacity = '0';
        setTimeout(() => {
            lightboxImage.style.opacity = '1';
        }, 100);
    }
    
    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Navigate to previous image
    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
        updateLightboxContent();
    }
    
    // Navigate to next image
    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
        updateLightboxContent();
    }
    
    // Event listeners for lightbox controls
    prevBtn.addEventListener('click', prevImage);
    nextBtn.addEventListener('click', nextImage);
    closeBtn.addEventListener('click', closeLightbox);
    
    // Close lightbox when clicking outside the content
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                prevImage();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'Escape':
                closeLightbox();
                break;
        }
    });
}

/**
 * Set up load more functionality
 */
function setupLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', function() {
        // Simulate loading more images
        this.textContent = 'Loading...';
        this.disabled = true;
        
        setTimeout(() => {
            // Add more gallery items
            addMoreGalleryItems();
            
            // Reset button
            this.textContent = 'Load More';
            this.disabled = false;
        }, 1500);
    });
    
    function addMoreGalleryItems() {
        const gallery = document.getElementById('gallery');
        const categories = ['nature', 'architecture', 'people', 'animals'];
        
        // Create 6 new items
        for (let i = 0; i < 6; i++) {
            const category = categories[Math.floor(Math.random() * categories.length)];
            const randomNum = Math.floor(Math.random() * 1000);
            
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.dataset.category = category;
            
            galleryItem.innerHTML = `
                <div class="gallery-item-inner">
                    <img src="https://source.unsplash.com/random/800x600?${category},${randomNum}" 
                         alt="${category.charAt(0).toUpperCase() + category.slice(1)} image ${randomNum}" 
                         loading="lazy" 
                         class="gallery-img">
                    <div class="gallery-item-info">
                        <h3>${category.charAt(0).toUpperCase() + category.slice(1)} ${randomNum}</h3>
                        <p>Beautiful ${category} photography showcasing the wonders of our world.</p>
                        <div class="gallery-item-tags">
                            <span>${category}</span>
                            <span>photography</span>
                        </div>
                    </div>
                    <div class="gallery-item-overlay">
                        <button class="view-btn"><i class="fas fa-eye"></i> View</button>
                        <div class="gallery-item-likes">
                            <i class="fas fa-heart"></i>
                            <span>${Math.floor(Math.random() * 300) + 100}</span>
                        </div>
                    </div>
                </div>
            `;
            
            gallery.appendChild(galleryItem);
        }
        
        // Reinitialize lightbox to include new items
        setupLightbox();
        
        // Apply current filter
        const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
        if (activeFilter !== 'all') {
            const galleryItems = document.querySelectorAll('.gallery-item');
            galleryItems.forEach(item => {
                if (item.dataset.category !== activeFilter) {
                    item.style.display = 'none';
                }
            });
        }
    }
}

/**
 * Set up mobile menu toggle
 */
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
    
    // Close menu when clicking a link
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

/**
 * Utility function to animate elements when they come into view
 * This adds a nice scroll animation effect to elements
 */
function setupScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize scroll animations if supported
if ('IntersectionObserver' in window) {
    setupScrollAnimations();
}
