import { Chapter, ChapterClass, ChapterExam, ChapterPDF } from '../types';

// Helper to create simulated timeline
const createTimeline = (chapName: string) => [
  { time: '00:00', seconds: 0, title: `${chapName} - Basic Concept & Introduction`, notes: 'NCTB textbook line-by-line concept breakdown and foundational definitions.' },
  { time: '14:20', seconds: 860, title: 'Key Morphological & Physiological Mechanisms', notes: 'In-depth biochemical mechanisms, enzyme actions, and structural details.' },
  { time: '32:45', seconds: 1965, title: 'Medical Admission High-Yield Exceptions', notes: 'Past 15-year DGHS & Dental admission exception questions solved.' },
  { time: '48:10', seconds: 2890, title: 'CQ Creative Question & Board Exam Solving', notes: 'Model answers with anatomical diagrams and score-boosting tips.' }
];

// Helper to create standard exams
const createExam = (chapId: string, chapNum: number, chapNameBangla: string, chapNameEng: string, subject: 'Botany' | 'Zoology'): ChapterExam => ({
  id: `exam-${chapId}`,
  examTitle: `${subject} Ch ${chapNum}: ${chapNameBangla} (${chapNameEng}) DGHS Model Test`,
  totalQuestions: 25,
  totalMarks: 25,
  durationMinutes: 20,
  isCompleted: chapNum === 1,
  bestScore: chapNum === 1 ? 24 : undefined,
  questions: [
    {
      id: `q-${chapId}-1`,
      subject: 'Biology',
      chapter: chapNameBangla,
      question: `${chapNameBangla} অধ্যায়ের সবচেয়ে গুরুত্বপূর্ণ মেডিকেল ভর্তি পরীক্ষার মূল ভিত্তি কোনটি?`,
      options: [
        'কোষীয় ও শারীরবৃত্তীয় সুনির্দিষ্ট বৈশিষ্ঠ্য',
        'সাধারণ বাহ্যিক আকার',
        'শুধুমাত্র বাসস্থান',
        'কোনোটিই নয়'
      ],
      correctAnswerIndex: 0,
      explanation: 'মেডিকেল ভর্তি পরীক্ষায় এনসিটিবি অনুমোদিত আবুল হাসান ও গাজী আজমল স্যারের বইয়ের প্রতিটি লাইনের সুনির্দিষ্ট শারীরিক ও রাসায়নিক প্রক্রিয়ার ওপর সবচেয়ে বেশি প্রশ্ন থাকে।',
      medicalAdmissionYear: 'Medical Admission 2023-24',
      difficulty: 'Medium'
    },
    {
      id: `q-${chapId}-2`,
      subject: 'Biology',
      chapter: chapNameBangla,
      question: 'এনসিটিবি পাঠ্যবই অনুসারে নিচের কোন তথ্যটি সঠিক?',
      options: [
        'নির্দিষ্ট জৈব রাসায়নিক সংকেত ও কার্যপ্রণালী বিদ্যমান',
        'সকল কোষে অঙ্গাণুর সংখ্যা সর্বদা সমান',
        'এনজাইম প্রতিক্রিয়ায় কোনো শক্তি প্রয়োজন হয় না',
        'কোনো ব্যতিক্রম দেখা যায় না'
      ],
      correctAnswerIndex: 0,
      explanation: 'জৈবনিক সকল প্রক্রিয়ায় এনজাইম ও নির্দিষ্ট রাসায়নিক বিক্রিয়ার সুনির্দিষ্ট অনুপাত ও প্রভাবক ভূমিকা পালন করে।',
      medicalAdmissionYear: 'Dental Admission 2022-23',
      difficulty: 'Hard'
    },
    {
      id: `q-${chapId}-3`,
      subject: 'Biology',
      chapter: chapNameBangla,
      question: 'নিচের কোনটি এই অধ্যায়ের জন্য একটি বিশেষ ব্যতিক্রমী বৈশিষ্ট্য?',
      options: [
        'দ্বিসূত্রক অঙ্গাণুর নিজস্ব প্রতিলিপন ক্ষমতা',
        'সকল প্লাস্টিডে ক্লোরোফিল থাকা',
        'নিউক্লিয়াসহীন কোষে বিপাক না ঘটা',
        'সবগুলো ভুল'
      ],
      correctAnswerIndex: 0,
      explanation: 'মাইটোকন্ড্রিয়া ও ক্লোরোপ্লাস্টে নিজস্ব বৃত্তাকার দ্বিসূত্রক ডিএনএ ও 70S রাইবোসোম থাকে, ফলে এরা অর্ধস্বায়ত্তশাসিত অঙ্গাণু।',
      medicalAdmissionYear: 'Medical Admission 2020-21',
      difficulty: 'Medium'
    },
    {
      id: `q-${chapId}-4`,
      subject: 'Biology',
      chapter: chapNameBangla,
      question: 'বোর্ড পরীক্ষায় সৃজনশীল ৩/৪ নম্বরের জন্য সবচেয়ে বেশি প্রাধান্য পাওয়া টপিক কোনটি?',
      options: [
        'প্রক্রিয়াটির চিত্রসহ ধারাবাহিক ধাপসমূহের বর্ণনা',
        'শুধুমাত্র বিজ্ঞানীর নাম',
        'শুধুমাত্র আবিষ্কারের সাল',
        'কোনোটিই নয়'
      ],
      correctAnswerIndex: 0,
      explanation: 'এইচএসসি বোর্ড পরীক্ষায় এবং মেডিকেল পরীক্ষায় শারীরবৃত্তীয় ধাপ ও চিহ্নিত চিত্র থেকেই প্রয়োগ ও উচ্চতর দক্ষতাভিত্তিক প্রশ্ন আসে।',
      medicalAdmissionYear: 'Dhaka Board 2024',
      difficulty: 'Easy'
    },
    {
      id: `q-${chapId}-5`,
      subject: 'Biology',
      chapter: chapNameBangla,
      question: 'মেডিকেল নেগেটিভ মার্কিং হিসাব অনুসারে প্রতি ভুল উত্তরের জন্য কত নম্বর কাটা যায়?',
      options: ['০.২৫ নম্বর', '০.৫০ নম্বর', '১.০০ নম্বর', '০.২০ নম্বর'],
      correctAnswerIndex: 0,
      explanation: 'স্বাস্থ্য শিক্ষা অধিদপ্তর (DGHS) এর নিয়ম অনুযায়ী প্রতিটি সঠিক উত্তরের জন্য ১ নম্বর এবং প্রতিটি ভুল উত্তরের জন্য ০.২৫ নম্বর কাটা যাবে।',
      medicalAdmissionYear: 'DGHS Standard Guideline',
      difficulty: 'Easy'
    }
  ]
});

// Helper to create standard PDFs
const createPdfs = (chapId: string, chapNum: number, chapNameBangla: string, chapNameEng: string): ChapterPDF[] => [
  {
    id: `pdf-${chapId}-sheet`,
    title: `Chapter ${chapNum < 10 ? '0' + chapNum : chapNum}: ${chapNameBangla} Master Lecture Sheet`,
    fileSize: '4.8 MB',
    pagesCount: 24,
    downloadUrl: '#',
    previewUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    type: 'lecture-sheet'
  },
  {
    id: `pdf-${chapId}-handwritten`,
    title: `Chapter ${chapNum < 10 ? '0' + chapNum : chapNum}: Dr. Siyam Handwritten Short Notes & Mnemonics`,
    fileSize: '3.2 MB',
    pagesCount: 16,
    downloadUrl: '#',
    previewUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd7?auto=format&fit=crop&w=1000&q=80',
    type: 'short-notes'
  },
  {
    id: `pdf-${chapId}-mcqbank`,
    title: `Chapter ${chapNum < 10 ? '0' + chapNum : chapNum}: 250+ High-Yield MCQ Practice Bank & Solution`,
    fileSize: '5.5 MB',
    pagesCount: 32,
    downloadUrl: '#',
    previewUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1000&q=80',
    type: 'question-bank'
  },
  {
    id: `pdf-${chapId}-board`,
    title: `Chapter ${chapNum < 10 ? '0' + chapNum : chapNum}: 10-Year Medical & Board Exam Solve Sheet`,
    fileSize: '6.1 MB',
    pagesCount: 28,
    downloadUrl: '#',
    previewUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=1000&q=80',
    type: 'board-solves'
  }
];

// Helper to create more tab resources
const createMoreResource = (chapNum: number, chapNameBangla: string, subject: 'Botany' | 'Zoology') => ({
  importantNotes: [
    `আবুল হাসান ও গাজী আজমল স্যারের টেক্সটবুকের ${chapNameBangla} অধ্যায়ের হাইলাইট করা প্রতিটি লাইন।`,
    'মেডিকেল ভর্তি পরীক্ষায় বিগত ২০ বছরে আসা সকল প্রশ্ন ও এর ব্যাখ্যামূলক বিশ্লেষণ।',
    'এইচএসসি বোর্ড পরীক্ষায় পূর্ণাঙ্গ নম্বর পাওয়ার জন্য প্রয়োজনীয় রঙিন চিহ্নিত চিত্র।'
  ],
  mcqPractice: [
    {
      id: `mcq-${chapNum}-1`,
      question: `${chapNameBangla} সম্পর্কিত নিচের কোনটি সঠিক তথ্য?`,
      options: ['নির্দিষ্ট কাঠামোগত একক', 'কেবলমাত্র অজৈব উপাদান', 'কোনো নির্দিষ্ট এনজাইম নেই', 'সবগুলো অসত্য'],
      correctIndex: 0,
      explanation: 'প্রতিটি জৈবিক প্রক্রিয়ায় সুনির্দিষ্ট এনজাইমেটিক ও কাঠামোগত অনুঘটক কাজ করে।'
    }
  ],
  cqPractice: [
    {
      id: `cq-${chapNum}-1`,
      scenario: `পরীক্ষাগারে শিক্ষক শিক্ষার্থীদের ${chapNameBangla} অধ্যায়ের একটি প্রক্রিয়া অণুবীক্ষণ যন্ত্রের নিচে পর্যবেক্ষণ করালেন।`,
      questionA: 'সংজ্ঞা দাও।',
      questionB: 'প্রক্রিয়াটির তাৎপর্য ব্যাখ্যা কর।',
      questionC: 'উদ্দীপকে উল্লিখিত প্রক্রিয়াটির চিহ্নিত চিত্রসহ ব্যাখ্যা কর।',
      questionD: 'উক্ত প্রক্রিয়াটির ব্যত্যয় ঘটলে জীবদেহে কী ধরনের সমস্যা হতে পারে? বিশ্লেষণ কর।'
    }
  ],
  boardQuestions: [
    { year: 'Dhaka Board 2024', question: `${chapNameBangla} থেকে আসা সৃজনশীল প্রশ্ন ও উত্তর।` },
    { year: 'Chittagong Board 2023', question: `${chapNameBangla} থেকে আসা সৃজনশীল প্রশ্ন ও উত্তর।` }
  ],
  flashcards: [
    { id: `fc-${chapNum}-1`, front: `${chapNameBangla} এর প্রধান আবিষ্কারক বা প্রবক্তা কে?`, back: 'এনসিটিবি পাঠ্যপুস্তক নির্দেশিত মূল বিজ্ঞানী ও গবেষণালব্ধ তথ্য।' },
    { id: `fc-${chapNum}-2`, front: 'মেডিকেল ভর্তি পরীক্ষার জন্য সবচেয়ে গুরুত্বপূর্ণ পয়েন্ট কোনটি?', back: 'ব্যতিক্রমধর্মী তথ্য, বিভিন্ন সংখ্যামূলক অনুপাত এবং এনজাইমের নাম।' }
  ],
  importantTopics: [
    { topic: `${chapNameBangla} এর মূল ধারণা ও সংজ্ঞা`, importance: '3 Star ★★★' },
    { topic: 'শারীরবৃত্তীয় ও কোষীয় প্রক্রিয়া', importance: '3 Star ★★★' },
    { topic: 'মেডিকেল ভর্তি পরীক্ষার বিগত বছরের প্রশ্ন সমাধান', importance: '2 Star ★★' }
  ],
  discussions: [
    { id: `d-${chapNum}-1`, user: 'Dr. Siyam Talukder', message: `Welcome to ${chapNameBangla}! Feel free to post your doubts here.`, timestamp: 'Active Mentor' }
  ],
  suggestions: [
    `এইচএসসি ২৫ ও ২৬ ব্যাচ এবং মেডিকেল প্রত্যাশীদের জন্য ${chapNameBangla} অধ্যায়ের সুপার সাজেশন।`
  ],
  announcements: [
    `Weekly Live Mega Doubt Solve session for Chapter ${chapNum} every Friday at 8:00 PM.`
  ]
});

// ==========================================
// 12 BOTANY CHAPTERS (জীববিজ্ঞান ১ম পত্র)
// ==========================================
export const BOTANY_CHAPTERS: Chapter[] = [
  {
    id: 'chap-botany-01',
    chapterNumber: 1,
    title: 'Cell Structure & Organelles',
    subtitle: 'কোষ ও এর গঠন (Botany Chapter 01)',
    description: 'Line-by-line breakdown of Cell Wall, Plasma Membrane, Fluid Mosaic Model, Mitochondria, Plastids, Ribosomes, and Nucleus from Abul Hasan Sir’s textbook.',
    isLocked: false,
    isCompleted: true,
    classesCount: 4,
    examsCount: 2,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c1-cl1',
        classNumber: 1,
        title: 'Introduction to Cell, Discovery & Cell Wall Architecture',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '48 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: true,
        videoSimulatedTimeline: createTimeline('Cell Structure'),
        nctbHighlights: [
          'জীবদেহের গঠন ও কাজের একক হলো কোষ (G. Loewy & P. Siekevitz, 1969)।',
          'মাইকোপ্লাজমা (PPLO) হলো ক্ষুদ্রতম মুক্তজীবী কোষ (0.1 µm)।',
          'কোষপ্রাচীরের মধ্যপর্দায় পেক্টিক অ্যাসিড সবচেয়ে বেশি থাকে।'
        ],
        keyNotes: [
          'Primary cell wall thickness: 1 to 3 µm, consists of Cellulose, Hemicellulose and Glycoprotein.',
          'Plasmodesmata are microscopic cytoplasmic channels connecting adjacent plant cells.'
        ]
      },
      {
        id: 'botany-c1-cl2',
        classNumber: 2,
        title: 'Plasma Membrane: Fluid Mosaic Model & Transport',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '54 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: true,
        videoSimulatedTimeline: createTimeline('Plasma Membrane'),
        nctbHighlights: [
          'ফ্লুইড মোজাইক মডেল প্রবর্তন করেন এস. জে. সিঙ্গার এবং জি. এল. নিকোলসন (১৯৭২)।',
          'ফসফোলিপিড বাইলেয়ারের তরলতার প্রধান কারণ অসম্পৃক্ত ফ্যাটি অ্যাসিড।'
        ]
      },
      {
        id: 'botany-c1-cl3',
        classNumber: 3,
        title: 'Endomembrane System: ER, Golgi Body & Lysosome',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '50 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Endomembrane System')
      },
      {
        id: 'botany-c1-cl4',
        classNumber: 4,
        title: 'Mitochondria, Plastids & Nucleus Complete Breakdown',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '58 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Mitochondria & Plastids')
      }
    ],
    exams: [
      createExam('botany-01', 1, 'কোষ ও এর গঠন', 'Cell Structure', 'Botany')
    ],
    pdfs: createPdfs('botany-01', 1, 'কোষ ও এর গঠন', 'Cell Structure'),
    more: createMoreResource(1, 'কোষ ও এর গঠন', 'Botany')
  },
  {
    id: 'chap-botany-02',
    chapterNumber: 2,
    title: 'Cell Division: Mitosis & Meiosis',
    subtitle: 'কোষ বিভাজন (Botany Chapter 02)',
    description: 'Amitosis, Mitosis stages (Prophase to Telophase), Cytokinesis, Meiosis I & II, Crossing Over, Synaptonemal Complex & Chiasma formation.',
    isLocked: false,
    isCompleted: true,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c2-cl1',
        classNumber: 1,
        title: 'Cell Cycle (G1, S, G2 Phase) & Mitosis Prophase to Anaphase',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '52 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: true,
        videoSimulatedTimeline: createTimeline('Cell Cycle & Mitosis'),
        nctbHighlights: [
          'কোষ চক্রের শতকরা ৯০-৯৫ ভাগ সময় ইন্টারফেজ দশায় ব্যয় হয় (হাওয়ার্ড ও পেল্ক, ১৯৫৩)।',
          'S দশায় DNA এর রেপ্লিকেশন বা অনুলিপন সম্পন্ন হয়।'
        ]
      },
      {
        id: 'botany-c2-cl2',
        classNumber: 2,
        title: 'Meiosis I & II: Leptotene, Zygotene, Pachytene & Crossing Over',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '56 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: true,
        videoSimulatedTimeline: createTimeline('Meiosis & Crossing Over')
      }
    ],
    exams: [
      createExam('botany-02', 2, 'কোষ বিভাজন', 'Cell Division', 'Botany')
    ],
    pdfs: createPdfs('botany-02', 2, 'কোষ বিভাজন', 'Cell Division'),
    more: createMoreResource(2, 'কোষ বিভাজন', 'Botany')
  },
  {
    id: 'chap-botany-03',
    chapterNumber: 3,
    title: 'Cell Chemistry & Biomolecules',
    subtitle: 'কোষ রসায়ন (Botany Chapter 03)',
    description: 'Carbohydrates (Mono, Di, Polysaccharides, Reducing sugars), Amino acids, Peptide bonds, Proteins, Lipids, and Enzyme kinetics (Michaelis-Menten & Lock-Key).',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c3-cl1',
        classNumber: 1,
        title: 'Carbohydrate Chemistry: Glucose, Fructose, Sucrose & Glycosidic Bonds',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '50 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Carbohydrates')
      }
    ],
    exams: [
      createExam('botany-03', 3, 'কোষ রসায়ন', 'Cell Chemistry', 'Botany')
    ],
    pdfs: createPdfs('botany-03', 3, 'কোষ রসায়ন', 'Cell Chemistry'),
    more: createMoreResource(3, 'কোষ রসায়ন', 'Botany')
  },
  {
    id: 'chap-botany-04',
    chapterNumber: 4,
    title: 'Microorganisms: Virus, Bacteria & Malaria',
    subtitle: 'অণুজীব (Botany Chapter 04)',
    description: 'T2 bacteriophage, TMV, HIV, Corona, Lytic vs Lysogenic cycle, Gram positive/negative bacteria, and Plasmodium vivax life cycle.',
    isLocked: false,
    isCompleted: false,
    classesCount: 4,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c4-cl1',
        classNumber: 1,
        title: 'Viral Structure, Capsid, Capsomere & Lytic vs Lysogenic Cycles',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '55 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Viruses')
      }
    ],
    exams: [
      createExam('botany-04', 4, 'অণুজীব', 'Microorganisms', 'Botany')
    ],
    pdfs: createPdfs('botany-04', 4, 'অণুজীব', 'Microorganisms'),
    more: createMoreResource(4, 'অণুজীব', 'Botany')
  },
  {
    id: 'chap-botany-05',
    chapterNumber: 5,
    title: 'Algae & Fungi: Ulothrix & Agaricus',
    subtitle: 'শৈবাল ও ছত্রাক (Botany Chapter 05)',
    description: 'Algae characteristics, Ulothrix reproduction, Fungi structure, Agaricus life cycle, Lichen symbiosis & economic importance.',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c5-cl1',
        classNumber: 1,
        title: 'Algae Morphology, Pigments, Ulothrix Structure & Reproduction',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '46 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Algae & Fungi')
      }
    ],
    exams: [
      createExam('botany-05', 5, 'শৈবাল ও ছত্রাক', 'Algae & Fungi', 'Botany')
    ],
    pdfs: createPdfs('botany-05', 5, 'শৈবাল ও ছত্রাক', 'Algae & Fungi'),
    more: createMoreResource(5, 'শৈবাল ও ছত্রাক', 'Botany')
  },
  {
    id: 'chap-botany-06',
    chapterNumber: 6,
    title: 'Bryophyta & Pteridophyta: Riccia & Pteris',
    subtitle: 'ব্রায়োফাইটা ও টেরিডোফাইটা (Botany Chapter 06)',
    description: 'Amphibian plants, Riccia thallus structure, sporophyte, Pteris fern prothallus, circinate vernation & alternation of generations.',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c6-cl1',
        classNumber: 1,
        title: 'Bryophyta General Characteristics, Riccia Structure & Reproduction',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '49 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Bryophyta & Pteris')
      }
    ],
    exams: [
      createExam('botany-06', 6, 'ব্রায়োফাইটা ও টেরিডোফাইটা', 'Bryophyta & Pteridophyta', 'Botany')
    ],
    pdfs: createPdfs('botany-06', 6, 'ব্রায়োফাইটা ও টেরিডোফাইটা', 'Bryophyta & Pteridophyta'),
    more: createMoreResource(6, 'ব্রায়োফাইটা ও টেরিডোফাইটা', 'Botany')
  },
  {
    id: 'chap-botany-07',
    chapterNumber: 7,
    title: 'Gymnosperms & Angiosperms: Poaceae & Malvaceae',
    subtitle: 'নগ্নবীজী ও আবৃতবীজী উদ্ভিদ (Botany Chapter 07)',
    description: 'Cycas coralloid root, megasporophyll, floral formula, floral diagram, Poaceae (Grass) and Malvaceae (China Rose) family features.',
    isLocked: false,
    isCompleted: false,
    classesCount: 4,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c7-cl1',
        classNumber: 1,
        title: 'Cycas Living Fossil, Coralloid Root, Floral Formula & Diagrams',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '53 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Gymnosperms & Angiosperms')
      }
    ],
    exams: [
      createExam('botany-07', 7, 'নগ্নবীজী ও আবৃতবীজী উদ্ভিদ', 'Gymnosperms & Angiosperms', 'Botany')
    ],
    pdfs: createPdfs('botany-07', 7, 'নগ্নবীজী ও আবৃতবীজী উদ্ভিদ', 'Gymnosperms & Angiosperms'),
    more: createMoreResource(7, 'নগ্নবীজী ও আবৃতবীজী উদ্ভিদ', 'Botany')
  },
  {
    id: 'chap-botany-08',
    chapterNumber: 8,
    title: 'Tissue & Tissue Systems: Vascular Anatomy',
    subtitle: 'টিস্যু ও টিস্যুতন্ত্র (Botany Chapter 08)',
    description: 'Meristematic tissue classification, epidermal tissue system, stomata opening mechanism, ground tissue, and vascular bundle types (Radial, Conjoint, Concentric).',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c8-cl1',
        classNumber: 1,
        title: 'Meristematic Tissues, Stomata Types & Vascular Bundle Architecture',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '51 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Tissue Systems')
      }
    ],
    exams: [
      createExam('botany-08', 8, 'টিস্যু ও টিস্যুতন্ত্র', 'Tissue Systems', 'Botany')
    ],
    pdfs: createPdfs('botany-08', 8, 'টিস্যু ও টিস্যুতন্ত্র', 'Tissue Systems'),
    more: createMoreResource(8, 'টিস্যু ও টিস্যুতন্ত্র', 'Botany')
  },
  {
    id: 'chap-botany-09',
    chapterNumber: 9,
    title: 'Plant Physiology: Photosynthesis & Respiration',
    subtitle: 'উদ্ভিদ শারীরতত্ত্ব (Botany Chapter 09)',
    description: 'Mineral absorption, Transpiration, Photosystem I & II, Calvin cycle (C3), Hatch-Slack cycle (C4), Glycolysis, Krebs cycle & ETS.',
    isLocked: false,
    isCompleted: false,
    classesCount: 5,
    examsCount: 2,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c9-cl1',
        classNumber: 1,
        title: 'Photosynthesis: Light Dependent Reaction, Photophosphorylation & Calvin Cycle',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '62 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1463936575829-25148e1db1b8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Photosynthesis')
      }
    ],
    exams: [
      createExam('botany-09', 9, 'উদ্ভিদ শারীরতত্ত্ব', 'Plant Physiology', 'Botany')
    ],
    pdfs: createPdfs('botany-09', 9, 'উদ্ভিদ শারীরতত্ত্ব', 'Plant Physiology'),
    more: createMoreResource(9, 'উদ্ভিদ শারীরতত্ত্ব', 'Botany')
  },
  {
    id: 'chap-botany-10',
    chapterNumber: 10,
    title: 'Plant Reproduction: Gametogenesis & Fertilization',
    subtitle: 'উদ্ভিদ প্রজনন (Botany Chapter 10)',
    description: 'Microsporogenesis, Megasporogenesis, Pollination, Double fertilization, Triple fusion, Endosperm formation, Parthenogenesis & Apomixis.',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c10-cl1',
        classNumber: 1,
        title: 'Pollen Grain Development, Ovule Structure & Double Fertilization',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '50 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Plant Reproduction')
      }
    ],
    exams: [
      createExam('botany-10', 10, 'উদ্ভিদ প্রজনন', 'Plant Reproduction', 'Botany')
    ],
    pdfs: createPdfs('botany-10', 10, 'উদ্ভিদ প্রজনন', 'Plant Reproduction'),
    more: createMoreResource(10, 'উদ্ভিদ প্রজনন', 'Botany')
  },
  {
    id: 'chap-botany-11',
    chapterNumber: 11,
    title: 'Biotechnology: Tissue Culture & Recombinant DNA',
    subtitle: 'জীবপ্রযুক্তি (Botany Chapter 11)',
    description: 'Plant tissue culture steps, Totipotency, Restriction enzymes, Plasmids (pBR322), Recombinant DNA technology, PCR, GMO crops & Insulin synthesis.',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c11-cl1',
        classNumber: 1,
        title: 'Tissue Culture Methodology, Restriction Endonuclease & Genetic Engineering',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '54 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Biotechnology')
      }
    ],
    exams: [
      createExam('botany-11', 11, 'জীবপ্রযুক্তি', 'Biotechnology', 'Botany')
    ],
    pdfs: createPdfs('botany-11', 11, 'জীবপ্রযুক্তি', 'Biotechnology'),
    more: createMoreResource(11, 'জীবপ্রযুক্তি', 'Botany')
  },
  {
    id: 'chap-botany-12',
    chapterNumber: 12,
    title: 'Environment, Distribution & Biodiversity Conservation',
    subtitle: 'পরিবেশ, বিস্তার ও জীবের সংরক্ষণ (Botany Chapter 12)',
    description: 'Ecological adaptations (Hydrophytes, Xerophytes, Halophytes), Ecosystem energy flow, Food webs, In-situ vs Ex-situ conservation & Red Data Book.',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'botany-c12-cl1',
        classNumber: 1,
        title: 'Biomes, Halophyte Adaptations (Pneumatophores) & In-situ Conservation',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '47 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Environment & Conservation')
      }
    ],
    exams: [
      createExam('botany-12', 12, 'পরিবেশ ও সংরক্ষণ', 'Environment & Conservation', 'Botany')
    ],
    pdfs: createPdfs('botany-12', 12, 'পরিবেশ ও সংরক্ষণ', 'Environment & Conservation'),
    more: createMoreResource(12, 'পরিবেশ ও সংরক্ষণ', 'Botany')
  }
];

// ==========================================
// 12 ZOOLOGY CHAPTERS (জীববিজ্ঞান ২য় পত্র)
// ==========================================
export const ZOOLOGY_CHAPTERS: Chapter[] = [
  {
    id: 'chap-zoology-01',
    chapterNumber: 1,
    title: 'Animal Diversity & Classification',
    subtitle: 'প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস (Zoology Chapter 01)',
    description: 'Bases of classification (Symmetry, Coelom, Germ layers, Metamerism, Notochord), 9 Major Phyla characteristics and Chordata subphyla & classes.',
    isLocked: false,
    isCompleted: true,
    classesCount: 4,
    examsCount: 2,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c1-cl1',
        classNumber: 1,
        title: 'Bases of Classification: Coelom, Germ Layers, Symmetry & Metamerism',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '52 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: true,
        videoSimulatedTimeline: createTimeline('Animal Diversity'),
        nctbHighlights: [
          'সিলেন্টেরেটা বা নিডারিয়া পর্বের প্রাণীরা দ্বিস্তরী বা ডিপ্লোব্লাস্টিক।',
          'সিউডোসিলোমেট বা অপ্রকৃত সিলোম দেখা যায় নেমাটোডা পর্বে।'
        ]
      },
      {
        id: 'zoology-c1-cl2',
        classNumber: 2,
        title: 'Major Invertebrate Phyla (Porifera to Echinodermata) Line-by-Line',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '58 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: true,
        videoSimulatedTimeline: createTimeline('Invertebrates')
      }
    ],
    exams: [
      createExam('zoology-01', 1, 'প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', 'Animal Diversity', 'Zoology')
    ],
    pdfs: createPdfs('zoology-01', 1, 'প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', 'Animal Diversity'),
    more: createMoreResource(1, 'প্রাণীর বিভিন্নতা ও শ্রেণিবিন্যাস', 'Zoology')
  },
  {
    id: 'chap-zoology-02',
    chapterNumber: 2,
    title: 'Animal Types: Hydra, Grasshopper & Rui Fish',
    subtitle: 'প্রাণীর পরিচিতি: হাইড্রা, ঘাসফড়িং ও রুই মাছ (Zoology Chapter 02)',
    description: 'Hydra histology, Nematocysts, Locomotion, Budding; Grasshopper mouthparts, Ommatidia, Respiration; Rui fish circulatory system & swim bladder.',
    isLocked: false,
    isCompleted: true,
    classesCount: 4,
    examsCount: 2,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c2-cl1',
        classNumber: 1,
        title: 'Hydra: Epidermis, Gastrodermis, 4 Nematocyst Types & Division of Labor',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '54 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: true,
        videoSimulatedTimeline: createTimeline('Hydra Biology')
      }
    ],
    exams: [
      createExam('zoology-02', 2, 'প্রাণীর পরিচিতি', 'Animal Types', 'Zoology')
    ],
    pdfs: createPdfs('zoology-02', 2, 'প্রাণীর পরিচিতি', 'Animal Types'),
    more: createMoreResource(2, 'প্রাণীর পরিচিতি', 'Zoology')
  },
  {
    id: 'chap-zoology-03',
    chapterNumber: 3,
    title: 'Human Physiology: Digestion & Absorption',
    subtitle: 'মানব শারীরতত্ত্ব: পরিপাক ও শোষণ (Zoology Chapter 03)',
    description: 'Digestive tract anatomy, Salivary enzymes, Gastric juice (Pepsin, HCl), Pancreatic juice, Bile, Liver functions, and Carbohydrate/Protein/Lipid absorption.',
    isLocked: false,
    isCompleted: false,
    classesCount: 4,
    examsCount: 2,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c3-cl1',
        classNumber: 1,
        title: 'Mouth to Stomach: Salivary Amylase, Gastric Parietal Cells & HCl Secretion',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '50 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Digestion & Absorption')
      }
    ],
    exams: [
      createExam('zoology-03', 3, 'পরিপাক ও শোষণ', 'Digestion & Absorption', 'Zoology')
    ],
    pdfs: createPdfs('zoology-03', 3, 'পরিপাক ও শোষণ', 'Digestion & Absorption'),
    more: createMoreResource(3, 'পরিপাক ও শোষণ', 'Zoology')
  },
  {
    id: 'chap-zoology-04',
    chapterNumber: 4,
    title: 'Human Physiology: Blood & Circulation',
    subtitle: 'মানব শারীরতত্ত্ব: রক্ত ও সংবহন (Zoology Chapter 04)',
    description: 'Blood composition, RBC/WBC/Platelets, Blood groups (ABO & Rh), Clotting cascade, Cardiac cycle (Systole/Diastole), Junctional tissues & ECG.',
    isLocked: false,
    isCompleted: false,
    classesCount: 4,
    examsCount: 2,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c4-cl1',
        classNumber: 1,
        title: 'Blood Plasma, Cellular Elements, Blood Clotting Factors & Hemostasis',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '55 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Blood & Circulation')
      }
    ],
    exams: [
      createExam('zoology-04', 4, 'রক্ত ও সংবহন', 'Blood & Circulation', 'Zoology')
    ],
    pdfs: createPdfs('zoology-04', 4, 'রক্ত ও সংবহন', 'Blood & Circulation'),
    more: createMoreResource(4, 'রক্ত ও সংবহন', 'Zoology')
  },
  {
    id: 'chap-zoology-05',
    chapterNumber: 5,
    title: 'Human Physiology: Breathing & Respiration',
    subtitle: 'মানব শারীরতত্ত্ব: শ্বাসক্রিয়া ও শ্বসন (Zoology Chapter 05)',
    description: 'Respiratory tract, Alveoli surfactant, Mechanism of inspiration & expiration, Oxygen transport (Oxyhemoglobin), Carbon dioxide transport & Bohr effect.',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c5-cl1',
        classNumber: 1,
        title: 'Alveolar Structure, Surfactant, Oxygen-Hemoglobin Dissociation & Bohr Effect',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '48 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Breathing & Respiration')
      }
    ],
    exams: [
      createExam('zoology-05', 5, 'শ্বাসক্রিয়া ও শ্বসন', 'Breathing & Respiration', 'Zoology')
    ],
    pdfs: createPdfs('zoology-05', 5, 'শ্বাসক্রিয়া ও শ্বসন', 'Breathing & Respiration'),
    more: createMoreResource(5, 'শ্বাসক্রিয়া ও শ্বসন', 'Zoology')
  },
  {
    id: 'chap-zoology-06',
    chapterNumber: 6,
    title: 'Human Physiology: Excretion & Osmoregulation',
    subtitle: 'মানব শারীরতত্ত্ব: বর্জ্য ও নিষ্কাশন (Zoology Chapter 06)',
    description: 'Kidney anatomy, Nephron ultrastructure, Ultrafiltration, Tubular reabsorption, Urine formation, Juxtaglomerular apparatus & RAAS axis.',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c6-cl1',
        classNumber: 1,
        title: 'Nephron Histology, Glomerular Filtration Rate (GFR) & RAAS Axis',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '52 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Excretion')
      }
    ],
    exams: [
      createExam('zoology-06', 6, 'বর্জ্য ও নিষ্কাশন', 'Excretion', 'Zoology')
    ],
    pdfs: createPdfs('zoology-06', 6, 'বর্জ্য ও নিষ্কাশন', 'Excretion'),
    more: createMoreResource(6, 'বর্জ্য ও নিষ্কাশন', 'Zoology')
  },
  {
    id: 'chap-zoology-07',
    chapterNumber: 7,
    title: 'Human Physiology: Locomotion & Bone Mechanics',
    subtitle: 'মানব শারীরতত্ত্ব: চলন ও অঙ্গচালনা (Zoology Chapter 07)',
    description: 'Human skeletal system (Axial & Appendicular skeleton - 206 bones), Bone histology (Haversian system), Synovial joints, Muscle sliding filament theory.',
    isLocked: false,
    isCompleted: false,
    classesCount: 4,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c7-cl1',
        classNumber: 1,
        title: '206 Bones Breakdown, Haversian System & Sliding Filament Muscle Theory',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '56 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Locomotion & Bone Mechanics')
      }
    ],
    exams: [
      createExam('zoology-07', 7, 'চলন ও অঙ্গচালনা', 'Locomotion & Movement', 'Zoology')
    ],
    pdfs: createPdfs('zoology-07', 7, 'চলন ও অঙ্গচালনা', 'Locomotion & Movement'),
    more: createMoreResource(7, 'চলন ও অঙ্গচালনা', 'Zoology')
  },
  {
    id: 'chap-zoology-08',
    chapterNumber: 8,
    title: 'Human Physiology: Coordination & Control',
    subtitle: 'মানব শারীরতত্ত্ব: সমন্বয় ও নিয়ন্ত্রণ (Zoology Chapter 08)',
    description: 'Human brain parts (Forebrain, Midbrain, Hindbrain), 12 pairs of cranial nerves, Eye anatomy & vision mechanism, Ear anatomy & hearing/balance, Endocrine glands & hormones.',
    isLocked: false,
    isCompleted: false,
    classesCount: 5,
    examsCount: 2,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c8-cl1',
        classNumber: 1,
        title: 'Human Brain Regions, Meninges, CSF & 12 Cranial Nerves Mnemonic Mastery',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '60 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Coordination & Control')
      }
    ],
    exams: [
      createExam('zoology-08', 8, 'সমন্বয় ও নিয়ন্ত্রণ', 'Coordination & Control', 'Zoology')
    ],
    pdfs: createPdfs('zoology-08', 8, 'সমন্বয় ও নিয়ন্ত্রণ', 'Coordination & Control'),
    more: createMoreResource(8, 'সমন্বয় ও নিয়ন্ত্রণ', 'Zoology')
  },
  {
    id: 'chap-zoology-09',
    chapterNumber: 9,
    title: 'Continuity of Human Life: Reproduction & Development',
    subtitle: 'মানব জীবনের ধারাবাহিকতা (Zoology Chapter 09)',
    description: 'Male & female reproductive systems, Spermatogenesis, Oogenesis, Menstrual cycle hormones, Fertilization, Blastocyst implantation, Placenta & Embryonic germ layer fates.',
    isLocked: false,
    isCompleted: false,
    classesCount: 4,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c9-cl1',
        classNumber: 1,
        title: 'Gametogenesis, Menstrual Hormonal Cycle, Fertilization & Placenta Barrier',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '54 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Human Reproduction')
      }
    ],
    exams: [
      createExam('zoology-09', 9, 'মানব জীবনের ধারাবাহিকতা', 'Human Reproduction', 'Zoology')
    ],
    pdfs: createPdfs('zoology-09', 9, 'মানব জীবনের ধারাবাহিকতা', 'Human Reproduction'),
    more: createMoreResource(9, 'মানব জীবনের ধারাবাহিকতা', 'Zoology')
  },
  {
    id: 'chap-zoology-10',
    chapterNumber: 10,
    title: 'Human Immunity & Defense Mechanisms',
    subtitle: 'মানবদেহের প্রতিরক্ষা - অনাক্রম্যতা (Zoology Chapter 10)',
    description: '1st, 2nd, and 3rd lines of defense, Phagocytosis, Interferon, Complement system, B & T lymphocytes, 5 classes of Antibodies (IgG, IgA, IgM, IgD, IgE), Vaccines & Autoimmunity.',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c10-cl1',
        classNumber: 1,
        title: 'Innate vs Adaptive Immunity, 3 Lines of Defense & 5 Antibody Isotypes (GAMED)',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '52 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Human Immunity')
      }
    ],
    exams: [
      createExam('zoology-10', 10, 'মানবদেহের প্রতিরক্ষা', 'Human Immunity', 'Zoology')
    ],
    pdfs: createPdfs('zoology-10', 10, 'মানবদেহের প্রতিরক্ষা', 'Human Immunity'),
    more: createMoreResource(10, 'মানবদেহের প্রতিরক্ষা', 'Zoology')
  },
  {
    id: 'chap-zoology-11',
    chapterNumber: 11,
    title: 'Genetics & Evolution: Mendelian Laws & Natural Selection',
    subtitle: 'জিনতত্ত্ব ও বিবর্তন (Zoology Chapter 11)',
    description: 'Mendel 1st & 2nd laws with ratios (3:1, 9:3:3:1), Deviations (Incomplete dominance 1:2:1, Co-dominance 1:2:1, Lethal gene 2:1, Complementary gene 9:7, Epistasis), Sex-linked inheritance (Hemophilia, Colorblindness), Lamarckism & Darwinism.',
    isLocked: false,
    isCompleted: false,
    classesCount: 4,
    examsCount: 2,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c11-cl1',
        classNumber: 1,
        title: 'Mendelian Genetics Exceptions, Lethal Genes (2:1) & Sex-Linked Disorders',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '58 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Genetics & Evolution')
      }
    ],
    exams: [
      createExam('zoology-11', 11, 'জিনতত্ত্ব ও বিবর্তন', 'Genetics & Evolution', 'Zoology')
    ],
    pdfs: createPdfs('zoology-11', 11, 'জিনতত্ত্ব ও বিবর্তন', 'Genetics & Evolution'),
    more: createMoreResource(11, 'জিনতত্ত্ব ও বিবর্তন', 'Zoology')
  },
  {
    id: 'chap-zoology-12',
    chapterNumber: 12,
    title: 'Animal Behavior: Innate & Learned Instincts',
    subtitle: 'প্রাণীর আচরণ (Zoology Chapter 12)',
    description: 'Innate behavior vs Learned behavior, Reflex actions, Taxes, Fixed Action Pattern (FAP in Stickleback fish), Imprinting, Habituation, Conditioning & Altruism in Honeybees.',
    isLocked: false,
    isCompleted: false,
    classesCount: 3,
    examsCount: 1,
    pdfsCount: 4,
    classes: [
      {
        id: 'zoology-c12-cl1',
        classNumber: 1,
        title: 'Innate Behavior (FAP & Taxes), Conditioning (Pavlov) & Honeybee Waggle Dance',
        teacherName: 'Md. Siyam Talukder (MBBS, ShSMC)',
        teacherRole: 'Lead Biology Mentor & Founder',
        duration: '48 min',
        videoThumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        isCompleted: false,
        videoSimulatedTimeline: createTimeline('Animal Behavior')
      }
    ],
    exams: [
      createExam('zoology-12', 12, 'প্রাণীর আচরণ', 'Animal Behavior', 'Zoology')
    ],
    pdfs: createPdfs('zoology-12', 12, 'প্রাণীর আচরণ', 'Animal Behavior'),
    more: createMoreResource(12, 'প্রাণীর আচরণ', 'Zoology')
  }
];
