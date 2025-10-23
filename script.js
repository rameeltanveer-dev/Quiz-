/* script.js — Final quiz logic with 3-level celebrations (0-69,70-100) */

/* ---------- CONFIG ---------- */
const TOTAL_MINUTES = 40;
const PER_QUESTION_SECONDS = 40;
const TOTAL_SECONDS = TOTAL_MINUTES * 60;
const FIXED_WHATSAPP = '03196393269';
const FIXED_EMAIL = 'rameeltanveer19@gmail.com';

/* ---------- QUESTION BANK (40+ items) ---------- */
const BANK = [
  {q:"Which CSS property sets text color?", a:"color", o:["font-color","text-color","color","foreground"], topic:"Colors"},
  {q:"Which HEX code represents black?", a:"#000000", o:["#FFFFFF","#000000","#FF0000","#00FF00"], topic:"Colors"},
  {q:"How to prevent background image repeating?", a:"background-repeat: no-repeat;", o:["background-repeat: repeat-x;","background-repeat: no-repeat;","background-attach: fixed;","repeat: none;"], topic:"Colors"},
  {q:"Which property sets background color?", a:"background-color", o:["bgcolor","background-color","color-bg","bg"], topic:"Colors"},
  {q:"What does rgba(0,0,0,0.5) control?", a:"color with opacity", o:["font size","color with opacity","border style","background-image"], topic:"Colors"},
  {q:"HEX #FFFFFF means which color?", a:"white", o:["black","white","gray","transparent"], topic:"Colors"},
  {q:"Which property controls font size?", a:"font-size", o:["font-weight","font-size","font-family","text-size"], topic:"Text & Fonts"},
  {q:"Which property makes text bold?", a:"font-weight", o:["font-style","font-weight","font-variant","text-bold"], topic:"Text & Fonts"},
  {q:"How to make text uppercase?", a:"text-transform: uppercase;", o:["text-case: upper;","text-transform: uppercase;","font-variant: caps;","transform-text:upper"], topic:"Text & Fonts"},
  {q:"Which property sets font family?", a:"font-family", o:["font","font-family","font-type","typeface"], topic:"Text & Fonts"},
  {q:"How to underline text via CSS?", a:"text-decoration: underline;", o:["text-underline: true;","text-decoration: underline;","underline:true;","font-decoration: underline;"], topic:"Text & Fonts"},
  {q:"Which property changes line height?", a:"line-height", o:["line-space","line-height","text-gap","height-line"], topic:"Text & Fonts"},
  {q:"What property adjusts letter spacing?", a:"letter-spacing", o:["word-spacing","letter-spacing","text-space","char-spacing"], topic:"Text & Fonts"},
  {q:"Which property sets inner spacing?", a:"padding", o:["margin","padding","border","gap"], topic:"Box Model"},
  {q:"Which property sets outer spacing?", a:"margin", o:["padding","margin","gap","spacing"], topic:"Box Model"},
  {q:"Shorthand for border width, style and color?", a:"border: 2px solid black;", o:["border: 2px solid black;","border-width:2px;","border-style:solid;","border-color:black;"], topic:"Box Model"},
  {q:"How to make corners rounded?", a:"border-radius", o:["border-round","border-radius","corner-radius","round-corner"], topic:"Box Model"},
  {q:"Which property controls overflow?", a:"overflow", o:["overflow","wrap","clip","flow"], topic:"Box Model"},
  {q:"Which sets width of box?", a:"width", o:["size","width","box-width","max-width"], topic:"Box Model"},
  {q:"Which property controls box shadow?", a:"box-shadow", o:["shadow","box-shadow","text-shadow","drop-shadow"], topic:"Box Model"},
  {q:"position: absolute; positions relative to?", a:"nearest positioned ancestor", o:["viewport","nearest positioned ancestor","body element","document"], topic:"Positioning"},
  {q:"What does position: fixed do?", a:"fixes element relative to viewport", o:["fixes within parent","fixes element relative to viewport","makes element static","removes element"], topic:"Positioning"},
  {q:"How to center block horizontally?", a:"margin: 0 auto;", o:["align:center;","margin:0 auto;","text-align:center;","position:center;"], topic:"Positioning"},
  {q:"Which property controls stacking order?", a:"z-index", o:["z-index","stack-order","order","layer"], topic:"Positioning"},
  {q:"Which position keeps element in normal flow?", a:"static", o:["static","relative","absolute","fixed"], topic:"Positioning"},
  {q:"Relative position moves element relative to?", a:"its normal position", o:["viewport","parent","its normal position","document"], topic:"Positioning"},
  {q:"How to make a container flex?", a:"display: flex;", o:["display:block;","display:flex;","display:inline;","flex:yes;"], topic:"Flexbox"},
  {q:"Center items horizontally in flex?", a:"justify-content: center;", o:["align-items:center;","justify-content:center;","flex-center:true;","center-items:both;"], topic:"Flexbox"},
  {q:"Center items vertically in flex?", a:"align-items: center;", o:["align-items:center;","justify-items:center;","vertical-align:center;","align-content:center"], topic:"Flexbox"},
  {q:"Space between items in flex?", a:"justify-content: space-between;", o:["space-between","justify:space","justify-content: space-between;","gap:space"], topic:"Flexbox"},
  {q:"Which property wraps flex items?", a:"flex-wrap", o:["wrap","flex-wrap","flex-flow","flex-direction"], topic:"Flexbox"},
  {q:"How to set direction in flex?", a:"flex-direction", o:["flex-direction","direction","flex-flow","align-direction"], topic:"Flexbox"},
  {q:"Shorthand for flex grow/shrink/basis?", a:"flex", o:["flex","flex-basis","flex-flow","flex-grow"], topic:"Flexbox"},
  {q:"Which rule imports fonts?", a:"@import url('font-link');", o:["@font-face","@import url('font-link');","@font-link","@font"], topic:"Misc"},
  {q:"How to hide element but keep space?", a:"visibility: hidden;", o:["display:none;","visibility:hidden;","opacity:0;","hide:true;"], topic:"Misc"},
  {q:"Which hides element completely and removes space?", a:"display: none;", o:["visibility:hidden;","display:none;","opacity:0;","hidden:true;"], topic:"Misc"},
  {q:"How to write CSS comment?", a:"/* comment */", o:["// comment","/* comment */","<!-- comment -->","# comment"], topic:"Misc"},
  {q:"What does box-sizing:border-box do?", a:"includes padding in width", o:["excludes padding","includes padding in width","collapses margin","adds border outside"], topic:"Misc"},
  {q:"Which selects class in CSS?", a:".classname", o:["#classname",".classname","classname","*classname"], topic:"Misc"},
  {q:"Which property centers inline text?", a:"text-align", o:["align","text-align","center-inline","inline-align"], topic:"Misc"}
];

/* ---------- STATE ---------- */
let userName = null;
let questions = [];
let current = 0, correct = 0, wrong = 0, perTopic = {};
let totalSecondsLeft = TOTAL_SECONDS, perQuestionSecondsLeft = PER_QUESTION_SECONDS;
let globalTimerId = null, questionTimerId = null, answeredThisQ = false;

/* ---------- UI refs ---------- */
const loginSection = document.getElementById('loginSection');
const nameInput = document.getElementById('nameInput');
const startWithName = document.getElementById('startWithName');
const loginMsg = document.getElementById('loginMsg');
const quizApp = document.getElementById('quizApp');
const progressText = document.getElementById('progressText');
const topicBadge = document.getElementById('topicBadge');
const questionText = document.getElementById('questionText');
const optionsList = document.getElementById('optionsList');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const globalTimerEl = document.getElementById('globalTimer');
const qTimerEl = document.getElementById('qTimer');

/* ---------- FIREWORKS AUDIO ---------- */
const fireworksAudio = new Audio("https://cdn.pixabay.com/download/audio/2022/03/10/audio_197b88c681.mp3?filename=fireworks-10-419029.mp3");

document.body.addEventListener("click", () => {
  fireworksAudio.play().then(() => {
    fireworksAudio.pause();
    fireworksAudio.currentTime = 0;
  }).catch(() => {});
}, { once: true });

function playFireworks() {
  fireworksAudio.currentTime = 0;
  fireworksAudio.play();
}

/* ---------- HELPERS ---------- */
function shuffle(a){ for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a; }
function formatTime(s){ const m=Math.floor(s/60).toString().padStart(2,'0'); const sec=(s%60).toString().padStart(2,'0'); return `${m}:${sec}`; }
function canAttempt(name){ const key = `quiz_attempt_${name.toLowerCase()}`; return !localStorage.getItem(key); }
function markAttempt(name){ const key = `quiz_attempt_${name.toLowerCase()}`; localStorage.setItem(key, Date.now().toString()); }

/* ---------- START CLICK ---------- */
startWithName.addEventListener('click', ()=>{
  const val = nameInput.value.trim();
  loginMsg.textContent = "";
  if(!val){ 
    loginMsg.textContent = "براہِ کرم اپنا نام لکھیں / Please enter your name"; 
    return; 
  }
  if(!canAttempt(val)){ 
    loginMsg.textContent = "اس نام سے اس ڈیوائس پر پہلے ہی کوئز حل کیا جا چکا ہے / This device has already attempted the quiz with this name"; 
    return; 
  }
  userName = val; markAttempt(userName); beginQuiz();
});

/* ---------- BEGIN QUIZ ---------- */
function beginQuiz(){
  questions = shuffle(BANK.slice()).slice(0,40).map(q => ({...q}));
  current = 0; correct = 0; wrong = 0; perTopic = {};
  questions.forEach(q=>{ if(!perTopic[q.topic]) perTopic[q.topic] = {total:0,correct:0,wrong:0}; perTopic[q.topic].total++; });

  loginSection.classList.add('hidden');
  quizApp.classList.remove('hidden');

  totalSecondsLeft = TOTAL_SECONDS; perQuestionSecondsLeft = PER_QUESTION_SECONDS;
  globalTimerEl.textContent = formatTime(totalSecondsLeft);
  qTimerEl.textContent = formatTime(perQuestionSecondsLeft);

  prevBtn.disabled = true;
  startGlobalTimer(); loadQuestion();
}

/* ---------- TIMERS ---------- */
function startGlobalTimer(){
  stopGlobalTimer();
  globalTimerId = setInterval(()=>{
    totalSecondsLeft--;
    if(totalSecondsLeft < 0){ clearInterval(globalTimerId); finishQuiz(); return; }
    globalTimerEl.textContent = formatTime(totalSecondsLeft);
  }, 1000);
}
function stopGlobalTimer(){ if(globalTimerId) clearInterval(globalTimerId); }

function startQuestionTimer(){
  stopQuestionTimer();
  perQuestionSecondsLeft = PER_QUESTION_SECONDS;
  qTimerEl.textContent = formatTime(perQuestionSecondsLeft);
  questionTimerId = setInterval(()=>{
    perQuestionSecondsLeft--;
    qTimerEl.textContent = formatTime(perQuestionSecondsLeft);
    if(perQuestionSecondsLeft <= 0){
      stopQuestionTimer();
      markWrongDueToTimeout();
      setTimeout(()=> goNextAfterAuto(), 700);
    }
  }, 1000);
}
function stopQuestionTimer(){ if(questionTimerId) clearInterval(questionTimerId); }

function markWrongDueToTimeout(){
  const item = questions[current];
  wrong++;
  if(perTopic[item.topic]) perTopic[item.topic].wrong++;
  document.querySelectorAll('.option').forEach(o=>{
    if(o.dataset.text === item.a) o.classList.add('correct');
    o.classList.add('disabled');
  });
  answeredThisQ = true;
  nextBtn.disabled = false;
}

/* ---------- LOAD QUESTION ---------- */
function loadQuestion(){
  answeredThisQ = false;
  nextBtn.disabled = true;
  const item = questions[current];
  progressText.innerHTML = `<span>Question ${current + 1} / ${questions.length}</span> 
                          <span style="font-family: 'Noto Nastaliq Urdu', serif;"> | سوال ${current + 1} / ${questions.length}</span>`;
  topicBadge.textContent = item.topic;
  questionText.textContent = item.q;
  const opts = shuffle(item.o.slice());
  optionsList.innerHTML = opts.map(opt => `<div class="option" role="button" tabindex="0" data-text="${escapeHtml(opt)}">${escapeHtml(opt)}</div>`).join('');
  document.querySelectorAll('.option').forEach(el=>{
    el.addEventListener('click', ()=> selectOption(el, item));
    el.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectOption(el, item); }});
  });
  startQuestionTimer();
}

/* ---------- SELECT OPTION ---------- */
function selectOption(el, item){
  if(answeredThisQ) return;
  answeredThisQ = true;
  document.querySelectorAll('.option').forEach(o=> o.classList.add('disabled'));
  const chosen = unescapeHtml(el.dataset.text);
  if(chosen === item.a){
    el.classList.add('correct');
    correct++;
    if(perTopic[item.topic]) perTopic[item.topic].correct++;
  } else {
    el.classList.add('wrong');
    wrong++;
    if(perTopic[item.topic]) perTopic[item.topic].wrong++;
    document.querySelectorAll('.option').forEach(o=>{
      if(unescapeHtml(o.dataset.text) === item.a) o.classList.add('correct');
    });
  }
  nextBtn.disabled = false;
  stopQuestionTimer();
}

/* ---------- NAVIGATION ---------- */
nextBtn.addEventListener('click', ()=> { if(!nextBtn.disabled) goNext(); });
function goNext(){
  current++;
  if(current < questions.length) loadQuestion();
  else finishQuiz();
}
function goNextAfterAuto(){
  if(current < questions.length - 1){
    current++;
    loadQuestion();
  } else finishQuiz();
}

/* ---------- FINISH QUIZ ---------- */
function finishQuiz(){
  stopGlobalTimer(); stopQuestionTimer();
  const total = questions.length;
  const percent = Math.round((correct/total)*100);

  if (percent >= 70) {
    playFireworks(); // 🔥 Safe autoplay
    alert("🎉 Congratulations! You scored " + percent + "%");
  } else {
    alert("😌 کوشش جاری رکھیں / Keep Trying\nYou scored " + percent + "%");
  }

  // Send results via WhatsApp and Gmail
  const waMsg = encodeURIComponent(`Quiz Result for ${userName}: ${percent}% — Correct:${correct}, Wrong:${wrong}`);
  window.open(`https://wa.me/${FIXED_WHATSAPP}?text=${waMsg}`, '_blank');
  const mailMsg = encodeURIComponent(`Quiz Result for ${userName}: ${percent}% — Correct:${correct}, Wrong:${wrong}`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${FIXED_EMAIL}&su=CSS Quiz Result&body=${mailMsg}`, '_blank');
    }
