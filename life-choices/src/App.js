// src/App.js
import { useState, useEffect } from "react";
import { styles } from "./styles";
import "./index.css";

// ─── DATA ────────────────────────────────────────────────────────────────────

const SCENARIOS = [
  {
    id: 0,
    emoji: "🌙",
    tag: "Sleep & Screens",
    title: "11 PM. School tomorrow.",
    story:
        "Alex has been scrolling for 3 hours. The group chat is going wild. There's an exam at 8 AM and the phone glows softly in the dark.",
    choices: [
      {
        text: "Keep scrolling — it's too fun to stop now.",
        deltas: { sleep: -20, mood: +5, social: +10, focus: -15 },
        good: false,
      },
      {
        text: "Put the phone away and get a full night's sleep.",
        deltas: { sleep: +20, mood: +10, social: -5, focus: +15 },
        good: true,
      },
      {
        text: "Set a 30-minute timer, then sleep.",
        deltas: { sleep: +5, mood: +5, social: +5, focus: +5 },
        good: true,
      },
    ],
    feedbacks: [
      {
        emoji: "😴",
        title: "Rough night ahead",
        text: "You stayed up late and missed precious sleep. Tomorrow's exam will be harder than it needs to be.",
        fact: "42% of Macedonian 15-year-olds report feeling tired at school every day, linked directly to late-night screen use.",
      },
      {
        emoji: "✨",
        title: "Smart choice",
        text: "A full night's sleep sharpens memory and helps you perform well. Well done!",
        fact: "Teens need 8–10 hours of sleep. HBSC data shows only 30% of 15-year-olds in Macedonia consistently get this.",
      },
      {
        emoji: "👍",
        title: "Good balance",
        text: "Setting a limit showed self-control. You got some social time AND enough rest.",
        fact: "Screen time before bed delays melatonin production by up to 2 hours, affecting sleep quality even if you fall asleep on time.",
      },
    ],
  },
  {
    id: 1,
    emoji: "📚",
    tag: "School Stress",
    title: "Exam results day.",
    story:
        "Alex got a 6 on the math test. It feels terrible. Everyone else seems to have done better. The pressure to succeed is overwhelming.",
    choices: [
      {
        text: "Spiral into self-criticism and skip lunch alone.",
        deltas: { sleep: -10, mood: -20, social: -15, focus: -10 },
        good: false,
      },
      {
        text: "Talk to a friend about how you're feeling.",
        deltas: { sleep: 0, mood: +15, social: +20, focus: +5 },
        good: true,
      },
      {
        text: "Ask the teacher what you can improve next time.",
        deltas: { sleep: 0, mood: +5, social: 0, focus: +20 },
        good: true,
      },
    ],
    feedbacks: [
      {
        emoji: "😟",
        title: "Don't be too hard on yourself",
        text: "Isolating when stressed makes everything feel worse. Even a 5-minute conversation can shift your perspective.",
        fact: "Over 40% of Macedonian adolescents report high levels of school-related stress. You're not alone.",
      },
      {
        emoji: "🤝",
        title: "Connection heals",
        text: "Sharing your feelings with a friend is one of the most effective ways to process stress.",
        fact: "HBSC data shows teens who talk to friends about problems report significantly higher life satisfaction scores.",
      },
      {
        emoji: "💪",
        title: "Growth mindset",
        text: "Asking for feedback turns a bad grade into a learning opportunity. That's a powerful habit.",
        fact: "Students who seek academic feedback after setbacks show 23% higher improvement rates in follow-up assessments.",
      },
    ],
  },
  {
    id: 2,
    emoji: "💬",
    tag: "Cyberbullying",
    title: "Someone is being mean online.",
    story:
        "An anonymous account is posting mean comments under every one of Alex's photos. Some classmates are liking the posts. Alex's stomach drops.",
    choices: [
      {
        text: "Respond aggressively to defend yourself.",
        deltas: { sleep: -15, mood: -10, social: -10, focus: -15 },
        good: false,
      },
      {
        text: "Block and report, then tell a trusted adult.",
        deltas: { sleep: +5, mood: +10, social: +5, focus: +10 },
        good: true,
      },
      {
        text: "Delete all your social media in frustration.",
        deltas: { sleep: +10, mood: -15, social: -20, focus: +5 },
        good: false,
      },
    ],
    feedbacks: [
      {
        emoji: "⚡",
        title: "Fighting back escalates things",
        text: "Responding with aggression rarely helps and usually makes cyberbullying worse.",
        fact: "Only 28% of teens who experience cyberbullying in Macedonia report it to an adult, despite it being the most effective solution.",
      },
      {
        emoji: "🛡️",
        title: "Exactly right",
        text: "Blocking removes their power. Reporting creates a record. Telling an adult means you're not carrying this alone.",
        fact: "Teens who report cyberbullying to adults resolve the situation in 70% of cases within two weeks.",
      },
      {
        emoji: "🌫️",
        title: "A temporary fix",
        text: "Deleting accounts removes immediate pain but also cuts you off from positive connections that matter.",
        fact: "HBSC shows both positive (support, connection) and negative (comparison, bullying) outcomes of social media for teens.",
      },
    ],
  },
  {
    id: 3,
    emoji: "👥",
    tag: "Peer Pressure",
    title: "The group wants to skip class.",
    story:
        "Alex's friends are planning to skip the afternoon and hang out at the mall. 'Come on, one time won't hurt.' Alex has been trying to improve grades.",
    choices: [
      {
        text: "Go along — you don't want to feel left out.",
        deltas: { sleep: 0, mood: -5, social: +15, focus: -20 },
        good: false,
      },
      {
        text: "Stay in class but invite them to hang out after school.",
        deltas: { sleep: 0, mood: +10, social: +10, focus: +15 },
        good: true,
      },
      {
        text: "Lie and say you're sick to avoid the pressure.",
        deltas: { sleep: -5, mood: -15, social: -5, focus: +5 },
        good: false,
      },
    ],
    feedbacks: [
      {
        emoji: "🎭",
        title: "Fitting in vs. your goals",
        text: "You got the social points but at a real cost to your focus. Over time, choices like this compound.",
        fact: "HBSC research shows peer influence on school behaviour peaks at ages 14–15, but teens with strong self-identity are significantly less susceptible.",
      },
      {
        emoji: "🌟",
        title: "Best of both worlds",
        text: "You kept your boundaries AND maintained the friendship. This is emotional intelligence in action.",
        fact: "Teens who maintain academic commitments while staying socially connected show the highest reported wellbeing scores in the HBSC study.",
      },
      {
        emoji: "🤖",
        title: "Avoidance isn't a solution",
        text: "Lying avoids conflict but damages trust and makes you feel worse about yourself.",
        fact: "Assertive communication — saying no directly but kindly — is a learnable skill that dramatically improves teen mental health outcomes.",
      },
    ],
  },
  {
    id: 4,
    emoji: "🏃",
    tag: "Physical Activity",
    title: "Free afternoon. Nothing planned.",
    story:
        "School's done. Alex drops the bag and falls onto the couch. The TV remote and phone are right there. It's been a really tiring week.",
    choices: [
      {
        text: "Netflix and phone. Full couch mode all evening.",
        deltas: { sleep: -10, mood: -5, social: -5, focus: -10 },
        good: false,
      },
      {
        text: "Go for a 30-minute walk or bike ride outside.",
        deltas: { sleep: +15, mood: +20, social: +5, focus: +15 },
        good: true,
      },
      {
        text: "Call a friend to play football or walk together.",
        deltas: { sleep: +10, mood: +20, social: +20, focus: +10 },
        good: true,
      },
    ],
    feedbacks: [
      {
        emoji: "🛋️",
        title: "Rest is fine, but…",
        text: "A full sedentary evening actually leaves you feeling more tired, not less. Even 20 minutes of movement would have helped.",
        fact: "Only 18% of Macedonian teens meet the WHO recommendation of 60 minutes of daily physical activity.",
      },
      {
        emoji: "🌿",
        title: "Your brain thanks you",
        text: "Physical activity releases endorphins that improve mood, reduce stress, and help you sleep better.",
        fact: "Regular physical activity is one of the strongest protective factors against adolescent depression in HBSC research.",
      },
      {
        emoji: "🎉",
        title: "Movement + connection",
        text: "This is the ultimate combo — exercise AND social time. Both independently linked to higher wellbeing.",
        fact: "Teens who combine regular physical activity with strong peer relationships have 40% lower rates of reported loneliness.",
      },
    ],
  },
  {
    id: 5,
    emoji: "💭",
    tag: "Loneliness",
    title: "Friday night, and everyone seems busy.",
    story:
        "Alex sees photos of classmates at a party they weren't invited to. The familiar sting of being left out. The room feels very quiet.",
    choices: [
      {
        text: "Spend the night comparing yourself to others online.",
        deltas: { sleep: -15, mood: -25, social: -10, focus: -10 },
        good: false,
      },
      {
        text: "Reach out to one person — even just to chat.",
        deltas: { sleep: +5, mood: +15, social: +20, focus: +5 },
        good: true,
      },
      {
        text: "Use the quiet time for something you genuinely enjoy.",
        deltas: { sleep: +10, mood: +15, social: 0, focus: +15 },
        good: true,
      },
    ],
    feedbacks: [
      {
        emoji: "📱",
        title: "The comparison trap",
        text: "Social media shows curated highlights, not real life. Scrolling when left out amplifies loneliness significantly.",
        fact: "1 in 4 Macedonian teenagers reports feeling lonely most of the time — it's far more common than you think.",
      },
      {
        emoji: "💌",
        title: "Connection starts with one message",
        text: "It takes courage to reach out, but even one genuine conversation can completely shift how you feel.",
        fact: "Teens with at least one close confidant show significantly lower rates of depression and anxiety.",
      },
      {
        emoji: "🎨",
        title: "Solitude vs. loneliness",
        text: "There's a difference between being alone and feeling lonely. Choosing an activity you love transforms one into the other.",
        fact: "Having hobbies and personal interests is a strong predictor of adolescent resilience and life satisfaction.",
      },
    ],
  },
  {
    id: 6,
    emoji: "🍔",
    tag: "Eating Habits",
    title: "Lunchtime at school.",
    story:
        "The cafeteria line is long. Alex is really hungry but only has 15 minutes. The vending machine is right there — chips and a soda would be quick.",
    choices: [
      {
        text: "Grab chips and soda from the vending machine.",
        deltas: { sleep: -5, mood: -10, social: 0, focus: -15 },
        good: false,
      },
      {
        text: "Wait in line for a proper hot lunch.",
        deltas: { sleep: +5, mood: +10, social: +10, focus: +15 },
        good: true,
      },
      {
        text: "Skip lunch entirely — not hungry enough to wait.",
        deltas: { sleep: -5, mood: -15, social: -10, focus: -20 },
        good: false,
      },
    ],
    feedbacks: [
      {
        emoji: "🍟",
        title: "Quick but costly",
        text: "A sugar spike now means a crash in 30 minutes — right in the middle of afternoon classes.",
        fact: "HBSC data shows 30% of Macedonian teens skip breakfast daily, leading to concentration problems and lower academic performance.",
      },
      {
        emoji: "🥗",
        title: "Worth the wait",
        text: "A balanced meal fuels your brain for the rest of the day. Good call.",
        fact: "Teens who eat regular balanced meals report significantly better concentration, mood, and energy levels throughout the school day.",
      },
      {
        emoji: "😵",
        title: "Running on empty",
        text: "Skipping meals entirely is one of the worst things for focus and mood — your brain needs fuel every few hours.",
        fact: "Skipping meals is linked to lower academic performance and higher rates of emotional instability in adolescents across HBSC nations.",
      },
    ],
  },
  {
    id: 7,
    emoji: "🚬",
    tag: "Substance Pressure",
    title: "At a party. Someone offers a cigarette.",
    story:
        "Alex is at a house party. An older classmate offers a cigarette. 'Everyone's doing it. Just try it.' Some people are watching.",
    choices: [
      {
        text: "Try it — you don't want to look uncool.",
        deltas: { sleep: -10, mood: -10, social: +5, focus: -15 },
        good: false,
      },
      {
        text: "Say 'no thanks' simply and confidently.",
        deltas: { sleep: +5, mood: +15, social: +5, focus: +10 },
        good: true,
      },
      {
        text: "Make an excuse and walk away from the group.",
        deltas: { sleep: 0, mood: +5, social: -10, focus: +5 },
        good: true,
      },
    ],
    feedbacks: [
      {
        emoji: "😶‍🌫️",
        title: "Not worth it",
        text: "Giving in to pressure to seem cool rarely works — and the health consequences start from the very first cigarette.",
        fact: "In Macedonia, 22% of 15-year-olds have tried smoking. First-time smokers are 3x more likely to become regular smokers.",
      },
      {
        emoji: "💚",
        title: "Confidence is the coolest thing",
        text: "A calm, simple 'no thanks' is one of the most powerful social skills a teen can develop. You didn't need to explain yourself.",
        fact: "Teens who report feeling confident in social situations are significantly less likely to experiment with substances.",
      },
      {
        emoji: "🚶",
        title: "Removing yourself works too",
        text: "Sometimes the best response to pressure is just to physically leave the situation. Good instinct.",
        fact: "Situational awareness — recognising and avoiding high-pressure moments — is a key protective factor in adolescent health.",
      },
    ],
  },
  {
    id: 8,
    emoji: "😤",
    tag: "Family Conflict",
    title: "A big fight with a parent.",
    story:
        "Alex's parent said something that felt really unfair and critical. Alex is furious. The words are right there, ready to explode.",
    choices: [
      {
        text: "Shout back and slam the bedroom door.",
        deltas: { sleep: -15, mood: -20, social: -10, focus: -10 },
        good: false,
      },
      {
        text: "Say 'I need a minute' and take 10 minutes to calm down.",
        deltas: { sleep: +5, mood: +10, social: +10, focus: +10 },
        good: true,
      },
      {
        text: "Go silent and refuse to talk for the rest of the day.",
        deltas: { sleep: -10, mood: -15, social: -15, focus: -5 },
        good: false,
      },
    ],
    feedbacks: [
      {
        emoji: "🌋",
        title: "In the moment, it feels good — then it doesn't",
        text: "Explosive reactions feel like a release but leave you feeling worse and damage relationships.",
        fact: "HBSC data shows that teens with strong family communication report 35% higher life satisfaction than those with frequent unresolved conflict.",
      },
      {
        emoji: "🧘",
        title: "The pause is powerful",
        text: "Asking for a minute before responding is emotional regulation — one of the most valuable skills for life.",
        fact: "Teens who report being able to calm themselves in conflict situations show significantly better mental health outcomes in HBSC research.",
      },
      {
        emoji: "🧊",
        title: "Silence can also be harmful",
        text: "The silent treatment avoids explosion but leaves conflict unresolved, building tension over time.",
        fact: "Unresolved family conflict is one of the top predictors of adolescent anxiety and sleep disturbance in longitudinal health studies.",
      },
    ],
  },
  {
    id: 9,
    emoji: "🎮",
    tag: "Screen Time",
    title: "One more match. It's 1 AM.",
    story:
        "Alex has been gaming for 4 hours. The friends online want to play one more ranked match. 'We're so close to ranking up. Just one more.'",
    choices: [
      {
        text: "Play the match — ranking up matters.",
        deltas: { sleep: -25, mood: +5, social: +10, focus: -20 },
        good: false,
      },
      {
        text: "Tell the team you're out and go to sleep.",
        deltas: { sleep: +25, mood: +5, social: -5, focus: +15 },
        good: true,
      },
      {
        text: "Set a real bedtime for gaming nights going forward.",
        deltas: { sleep: +15, mood: +10, social: +5, focus: +10 },
        good: true,
      },
    ],
    feedbacks: [
      {
        emoji: "🌑",
        title: "'One more' almost never is",
        text: "The 'just one more' loop is one of the most common patterns in excessive gaming. Tomorrow you'll regret this.",
        fact: "Excessive gaming (4+ hours daily) is associated with sleep disorders, academic underperformance, and social withdrawal in adolescents.",
      },
      {
        emoji: "🛏️",
        title: "Your future self thanks you",
        text: "Logging off despite social pressure takes real self-discipline. That's a skill that transfers to everything in life.",
        fact: "Adolescents who maintain consistent sleep schedules — even on weekends — perform significantly better academically and report higher mood.",
      },
      {
        emoji: "📅",
        title: "Systems beat willpower",
        text: "Creating a rule for yourself removes the decision from the moment. Smart long-term thinking.",
        fact: "HBSC data shows that teens with structured daily routines report lower stress and better wellbeing than those without consistent schedules.",
      },
    ],
  },
  {
    id: 10,
    emoji: "🧠",
    tag: "Mental Health",
    title: "Alex hasn't felt like themselves for weeks.",
    story:
        "Nothing feels exciting anymore. Alex is tired all the time, skipping things they used to love. A friend notices and asks if everything's okay.",
    choices: [
      {
        text: "'I'm fine.' Brush it off and change the subject.",
        deltas: { sleep: -5, mood: -20, social: -10, focus: -10 },
        good: false,
      },
      {
        text: "Open up to the friend honestly.",
        deltas: { sleep: +5, mood: +20, social: +20, focus: +10 },
        good: true,
      },
      {
        text: "Ask a parent to make an appointment with a school counsellor.",
        deltas: { sleep: +10, mood: +25, social: +10, focus: +15 },
        good: true,
      },
    ],
    feedbacks: [
      {
        emoji: "🎭",
        title: "'I'm fine' is rarely fine",
        text: "Suppressing feelings doesn't make them disappear — it gives them more power. The friend noticed for a reason.",
        fact: "Only 1 in 3 Macedonian teens experiencing mental health difficulties seeks help from any source.",
      },
      {
        emoji: "🫂",
        title: "That took courage",
        text: "Opening up to someone you trust is the first and often hardest step. It genuinely helps.",
        fact: "Teens who talk about emotional struggles with a trusted friend or adult recover from depressive episodes twice as fast on average.",
      },
      {
        emoji: "🌱",
        title: "Asking for help is strength",
        text: "Seeking professional support early is one of the best investments in your own future. This is a brave, adult decision.",
        fact: "Early intervention in adolescent mental health leads to dramatically better long-term outcomes — HBSC emphasises access to school counsellors as a key protective factor.",
      },
    ],
  },
  {
    id: 11,
    emoji: "🌍",
    tag: "Social Causes",
    title: "A classmate is being excluded.",
    story:
        "A quieter classmate keeps getting left out of group projects and lunch tables. Alex notices but the popular group expects Alex to go along with it.",
    choices: [
      {
        text: "Stay quiet — it's not your problem and you don't want drama.",
        deltas: { sleep: -5, mood: -15, social: +5, focus: -5 },
        good: false,
      },
      {
        text: "Invite the classmate to sit with you at lunch.",
        deltas: { sleep: +5, mood: +20, social: +15, focus: +10 },
        good: true,
      },
      {
        text: "Privately check in with the classmate to see how they're doing.",
        deltas: { sleep: +5, mood: +15, social: +10, focus: +10 },
        good: true,
      },
    ],
    feedbacks: [
      {
        emoji: "👁️",
        title: "Silence is a choice too",
        text: "Not acting when you see someone being excluded is a form of participation. It also tends to feel bad inside.",
        fact: "Bystander inaction is the single biggest enabler of social exclusion in schools, according to adolescent behaviour research.",
      },
      {
        emoji: "💛",
        title: "One person can change everything",
        text: "A single act of inclusion can completely change how someone feels about school — and about themselves.",
        fact: "HBSC data shows that feeling accepted at school is one of the top three factors influencing adolescent mental health and academic performance.",
      },
      {
        emoji: "🤍",
        title: "Kindness in private counts",
        text: "You didn't make a big scene — you simply checked in. That's genuine empathy, not performance.",
        fact: "Research on school belonging shows that even one positive social interaction per day significantly reduces feelings of isolation in teens.",
      },
    ],
  },
];

const STAT_CONFIG = {
  sleep:  { label: "Sleep",  emoji: "🌙", color: "#378ADD" },
  mood:   { label: "Mood",   emoji: "💜", color: "#D4537E" },
  social: { label: "Social", emoji: "👥", color: "#1D9E75" },
  focus:  { label: "Focus",  emoji: "🧠", color: "#BA7517" },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const clamp = (v) => Math.max(5, Math.min(100, v));
const letters = ["A", "B", "C"];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StatBar({ statKey, value }) {
  const cfg = STAT_CONFIG[statKey];
  return (
      <div style={styles.statCell}>
        <div style={styles.statLabel}>
          <span>{cfg.emoji}</span> {cfg.label}
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

function IntroScreen({ onStart }) {
  return (
      <div style={styles.introWrap}>
        <span style={styles.badge}>HBSC Study · Macedonia · 2026</span>
        <h1 style={styles.introTitle}>
          Your choices shape<br />
          <span style={{ color: "#1D9E75" }}>your wellbeing</span>
        </h1>
        <p style={styles.introSub}>
          You are Alex, a 15-year-old from Skopje. Face 12 real-life situations
          and discover how your daily choices affect your mental and physical
          health.
        </p>
        <button style={styles.btnPrimary} onClick={onStart}>
          Start playing
        </button>
        <p style={styles.hbscNote}>
          Based on real data from the HBSC international health study. Your
          choices reflect challenges faced by thousands of Macedonian teens.
        </p>
      </div>
  );
}

function GameScreen({ scenario, stats, current, total, onChoice }) {
  return (
      <div style={styles.gameWrap}>
        <div style={styles.gameHeader}>
          <ProgressDots total={total} current={current} />
          <span style={styles.stepLabel}>
          Scenario {current + 1} of {total}
        </span>
        </div>

        <div style={styles.statsBar}>
          {Object.keys(STAT_CONFIG).map((k) => (
              <StatBar key={k} statKey={k} value={stats[k]} />
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
          <div style={styles.choicesLabel}>What does Alex do?</div>
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

function FeedbackScreen({ feedback, deltas, isLast, onNext }) {
  return (
      <div style={styles.feedbackWrap}>
        <div style={styles.feedbackEmoji}>{feedback.emoji}</div>
        <div style={styles.feedbackTitle}>{feedback.title}</div>
        <p style={styles.feedbackText}>{feedback.text}</p>

        <div style={styles.deltasRow}>
          {Object.entries(deltas).map(([k, v]) => (
              <span
                  key={k}
                  style={{
                    ...styles.deltaPill,
                    ...(v > 0
                        ? styles.deltaPos
                        : v < 0
                            ? styles.deltaNeg
                            : styles.deltaNeu),
                  }}
              >
            {STAT_CONFIG[k].label} {v > 0 ? "+" : ""}
                {v}
          </span>
          ))}
        </div>

        <div style={styles.hbscFact}>
          <span style={{ fontSize: 18 }}>📊</span>
          <div>
            <div style={styles.factLabel}>HBSC Fact</div>
            <div style={styles.factText}>{feedback.fact}</div>
          </div>
        </div>

        <button style={styles.btnPrimary} onClick={onNext}>
          {isLast ? "See my results" : "Next scenario →"}
        </button>
      </div>
  );
}

function EndScreen({ stats, choiceHistory, onRestart }) {
  const [aiReport, setAiReport] = useState(null);
  const [loading, setLoading] = useState(true);

  const avg = Math.round(
      Object.values(stats).reduce((a, b) => a + b, 0) / 4
  );
  const title =
      avg >= 75
          ? "Alex is thriving 🌟"
          : avg >= 55
              ? "Alex is doing okay 🌱"
              : "Alex needs more support 💙";

  useEffect(() => {
    fetchReport();
  }, []);

  async function fetchReport() {
    try {
      const res = await fetch("http://localhost:3001/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats, choiceHistory }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setAiReport(data.summary || null);
    } catch {
      setAiReport(
          "You completed all 12 scenarios! Every choice shaped Alex's wellbeing. The real power lies in small, consistent decisions — sleep, connection, movement, and honesty all matter more than we realise."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
      <div style={styles.endWrap}>
        <div style={styles.endHeader}>
          <div style={styles.endTitle}>{title}</div>
          <div style={styles.endSub}>
            Here's how your choices shaped Alex's life
          </div>
        </div>

        <div style={styles.finalStats}>
          {Object.entries(stats).map(([k, v]) => {
            const cfg = STAT_CONFIG[k];
            return (
                <div key={k} style={styles.finalStatCard}>
                  <span style={{ fontSize: 22 }}>{cfg.emoji}</span>
                  <span style={styles.finalStatName}>{cfg.label}</span>
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
          <div style={styles.aiReportLabel}>✨ AI Wellbeing Summary</div>
          {loading ? (
              <div style={styles.aiLoading}>
                <span>Analysing your choices</span>
                <span style={styles.dots}>...</span>
              </div>
          ) : (
              <p style={styles.aiReportText}>{aiReport}</p>
          )}
        </div>

        <button style={styles.restartBtn} onClick={onRestart}>
          Play again
        </button>
      </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState("intro");
  const [stats, setStats] = useState({ sleep: 70, mood: 70, social: 70, focus: 70 });
  const [current, setCurrent] = useState(0);
  const [pendingChoice, setPendingChoice] = useState(null);
  const [choiceHistory, setChoiceHistory] = useState([]);

  function startGame() {
    setStats({ sleep: 70, mood: 70, social: 70, focus: 70 });
    setCurrent(0);
    setChoiceHistory([]);
    setPendingChoice(null);
    setScreen("game");
  }

  function makeChoice(idx) {
    const scenario = SCENARIOS[current];
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
    if (current >= SCENARIOS.length - 1) {
      setScreen("end");
    } else {
      setCurrent((c) => c + 1);
      setScreen("game");
    }
  }

  if (screen === "intro") return <IntroScreen onStart={startGame} />;
  if (screen === "game")
    return (
        <GameScreen
            scenario={SCENARIOS[current]}
            stats={stats}
            current={current}
            total={SCENARIOS.length}
            onChoice={makeChoice}
        />
    );
  if (screen === "feedback" && pendingChoice)
    return (
        <FeedbackScreen
            feedback={pendingChoice.feedback}
            deltas={pendingChoice.deltas}
            isLast={current >= SCENARIOS.length - 1}
            onNext={nextScenario}
        />
    );
  if (screen === "end")
    return (
        <EndScreen
            stats={stats}
            choiceHistory={choiceHistory}
            onRestart={startGame}
        />
    );
  return null;
}