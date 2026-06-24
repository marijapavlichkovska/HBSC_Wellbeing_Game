import { useState, useEffect } from "react";
import { styles } from "./styles";
import "./index.css";

// ─── TRANSLATIONS ────────────────────────────────────────────────────────────

const UI = {
  en: {
    badge: "HBSC Study · Macedonia · 2026",
    introTitle1: "Your choices shape",
    introTitle2: "your wellbeing",
    introSub: "You are Alex, a 15-year-old from Skopje. Face 12 real-life situations and discover how your daily choices affect your mental and physical health.",
    startBtn: "Start playing",
    hbscNote: "Based on real data from the HBSC international health study. Your choices reflect challenges faced by thousands of Macedonian teens.",
    stepLabel: (cur, tot) => `Scenario ${cur} of ${tot}`,
    whatDoesAlex: "What does Alex do?",
    hbscFact: "HBSC Fact",
    nextBtn: "Next scenario →",
    seeResults: "See my results",
    endSub: "Here's how your choices shaped Alex's life",
    aiLabel: "✨ AI Wellbeing Summary",
    aiLoading: "Analysing your choices",
    playAgain: "Play again",
    endTitles: {
      thriving: "Alex is thriving 🌟",
      okay: "Alex is doing okay 🌱",
      support: "Alex needs more support 💙",
    },
    langScreen: {
      title: "Choose your language",
      sub: "Select the language for the game and AI summary",
      mkBtn: "Македонски",
      enBtn: "English",
    },
  },
  mk: {
    badge: "HBSC Студија · Македонија · 2026",
    introTitle1: "Твоите избори го",
    introTitle2: "обликуваат твоето здравје",
    introSub: "Ти си Алекс, 15-годишник од Скопје. Соочи се со 12 животни ситуации и откриј како твоите секојдневни одлуки влијаат на твоето ментално и физичко здравје.",
    startBtn: "Почни да играш",
    hbscNote: "Засновано на реални податоци од меѓународната HBSC студија за здравје. Твоите избори ги одразуваат предизвиците со кои се соочуваат илјадници македонски тинејџери.",
    stepLabel: (cur, tot) => `Сценарио ${cur} од ${tot}`,
    whatDoesAlex: "Што прави Алекс?",
    hbscFact: "HBSC Факт",
    nextBtn: "Следно сценарио →",
    seeResults: "Види ги резултатите",
    endSub: "Еве како твоите избори го обликуваа животот на Алекс",
    aiLabel: "✨ AI Резиме за Благосостојба",
    aiLoading: "Ги анализирам твоите избори",
    playAgain: "Играј повторно",
    endTitles: {
      thriving: "Алекс напредува 🌟",
      okay: "Алекс е во ред 🌱",
      support: "Алекс треба повеќе поддршка 💙",
    },
    langScreen: {
      title: "Избери јазик",
      sub: "Одбери јазик за играта и AI резимето",
      mkBtn: "Македонски",
      enBtn: "English",
    },
  },
};

// ─── DATA ────────────────────────────────────────────────────────────────────

const SCENARIOS = {
  en: [
    {
      id: 0,
      emoji: "🌙",
      tag: "Sleep & Screens",
      title: "11 PM. School tomorrow.",
      story: "Alex has been scrolling for 3 hours. The group chat is going wild. There's an exam at 8 AM and the phone glows softly in the dark.",
      choices: [
        { text: "Keep scrolling — it's too fun to stop now.", deltas: { sleep: -20, mood: +5, social: +10, focus: -15 }, good: false },
        { text: "Put the phone away and get a full night's sleep.", deltas: { sleep: +20, mood: +10, social: -5, focus: +15 }, good: true },
        { text: "Set a 30-minute timer, then sleep.", deltas: { sleep: +5, mood: +5, social: +5, focus: +5 }, good: true },
      ],
      feedbacks: [
        { emoji: "😴", title: "Rough night ahead", text: "You stayed up late and missed precious sleep. Tomorrow's exam will be harder than it needs to be.", fact: "42% of Macedonian 15-year-olds report feeling tired at school every day, linked directly to late-night screen use." },
        { emoji: "✨", title: "Smart choice", text: "A full night's sleep sharpens memory and helps you perform well. Well done!", fact: "Teens need 8–10 hours of sleep. HBSC data shows only 30% of 15-year-olds in Macedonia consistently get this." },
        { emoji: "👍", title: "Good balance", text: "Setting a limit showed self-control. You got some social time AND enough rest.", fact: "Screen time before bed delays melatonin production by up to 2 hours, affecting sleep quality even if you fall asleep on time." },
      ],
    },
    {
      id: 1,
      emoji: "📚",
      tag: "School Stress",
      title: "Exam results day.",
      story: "Alex got a 6 on the math test. It feels terrible. Everyone else seems to have done better. The pressure to succeed is overwhelming.",
      choices: [
        { text: "Spiral into self-criticism and skip lunch alone.", deltas: { sleep: -10, mood: -20, social: -15, focus: -10 }, good: false },
        { text: "Talk to a friend about how you're feeling.", deltas: { sleep: 0, mood: +15, social: +20, focus: +5 }, good: true },
        { text: "Ask the teacher what you can improve next time.", deltas: { sleep: 0, mood: +5, social: 0, focus: +20 }, good: true },
      ],
      feedbacks: [
        { emoji: "😟", title: "Don't be too hard on yourself", text: "Isolating when stressed makes everything feel worse. Even a 5-minute conversation can shift your perspective.", fact: "Over 40% of Macedonian adolescents report high levels of school-related stress. You're not alone." },
        { emoji: "🤝", title: "Connection heals", text: "Sharing your feelings with a friend is one of the most effective ways to process stress.", fact: "HBSC data shows teens who talk to friends about problems report significantly higher life satisfaction scores." },
        { emoji: "💪", title: "Growth mindset", text: "Asking for feedback turns a bad grade into a learning opportunity. That's a powerful habit.", fact: "Students who seek academic feedback after setbacks show 23% higher improvement rates in follow-up assessments." },
      ],
    },
    {
      id: 2,
      emoji: "💬",
      tag: "Cyberbullying",
      title: "Someone is being mean online.",
      story: "An anonymous account is posting mean comments under every one of Alex's photos. Some classmates are liking the posts. Alex's stomach drops.",
      choices: [
        { text: "Respond aggressively to defend yourself.", deltas: { sleep: -15, mood: -10, social: -10, focus: -15 }, good: false },
        { text: "Block and report, then tell a trusted adult.", deltas: { sleep: +5, mood: +10, social: +5, focus: +10 }, good: true },
        { text: "Delete all your social media in frustration.", deltas: { sleep: +10, mood: -15, social: -20, focus: +5 }, good: false },
      ],
      feedbacks: [
        { emoji: "⚡", title: "Fighting back escalates things", text: "Responding with aggression rarely helps and usually makes cyberbullying worse.", fact: "Only 28% of teens who experience cyberbullying in Macedonia report it to an adult, despite it being the most effective solution." },
        { emoji: "🛡️", title: "Exactly right", text: "Blocking removes their power. Reporting creates a record. Telling an adult means you're not carrying this alone.", fact: "Teens who report cyberbullying to adults resolve the situation in 70% of cases within two weeks." },
        { emoji: "🌫️", title: "A temporary fix", text: "Deleting accounts removes immediate pain but also cuts you off from positive connections that matter.", fact: "HBSC shows both positive (support, connection) and negative (comparison, bullying) outcomes of social media for teens." },
      ],
    },
    {
      id: 3,
      emoji: "👥",
      tag: "Peer Pressure",
      title: "The group wants to skip class.",
      story: "Alex's friends are planning to skip the afternoon and hang out at the mall. 'Come on, one time won't hurt.' Alex has been trying to improve grades.",
      choices: [
        { text: "Go along — you don't want to feel left out.", deltas: { sleep: 0, mood: -5, social: +15, focus: -20 }, good: false },
        { text: "Stay in class but invite them to hang out after school.", deltas: { sleep: 0, mood: +10, social: +10, focus: +15 }, good: true },
        { text: "Lie and say you're sick to avoid the pressure.", deltas: { sleep: -5, mood: -15, social: -5, focus: +5 }, good: false },
      ],
      feedbacks: [
        { emoji: "🎭", title: "Fitting in vs. your goals", text: "You got the social points but at a real cost to your focus. Over time, choices like this compound.", fact: "HBSC research shows peer influence on school behaviour peaks at ages 14–15, but teens with strong self-identity are significantly less susceptible." },
        { emoji: "🌟", title: "Best of both worlds", text: "You kept your boundaries AND maintained the friendship. This is emotional intelligence in action.", fact: "Teens who maintain academic commitments while staying socially connected show the highest reported wellbeing scores in the HBSC study." },
        { emoji: "🤖", title: "Avoidance isn't a solution", text: "Lying avoids conflict but damages trust and makes you feel worse about yourself.", fact: "Assertive communication — saying no directly but kindly — is a learnable skill that dramatically improves teen mental health outcomes." },
      ],
    },
    {
      id: 4,
      emoji: "🏃",
      tag: "Physical Activity",
      title: "Free afternoon. Nothing planned.",
      story: "School's done. Alex drops the bag and falls onto the couch. The TV remote and phone are right there. It's been a really tiring week.",
      choices: [
        { text: "Netflix and phone. Full couch mode all evening.", deltas: { sleep: -10, mood: -5, social: -5, focus: -10 }, good: false },
        { text: "Go for a 30-minute walk or bike ride outside.", deltas: { sleep: +15, mood: +20, social: +5, focus: +15 }, good: true },
        { text: "Call a friend to play football or walk together.", deltas: { sleep: +10, mood: +20, social: +20, focus: +10 }, good: true },
      ],
      feedbacks: [
        { emoji: "🛋️", title: "Rest is fine, but…", text: "A full sedentary evening actually leaves you feeling more tired, not less. Even 20 minutes of movement would have helped.", fact: "Only 18% of Macedonian teens meet the WHO recommendation of 60 minutes of daily physical activity." },
        { emoji: "🌿", title: "Your brain thanks you", text: "Physical activity releases endorphins that improve mood, reduce stress, and help you sleep better.", fact: "Regular physical activity is one of the strongest protective factors against adolescent depression in HBSC research." },
        { emoji: "🎉", title: "Movement + connection", text: "This is the ultimate combo — exercise AND social time. Both independently linked to higher wellbeing.", fact: "Teens who combine regular physical activity with strong peer relationships have 40% lower rates of reported loneliness." },
      ],
    },
    {
      id: 5,
      emoji: "💭",
      tag: "Loneliness",
      title: "Friday night, and everyone seems busy.",
      story: "Alex sees photos of classmates at a party they weren't invited to. The familiar sting of being left out. The room feels very quiet.",
      choices: [
        { text: "Spend the night comparing yourself to others online.", deltas: { sleep: -15, mood: -25, social: -10, focus: -10 }, good: false },
        { text: "Reach out to one person — even just to chat.", deltas: { sleep: +5, mood: +15, social: +20, focus: +5 }, good: true },
        { text: "Use the quiet time for something you genuinely enjoy.", deltas: { sleep: +10, mood: +15, social: 0, focus: +15 }, good: true },
      ],
      feedbacks: [
        { emoji: "📱", title: "The comparison trap", text: "Social media shows curated highlights, not real life. Scrolling when left out amplifies loneliness significantly.", fact: "1 in 4 Macedonian teenagers reports feeling lonely most of the time — it's far more common than you think." },
        { emoji: "💌", title: "Connection starts with one message", text: "It takes courage to reach out, but even one genuine conversation can completely shift how you feel.", fact: "Teens with at least one close confidant show significantly lower rates of depression and anxiety." },
        { emoji: "🎨", title: "Solitude vs. loneliness", text: "There's a difference between being alone and feeling lonely. Choosing an activity you love transforms one into the other.", fact: "Having hobbies and personal interests is a strong predictor of adolescent resilience and life satisfaction." },
      ],
    },
    {
      id: 6,
      emoji: "🍔",
      tag: "Eating Habits",
      title: "Lunchtime at school.",
      story: "The cafeteria line is long. Alex is really hungry but only has 15 minutes. The vending machine is right there — chips and a soda would be quick.",
      choices: [
        { text: "Grab chips and soda from the vending machine.", deltas: { sleep: -5, mood: -10, social: 0, focus: -15 }, good: false },
        { text: "Wait in line for a proper hot lunch.", deltas: { sleep: +5, mood: +10, social: +10, focus: +15 }, good: true },
        { text: "Skip lunch entirely — not hungry enough to wait.", deltas: { sleep: -5, mood: -15, social: -10, focus: -20 }, good: false },
      ],
      feedbacks: [
        { emoji: "🍟", title: "Quick but costly", text: "A sugar spike now means a crash in 30 minutes — right in the middle of afternoon classes.", fact: "HBSC data shows 30% of Macedonian teens skip breakfast daily, leading to concentration problems and lower academic performance." },
        { emoji: "🥗", title: "Worth the wait", text: "A balanced meal fuels your brain for the rest of the day. Good call.", fact: "Teens who eat regular balanced meals report significantly better concentration, mood, and energy levels throughout the school day." },
        { emoji: "😵", title: "Running on empty", text: "Skipping meals entirely is one of the worst things for focus and mood — your brain needs fuel every few hours.", fact: "Skipping meals is linked to lower academic performance and higher rates of emotional instability in adolescents across HBSC nations." },
      ],
    },
    {
      id: 7,
      emoji: "🚬",
      tag: "Substance Pressure",
      title: "At a party. Someone offers a cigarette.",
      story: "Alex is at a house party. An older classmate offers a cigarette. 'Everyone's doing it. Just try it.' Some people are watching.",
      choices: [
        { text: "Try it — you don't want to look uncool.", deltas: { sleep: -10, mood: -10, social: +5, focus: -15 }, good: false },
        { text: "Say 'no thanks' simply and confidently.", deltas: { sleep: +5, mood: +15, social: +5, focus: +10 }, good: true },
        { text: "Make an excuse and walk away from the group.", deltas: { sleep: 0, mood: +5, social: -10, focus: +5 }, good: true },
      ],
      feedbacks: [
        { emoji: "😶‍🌫️", title: "Not worth it", text: "Giving in to pressure to seem cool rarely works — and the health consequences start from the very first cigarette.", fact: "In Macedonia, 22% of 15-year-olds have tried smoking. First-time smokers are 3x more likely to become regular smokers." },
        { emoji: "💚", title: "Confidence is the coolest thing", text: "A calm, simple 'no thanks' is one of the most powerful social skills a teen can develop. You didn't need to explain yourself.", fact: "Teens who report feeling confident in social situations are significantly less likely to experiment with substances." },
        { emoji: "🚶", title: "Removing yourself works too", text: "Sometimes the best response to pressure is just to physically leave the situation. Good instinct.", fact: "Situational awareness — recognising and avoiding high-pressure moments — is a key protective factor in adolescent health." },
      ],
    },
    {
      id: 8,
      emoji: "😤",
      tag: "Family Conflict",
      title: "A big fight with a parent.",
      story: "Alex's parent said something that felt really unfair and critical. Alex is furious. The words are right there, ready to explode.",
      choices: [
        { text: "Shout back and slam the bedroom door.", deltas: { sleep: -15, mood: -20, social: -10, focus: -10 }, good: false },
        { text: "Say 'I need a minute' and take 10 minutes to calm down.", deltas: { sleep: +5, mood: +10, social: +10, focus: +10 }, good: true },
        { text: "Go silent and refuse to talk for the rest of the day.", deltas: { sleep: -10, mood: -15, social: -15, focus: -5 }, good: false },
      ],
      feedbacks: [
        { emoji: "🌋", title: "In the moment, it feels good — then it doesn't", text: "Explosive reactions feel like a release but leave you feeling worse and damage relationships.", fact: "HBSC data shows that teens with strong family communication report 35% higher life satisfaction than those with frequent unresolved conflict." },
        { emoji: "🧘", title: "The pause is powerful", text: "Asking for a minute before responding is emotional regulation — one of the most valuable skills for life.", fact: "Teens who report being able to calm themselves in conflict situations show significantly better mental health outcomes in HBSC research." },
        { emoji: "🧊", title: "Silence can also be harmful", text: "The silent treatment avoids explosion but leaves conflict unresolved, building tension over time.", fact: "Unresolved family conflict is one of the top predictors of adolescent anxiety and sleep disturbance in longitudinal health studies." },
      ],
    },
    {
      id: 9,
      emoji: "🎮",
      tag: "Screen Time",
      title: "One more match. It's 1 AM.",
      story: "Alex has been gaming for 4 hours. The friends online want to play one more ranked match. 'We're so close to ranking up. Just one more.'",
      choices: [
        { text: "Play the match — ranking up matters.", deltas: { sleep: -25, mood: +5, social: +10, focus: -20 }, good: false },
        { text: "Tell the team you're out and go to sleep.", deltas: { sleep: +25, mood: +5, social: -5, focus: +15 }, good: true },
        { text: "Set a real bedtime for gaming nights going forward.", deltas: { sleep: +15, mood: +10, social: +5, focus: +10 }, good: true },
      ],
      feedbacks: [
        { emoji: "🌑", title: "'One more' almost never is", text: "The 'just one more' loop is one of the most common patterns in excessive gaming. Tomorrow you'll regret this.", fact: "Excessive gaming (4+ hours daily) is associated with sleep disorders, academic underperformance, and social withdrawal in adolescents." },
        { emoji: "🛏️", title: "Your future self thanks you", text: "Logging off despite social pressure takes real self-discipline. That's a skill that transfers to everything in life.", fact: "Adolescents who maintain consistent sleep schedules — even on weekends — perform significantly better academically and report higher mood." },
        { emoji: "📅", title: "Systems beat willpower", text: "Creating a rule for yourself removes the decision from the moment. Smart long-term thinking.", fact: "HBSC data shows that teens with structured daily routines report lower stress and better wellbeing than those without consistent schedules." },
      ],
    },
    {
      id: 10,
      emoji: "🧠",
      tag: "Mental Health",
      title: "Alex hasn't felt like themselves for weeks.",
      story: "Nothing feels exciting anymore. Alex is tired all the time, skipping things they used to love. A friend notices and asks if everything's okay.",
      choices: [
        { text: "'I'm fine.' Brush it off and change the subject.", deltas: { sleep: -5, mood: -20, social: -10, focus: -10 }, good: false },
        { text: "Open up to the friend honestly.", deltas: { sleep: +5, mood: +20, social: +20, focus: +10 }, good: true },
        { text: "Ask a parent to make an appointment with a school counsellor.", deltas: { sleep: +10, mood: +25, social: +10, focus: +15 }, good: true },
      ],
      feedbacks: [
        { emoji: "🎭", title: "'I'm fine' is rarely fine", text: "Suppressing feelings doesn't make them disappear — it gives them more power. The friend noticed for a reason.", fact: "Only 1 in 3 Macedonian teens experiencing mental health difficulties seeks help from any source." },
        { emoji: "🫂", title: "That took courage", text: "Opening up to someone you trust is the first and often hardest step. It genuinely helps.", fact: "Teens who talk about emotional struggles with a trusted friend or adult recover from depressive episodes twice as fast on average." },
        { emoji: "🌱", title: "Asking for help is strength", text: "Seeking professional support early is one of the best investments in your own future. This is a brave, adult decision.", fact: "Early intervention in adolescent mental health leads to dramatically better long-term outcomes — HBSC emphasises access to school counsellors as a key protective factor." },
      ],
    },
    {
      id: 11,
      emoji: "🌍",
      tag: "Social Causes",
      title: "A classmate is being excluded.",
      story: "A quieter classmate keeps getting left out of group projects and lunch tables. Alex notices but the popular group expects Alex to go along with it.",
      choices: [
        { text: "Stay quiet — it's not your problem and you don't want drama.", deltas: { sleep: -5, mood: -15, social: +5, focus: -5 }, good: false },
        { text: "Invite the classmate to sit with you at lunch.", deltas: { sleep: +5, mood: +20, social: +15, focus: +10 }, good: true },
        { text: "Privately check in with the classmate to see how they're doing.", deltas: { sleep: +5, mood: +15, social: +10, focus: +10 }, good: true },
      ],
      feedbacks: [
        { emoji: "👁️", title: "Silence is a choice too", text: "Not acting when you see someone being excluded is a form of participation. It also tends to feel bad inside.", fact: "Bystander inaction is the single biggest enabler of social exclusion in schools, according to adolescent behaviour research." },
        { emoji: "💛", title: "One person can change everything", text: "A single act of inclusion can completely change how someone feels about school — and about themselves.", fact: "HBSC data shows that feeling accepted at school is one of the top three factors influencing adolescent mental health and academic performance." },
        { emoji: "🤍", title: "Kindness in private counts", text: "You didn't make a big scene — you simply checked in. That's genuine empathy, not performance.", fact: "Research on school belonging shows that even one positive social interaction per day significantly reduces feelings of isolation in teens." },
      ],
    },
  ],

  mk: [
    {
      id: 0,
      emoji: "🌙",
      tag: "Спиење и Екрани",
      title: "23:00. Утре си на училиште.",
      story: "Алекс скролнува веќе 3 часа. Групниот чет е во полн ек. Утре во 8:00 има испит, а телефонот светка тивко во темнината.",
      choices: [
        { text: "Продолжи да скролнуваш — премногу е забавно за да застанеш.", deltas: { sleep: -20, mood: +5, social: +10, focus: -15 }, good: false },
        { text: "Остави го телефонот и спиј цела ноќ.", deltas: { sleep: +20, mood: +10, social: -5, focus: +15 }, good: true },
        { text: "Постави тајмер на 30 минути, па потоа спиј.", deltas: { sleep: +5, mood: +5, social: +5, focus: +5 }, good: true },
      ],
      feedbacks: [
        { emoji: "😴", title: "Тешка ноќ пред тебе", text: "Останавте доцна и ја изгубивте драгоценото спиење. Утрешниот испит ќе биде потежок отколку што треба.", fact: "42% од македонските 15-годишници се жалат дека се уморни во училиште секој ден, директно поврзано со доцното гледање на екрани." },
        { emoji: "✨", title: "Паметен избор", text: "Цела ноќ спиење ја заострува меморијата и те подготвува за успех. Браво!", fact: "Тинејџерите треба 8–10 часа сон. HBSC податоците покажуваат дека само 30% од 15-годишниците во Македонија редовно го постигнуваат ова." },
        { emoji: "👍", title: "Добра рамнотежа", text: "Поставувањето ограничување покажа самоконтрола. Доби и социјално време И доволно одмор.", fact: "Времето пред екран пред спиење го одложува производството на мелатонин до 2 часа, влијаејќи на квалитетот на сонот дури и кога заспивате навреме." },
      ],
    },
    {
      id: 1,
      emoji: "📚",
      tag: "Стрес во Училиштето",
      title: "Денот на резултатите.",
      story: "Алекс добил шестка по математика. Чувствувањето е страшно. Сите останати изгледа дека имале подобри оценки. Притисокот за успех е огромен.",
      choices: [
        { text: "Тони во самокритика и прескокни ручек сам/а.", deltas: { sleep: -10, mood: -20, social: -15, focus: -10 }, good: false },
        { text: "Разговарај со пријател за тоа како се чувствуваш.", deltas: { sleep: 0, mood: +15, social: +20, focus: +5 }, good: true },
        { text: "Прашај го наставникот што можеш да подобриш следниот пат.", deltas: { sleep: 0, mood: +5, social: 0, focus: +20 }, good: true },
      ],
      feedbacks: [
        { emoji: "😟", title: "Не биди премногу строг/а кон себе", text: "Изолирањето кога си под стрес ги прави работите уште полоши. Дури и разговор од 5 минути може да го промени перспективниот.", fact: "Над 40% од македонските адолесценти пријавуваат висок степен на стрес поврзан со училиштето. Не си сам/а." },
        { emoji: "🤝", title: "Поврзаноста лечи", text: "Споделувањето на чувствата со пријател е еден од најефективните начини за справување со стрес.", fact: "HBSC податоците покажуваат дека тинејџерите кои разговараат со пријателите за проблемите пријавуваат значително поголемо задоволство во животот." },
        { emoji: "💪", title: "Растечки начин на размислување", text: "Барањето повратни информации ја претвора лошата оценка во можност за учење. Тоа е моќна навика.", fact: "Студентите кои бараат академски повратни информации по неуспесите покажуваат 23% поголеми стапки на подобрување во следните проценки." },
      ],
    },
    {
      id: 2,
      emoji: "💬",
      tag: "Сајбербулинг",
      title: "Некој е лош кон тебе онлајн.",
      story: "Анонимен профил поставува злобни коментари под секоја фотографија на Алекс. Некои соученици ги лајкуваат постовите. Стомакот на Алекс се превртува.",
      choices: [
        { text: "Одговори агресивно за да се одбраниш.", deltas: { sleep: -15, mood: -10, social: -10, focus: -15 }, good: false },
        { text: "Блокирај и пријави, потоа кажи му на возрасен кому му веруваш.", deltas: { sleep: +5, mood: +10, social: +5, focus: +10 }, good: true },
        { text: "Избриши ги сите социјални мрежи во фрустрација.", deltas: { sleep: +10, mood: -15, social: -20, focus: +5 }, good: false },
      ],
      feedbacks: [
        { emoji: "⚡", title: "Враќањето само го ескалира", text: "Одговарањето со агресија ретко помага и обично го влошува сајбербулингот.", fact: "Само 28% од тинејџерите кои доживуваат сајбербулинг во Македонија го пријавуваат кај возрасен, и покрај тоа што тоа е најефективното решение." },
        { emoji: "🛡️", title: "Точно вака треба", text: "Блокирањето ја отстранува нивната моќ. Пријавувањето создава запис. Кажувањето на возрасен значи дека не носиш сам/а.", fact: "Тинејџерите кои го пријавуваат сајбербулингот на возрасни ја решаваат ситуацијата во 70% од случаите во рок од две недели." },
        { emoji: "🌫️", title: "Привремено решение", text: "Бришењето на сметките ја отстранува непосредната болка, но те исклучува и од позитивните врски кои се важни.", fact: "HBSC покажува и позитивни (поддршка, поврзување) и негативни (споредба, малтретирање) исходи од социјалните медиуми за тинејџерите." },
      ],
    },
    {
      id: 3,
      emoji: "👥",
      tag: "Влијание на Врсниците",
      title: "Групата сака да прескокне час.",
      story: "Пријателите на Алекс планираат да го прескокнат попладнето и да шеткаат во шопинг-центарот. „Ајде, еднаш нема да наштети.“ Алекс се обидувал да ги подобри оценките.",
      choices: [
        { text: "Оди со нив — не сакаш да се чувствуваш исклучен/а.", deltas: { sleep: 0, mood: -5, social: +15, focus: -20 }, good: false },
        { text: "Остани на час, но покани ги да излезат после училиште.", deltas: { sleep: 0, mood: +10, social: +10, focus: +15 }, good: true },
        { text: "Лажи дека си болен/болна за да избегнеш притисок.", deltas: { sleep: -5, mood: -15, social: -5, focus: +5 }, good: false },
      ],
      feedbacks: [
        { emoji: "🎭", title: "Вклопување наспроти твоите цели", text: "Ги доби социјалните поени, но по вистинска цена за твојот фокус. Со текот на времето, вакви избори се наслагуваат.", fact: "HBSC истражувањето покажува дека влијанието на врсниците врз однесувањето во училиштето е највисоко на 14–15 години, но тинејџерите со силен идентитет се значително помалку подложни." },
        { emoji: "🌟", title: "Најдобро од двата света", text: "Ги задржа своите граници и го оддржа пријателството. Ова е емоционална интелигенција во акција.", fact: "Тинејџерите кои ги одржуваат академските обврски додека остануваат социјално поврзани покажуваат највисоки пријавени резултати на благосостојба во HBSC студијата." },
        { emoji: "🤖", title: "Избегнувањето не е решение", text: "Лагата избегнува конфликт, но го нарушува довербата и те прави да се чувствуваш полошо.", fact: "Асертивна комуникација — директно, но љубезно кажување „не“ — е вештина која може да се научи и значително ги подобрува исходите за менталното здравје кај тинејџерите." },
      ],
    },
    {
      id: 4,
      emoji: "🏃",
      tag: "Физичка Активност",
      title: "Слободно попладне. Ништо не е планирано.",
      story: "Училиштето завршило. Алекс ја фрла торбата и паѓа на каучот. Далечинскиот управувач и телефонот се токму таму. Беше многу уморна недела.",
      choices: [
        { text: "Нетфликс и телефон. Цела вечер на кауч.", deltas: { sleep: -10, mood: -5, social: -5, focus: -10 }, good: false },
        { text: "Оди на 30-минутна прошетка или возење велосипед надвор.", deltas: { sleep: +15, mood: +20, social: +5, focus: +15 }, good: true },
        { text: "Јави се на пријател да играте фудбал или прошетате заедно.", deltas: { sleep: +10, mood: +20, social: +20, focus: +10 }, good: true },
      ],
      feedbacks: [
        { emoji: "🛋️", title: "Одморот е во ред, но…", text: "Цела вечер без движење всушност те остава да се чувствуваш уште поуморен, не помалку. Дури и 20 минути движење би помогнало.", fact: "Само 18% од македонските тинејџери го исполнуваат препорачаните 60 минути дневна физичка активност на СЗО." },
        { emoji: "🌿", title: "Твојот мозок ти благодари", text: "Физичката активност ослободува ендорфини кои го подобруваат расположението, го намалуваат стресот и помагаат подобро да спиете.", fact: "Редовната физичка активност е еден од најсилните заштитни фактори против адолесцентна депресија во HBSC истражувањето." },
        { emoji: "🎉", title: "Движење + поврзување", text: "Ова е совршената комбинација — вежбање и време за социјализација. И двете независно се поврзани со повисока благосостојба.", fact: "Тинејџерите кои комбинираат редовна физичка активност со силни врски со врсниците имаат 40% пониски стапки на пријавена осаменост." },
      ],
    },
    {
      id: 5,
      emoji: "💭",
      tag: "Осаменост",
      title: "Петок навечер, и сите изгледа дека се зафатени.",
      story: "Алекс гледа фотографии од соученици на забава на која не бил/а поканет/а. Познатата болка од исклученост. Собата е многу тивка.",
      choices: [
        { text: "Помини ја вечерта споредувајќи се со другите онлајн.", deltas: { sleep: -15, mood: -25, social: -10, focus: -10 }, good: false },
        { text: "Контактирај со една особа — дури и само за да разговарате.", deltas: { sleep: +5, mood: +15, social: +20, focus: +5 }, good: true },
        { text: "Искористи го тивкото време за нешто што вистински уживаш.", deltas: { sleep: +10, mood: +15, social: 0, focus: +15 }, good: true },
      ],
      feedbacks: [
        { emoji: "📱", title: "Стапицата на споредбата", text: "Социјалните медиуми прикажуваат уредени моменти, не реален живот. Скролувањето кога си исклучен/а ја засилува осаменоста значително.", fact: "1 од 4 македонски тинејџери пријавува дека се чувствува осамено повеќето од времето — ова е многу почесто отколку мислите." },
        { emoji: "💌", title: "Поврзувањето почнува со една порака", text: "Потребна е храброст за да стапите во контакт, но дури и еден вистински разговор може целосно да го промени начинот на кој се чувствувате.", fact: "Тинејџерите со барем еден близок доверлив пријател покажуваат значително пониски стапки на депресија и анксиозност." },
        { emoji: "🎨", title: "Самотија наспроти осаменост", text: "Постои разлика помеѓу тоа да си сам и да се чувствуваш осамено. Изборот на активност која ти се допаѓа ја трансформира едната во другата.", fact: "Имањето хоби и лични интереси е силен предиктор на адолесцентна отпорност и задоволство во животот." },
      ],
    },
    {
      id: 6,
      emoji: "🍔",
      tag: "Навики во Исхраната",
      title: "Ручек во училиштето.",
      story: "Редот во трпезаријата е долг. Алекс е многу гладен/гладна, но има само 15 минути. Автоматот е токму таму — чипс и сок би биле брзи.",
      choices: [
        { text: "Земи чипс и сок од автоматот.", deltas: { sleep: -5, mood: -10, social: 0, focus: -15 }, good: false },
        { text: "Чекај во ред за вистински топол ручек.", deltas: { sleep: +5, mood: +10, social: +10, focus: +15 }, good: true },
        { text: "Прескокни ручек — не е толку гладен/гладна за да чека.", deltas: { sleep: -5, mood: -15, social: -10, focus: -20 }, good: false },
      ],
      feedbacks: [
        { emoji: "🍟", title: "Брзо, но скапо", text: "Скок на шеќер сега значи пад за 30 минути — токму среде попладневните часови.", fact: "HBSC податоците покажуваат дека 30% од македонските тинејџери секојдневно го прескокнуваат појадокот, што доведува до проблеми со концентрацијата и пониски академски перформанси." },
        { emoji: "🥗", title: "Вредно чекање", text: "Избалансиран оброк го храни твојот мозок за остатокот од денот. Добра одлука.", fact: "Тинејџерите кои јадат редовни избалансирани оброци пријавуваат значително подобра концентрација, расположение и ниво на енергија во текот на училишниот ден." },
        { emoji: "😵", title: "На празен резервоар", text: "Прескокнувањето на оброците е едно од најлошите нешта за фокусот и расположението — на твојот мозок му треба гориво секои неколку часа.", fact: "Прескокнувањето на оброци е поврзано со пониски академски перформанси и повисоки стапки на емоционална нестабилност кај адолесцентите низ HBSC нациите." },
      ],
    },
    {
      id: 7,
      emoji: "🚬",
      tag: "Притисок за Зависности",
      title: "На забава. Некој нуди цигара.",
      story: "Алекс е на домашна забава. Постар соученик нуди цигара. „Сите го прават. Само пробај.“ Некои луѓе гледаат.",
      choices: [
        { text: "Пробај — не сакаш да изгледаш незгодно.", deltas: { sleep: -10, mood: -10, social: +5, focus: -15 }, good: false },
        { text: "Кажи „не, благодарам“ едноставно и самоуверено.", deltas: { sleep: +5, mood: +15, social: +5, focus: +10 }, good: true },
        { text: "Измисли изговор и оди подалеку од групата.", deltas: { sleep: 0, mood: +5, social: -10, focus: +5 }, good: true },
      ],
      feedbacks: [
        { emoji: "😶‍🌫️", title: "Не вреди", text: "Попуштањето под притисок за да изгледаш кул ретко функционира — а здравствените последици почнуваат од самата прва цигара.", fact: "Во Македонија, 22% од 15-годишниците пробале пушење. Оние кои пушат за прв пат имаат 3x поголема веројатност да станат редовни пушачи." },
        { emoji: "💚", title: "Самодовербата е најкул нешто", text: "Мирното, едноставно „не, благодарам“ е една од најмоќните социјални вештини кои тинејџерот може да ги развие. Не мораш да се објаснуваш.", fact: "Тинејџерите кои пријавуваат самодоверба во социјалните ситуации имаат значително помала веројатност да експериментираат со супстанции." },
        { emoji: "🚶", title: "Оддалечувањето исто така функционира", text: "Понекогаш најдобриот одговор на притисок е едноставно физички да ја напуштите ситуацијата. Добар инстинкт.", fact: "Ситуациската свесност — препознавање и избегнување на ситуации со висок притисок — е клучен заштитен фактор за здравјето на адолесцентите." },
      ],
    },
    {
      id: 8,
      emoji: "😤",
      tag: "Семеен Конфликт",
      title: "Голема кавга со родител.",
      story: "Родителот на Алекс рекол нешто што изгледало навистина неправедно и критично. Алекс е бесен/бесна. Зборовите се готови да експлодираат.",
      choices: [
        { text: "Врати назад со викање и затвори ја вратата од собата.", deltas: { sleep: -15, mood: -20, social: -10, focus: -10 }, good: false },
        { text: "Кажи „Ми треба минута“ и земи 10 минути да се смириш.", deltas: { sleep: +5, mood: +10, social: +10, focus: +10 }, good: true },
        { text: "Замолчи и одбиј да зборуваш цел остаток од денот.", deltas: { sleep: -10, mood: -15, social: -15, focus: -5 }, good: false },
      ],
      feedbacks: [
        { emoji: "🌋", title: "Во моментот изгледа добро — потоа не", text: "Експлозивните реакции се чувствуваат како ослободување, но те оставаат да се чувствуваш полошо и ги оштетуваат односите.", fact: "HBSC податоците покажуваат дека тинејџерите со силна семејна комуникација пријавуваат 35% повисоко задоволство во животот од оние со чести нерешени конфликти." },
        { emoji: "🧘", title: "Паузата е моќна", text: "Барањето минута пред да одговориш е емоционална регулација — една од највредните вештини за животот.", fact: "Тинејџерите кои пријавуваат дека можат да се смират во конфликтни ситуации покажуваат значително подобри исходи за менталното здравје во HBSC истражувањето." },
        { emoji: "🧊", title: "Тишината исто така може да биде штетна", text: "Мртвата тишина избегнува експлозија, но го остава конфликтот нерешен, градејќи напнатост со текот на времето.", fact: "Нерешениот семеен конфликт е еден од главните предиктори на адолесцентна анксиозност и нарушување на спиењето во лонгитудинални здравствени студии." },
      ],
    },
    {
      id: 9,
      emoji: "🎮",
      tag: "Екранско Време",
      title: "Уште еден меч. Еден часот е.",
      story: "Алекс игра компјутерски игри веќе 4 часа. Пријателите онлајн сакаат да играат уште еден рангиран меч. „Толку сме блиску до рангирање. Само уште еден.“",
      choices: [
        { text: "Играј го мечот — рангирањето е важно.", deltas: { sleep: -25, mood: +5, social: +10, focus: -20 }, good: false },
        { text: "Кажи му на тимот дека излегуваш и одиш да спиеш.", deltas: { sleep: +25, mood: +5, social: -5, focus: +15 }, good: true },
        { text: "Постави вистинско време за спиење за вечери кога играш игри.", deltas: { sleep: +15, mood: +10, social: +5, focus: +10 }, good: true },
      ],
      feedbacks: [
        { emoji: "🌑", title: "„Уште еден“ скоро никогаш не е еден", text: "Циклусот „само уште еден“ е еден од најчестите обрасци во прекумерното играње. Утре ќе жалиш.", fact: "Прекумерното играње (4+ часа дневно) е поврзано со нарушувања на спиењето, академско слабо перформирање и социјална повлеченост кај адолесцентите." },
        { emoji: "🛏️", title: "Твоето идно јас ти благодари", text: "Одјавувањето и покрај социјалниот притисок бара вистинска самодисциплина. Тоа е вештина која се пренесува на сé во животот.", fact: "Адолесцентите кои одржуваат конзистентни распореди за спиење — дури и за викенди — значително подобро академски перформираат и пријавуваат подобро расположение." },
        { emoji: "📅", title: "Системите победуваат над волјата", text: "Создавањето правило за себе ја отстранува одлуката од моментот. Паметно долгорочно размислување.", fact: "HBSC податоците покажуваат дека тинејџерите со структурирани дневни рутини пријавуваат помал стрес и подобра благосостојба од оние без конзистентни распореди." },
      ],
    },
    {
      id: 10,
      emoji: "🧠",
      tag: "Ментално Здравје",
      title: "Алекс не се чувствува себе си со недели.",
      story: "Ништо повеќе не е возбудливо. Алекс е уморен/уморна цело времe, прескокнувајќи работи кои порано ги сакал/а. Пријател забележува и прашува дали е сé во ред.",
      choices: [
        { text: "„Добро сум.“ Замини и смени тема.", deltas: { sleep: -5, mood: -20, social: -10, focus: -10 }, good: false },
        { text: "Отвори му се на пријателот искрено.", deltas: { sleep: +5, mood: +20, social: +20, focus: +10 }, good: true },
        { text: "Побарај од родител да закажи термин кај советник во училиштето.", deltas: { sleep: +10, mood: +25, social: +10, focus: +15 }, good: true },
      ],
      feedbacks: [
        { emoji: "🎭", title: "„Добро сум“ ретко значи добро", text: "Потиснувањето на чувствата не ги прави да исчезнат — им дава поголема моќ. Пријателот забележал со причина.", fact: "Само 1 од 3 македонски тинејџери кои доживуваат тешкотии со менталното здравје бара помош од кој и да е извор." },
        { emoji: "🫂", title: "Тоа беше храброст", text: "Отворањето пред некого кому му веруваш е првиот и најчесто најтешкиот чекор. Тоа навистина помага.", fact: "Тинејџерите кои разговараат за емоционалните борби со доверлив пријател или возрасен закрепнуваат од депресивни епизоди двапати побрзо во просек." },
        { emoji: "🌱", title: "Барањето помош е сила", text: "Барањето стручна поддршка рано е една од најдобрите инвестиции во твојата иднина. Ова е храбра, зрела одлука.", fact: "Раната интервенција во адолесцентното ментално здравје доведува до значително подобри долгорочни исходи — HBSC го нагласува пристапот до советници во училиштето како клучен заштитен фактор." },
      ],
    },
    {
      id: 11,
      emoji: "🌍",
      tag: "Општествени Прашања",
      title: "Соученик е исклучен.",
      story: "Потивок соученик постојано е оставен/оставена надвор од групни проекти и маси за ручек. Алекс забележува, но популарната група очекува Алекс да се согласи со тоа.",
      choices: [
        { text: "Остани тивок/тивка — не е твој проблем и не сакаш драма.", deltas: { sleep: -5, mood: -15, social: +5, focus: -5 }, good: false },
        { text: "Покани го соученикот да седи со тебе на ручек.", deltas: { sleep: +5, mood: +20, social: +15, focus: +10 }, good: true },
        { text: "Приватно провери со соученикот за да видиш дали е добро.", deltas: { sleep: +5, mood: +15, social: +10, focus: +10 }, good: true },
      ],
      feedbacks: [
        { emoji: "👁️", title: "Тишината исто така е избор", text: "Неактивноста кога гледаш некого да биде исклучен е форма на учество. Исто така, обично се чувствуваш лошо внатре.", fact: "Неактивноста на набљудувачите е единствениот најголем поддржувач на социјалната исклученост во училиштата, според истражувањето за однесувањето на адолесцентите." },
        { emoji: "💛", title: "Една личност може да промени сé", text: "Еден чин на вклученост може целосно да го промени начинот на кој некој се чувствува за училиштето — и за себе.", fact: "HBSC податоците покажуваат дека чувството на прифаќање во училиштето е еден од трите главни фактори кои влијаат на менталното здравје на адолесцентите и академските перформанси." },
        { emoji: "🤍", title: "Добрината во приватност исто така брои", text: "Не направи голема сцена — едноставно провери. Тоа е вистинска емпатија, не претставување.", fact: "Истражувањето за припадност во училиштето покажува дека дури и една позитивна социјална интеракција дневно значително ги намалува чувствата на изолираност кај тинејџерите." },
      ],
    },
  ],
};

      const STAT_CONFIG = {
        sleep:  { label: "Sleep",  labelMk: "Спиење", emoji: "🌙", color: "#378ADD" },
        mood:   { label: "Mood",   labelMk: "Расположение", emoji: "💜", color: "#D4537E" },
        social: { label: "Social", labelMk: "Социјализираност", emoji: "👥", color: "#1D9E75" },
        focus:  { label: "Focus",  labelMk: "Фокус", emoji: "🧠", color: "#BA7517" },
      };

// ─── HELPERS ─────────────────────────────────────────────────────────────────

      const clamp = (v) => Math.max(5, Math.min(100, v));
      const letters = ["A", "B", "C"];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

      function StatBar({ statKey, value, lang }) {
        const cfg = STAT_CONFIG[statKey];
        const label = lang === "mk" ? cfg.labelMk : cfg.label;
        return (
            <div style={styles.statCell}>
              <div style={styles.statLabel}>
                <span>{cfg.emoji}</span> {label}
              </div>
              <div style={styles.statBarBg}>
                <div
                    style={{
                      ...styles.statBarFill,
                      width: `${value}%`,
                      background: cfg.color,
                      transition: "width 0.5s cubic-bezier(0.34,1.56,0.64,1)",
                    }}
                />
              </div>
              <span style={styles.statNum}>{value}</span>
            </div>
        );
      }

      function ProgressDots({ total, current }) {
        return (
            <div style={styles.progressTrack}>
              {Array.from({ length: total }).map((_, i) => (
                  <div
                      key={i}
                      style={{
                        ...styles.dot,
                        ...(i < current
                            ? styles.dotDone
                            : i === current
                                ? styles.dotCurrent
                                : {}),
                      }}
                  />
              ))}
            </div>
        );
      }

// ─── SCREENS ─────────────────────────────────────────────────────────────────

      function LanguageScreen({ onSelect }) {
        const t = UI.en.langScreen;
        return (
            <div style={styles.introWrap}>
              <span style={styles.badge}>HBSC Study · Macedonia · 2026</span>
              <div style={{ fontSize: 48, lineHeight: 1 }}>🌐</div>
              <h1 style={{ ...styles.introTitle, fontSize: 32 }}>
                {t.title}
                <br />
                <span style={{ fontSize: 18, fontWeight: 400, color: "#888" }}>
            {t.sub}
          </span>
              </h1>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap", justifyContent: "center" }}>
                <button
                    style={{ ...styles.btnPrimary, fontSize: 16, padding: "14px 32px" }}
                    onClick={() => onSelect("mk")}
                >
                  {t.mkBtn}
                </button>
                <button
                    style={{
                      ...styles.btnPrimary,
                      fontSize: 16,
                      padding: "14px 32px",
                      background: "#378ADD",
                    }}
                    onClick={() => onSelect("en")}
                >
                  {t.enBtn}
                </button>
              </div>
            </div>
        );
      }

      function IntroScreen({ onStart, lang }) {
        const t = UI[lang];
        return (
            <div style={styles.introWrap}>
              <span style={styles.badge}>{t.badge}</span>
              <h1 style={styles.introTitle}>
                {t.introTitle1}<br />
                <span style={{ color: "#1D9E75" }}>{t.introTitle2}</span>
              </h1>
              <p style={styles.introSub}>{t.introSub}</p>
              <button style={styles.btnPrimary} onClick={onStart}>
                {t.startBtn}
              </button>
              <p style={styles.hbscNote}>{t.hbscNote}</p>
            </div>
        );
      }

      function GameScreen({ scenario, stats, current, total, onChoice, lang }) {
        const t = UI[lang];
        return (
            <div style={styles.gameWrap}>
              <div style={styles.gameHeader}>
                <ProgressDots total={total} current={current} />
                <span style={styles.stepLabel}>
            {t.stepLabel(current + 1, total)}
          </span>
              </div>

              <div style={styles.statsBar}>
                {Object.keys(STAT_CONFIG).map((k) => (
                    <StatBar key={k} statKey={k} value={stats[k]} lang={lang} />
                ))}
              </div>

              <div style={styles.scenarioArea}>
                <div style={styles.sceneContext}>
                  <span style={styles.sceneEmoji}>{scenario.emoji}</span>
                  <div>
                    <div style={styles.sceneTag}>{scenario.tag}</div>
                    <div style={styles.sceneTitle}>{scenario.title}</div>
                  </div>
                </div>
                <p style={styles.sceneStory}>{scenario.story}</p>
                <div style={styles.choicesLabel}>{t.whatDoesAlex}</div>
                <div style={styles.choices}>
                  {scenario.choices.map((c, i) => (
                      <ChoiceButton
                          key={i}
                          letter={letters[i]}
                          text={c.text}
                          onClick={() => onChoice(i)}
                      />
                  ))}
                </div>
              </div>
            </div>
        );
      }

      function ChoiceButton({ letter, text, onClick }) {
        return (
            <button
                className="choice-button"
                style={styles.choiceBtn}
                onClick={onClick}
            >
      <span className="choice-letter" style={styles.choiceLetter}>
        {letter}
      </span>
              <span style={styles.choiceText}>{text}</span>
            </button>
        );
      }

      function FeedbackScreen({ feedback, deltas, isLast, onNext, lang }) {
        const t = UI[lang];
        return (
            <div style={styles.feedbackWrap}>
              <div style={styles.feedbackEmoji}>{feedback.emoji}</div>
              <div style={styles.feedbackTitle}>{feedback.title}</div>
              <p style={styles.feedbackText}>{feedback.text}</p>

              <div style={styles.deltasRow}>
                {Object.entries(deltas).map(([k, v]) => {
                  const label = lang === "mk" ? STAT_CONFIG[k].labelMk : STAT_CONFIG[k].label;
                  return (
                      <span
                          key={k}
                          style={{
                            ...styles.deltaPill,
                            ...(v > 0 ? styles.deltaPos : v < 0 ? styles.deltaNeg : styles.deltaNeu),
                          }}
                      >
                  {label} {v > 0 ? "+" : ""}{v}
                </span>
                  );
                })}
              </div>

              <div style={styles.hbscFact}>
                <span style={{ fontSize: 18 }}>📊</span>
                <div>
                  <div style={styles.factLabel}>{t.hbscFact}</div>
                  <div style={styles.factText}>{feedback.fact}</div>
                </div>
              </div>

              <button style={styles.btnPrimary} onClick={onNext}>
                {isLast ? t.seeResults : t.nextBtn}
              </button>
            </div>
        );
      }

      function EndScreen({ stats, choiceHistory, onRestart, lang }) {
        const [aiReport, setAiReport] = useState(null);
        const [loading, setLoading] = useState(true);
        const t = UI[lang];

        const avg = Math.round(Object.values(stats).reduce((a, b) => a + b, 0) / 4);
        const title =
            avg >= 75 ? t.endTitles.thriving
                : avg >= 55 ? t.endTitles.okay
                    : t.endTitles.support;

        useEffect(() => {
          fetchReport();
        }, []);

        async function fetchReport() {
          try {
            const res = await fetch("http://localhost:3001/api/summary", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ stats, choiceHistory, language: lang }),
            });

            if (!res.ok) throw new Error("Server error");
            const data = await res.json();
            setAiReport(data.summary || null);
          } catch {
            setAiReport(
                lang === "mk"
                    ? "Ги заврши сите 12 сценарија! Секој избор ja обликуваше добросостојбата на Алекс. Вистинската моќ лежи во малите, конзистентни одлуки — спиењето, поврзаноста, движењето и искреноста сé имаат поголемо значење отколку што мислиме."
                    : "You completed all 12 scenarios! Every choice shaped Alex's wellbeing. The real power lies in small, consistent decisions — sleep, connection, movement, and honesty all matter more than we realise."
            );
          } finally {
            setLoading(false);
          }
        }

        return (
            <div style={styles.endWrap}>
              <div style={styles.endHeader}>
                <div style={styles.endTitle}>{title}</div>
                <div style={styles.endSub}>{t.endSub}</div>
              </div>

              <div style={styles.finalStats}>
                {Object.entries(stats).map(([k, v]) => {
                  const cfg = STAT_CONFIG[k];
                  const label = lang === "mk" ? cfg.labelMk : cfg.label;
                  return (
                      <div key={k} style={styles.finalStatCard}>
                        <span style={{ fontSize: 22 }}>{cfg.emoji}</span>
                        <span style={styles.finalStatName}>{label}</span>
                        <span style={styles.finalStatVal}>{v}</span>
                        <div style={styles.finalStatBarBg}>
                          <div
                              style={{
                                ...styles.finalStatBarFill,
                                width: `${v}%`,
                                background: cfg.color,
                              }}
                          />
                        </div>
                      </div>
                  );
                })}
              </div>

              <div style={styles.aiReport}>
                <div style={styles.aiReportLabel}>{t.aiLabel}</div>
                {loading ? (
                    <div style={styles.aiLoading}>
                      <span>{t.aiLoading}</span>
                      <span style={styles.dots}>...</span>
                    </div>
                ) : (
                    <p style={styles.aiReportText}>{aiReport}</p>
                )}
              </div>

              <button style={styles.restartBtn} onClick={onRestart}>
                {t.playAgain}
              </button>
            </div>
        );
      }

// ─── APP ─────────────────────────────────────────────────────────────────────

    export default function App() {
      const [screen, setScreen] = useState("language");
      const [lang, setLang] = useState(null);
      const [stats, setStats] = useState({ sleep: 70, mood: 70, social: 70, focus: 70 });
      const [current, setCurrent] = useState(0);
      const [pendingChoice, setPendingChoice] = useState(null);
      const [choiceHistory, setChoiceHistory] = useState([]);

      useEffect(() => {
        const noScroll = ["language", "intro", "feedback"];
        document.body.style.overflow = noScroll.includes(screen) ? "hidden" : "auto";

        return () => {
          document.body.style.overflow = "auto";
        };
      }, [screen]);

      function selectLanguage(selectedLang) {
        setLang(selectedLang);
        setScreen("intro");
      }

      function startGame() {
        setStats({ sleep: 70, mood: 70, social: 70, focus: 70 });
        setCurrent(0);
        setChoiceHistory([]);
        setPendingChoice(null);
        setScreen("game");
      }

      function restartToLanguage() {
        setLang(null);
        setStats({ sleep: 70, mood: 70, social: 70, focus: 70 });
        setCurrent(0);
        setChoiceHistory([]);
        setPendingChoice(null);
        setScreen("language");
      }

      function makeChoice(idx) {
        const scenarios = SCENARIOS[lang];
        const scenario = scenarios[current];
        const choice = scenario.choices[idx];
        const feedback = scenario.feedbacks[idx];

        const newStats = { ...stats };
        Object.entries(choice.deltas).forEach(([k, v]) => {
          newStats[k] = clamp(newStats[k] + v);
        });

        setStats(newStats);
        setPendingChoice({ feedback, deltas: choice.deltas, good: choice.good, scenario: scenario.tag });
        setChoiceHistory((prev) => [
          ...prev,
          { scenario: scenario.tag, good: choice.good },
        ]);
        setScreen("feedback");
      }

      function nextScenario() {
        const total = SCENARIOS[lang].length;
        if (current >= total - 1) {
          setScreen("end");
        } else {
          setCurrent((c) => c + 1);
          setScreen("game");
        }
      }

      if (screen === "language") return <LanguageScreen onSelect={selectLanguage} />;
      if (screen === "intro") return <IntroScreen onStart={startGame} lang={lang} />;
      if (screen === "game")
        return (
            <GameScreen
                scenario={SCENARIOS[lang][current]}
                stats={stats}
                current={current}
                total={SCENARIOS[lang].length}
                onChoice={makeChoice}
                lang={lang}
            />
        );
      if (screen === "feedback" && pendingChoice)
        return (
            <FeedbackScreen
                feedback={pendingChoice.feedback}
                deltas={pendingChoice.deltas}
                isLast={current >= SCENARIOS[lang].length - 1}
                onNext={nextScenario}
                lang={lang}
            />
        );
      if (screen === "end")
        return (
            <EndScreen
                stats={stats}
                choiceHistory={choiceHistory}
                onRestart={restartToLanguage}
                lang={lang}
            />
        );
      return null;
    }
