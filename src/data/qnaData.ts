import { QnAQuestion } from '../types';

export const INITIAL_QNA_QUESTIONS: QnAQuestion[] = [
  {
    id: 'qna-1',
    title: 'মাইটোকন্ড্রিয়া ও ক্লোরোপ্লাস্টের এন্ডোসিম্বায়োন্ট তত্ত্বের মূল প্রমাণগুলো কী কী?',
    description: 'HSC 29 বায়োলজি প্রথম পত্র (অধ্যায় ০১: কোষ ও এর গঠন)। মাইটোকন্ড্রিয়া এবং ক্লোরোপ্লাস্টকে কেন আদি কোষীয় পরজীবী বা এন্ডোসিম্বায়োন্ট হিসেবে গণ্য করা হয়? হাসান স্যারের বইয়ের কোন পয়েন্টগুলো মেডিকেল এমসিকিউতে সবচেয়ে বেশি আসে?',
    subject: 'Botany',
    batch: 'HSC 29',
    authorName: 'Sadia Afrin',
    authorRole: 'HSC 29 Aspirant • Viqarunnisa Noon College',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    createdAt: '2 hours ago',
    upvotes: 28,
    tags: ['Cytology', 'Endosymbiosis', 'Abul Hasan', 'Cell Biology'],
    bookReference: 'ড. আবুল হাসান — উদ্ভিদবিজ্ঞান (অধ্যায় ১, পৃষ্ঠা ৩৩)',
    isResolved: true,
    answers: [
      {
        id: 'ans-1-1',
        authorName: 'Md. Siyam Talukder',
        authorRole: 'Mentor',
        authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
        isVerifiedMentor: true,
        content: `খুবই চমৎকার এবং হাই-ইল্ড প্রশ্ন সাদিয়া! মেডিকেল ভর্তি পরীক্ষা ও বোর্ড এমসিকিউর জন্য নিচের ৪টি মূল পয়েন্ট মুখস্থ রাখবে:

১. **নিজস্ব বৃত্তাকার দ্বিসূত্রক DNA**: মাইটোকন্ড্রিয়া ও প্লাস্টিডের DNA আদি কোষের (Bacteria) মতো বৃত্তাকার (Circular naked DNA)।
২. **70S রাইবোজোম**: প্রকৃত কোষে 80S রাইবোজোম থাকলেও মাইটোকন্ড্রিয়া ও ক্লোরোপ্লাস্টের ম্যাট্রিক্সে আদি কোষের অনুরূপ 70S রাইবোজোম থাকে যা নিজস্ব প্রোটিন তৈরি করতে পারে।
৩. **দ্বি-স্তরবিশিষ্ট ঝিল্লি**: এদের অভ্যন্তরীণ ঝিল্লি ব্যাকটেরিয়াল প্লাজমামেমব্রেনের ন্যায় এবং কার্ডিওলাইপিন লিপিড সমৃদ্ধ।
৪. **দ্বি-বিভাজন (Binary Fission)**: এরা ব্যাকটেরিয়ার মতো সরাসরি দ্বি-বিভাজন প্রক্রিয়ায় সংখ্যাবৃদ্ধি করে।

💡 **মেডিকেল ট্রিক**: ড. আবুল হাসান স্যারের বই অনুযায়ী — আদিম ইউক্যারিওটিক কোষের ভেতর অবাত শ্বসনকারী অ্যারোবিক ব্যাকটেরিয়া প্রবেশ করে মাইটোকন্ড্রিয়া এবং সালোকসংশ্লেষণকারী সায়ানোব্যাকটেরিয়া প্রবেশ করে ক্লোরোপ্লাস্টে রূপান্তরিত হয়।`,
        createdAt: '1 hour ago',
        upvotes: 42,
        bookReference: 'আবুল হাসান (উদ্ভিদবিজ্ঞান, সংস্করণ ২০২৩, পৃ. ৩৩)'
      },
      {
        id: 'ans-1-2',
        authorName: 'MediSpark AI Doubt Solver',
        authorRole: 'MediSpark AI',
        content: `এন্ডোসিম্বায়োসিস (Endosymbiosis) তত্ত্বের জনক বিজ্ঞানী **লিন মার্গুলিস (Lynn Margulis, 1967)**। 

মেডিকেল শর্টকার্ট:
• **Mitochondria** = অ্যারোবিক প্রোটোব্যাকটেরিয়া (Proteobacteria) থেকে উদ্ভূত।
• **Chloroplast** = সালোকসংশ্লেষী সায়ানোব্যাকটেরিয়া (Cyanobacteria) থেকে উদ্ভূত।
• উভয় অঙ্গাণুই প্রোটিন সংশ্লেষণের জন্য ক্লোরামফেনিকল অ্যান্টিবায়োটিক দ্বারা সংবেদনশীল, যা ব্যাকটেরিয়ার বৈশিষ্ট্য।`,
        createdAt: '1 hour ago',
        upvotes: 19
      }
    ]
  },
  {
    id: 'qna-2',
    title: 'পিত্তরস (Bile) এ কোনো পাচক এনজাইম থাকে না, তবুও এটি পরিপাকের জন্য অপরিহার্য কেন?',
    description: 'প্রাণিবিজ্ঞান অধ্যায় ৩ (পরিপাক ও শোষণ)। গাজী আজমল স্যারের বইয়ে লেখা পিত্তরস স্নেহ পরিপাকে সাহায্য করে কিন্তু এতে এনজাইম নেই। এটি কিভাবে কাজ করে?',
    subject: 'Zoology',
    batch: 'Medical Admission',
    authorName: 'Tanvir Hossain',
    authorRole: 'Medical 2nd Timer • DMC Dreamer',
    authorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80',
    createdAt: '4 hours ago',
    upvotes: 35,
    tags: ['Digestion', 'Emulsification', 'Gazi Ajmal', 'Liver Physiology'],
    bookReference: 'গাজী আজমল ও গাজী আসমত — প্রাণিবিজ্ঞান (পৃষ্ঠা ৮৮)',
    isResolved: true,
    answers: [
      {
        id: 'ans-2-1',
        authorName: 'Md. Siyam Talukder',
        authorRole: 'Mentor',
        authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
        isVerifiedMentor: true,
        content: `তানভীর, এটি মেডিকেল ও ডেন্টাল ভর্তি পরীক্ষায় প্রায় প্রতিবছর আসা একটি কনসেপ্ট!

পিত্তরসে কোনো এনজাইম না থাকা সত্ত্বেও এর ৩টি অতীব গুরুত্বপূর্ণ কাজ:

১. **ইমালসিফিকেশন (Emulsification)**: পিত্তলবণ (সোডিয়াম গ্লাইকোকোলেট ও সোডিয়াম টারোকোলেট) চর্বির বৃহৎ কণাকে ভেঙে সাবানের ফেনার মতো সূক্ষ্ম ফোঁটায় (Micelles) পরিণত করে, ফলে লাইপেজ এনজাইমের কাজের ক্ষেত্রফল বহুগুণ বেড়ে যায়।
২. **ক্ষারীয় পরিবেশ সৃষ্টি**: পাকস্থলী থেকে আসা অম্লীয় কাইম (Chyme)-কে পিত্তরসের ক্ষারীয় লবণ প্রশমিত করে ডিওডেনামে ক্ষারীয় pH (৭.৪ - ৮.০) তৈরি করে, যা অগ্ন্যাশয় ও আন্ত্রিক এনজাইমের সক্রিয়তার জন্য অপরিহার্য।
৩. **ফ্যাট দ্রবণীয় ভিটামিন শোষণ**: ভিটামিন A, D, E, K শোষণে পিত্তলবণ সরাসরি সহায়ক ভূমিকা রাখে।`,
        createdAt: '3 hours ago',
        upvotes: 51,
        bookReference: 'গাজী আজমল (প্রাণিবিজ্ঞান, পরিপাক ও শোষণ)'
      }
    ]
  },
  {
    id: 'qna-3',
    title: 'ক্রেবস চক্রে (TCA Cycle) মোট কত অণু ATP তৈরি হয়? আধুনিক ও পুরাতন হিসাবের পার্থক্য কী?',
    description: 'উদ্ভিদবিজ্ঞান অধ্যায় ৯ (উদ্ভিদ শারীরতত্ত্ব)। ১ অণু গ্লুকোজ জারণে ক্রেবস চক্রে এবং মোট শ্বসনে কত ATP উৎপন্ন হয়? মেডিকেল পরীক্ষার জন্য কোন মানটা গোল্লা ভরাট করতে হবে?',
    subject: 'Botany',
    batch: 'HSC 28',
    authorName: 'Fariha Jannat',
    authorRole: 'HSC 28 Candidate • Holy Cross College',
    authorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    createdAt: '6 hours ago',
    upvotes: 41,
    tags: ['Respiration', 'Krebs Cycle', 'ATP Calculation', 'Plant Physiology'],
    bookReference: 'আবুল হাসান — উদ্ভিদ শারীরতত্ত্ব (অধ্যায় ৯)',
    isResolved: true,
    answers: [
      {
        id: 'ans-3-1',
        authorName: 'MediSpark AI Doubt Solver',
        authorRole: 'MediSpark AI',
        content: `**১ অণু গ্লুকোজ হতে ক্রেবস চক্রে (২ বার চক্র আবর্তিত হলে):**
- 6 অণু NADH + H⁺ = 6 × 3 = 18 ATP (পুরাতন হিসাব) / 6 × 2.5 = 15 ATP (আধুনিক)
- 2 অণু FADH₂ = 2 × 2 = 4 ATP (পুরাতন) / 2 × 1.5 = 3 ATP (আধুনিক)
- 2 অণু GTP = 2 ATP

👉 **ক্রেবস চক্রে মোট ATP (পুরাতন আবুল হাসান বই)** = **24 ATP**
👉 **পুরো সবাত শ্বসনে মোট ATP (পুরাতন প্রচলিত)** = **38 ATP** (আধুনিক হিসেবে 30 বা 32 ATP)।

⚠️ **ভর্তি পরীক্ষার নিয়ম**: মেডিকেল এমসিকিউতে অপশনে ৩৮ থাকলে ৩৮-ই দাগাবে; তবে যদি প্রশ্নে "আধুনিক মতবাদ" বা ৩০/৩২ উল্লেখ থাকে তবে নির্দেশিতটি দাগাবে।`,
        createdAt: '5 hours ago',
        upvotes: 33
      }
    ]
  },
  {
    id: 'qna-4',
    title: 'হার্টের কপাটিকা (Valves) ও তাদের অবস্থান সহজে মনে রাখার কোনো নেমোনিক বা ট্রিক আছে?',
    description: 'প্রাণিবিজ্ঞান অধ্যায় ৪ (রক্ত ও সংবহন)। বাইকাসপিড, ট্রাইকাসপিড, সেমিলুনার ও ইউস্টেচিয়ান কপাটিকার অবস্থান প্রায়ই পরীক্ষার হলে তালগোল পাকিয়ে যায়।',
    subject: 'Zoology',
    batch: 'HSC 29',
    authorName: 'Abrar Fahim',
    authorRole: 'HSC 29 Student • Notre Dame College',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    createdAt: '8 hours ago',
    upvotes: 24,
    tags: ['Circulation', 'Heart Valves', 'Mnemonics', 'Zoology'],
    bookReference: 'গাজী আজমল — রক্ত ও সংবহন (পৃষ্ঠা ১২২)',
    isResolved: false,
    answers: [
      {
        id: 'ans-4-1',
        authorName: 'Md. Siyam Talukder',
        authorRole: 'Mentor',
        authorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
        isVerifiedMentor: true,
        content: `আবরার, এই সুপার শর্টকাটটা খাতায় লিখে রাখো:

🔥 **ম্যাজিক নেমোনিক: "LAB RAT"**
• **L-A-B**: **L**eft **A**trium-Ventricle = **B**icuspid (Mitral) কপাটিকা (বাম অলিন্দ-নিলয়)
• **R-A-T**: **R**ight **A**trium-Ventricle = **T**ricuspid কপাটিকা (ডান অলিন্দ-নিলয়)

🔥 **অন্যান্য কপাটিকা ট্রিক:**
১. **পালমোনারি সেমিলুনার**: ডান নিলয় ও ফুসফুসীয় ধমনির মুখে (৩টি অর্ধচন্দ্রাকার পাল্লা)।
২. **অ্যাওর্টিক সেমিলুনার**: বাম নিলয় ও মহাধমনির মুখে।
৩. **থিবেসিয়ান কপাটিকা**: করোনারি সাইনাসের মুখে। (মনে রাখো: "করোনারি থিবেসিয়ান")
৪. **ইউস্টেচিয়ান কপাটিকা**: ইনফিরিয়র ভেনাক্যাভার মুখে। (মনে রাখো: "ইনফিরিয়র ইউস্টেচিয়ান")`,
        createdAt: '7 hours ago',
        upvotes: 38
      }
    ]
  },
  {
    id: 'qna-5',
    title: 'd-ব্লক মৌল এবং অবস্থান্তর মৌল (Transition Elements) এর মধ্যে সুনির্দিষ্ট পার্থক্য কী?',
    description: 'রসায়ন ১ম পত্র অধ্যায় ৩। "সকল অবস্থান্তর মৌলই d-ব্লক মৌল কিন্তু সকল d-ব্লক অবস্থান্তর নয়" — Sc ও Zn কেন অবস্থান্তর নয় তা প্রায়ই আসে।',
    subject: 'Chemistry',
    batch: 'Medical Admission',
    authorName: 'Mehedi Hasan',
    authorRole: 'Medical Aspirant',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    createdAt: '12 hours ago',
    upvotes: 19,
    tags: ['Inorganic Chemistry', 'd-block', 'Transition Elements', 'Hajar & Nag'],
    bookReference: 'হাজারী ও নাগ — রসায়ন ১ম পত্র (পর্যায়বৃত্ত ধর্ম)',
    isResolved: true,
    answers: [
      {
        id: 'ans-5-1',
        authorName: 'MediSpark AI Doubt Solver',
        authorRole: 'MediSpark AI',
        content: `**শর্ত:** যেসব d-ব্লক মৌলের অন্তত একটি স্থিতিশীল আয়নে d-অরবিটাল আংশিক পূর্ণ থাকে অর্থাৎ **d¹ থেকে d⁹** থাকে, কেবল তাদেরই অবস্থান্তর মৌল বলা হয়।

১. **Sc³⁺ আয়ন**: Scandium এর ইলেকট্রন বিন্যাস [Ar] 3d¹ 4s²। এর স্থিতিশীল আয়ন Sc³⁺ এ 3d⁰ (d-অরবিটাল শূন্য)। তাই Sc d-ব্লক হলেও অবস্থান্তর নয়।
২. **Zn²⁺ আয়ন**: Zinc এর বিন্যাস [Ar] 3d¹⁰ 4s²। এর স্থিতিশীল আয়ন Zn²⁺ এ 3d¹⁰ (d-অরবিটাল সম্পূর্ণ পূর্ণ)। তাই Zn d-ব্লক হলেও অবস্থান্তর নয়।

📌 **মেডিকেল টিপ**: Sc, Y, Zn, Cd, Hg — এই ৫টি মৌল d-ব্লক মৌল হলেও অবস্থান্তর মৌল নয়!`,
        createdAt: '11 hours ago',
        upvotes: 27
      }
    ]
  }
];
