import { useState, useEffect, useMemo, useRef } from 'react'
import { submitLead } from './leadService'

function App() {
  const [showPopup, setShowPopup] = useState(false)
  const [selectedProject, setSelectedProject] = useState('All Projects')
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [heroIndex, setHeroIndex] = useState(0)
  const [activeProjectTab, setActiveProjectTab] = useState('ss_garden') // 'ss_garden' | 'royal_meadows' | 'pkn_arcade'
  const [projectFilter, setProjectFilter] = useState('all') // 'all' | 'offer' | 'ready'
  const [galleryCategory, setGalleryCategory] = useState('all')
  const progressBarRef = useRef(null)
  const [activeVideoId, setActiveVideoId] = useState(null)
  const [floorPlanTab, setFloorPlanTab] = useState('ss_garden_2bhk')
  const [activeFaq, setActiveFaq] = useState(0)
  const [lightboxImage, setLightboxImage] = useState(null)

  // EMI Calculator State (configured for 90% Bank Loan with 10% Down Payment)
  const [emiPrice, setEmiPrice] = useState(3200000) // ₹32 Lakhs (S.S Garden 2 BHK)
  const [downPaymentPercent, setDownPaymentPercent] = useState(10) // 10% down payment = 90% loan
  const [loanTenureYears, setLoanTenureYears] = useState(20) // 20 years
  const [interestRate, setInterestRate] = useState(8.5) // 8.5%

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: '',
    project: 'KPM S.S Garden (Mettupalayam - Annur NH)'
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  // 3 Coimbatore Flagship Projects Data
  const coimbatoreProjects = [
    {
      id: 'ss_garden',
      name: 'KPM S.S Garden',
      tagline: 'DTCP Approved Plots & 2 BHK Villas on Highway',
      location: 'Kumarankundru, Mettupalayam - Annur NH (15 Mins from Mettupalayam)',
      areaTag: 'Mettupalayam - Annur NH',
      type: 'Plots & 2 BHK Villas',
      category: 'plots_villas',
      badge: 'Diwali Special Offer',
      badgeColor: 'gold',
      price: '₹4.99 Lakhs*',
      priceUnit: 'Per Cent (Plots) • 2 BHK @ ₹32L',
      sqft: 'Plots from 1 Cent+ • 2 BHK Villas (850 - 1,200 Sq.Ft)',
      config: 'Plots & 2 BHK Villas',
      status: 'Booking Open • 100+ Homes Community',
      statusType: 'launch',
      possession: 'Immediate Handover',
      rera: 'DTCP Approved Layout',
      image: '/assets/project_ss_garden.jpg',
      shortDesc: 'Prime DTCP approved township situated on Mettupalayam-Annur NH at Kumarankundru (15 mins from Mettupalayam). Exclusive Diwali Offer: Plots at ₹4.99L/cent (was ₹5.75L) and 2 BHK villas at ₹32L with 90% bank loan, FREE registration cost, and FREE gold coin on spot booking!',
      fullDesc: 'KPM S.S Garden is a premier DTCP approved residential township situated amidst 100+ established homes (100+ குடியிருப்புகளுக்கு மத்தியில்) on the Mettupalayam - Annur National Highway. Benefit from rapid NH connectivity, sweet drinking water, blacktop roads, street lighting, and up to 90% bank loan sanction.',
      highlights: [
        'Diwali Offer: Plots @ ₹4.99 Lakhs / Cent (Reduced from ₹5.75L)',
        'Independent 2 BHK Modern Villas @ ₹32 Lakhs',
        'Up to 90% Bank Loan Approved with Fast-Track Sanction',
        'REGISTRATION COST FREE on Booking',
        'FREE Gold Coin on Spot Booking',
        '100+ குடியிருப்புகளுக்கு மத்தியில் (Vibrant Residential Enclave)',
        '15 Mins to Mettupalayam with Direct NH Highway Access'
      ],
      stats: [
        { label: 'Plots / Cent', value: '₹4.99 L (Offer)' },
        { label: '2 BHK Villa', value: '₹32 Lakhs' },
        { label: 'Bank Loan', value: '90% Sanction' },
        { label: 'Approval', value: '100% DTCP' }
      ]
    },
    {
      id: 'royal_meadows',
      name: 'KPM Royal Meadows',
      tagline: 'Affordable Gated Plots & Independent 1 & 2 BHK Villas',
      location: 'Near Annur, Coimbatore',
      areaTag: 'Near Annur, Coimbatore',
      type: 'Plots & Villas',
      category: 'plots_villas',
      badge: 'Best Value • Budget Friendly',
      badgeColor: 'green',
      price: '₹3.29 Lakhs*',
      priceUnit: 'Per Cent (Plots) • Villas from ₹20L',
      sqft: 'Plots 1.5 - 6 Cents • Villas 650 - 1,150 Sq.Ft',
      config: 'Plots, 1 BHK (₹20L) & 2 BHK (₹25L)',
      status: 'Plots & Custom Villas Available',
      statusType: 'active',
      possession: 'Immediate Registration',
      rera: 'DTCP Approved Layout',
      image: '/assets/project_royal_meadows.jpg',
      shortDesc: 'Scenic gated community near Annur offering Coimbatore’s most affordable DTCP approved residential plots at just ₹3.29L per cent, 1 BHK individual villas at ₹20 Lakhs, and 2 BHK villas at ₹25 Lakhs with 90% bank loan facility.',
      fullDesc: 'KPM Royal Meadows near Annur brings your dream home into reality at budget-friendly pricing. Independent 1 & 2 BHK modern villas and spacious residential plots nestled in a peaceful, pollution-free green setting with 90% bank loan support from top nationalized banks.',
      highlights: [
        'Residential Plots starting at just ₹3.29 Lakhs / Cent',
        '1 BHK Independent Villas at ₹20 Lakhs',
        '2 BHK Independent Villas at ₹25 Lakhs',
        'Up to 90% Bank Loan Facility with Easy Monthly EMI Options',
        '100% DTCP Approved with Crystal Clear Legal Titles & Patta',
        '30ft & 40ft Wide Internal Roads, Solar Street Lights & Water Supply',
        'Minutes to Annur Town, Bus Stand, Schools & Weekly Markets'
      ],
      stats: [
        { label: 'Plots / Cent', value: '₹3.29 Lakhs' },
        { label: '1 BHK Villa', value: '₹20 Lakhs' },
        { label: '2 BHK Villa', value: '₹25 Lakhs' },
        { label: 'Bank Loan', value: '90% Sanction' }
      ]
    },
    {
      id: 'pkn_arcade',
      name: 'KPM PKN Arcade',
      tagline: 'Prime Road-Facing Plots & Ready to Move 2 BHK Villas',
      location: 'Kovilpalayam to Karuvalur Road, Coimbatore',
      areaTag: 'Kovilpalayam - Karuvalur Rd',
      type: 'Plots Sale & Ready Villas',
      category: 'plots_villas',
      badge: 'Ready to Move',
      badgeColor: 'blue',
      price: '₹6.29 Lakhs*',
      priceUnit: 'Per Cent (Plots) • 2 BHK @ ₹41L',
      sqft: 'Plots 2 - 8 Cents • Villas 1,100 - 1,450 Sq.Ft',
      config: 'Plots & Ready to Move 2 BHK Villas',
      status: 'Ready to Move In • Instant Handover',
      statusType: 'ready',
      possession: 'Immediate Handover / Ready to Occupy',
      rera: 'DTCP Approved Layout',
      image: '/assets/project_pkn_arcade.jpg',
      shortDesc: 'Strategically situated on Kovilpalayam to Karuvalur main road. Featuring ready-to-move 2 BHK luxury independent villas at ₹41 Lakhs and prime residential plots at ₹6.29L per cent with 90% bank loan support.',
      fullDesc: 'KPM PKN Arcade offers high capital appreciation on the busy Kovilpalayam - Karuvalur corridor. With ready-to-move 2 BHK villas complete with covered car parking, compound wall, modular kitchen, and prime plots with ready water and electricity connections.',
      highlights: [
        'Ready to Move 2 BHK Luxury Villas at ₹41 Lakhs (Instant Key Handover)',
        'Prime Road-Facing Residential Plots @ ₹6.29 Lakhs / Cent',
        'Up to 90% Bank Loan Approved from Major Banks',
        'Direct Main Road Frontage on Kovilpalayam - Karuvalur Road',
        '100% DTCP Approved, Vastu Compliant Individual Villas',
        'High Growth & Fast Appreciating Commercial/Residential Hotspot'
      ],
      stats: [
        { label: 'Plots / Cent', value: '₹6.29 Lakhs' },
        { label: '2 BHK Villa', value: '₹41 Lakhs' },
        { label: 'Status', value: 'Ready to Move' },
        { label: 'Bank Loan', value: '90% Sanction' }
      ]
    }
  ]

  // Active project object
  const currentProject = useMemo(() => {
    return coimbatoreProjects.find((p) => p.id === activeProjectTab) || coimbatoreProjects[0]
  }, [activeProjectTab])

  // Hero slideshow slides
  const heroSlides = [
    {
      image: '/assets/project_ss_garden.jpg',
      tag: 'Kumarankundru, Mettupalayam - Annur NH',
      title: 'KPM S.S Garden',
      badge: 'Diwali Offer: Plots ₹4.99L/Cent • 2 BHK ₹32L • 90% Loan',
      desc: 'Exclusive Diwali Offer on Mettupalayam-Annur NH! Amidst 100+ residences with FREE registration cost, FREE gold coin on spot booking, and 90% bank loan assistance.'
    },
    {
      image: '/assets/project_royal_meadows.jpg',
      tag: 'Near Annur, Coimbatore',
      title: 'KPM Royal Meadows',
      badge: 'Plots ₹3.29L/Cent • 1 BHK ₹20L • 2 BHK ₹25L • 90% Loan',
      desc: 'Most affordable DTCP approved gated community near Annur. Own your dream plot or villa with 90% bank loan and budget-friendly pricing from ₹20 Lakhs.'
    },
    {
      image: '/assets/project_pkn_arcade.jpg',
      tag: 'Kovilpalayam to Karuvalur Road',
      title: 'KPM PKN Arcade',
      badge: 'Plots ₹6.29L/Cent • Ready to Move 2 BHK Villas ₹41L • 90% Loan',
      desc: 'High-appreciation main road project with ready-to-move 2 BHK luxury villas at ₹41 Lakhs and prime plots at ₹6.29L/cent with 90% bank loan.'
    }
  ]

  // Filtered projects for showcase cards
  const displayedProjects = useMemo(() => {
    if (projectFilter === 'all') return coimbatoreProjects
    if (projectFilter === 'ready') return coimbatoreProjects.filter((p) => p.statusType === 'ready')
    if (projectFilter === 'offer') return coimbatoreProjects.filter((p) => p.badgeColor === 'gold')
    return coimbatoreProjects
  }, [projectFilter])

  // Trust numbers
  const trustStats = [
    { number: '90%', label: 'Bank Loan Sanctioned on All 3 Projects' },
    { number: '3', label: 'Landmark Coimbatore Projects' },
    { number: '100+', label: 'Homes in S.S Garden Community' },
    { number: '100%', label: 'DTCP Approved & Clear Titles' }
  ]

  // Reasons to Choose KPM
  const reasons = [
    {
      title: 'Up to 90% Bank Loan Approved',
      desc: 'All 3 projects — S.S Garden, Royal Meadows, and PKN Arcade — are pre-approved by leading banks (SBI, HDFC, ICICI, Axis Bank) with low 10% down payment.'
    },
    {
      title: '100% DTCP Approved & Clear Titles',
      desc: 'Every layout comes with verified legal documentation, crystal-clear parent documents, immediate registration, and individual patta transfer support.'
    },
    {
      title: 'Prime Coimbatore Growth Corridors',
      desc: 'Strategically located on Mettupalayam-Annur NH, Annur town, and Kovilpalayam-Karuvalur road with direct highway frontage and rapid value appreciation.'
    },
    {
      title: '100% Vastu & Architectural Purity',
      desc: 'Every villa and plot layout is designed with strict adherence to East and North facing Vastu principles for positive energy, prosperity, and natural light.'
    },
    {
      title: 'Ready to Move & Custom Villas',
      desc: 'Choose between ready-to-move 2 BHK villas at PKN Arcade or customizable 1 & 2 BHK villas at Royal Meadows and S.S Garden.'
    },
    {
      title: 'Festival Offers & Free Registration',
      desc: 'Enjoy S.S Garden’s Diwali Offer with plots at ₹4.99L/cent, free registration cost, and free gold coins on spot bookings.'
    }
  ]

  // Amenities list
  const amenities = [
    { title: 'Wide Blacktop Tar Roads', image: '/assets/slid7-DT7ytL2u.png', tag: 'Infrastructure', desc: '30ft & 40ft wide internal paved asphalt roads with drainage' },
    { title: 'Grand Entrance & Security', image: '/assets/club-BuFzdcAI.png', tag: 'Gated Layout', desc: '24/7 manned security booth with boom barrier' },
    { title: 'Children’s Safe Play Park', image: '/assets/play-area-BQSrg8Sh.jpg', tag: 'Kids Zone', desc: 'Lush green play turf with swings and seating benches' },
    { title: 'Solar Street Illumination', image: '/assets/slid6-Bh2Lq1Ra.png', tag: 'Eco Living', desc: 'Energy-efficient automatic solar street lighting across avenues' },
    { title: 'Sweet Potable Water & Borewell', image: '/assets/hall-ccpy3vJP.jpg', tag: 'Utilities', desc: 'Individual water connections with abundant sweet ground water' },
    { title: 'Lush Landscaped Avenues', image: '/assets/about1-DQqXreQn.jpg', tag: 'Greenery', desc: 'Tree-lined pedestrian boulevards with Western Ghats breezes' }
  ]

  // Gallery slides with categories
  const allGalleryItems = [
    { title: 'KPM S.S Garden Layout', image: '/assets/project_ss_garden.jpg', category: 'architecture', tag: 'Mettupalayam NH' },
    { title: 'KPM Royal Meadows Gated Community', image: '/assets/project_royal_meadows.jpg', category: 'architecture', tag: 'Near Annur' },
    { title: 'KPM PKN Arcade Ready Villas', image: '/assets/project_pkn_arcade.jpg', category: 'architecture', tag: 'Kovilpalayam Rd' },
    { title: 'Spacious Modern Villa Living Hall', image: '/assets/slid3-BI0P2p4_.jpg', category: 'interior', tag: 'Interiors' },
    { title: 'Gated Layout Entrance Arch', image: '/assets/club-BuFzdcAI.png', category: 'amenities', tag: 'Entrance Gate' },
    { title: 'Wide Blacktop Internal Roads', image: '/assets/slid7-DT7ytL2u.png', category: 'amenities', tag: 'Roads & Lights' },
    { title: 'Master Bedroom with En-Suite', image: '/assets/slid8-DcASU5si.png', category: 'interior', tag: 'Bedrooms' },
    { title: 'Modern Modular Kitchen', image: '/assets/slid9-B7NULodB.png', category: 'interior', tag: 'Kitchen' },
    { title: 'Children’s Play Park & Green Turf', image: '/assets/play-area-BQSrg8Sh.jpg', category: 'amenities', tag: 'Gardens' }
  ]

  const filteredGallery = useMemo(() => {
    if (galleryCategory === 'all') return allGalleryItems
    return allGalleryItems.filter((item) => item.category === galleryCategory)
  }, [galleryCategory])

  // Floor Plans & Blueprints Data
  const floorPlansData = {
    'ss_garden_2bhk': {
      title: '2 BHK Villa — S.S Garden (₹32 Lakhs)',
      project: 'KPM S.S Garden • Mettupalayam - Annur NH',
      desc: 'Contemporary 2 BHK independent villa with covered car porch, spacious hall, modern kitchen, and private terrace amidst 100+ homes.',
      image: '/assets/floor1.png',
      specs: ['1,050 Sq.Ft Built-Up Area', 'East / North Vastu Facing', 'Diwali Offer @ ₹32 Lakhs', '90% Bank Loan Approved']
    },
    'royal_1bhk': {
      title: '1 BHK Villa — Royal Meadows (₹20 Lakhs)',
      project: 'KPM Royal Meadows • Near Annur',
      desc: 'Compact, high-efficiency 1 BHK independent home ideal for small families or retirement living near Annur.',
      image: '/assets/floor2.png',
      specs: ['650 Sq.Ft Built-Up Area', 'Unbeatable Budget @ ₹20 Lakhs', 'Independent Plot & Compound', '90% Bank Loan Sanctioned']
    },
    'royal_2bhk': {
      title: '2 BHK Villa — Royal Meadows (₹25 Lakhs)',
      project: 'KPM Royal Meadows • Near Annur',
      desc: 'Spacious 2 BHK duplex/single-floor villa with sweet water connection, front garden, and wide road access.',
      image: '/assets/floor3.png',
      specs: ['950 Sq.Ft Built-Up Area', 'Exceptional Value @ ₹25 Lakhs', '100% Vastu Compliant', '90% Bank Loan Available']
    },
    'pkn_2bhk': {
      title: 'Ready 2 BHK Villa — PKN Arcade (₹41 Lakhs)',
      project: 'KPM PKN Arcade • Kovilpalayam - Karuvalur Rd',
      desc: 'Move in immediately! Premium ready-to-move 2 BHK villa with covered car parking, modular kitchen, and main road frontage.',
      image: '/assets/floor4.png',
      specs: ['1,250 Sq.Ft Built-Up Area', 'Ready to Move In (Instant Possession)', 'Kovilpalayam - Karuvalur Main Road', '90% Bank Loan Approved']
    },
    'dtcp_plots': {
      title: 'DTCP Approved Plots (From ₹3.29L / Cent)',
      project: 'Available Across S.S Garden, Royal Meadows & PKN Arcade',
      desc: 'Residential and commercial plots with clear titles, tar roads, street lighting, and immediate registration.',
      image: '/assets/floor5.png',
      specs: ['Royal Meadows: ₹3.29L/Cent', 'S.S Garden: ₹4.99L/Cent (Diwali Offer)', 'PKN Arcade: ₹6.29L/Cent', '90% Plot Loan Assistance']
    }
  }

  // Location Highlights
  const locationCategories = [
    {
      title: 'Road & Highway Connectivity',
      places: [
        'Mettupalayam - Annur NH (Direct Highway Frontage) • 0 Mins',
        'Kovilpalayam to Karuvalur Main Road • 0 Mins',
        'Annur Central Bus Stand & Market • 5 Mins',
        'Mettupalayam Town & Railway Station • 15 Mins',
        'Sathy Road (NH 209) Connectivity • 10 Mins'
      ]
    },
    {
      title: 'Air & Rail Hubs',
      places: [
        'Coimbatore International Airport (CJB) • 25 Mins',
        'Mettupalayam Railway Station • 15 Mins',
        'Coimbatore North Railway Station • 30 Mins',
        'Gandhipuram Central Bus Terminus • 35 Mins'
      ]
    },
    {
      title: 'IT & Industrial Hubs',
      places: [
        'Kovilpalayam Industrial Corridor • 5 Mins',
        'Saravanampatti CHIL SEZ (Cognizant / Bosch) • 20 Mins',
        'KGISL Tech Park & IT Corridors • 22 Mins',
        'Annur Industrial Growth Center • 8 Mins'
      ]
    },
    {
      title: 'Schools & Colleges',
      places: [
        'SNS College of Technology & Engineering • 15 Mins',
        'Kumaran College & Matriculation School • 5 Mins',
        'Vimal Jyothi Matriculation Higher Secondary • 8 Mins',
        'Info Institute of Engineering • 12 Mins'
      ]
    },
    {
      title: 'Healthcare & Hospitals',
      places: [
        'Annur Government & Private Multispecialty Hospitals • 6 Mins',
        'Mettupalayam Government Hospital • 15 Mins',
        'KMCH & Kovai Medical Center (Avinashi Rd) • 25 Mins',
        'PSG Hospitals & Royal Care • 30 Mins'
      ]
    },
    {
      title: 'Markets & Daily Needs',
      places: [
        'Annur Daily Produce Market & Supermarkets • 5 Mins',
        'Kumarankundru Murugan Temple • 2 Mins',
        'National Highway Commercial Retail Hub • 1 Min',
        'Karunya & Kovilpalayam Commercial Stretch • 8 Mins'
      ]
    }
  ]

  // FAQ Data
  const faqs = [
    {
      question: 'What are the 3 projects currently offered by KPM Builders & Promoters?',
      answer: 'We offer 3 marquee projects: 1) KPM S.S Garden on Mettupalayam - Annur NH (Kumarankundru) featuring a Diwali offer on plots at ₹4.99L/cent and 2 BHK villas at ₹32L; 2) KPM Royal Meadows near Annur with plots at ₹3.29L/cent, 1 BHK villas at ₹20L, and 2 BHK villas at ₹25L; and 3) KPM PKN Arcade on Kovilpalayam to Karuvalur Road offering prime plots at ₹6.29L/cent and ready-to-move 2 BHK villas at ₹41L.'
    },
    {
      question: 'Is 90% bank loan available for all 3 projects?',
      answer: 'Yes! All 3 projects — S.S Garden, Royal Meadows, and PKN Arcade — are pre-approved by leading banks (SBI, HDFC, ICICI, Axis Bank, etc.) with up to 90% bank loan facility. You only need a 10% down payment to book and own your plot or villa.'
    },
    {
      question: 'What is the special Diwali Offer available for S.S Garden?',
      answer: 'For S.S Garden on Mettupalayam-Annur NH, we offer plots at a special Diwali price of ₹4.99 Lakhs per cent (reduced from ₹5.75L). Plus, buyers receive FREE registration cost and a FREE gold coin upon spot booking, set amidst a vibrant community of 100+ established homes.'
    },
    {
      question: 'Are ready-to-move villas available immediately?',
      answer: 'Yes, KPM PKN Arcade on Kovilpalayam to Karuvalur Road has ready-to-move 2 BHK independent villas priced at ₹41 Lakhs with immediate possession and instant key handover.'
    },
    {
      question: 'Are all layouts DTCP approved with clear titles?',
      answer: 'Yes, 100% of our plots and villa developments are DTCP approved with crystal-clear legal documentation, individual patta transfer assistance, and strict Vastu compliance.'
    }
  ]

  // EMI Calculator Calculation
  const { monthlyEmi, loanAmount, totalInterest, totalPayable } = useMemo(() => {
    const downPayment = (emiPrice * downPaymentPercent) / 100
    const principal = emiPrice - downPayment
    const monthlyRate = interestRate / 12 / 100
    const totalMonths = loanTenureYears * 12

    if (monthlyRate === 0) {
      const emi = principal / totalMonths
      return {
        monthlyEmi: Math.round(emi),
        loanAmount: principal,
        totalInterest: 0,
        totalPayable: principal
      }
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    const payable = emi * totalMonths
    const interest = payable - principal

    return {
      monthlyEmi: Math.round(emi),
      loanAmount: Math.round(principal),
      totalInterest: Math.round(interest),
      totalPayable: Math.round(payable)
    }
  }, [emiPrice, downPaymentPercent, loanTenureYears, interestRate])

  // Currency Formatter
  const formatINR = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val)
  }

  const formatShortINR = (val) => {
    if (val >= 10000000) {
      return `₹${(val / 10000000).toFixed(2)} Cr`
    }
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)} Lakhs`
    }
    return formatINR(val)
  }

  // High-performance scroll handler (GPU-driven, RAF throttled)
  useEffect(() => {
    let rafId = null

    const handleScroll = () => {
      if (rafId) return

      rafId = window.requestAnimationFrame(() => {
        const scrollY = window.scrollY
        const isScrolled = scrollY > 40
        setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev))

        if (progressBarRef.current) {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight
          const progress = totalHeight > 0 ? Math.min(1, Math.max(0, scrollY / totalHeight)) : 0
          progressBarRef.current.style.transform = `scaleX(${progress})`
        }

        rafId = null
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId) window.cancelAnimationFrame(rafId)
    }
  }, [])

  // Auto-play hero slider
  useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroSlides.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [heroSlides.length])

  // Scroll reveal observer with dynamic tab remount support
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      }
    )

    const revealElements = document.querySelectorAll(
      '.reveal:not(.active), .reveal-left:not(.active), .reveal-right:not(.active)'
    )
    revealElements.forEach((el) => observer.observe(el))

    return () => {
      revealElements.forEach((el) => observer.unobserve(el))
    }
  }, [projectFilter, galleryCategory, activeProjectTab, floorPlanTab])

  // Open modal preselected with a specific project
  const openEnquiryModal = (projectName = 'All 3 Coimbatore Projects') => {
    let matchedProject = projectName
    if (projectName.includes('S.S Garden')) {
      matchedProject = 'KPM S.S Garden (Mettupalayam - Annur NH)'
    } else if (projectName.includes('Royal Meadows')) {
      matchedProject = 'KPM Royal Meadows (Near Annur)'
    } else if (projectName.includes('PKN Arcade')) {
      matchedProject = 'KPM PKN Arcade (Kovilpalayam - Karuvalur Rd)'
    } else if (projectName.includes('Diwali')) {
      matchedProject = 'Diwali Offer Consultation'
    } else if (projectName === 'General Consultation' || projectName === 'Footer Contact' || projectName === 'Mobile Bar') {
      matchedProject = 'General Consultation'
    }

    setSelectedProject(matchedProject)
    setFormData((prev) => ({ ...prev, project: matchedProject }))
    setShowPopup(true)
  }

  // Form input handler
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}

    if (!formData.name.trim()) newErrors.name = 'Please enter your full name'
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-+]/g, '').slice(-10))) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setSubmitting(true)

    // Submit lead data to Google Sheets & trigger automated email alert
    try {
      await submitLead({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        city: formData.city || 'Coimbatore',
        property: formData.project,
        propertyName: formData.project,
        project: formData.project,
        source: selectedProject ? `Website (${selectedProject})` : 'Website Enquiry'
      })
    } catch (err) {
      console.error('Lead submission error:', err)
    }

    setSubmitting(false)
    setSuccessMsg(`Thank you! Enquiry received for ${formData.project}. Redirecting...`)
    setTimeout(() => {
      window.location.href = '/thankyou.html'
    }, 1200)
  }

  return (
    <>
      {/* Scroll Progress Bar with KPM Blue Glow */}
      <div ref={progressBarRef} className="scroll-progress-bar" aria-hidden="true"></div>

      {/* Top Announcement Bar */}
      <div className="top-announcement-bar">
        <div className="announcement-content">
          <span className="badge-pill">COIMBATORE</span>
          <span className="announcement-text">
            3 Prime Projects: S.S Garden, Royal Meadows & PKN Arcade • Up to 90% Bank Loan Available • DTCP Approved
          </span>
          <div className="top-contact-links">
            <a href="tel:+917708968557" className="contact-item">
              +91 77089 68557
            </a>
            <span className="sep">|</span>
            <span className="location-tag">Coimbatore, Tamil Nadu</span>
          </div>
        </div>
      </div>

      {/* Sticky Navigation Header */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="logo">
            <a href="#home" aria-label="KPM Builders & Promoters Home">
              <img src="/assets/kpm_logo.png" alt="KPM Builders & Promoters" className="kpm-brand-logo" width="180" height="44" decoding="async" />
            </a>
          </div>

          <nav>
            <ul className={`nav-links ${mobileNavOpen ? 'active' : ''}`}>
              <li onClick={() => setMobileNavOpen(false)}><a href="#home">Home</a></li>
              <li onClick={() => setMobileNavOpen(false)}><a href="#projects">3 Projects</a></li>
              <li onClick={() => setMobileNavOpen(false)}><a href="#why-kpm">Why KPM</a></li>
              <li onClick={() => setMobileNavOpen(false)}><a href="#amenities">Amenities</a></li>
              <li onClick={() => setMobileNavOpen(false)}><a href="#location">Locations</a></li>
              <li onClick={() => setMobileNavOpen(false)}><a href="#faq">FAQ</a></li>
            </ul>
          </nav>

          <div className="nav-cta-group">
            <a href="tel:+917708968557" className="call-quick-btn" title="Call KPM Advisor">
              <span className="call-text">+91 77089 68557</span>
            </a>
            <button
              className="primary-cta-btn"
              onClick={() => openEnquiryModal('General Consultation')}
            >
              <span>Enquire Now</span>
              <span className="btn-arrow">&rarr;</span>
            </button>
          </div>

          <button
            className={`hamburger ${mobileNavOpen ? 'open' : ''}`}
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {/* Dynamic Hero Section */}
      <section id="home" className="hero">
        <div className="hero-slider">
          {heroSlides.map((slide, idx) => (
            <div key={idx} className={`slide ${idx === heroIndex ? 'active' : ''}`}>
              <div className="hero-img-container">
                <img
                  src={slide.image}
                  alt={slide.title}
                  fetchPriority={idx === 0 ? "high" : "low"}
                  loading={idx === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </div>
              <div className="hero-gradient-overlay"></div>

              <div className="hero-content-wrapper container">
                <div className="hero-content">
                  <div className="hero-eyebrow-pill">
                    <span className="pill-dot"></span>
                    <span className="pill-text">{slide.tag}</span>
                  </div>
                  <h1>
                    {slide.title}
                  </h1>
                  <p className="hero-badge-tag">{slide.badge}</p>
                  <p className="hero-desc">{slide.desc}</p>

                  <div className="hero-actions">
                    <button
                      type="button"
                      className="hero-btn primary"
                      onClick={() => openEnquiryModal(slide.title)}
                    >
                      <span>Enquire Now</span>
                      <span className="arrow">&rarr;</span>
                    </button>
                    <a href="#projects" className="hero-btn secondary">
                      <span>Explore 3 Projects</span>
                    </a>
                  </div>

                  {/* Project Jump Pills in Hero */}
                  <div className="hero-project-pills">
                    <span className="pill-label">Quick Jump:</span>
                    <button
                      className={activeProjectTab === 'ss_garden' ? 'active' : ''}
                      onClick={() => { setActiveProjectTab('ss_garden'); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                    >
                      KPM S.S Garden (Mettupalayam NH)
                    </button>
                    <button
                      className={activeProjectTab === 'royal_meadows' ? 'active' : ''}
                      onClick={() => { setActiveProjectTab('royal_meadows'); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                    >
                      KPM Royal Meadows (Near Annur)
                    </button>
                    <button
                      className={activeProjectTab === 'pkn_arcade' ? 'active' : ''}
                      onClick={() => { setActiveProjectTab('pkn_arcade'); document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' }); }}
                    >
                      KPM PKN Arcade (Kovilpalayam Rd)
                    </button>
                  </div>
                </div>

                {/* Floating Hero Stats Card */}
                <div className="hero-floating-card">
                  <div className="card-header">
                    <div>
                      <h4>#1 Trusted Developer</h4>
                      <p>Coimbatore, Tamil Nadu</p>
                    </div>
                  </div>
                  <div className="card-divider"></div>
                  <div className="mini-stats-grid">
                    <div className="stat-item">
                      <span className="val">90%</span>
                      <span className="lbl">Bank Loan Available</span>
                    </div>
                    <div className="stat-item">
                      <span className="val">100%</span>
                      <span className="lbl">DTCP Approved</span>
                    </div>
                    <div className="stat-item">
                      <span className="val">3</span>
                      <span className="lbl">Prime Projects</span>
                    </div>
                    <div className="stat-item">
                      <span className="val">100+</span>
                      <span className="lbl">Happy Families</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Hero Slider Dot Indicators */}
        <div className="hero-slider-dots">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === heroIndex ? 'active' : ''}`}
              onClick={() => setHeroIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            ></button>
          ))}
        </div>
      </section>

      {/* Trust & Achievements Strip */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-grid">
            {trustStats.map((item, idx) => (
              <div key={idx} className="trust-card reveal">
                <div className="trust-info">
                  <span className="number">{item.number}</span>
                  <span className="label">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CORE: The 3 Coimbatore Landmark Projects Showcase */}
      <section id="projects" className="coimbatore-projects-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-sub reveal">Premier Coimbatore Developments</span>
            <h2 className="section-title reveal">3 Landmark Projects in Coimbatore</h2>
            <div className="title-accent-bar reveal"></div>
            <p className="section-intro reveal">
              Explore KPM’s signature developments across Coimbatore’s fast-growing corridors: Mettupalayam-Annur NH, Annur, and Kovilpalayam with up to 90% bank loan approval.
            </p>
          </div>

          {/* Interactive Project Switcher Tabs */}
          <div className="project-switcher-nav reveal">
            {coimbatoreProjects.map((proj) => (
              <button
                key={proj.id}
                className={`switcher-tab-btn ${activeProjectTab === proj.id ? 'active' : ''}`}
                onClick={() => setActiveProjectTab(proj.id)}
              >
                <div className="tab-text">
                  <span className="tab-name">{proj.name}</span>
                  <span className="tab-loc">{proj.areaTag}</span>
                </div>
                <span className={`status-pill ${proj.badgeColor}`}>{proj.badge}</span>
              </button>
            ))}
          </div>

          {/* Active Project Feature Card */}
          <div className="featured-project-card reveal">
            <div className="project-media-col">
              <div className="main-image-wrapper">
                <img src={currentProject.image} alt={currentProject.name} loading="lazy" decoding="async" />
                <div className="project-overlay-badge">
                  <span>{currentProject.location}</span>
                </div>
                <span className={`live-status-badge ${currentProject.badgeColor}`}>
                  <span className="pulsing-circle"></span>
                  {currentProject.status}
                </span>
              </div>
            </div>

            <div className="project-details-col">
              <div className="project-top-meta">
                <span className="project-type-tag">{currentProject.type}</span>
                <span className="project-rera">{currentProject.rera}</span>
              </div>

              <h3 className="project-title">{currentProject.name}</h3>
              <p className="project-tagline">{currentProject.tagline}</p>

              <div className="project-price-highlight">
                <div className="price-box">
                  <span className="price-label">Starting Price</span>
                  <span className="price-val">{currentProject.price}</span>
                  <span className="price-suffix">{currentProject.priceUnit}</span>
                </div>
                <div className="config-box">
                  <span className="config-label">Configuration</span>
                  <span className="config-val">{currentProject.config}</span>
                  <span className="sqft-val">{currentProject.sqft}</span>
                </div>
              </div>

              <p className="project-description">{currentProject.shortDesc}</p>

              {/* Highlights Bullet List */}
              <div className="project-highlights">
                <h4>Key Highlights & USPs:</h4>
                <ul>
                  {currentProject.highlights.map((point, pIdx) => (
                    <li key={pIdx}>
                      <span className="check-bullet">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Specifications Mini-Grid */}
              <div className="specs-mini-grid">
                {currentProject.stats.map((s, sIdx) => (
                  <div key={sIdx} className="spec-item">
                    <span className="spec-val">{s.value}</span>
                    <span className="spec-lbl">{s.label}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="project-card-actions">
                <button
                  className="btn-enquire-project"
                  onClick={() => openEnquiryModal(currentProject.name)}
                >
                  <span>Enquire for {currentProject.name}</span>
                  &rarr;
                </button>

              </div>
            </div>
          </div>

          {/* Quick Comparison of All 3 Coimbatore Projects */}
          <div className="projects-grid-comparison">
            <div className="grid-header text-center">
              <h3 className="reveal">Quick View: All 3 Coimbatore Projects</h3>
              <div className="filter-pill-group reveal">
                <button
                  className={projectFilter === 'all' ? 'active' : ''}
                  onClick={() => setProjectFilter('all')}
                >
                  All (3 Projects)
                </button>
                <button
                  className={projectFilter === 'offer' ? 'active' : ''}
                  onClick={() => setProjectFilter('offer')}
                >
                  Diwali Offer (S.S Garden)
                </button>
                <button
                  className={projectFilter === 'ready' ? 'active' : ''}
                  onClick={() => setProjectFilter('ready')}
                >
                  Ready to Move (PKN Arcade)
                </button>
              </div>
            </div>

            <div className="three-projects-grid">
              {displayedProjects.map((item) => (
                <div
                  key={item.id}
                  className={`project-card-tile reveal active ${activeProjectTab === item.id ? 'active-highlight' : ''}`}
                  onClick={() => setActiveProjectTab(item.id)}
                >
                  <div className="tile-image-container">
                    <img src={item.image} alt={item.name} loading="lazy" decoding="async" />
                    <span className={`status-pill top-right ${item.badgeColor}`}>{item.badge}</span>
                    <span className="tile-loc-badge">{item.areaTag}</span>
                  </div>

                  <div className="tile-body">
                    <div className="tile-header">
                      <h4>{item.name}</h4>
                      <span className="tile-price">{item.price}</span>
                    </div>
                    <p className="tile-type">{item.config}</p>
                    <p className="tile-desc">{item.shortDesc}</p>

                    <div className="tile-footer">
                      <button
                        className="tile-action-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          openEnquiryModal(item.name)
                        }}
                      >
                        Enquire Now &rarr;
                      </button>
                      <button
                        className="tile-switch-btn"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveProjectTab(item.id)
                          document.querySelector('.featured-project-card')?.scrollIntoView({ behavior: 'smooth' })
                        }}
                      >
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Why Choose KPM Builders & Promoters */}
      <section id="why-kpm" className="reasons">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-sub reveal">The KPM Distinction</span>
            <h2 className="section-title reveal">Why Discerning Families Choose KPM</h2>
            <div className="title-accent-bar reveal"></div>
            <p className="section-intro reveal">
              Over 15 years of delivering architectural excellence, transparent dealings, and on-time handovers across Coimbatore.
            </p>
          </div>

          <div className="reasons-grid">
            {reasons.map((item, idx) => (
              <div key={idx} className="reason-card reveal">
                <div className="card-top-icon">
                  <span className="number">0{idx + 1}</span>
                </div>
                <div className="content">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
                <div className="hover-line"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Signature Amenities Bento Grid */}
      <section id="amenities" className="amenities">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-sub reveal">Elevated Community Living</span>
            <h2 className="section-title reveal">Layout & Township Amenities</h2>
            <div className="title-accent-bar reveal"></div>
            <p className="section-intro reveal">
              Every KPM project is appointed with essential infrastructure, 24/7 security, blacktop roads, and green surroundings.
            </p>
          </div>

          <div className="amenities-bento-grid">
            {amenities.map((item, idx) => (
              <div key={idx} className={`amenity-bento-card item-${idx + 1} reveal`}>
                <div className="amenity-img-bg">
                  <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                </div>
                <div className="amenity-glass-overlay">
                  <span className="amenity-tag">{item.tag}</span>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Image Gallery */}
      <section id="gallery" className="gallery-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-sub reveal">Visual Showcase</span>
            <h2 className="section-title reveal">Project Gallery</h2>
            <div className="title-accent-bar reveal"></div>
          </div>

          <div className="gallery-filter-tabs reveal">
            {['all', 'architecture', 'interior', 'amenities'].map((cat) => (
              <button
                key={cat}
                className={`filter-btn ${galleryCategory === cat ? 'active' : ''}`}
                onClick={() => setGalleryCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="gallery-grid-modern">
            {filteredGallery.map((item, idx) => (
              <div
                key={`${galleryCategory}-${idx}`}
                className="gallery-item-card reveal active"
                onClick={() => setLightboxImage(item.image)}
              >
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" />
                <div className="item-overlay">
                  <span className="item-tag">{item.tag}</span>
                  <h4>{item.title}</h4>
                  <span className="view-btn">View Details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coimbatore Strategic Location & Connectivity */}
      <section id="location" className="location-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-sub reveal">Prime Connectivity</span>
            <h2 className="section-title reveal">Strategic Coimbatore Hubs</h2>
            <div className="title-accent-bar reveal"></div>
            <p className="section-intro reveal">
              Every KPM project provides exceptional connectivity to National Highways, Annur Bus Stand, Mettupalayam, Airport, and top colleges.
            </p>
          </div>

          {/* Interactive Map Wrapper with Coimbatore Pins */}
          <div className="map-wrapper reveal">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d125322.44173155556!2d76.89714343132646!3d11.014126294125895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba859af2f971cb5%3A0x2fc1c81e183ed282!2sCoimbatore%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
              loading="lazy"
              title="KPM Properties Coimbatore Projects Map"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
            <div className="location-pills-row">
              <span className="loc-pill blue">KPM S.S Garden • Mettupalayam - Annur NH</span>
              <span className="loc-pill green">KPM Royal Meadows • Near Annur</span>
              <span className="loc-pill azure">KPM PKN Arcade • Kovilpalayam - Karuvalur Rd</span>
            </div>
          </div>

          {/* Location Category Cards */}
          <div className="location-cards-grid">
            {locationCategories.map((cat, idx) => (
              <div key={idx} className="location-card reveal">
                <h3>{cat.title}</h3>
                <ul>
                  {cat.places.map((place, pIdx) => (
                    <li key={pIdx}>
                      <span className="loc-bullet">•</span>
                      <span>{place}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section id="faq" className="faq-section">
        <div className="container">
          <div className="section-header text-center">
            <span className="section-sub reveal">Clear Answers</span>
            <h2 className="section-title reveal">Frequently Asked Questions</h2>
            <div className="title-accent-bar reveal"></div>
          </div>

          <div className="faq-container reveal">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
              >
                <div className="faq-question">
                  <h3>{faq.question}</h3>
                  <span className="faq-toggle-icon">{activeFaq === index ? '−' : '+'}</span>
                </div>
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modern High-Impact Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-main-grid">
            {/* Col 1: Brand & Bio */}
            <div className="footer-col brand-col">
              <img src="/assets/kpm_logo.png" alt="KPM Builders & Promoters" className="footer-logo" loading="lazy" decoding="async" />
              <p className="footer-bio">
                KPM Builders & Promoters is Coimbatore’s premier developer, creating high-value residential plotted layouts and independent villas across S.S Garden (Mettupalayam-Annur NH), Royal Meadows (Near Annur), and PKN Arcade (Kovilpalayam-Karuvalur Rd) with up to 90% bank loan facility.
              </p>
              <div className="footer-cert-badges">
                <span className="cert-badge">DTCP Approved</span>
                <span className="cert-badge">Up to 90% Bank Loan</span>
                <span className="cert-badge">100% Vastu Compliant</span>
              </div>
            </div>

            {/* Col 2: The 3 Projects */}
            <div className="footer-col">
              <h4>Our 3 Flagship Projects</h4>
              <ul className="footer-links-list">
                <li>
                  <a href="#projects" onClick={() => setActiveProjectTab('ss_garden')}>
                    <strong>KPM S.S Garden</strong> — Mettupalayam NH (Plots & 2 BHK)
                  </a>
                </li>
                <li>
                  <a href="#projects" onClick={() => setActiveProjectTab('royal_meadows')}>
                    <strong>KPM Royal Meadows</strong> — Near Annur (Plots & 1/2 BHK)
                  </a>
                </li>
                <li>
                  <a href="#projects" onClick={() => setActiveProjectTab('pkn_arcade')}>
                    <strong>KPM PKN Arcade</strong> — Kovilpalayam Rd (Ready 2 BHK)
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Quick Navigation */}
            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul className="footer-links-list">
                <li><a href="#home">Home</a></li>
                <li><a href="#projects">3 Projects</a></li>
                <li><a href="#why-kpm">Why KPM</a></li>
                <li><a href="#amenities">Amenities</a></li>
                <li><a href="#location">Coimbatore Locations</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>

            {/* Col 4: Corporate Contact */}
            <div className="footer-col contact-col">
              <h4>Coimbatore Office</h4>
              <p className="contact-line">
                <strong>Project Office:</strong><br />
                KPM Builders & Promoters,<br />
                Mettupalayam - Annur NH / Kovilpalayam Road,<br />
                Coimbatore, Tamil Nadu
              </p>
              <p className="contact-line">
                <strong>Phone:</strong> +91 77089 68557<br />
                <strong>Email:</strong> sales@kpmproperties.in
              </p>
              <button
                className="footer-enquire-btn"
                onClick={() => openEnquiryModal('Footer Contact')}
              >
                Enquire Now
              </button>
            </div>
          </div>

          <div className="footer-legal-bar">
            <div className="rera-details">
              <span>DTCP Approved Projects: <strong>S.S Garden</strong> | <strong>Royal Meadows</strong> | <strong>PKN Arcade</strong> • 90% Bank Loan Approved</span>
            </div>
            <div className="copyright-line">
              <p>&copy; {new Date().getFullYear()} KPM Builders & Promoters. All rights reserved. | Built for Excellence in Coimbatore.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Buttons */}
      <div className="floating-buttons">
        <a
          href="https://wa.me/917708968557?text=Hello%20KPM%20Properties,%20I%20am%20interested%20in%20S.S%20Garden,%20Royal%20Meadows,%20or%20PKN%20Arcade%20projects."
          target="_blank"
          rel="noopener noreferrer"
          className="float-btn whatsapp pulse-green"
          aria-label="Chat on WhatsApp"
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </a>
        <a href="tel:+917708968557" className="float-btn call pulse-blue" aria-label="Direct Phone Call">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </a>
        {scrolled && (
          <button
            type="button"
            className="float-btn back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll back to top"
            title="Scroll to Top"
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </button>
        )}
      </div>

      {/* Sticky Mobile CTA */}
      <div className="mobile-cta-sticky">
        <button
          className="mobile-site-visit-btn"
          onClick={() => openEnquiryModal('Mobile Bar')}
        >
          <span>Enquire Now</span>
          &rarr;
        </button>
      </div>

      {/* VIP Enquiry Modal */}
      {showPopup && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal-btn" onClick={() => setShowPopup(false)}>&times;</button>
            <div className="modal-brand-header">
              <img src="/assets/kpm_logo.png" alt="KPM Builders" className="modal-logo" loading="lazy" decoding="async" />
              <h3>Connect with KPM Properties</h3>
              <p>Direct priority access to pricing sheets, plot availability, and 90% bank loan sanction assistance.</p>
            </div>

            <form onSubmit={handleSubmit} className="kpm-enquiry-form">
              <div className="form-group">
                <label>Selected Coimbatore Project</label>
                <select
                  name="project"
                  value={formData.project}
                  onChange={handleInputChange}
                  className="kpm-select"
                >
                  <option value="KPM S.S Garden (Mettupalayam - Annur NH)">KPM S.S Garden — Mettupalayam-Annur NH (Plots & 2 BHK)</option>
                  <option value="KPM Royal Meadows (Near Annur)">KPM Royal Meadows — Near Annur (Plots & 1/2 BHK)</option>
                  <option value="KPM PKN Arcade (Kovilpalayam - Karuvalur Rd)">KPM PKN Arcade — Kovilpalayam-Karuvalur Rd (Plots & Ready 2 BHK)</option>
                  <option value="All 3 Coimbatore Projects">All 3 Coimbatore Projects (90% Bank Loan)</option>
                  <option value="Diwali Offer Consultation">Diwali Special Offer Enquiry</option>
                  <option value="General Consultation">General Consultation / Home Loan</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <small className="err-msg">{errors.name}</small>}
                </div>

                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="e.g. 77089 68557"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                  {errors.phone && <small className="err-msg">{errors.phone}</small>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="e.g. ramesh@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <small className="err-msg">{errors.email}</small>}
                </div>

                <div className="form-group">
                  <label>City / Location</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="e.g. Coimbatore, Tirupur"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <button type="submit" className="modal-submit-btn" disabled={submitting}>
                {submitting ? 'Submitting Details...' : 'Submit'}
              </button>

              {successMsg && <div className="success-banner">{successMsg}</div>}
            </form>
          </div>
        </div>
      )}

      {/* Video Lightbox Modal */}
      {activeVideoId && (
        <div className="video-modal-overlay" onClick={() => setActiveVideoId(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={() => setActiveVideoId(null)}>&times;</button>
            <div className="video-modal-player">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideoId}?autoplay=1&controls=1&rel=0`}
                title="KPM Property Video Player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div className="lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxImage(null)}>&times;</button>
            <img src={lightboxImage} alt="Expanded Blueprint / Photo" />
          </div>
        </div>
      )}
    </>
  )
}

export default App
