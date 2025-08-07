// Modal and button logic
document.addEventListener('DOMContentLoaded', function () {
  // Discover More button scrolls to Facilities section
  var discoverMoreBtn = document.getElementById('discover-more-btn');
  if (discoverMoreBtn) {
    discoverMoreBtn.addEventListener('click', function () {
      var facilitiesSection = document.getElementById('service');
      if (facilitiesSection) {
        facilitiesSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
  // Payment Modal
  var paymentModal = document.getElementById('payment-modal');
  var payBtn = document.getElementById('pay-btn');
  var closePaymentBtn = document.getElementById('close-payment-btn');
  window.openPaymentModal = function () {
    if (paymentModal) paymentModal.style.display = 'flex';
  };
  if (closePaymentBtn && paymentModal) {
    closePaymentBtn.addEventListener('click', function () {
      paymentModal.style.display = 'none';
    });
  }
  if (payBtn && paymentModal) {
    payBtn.addEventListener('click', function (e) {
      e.preventDefault();
      paymentModal.style.display = 'none';
      alert('Payment successful!');
      // Optionally add to booking history
      var bookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
      bookings.push({ date: new Date().toLocaleString(), status: 'Paid' });
      localStorage.setItem('bookingHistory', JSON.stringify(bookings));
    });
  }

  // Booking History Modal
  var bookingHistoryBtn = document.getElementById('booking-history-btn');
  var bookingHistoryModal = document.getElementById('booking-history-modal');
  var closeHistoryBtn = document.getElementById('close-history-btn');
  var bookingHistoryList = document.getElementById('booking-history-list');
  if (bookingHistoryBtn && bookingHistoryModal) {
    bookingHistoryBtn.addEventListener('click', function () {
      bookingHistoryModal.style.display = 'flex';
      var bookings = JSON.parse(localStorage.getItem('bookingHistory') || '[]');
      if (bookings.length === 0) {
        bookingHistoryList.innerHTML = 'No bookings yet.';
      } else {
        bookingHistoryList.innerHTML = '<ul style="padding-left:1.2rem;">' + bookings.map(function(b) {
          return '<li>' + b.date + ' - ' + b.status + '</li>';
        }).join('') + '</ul>';
      }
    });
  }
  if (closeHistoryBtn && bookingHistoryModal) {
    closeHistoryBtn.addEventListener('click', function () {
      bookingHistoryModal.style.display = 'none';
    });
  }

  // Booking Modal
  var bookingModal = document.getElementById('booking-modal');
  var closeBookingBtns = bookingModal ? bookingModal.querySelectorAll('.close-modal-btn') : [];
  closeBookingBtns.forEach(function(btn) {
    btn.addEventListener('click', function () {
      bookingModal.style.display = 'none';
    });
  });

  // Room Details Modal
  var roomDetailsModal = document.getElementById('room-details-modal');
  var closeRoomDetailsBtns = roomDetailsModal ? roomDetailsModal.querySelectorAll('.close-modal-btn') : [];
  closeRoomDetailsBtns.forEach(function(btn) {
    btn.addEventListener('click', function () {
      roomDetailsModal.style.display = 'none';
    });
  });

  // Explore Modal
  var exploreModal = document.getElementById('explore-modal');
  var closeExploreBtns = exploreModal ? exploreModal.querySelectorAll('.close-modal-btn') : [];
  closeExploreBtns.forEach(function(btn) {
    btn.addEventListener('click', function () {
      exploreModal.style.display = 'none';
    });
  });

  // Login Modal
  var loginModal = document.getElementById('login-modal');
  var closeLoginBtns = loginModal ? loginModal.querySelectorAll('.close-modal-btn') : [];
  closeLoginBtns.forEach(function(btn) {
    btn.addEventListener('click', function () {
      loginModal.style.display = 'none';
    });
  });

  // Resident Popup
  var residentPopup = document.getElementById('resident-popup');
  var closeResidentBtns = residentPopup ? residentPopup.querySelectorAll('.resident-btn-cancel, .close-modal-btn') : [];
  closeResidentBtns.forEach(function(btn) {
    btn.addEventListener('click', function () {
      residentPopup.style.display = 'none';
    });
  });

  // Connect payment modal to booking confirmation
  var bookingConfirmBtn = document.getElementById('booking-confirm-btn');
  if (bookingConfirmBtn) {
    bookingConfirmBtn.addEventListener('click', function (e) {
      var bookingStepDetails = document.getElementById('booking-step-details');
      if (bookingStepDetails && bookingStepDetails.style.display !== 'none') {
        window.openPaymentModal();
      }
    });
  }
});
// Current Residents Booking button logic
document.addEventListener('DOMContentLoaded', function () {
  var residentBtn = document.getElementById('resident-btn');
  var residentPopup = document.getElementById('resident-popup');
  var residentCancel = document.querySelector('.resident-btn-cancel');
  var residentSubmit = document.querySelector('.resident-btn');

  if (residentBtn && residentPopup) {
    residentBtn.addEventListener('click', function () {
      residentPopup.style.display = 'flex';
    });
  }
  if (residentCancel && residentPopup) {
    residentCancel.addEventListener('click', function () {
      residentPopup.style.display = 'none';
    });
  }
  if (residentSubmit && residentPopup) {
    residentSubmit.addEventListener('click', function () {
      // Example: just close popup for now, add validation as needed
      residentPopup.style.display = 'none';
    });
  }

  // Room details data
  var roomDetailsData = {
    '1in1': {
      title: '1 in 1 Room',
      price: '₵15,000/year',
      desc: 'Private room for one student. Maximum comfort and privacy for focused study.',
      gallery: ['assets/opal_single.jpg'],
      features: ['Private bathroom', 'Study desk', 'Wardrobe', 'Air conditioning'],
      amenities: 'Wi-Fi, 24/7 Security, Laundry, Cafeteria',
      floor: 'Any floor',
      reviews: [
        { text: 'Perfect for focused study!', author: 'Ama, Level 200' },
        { text: 'Very comfortable and private.', author: 'Kwame, Level 100' }
      ]
    },
    '2in1': {
      title: '2 in 1 Room',
      price: '₵10,000/year',
      desc: 'Shared room for two students. Great for collaboration and making friends.',
      gallery: ['assets/2 in 1.jpeg'],
      features: ['Shared bathroom', 'Study desks', 'Wardrobes', 'Air conditioning'],
      amenities: 'Wi-Fi, 24/7 Security, Laundry, Cafeteria',
      floor: 'Any floor',
      reviews: [
        { text: 'Made a great friend here!', author: 'Efua, Level 300' }
      ]
    },
    '3in1': {
      title: '3 in 1 Room',
      price: '₵8,500/year',
      desc: 'Shared room for three students. Balanced privacy and affordability.',
      gallery: ['assets/3 in 1.jpeg'],
      features: ['Shared bathroom', 'Study desks', 'Wardrobes', 'Fan'],
      amenities: 'Wi-Fi, 24/7 Security, Laundry, Cafeteria',
      floor: 'Any floor',
      reviews: [
        { text: 'Affordable and fun!', author: 'Yaw, Level 200' }
      ]
    },
    '4in1': {
      title: '4 in 1 Room',
      price: '₵6,500/year',
      desc: 'Shared room for four students. Most affordable option for a vibrant student life.',
      gallery: ['assets/4 in 1.jpg'],
      features: ['Shared bathroom', 'Study desks', 'Wardrobes', 'Fan'],
      amenities: 'Wi-Fi, 24/7 Security, Laundry, Cafeteria',
      floor: 'Any floor',
      reviews: [
        { text: 'Best value for money!', author: 'Kojo, Level 100' }
      ]
    }
  };

  // Ensure View Details buttons open Room Details modal with correct info
  var detailsBtns = document.querySelectorAll('.room-details-btn');
  var roomDetailsModal = document.getElementById('room-details-modal');
  if (detailsBtns && roomDetailsModal) {
    detailsBtns.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var roomKey = btn.getAttribute('onclick').match(/'(.*?)'/g);
        if (roomKey && roomKey[0]) {
          roomKey = roomKey[0].replace(/'/g, '');
        } else {
          roomKey = '1in1';
        }
        var data = roomDetailsData[roomKey];
        if (data) {
          // Gallery
          var galleryDiv = document.getElementById('room-details-gallery');
          if (galleryDiv) {
            galleryDiv.innerHTML = data.gallery.map(function(img) {
              return '<img src="' + img + '" alt="' + data.title + '" style="max-width:120px;margin-right:1rem;border-radius:8px;">';
            }).join('');
          }
          // Title
          var titleEl = document.getElementById('room-details-title');
          if (titleEl) titleEl.textContent = data.title;
          // Price
          var priceEl = document.getElementById('room-details-price');
          if (priceEl) priceEl.textContent = data.price;
          // Desc
          var descEl = document.getElementById('room-details-desc');
          if (descEl) descEl.textContent = data.desc;
          // Features
          var featuresEl = document.getElementById('room-details-features');
          if (featuresEl) featuresEl.innerHTML = data.features.map(function(f) { return '<li>' + f + '</li>'; }).join('');
          // Amenities
          var amenitiesEl = document.getElementById('room-details-amenities');
          if (amenitiesEl) amenitiesEl.textContent = 'Amenities: ' + data.amenities;
          // Floor
          var floorEl = document.getElementById('room-details-floor');
          if (floorEl) floorEl.textContent = 'Floor: ' + data.floor;
          // Reviews
          var reviewsEl = document.getElementById('room-details-reviews');
          if (reviewsEl) {
            reviewsEl.innerHTML = data.reviews.map(function(r) {
              return '<div style="margin-bottom:0.5rem;"><em>"' + r.text + '"</em> <span style="color:#2563eb;">' + r.author + '</span></div>';
            }).join('');
          }
        }
        roomDetailsModal.style.display = 'flex';
      });
    });
  }
});
// Room details data for each room type


// Clean, single source of truth for booking modal step navigation
window.showBookingModal = function(roomName, roomPrice) {
  // Set info for step 1
  document.getElementById('booking-modal-info').textContent = `Book your room: ${roomName} (${roomPrice})`;
  // Show step 1, hide others
  document.getElementById('booking-step-room').style.display = '';
  document.getElementById('booking-step-details').style.display = 'none';
  document.getElementById('booking-step-confirm').style.display = 'none';
  // Progress bar
  document.getElementById('step-room').classList.add('active');
  document.getElementById('step-details').classList.remove('active');
  document.getElementById('step-confirm').classList.remove('active');
  // Show modal
  document.getElementById('booking-modal').style.display = 'flex';

  // Step navigation logic (remove previous handlers to avoid stacking)
  var nextBtn = document.getElementById('booking-next-btn');
  var backBtn = document.getElementById('booking-back-btn');
  var confirmBtn = document.getElementById('booking-confirm-btn');

  if (nextBtn) {
    nextBtn.onclick = function() {
      document.getElementById('booking-step-room').style.display = 'none';
      document.getElementById('booking-step-details').style.display = '';
      document.getElementById('booking-step-confirm').style.display = 'none';
      document.getElementById('step-room').classList.remove('active');
      document.getElementById('step-details').classList.add('active');
      document.getElementById('step-confirm').classList.remove('active');
    };
  }
  if (backBtn) {
    backBtn.onclick = function() {
      document.getElementById('booking-step-room').style.display = '';
      document.getElementById('booking-step-details').style.display = 'none';
      document.getElementById('booking-step-confirm').style.display = 'none';
      document.getElementById('step-room').classList.add('active');
      document.getElementById('step-details').classList.remove('active');
      document.getElementById('step-confirm').classList.remove('active');
    };
  }
  if (confirmBtn) {
    confirmBtn.onclick = function() {
      // Validate fields
      const name = document.getElementById('booking-name').value.trim();
      const studentid = document.getElementById('booking-studentid').value.trim();
      const email = document.getElementById('booking-email').value.trim();
      if (!name || !studentid || !email) {
        alert('Please fill in all fields.');
        return;
      }
      // Show confirmation step
      document.getElementById('booking-step-room').style.display = 'none';
      document.getElementById('booking-step-details').style.display = 'none';
      document.getElementById('booking-step-confirm').style.display = '';
      document.getElementById('step-room').classList.remove('active');
      document.getElementById('step-details').classList.remove('active');
      document.getElementById('step-confirm').classList.add('active');
      // Feedback
      document.getElementById('booking-feedback').innerHTML = `<span style="color:#059669;font-weight:600;">Booking successful! Confirmation sent to ${email}.</span>`;
    };
  }
};



// Show Room Details Modal with correct info
window.showRoomDetailsModal = function(type) {
  const data = roomDetails[type];
  document.getElementById('room-details-title').textContent = data.title;
  document.getElementById('room-details-price').textContent = data.price;
  document.getElementById('room-details-desc').textContent = data.desc;
  const gallery = document.getElementById('room-details-gallery');
  gallery.innerHTML = '';
  data.gallery.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = data.title + ' photo';
    gallery.appendChild(img);
  });
  const features = document.getElementById('room-details-features');
  features.innerHTML = '';
  data.features.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f;
    features.appendChild(li);
  });
  document.getElementById('room-details-book-btn').onclick = function() {
    showBookingModal(data.title, data.price);
    closeRoomDetailsModal();
  };
  document.getElementById('room-details-modal').style.display = 'flex';
};

window.closeRoomDetailsModal = function() {
  document.getElementById('room-details-modal').style.display = 'none';
};

window.closeBookingModal = function() {
  document.getElementById('booking-modal').style.display = 'none';
};
// Professional Filter Bar Logic
document.getElementById('filter-btn').onclick = function() {
  const type = document.getElementById('filter-type').value;
  const floor = document.getElementById('filter-floor').value;
  const price = document.getElementById('filter-price').value;
  const avail = document.getElementById('filter-availability').value;
  const search = document.getElementById('filter-search').value.toLowerCase();
  const cards = document.querySelectorAll('.room__card');
  cards.forEach(card => {
    let show = true;
    const title = card.querySelector('h4').textContent;
    const priceText = card.querySelector('h5').textContent.replace(/[^\d]/g, '');
    if (type && !title.startsWith(type[0])) show = false;
    if (price && parseInt(priceText) < parseInt(price)) show = false;
    if (search && !title.toLowerCase().includes(search)) show = false;
    // Floor and availability logic can be added if data available
    card.style.display = show ? '' : 'none';
  });
};

// Room Details Modal Logic
const roomDetails = {
  '1in1': {
    title: '1 in 1 Room',
    price: '₵15,000/year',
    desc: 'Private room for one student. Maximum comfort and privacy for focused study.',
    gallery: ['assets/2 in 1.jpeg'],
    features: ['Private bathroom', 'Air conditioning', 'Desk & chair', 'Wardrobe', 'Wi-Fi']
  },
  '2in1': {
    title: '2 in 1 Room',
    price: '₵10,000/year',
    desc: 'Shared room for two students. Great for collaboration and making friends.',
    gallery: ['assets/3 in 1.jpeg'],
    features: ['Shared bathroom', 'Air conditioning', 'Desk & chair', 'Wardrobe', 'Wi-Fi']
  },
  '3in1': {
    title: '3 in 1 Room',
    price: '₵8,500/year',
    desc: 'Shared room for three students. Balanced privacy and affordability.',
    gallery: ['assets/4 in 1.jpg'],
    features: ['Shared bathroom', 'Fan', 'Desk & chair', 'Wardrobe', 'Wi-Fi']
  },
  '4in1': {
    title: '4 in 1 Room',
    price: '₵6,500/year',
    desc: 'Shared room for four students. Most affordable option for a vibrant student life.',
    gallery: ['assets/opal_single.jpg'],
    features: ['Shared bathroom', 'Fan', 'Desk & chair', 'Wardrobe', 'Wi-Fi']
  }
};
window.showRoomDetailsModal = function(type) {
  const modal = document.getElementById('room-details-modal');
  const data = roomDetails[type];
  document.getElementById('room-details-title').textContent = data.title;
  document.getElementById('room-details-price').textContent = data.price;
  document.getElementById('room-details-desc').textContent = data.desc;
  const gallery = document.getElementById('room-details-gallery');
  gallery.innerHTML = '';
  data.gallery.forEach(src => {
    const img = document.createElement('img');
    img.src = src;
    img.alt = data.title + ' photo';
    gallery.appendChild(img);
  });
  const features = document.getElementById('room-details-features');
  features.innerHTML = '';
  data.features.forEach(f => {
    const li = document.createElement('li');
    li.textContent = f;
    features.appendChild(li);
  });
  document.getElementById('room-details-book-btn').onclick = function() {
    showBookingModal(data.title, data.price);
    closeRoomDetailsModal();
  };
  modal.style.display = 'flex';
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('tabindex', '-1');
};
window.closeRoomDetailsModal = function() {
  document.getElementById('room-details-modal').style.display = 'none';
};

// Testimonials Carousel Logic
const slides = document.querySelectorAll('.testimonial__slide');
let currentSlide = 0;
function showTestimonialSlide(idx) {
  slides.forEach((s, i) => s.classList.toggle('active', i === idx));
}
document.querySelector('.testimonial-prev').onclick = function() {
  currentSlide = (currentSlide - 1 + slides.length) % slides.length;
  showTestimonialSlide(currentSlide);
};
document.querySelector('.testimonial-next').onclick = function() {
  currentSlide = (currentSlide + 1) % slides.length;
  showTestimonialSlide(currentSlide);
};
showTestimonialSlide(currentSlide);

// FAQ Accordion Logic
document.querySelectorAll('.faq__question').forEach(btn => {
  btn.onclick = function() {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !expanded);
    const answer = btn.nextElementSibling;
    answer.style.display = expanded ? 'none' : 'block';
  };
});

// Booking Progress Indicator & Feedback
window.confirmBooking = function() {
  // Simulate booking steps
  const progress = document.getElementById('booking-progress').children;
  progress[0].classList.remove('active');
  progress[1].classList.add('active');
  setTimeout(() => {
    progress[1].classList.remove('active');
    progress[2].classList.add('active');
    document.getElementById('booking-feedback').style.display = 'block';
    document.getElementById('booking-feedback').innerHTML = '<span style="color:#059669;font-weight:600;">Booking successful! Confirmation sent to your email.</span>';
    setTimeout(() => {
      closeBookingModal();
      // Reset progress
      progress[2].classList.remove('active');
      progress[0].classList.add('active');
      document.getElementById('booking-feedback').style.display = 'none';
    }, 2000);
  }, 1200);
};

// Accessibility: Close modals with Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    closeRoomDetailsModal();
    closeBookingModal();
    closeLoginModal();
    closeExploreModal();
    closeResidentPopup();
  }
});
const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");
const menuBtnIcon = menuBtn.querySelector("i");

menuBtn.addEventListener("click", () => {
  navLinks.classList.toggle("open");

  const isOpen = navLinks.classList.contains("open");
  menuBtnIcon.setAttribute("class", isOpen ? "ri-close-line" : "ri-menu-line");
});

navLinks.addEventListener("click", () => {
  navLinks.classList.remove("open");
  menuBtnIcon.setAttribute("class", "ri-menu-line");
});

const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};

// header container
ScrollReveal().reveal(".header__container p", {
  ...scrollRevealOption,
});

ScrollReveal().reveal(".header__container h1", {
  ...scrollRevealOption,
  delay: 500,
});

// about container
ScrollReveal().reveal(".about__image img", {
  ...scrollRevealOption,
  origin: "left",
});

ScrollReveal().reveal(".about__content .section__subheader", {
  ...scrollRevealOption,
  delay: 500,
});

ScrollReveal().reveal(".about__content .section__header", {
  ...scrollRevealOption,
  delay: 1000,
});

ScrollReveal().reveal(".about__content .section__description", {
  ...scrollRevealOption,
  delay: 1500,
});

ScrollReveal().reveal(".about__btn", {
  ...scrollRevealOption,
  delay: 2000,
});

// room container
ScrollReveal().reveal(".room__card", {
  ...scrollRevealOption,
  interval: 500,
});

// service container
ScrollReveal().reveal(".service__list li", {
  ...scrollRevealOption,
  interval: 500,
  origin: "right",
});

// Custom JS from index.html
function showResidentPopup() {
  document.getElementById('resident-popup').style.display = 'flex';
}
function closeResidentPopup() {
  document.getElementById('resident-popup').style.display = 'none';
}
function submitAccessCode() {
  var code = document.getElementById('access-code').value;
  // Add your access code validation and room display logic here
  alert('Access code submitted: ' + code + '\n(Rooms for current residents would be displayed here.)');
  closeResidentPopup();
}
// Simulate login state (replace with real logic when backend is ready)
var isLoggedIn = false;
document.addEventListener('DOMContentLoaded', function() {
  var bookRoomBtn = document.getElementById('book-room-btn');
  if (bookRoomBtn) {
    bookRoomBtn.onclick = function() {
      var roomSection = document.querySelector('.room__container');
      if (roomSection) {
        roomSection.scrollIntoView({ behavior: 'smooth' });
      }
    };
  }
  var loginForm = document.getElementById('loginForm');
  var registerForm = document.getElementById('registerForm');
  if (loginForm) {
    loginForm.onsubmit = function(e) {
      e.preventDefault();
      // Add login logic here
      alert('Login submitted for: ' + document.getElementById('login-username').value);
      isLoggedIn = true;
      closeLoginModal();
    };
  }
  if (registerForm) {
    registerForm.onsubmit = function(e) {
      e.preventDefault();
      // Add registration logic here
      alert('Registration submitted for: ' + document.getElementById('register-username').value);
      isLoggedIn = true;
      closeLoginModal();
    };
  }
  var exploreRoomsBtn = document.querySelector('.explore__content .btn');
  if (exploreRoomsBtn) {
    exploreRoomsBtn.onclick = function() {
      showExploreModal();
    };
  }
  var bookNowBtns = document.querySelectorAll('.room__card .btn');
  bookNowBtns.forEach(function(btn) {
    btn.onclick = function() {
      var roomType = btn.parentElement.querySelector('h4')?.textContent || '';
      showBookingModal(roomType);
    };
  });
});
function showLoginModal() {
  document.getElementById('login-modal').style.display = 'flex';
  showTab('login');
}
function closeLoginModal() {
  document.getElementById('login-modal').style.display = 'none';
}
function showTab(tab) {
  var loginForm = document.getElementById('loginForm');
  var registerForm = document.getElementById('registerForm');
  var tabLogin = document.getElementById('tab-login');
  var tabRegister = document.getElementById('tab-register');
  if(tab === 'login') {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  }
}
function showExploreModal() {
  document.getElementById('explore-modal').style.display = 'flex';
}
function closeExploreModal() {
  document.getElementById('explore-modal').style.display = 'none';
}
function showBookingModal(roomType, price) {
  var modal = document.getElementById('booking-modal');
  var info = document.getElementById('booking-modal-info');
  if (info) {
    info.textContent = roomType && price ? ('You are booking: ' + roomType + ' (' + price + ')') : 'Book your room now!';
  }
  modal.style.display = 'flex';
}
function closeBookingModal() {
  document.getElementById('booking-modal').style.display = 'none';
}