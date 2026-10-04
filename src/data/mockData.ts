import { User, Vehicle, Post, Story, Community, Event, Conversation, ModerationItem, PlateDisplayMode } from '../types';

export const currentUserMock: User = {
  id: 'usr_layla',
  name: 'Layla Al-Mansouri',
  nameAr: 'ليلى المنصوري',
  username: 'layla_gt3',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  bio: 'Track day enthusiast & motorsport mechanical engineer. Weekends at the circuit, weekdays in the garage. 🏎️🏁',
  bioAr: 'مهندسة ميكانيك وعاشقة لحلبات السباق. عطلات نهاية الأسبوع في الحلبة وأيام العمل في المرآب. 🏎️🏁',
  phone: '+971 50 839 2144',
  email: 'layla.mansouri@carsocial.club',
  region: 'Dubai, UAE',
  role: 'member',
  primaryPlate: 'A 19242',
  primaryVehicleId: 'veh_porsche_gt3',
  isPrivate: false,
  allowPlateDiscovery: true,
  plateDisplayMode: 'masked', // Masked by default per BR-1 / FR-PRV-02
  locationPrecision: 'approximate',
  aiPersonalization: true,
  autoBlurFacesAndPlates: true,
  age: 26,
  isVerified: true,
};

export const sampleUsers: User[] = [
  currentUserMock,
  {
    id: 'usr_omar',
    name: 'Omar Al-Hassan',
    nameAr: 'عمر الحسن',
    username: 'omar_m3_touring',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    bio: 'Touring & canyon cruiser. Long road trips, clean OEM+ builds and good coffee.',
    bioAr: 'عاشق للجولات الجبلية والسيارات العملية. رحلات طويلة وتعديلات أنيقة.',
    phone: '+971 55 491 8832',
    email: 'omar.hassan@example.com',
    region: 'Abu Dhabi, UAE',
    role: 'club_admin',
    primaryPlate: 'C 48102',
    primaryVehicleId: 'veh_bmw_m3',
    isPrivate: false,
    allowPlateDiscovery: true,
    plateDisplayMode: 'masked',
    locationPrecision: 'approximate',
    aiPersonalization: true,
    autoBlurFacesAndPlates: true,
    age: 29,
    isVerified: true,
  },
  {
    id: 'usr_private',
    name: 'Stealth Collector',
    nameAr: 'مالك خاص',
    username: 'private_collector',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    bio: 'Private garage. Inquiries through verified club only.',
    bioAr: 'مرآب خاص. التواصل عبر النادي المعتمد فقط.',
    phone: '+971 52 000 9988',
    email: 'collector@stealthgarage.ae',
    region: 'Dubai, UAE',
    role: 'member',
    primaryPlate: 'P 70007',
    primaryVehicleId: 'veh_ferrari_f8',
    isPrivate: true, // Private owner
    allowPlateDiscovery: false, // Rule: Private owner shows 'private vehicle'
    plateDisplayMode: 'hidden',
    locationPrecision: 'off',
    aiPersonalization: false,
    autoBlurFacesAndPlates: true,
    age: 38,
    isVerified: true,
  },
  {
    id: 'usr_admin',
    name: 'Sara Lindqvist',
    nameAr: 'سارة ليندكفيست',
    username: 'sara_safety_lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    bio: 'Platform Trust, Safety & Ethics Lead at CarSocial.',
    bioAr: 'مسؤولة الأمان والثقة ومراقبة المحتوى في كار سوشيال.',
    phone: '+971 50 771 9901',
    email: 'sara.mod@carsocial.internal',
    region: 'Dubai, UAE',
    role: 'admin',
    primaryPlate: 'D 33412',
    primaryVehicleId: 'veh_audi_rs6',
    isPrivate: false,
    allowPlateDiscovery: true,
    plateDisplayMode: 'masked',
    locationPrecision: 'exact',
    aiPersonalization: true,
    autoBlurFacesAndPlates: true,
    age: 32,
    isVerified: true,
  }
];

export const sampleVehicles: Vehicle[] = [
  {
    id: 'veh_porsche_gt3',
    ownerId: 'usr_layla',
    ownerName: 'Layla Al-Mansouri',
    plateNumber: 'A 19242',
    region: 'Dubai, UAE',
    regionCode: 'DXB',
    make: 'Porsche',
    model: '911 GT3 (992)',
    year: 2023,
    trim: 'ClubSport Touring Package',
    color: 'Shark Blue',
    colorHex: '#0f4c81',
    engine: '4.0L Naturally Aspirated Flat-6',
    horsepower: 502,
    odometerKm: 18450,
    lastServiceDate: '2025-11-15',
    lastServiceMileage: 12000,
    isPrimary: true,
    isVerified: true,
    isPrivateVehicle: false,
    allowDiscovery: true,
    vinMasked: 'WP0AF2A9••••••992',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    modifications: [
      {
        id: 'mod_1',
        category: 'Exhaust',
        categoryAr: 'عادم',
        partName: 'Inconel Race Headers & Valved Catback',
        brand: 'Akrapovič Evolution Titanium',
        installedDate: '2024-02-10',
        cost: 9800,
        notes: '-12kg weight reduction, high-RPM acoustic refinement.'
      },
      {
        id: 'mod_2',
        category: 'Suspension',
        categoryAr: 'نظام التعليق',
        partName: 'Clubsport 3-Way Adjustable Coilovers',
        brand: 'KW Suspensions V4',
        installedDate: '2024-05-18',
        cost: 6200,
        notes: 'Corner balanced for Yas Marina Circuit south layout.'
      },
      {
        id: 'mod_3',
        category: 'Wheels',
        categoryAr: 'العجلات والإطارات',
        partName: 'Forged Monoblock Center-lock 20"/21"',
        brand: 'BBS FI-R Satin Black',
        installedDate: '2024-08-01',
        cost: 8400,
        notes: 'Mounted on Michelin Pilot Sport Cup 2 R tires.'
      }
    ],
    maintenanceLogs: [
      {
        id: 'maint_1',
        date: '2025-11-15',
        serviceType: 'Major 12,000km Track Interval & Fluid Flush',
        serviceTypeAr: 'صيانة رئيسية 12 ألف كم وتغيير سوائل الحلبة',
        odometer: 12000,
        workshop: 'Porsche Centre Dubai Workshop',
        cost: 1450,
        invoiceNumber: 'INV-DXB-992-0491',
        notes: 'Mobil 1 ESP X3 0W-40, Motul RBF 660 brake fluid flush, alignment re-spec.'
      },
      {
        id: 'maint_2',
        date: '2024-04-20',
        serviceType: 'Break-in 3,000km Inspection & Differential Fluid',
        serviceTypeAr: 'فحص التليين 3 آلاف كم وزيت الدفرنس',
        odometer: 3100,
        workshop: 'Porsche Centre Dubai Workshop',
        cost: 650,
        invoiceNumber: 'INV-DXB-992-0112'
      }
    ]
  },
  {
    id: 'veh_mazda_rx7',
    ownerId: 'usr_layla',
    ownerName: 'Layla Al-Mansouri',
    plateNumber: 'B 30771',
    region: 'Dubai, UAE',
    regionCode: 'DXB',
    make: 'Mazda',
    model: 'RX-7 (FD3S)',
    year: 1997,
    trim: 'Type R Series 7',
    color: 'Chaste White',
    colorHex: '#f8f9fa',
    engine: '1.3L Twin-Rotary 13B-REW Sequential Turbo',
    horsepower: 340,
    odometerKm: 89300,
    lastServiceDate: '2025-08-10',
    lastServiceMileage: 87000,
    isPrimary: false,
    isVerified: true,
    isPrivateVehicle: false,
    allowDiscovery: true,
    vinMasked: 'FD3S-••••••771',
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
    modifications: [
      {
        id: 'mod_rx7_1',
        category: 'Engine',
        categoryAr: 'محرك',
        partName: 'V-Mount Intercooler & Radiator Kit',
        brand: 'GReddy Spec-R',
        installedDate: '2023-11-12',
        cost: 3200,
        notes: 'Optimized cooling for desert highway temperatures.'
      }
    ],
    maintenanceLogs: [
      {
        id: 'maint_rx7_1',
        date: '2025-08-10',
        serviceType: 'Apex Seal Compression Check & Rotary Oil Service',
        serviceTypeAr: 'فحص ضغط عوازل الروتر وتغيير زيت مخصص',
        odometer: 87000,
        workshop: 'Rotary Works Specialist Garage',
        cost: 890,
        invoiceNumber: 'RW-2025-882'
      }
    ]
  },
  {
    id: 'veh_bmw_m3',
    ownerId: 'usr_omar',
    ownerName: 'Omar Al-Hassan',
    plateNumber: 'C 48102',
    region: 'Abu Dhabi, UAE',
    regionCode: 'AUH',
    make: 'BMW',
    model: 'M3 Competition Touring (G81)',
    year: 2024,
    trim: 'xDrive Touring',
    color: 'Isle of Man Green',
    colorHex: '#1b4d3e',
    engine: '3.0L Twin-Turbo S58 Inline-6',
    horsepower: 503,
    odometerKm: 14200,
    lastServiceDate: '2025-10-02',
    lastServiceMileage: 10000,
    isPrimary: true,
    isVerified: true,
    isPrivateVehicle: false,
    allowDiscovery: true,
    vinMasked: 'WBA33AY0••••••481',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    modifications: [
      {
        id: 'mod_bmw_1',
        category: 'Aero',
        partName: 'Carbon Front Lip & Rear Diffuser',
        brand: 'M Performance OEM Carbon',
        installedDate: '2024-03-15',
        cost: 4800
      }
    ],
    maintenanceLogs: []
  },
  {
    id: 'veh_gtr_nismo',
    ownerId: 'usr_rashid',
    ownerName: 'Rashid K.',
    plateNumber: 'S 55588',
    region: 'Dubai, UAE',
    regionCode: 'DXB',
    make: 'Nissan',
    model: 'GT-R Nismo (R35)',
    year: 2022,
    trim: 'Nismo Special Edition',
    color: 'Stealth Gray',
    colorHex: '#6c757d',
    engine: '3.8L Twin-Turbo VR38DETT V6',
    horsepower: 600,
    odometerKm: 22100,
    lastServiceDate: '2025-09-14',
    lastServiceMileage: 20000,
    isPrimary: true,
    isVerified: true,
    isPrivateVehicle: false,
    allowDiscovery: true,
    vinMasked: 'JN1GAR35••••••588',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    modifications: [],
    maintenanceLogs: []
  },
  {
    id: 'veh_ferrari_f8',
    ownerId: 'usr_private',
    ownerName: 'Stealth Collector',
    plateNumber: 'P 70007',
    region: 'Dubai, UAE',
    regionCode: 'DXB',
    make: 'Ferrari',
    model: 'F8 Tributo',
    year: 2022,
    trim: 'Coupe Carbon Package',
    color: 'Rosso Corsa',
    colorHex: '#cc0000',
    engine: '3.9L Twin-Turbo V8',
    horsepower: 710,
    odometerKm: 4300,
    lastServiceDate: '2025-04-10',
    lastServiceMileage: 3500,
    isPrimary: true,
    isVerified: true,
    isPrivateVehicle: true, // PRIVATE OWNER RULE
    allowDiscovery: false,
    vinMasked: 'ZFF89ALA••••••007',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80',
    modifications: [],
    maintenanceLogs: []
  }
];

export const sampleStories: Story[] = [
  {
    id: 'st_1',
    authorId: 'usr_layla',
    authorName: 'Layla Al-Mansouri',
    authorAvatar: currentUserMock.avatar,
    mediaUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    caption: 'Sunset canyon run through Jebel Hafeet curves 🏔️🏁',
    carTag: 'Porsche 911 GT3',
    createdAt: '2 hours ago',
    expiresInHours: 22,
  },
  {
    id: 'st_2',
    authorId: 'usr_omar',
    authorName: 'Omar Al-Hassan',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
    caption: 'Fresh ceramic coating curing under infrared lamps ✨',
    carTag: 'BMW M3 G81',
    createdAt: '5 hours ago',
    expiresInHours: 19,
  },
  {
    id: 'st_3',
    authorId: 'usr_rashid',
    authorName: 'Rashid K.',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    mediaUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    caption: 'Paddock setup ready for night endurance session 🌙🏎️',
    carTag: 'Nissan GT-R Nismo',
    createdAt: '7 hours ago',
    expiresInHours: 17,
  }
];

export const samplePosts: Post[] = [
  {
    id: 'post_1',
    authorId: 'usr_layla',
    authorName: 'Layla Al-Mansouri',
    authorAvatar: currentUserMock.avatar,
    authorPlateMasked: 'DXB • A ••• 42',
    isVerified: true,
    taggedVehicle: {
      make: 'Porsche',
      model: '911 GT3 (992)',
      year: 2023,
      plateMasked: 'DXB • A ••• 42'
    },
    content: 'Dialed in the KW Clubsport 3-way coilovers at Dubai Autodrome this morning. The front axle grip in high-speed transition is telepathic. Shaved 0.8s off my previous personal best! 🏁💨',
    contentAr: 'قمنا بضبط نظام التعليق المتطور KW Clubsport بثلاث اتجاهات في حلبة دبي أوتودروم صباح اليوم. ثبات المحور الأمامي أصبح استثنائياً وسرعة التوجيه فائقة!',
    image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80',
    location: 'Dubai Autodrome Circuit, UAE',
    createdAt: '3 hours ago',
    likesCount: 142,
    isLiked: false,
    commentsCount: 18,
    sharesCount: 12,
    isSaved: true,
    isAiRecommended: true,
    aiRecommendationReason: 'AI Recommended: High resonance with your flat-6 track interests & Yas Marina events',
    aiRecommendationReasonAr: 'توصية الذكاء الاصطناعي: تطابق قوي مع اهتماماتك بسيارات الحلبات ومحركات فلات-6',
    hashtags: ['PorscheGT3', 'TrackDay', 'Autodrome', 'SuspensionSetup'],
    comments: [
      {
        id: 'c_1',
        authorName: 'Omar Al-Hassan',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        text: 'Clean setup Layla! What spring rates are you running on the rear helpers?',
        createdAt: '2 hours ago'
      },
      {
        id: 'c_2',
        authorName: 'Rashid K.',
        authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        text: 'That Shark Blue under paddock floodlights looks lethal. See you at Friday’s group drive!',
        createdAt: '1 hour ago'
      }
    ]
  },
  {
    id: 'post_2',
    authorId: 'usr_omar',
    authorName: 'Omar Al-Hassan',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    authorPlateMasked: 'AUH • C ••• 02',
    isVerified: true,
    taggedVehicle: {
      make: 'BMW',
      model: 'M3 Competition Touring',
      year: 2024,
      plateMasked: 'AUH • C ••• 02'
    },
    content: 'Early dawn departure up the Jebel Jais mountain pass. Cold morning air, empty hairpins, and the S58 pulling hard in 3rd gear. CarSocial route planner picked the scenic ridge option! 🌄🚗',
    contentAr: 'انطلاقة باكرة عند الفجر نحو طريق جبل جيس. هواء الصباح المنعش، ومنعطفات هادئة، ونظام تخطيط المسارات في كار سوشيال اختار المسار الجبلي الأكثر متعة!',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    location: 'Jebel Jais Scenic Highway, Ras Al Khaimah',
    createdAt: '8 hours ago',
    likesCount: 219,
    isLiked: true,
    commentsCount: 24,
    sharesCount: 19,
    isAiRecommended: true,
    aiRecommendationReason: 'AI Recommended: Top-ranked drive route within 150km of your location',
    aiRecommendationReasonAr: 'توصية الذكاء الاصطناعي: مسار قيادة سياحي حاصل على أعلى تقييم ضمن نطاق 150 كم',
    hashtags: ['BMWM', 'M3Touring', 'JebelJais', 'ScenicDrive'],
    comments: [
      {
        id: 'c_3',
        authorName: 'Layla Al-Mansouri',
        authorAvatar: currentUserMock.avatar,
        text: 'That Isle of Man Green matches the sunrise rocks so well. Adding this waypoint to our calendar!',
        createdAt: '7 hours ago'
      }
    ]
  },
  {
    id: 'post_3',
    authorId: 'usr_rashid',
    authorName: 'Rashid K.',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    authorPlateMasked: 'DXB • S ••• 88',
    isVerified: true,
    taggedVehicle: {
      make: 'Nissan',
      model: 'GT-R Nismo (R35)',
      year: 2022,
      plateMasked: 'DXB • S ••• 88'
    },
    content: 'Full carbon dry-weave aero installed before winter track season. Weight reduction verified on digital scales. Ready for the Yas Marina Time Attack event next week! 🛡️⚡',
    contentAr: 'تركيب قطع الكاربون فايبر بالكامل قبل انطلاق موسم الحلبات الشتوي. تخفيف الوزن موثق بالأرقام وجاهزون لفعالية ياس مارينا الأسبوع القادم!',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    location: 'Yas Marina Circuit Paddock, Abu Dhabi',
    createdAt: '1 day ago',
    likesCount: 389,
    isLiked: false,
    commentsCount: 31,
    sharesCount: 44,
    isAiRecommended: false,
    hashtags: ['GTR', 'Nismo', 'R35', 'TimeAttack'],
    comments: []
  }
];

export const sampleCommunities: Community[] = [
  {
    id: 'comm_porsche',
    name: 'Porsche Club Gulf Chapter',
    nameAr: 'نادي بورش الخليجي المعتمد',
    slug: 'porsche-gulf',
    category: 'brand',
    categoryAr: 'علامة تجارية',
    description: 'The premier verified gathering for 911, Cayman, Boxster and GT owners across the GCC. Official track days, morning coffee runs and technical masterclasses.',
    descriptionAr: 'التجمع المعتمد لملاك سيارات بورش في دول الخليج. فعاليات الحلبات وجولات الصباح وورش العمل الفنية المتخصصة.',
    coverImage: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://images.unsplash.com/photo-1611821064430-09477e69a9e3?auto=format&fit=crop&w=200&q=80',
    membersCount: 1420,
    isJoined: true,
    isPrivate: false,
    isVerifiedClub: true,
    rules: [
      'Official verified vehicle ownership required for paddock access',
      'No reckless driving or illegal street racing displays (BR-3 strictly enforced)',
      'Plate masking respected in all shared media',
      'Support fellow members with technical knowledge & advice'
    ],
    rulesAr: [
      'توثيق ملكية المركبة إلزامي لدخول فعاليات الحلبة والتجمع',
      'منع استعراضات القيادة المتهورة أو السباقات غير المرخصة تماماً (قاعدة BR-3)',
      'الالتزام بتمويه أرقام اللوحات في كافة الصور المشتركة',
      'دعم الأعضاء بالمعلومات والخبرات الفنية والهندسية'
    ],
    location: 'Dubai & Abu Dhabi',
    pinnedPost: '🏆 Registration open for Yas Marina Night Track Session - Limit 35 cars!'
  },
  {
    id: 'comm_mpower',
    name: 'M-Power Arabia Collective',
    nameAr: 'رابطة ملاك بي إم دبليو إم باور',
    slug: 'mpower-arabia',
    category: 'brand',
    categoryAr: 'علامة تجارية',
    description: 'Celebrating true Bavarian motorsport heritage from E30 M3 to modern G8X platforms. Dedicated to spirited mountain drives and dyno days.',
    descriptionAr: 'احتفاء بأسطورة إم باور من الكلاسيك وحتى أحدث الموديلات. جولات جبلية وأيام قياس القوة الحصانية.',
    coverImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=200&q=80',
    membersCount: 980,
    isJoined: false,
    isPrivate: false,
    isVerifiedClub: true,
    rules: [
      'M-Chassis & M-Performance vehicles only',
      'Respect convoy spacing during mountain passes',
      'Keep discussions respectful and automotive-focused'
    ],
    location: 'UAE, Saudi Arabia & Kuwait'
  },
  {
    id: 'comm_track',
    name: 'Time Attack & Circuit Drivers',
    nameAr: 'مجتمع سائقي الحلبات وتايم أتاك',
    slug: 'track-attack',
    category: 'track',
    categoryAr: 'حلبات ورياضة',
    description: 'Open to all makes and models built for apex hunting. Telemetry sharing, tire pressure discussions and track reservation coordination.',
    descriptionAr: 'مفتوح لكافة المركبات المجهزة للحلبات. مشاركة بيانات التليمتري ومقاييس الإطارات وتنسيق أوقات الحلبات.',
    coverImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1000&q=80',
    avatar: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=200&q=80',
    membersCount: 2310,
    isJoined: true,
    isPrivate: false,
    isVerifiedClub: true,
    rules: [
      'Helmet & FIA safety compliance enforced at all meets',
      'Constructive critique only on driver onboard footage'
    ],
    location: 'Regional Circuits (Dubai, Yas, BIC, Lusail)'
  }
];

export const sampleEvents: Event[] = [
  {
    id: 'evt_jebel_jais',
    title: 'Dawn Mountain Drive & Coffee Summit',
    titleAr: 'جولة قمة جبل جيس الصباحية ولقاء القهوة',
    type: 'group_drive',
    typeAr: 'جولة قيادة جماعية',
    organizerName: 'Omar Al-Hassan',
    organizerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    communityId: 'comm_porsche',
    date: 'Saturday, 18 Oct 2026',
    time: '05:30 AM GST',
    location: 'Enoc Ras Al Khaimah (Staging Point) -> Jebel Jais Summit',
    locationAr: 'محطة إينوك رأس الخيمة (نقطة التجمع) -> قمة جبل جيس',
    description: 'Experience 30 kilometers of sweeping switchbacks and smooth asphalt with zero morning traffic. Strict convoy discipline, walkie-talkie channel 4, professional automotive photographer stationed at Hairpin 12. Regroup and artisan breakfast at Puro Summit Lounge.',
    descriptionAr: 'استمتع بـ 30 كيلومتراً من المنعطفات الجبلية الساحرة مع انعدام الحركة المرورية في الفجر. التزام تام بقواعد الموكب ومصور محترف عند المنعطف 12، يعقبه إفطار في مطعم القمة.',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    capacity: 40,
    attendeesCount: 38,
    waitlistCount: 6,
    userRsvp: 'going', // Current user RSVP state
    routes: [
      {
        id: 'rt_scenic_pass',
        name: 'Jebel Jais Canyon Ridge & Hairpins',
        nameAr: 'مسار قمم جبل جيس والمنعطفات الحادة',
        scenicScore: 96, // Follow-up Prompt 3 requirement
        distanceKm: 78.4,
        estimatedMinutes: 62,
        highlights: ['Sweeping canyon vistas', 'Hairpin 12 photo stop', 'Fresh alpine asphalt', 'Summit elevation 1,934m'],
        highlightsAr: ['إطلالات جبلية مذهلة', 'نقطة تصوير المنعطف 12', 'إسفلت حديث عالي التماسك', 'ارتفاع القمة 1,934 متر'],
        type: 'canyon',
        recommendedPace: 'Spirited Convoy (Staggered)',
        recommendedPaceAr: 'موكب نشط متباعد'
      },
      {
        id: 'rt_coastal_approach',
        name: 'Coastal Corniche & Mangrove Bypass',
        nameAr: 'مسار كورنيش الساحل ومحمية القرم',
        scenicScore: 87,
        distanceKm: 92.1,
        estimatedMinutes: 84,
        highlights: ['Sea views along Al Marjan', 'Mangrove reserve bridge', 'Marina regroup stop'],
        highlightsAr: ['إطلالة بحرية عبر جزيرة المرجان', 'جسر محمية القرم', 'استراحة في المارينا'],
        type: 'coastal',
        recommendedPace: 'Cruising Pace',
        recommendedPaceAr: 'سرعة سياحية معتدلة'
      },
      {
        id: 'rt_express_highway',
        name: 'Emirates Road E611 Direct Transit',
        nameAr: 'طريق الإمارات العابر السريع E611',
        scenicScore: 44,
        distanceKm: 65.0,
        estimatedMinutes: 45,
        highlights: ['Illuminated multi-lane expressway', 'Fastest transit time', 'Cruise control optimized'],
        highlightsAr: ['طريق سريع متعدد المسارات', 'أقصر وقت وصول', 'مثالي للسرعة الثابتة'],
        type: 'expressway',
        recommendedPace: 'Highway Transit',
        recommendedPaceAr: 'انتقال سريع'
      }
    ],
    chatMessages: [
      {
        id: 'msg_evt_1',
        senderId: 'usr_omar',
        senderName: 'Omar Al-Hassan',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        text: 'Good evening team! Weather forecast predicts a brisk 19°C at the summit. Please fuel up at the ENOC staging point before 05:20 AM.',
        timestamp: 'Yesterday at 8:30 PM'
      },
      {
        id: 'msg_evt_2',
        senderId: 'usr_layla',
        senderName: 'Layla Al-Mansouri',
        senderAvatar: currentUserMock.avatar,
        text: 'Tires are torqued and radios charged! Looking forward to the convoy.',
        timestamp: 'Yesterday at 9:15 PM',
        isOwn: true
      },
      {
        id: 'msg_evt_3',
        senderId: 'usr_rashid',
        senderName: 'Rashid K.',
        senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
        text: 'Bringing drone for the Hairpin 12 flyby. Organizers approved the permit 👍',
        timestamp: 'Today at 07:10 AM'
      }
    ]
  },
  {
    id: 'evt_yas_track',
    title: 'Yas Marina South Circuit Track Night',
    titleAr: 'أمسية حلبة ياس مارينا الجنوبية المفتوحة',
    type: 'track_day',
    typeAr: 'يوم حلبة وتجارب سرعة',
    organizerName: 'Sara Lindqvist',
    organizerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    communityId: 'comm_track',
    date: 'Friday, 24 Oct 2026',
    time: '07:00 PM GST',
    location: 'Yas Marina Circuit F1 Paddock, Abu Dhabi',
    locationAr: 'حلبة مرسى ياس - بادوك الفورمولا 1، أبوظبي',
    description: '3 hours of open pit lane driving under the Yas Marina floodlights. Live transponder timing, tire technical support, and debrief lounge. Mandatory safety briefing at 18:30.',
    descriptionAr: '3 ساعات من القيادة في مسار الحلبة المفتوح تحت أضواء ياس مارينا الكاشفة مع توقيت إلكتروني ودعم فني للإطارات.',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    capacity: 35,
    attendeesCount: 35, // Full capacity to trigger waitlist!
    waitlistCount: 14,
    userRsvp: 'waitlisted',
    routes: [],
    chatMessages: []
  },
  {
    id: 'evt_cars_coffee',
    title: 'Meydan Paddock Cars & Specialty Coffee',
    titleAr: 'تجمع ميدان للسيارات والقهوة المختصة',
    type: 'cars_and_coffee',
    typeAr: 'لقاء قهوة واستعراض سيارات',
    organizerName: 'Porsche Club Gulf Chapter',
    organizerAvatar: 'https://images.unsplash.com/photo-1611821064430-09477e69a9e3?auto=format&fit=crop&w=200&q=80',
    communityId: 'comm_porsche',
    date: 'Saturday, 1 Nov 2026',
    time: '07:30 AM GST',
    location: 'The Meydan Hotel Grandstand Boulevard, Dubai',
    locationAr: 'بوليفارد فندق ميدان، دبي',
    description: 'Relaxed morning social meet for classic sports cars, homologation specials, and verified enthusiasts. High-grade espresso bar and curated lineup.',
    descriptionAr: 'لقاء صباحي أنيق للسيارات الرياضية الكلاسيكية والمميزة مع قهوة مختصة وتصوير احترافي.',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    capacity: 100,
    attendeesCount: 64,
    waitlistCount: 0,
    userRsvp: 'maybe',
    routes: [],
    chatMessages: []
  }
];

export const sampleConversations: Conversation[] = [
  {
    id: 'conv_omar',
    participantId: 'usr_omar',
    participantName: 'Omar Al-Hassan',
    participantAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    participantPlateMasked: 'AUH • C ••• 02',
    isVerified: true,
    isRequest: false,
    lastMessage: 'Let’s sync radio frequencies at the morning staging point!',
    lastMessageTime: '10:42 AM',
    unreadCount: 0,
    messages: [
      {
        id: 'm1',
        senderId: 'usr_omar',
        senderName: 'Omar Al-Hassan',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        text: 'Hey Layla! Are you bringing the GT3 on Cup 2 Rs or standard sport rubber for Saturday?',
        timestamp: '10:30 AM'
      },
      {
        id: 'm2',
        senderId: 'usr_layla',
        senderName: 'Layla Al-Mansouri',
        senderAvatar: currentUserMock.avatar,
        text: 'Sticking with the Cup 2 Rs. Pressure set to 2.0 bar cold. We should get crisp steering response on the ridge.',
        timestamp: '10:35 AM',
        isOwn: true
      },
      {
        id: 'm3',
        senderId: 'usr_omar',
        senderName: 'Omar Al-Hassan',
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        text: 'Let’s sync radio frequencies at the morning staging point!',
        timestamp: '10:42 AM'
      }
    ]
  },
  {
    id: 'conv_req_1',
    participantId: 'usr_unknown_spotted',
    participantName: 'Farhan M. (GT4 RS Owner)',
    participantAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    participantPlateMasked: 'DXB • K ••• 19',
    isVerified: true,
    isRequest: true, // MESSAGE REQUEST INBOX (FR-MSG-04)
    lastMessage: 'Spotted your Shark Blue 992 GT3 near City Walk! Loved the BBS wheels. Are you part of the GCC Track group?',
    lastMessageTime: 'Yesterday',
    unreadCount: 1,
    messages: [
      {
        id: 'mr1',
        senderId: 'usr_unknown_spotted',
        senderName: 'Farhan M.',
        senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        text: 'Spotted your Shark Blue 992 GT3 near City Walk! Loved the BBS wheels. Are you part of the GCC Track group?',
        timestamp: 'Yesterday at 4:15 PM'
      }
    ]
  }
];

export const sampleModerationItems: ModerationItem[] = [
  {
    id: 'mod_item_1',
    type: 'post',
    targetTitle: 'Reckless Speed Run on Public Highway E11',
    reportedBy: 'AI Content Moderation Classifier (AI-NN-05)',
    authorName: 'TurboSpeedster_99',
    authorPlateMasked: 'SHJ • X ••• 91',
    reportedReason: 'Violation of Rule BR-3: Video content promoting illegal street racing / reckless public driving exceeding speed thresholds.',
    reportedReasonAr: 'مخالفة القاعدة BR-3: محتوى يروج للسباقات غير القانونية والقيادة المتهورة على الطرق العامة.',
    severity: 'high',
    aiConfidence: 94.6,
    aiFlagRule: 'AI-RULE-BR3-STREET-RACING-DETECTION',
    aiExplanation: 'Neural video frame analysis detected speedometer overlay readout of 245 km/h in urban zone and weaving across 4 traffic lanes without indicators.',
    aiExplanationAr: 'تحليل إطارات الفيديو بالذكاء الاصطناعي رصد مؤشر سرعة 245 كم/ساعة ومناورات خطرة بين السيارات.',
    status: 'pending',
    createdAt: '15 mins ago',
    mediaUrl: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600&q=80',
    textContent: 'Testing the new twin-turbo map on E11 highway at 3am! Unbeatable top speed 🚀😈'
  },
  {
    id: 'mod_item_2',
    type: 'plate_dispute',
    targetTitle: 'Plate Ownership Dispute: DXB • L 44102',
    reportedBy: 'System Registry Discrepancy (UC-16 / FR-ADM-04)',
    authorName: 'Hamad Al-Kaabi vs. Previous Holder',
    authorPlateMasked: 'DXB • L ••• 02',
    reportedReason: 'Two members claimed primary ownership of plate DXB • L 44102 following vehicle resale.',
    reportedReasonAr: 'نزاع على ملكية اللوحة DXB • L 44102 بين مالكين بعد بيع المركبة.',
    severity: 'medium',
    aiConfidence: 89.0,
    aiFlagRule: 'AI-RB-01-RPA-REGISTRY-DISPUTE',
    aiExplanation: 'OCR scan of newly uploaded vehicle registration card shows transfer stamp dated 3 days ago. Needs human verification to reassign primary garage badge.',
    aiExplanationAr: 'المسح الضوئي لملكية المركبة يُظهر ختم نقل الملكية قبل 3 أيام. يتطلب توثيق المشرف لاعتماد نقل الملكية.',
    status: 'pending',
    createdAt: '1 hour ago',
    textContent: 'New owner submitted electronic Mulkiya card transfer proof from Roads & Transport Authority.'
  },
  {
    id: 'mod_item_3',
    type: 'comment',
    targetTitle: 'Toxic Harassment Flag in Event Chat',
    reportedBy: 'AI-NLP-02 Multilingual Moderation Model',
    authorName: 'RacerBoy_DXB',
    authorPlateMasked: 'DXB • H ••• 17',
    reportedReason: 'Aggressive insults and targeted toxicity detected in community comment thread.',
    reportedReasonAr: 'ألفاظ مسيئة وسلوك غير لائق تم رصده في محادثة الفعالية بواسطة الذكاء الاصطناعي.',
    severity: 'medium',
    aiConfidence: 96.2,
    aiFlagRule: 'AI-NLP-02-TOXICITY-FILTER-AR/EN',
    aiExplanation: 'Natural language analysis detected derogatory language and intimidation directed at another driver.',
    aiExplanationAr: 'تحليل اللغة الطبيعية رصد عبارات تنمر وإهانة موجهة لسائق آخر.',
    status: 'pending',
    createdAt: '2 hours ago',
    textContent: 'Your car is junk and you shouldn’t even show up to the track, stay home!'
  }
];

// Helper: Plate Display Formatter (Satisfies Rule: Plates are masked by default!)
export function formatPlateNumber(plate: string, regionCode: string = 'DXB', mode: PlateDisplayMode = 'masked'): string {
  if (mode === 'hidden') {
    return '••••••••';
  }
  if (mode === 'full') {
    return `${regionCode} • ${plate}`;
  }
  // Masked by default: e.g. "A 19242" -> "DXB • A ••• 42"
  const parts = plate.trim().split(' ');
  if (parts.length >= 2) {
    const code = parts[0];
    const num = parts[1];
    const lastTwo = num.length > 2 ? num.slice(-2) : num;
    return `${regionCode} • ${code} ••• ${lastTwo}`;
  }
  // Single string fallback
  if (plate.length > 3) {
    return `${regionCode} ••• ${plate.slice(-2)}`;
  }
  return `${regionCode} •••`;
}

// Follow-up Prompt 1: Fuzzy Plate Search Algorithm
// Tolerates 0/O, 1/I, 8/B confusion, spaces, dashes
export interface FuzzyPlateMatchResult {
  vehicle: Vehicle;
  matchScore: number; // 0 - 100
  isFuzzyMatched: boolean;
  reasons: string[];
}

export function fuzzySearchPlates(query: string, vehicles: Vehicle[]): FuzzyPlateMatchResult[] {
  if (!query || query.trim() === '') {
    return vehicles.map(v => ({
      vehicle: v,
      matchScore: 100,
      isFuzzyMatched: false,
      reasons: []
    }));
  }

  const normalize = (str: string) => {
    return str
      .toUpperCase()
      .replace(/[\s\-_.]/g, '')
      .replace(/O/g, '0')
      .replace(/I/g, '1')
      .replace(/B/g, '8');
  };

  const normQuery = normalize(query);
  const rawQuery = query.toLowerCase().trim();

  const results: FuzzyPlateMatchResult[] = [];

  for (const v of vehicles) {
    const normPlate = normalize(v.plateNumber);
    const rawPlate = v.plateNumber.toLowerCase();
    const makeModel = `${v.make} ${v.model} ${v.trim} ${v.color}`.toLowerCase();

    // Check exact or partial plate
    if (rawPlate.includes(rawQuery) || rawQuery.includes(rawPlate)) {
      results.push({
        vehicle: v,
        matchScore: 100,
        isFuzzyMatched: false,
        reasons: ['Exact Plate Substring Match']
      });
      continue;
    }

    // Check fuzzy normalized plate (0/O, 1/I, 8/B tolerance)
    if (normPlate === normQuery) {
      results.push({
        vehicle: v,
        matchScore: 98,
        isFuzzyMatched: true,
        reasons: ['Fuzzy Match: Tolerated 0/O or 1/I or 8/B character substitution']
      });
      continue;
    }

    if (normPlate.includes(normQuery) || normQuery.includes(normPlate)) {
      const matchPct = Math.round((Math.min(normPlate.length, normQuery.length) / Math.max(normPlate.length, normQuery.length)) * 92);
      results.push({
        vehicle: v,
        matchScore: Math.max(matchPct, 82),
        isFuzzyMatched: true,
        reasons: [`Partial Fuzzy Match: ${matchPct}% string alignment (OCR tolerance)`]
      });
      continue;
    }

    // Check Natural Language / Make / Model / Year / Modifications
    if (makeModel.includes(rawQuery)) {
      results.push({
        vehicle: v,
        matchScore: 90,
        isFuzzyMatched: false,
        reasons: ['Vehicle Make/Model/Trim Match']
      });
      continue;
    }

    // Check individual tokens
    const queryTokens = rawQuery.split(' ');
    const matchedTokens = queryTokens.filter(t => makeModel.includes(t) || v.year.toString().includes(t));
    if (matchedTokens.length > 0) {
      const tokenScore = Math.round((matchedTokens.length / queryTokens.length) * 85);
      results.push({
        vehicle: v,
        matchScore: tokenScore,
        isFuzzyMatched: false,
        reasons: [`Natural Language Match: Matched keywords [${matchedTokens.join(', ')}]`]
      });
    }
  }

  return results.sort((a, b) => b.matchScore - a.matchScore);
}

// Follow-up Prompt 2: Maintenance Advisor (AI-ES-01 / AI-ES-04 / AI-FZ-04)
// Evaluates mileage & last service date with expert rules & fuzzy urgency inference
export interface MaintenanceAdviceResult {
  status: 'service_soon' | 'overdue' | 'healthy';
  urgencyLevel: 'High' | 'Medium' | 'Low';
  fuzzyUrgencyScore: number; // 0-100%
  summary: string;
  summaryAr: string;
  rulesFired: Array<{
    ruleId: string;
    description: string;
    factUsed: string;
  }>;
  nextRecommendedService: string;
}

export function evaluateMaintenanceAdvisor(vehicle: Vehicle, currentOdoKm?: number, lastServiceDateStr?: string): MaintenanceAdviceResult {
  const odo = currentOdoKm !== undefined ? currentOdoKm : vehicle.odometerKm;
  const lastDate = lastServiceDateStr || vehicle.lastServiceDate;
  const lastOdo = vehicle.lastServiceMileage;

  const kmSinceService = Math.max(0, odo - lastOdo);
  const serviceDateObj = new Date(lastDate);
  const now = new Date('2026-10-04');
  const monthsSinceService = Math.max(0, (now.getFullYear() - serviceDateObj.getFullYear()) * 12 + (now.getMonth() - serviceDateObj.getMonth()));

  const rulesFired: Array<{ ruleId: string; description: string; factUsed: string }> = [];

  let urgencyScore = 0;

  // Rule 1: High-RPM Sports Engine Oil Degradation Rule (Flat-6 & Twin Turbo)
  if (kmSinceService >= 6000 || monthsSinceService >= 10) {
    rulesFired.push({
      ruleId: 'RULE-ES-ENG-01',
      description: 'High-revving performance flat-6 engine requires synthetic oil & filter change every 6,000km or 10 months.',
      factUsed: `Current interval: ${kmSinceService.toLocaleString()} km and ${monthsSinceService} months since last oil change.`
    });
    urgencyScore += 45;
  }

  // Rule 2: Brake Fluid Hygroscopic Moisture Absorption Rule
  if (monthsSinceService >= 12) {
    rulesFired.push({
      ruleId: 'RULE-ES-BRK-03',
      description: 'DOT 4 / Racing brake fluid absorbs ambient humidity; annual flush mandatory for track vehicle safety.',
      factUsed: `${monthsSinceService} months elapsed since last certified hydraulic fluid flush.`
    });
    urgencyScore += 35;
  }

  // Rule 3: Carbon Ceramic / High Performance Pad & Rotor Wear Threshold
  if (odo >= 18000) {
    rulesFired.push({
      ruleId: 'RULE-ES-BRK-04',
      description: 'Track-interval carbon-ceramic brake pad thickness and rotor micro-crack inspection recommended at 18,000km.',
      factUsed: `Vehicle odometer reached ${odo.toLocaleString()} km.`
    });
    urgencyScore += 20;
  }

  // Fuzzy Urgency membership calculation
  urgencyScore = Math.min(100, Math.max(10, urgencyScore));

  let urgencyLevel: 'High' | 'Medium' | 'Low' = 'Low';
  let status: 'service_soon' | 'overdue' | 'healthy' = 'healthy';
  let summary = 'Vehicle systems within safe operating thresholds. No urgent maintenance required.';
  let summaryAr = 'أنظمة المركبة ضمن الحدود التشغيلية الآمنة. لا توجد صيانة طارئة مطلوبة.';

  if (urgencyScore >= 75) {
    urgencyLevel = 'High';
    status = 'overdue';
    summary = 'Service overdue! Multiple safety and performance thresholds reached.';
    summaryAr = 'الصيانة متأخرة! تم تجاوز معايير السلامة والأداء للمحرك والمكابح.';
  } else if (urgencyScore >= 40) {
    urgencyLevel = 'Medium';
    status = 'service_soon';
    summary = 'Service soon! Service scheduled within 500 km or 30 days recommended.';
    summaryAr = 'يوصى بالصيانة قريباً! يفضل حجز موعد خلال 500 كم أو شهر.';
  }

  return {
    status,
    urgencyLevel,
    fuzzyUrgencyScore: urgencyScore,
    summary,
    summaryAr,
    rulesFired,
    nextRecommendedService: 'Comprehensive Track Inspection & Fluid Service'
  };
}
