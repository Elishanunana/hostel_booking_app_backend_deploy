import React, { useState, useEffect } from 'react';
import './style.css';

/**
 * Backend Integration Guide
 * 
 * Required API Endpoints:
 * 1. Authentication
 *    - POST /api/auth/login: { username, studentId }
 *    - POST /api/auth/register: { username, studentId, email }
 *  
 * 2. Rooms
 *    - GET /api/rooms: List all rooms with availability
 *    - GET /api/rooms/{id}: Get room details
 *    - GET /api/rooms/{id}/availability: Check real-time bedspace availability
 * 
 * 3. Bookings
 *    - POST /api/bookings: Create new booking
 *    - GET /api/bookings/user/{userId}: Get user's booking history
 *    - PUT /api/bookings/{id}: Update booking status
 * 
 * 4. Payments
 *    - POST /api/payments: Process payment
 *    - GET /api/payments/methods: List available payment methods
 * 
 * Data Structures:
 * 1. Room: {
 *    id: string
 *    name: string
 *    type: string
 *    floor: string
 *    price: number
 *    totalBedspaces: number
 *    availableBedspaces: number
 *    images: string[]
 *    desc: string
 * }
 * 
 * 2. Booking: {
 *    id: string
 *    userId: string
 *    roomId: string
 *    bedspace: number
 *    status: string
 *    paymentStatus: string
 *    academicYear: string
 *    price: number
 * }
 * 
 * Error Handling:
 * All API responses should include:
 * - success: boolean
 * - message: string
 * - data?: any
 */

function App() {
  // User state
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  
  // FAQ state
  const [activeFaq, setActiveFaq] = useState(null);
  // Booking history modal state
  const [showHistory, setShowHistory] = useState(false);
  // Room details modal state
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Sample booking history data
  const bookingHistory = [
    { room: '2 in 1 Room', year: '2024/2025', status: 'Confirmed', price: 10000 },
    { room: '3 in 1 Room', year: '2023/2024', status: 'Completed', price: 8500 },
  ];

  // Open booking history modal
  const openHistory = () => setShowHistory(true);
  const closeHistory = () => setShowHistory(false);

  // Open room details modal
  const openRoomDetails = (room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };
  const closeRoomDetails = () => setShowRoomDetails(false);
  // Room filter state
  const [roomType, setRoomType] = useState('');
  const [roomFloor, setRoomFloor] = useState('');
  const [roomPrice, setRoomPrice] = useState('');
  const [roomAvailability, setRoomAvailability] = useState('');
  const [roomSearch, setRoomSearch] = useState('');

  // Room data state and fetching
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch rooms data on component mount
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        // TODO: Integrate with backend API
        // Expected endpoint: GET /api/rooms
        // const response = await fetch('/api/rooms');
        // const data = await response.json();
        // if (!response.ok) throw new Error(data.message);
        
        // Mock data for now
        const mockRooms = [
          {
            name: '1 in 1 Room',
      type: '1in1',
      floor: 'first',
      price: 15000,
      availability: 'available',
      img: '/assets/opal_single.jpg',
      images: [
        '/assets/opal_single.jpg',
        'src/assets/Washroom.jpg',
        'src/assets/room 1.jpg',
        'src/assets/room 3.jpg'
      ],
      desc: 'Private room for one student. Maximum comfort and privacy for focused study.',
      totalBedspaces: 1,
      availableBedspaces: 1
    },
    {
      name: '2 in 1 Room',
      type: '2in1',
      floor: 'second',
      price: 10000,
      availability: 'available',
      img: '/assets/2 in 1.jpeg',
      images: [
        '/assets/2 in 1.jpeg',
        'src/assets/wash1.JPEG',
        'src/assets/room 3.jpg',
        'src/assets/balcony.JPEG'
      ],
      desc: 'Shared room for two students. Great for collaboration and making friends.',
      totalBedspaces: 2,
      availableBedspaces: 1
    },
    {
      name: '3 in 1 Room',
      type: '3in1',
      floor: 'third',
      price: 8500,
      availability: 'available',
      img: '/assets/3 in 1.jpeg',
      images: [
        'src/assets/room3.JPG',
        'src/assets/wash2.JPG',
        'src/assets/balcony.JPEG',
        'src/assets/room2.JPG'
      ],
      desc: 'Shared room for three students. Balanced privacy and affordability.',
      totalBedspaces: 3,
      availableBedspaces: 2
    },
    {
      name: '4 in 1 Room',
      type: '4in1',
      floor: 'fourth',
      price: 6500,
      availability: 'available',
      img: '/assets/4 in 1.jpg',
      images: [
        'src/assets/room44.JPG',
        'src/assets/Washroom.jpg',
        'src/assets/room4.JPG',
        'src/assets/balcony.JPEG'
      ],
      desc: 'Shared room for four students. Most affordable option for a vibrant student life.',
      totalBedspaces: 4,
      availableBedspaces: 3
    }
        ];
        setRooms(mockRooms);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  // Filtering logic
  const filteredRooms = rooms.filter(room => {
    return (
      (!roomType || room.type === roomType) &&
      (!roomFloor || room.floor === roomFloor) &&
      (!roomPrice || room.price >= parseInt(roomPrice)) &&
      (!roomAvailability || (roomAvailability === 'available' ? room.availableBedspaces > 0 : room.availableBedspaces === 0)) &&
      (!roomSearch || room.name.toLowerCase().includes(roomSearch.toLowerCase()))
    );
  });

  // Filter handlers
  const handleFilter = (e) => {
    e.preventDefault();
    // No-op, filters are live
  };
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('login');

  // Smooth scroll for nav links
  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open modal (for Book Now, Book Your Room, Login/Register)
  const openModal = (tab = 'login') => {
    setActiveTab(tab);
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => setShowModal(false);

  // Switch between login/register tabs
  const handleTabSwitch = (tab) => setActiveTab(tab);

  // Login/Register handlers
  const handleLogin = async (e) => {
    e.preventDefault();
    const username = document.getElementById('login-username').value;
    const studentId = document.getElementById('login-studentid').value;
    
    try {
      // TODO: Integrate with backend API
      // Expected endpoint: POST /api/auth/login
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ username, studentId })
      // });
      // const userData = await response.json();
      // if (!response.ok) throw new Error(userData.message);
      
      // Mock response for now
      const userData = {
        username,
        studentId,
        email: `${username}@example.com`,
        joinedDate: '2025-08-04',
        bookings: bookingHistory
      };

      setUser(userData);
      closeModal();
    } catch (err) {
      alert('Login failed: ' + err.message);
    }
  };
  
  const handleRegister = (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const studentId = document.getElementById('register-studentid').value;
    const email = document.getElementById('register-email').value;
    setUser({
      username,
      studentId,
      email,
      joinedDate: new Date().toISOString().split('T')[0],
      bookings: []
    });
    closeModal();
  };

  // User profile handlers
  const handleProfileClick = () => setShowProfile(true);
  const closeProfile = () => setShowProfile(false);
  
  const handleLogout = () => {
    setUser(null);
    setShowProfile(false);
  };

  // Payment selection state
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [roomForPayment, setRoomForPayment] = useState(null);

  // Book Now button handler
  const handleBookNow = (room) => {
    if (!room) {
      openModal('register');
      return;
    }
    setRoomForPayment(room);
    setShowPayment(true);
  };

  // Handle payment selection
  const handlePaymentSelect = (method) => {
    setSelectedPayment(method);
  };

  // Payment and booking states
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingStatus, setBookingStatus] = useState({ status: '', message: '' });

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    if (!selectedPayment) {
      setBookingStatus({
        status: 'error',
        message: 'Please select a payment method'
      });
      return;
    }

    if (!user) {
      setBookingStatus({
        status: 'error',
        message: 'Please log in to continue'
      });
      return;
    }

    setIsProcessing(true);
    try {
      // 1. Check availability
      const currentRoom = rooms.find(r => r.name === roomForPayment.name);
      if (!currentRoom || currentRoom.availableBedspaces === 0) {
        throw new Error('Sorry, this room is no longer available');
      }

      // TODO: Integrate with backend API
      // 2. Process payment
      // const paymentResponse = await fetch('/api/payments', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     roomId: roomForPayment.id,
      //     userId: user.id,
      //     amount: roomForPayment.price,
      //     method: selectedPayment
      //   })
      // });
      // if (!paymentResponse.ok) {
      //   const paymentError = await paymentResponse.json();
      //   throw new Error(paymentError.message);
      // }
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating payment processing
      
      // 2. Save booking to database and update bedspace count
      const updatedRoom = {
        ...currentRoom,
        availableBedspaces: currentRoom.availableBedspaces - 1,
        availability: currentRoom.availableBedspaces - 1 === 0 ? 'unavailable' : 'available'
      };

      // Update the rooms array
      setRooms(prevRooms => {
        return prevRooms.map(r => r.name === roomForPayment.name ? updatedRoom : r);
      });

      const bedspaceNumber = currentRoom.totalBedspaces - (currentRoom.availableBedspaces - 1);
      const bookingData = {
        roomId: roomForPayment.type,
        roomName: roomForPayment.name,
        price: roomForPayment.price,
        paymentMethod: selectedPayment,
        status: 'confirmed',
        bookingDate: new Date().toISOString(),
        academicYear: '2025/2026',
        bedspace: bedspaceNumber,
        totalBedspaces: currentRoom.totalBedspaces
      };
      
      // In a real app, you would make an API call to save the booking
      // await saveBookingToDatabase(bookingData);
      
      // 3. Send confirmation
      // In a real app, you would trigger email/SMS notifications here
      setBookingStatus({
        status: 'success',
        message: 'Booking confirmed! Check your email for details.'
      });

      // Update booking history
      const newBooking = {
        room: bookingData.roomName,
        year: bookingData.academicYear,
        status: 'Confirmed',
        price: bookingData.price,
        bedspace: `Bed ${bookingData.bedspace} of ${bookingData.totalBedspaces}`
      };
      
      // Update the user's booking history
      setUser(prevUser => ({
        ...prevUser,
        bookings: [newBooking, ...(prevUser.bookings || [])]
      }));

      // Close payment modal after 2 seconds
      setTimeout(() => {
        setShowPayment(false);
        setSelectedPayment('');
        setRoomForPayment(null);
        setBookingStatus({ status: '', message: '' });
      }, 2000);

    } catch (error) {
      setBookingStatus({
        status: 'error',
        message: 'Payment failed. Please try again.'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Explore/Discover More Modal state
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [moreInfoType, setMoreInfoType] = useState('');

  // Handler for Explore/Discover More buttons
  const handleMoreInfo = (type) => {
    setMoreInfoType(type);
    setShowMoreInfo(true);
  };

  const closeMoreInfo = () => setShowMoreInfo(false);

  return (
    <>
      {/* Header and Navigation */}
      <header className="header">
        <nav>
          <div className="nav__bar">
            <div className="logo">
              <a href="#" onClick={e => handleNavClick(e, 'home')}><img src="/assets/logo.png" alt="Twelve Hostel Logo" /></a>
            </div>
            <div className="nav__menu__btn" id="menu-btn">
              <i className="ri-menu-line"></i>
            </div>
          </div>
          <ul className="nav__links" id="nav-links">
            <li><a href="#home" onClick={e => handleNavClick(e, 'home')}>Home</a></li>
            <li><a href="#about" onClick={e => handleNavClick(e, 'about')}>About</a></li>
            <li><a href="#service" onClick={e => handleNavClick(e, 'service')}>Facilities</a></li>
            <li><a href="#contact" onClick={e => handleNavClick(e, 'contact')}>Contact</a></li>
          </ul>
          {user ? (
            <>
              <button className="btn nav__btn" onClick={handleProfileClick} style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <i className="ri-user-line"></i>
                {user.username}
              </button>
              <button className="btn nav__btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <button className="btn nav__btn" id="book-room-btn" type="button" onClick={() => openModal('register')}>Book Your Room</button>
              <button className="btn nav__btn" id="login-btn" type="button" onClick={() => openModal('login')}>Login / Register</button>
            </>
          )}
        </nav>
        <div className="section__container header__container" id="home">
          <p>Welcome to Twelve Hostel – Your Student Home</p>
          <h1>Book Your Room<br /><span>Twelve Hostel</span> Today!</h1>
        </div>
      </header>

      {/* Login/Registration Modal */}
      {showModal && (
        <div className="login-modal" style={{display:'flex',position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:1000,alignItems:'center',justifyContent:'center'}}>
          <div className="login-modal-content">
            <div style={{display:'flex',justifyContent:'center',marginBottom:'2rem'}}>
              <button
                className={`btn tab-btn${activeTab==='login' ? ' active' : ''}`}
                type="button"
                style={{flex:1,marginRight:'0.5rem',borderRadius:'8px 0 0 8px'}}
                onClick={() => handleTabSwitch('login')}
              >Login</button>
              <button
                className={`btn tab-btn${activeTab==='register' ? ' active' : ''}`}
                type="button"
                style={{flex:1,borderRadius:'0 8px 8px 0'}}
                onClick={() => handleTabSwitch('register')}
              >Register</button>
            </div>
            <form
              id="loginForm"
              style={{marginBottom:'1.5rem',display:activeTab==='login'?'block':'none',transition:'all 0.3s'}}
              onSubmit={handleLogin}
            >
              <h2 style={{marginBottom:'1.5rem',color:'#2d3748',fontWeight:600}}>Login to Your Account</h2>
              <input type="text" id="login-username" placeholder="Username or Email" style={{width:'92%',marginBottom:'1rem',padding:'0.75rem',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'1rem'}} required />
              <input type="text" id="login-studentid" placeholder="Student ID" style={{width:'92%',marginBottom:'1rem',padding:'0.75rem',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'1rem'}} required />
              <input type="password" id="login-password" placeholder="Password" style={{width:'92%',marginBottom:'1rem',padding:'0.75rem',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'1rem'}} required />
              <button className="btn" type="submit" style={{width:'92%',marginBottom:'0.5rem',background:'#2563eb',color:'#fff',fontWeight:500,fontSize:'1rem'}}>Login</button>
            </form>
            <form
              id="registerForm"
              style={{marginBottom:'1.5rem',display:activeTab==='register'?'block':'none',transition:'all 0.3s'}}
              onSubmit={handleRegister}
            >
              <h2 style={{marginBottom:'1.5rem',color:'#2d3748',fontWeight:600}}>Create a New Account</h2>
              <input type="text" id="register-username" placeholder="Username" style={{width:'92%',marginBottom:'1rem',padding:'0.75rem',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'1rem'}} required />
              <input type="text" id="register-studentid" placeholder="Student ID" style={{width:'92%',marginBottom:'1rem',padding:'0.75rem',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'1rem'}} required />
              <input type="email" id="register-email" placeholder="Email" style={{width:'92%',marginBottom:'1rem',padding:'0.75rem',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'1rem'}} required />
              <input type="password" id="register-password" placeholder="Password" style={{width:'92%',marginBottom:'1rem',padding:'0.75rem',borderRadius:'6px',border:'1px solid #e2e8f0',fontSize:'1rem'}} required />
              <button className="btn" type="submit" style={{width:'92%',background:'#059669',color:'#fff',fontWeight:500,fontSize:'1rem'}}>Register</button>
            </form>
            <button className="btn" style={{background:'#f3f4f6',color:'#333',marginTop:'1rem',borderRadius:'8px'}} onClick={closeModal}>Close</button>
          </div>
        </div>
      )}

      {/* Explore Section */}
      <section className="section__container explore__container" id="explore">
        <div className="explore__image">
          <img src="/assets/explore.jpg" alt="Explore Hostels" />
        </div>
        <div className="explore__content">
          <p className="section__subheader">EXPLORE TWELVE HOSTEL</p>
          <h2 className="section__header">A Vibrant Student Community</h2>
          <p className="section__description">
            Discover a lively environment where students from all backgrounds come together. Enjoy events, study groups, and a supportive network that makes your university experience unforgettable.
          </p>
          <div className="explore__btn">
            <button className="btn" type="button" onClick={() => handleMoreInfo('explore')}>Explore More</button>
          </div>
        </div>
      </section>

      {/* More Info Modal */}
      {showMoreInfo && (
        <div className="login-modal" style={{display:'flex',position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:1000,alignItems:'center',justifyContent:'center'}}>
          <div className="login-modal-content" style={{maxWidth:'600px',width:'100%'}}>
            <h2 style={{marginBottom:'1.5rem',color:'#2d3748',fontWeight:600}}>
              {moreInfoType === 'explore' ? 'Explore Twelve Hostel' : 'About Twelve Hostel'}
            </h2>
            {moreInfoType === 'explore' ? (
              <>
                <p style={{marginBottom:'1rem'}}>
                  Discover everything Twelve Hostel has to offer:
                </p>
                <ul style={{marginBottom:'1.5rem',paddingLeft:'1.2rem'}}>
                  <li style={{marginBottom:'0.5rem'}}>Strategic location near campus</li>
                  <li style={{marginBottom:'0.5rem'}}>24/7 security and CCTV surveillance</li>
                  <li style={{marginBottom:'0.5rem'}}>High-speed Wi-Fi throughout the building</li>
                  <li style={{marginBottom:'0.5rem'}}>Modern study areas and lounges</li>
                  <li style={{marginBottom:'0.5rem'}}>Regular community events and activities</li>
                  <li style={{marginBottom:'0.5rem'}}>Professional cleaning services</li>
                  <li style={{marginBottom:'0.5rem'}}>Dedicated student support team</li>
                </ul>
              </>
            ) : (
              <>
                <p style={{marginBottom:'1rem'}}>
                  Founded in 2020, Twelve Hostel has become the premier choice for student accommodation at KNUST:
                </p>
                <ul style={{marginBottom:'1.5rem',paddingLeft:'1.2rem'}}>
                  <li style={{marginBottom:'0.5rem'}}>Over 500 satisfied students housed annually</li>
                  <li style={{marginBottom:'0.5rem'}}>Award-winning student accommodation</li>
                  <li style={{marginBottom:'0.5rem'}}>Partnerships with KNUST and local businesses</li>
                  <li style={{marginBottom:'0.5rem'}}>Eco-friendly building and operations</li>
                  <li style={{marginBottom:'0.5rem'}}>Regular upgrades and maintenance</li>
                  <li style={{marginBottom:'0.5rem'}}>Strong focus on student community</li>
                </ul>
              </>
            )}
            <div style={{display:'flex',gap:'1rem',justifyContent:'flex-end'}}>
              <button className="btn" onClick={handleBookNow}>Book Now</button>
              <button className="btn" style={{background:'#f3f4f6',color:'#333'}} onClick={closeMoreInfo}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Section */}
            <section className="section__container testimonial__container" style={{
        background: 'linear-gradient(to bottom, #f8fafc, #ffffff)',
        borderRadius: '16px',
        padding: '4rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100%',
          background: 'url("/assets/about.jpg") center/cover',
          opacity: 0.05,
          zIndex: 0
        }}></div>
        
        <div style={{position: 'relative', zIndex: 1}}>
          <p className="section__subheader" style={{
            color: '#2563eb',
            fontWeight: 600,
            letterSpacing: '2px',
            marginBottom: '1rem'
          }}>STUDENT TESTIMONIALS</p>
          
          <h2 className="section__header" style={{
            fontSize: '2.5rem',
            marginBottom: '3rem',
            textAlign: 'center',
            color: '#1e293b'
          }}>What Our Residents Say</h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto'
          }}>
            {[
              {
                name: 'Ama K.',
                role: 'Level 200, Business Administration',
                image: 'src/assets/ama.PNG',
                text: 'Twelve Hostel made my first year at university so much easier. The staff are friendly, rooms are super comfortable, and the study areas are perfect for focused learning. The sense of community here is incredible!',
                rating: 5,
                highlight: 'Comfortable Living'
              },
              {
                name: 'Kwame B.',
                role: 'Level 300, Computer Science',
                image: 'src/assets/kwame.PNG',
                text: 'As a tech student, reliable internet is crucial. The Wi-Fi here is lightning fast, and the study lounges are perfect for group projects. Plus, the social events help maintain a great work-life balance.',
                rating: 5,
                highlight: 'Perfect for Studies'
              },
              {
                name: 'Linda O.',
                role: 'Level 100, Engineering',
                image: 'src/assets/linda.PNG',
                text: 'Coming from another city, I was worried about accommodation. Twelve Hostel exceeded my expectations with its security, cleanliness, and wonderful community. It truly feels like a home away from home!',
                rating: 5,
                highlight: 'Safe & Welcoming'
              }
            ].map((testimonial, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '2rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                transition: 'transform 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                ':hover': {
                  transform: 'translateY(-5px)'
                }
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '24px',
                  background: '#2563eb',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '16px',
                  fontSize: '0.875rem',
                  fontWeight: 500
                }}>
                  {testimonial.highlight}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '1.5rem',
                  marginTop: '1rem'
                }}>
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid #2563eb'
                    }}
                  />
                  <div style={{marginLeft: '1rem'}}>
                    <h4 style={{
                      color: '#1e293b',
                      fontSize: '1.125rem',
                      fontWeight: 600,
                      marginBottom: '0.25rem'
                    }}>{testimonial.name}</h4>
                    <span style={{
                      color: '#64748b',
                      fontSize: '0.875rem'
                    }}>{testimonial.role}</span>
                  </div>
                </div>

                <p style={{
                  color: '#475569',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  fontSize: '1rem',
                  fontStyle: 'italic'
                }}>"{testimonial.text}"</p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    color: '#eab308',
                    letterSpacing: '1px'
                  }}>
                    {'★'.repeat(testimonial.rating)}
                  </div>
                  <div style={{
                    color: '#64748b',
                    fontSize: '0.875rem'
                  }}>
                    Verified Resident
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '3rem'
          }}>
            <button 
              className="btn"
              onClick={() => openModal('register')}
              style={{
                background: '#2563eb',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '8px',
                fontSize: '1.125rem',
                fontWeight: 500,
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)'
              }}
            >
              Join Our Community
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section__container faq__container">
        <p className="section__subheader">FREQUENTLY ASKED QUESTIONS</p>
        <h2 className="section__header">FAQs</h2>
        <div className="faq__list">
          {[
            {
              question: "How do I book a room?",
              answer: `Simply click the "Book Your Room" button at the top of the page and follow these steps:
                \n1. Create an account or log in
                \n2. Select your preferred room type
                \n3. Fill out the booking form
                \n4. Submit your application
                \nOur team will review and confirm your reservation within 24 hours.`
            },
            {
              question: "What documents do I need?",
              answer: `To complete your booking, please prepare:
                \n• Valid student ID
                \n• University admission letter
                \n• Recent passport-sized photograph
                \n• Proof of payment
                \nAll documents can be uploaded digitally during the booking process.`
            },
            {
              question: "Are visitors allowed?",
              answer: `Yes, we allow visitors during these hours:
                \n• Weekdays: 10:00 AM - 8:00 PM
                \n• Weekends: 10:00 AM - 10:00 PM
                \nAll visitors must sign in at the security desk and follow hostel guidelines.
                \nOvernight guests are not permitted for security reasons.`
            },
            {
              question: "Is there 24/7 security?",
              answer: `Yes, we maintain comprehensive security measures:
                \n• 24/7 security personnel
                \n• CCTV surveillance throughout the premises
                \n• Electronic access cards for all entrances
                \n• Emergency response system
                \n• Regular security patrols`
            },
            {
              question: "What amenities are included?",
              answer: `Your room fee includes access to:
                \n• High-speed Wi-Fi
                \n• Study lounges on each floor
                \n• Fully equipped kitchen facilities
                \n• Laundry room
                \n• Common room with TV
                \n• Bicycle storage
                \n• Regular cleaning service`
            }
          ].map((faq, index) => (
            <div 
              key={index}
              className={`faq__item ${activeFaq === index ? 'active' : ''}`}
              onClick={() => setActiveFaq(activeFaq === index ? null : index)}
            >
              <h4>{faq.question}</h4>
              <p style={{ whiteSpace: 'pre-line' }}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

    
      {/* About Section */}
      <section className="section__container about__container" id="about">
        <div className="about__image">
          <img src="/assets/about.jpg" alt="About Twelve Hostel" />
        </div>
        <div className="about__content">
          <p className="section__subheader">ABOUT TWELVE HOSTEL</p>
          <h2 className="section__header">Student Living Made Simple</h2>
          <p className="section__description">
            Twelve Hostel is dedicated to providing students with a safe, affordable, and vibrant living experience right on campus. Choose from a range of room options, enjoy modern facilities, and become part of a welcoming student community. Your comfort and success are our priority!
          </p>
          <div className="about__btn">
            <button className="btn" id="discover-more-btn" type="button" onClick={() => handleMoreInfo('about')}>Discover More</button>
          </div>
        </div>
      </section>

      {/* Rooms Section */}
      <section className="section__container room__container">
        <p className="section__subheader">ROOMS AT TWELVE HOSTEL</p>
        <h2 className="section__header">Find Your Ideal Student Room</h2>
        {/* Professional Filter Bar */}
        <form className="room__filter__bar" onSubmit={handleFilter} style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
          <select className="filter-select" value={roomType} onChange={e => setRoomType(e.target.value)}>
            <option value="">All Types</option>
            <option value="1in1">1 in 1</option>
            <option value="2in1">2 in 1</option>
            <option value="3in1">3 in 1</option>
            <option value="4in1">4 in 1</option>
          </select>
          <select className="filter-select" value={roomFloor} onChange={e => setRoomFloor(e.target.value)}>
            <option value="">All Floors</option>
            <option value="basement">Basement</option>
            <option value="ground">Ground</option>
            <option value="first">First</option>
            <option value="second">Second</option>
            <option value="third">Third</option>
            <option value="fourth">Fourth</option>
            <option value="fifth">Fifth</option>
          </select>
          <select className="filter-select" value={roomPrice} onChange={e => setRoomPrice(e.target.value)}>
            <option value="">All Prices</option>
            <option value="15000">₵15,000+</option>
            <option value="10000">₵10,000+</option>
            <option value="8500">₵8,500+</option>
            <option value="6500">₵6,500+</option>
          </select>
          <select className="filter-select" value={roomAvailability} onChange={e => setRoomAvailability(e.target.value)}>
            <option value="">All</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
          </select>
          <input
            type="text"
            className="filter-search"
            placeholder="Search Room Name"
            aria-label="Search Room Name"
            value={roomSearch}
            onChange={e => setRoomSearch(e.target.value)}
          />
          <button className="btn" type="submit">Filter</button>
        </form>
        {/* Room Cards */}
        <div className="room__grid" id="room-grid">
          {loading ? (
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:'2rem'}}>Loading rooms...</div>
          ) : error ? (
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:'2rem',color:'#ef4444'}}>{error}</div>
          ) : filteredRooms.length === 0 ? (
            <div style={{gridColumn:'1/-1',textAlign:'center',padding:'2rem',color:'#888'}}>No rooms found matching your criteria.</div>
          ) : (
            filteredRooms.map(room => (
              <div className="room__card" key={room.name}>
                <div className="room__card__image">
                  <img src={room.img} alt={room.name} />
                  <div className="room__card__icons">
                    {room.type === '1in1' && <span><i className="ri-user-fill"></i></span>}
                    {room.type !== '1in1' && <span><i className="ri-group-fill"></i></span>}
                    <span><i className="ri-book-fill"></i></span>
                    <span><i className="ri-shield-star-line"></i></span>
                  </div>
                </div>
                <div className="room__card__details">
                  <h4>{room.name}</h4>
                  <p>{room.desc}</p>
                  <h5>₵{room.price.toLocaleString()}/year</h5>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    margin: '0.5rem 0',
                    padding: '0.5rem',
                    borderRadius: '4px',
                    background: room.availableBedspaces > 0 ? '#dcfce7' : '#fee2e2',
                    color: room.availableBedspaces > 0 ? '#166534' : '#991b1b',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                  }}>
                    <span>{room.availableBedspaces} of {room.totalBedspaces} bedspaces available</span>
                  </div>
                  <button 
                    className="btn" 
                    onClick={() => handleBookNow(room)}
                    disabled={room.availableBedspaces === 0}
                    style={{
                      opacity: room.availableBedspaces === 0 ? 0.6 : 1,
                      cursor: room.availableBedspaces === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {room.availableBedspaces > 0 ? 'Book Now' : 'Fully Occupied'}
                  </button>
                  <button className="btn room-details-btn" aria-label={`View Details for ${room.name}`} onClick={() => openRoomDetails(room)}>View Details</button>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Booking History Button */}
        <div style={{textAlign:'right',marginTop:'1.5rem'}}>
          <button className="btn" id="booking-history-btn" type="button" onClick={openHistory}>View Booking History</button>
        </div>
      </section>

      {/* Booking History Modal */}
      {showHistory && (
        <div className="login-modal" style={{display:'flex',position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:1000,alignItems:'center',justifyContent:'center'}}>
          <div className="login-modal-content" style={{maxWidth:'420px',width:'100%'}}>
            <h2 style={{marginBottom:'1.5rem',color:'#2d3748',fontWeight:600}}>Booking History</h2>
            <table style={{width:'100%',marginBottom:'1rem',borderCollapse:'collapse'}}>
              <thead>
                <tr style={{background:'#f3f4f6'}}>
                  <th style={{padding:'0.5rem',textAlign:'left'}}>Room</th>
                  <th style={{padding:'0.5rem',textAlign:'left'}}>Bedspace</th>
                  <th style={{padding:'0.5rem',textAlign:'left'}}>Year</th>
                  <th style={{padding:'0.5rem',textAlign:'left'}}>Status</th>
                  <th style={{padding:'0.5rem',textAlign:'left'}}>Price</th>
                </tr>
              </thead>
              <tbody>
                {user?.bookings.map((b, i) => (
                  <tr key={i}>
                    <td style={{padding:'0.5rem'}}>{b.room}</td>
                    <td style={{padding:'0.5rem'}}>{b.bedspace || 'N/A'}</td>
                    <td style={{padding:'0.5rem'}}>{b.year}</td>
                    <td style={{padding:'0.5rem'}}>{b.status}</td>
                    <td style={{padding:'0.5rem'}}>₵{b.price.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="btn" style={{background:'#f3f4f6',color:'#333',marginTop:'1rem',borderRadius:'8px'}} onClick={closeHistory}>Close</button>
          </div>
        </div>
      )}

      {/* Room Details Modal */}
      {showRoomDetails && selectedRoom && (
        <div className="login-modal" style={{display:'flex',position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:1000,alignItems:'center',justifyContent:'center'}}>
          <div className="login-modal-content" style={{maxWidth:'1000px',width:'100%',maxHeight:'90vh',overflowY:'auto',padding:'2rem'}}>
            {/* Image Gallery */}
            <div style={{marginBottom:'2rem'}}>
              <div style={{
                position:'relative',
                width:'100%',
                paddingBottom:'50%',
                borderRadius:'12px',
                overflow:'hidden',
                backgroundColor:'#f8fafc',
                marginBottom:'1rem'
              }}>
                <img
                  src={selectedRoom.img}
                  alt={selectedRoom.name}
                  style={{
                    position:'absolute',
                    top:0,
                    left:0,
                    width:'100%',
                    height:'100%',
                    objectFit:'contain'
                  }}
                />
              </div>
              <div style={{
                display:'grid',
                gridTemplateColumns:'repeat(auto-fit, minmax(150px, 1fr))',
                gap:'1rem',
                padding:'0.5rem'
              }}>
                {selectedRoom.images?.map((img, index) => (
                  <div
                    key={index}
                    style={{
                      position:'relative',
                      paddingBottom:'75%',
                      borderRadius:'8px',
                      overflow:'hidden',
                      cursor:'pointer',
                      border: selectedRoom.img === img ? '3px solid #2563eb' : '3px solid transparent'
                    }}
                    onClick={() => setSelectedRoom({...selectedRoom, img})}
                  >
                    <img
                      src={img}
                      alt={`${selectedRoom.name} view ${index + 1}`}
                      style={{
                        position:'absolute',
                        top:0,
                        left:0,
                        width:'100%',
                        height:'100%',
                        objectFit:'cover'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Room Info */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem'}}>
              <div>
                <h2 style={{marginBottom:'0.5rem',color:'#2d3748',fontWeight:600}}>{selectedRoom.name}</h2>
                <p style={{marginBottom:'1rem'}}>{selectedRoom.desc}</p>
                <ul style={{marginBottom:'1rem',paddingLeft:'1.2rem'}}>
                  <li><strong>Floor:</strong> {selectedRoom.floor.charAt(0).toUpperCase() + selectedRoom.floor.slice(1)}</li>
                  <li><strong>Price:</strong> ₵{selectedRoom.price.toLocaleString()}/year</li>
                  <li><strong>Availability:</strong> {selectedRoom.availability.charAt(0).toUpperCase() + selectedRoom.availability.slice(1)}</li>
                </ul>
              </div>

              {/* Bedspace Availability Section */}
              <div>
                <h3 style={{marginBottom:'1rem',color:'#2d3748'}}>Bedspace Availability</h3>
                <div style={{
                  display:'flex',
                  flexDirection:'column',
                  gap:'1rem',
                  padding:'1rem',
                  background:'#f8fafc',
                  borderRadius:'8px',
                  marginBottom:'1rem'
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontWeight:'500'}}>Total Bedspaces:</span>
                    <span style={{
                      background:'#e5e7eb',
                      padding:'0.5rem 1rem',
                      borderRadius:'4px',
                      fontWeight:'600'
                    }}>{selectedRoom.totalBedspaces}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontWeight:'500'}}>Available Bedspaces:</span>
                    <span style={{
                      background: selectedRoom.availableBedspaces > 0 ? '#dcfce7' : '#fee2e2',
                      padding:'0.5rem 1rem',
                      borderRadius:'4px',
                      fontWeight:'600',
                      color: selectedRoom.availableBedspaces > 0 ? '#166534' : '#991b1b'
                    }}>{selectedRoom.availableBedspaces}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <span style={{fontWeight:'500'}}>Occupied Bedspaces:</span>
                    <span style={{
                      background:'#e5e7eb',
                      padding:'0.5rem 1rem',
                      borderRadius:'4px',
                      fontWeight:'600'
                    }}>{selectedRoom.totalBedspaces - selectedRoom.availableBedspaces}</span>
                  </div>
                </div>
                
                <div style={{
                  padding:'1rem',
                  background: selectedRoom.availableBedspaces > 0 ? '#dcfce7' : '#fee2e2',
                  borderRadius:'8px',
                  textAlign:'center',
                  color: selectedRoom.availableBedspaces > 0 ? '#166534' : '#991b1b',
                  fontWeight:'500'
                }}>
                  {selectedRoom.availableBedspaces > 0 
                    ? `${selectedRoom.availableBedspaces} ${selectedRoom.availableBedspaces === 1 ? 'bedspace' : 'bedspaces'} available for booking!`
                    : 'Currently fully occupied'
                  }
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{display:'flex',gap:'1rem',marginTop:'2rem'}}>
              <button className="btn" onClick={() => handleBookNow(selectedRoom)} style={{flex:1}}>Book Now</button>
              <button className="btn" style={{flex:1,background:'#f3f4f6',color:'#333'}} onClick={closeRoomDetails}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Facilities / Service Section */}
      <section className="service" id="service">
        <div className="section__container service__container">
          <div className="service__content">
            <p className="section__subheader">EXPERIENCE LUXURY LIVING</p>
            <h2 className="section__header">State-of-the-Art Student Facilities</h2>
            <p className="section__description" style={{textAlign: 'center', maxWidth: '800px', margin: '0 auto 3rem'}}>
              Discover a perfect blend of comfort, convenience, and modern amenities designed to enhance your university experience. Our facilities are carefully curated to support both your academic success and personal well-being.
            </p>
            <div className="service__grid">
              <div className="service__item">
                <div className="service__icon">
                  <i className="ri-shield-star-line"></i>
                </div>
                <div className="service__details">
                  <h3>Advanced Security</h3>
                  <p>Experience peace of mind with our comprehensive security system featuring 24/7 CCTV surveillance, biometric access, and professional security staff.</p>
                </div>
              </div>
              <div className="service__item">
                <div className="service__icon">
                  <i className="ri-wifi-line"></i>
                </div>
                <div className="service__details">
                  <h3>Lightning-Fast WiFi</h3>
                  <p>Stay connected with our premium fiber-optic network, offering dedicated high-speed bandwidth to every room for seamless online learning.</p>
                </div>
              </div>
              <div className="service__item">
                <div className="service__icon">
                  <i className="ri-book-2-line"></i>
                </div>
                <div className="service__details">
                  <h3>Learning Spaces</h3>
                  <p>Focus on your studies in our purpose-built quiet zones, collaborative study pods, and fully-equipped 24-hour library facility.</p>
                </div>
              </div>
              <div className="service__item">
                <div className="service__icon">
                  <i className="ri-restaurant-line"></i>
                </div>
                <div className="service__details">
                  <h3>Gourmet Dining</h3>
                  <p>Enjoy diverse culinary options in our modern cafeteria, featuring fresh, nutritious meals and comfortable social dining spaces.</p>
                </div>
              </div>
              <div className="service__item">
                <div className="service__icon">
                  <i className="ri-t-shirt-line"></i>
                </div>
                <div className="service__details">
                  <h3>Smart Laundry</h3>
                  <p>Take advantage of our automated laundry system with app-controlled machines, real-time availability updates, and 24/7 access.</p>
                </div>
              </div>
              <div className="service__item">
                <div className="service__icon">
                  <i className="ri-football-line"></i>
                </div>
                <div className="service__details">
                  <h3>Active Lifestyle</h3>
                  <p>Maintain your fitness goals with our state-of-the-art gym, multipurpose sports court, and dedicated recreation areas.</p>
                </div>
              </div>
            </div>
            <div style={{textAlign: 'center', marginTop: '3rem'}}>
              <button className="btn" onClick={() => handleMoreInfo('explore')} style={{
                padding: '1rem 2rem',
                fontSize: '1.1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease'
              }}>Explore All Amenities</button>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPayment && roomForPayment && (
        <div className="login-modal" style={{display:'flex',position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:1000,alignItems:'center',justifyContent:'center'}}>
          <div className="login-modal-content" style={{maxWidth:'360px',width:'100%',padding:'1.5rem'}}>
            <h2 style={{marginBottom:'1rem',color:'#2d3748',fontWeight:600}}>Mobile Money Payment</h2>
            
            {bookingStatus.status ? (
              <div style={{
                padding:'1rem',
                borderRadius:'8px',
                marginBottom:'1.5rem',
                background: bookingStatus.status === 'success' ? '#f0fdf4' : '#fef2f2',
                border: `1px solid ${bookingStatus.status === 'success' ? '#86efac' : '#fecaca'}`,
                color: bookingStatus.status === 'success' ? '#166534' : '#991b1b'
              }}>
                <p style={{fontSize:'0.9rem',textAlign:'center'}}>{bookingStatus.message}</p>
              </div>
            ) : (
              <>
                <div style={{marginBottom:'1.5rem',padding:'1rem',background:'#f8fafc',borderRadius:'8px',border:'1px solid #e2e8f0'}}>
                  <p style={{marginBottom:'0.5rem'}}><strong>{roomForPayment.name}</strong></p>
                  <p style={{marginBottom:'1rem',color:'#2563eb',fontSize:'1.25rem',fontWeight:600}}>₵{roomForPayment.price.toLocaleString()}</p>
                  
                  <div style={{display:'grid',gap:'0.5rem'}}>
                    {[
                      { value: 'mtn', label: 'MTN MoMo' },
                      { value: 'vodafone', label: 'Vodafone Cash' },
                      { value: 'airteltigo', label: 'AirtelTigo Money' }
                    ].map(provider => (
                      <label key={provider.value} style={{
                        padding:'0.5rem',
                        border:'1px solid #e2e8f0',
                        borderRadius:'6px',
                        cursor: isProcessing ? 'not-allowed' : 'pointer',
                        display:'flex',
                        alignItems:'center',
                        gap:'0.5rem',
                        background: selectedPayment === provider.value ? '#eff6ff' : '#fff',
                        opacity: isProcessing ? 0.7 : 1
                      }}>
                        <input
                          type="radio"
                          name="momoProvider"
                          value={provider.value}
                          checked={selectedPayment === provider.value}
                          onChange={() => handlePaymentSelect(provider.value)}
                          disabled={isProcessing}
                        />
                        <span>{provider.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <button 
                    className="btn" 
                    style={{
                      flex:1,
                      background:'#f3f4f6',
                      color:'#333',
                      cursor: isProcessing ? 'not-allowed' : 'pointer',
                      opacity: isProcessing ? 0.7 : 1
                    }} 
                    onClick={() => {
                      if (!isProcessing) {
                        setShowPayment(false);
                        setSelectedPayment('');
                        setRoomForPayment(null);
                      }
                    }}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn" 
                    style={{
                      flex:1,
                      background: isProcessing ? '#94a3b8' : (selectedPayment ? '#2563eb' : '#94a3b8'),
                      cursor: isProcessing || !selectedPayment ? 'not-allowed' : 'pointer'
                    }}
                    onClick={handlePaymentSubmit}
                    disabled={isProcessing || !selectedPayment}
                  >
                    {isProcessing ? 'Processing...' : 'Pay Now'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      {showProfile && user && (
        <div className="login-modal" style={{display:'flex',position:'fixed',top:0,left:0,width:'100vw',height:'100vh',background:'rgba(0,0,0,0.5)',zIndex:1000,alignItems:'center',justifyContent:'center'}}>
          <div className="login-modal-content" style={{maxWidth:'600px',width:'100%'}}>
            <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'2rem'}}>
              <div style={{
                width:'64px',
                height:'64px',
                borderRadius:'50%',
                background:'#e2e8f0',
                display:'flex',
                alignItems:'center',
                justifyContent:'center',
                fontSize:'1.5rem'
              }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{color:'#2d3748',fontWeight:600}}>{user.username}</h2>
                <p style={{color:'#64748b'}}>Student ID: {user.studentId}</p>
              </div>
            </div>

            <div style={{marginBottom:'2rem'}}>
              <h3 style={{marginBottom:'1rem',color:'#2d3748'}}>Personal Information</h3>
              <div style={{display:'grid',gap:'1rem'}}>
                <div>
                  <label style={{display:'block',marginBottom:'0.25rem',color:'#64748b'}}>Email</label>
                  <input type="email" value={user.email} readOnly style={{
                    width:'100%',
                    padding:'0.75rem',
                    borderRadius:'6px',
                    border:'1px solid #e2e8f0',
                    background:'#f8fafc'
                  }} />
                </div>
                <div>
                  <label style={{display:'block',marginBottom:'0.25rem',color:'#64748b'}}>Member Since</label>
                  <input type="text" value={user.joinedDate} readOnly style={{
                    width:'100%',
                    padding:'0.75rem',
                    borderRadius:'6px',
                    border:'1px solid #e2e8f0',
                    background:'#f8fafc'
                  }} />
                </div>
              </div>
            </div>

            <div style={{marginBottom:'2rem'}}>
              <h3 style={{marginBottom:'1rem',color:'#2d3748'}}>Your Bookings</h3>
              <div style={{maxHeight:'300px',overflowY:'auto'}}>
                {user.bookings.length === 0 ? (
                  <p style={{textAlign:'center',color:'#64748b',padding:'2rem'}}>No bookings yet</p>
                ) : (
                  <table style={{width:'100%',borderCollapse:'collapse'}}>
                    <thead>
                      <tr style={{background:'#f8fafc'}}>
                        <th style={{padding:'0.75rem',textAlign:'left'}}>Room</th>
                        <th style={{padding:'0.75rem',textAlign:'left'}}>Year</th>
                        <th style={{padding:'0.75rem',textAlign:'left'}}>Status</th>
                        <th style={{padding:'0.75rem',textAlign:'left'}}>Price</th>
                        <th style={{padding:'0.75rem',textAlign:'left'}}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.bookings.map((booking, index) => (
                        <tr key={index} style={{borderBottom:'1px solid #e2e8f0'}}>
                          <td style={{padding:'0.75rem'}}>{booking.room}</td>
                          <td style={{padding:'0.75rem'}}>{booking.year}</td>
                          <td style={{padding:'0.75rem'}}>
                            <span style={{
                              padding:'0.25rem 0.5rem',
                              borderRadius:'9999px',
                              fontSize:'0.875rem',
                              background: booking.status === 'Confirmed' ? '#dcfce7' : '#f8fafc',
                              color: booking.status === 'Confirmed' ? '#166534' : '#64748b'
                            }}>
                              {booking.status}
                            </span>
                          </td>
                          <td style={{padding:'0.75rem'}}>₵{booking.price.toLocaleString()}</td>
                          <td style={{padding:'0.75rem'}}>
                            {booking.status === 'Confirmed' && (
                              <button
                                onClick={() => {
                                  const updatedBookings = [...user.bookings];
                                  updatedBookings[index] = {...booking, status: 'Cancelled'};
                                  setUser({...user, bookings: updatedBookings});
                                }}
                                style={{
                                  padding:'0.25rem 0.5rem',
                                  borderRadius:'4px',
                                  border:'none',
                                  background:'#fee2e2',
                                  color:'#991b1b',
                                  cursor:'pointer'
                                }}
                              >
                                Cancel
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div style={{display:'flex',justifyContent:'flex-end',gap:'1rem'}}>
              <button className="btn" style={{background:'#f3f4f6',color:'#333'}} onClick={closeProfile}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="footer" id="contact">
        <div className="section__container footer__container">
          <div className="footer__col">
            <div className="logo">
              <a href="#home" onClick={e => handleNavClick(e, 'home')}><img src="/assets/logo.png" alt="Twelve Hostel Logo" /></a>
            </div>
            <p className="section__description">
              At Twelve Hostel, we help students find the perfect room for their campus journey. Enjoy comfort, security, and a vibrant student life – all in one place!
            </p>
          </div>
          <div className="footer__col">
            <h4>QUICK LINKS</h4>
            <ul className="footer__links">
              <li><a href="#" onClick={e => handleNavClick(e, 'home')}>Book a Room</a></li>
              <li><a href="#" onClick={e => handleNavClick(e, 'room-grid')}>Room Types & Fees</a></li>
              <li><a href="#" onClick={e => handleNavClick(e, 'service')}>Facilities</a></li>
              <li><a href="#" onClick={e => handleNavClick(e, 'faq')}>FAQs</a></li>
              <li><a href="#" onClick={e => handleNavClick(e, 'contact')}>Student Support</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>OUR FACILITIES</h4>
            <ul className="footer__links">
              <li><a href="#" onClick={e => handleNavClick(e, 'service')}>Wi-Fi & Study Areas</a></li>
              <li><a href="#" onClick={e => handleNavClick(e, 'service')}>Laundry Services</a></li>
              <li><a href="#" onClick={e => handleNavClick(e, 'service')}>Cafeteria</a></li>
              <li><a href="#" onClick={e => handleNavClick(e, 'service')}>Security & CCTV</a></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>CONTACT US</h4>
            <ul className="footer__links">
              <li><a href="mailto:contact@twelvehostel.com">contact@twelvehostel.com</a></li>
            </ul>
            <div className="footer__socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><img src="/assets/facebook.png" alt="facebook" /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><img src="/assets/instagram.png" alt="instagram" /></a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><img src="/assets/youtube.png" alt="youtube" /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><img src="/assets/twitter.png" alt="twitter" /></a>
            </div>
          </div>
        </div>
        <div className="footer__bar">
          Copyright © 2025 Twelve Hostel. All rights reserved.
        </div>
      </footer>
    </>
  );   
}
export default App;
