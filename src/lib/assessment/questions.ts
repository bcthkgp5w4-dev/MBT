export type ResponseValue = 'always' | 'often' | 'sometimes' | 'never'

export interface AssessmentQuestion {
  id: number
  domain: DomainId
  text: string
  text_ur: string
  reversed: boolean // true = concern question (never = good)
}

export type DomainId =
  | 'communication'
  | 'social'
  | 'play'
  | 'behavior'
  | 'attention'
  | 'sensory'
  | 'adaptive'
  | 'academic'

export interface DomainMeta {
  id: DomainId
  label: string
  label_ur: string
  description: string
  color: string
  emoji: string
  therapyType: string
}

export const DOMAINS: DomainMeta[] = [
  {
    id: 'communication',
    label: 'Communication',
    label_ur: 'بات چیت',
    description: 'How your child communicates wants, needs, and ideas',
    color: 'blue',
    emoji: '💬',
    therapyType: 'Speech-Language Therapy',
  },
  {
    id: 'social',
    label: 'Social Skills',
    label_ur: 'سماجی مہارتیں',
    description: 'How your child interacts with people and understands emotions',
    color: 'purple',
    emoji: '👥',
    therapyType: 'Social Skills Training',
  },
  {
    id: 'play',
    label: 'Play Skills',
    label_ur: 'کھیل کی مہارتیں',
    description: 'How your child plays — independently and with others',
    color: 'pink',
    emoji: '🎮',
    therapyType: 'Play Therapy / ABA',
  },
  {
    id: 'behavior',
    label: 'Behavior & Emotions',
    label_ur: 'رویہ اور جذبات',
    description: 'How your child manages emotions, transitions, and routines',
    color: 'red',
    emoji: '🧘',
    therapyType: 'ABA / Behavioral Therapy',
  },
  {
    id: 'attention',
    label: 'Attention & Learning',
    label_ur: 'توجہ اور سیکھنا',
    description: 'How your child focuses, follows directions, and learns',
    color: 'yellow',
    emoji: '🎯',
    therapyType: 'ABA / Special Education',
  },
  {
    id: 'sensory',
    label: 'Sensory Processing',
    label_ur: 'حسی پروسیسنگ',
    description: 'How your child responds to sounds, textures, movement, and touch',
    color: 'green',
    emoji: '🌈',
    therapyType: 'Occupational Therapy',
  },
  {
    id: 'adaptive',
    label: 'Adaptive / Self-Care',
    label_ur: 'خود کی دیکھ بھال',
    description: 'How your child manages daily living skills independently',
    color: 'teal',
    emoji: '🛁',
    therapyType: 'Occupational Therapy',
  },
  {
    id: 'academic',
    label: 'Academic Readiness',
    label_ur: 'تعلیمی تیاری',
    description: 'How your child is developing pre-school and school-readiness skills',
    color: 'orange',
    emoji: '📚',
    therapyType: 'Special Education / ABA',
  },
]

export const QUESTIONS: AssessmentQuestion[] = [
  // ─── COMMUNICATION ───
  { id: 1, domain: 'communication', reversed: false,
    text: 'Does your child look at you when you call their name?',
    text_ur: 'کیا آپ کا بچہ نام پکارنے پر آپ کی طرف دیکھتا ہے؟' },
  { id: 2, domain: 'communication', reversed: false,
    text: 'Does your child point or reach toward things they want?',
    text_ur: 'کیا آپ کا بچہ جو چیز چاہتا ہے اس کی طرف اشارہ کرتا یا ہاتھ بڑھاتا ہے؟' },
  { id: 3, domain: 'communication', reversed: false,
    text: 'Does your child use words or sounds to ask for things they want?',
    text_ur: 'کیا آپ کا بچہ مطلوبہ چیز مانگنے کے لیے الفاظ یا آوازیں استعمال کرتا ہے؟' },
  { id: 4, domain: 'communication', reversed: false,
    text: 'Does your child name everyday objects like cup, shoe, or ball?',
    text_ur: 'کیا آپ کا بچہ روزمرہ چیزوں کا نام جانتا ہے جیسے پیالہ، جوتا یا گیند؟' },
  { id: 5, domain: 'communication', reversed: false,
    text: 'Does your child follow simple 1-step instructions like "sit down" or "give me"?',
    text_ur: 'کیا آپ کا بچہ سادہ ہدایات مانتا ہے جیسے "بیٹھو" یا "دو"؟' },
  { id: 6, domain: 'communication', reversed: false,
    text: 'Does your child answer simple yes/no questions?',
    text_ur: 'کیا آپ کا بچہ ہاں/نہیں کے سادہ سوالوں کا جواب دیتا ہے؟' },
  { id: 7, domain: 'communication', reversed: false,
    text: 'Does your child put 2 or more words together (e.g., "more juice", "daddy go")?',
    text_ur: 'کیا آپ کا بچہ 2 یا اس سے زیادہ الفاظ ملا کر بولتا ہے؟' },
  { id: 8, domain: 'communication', reversed: false,
    text: 'Does your child start conversations or share what they are thinking about?',
    text_ur: 'کیا آپ کا بچہ خود گفتگو شروع کرتا ہے یا اپنے خیالات شیئر کرتا ہے؟' },

  // ─── SOCIAL ───
  { id: 9, domain: 'social', reversed: false,
    text: 'Does your child make eye contact with you during play or conversation?',
    text_ur: 'کیا آپ کا بچہ کھیل یا بات چیت کے دوران آنکھ ملاتا ہے؟' },
  { id: 10, domain: 'social', reversed: false,
    text: 'Does your child smile or laugh when playing with others?',
    text_ur: 'کیا آپ کا بچہ دوسروں کے ساتھ کھیلتے وقت مسکراتا یا ہنستا ہے؟' },
  { id: 11, domain: 'social', reversed: false,
    text: 'Does your child show interest in other children (watching or moving toward them)?',
    text_ur: 'کیا آپ کا بچہ دوسرے بچوں میں دلچسپی ظاہر کرتا ہے؟' },
  { id: 12, domain: 'social', reversed: false,
    text: 'Does your child wave hello or goodbye when prompted?',
    text_ur: 'کیا آپ کا بچہ کہنے پر ہاتھ ہلا کر سلام یا الوداع کہتا ہے؟' },
  { id: 13, domain: 'social', reversed: false,
    text: 'Does your child share toys or food with others?',
    text_ur: 'کیا آپ کا بچہ دوسروں کے ساتھ کھلونے یا کھانا شیئر کرتا ہے؟' },
  { id: 14, domain: 'social', reversed: false,
    text: 'Does your child take turns in games or conversations?',
    text_ur: 'کیا آپ کا بچہ کھیل یا گفتگو میں باری باری حصہ لیتا ہے؟' },
  { id: 15, domain: 'social', reversed: false,
    text: 'Does your child understand basic emotions like happy, sad, or angry?',
    text_ur: 'کیا آپ کا بچہ بنیادی جذبات سمجھتا ہے جیسے خوش، غمگین یا ناراض؟' },
  { id: 16, domain: 'social', reversed: false,
    text: 'Does your child try to comfort someone who is upset?',
    text_ur: 'کیا آپ کا بچہ پریشان شخص کو دلاسہ دینے کی کوشش کرتا ہے؟' },

  // ─── PLAY ───
  { id: 17, domain: 'play', reversed: false,
    text: 'Does your child use toys the way they are meant to be used (rolling a car, stacking blocks)?',
    text_ur: 'کیا آپ کا بچہ کھلونوں کو ان کے مقصد کے مطابق استعمال کرتا ہے؟' },
  { id: 18, domain: 'play', reversed: false,
    text: 'Does your child play on their own for at least 5 minutes without needing help?',
    text_ur: 'کیا آپ کا بچہ مدد کے بغیر کم از کم 5 منٹ اکیلے کھیل سکتا ہے؟' },
  { id: 19, domain: 'play', reversed: false,
    text: 'Does your child pretend during play (e.g., pretend to cook, feed a doll, be a superhero)?',
    text_ur: 'کیا آپ کا بچہ کھیل میں بناوٹ کرتا ہے جیسے کھانا پکانا یا گڑیا کو کھلانا؟' },
  { id: 20, domain: 'play', reversed: false,
    text: 'Does your child play near other children, even if not directly with them?',
    text_ur: 'کیا آپ کا بچہ دوسرے بچوں کے قریب کھیلتا ہے چاہے ان کے ساتھ نہ ہو؟' },
  { id: 21, domain: 'play', reversed: false,
    text: 'Does your child play with other children cooperatively (taking turns, following rules)?',
    text_ur: 'کیا آپ کا بچہ دوسرے بچوں کے ساتھ مل کر کھیلتا ہے؟' },
  { id: 22, domain: 'play', reversed: false,
    text: 'Does your child show you what they are doing during play?',
    text_ur: 'کیا آپ کا بچہ کھیلتے وقت آپ کو دکھاتا ہے کہ وہ کیا کر رہا ہے؟' },
  { id: 23, domain: 'play', reversed: false,
    text: 'Does your child try new games or activities instead of always doing the same thing?',
    text_ur: 'کیا آپ کا بچہ نئے کھیل آزماتا ہے بجائے ہمیشہ ایک ہی چیز کرنے کے؟' },
  { id: 24, domain: 'play', reversed: false,
    text: 'Does your child stay engaged in a play activity for 10 or more minutes?',
    text_ur: 'کیا آپ کا بچہ 10 یا اس سے زیادہ منٹ تک کھیل میں مصروف رہتا ہے؟' },

  // ─── BEHAVIOR (reversed: concern = bad) ───
  { id: 25, domain: 'behavior', reversed: true,
    text: 'Does your child have meltdowns or tantrums that are hard to calm down?',
    text_ur: 'کیا آپ کے بچے کو غصے کے دورے آتے ہیں جنہیں سنبھالنا مشکل ہو؟' },
  { id: 26, domain: 'behavior', reversed: true,
    text: 'Does your child get very upset when daily routines change unexpectedly?',
    text_ur: 'کیا آپ کا بچہ روزمرہ معمول بدلنے پر بہت پریشان ہو جاتا ہے؟' },
  { id: 27, domain: 'behavior', reversed: true,
    text: 'Does your child hurt themselves (hit their head, bite or scratch themselves)?',
    text_ur: 'کیا آپ کا بچہ خود کو نقصان پہنچاتا ہے جیسے سر مارنا یا خود کو کاٹنا؟' },
  { id: 28, domain: 'behavior', reversed: true,
    text: 'Does your child hit, bite, or scratch other people?',
    text_ur: 'کیا آپ کا بچہ دوسروں کو مارتا، کاٹتا یا نوچتا ہے؟' },
  { id: 29, domain: 'behavior', reversed: true,
    text: 'Does your child repeat the same actions over and over (rocking, hand flapping, spinning)?',
    text_ur: 'کیا آپ کا بچہ ایک ہی حرکت بار بار کرتا ہے جیسے جھولنا یا ہاتھ ہلانا؟' },
  { id: 30, domain: 'behavior', reversed: true,
    text: 'Does your child have great difficulty moving from one activity to another?',
    text_ur: 'کیا آپ کے بچے کو ایک سرگرمی سے دوسری پر جانا بہت مشکل لگتا ہے؟' },
  { id: 31, domain: 'behavior', reversed: true,
    text: 'Does your child become very distressed in new places or situations?',
    text_ur: 'کیا آپ کا بچہ نئی جگہوں یا حالات میں بہت پریشان ہو جاتا ہے؟' },
  { id: 32, domain: 'behavior', reversed: true,
    text: 'Does your child insist on doing things a very specific way and gets upset if changed?',
    text_ur: 'کیا آپ کا بچہ چیزیں ایک خاص طریقے سے کرنے پر اصرار کرتا ہے اور بدلاؤ پر ناراض ہوتا ہے؟' },

  // ─── ATTENTION & LEARNING ───
  { id: 33, domain: 'attention', reversed: false,
    text: 'Does your child sit still for a structured activity for at least 3 minutes?',
    text_ur: 'کیا آپ کا بچہ کسی سرگرمی کے لیے کم از کم 3 منٹ بیٹھ سکتا ہے؟' },
  { id: 34, domain: 'attention', reversed: false,
    text: 'Does your child look at you when you show them something new?',
    text_ur: 'کیا آپ کا بچہ کوئی نئی چیز دکھانے پر آپ کی طرف دیکھتا ہے؟' },
  { id: 35, domain: 'attention', reversed: false,
    text: 'Does your child follow 2-step instructions (e.g., "get your shoes and come here")?',
    text_ur: 'کیا آپ کا بچہ دو مراحل کی ہدایات مانتا ہے؟' },
  { id: 36, domain: 'attention', reversed: false,
    text: 'Does your child finish a simple task from start to end (e.g., a simple puzzle)?',
    text_ur: 'کیا آپ کا بچہ سادہ کام شروع سے ختم تک کر سکتا ہے؟' },
  { id: 37, domain: 'attention', reversed: false,
    text: 'Does your child wait their turn without becoming very upset?',
    text_ur: 'کیا آپ کا بچہ بہت زیادہ پریشان ہوئے بغیر اپنی باری کا انتظار کر سکتا ہے؟' },
  { id: 38, domain: 'attention', reversed: false,
    text: 'Does your child copy or imitate actions you show them?',
    text_ur: 'کیا آپ کا بچہ آپ کی دکھائی حرکات کی نقل کرتا ہے؟' },
  { id: 39, domain: 'attention', reversed: false,
    text: 'Does your child stay focused when there are distractions around?',
    text_ur: 'کیا آپ کا بچہ شور یا خلفشار میں بھی توجہ مرکوز رکھ سکتا ہے؟' },
  { id: 40, domain: 'attention', reversed: false,
    text: 'Does your child pick up new skills after practicing a few times?',
    text_ur: 'کیا آپ کا بچہ چند بار مشق کے بعد نئی مہارتیں سیکھ لیتا ہے؟' },

  // ─── SENSORY (reversed: concern = bad) ───
  { id: 41, domain: 'sensory', reversed: true,
    text: 'Does your child get very upset by loud or unexpected sounds?',
    text_ur: 'کیا آپ کا بچہ تیز یا اچانک آوازوں سے بہت پریشان ہو جاتا ہے؟' },
  { id: 42, domain: 'sensory', reversed: true,
    text: 'Does your child strongly avoid certain clothing textures or food textures?',
    text_ur: 'کیا آپ کا بچہ بعض کپڑوں یا کھانے کی ساخت سے شدید پرہیز کرتا ہے؟' },
  { id: 43, domain: 'sensory', reversed: true,
    text: 'Does your child actively seek intense movement like spinning, crashing, or jumping constantly?',
    text_ur: 'کیا آپ کا بچہ مسلسل گھومنے، ٹکرانے یا کودنے جیسی تیز حرکت ڈھونڈتا ہے؟' },
  { id: 44, domain: 'sensory', reversed: true,
    text: 'Does your child cover their ears or close their eyes in everyday environments?',
    text_ur: 'کیا آپ کا بچہ عام حالات میں کان ڈھانپتا یا آنکھیں بند کرتا ہے؟' },
  { id: 45, domain: 'sensory', reversed: true,
    text: 'Does your child avoid being touched, hugged, or having their face washed?',
    text_ur: 'کیا آپ کا بچہ چھونے، گلے لگانے یا چہرہ دھونے سے بچتا ہے؟' },
  { id: 46, domain: 'sensory', reversed: true,
    text: 'Does your child put non-food objects in their mouth frequently?',
    text_ur: 'کیا آپ کا بچہ اکثر غیر خوراکی چیزیں منہ میں ڈالتا ہے؟' },
  { id: 47, domain: 'sensory', reversed: true,
    text: 'Does your child have strong reactions to certain smells that others do not notice?',
    text_ur: 'کیا آپ کا بچہ ایسی خوشبو/بدبو سے بہت ردعمل ظاہر کرتا ہے جو دوسرے نہیں محسوس کرتے؟' },
  { id: 48, domain: 'sensory', reversed: true,
    text: 'Does your child frequently walk on their toes or have unusual posture?',
    text_ur: 'کیا آپ کا بچہ اکثر پنجوں پر چلتا ہے یا غیر معمولی انداز میں بیٹھتا ہے؟' },

  // ─── ADAPTIVE / SELF-CARE ───
  { id: 49, domain: 'adaptive', reversed: false,
    text: 'Does your child eat a variety of foods without extreme difficulty or refusal?',
    text_ur: 'کیا آپ کا بچہ بغیر زیادہ مشکل کے مختلف کھانے کھاتا ہے؟' },
  { id: 50, domain: 'adaptive', reversed: false,
    text: 'Does your child drink from a cup independently?',
    text_ur: 'کیا آپ کا بچہ خود پیالے سے پانی پی سکتا ہے؟' },
  { id: 51, domain: 'adaptive', reversed: false,
    text: 'Does your child indicate (words, gesture, or behavior) when they need the bathroom?',
    text_ur: 'کیا آپ کا بچہ باتھ روم کی ضرورت بتا سکتا ہے؟' },
  { id: 52, domain: 'adaptive', reversed: false,
    text: 'Does your child wash or rinse their hands with some help?',
    text_ur: 'کیا آپ کا بچہ کچھ مدد سے ہاتھ دھو سکتا ہے؟' },
  { id: 53, domain: 'adaptive', reversed: false,
    text: 'Does your child help with dressing (puts arms in sleeves, pulls up pants)?',
    text_ur: 'کیا آپ کا بچہ کپڑے پہننے میں مدد کرتا ہے؟' },
  { id: 54, domain: 'adaptive', reversed: false,
    text: 'Does your child sleep through the night most nights without major disturbances?',
    text_ur: 'کیا آپ کا بچہ زیادہ تر راتیں پوری نیند سوتا ہے؟' },
  { id: 55, domain: 'adaptive', reversed: false,
    text: 'Does your child brush their teeth with prompting or some help?',
    text_ur: 'کیا آپ کا بچہ یاددہانی یا تھوڑی مدد سے دانت صاف کر سکتا ہے؟' },
  { id: 56, domain: 'adaptive', reversed: false,
    text: 'Does your child manage their own belongings (carry a bag, put shoes by the door)?',
    text_ur: 'کیا آپ کا بچہ اپنا سامان خود سنبھال سکتا ہے؟' },

  // ─── ACADEMIC READINESS ───
  { id: 57, domain: 'academic', reversed: false,
    text: 'Does your child match identical objects or pictures?',
    text_ur: 'کیا آپ کا بچہ ایک جیسی چیزوں یا تصویروں کو ملا سکتا ہے؟' },
  { id: 58, domain: 'academic', reversed: false,
    text: 'Does your child sort objects by color or shape?',
    text_ur: 'کیا آپ کا بچہ چیزوں کو رنگ یا شکل کے مطابق ترتیب دے سکتا ہے؟' },
  { id: 59, domain: 'academic', reversed: false,
    text: 'Does your child recognize their own name when they see it written?',
    text_ur: 'کیا آپ کا بچہ اپنا نام لکھا ہوا پہچانتا ہے؟' },
  { id: 60, domain: 'academic', reversed: false,
    text: 'Does your child count 3 or more objects by touching and counting them?',
    text_ur: 'کیا آپ کا بچہ 3 یا اس سے زیادہ چیزیں گن سکتا ہے؟' },
  { id: 61, domain: 'academic', reversed: false,
    text: 'Does your child recognize at least 5 basic colors?',
    text_ur: 'کیا آپ کا بچہ کم از کم 5 بنیادی رنگ پہچانتا ہے؟' },
  { id: 62, domain: 'academic', reversed: false,
    text: 'Does your child hold a pencil or crayon and make marks on paper?',
    text_ur: 'کیا آپ کا بچہ پنسل یا کریون پکڑ کر کاغذ پر نشان لگا سکتا ہے؟' },
  { id: 63, domain: 'academic', reversed: false,
    text: 'Does your child sit and pay attention to a book or story being read?',
    text_ur: 'کیا آپ کا بچہ کتاب یا کہانی سننے میں توجہ دے سکتا ہے؟' },
  { id: 64, domain: 'academic', reversed: false,
    text: 'Does your child follow instructions given to a group, not just to them individually?',
    text_ur: 'کیا آپ کا بچہ گروپ کو دی گئی ہدایات پر عمل کر سکتا ہے؟' },
]

export const RESPONSE_SCORES: Record<ResponseValue, number> = {
  always: 3,
  often: 2,
  sometimes: 1,
  never: 0,
}

export const RESPONSE_LABELS: Record<ResponseValue, string> = {
  always: 'Always',
  often: 'Often',
  sometimes: 'Sometimes',
  never: 'Never / Not Yet',
}

export const RESPONSE_LABELS_UR: Record<ResponseValue, string> = {
  always: 'ہمیشہ',
  often: 'اکثر',
  sometimes: 'کبھی کبھار',
  never: 'کبھی نہیں / ابھی نہیں',
}
