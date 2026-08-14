import { Course, DownloadableResource, LeaderboardUser, Mentor, Question, StudentProfile } from '../types';
import { mentorSiyamImage, mentorTahsinImage, mentorAbidImage } from '../assets/images';

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  id: 'std-2028-089',
  name: 'Md. Arafat Hossain',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  email: 'arafat.hossain@medispark.edu.bd',
  phone: '+880 1712-345678',
  batch: 'HSC 28 Batch / Medical Aspirant',
  college: 'Dhaka College, Dhaka',
  targetMedicalCollege: 'Dhaka Medical College (DMC)',
  enrolledCoursesCount: 2,
  streakDays: 19,
  streakActiveToday: true,
  weeklyStreak: [
    { day: 'Sat', studied: true, hours: 3.5 },
    { day: 'Sun', studied: true, hours: 4.2 },
    { day: 'Mon', studied: true, hours: 3.8 },
    { day: 'Tue', studied: true, hours: 5.1 },
    { day: 'Wed', studied: true, hours: 4.0 },
    { day: 'Thu', studied: true, hours: 4.8 },
    { day: 'Fri', studied: true, hours: 2.5 },
  ],
  todayStudyTarget: {
    targetMinutes: 240,
    completedMinutes: 180,
    topics: [
      { id: 't1', title: 'Botany: Photosynthesis (C3 vs C4 Pathway)', subject: 'Biology', done: true },
      { id: 't2', title: 'Zoology: Human Circulatory System & Cardiac Cycle', subject: 'Biology', done: true },
      { id: 't3', title: 'Chemistry: Alkyl Halide SN1 & SN2 Mechanisms', subject: 'Chemistry', done: true },
      { id: 't4', title: 'Physics: Thermodynamics Carnot Engine Efficiency', subject: 'Physics', done: false },
      { id: 't5', title: 'Medical English: Idioms & Subject-Verb Agreement', subject: 'English & GK', done: false },
    ],
  },
  rank: 14,
  totalStudents: 3420,
  overallScore: 88.5,
  meritPercentile: 99.4,
  completedClasses: 64,
  totalClasses: 80,
  upcomingLiveClasses: [
    {
      id: 'live-101',
      title: 'High-Yield Medical Zoology: Human Genetics & Blood Grouping',
      subject: 'Biology',
      mentorName: 'Md. Siyam Talukder',
      mentorDegree: 'MBBS, ShSMC',
      time: '08:00 PM',
      date: 'Today',
      isLiveNow: true,
      joinLink: '#',
    },
    {
      id: 'live-102',
      title: 'Organic Chemistry Medical Special: Named Reactions & Polymers',
      subject: 'Chemistry',
      mentorName: 'Dr. Tanvir Ahmed',
      mentorDegree: 'MBBS, DMC',
      time: '07:30 PM',
      date: 'Tomorrow',
      isLiveNow: false,
    },
    {
      id: 'live-103',
      title: 'Physics Vectors & Dynamics: 30-Sec Elimination Shortcut Tricks',
      subject: 'Physics',
      mentorName: 'Engr. Rakibul Hasan',
      mentorDegree: 'BUET (Ex-Medical Aspirant)',
      time: '06:00 PM',
      date: 'Saturday',
      isLiveNow: false,
    }
  ],
  recentMockResults: [
    {
      id: 'res-301',
      examTitle: 'Medical Central Model Test - 08 (Full Syllabus)',
      subject: 'Complete Medical Syllabus',
      date: 'Aug 12, 2026',
      score: 87.75,
      totalMarks: 100,
      negativeMarks: 1.25,
      accuracy: 94.2,
      rank: 14,
      totalParticipants: 3420,
      subjectBreakdown: [
        { subject: 'Biology (30)', score: 28.5, total: 30 },
        { subject: 'Chemistry (25)', score: 22.0, total: 25 },
        { subject: 'Physics (20)', score: 17.25, total: 20 },
        { subject: 'English (15)', score: 12.5, total: 15 },
        { subject: 'GK (10)', score: 7.5, total: 10 },
      ]
    },
    {
      id: 'res-302',
      examTitle: 'Biology Paper I & II Grand Revision Mock',
      subject: 'Biology',
      date: 'Aug 08, 2026',
      score: 46.5,
      totalMarks: 50,
      negativeMarks: 0.5,
      accuracy: 96.0,
      rank: 9,
      totalParticipants: 2850,
      subjectBreakdown: [
        { subject: 'Botany', score: 23.5, total: 25 },
        { subject: 'Zoology', score: 23.0, total: 25 },
      ]
    },
    {
      id: 'res-303',
      examTitle: 'Chemistry Chapterwise Rapid Fire - Organic Chemistry',
      subject: 'Chemistry',
      date: 'Aug 04, 2026',
      score: 21.75,
      totalMarks: 25,
      negativeMarks: 0.75,
      accuracy: 89.5,
      rank: 38,
      totalParticipants: 2100,
      subjectBreakdown: [
        { subject: 'Organic Reactions', score: 12.0, total: 15 },
        { subject: 'Identification Tests', score: 9.75, total: 10 },
      ]
    }
  ],
  weakTopics: [
    {
      id: 'weak-1',
      subject: 'Biology',
      topicName: 'Genetics: Linkage, Crossing Over & Gene Interactions',
      chapter: 'Zoology Chapter 11',
      accuracy: 58,
      suggestedAction: 'Review Dr. Siyam Talukder’s Mnemonic Chart on Epistasis ratios (9:7, 13:3, 9:3:4)',
      recommendedLessonId: 'les-gen-01',
      recommendedLessonTitle: 'Epistasis & Non-Mendelian Ratios Demystified'
    },
    {
      id: 'weak-2',
      subject: 'Chemistry',
      topicName: 'Periodic Trends & d-Block Complex Ion Colors',
      chapter: 'Chemistry 1st Paper Chapter 3',
      accuracy: 64,
      suggestedAction: 'Practice the 20 High-Yield Transition Metal Color MCQs from past 10 years medical exams',
      recommendedLessonId: 'les-chem-04',
      recommendedLessonTitle: 'Transition Elements Color & Magnetic Properties Shortcut'
    },
    {
      id: 'weak-3',
      subject: 'Physics',
      topicName: 'Modern Physics & Semiconductor Logic Gates',
      chapter: 'Physics 2nd Paper Chapter 10',
      accuracy: 62,
      suggestedAction: 'Master truth tables and photoelectric work function formulas (E = hf - W)',
      recommendedLessonId: 'les-phy-02',
      recommendedLessonTitle: 'Photoelectric Effect & Semiconductor Medical High-Yields'
    }
  ],
  notifications: [
    {
      id: 'notif-1',
      title: '🔴 Live Class Alert: Zoology Genetics Tonight',
      message: 'Dr. Md. Siyam Talukder is going live at 08:00 PM with exclusive question solving.',
      timestamp: '15 mins ago',
      read: false,
      type: 'live'
    },
    {
      id: 'notif-2',
      title: '🎯 Merit Result Published: Central Model Test - 08',
      message: 'You scored 87.75/100 and achieved Rank 14 out of 3,420 aspirants! View scorecard.',
      timestamp: '2 hours ago',
      read: false,
      type: 'result'
    },
    {
      id: 'notif-3',
      title: '📚 New Resource Uploaded: Medical Mnemonics Handbook 2025',
      message: 'Download the comprehensive PDF for quick revision before exams.',
      timestamp: 'Yesterday',
      read: true,
      type: 'announcement'
    }
  ]
};

export const MENTORS_DATA: Mentor[] = [
  {
    id: 'siyam-talukder',
    name: 'Md. Siyam Talukder',
    degree: 'MBBS, ShSMC',
    college: 'Shaheed Suhrawardy Medical College',
    role: 'Founder & Lead Mentor',
    specialty: 'Founder of MediSpark • Developer of MediSpark Website',
    experienceYears: 6,
    studentsMentored: 18500,
    bio: 'Founder and Lead Academic Mentor of MediSpark, and Developer of the MediSpark learning platform. Dedicated to medical admission biology excellence, interactive question banks, and guiding students to top medical college ranks with simplified concepts.',
    imagePath: mentorSiyamImage,
    quote: 'Consistent daily revision and precision question solving are the twin pillars of cracking the medical admission merit list.',
    badge: 'Founder & Lead Mentor',
    featured: true,
    isEmpty: false,
    titles: [
      'MBBS, ShSMC',
      'Founder of MediSpark',
      'Developer of MediSpark Website'
    ]
  },
  {
    id: 'tahsin-islam-ananta',
    name: 'Tahsin Islam Ananta',
    degree: 'MBBS, ShSMC',
    college: 'Shaheed Suhrawardy Medical College',
    role: 'Co-Founder of MediSpark',
    specialty: 'Co-Founder of MediSpark • Medical Admission Specialist',
    experienceYears: 5,
    studentsMentored: 14000,
    bio: 'Co-Founder of MediSpark. Dedicated to medical admission excellence, conceptual clarity, and strategic test preparation for HSC and Medical aspirants across Bangladesh.',
    imagePath: mentorTahsinImage,
    quote: 'Focused concept mastery and clinical understanding turn challenging biology chapters into your highest scoring strengths.',
    badge: 'Co-Founder',
    featured: true,
    isEmpty: false,
    titles: [
      'MBBS, ShSMC',
      'Co-Founder of MediSpark'
    ]
  },
  {
    id: 'abid-hasan-omi',
    name: 'Abid Hasan Omi',
    degree: 'MBBS, ShSMC',
    college: 'Shaheed Suhrawardy Medical College',
    role: 'Co-Founder of MediSpark',
    specialty: 'Co-Founder of MediSpark • Medical Admission Specialist',
    experienceYears: 5,
    studentsMentored: 15000,
    bio: 'Co-Founder of MediSpark. Dedicated to medical admission excellence, high-yield problem solving, and comprehensive mentorship for HSC & Medical aspirants.',
    imagePath: mentorAbidImage,
    quote: 'Smart strategies, continuous revision, and disciplined practice are the real keys to securing your dream medical seat.',
    badge: 'Co-Founder',
    featured: true,
    isEmpty: false,
    titles: [
      'MBBS, ShSMC',
      'Co-Founder of MediSpark'
    ]
  },
  {
    id: 'mentor-slot-4',
    name: 'Mentor Slot 04',
    degree: 'Medical Faculty',
    college: 'To Be Announced',
    role: 'UPCOMING MENTOR',
    specialty: 'Department of Medical Sciences',
    experienceYears: 0,
    studentsMentored: 0,
    bio: 'Profile opening soon. Our next specialist mentor will be announced for upcoming academic and admission sessions.',
    imagePath: '',
    badge: 'Opening Soon',
    featured: false,
    isEmpty: true,
  },
  {
    id: 'mentor-slot-5',
    name: 'Mentor Slot 05',
    degree: 'Medical Faculty',
    college: 'To Be Announced',
    role: 'UPCOMING MENTOR',
    specialty: 'Department of Medical Sciences',
    experienceYears: 0,
    studentsMentored: 0,
    bio: 'Profile opening soon. Our next specialist mentor will be announced for upcoming academic and admission sessions.',
    imagePath: '',
    badge: 'Opening Soon',
    featured: false,
    isEmpty: true,
  },
];

export const COURSES_DATA: Course[] = [
  {
    id: 'hsc-29-complete-biology',
    title: 'Complete Biology Course for HSC 29 Batch',
    subtitle: '100% Free Complete Botany & Zoology syllabus for HSC 29 batch with line-by-line textbook analysis (Abul Hasan & Gazi Ajmal), CQ creative solving & early medical foundation.',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1000&q=80',
    category: 'HSC Academic',
    targetBatch: 'HSC 29 Batch',
    level: 'Academic & Medical Pre-Foundation (2-Year Program)',
    price: 0,
    discountPrice: 0,
    isFree: true,
    rating: 5.0,
    reviewCount: 890,
    enrolledCount: 4100,
    totalClasses: 75,
    totalExams: 45,
    duration: 'Full 2-Year HSC 29 Cycle',
    badge: '🎁 100% FREE Course',
    featured: true,
    mentors: [MENTORS_DATA[0], MENTORS_DATA[1]],
    syllabus: [
      {
        title: 'Botany Complete Paper (Abul Hasan Line-by-Line for HSC 29)',
        lessons: [
          'Cell & Its Structure (Cytology, Cell Organelles & Ultra-Structure)',
          'Cell Division: Mitosis, Meiosis & Chromosomal Dynamics',
          'Biomolecules: Carbohydrates, Proteins, Lipids & Enzymes',
          'Plant Physiology: Photosynthesis (C3/C4), Respiration & Mineral Nutrition',
          'Biotechnology, Tissue Culture & Recombinant DNA Technology'
        ]
      },
      {
        title: 'Zoology Complete Paper (Gazi Ajmal Line-by-Line for HSC 29)',
        lessons: [
          'Animal Diversity & Classification (Non-Chordata to Chordata Diagnostic Keys)',
          'Human Physiology: Digestion, Absorption & Liver Metabolism',
          'Human Physiology: Blood Circulation, Heart Anatomy & 0.8s Cardiac Cycle',
          'Human Physiology: Respiration, Gas Transport, Excretion & Osmoregulation',
          'Human Genetics, Mendelian Exceptions & Epistasis Ratios'
        ]
      },
      {
        title: 'HSC 29 Board CQ 10/10 Mastery & Medical Pre-Foundation Solves',
        lessons: [
          'Creative Question (CQ) High-Yield Diagram Drawing & Labeling Secrets',
          'Board Standard 10/10 CQ Writing Strategy for All Education Boards',
          'Past 10 Years Board CQ & Medical Admission Question Solving'
        ]
      }
    ],
    features: [
      'Lectures directly conducted by Md. Siyam Talukder (MBBS, ShSMC) & Tahsin Islam Ananta',
      '100% NCTB & DGHS Line-by-Line Highlighted PDF Master Notes for HSC 29',
      'Exclusive 600+ Question Medical & Board Question Bank with Solutions',
      '45+ Chapterwise, Paper Final & Board Standard Model Tests',
      'Weekly Live Doubt Solving Sessions & Dedicated Q&A Mentorship'
    ]
  },
  {
    id: 'medical-admission-hsc-29',
    title: 'Medical Admission Course For HSC 29 Batch',
    subtitle: 'The premier 2-Year Long Integrated Medical Admission Program for HSC 29 Batch covering Biology, Chemistry, Physics, English & General Knowledge with 95 DGHS Central Model Tests.',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80',
    category: 'Medical Admission',
    targetBatch: 'HSC 29 Batch',
    level: '2-Year Comprehensive Medical Program',
    price: 11000,
    discountPrice: 7200,
    rating: 5.0,
    reviewCount: 760,
    enrolledCount: 3200,
    totalClasses: 145,
    totalExams: 95,
    duration: '2-Year Comprehensive Journey',
    badge: '🔥 Flagship HSC 29 Medical',
    featured: true,
    mentors: [MENTORS_DATA[0], MENTORS_DATA[1], MENTORS_DATA[2]],
    syllabus: [
      {
        title: 'Module 1: Comprehensive Medical Biology (Botany & Zoology In-Depth)',
        lessons: [
          'Cell Structure, Molecular Biology & Genetics Masterclass',
          'Human Physiology: Digestion, Circulation, Respiration & Excretion',
          'Endocrine, Nervous System, Sense Organs & Human Reproduction',
          'Plant Physiology, Plant Diversity, Breeding & Biotechnology'
        ]
      },
      {
        title: 'Module 2: Medical Chemistry Mastery',
        lessons: [
          'Atomic Structure, Periodic Table & Chemical Bonding High-Yields',
          'Organic Chemistry: Hydrocarbons to Reaction Mechanisms (SN1/SN2)',
          'Quantitative Chemistry, Equilibrium & Thermochemistry Shortcuts',
          'Electrochemistry & Environmental Chemistry Problem Solving'
        ]
      },
      {
        title: 'Module 3: Rapid Medical Physics (30-Sec Calculation Shortcuts)',
        lessons: [
          'Vectors, Motion, Dynamics & Gravitation (30-Sec Shortcuts)',
          'Work, Energy, Power & Fluid Mechanics',
          'Thermodynamics, Waves & Geometric Optics',
          'Current Electricity, Magnetism & Modern Physics'
        ]
      },
      {
        title: 'Module 4: Medical English & Bangladesh Affairs (GK)',
        lessons: [
          'Prepositions, Subject-Verb Agreement, Vocab & Idioms',
          'Bangabandhu, Liberation War & Historical Timeline of Bangladesh',
          'Current Health Affairs, Medical Discoveries & Nobel Prizes'
        ]
      },
      {
        title: 'Module 5: DGHS Standard 100-Mark Central Model Test Series (HSC 29 Special)',
        lessons: [
          '95 Central Model Tests with -0.25 Negative Marking & All-BD Merit Rank',
          'Instant bilingual explanations and personalized weak-topic AI diagnostics'
        ]
      }
    ],
    features: [
      '145+ Live Interactive Masterclasses by Medical Doctors from ShSMC & DMC',
      'Daily 50-Mark Live MCQ Tests with -0.25 Negative Marking & Instant Merit Rank',
      '95 Full-Length DGHS Standard 100-Mark Central Model Tests',
      'Complete MediSpark High-Yield Printed Handbooks & Lecture Notes Pack',
      '24/7 AI Tutor & Doubt Clearing Forum with Medical Mentors',
      'Personalized Rank Predictor and Weak-Area Diagnostic'
    ]
  },
  {
    id: 'hsc-28-complete-biology',
    title: 'Complete Biology Course for HSC 28 Batch',
    subtitle: '100% Free Complete Botany & Zoology syllabus for HSC 28 batch with line-by-line textbook analysis, CQ creative solving & medical foundation.',
    thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1000&q=80',
    category: 'HSC Academic',
    targetBatch: 'HSC 28 Batch',
    level: 'Academic & Medical Pre-Foundation',
    price: 0,
    discountPrice: 0,
    isFree: true,
    rating: 5.0,
    reviewCount: 1540,
    enrolledCount: 6200,
    totalClasses: 65,
    totalExams: 40,
    duration: 'Full HSC 28 Academic Cycle',
    badge: '🎁 100% FREE Course',
    featured: true,
    mentors: [MENTORS_DATA[0]],
    syllabus: [
      {
        title: 'Botany Complete Paper (Abul Hasan Line-by-Line)',
        lessons: [
          'Cell & Its Structure (Mastering Cell Organelles & Cytology)',
          'Cell Division: Mitosis, Meiosis & Chromosomal Dynamics',
          'Plant Physiology: Photosynthesis, Respiration & Enzymes',
          'Biotechnology, Tissue Culture & Recombinant DNA'
        ]
      },
      {
        title: 'Zoology Complete Paper (Gazi Ajmal Line-by-Line)',
        lessons: [
          'Animal Diversity & Classification (Chordata & Non-Chordata)',
          'Human Physiology: Digestion, Blood Circulation & Cardiac Cycle',
          'Human Physiology: Excretion, Movement & Locomotion, Coordination',
          'Human Genetics & Non-Mendelian Epistasis Ratios'
        ]
      },
      {
        title: 'Board CQ Mastery & 100% GPA 5.00 Guarantee',
        lessons: [
          'Creative Question (CQ) High-Yield Diagram Drawing Secrets',
          'CQ 10/10 Answering Strategy for All Education Boards',
          'Previous 5 Years Board Question In-Depth Solve'
        ]
      }
    ],
    features: [
      'Lectures directly conducted by Md. Siyam Talukder (MBBS, ShSMC)',
      '100% DGHS & NCTB Line-by-Line Highlighted PDF Master Notes',
      'Exclusive 500+ Question Medical & Board Question Bank Solve',
      '40+ Chapterwise, Paper Final & Board Standard Model Tests',
      'Live Doubt Solving Sessions every Friday with Dr. Siyam'
    ]
  },
  {
    id: 'medical-admission-hsc-28',
    title: 'Medical Admission Course For HSC 28 Batch',
    subtitle: 'The definitive end-to-end medical admission preparation program for HSC 28 Batch covering Biology, Chemistry, Physics, English & General Knowledge.',
    thumbnail: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1000&q=80',
    category: 'Medical Admission',
    targetBatch: 'HSC 28 Batch',
    level: 'Comprehensive Medical Admission',
    price: 9500,
    discountPrice: 6500,
    rating: 4.9,
    reviewCount: 1840,
    enrolledCount: 5200,
    totalClasses: 120,
    totalExams: 85,
    duration: 'Complete Medical Admission Journey',
    badge: '🔥 Flagship Medical Admission',
    featured: true,
    mentors: [MENTORS_DATA[0]],
    syllabus: [
      {
        title: 'Module 1: High-Yield Medical Biology (Botany & Zoology)',
        lessons: [
          'Cell Structure, Genetics & Molecular Biology Masterclass',
          'Human Physiology: Digestion, Circulation, Respiration & Excretion',
          'Endocrine, Nervous System, Sense Organs & Human Reproduction',
          'Plant Physiology, Plant Diversity, Breeding & Biotechnology'
        ]
      },
      {
        title: 'Module 2: Medical Chemistry Mastery',
        lessons: [
          'Atomic Structure, Periodic Table & Chemical Bonding High-Yields',
          'Organic Chemistry: Hydrocarbons to Reaction Mechanisms (SN1/SN2)',
          'Quantitative Chemistry, Equilibrium & Thermochemistry Shortcuts',
          'Electrochemistry & Environmental Chemistry Problem Solving'
        ]
      },
      {
        title: 'Module 3: Rapid Medical Physics',
        lessons: [
          'Vectors, Motion, Dynamics & Gravitation (30-Sec Shortcuts)',
          'Work, Energy, Power & Fluid Mechanics',
          'Thermodynamics, Waves & Geometric Optics',
          'Current Electricity, Magnetism & Modern Physics'
        ]
      },
      {
        title: 'Module 4: Medical English & Bangladesh Affairs (GK)',
        lessons: [
          'Prepositions, Subject-Verb Agreement, Vocab & Idioms',
          'Bangabandhu, Liberation War & Historical Timeline of Bangladesh',
          'Current Health Affairs, Medical Discoveries & Nobel Prizes'
        ]
      },
      {
        title: 'Module 5: DGHS Standard 100-Mark Central Model Test Series',
        lessons: [
          '85 Central Model Tests with -0.25 Negative Marking & All-BD Merit Rank',
          'Instant bilingual explanations and personalized weak-topic AI diagnostics'
        ]
      }
    ],
    features: [
      '120+ Live Interactive Masterclasses by Medical Doctors & Specialists',
      'Daily 50-Mark Live MCQ Tests with Negative Marking & Instant Merit Rank',
      '85 Full-Length DGHS Standard 100-Mark Central Model Tests',
      'Physical Delivery of 4 Printed MediSpark High-Yield Handbooks',
      '24/7 AI Tutor & Doubt Clearing Forum with Mentors',
      'Personalized Rank Predictor and Weak-Area Diagnostic'
    ]
  }
];

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    subject: 'Biology',
    chapter: 'Zoology - Human Genetics',
    question: 'What is the phenotypic ratio in the F2 generation of Duplicate Recessive Epistasis (Complementary Genes)?',
    options: ['9:3:3:1', '9:7', '13:3', '9:3:4'],
    correctAnswerIndex: 1,
    explanation: 'In Complementary Genes (Duplicate Recessive Epistasis), both dominant genes must be present together to produce the phenotype (e.g. Purple flower in Lathyrus odoratus or deaf-mutism in humans). The classical 9:3:3:1 Mendelian ratio modifies to 9 : 7.',
    medicalAdmissionYear: 'Medical Admission 2021-22',
    difficulty: 'Medium'
  },
  {
    id: 'q2',
    subject: 'Biology',
    chapter: 'Botany - Cell Structure',
    question: 'Which organelle is known as the "Suicidal Bag" of the cell and contains hydrolytic acid phosphatase enzymes?',
    options: ['Ribosome', 'Peroxisome', 'Lysosome', 'Centrosome'],
    correctAnswerIndex: 2,
    explanation: 'Lysosomes contain about 50 different hydrolytic enzymes (acid hydrolases, including acid phosphatase). In starvation or cell injury, lysosomes autolyse the cell, hence called suicidal bags (Christian de Duve, 1955).',
    medicalAdmissionYear: 'Medical Admission 2019-20',
    difficulty: 'Easy'
  },
  {
    id: 'q3',
    subject: 'Chemistry',
    chapter: 'Organic Chemistry',
    question: 'Which reagent is used in the Lucas Test to differentiate between Primary, Secondary, and Tertiary Alcohols?',
    options: [
      'Anhydrous ZnCl2 + Conc. HCl',
      'Fehling Solution A + B',
      'Ammoniacal AgNO3 (Tollens Reagent)',
      'Neutral FeCl3 Solution'
    ],
    correctAnswerIndex: 0,
    explanation: 'Lucas reagent is a solution of anhydrous zinc chloride in concentrated hydrochloric acid. Tertiary alcohols react immediately forming turbidity; secondary alcohols react in 5-10 minutes; primary alcohols do not react at room temperature.',
    medicalAdmissionYear: 'Medical Admission 2022-23',
    difficulty: 'Medium'
  },
  {
    id: 'q4',
    subject: 'Physics',
    chapter: 'Thermodynamics',
    question: 'A Carnot engine operates between source temperature 600 K and sink temperature 300 K. What is the maximum theoretical efficiency?',
    options: ['25%', '50%', '75%', '100%'],
    correctAnswerIndex: 1,
    explanation: 'Efficiency η = 1 - (T2 / T1) = 1 - (300 / 600) = 1 - 0.5 = 0.5 = 50%. Carnot theorem proves no engine operating between the same two temperatures can have a higher efficiency.',
    medicalAdmissionYear: 'Medical Admission 2020-21',
    difficulty: 'Easy'
  },
  {
    id: 'q5',
    subject: 'English & GK',
    chapter: 'Liberation War & Bangladesh Affairs',
    question: 'Where was the Oath-taking ceremony of the Mujibnagar Provisional Government of Bangladesh held on 17 April 1971?',
    options: [
      'Baidyanathtala, Meherpur (Mango grove)',
      'Suhrwardy Udyan, Dhaka',
      'Chhatak, Sunamganj',
      'Teligati, Bagerhat'
    ],
    correctAnswerIndex: 0,
    explanation: 'The historic oath ceremony of the Mujibnagar Government was administered in the mango grove of Baidyanathtala (later renamed Mujibnagar) in Meherpur district on April 17, 1971.',
    medicalAdmissionYear: 'Medical Admission 2023-24',
    difficulty: 'Easy'
  },
  {
    id: 'q6',
    subject: 'Biology',
    chapter: 'Zoology - Human Physiology',
    question: 'Which heart valve prevents the backflow of blood from the Left Ventricle into the Left Atrium during ventricular systole?',
    options: ['Tricuspid Valve', 'Bicuspid (Mitral) Valve', 'Aortic Semilunar Valve', 'Pulmonary Valve'],
    correctAnswerIndex: 1,
    explanation: 'The Bicuspid or Mitral valve is situated between the left atrium and left ventricle. It has two cusps and prevents regurgitation of oxygenated blood during ventricular contraction.',
    medicalAdmissionYear: 'Medical Admission 2023-24',
    difficulty: 'Easy'
  }
];

export const LEADERBOARD_DATA: LeaderboardUser[] = [
  {
    rank: 1,
    name: 'Sumaiya Akter',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    college: 'Holy Cross College, Dhaka',
    target: 'Dhaka Medical College (DMC)',
    score: 96.5,
    streak: 42,
    badge: '👑 National #1'
  },
  {
    rank: 2,
    name: 'Tahmidur Rahman',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    college: 'Notre Dame College, Dhaka',
    target: 'Dhaka Medical College (DMC)',
    score: 95.25,
    streak: 38,
    badge: '🔥 Top 5'
  },
  {
    rank: 3,
    name: 'Nusrat Jahan Fariha',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
    college: 'Chittagong College',
    target: 'Chittagong Medical College (CMC)',
    score: 94.0,
    streak: 31,
    badge: '🔥 Top 5'
  },
  {
    rank: 4,
    name: 'Zubair Al Mahmud',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    college: 'Rajshahi College',
    target: 'Rajshahi Medical College (RMC)',
    score: 93.5,
    streak: 29,
    badge: '🔥 Top 5'
  },
  {
    rank: 5,
    name: 'Sadia Afreen',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80',
    college: 'Viqarunnisa Noon College',
    target: 'Shaheed Suhrawardy Medical College (ShSMC)',
    score: 92.75,
    streak: 27,
    badge: '🔥 Top 5'
  },
  {
    rank: 14,
    name: 'Md. Arafat Hossain (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    college: 'Dhaka College, Dhaka',
    target: 'Dhaka Medical College (DMC)',
    score: 87.75,
    streak: 19,
    badge: '⭐ Top 0.5%'
  }
];

export const RESOURCES_DATA: DownloadableResource[] = [
  {
    id: 'res-1',
    title: 'MediSpark High-Yield Medical Biology Mnemonics Handbook 2025',
    subject: 'Biology',
    category: 'Mnemonic Handbook',
    fileSize: '14.2 MB',
    pages: 86,
    downloadCount: 12450,
    fileType: 'PDF',
    badge: '⭐ Essential'
  },
  {
    id: 'res-2',
    title: 'Past 15 Years Medical Admission Question Bank (2010–2024) with Explanations',
    subject: 'All Subjects',
    category: 'Question Bank',
    fileSize: '38.5 MB',
    pages: 340,
    downloadCount: 24800,
    fileType: 'PDF',
    badge: '🔥 Most Popular'
  },
  {
    id: 'res-3',
    title: 'Organic Chemistry Reactions & Reagent Identification Flowchart',
    subject: 'Chemistry',
    category: 'Formula Sheet',
    fileSize: '6.8 MB',
    pages: 24,
    downloadCount: 9600,
    fileType: 'PDF',
    badge: '⚡ Quick Revision'
  },
  {
    id: 'res-4',
    title: 'Physics 1st & 2nd Paper 60-Second Calculation Formula Cheat Sheet',
    subject: 'Physics',
    category: 'Formula Sheet',
    fileSize: '5.2 MB',
    pages: 18,
    downloadCount: 8200,
    fileType: 'PDF',
  },
  {
    id: 'res-5',
    title: 'Liberation War, Bangabandhu & Medical GK High-Frequency Q&A Sheet',
    subject: 'English & GK',
    category: 'Lecture Sheet',
    fileSize: '9.1 MB',
    pages: 45,
    downloadCount: 15300,
    fileType: 'PDF',
    badge: '🎯 100% Common'
  },
  {
    id: 'res-6',
    title: 'Human Physiology Endocrine & Hormone Regulation Master Chart',
    subject: 'Biology',
    category: 'Lecture Sheet',
    fileSize: '7.4 MB',
    pages: 32,
    downloadCount: 11100,
    fileType: 'PDF'
  }
];

export const SUCCESS_STATS = [
  { label: 'Medical & Dental Selections', value: '3,850+', icon: '⚕' },
  { label: 'Active HSC & Admission Aspirants', value: '45,000+', icon: '🎓' },
  { label: 'DMC, ShSMC & SSMC Ranks', value: '420+ in Top 1000', icon: '🏆' },
  { label: 'Model Tests Taken', value: '1.2M+', icon: '📝' }
];

export const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Dr. Shahriar Nafis',
    nowAt: 'Currently at Dhaka Medical College (DMC), Merit Rank: 47th',
    batch: 'MediSpark Admission Batch 2023',
    quote: 'MediSpark’s question quality and Dr. Siyam Talukder’s Biology mnemonics saved me at least 10 crucial marks in the exam hall. The negative mark discipline in the daily tests was game-changing.',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 't-2',
    name: 'Anika Bushra',
    nowAt: 'Shaheed Suhrawardy Medical College (ShSMC), Merit Rank: 182th',
    batch: 'MediSpark HSC & Medical Batch 2024',
    quote: 'The AI study assistant pinpointed my weaknesses in Genetics and Periodic trends weeks before the final exam. I corrected my mistakes just in time.',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80'
  },
  {
    id: 't-3',
    name: 'Farhan Kabir',
    nowAt: 'Sir Salimullah Medical College (SSMC), Merit Rank: 290th',
    batch: 'MediSpark Crash Course 2024',
    quote: 'The nationwide central model tests with 3000+ competitors gave me the exact adrenaline and confidence I needed on the main medical exam day.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80'
  }
];

export const FAQS = [
  {
    q: 'How does MediSpark prepare students for both HSC and Medical Admission?',
    a: 'MediSpark adopts an integrated curriculum where Board Creative Question (CQ) writing standards and fast MCQ elimination techniques are taught simultaneously. You master textbook concepts for HSC GPA 5.00 while building line-by-line admission depth.'
  },
  {
    q: 'Who conducts the classes at MediSpark?',
    a: 'Classes and mentoring are led by top-ranking medical graduates and students from Dhaka Medical College (DMC), Shaheed Suhrawardy Medical College (ShSMC), Sir Salimullah Medical College (SSMC), along with BUET mentors for Physics.'
  },
  {
    q: 'How does the MediSpark AI Study Assistant work?',
    a: 'The AI Tutor analyzes your mock exam error patterns, time spent per subject, and identifies recurring weak chapters. It then prescribes targeted 10-minute micro-lessons, flashcards, and mnemonics to boost your accuracy.'
  },
  {
    q: 'Are the Model Tests conducted in DGHS Medical format?',
    a: 'Yes, every central model test has 100 MCQs (Biology 30, Chemistry 25, Physics 20, English 15, GK 10) in a strict 60-minute window with a 0.25 negative marking deduction per wrong answer, followed by instant merit rank publication.'
  },
  {
    q: 'Can I download lecture notes and study offline?',
    a: 'Yes, all enrolled students get instant access to PDF lecture sheets, highlighted textbook scans, high-yield mnemonics, and solved question banks for offline study.'
  }
];
