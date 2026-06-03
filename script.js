const SHEET_ENDPOINT = "https://script.google.com/macros/s/AKfycby-hQaMBw-ATucmupyZ_lfItS78q8oSTITK5WSJxnVvfJXy3xRlox8Wi49dHuhG3si8/exec";

const questions = [
  {
    title: "投資に回せるお金が「10万円」あります。どう使いたい？",
    choices: {
      A: "多少リスクがあっても、数ヶ月で15万円や20万円に増える可能性があるものに投資したい。",
      B: "とにかく減らしたくない。年間で数千円でも確実に増えれば十分。",
      C: "話題の企業や、これから世界を大きく変えそうなテクノロジー分野に投資したい。",
      D: "仕組みや手数料、過去10年のデータなどをしっかり比較して、一番納得できるものに投資したい。"
    }
  },
  {
    title: "投資した資産が、翌日に「10%値下がり」していました。あなたの心境は？",
    choices: {
      A: "「絶好の買いチャンスが来た！」と考え、買い増しを検討する。",
      B: "夜も眠れないほど不安になり、これ以上損が出る前に売るべきか真剣に悩む。",
      C: "「まあ、そのうち戻るだろう」と、あまり気にせず放置する。",
      D: "なぜ下がったのか、市場のニュースやチャートの要因をすぐに調べ始める。"
    }
  },
  {
    title: "普段の買い物（家電や旅行など）を決めるときのあなたの行動は？",
    choices: {
      A: "インスピレーション重視。「これだ！」と思ったら予算オーバーでも勢いで買う。",
      B: "口コミや失敗談を念入りにチェックし、できるだけ「失敗しない安牌」を選ぶ。",
      C: "最新モデルや、周りの人がまだ持っていない珍しいものに惹かれやすい。",
      D: "スペック表やコスパを徹底的に比較し、一番合理的な選択肢をロジカルに導き出す。"
    }
  },
  {
    title: "あなたが投資（資産運用）に求める「一番の目的」は？",
    choices: {
      A: "効率よく資産を増やし、早期のリタイアや次のビジネスの軍資金にしたい。",
      B: "老後や将来の不安をなくし、生活の安定を守りたい。",
      C: "時代のトレンドに乗り、経済の動きを体感しながら楽しみたい。",
      D: "自分の仮説や計画が、データ通りに正しく機能するプロセスを楽しみたい。"
    }
  }
];

const results = {
  A: {
    title: "「せっかち」さん（タイプA）",
    summary: "決断が速く、資金効率やスピーディーな結果を求めやすいタイプです。",
    methods: "FX（短期トレード）・レバレッジ投信・個別株（デイトレ等）",
    reason: "資金効率（レバレッジ）を高くして、数時間〜数日単位のスピーディーな結果を追求できるため、持ち前の決断力が活きます。",
    caution: "熱くなりすぎて資金管理を怠り、一撃で大きな損失を出すリスクがあります。"
  },
  B: {
    title: "「石橋たたき慎重」さん（タイプB）",
    summary: "安定を重視し、損失への不安をできるだけ小さくしたいタイプです。",
    methods: "個人向け国債・定期預金、ネット銀金利・インデックス投資（超手堅く）",
    reason: "日本国政府が元本を保証する国債や、元本割れリスクの極めて低い預金ベースの運用なら、夜も眠れなくなる心配がありません。",
    caution: "安全性を重視するあまり、インフレ（物価上昇）が起きたときに実質的な資産価値が目減りしやすい点です。"
  },
  C: {
    title: "「お祭り大好き」さん（タイプC）",
    summary: "新しいテーマや未来感のある分野にワクワクしやすいタイプです。",
    methods: "テーマ型投資（AI、宇宙等）・米国個別株、新興国株・暗号資産（少額）",
    reason: "世の中を大きく変えそうなトレンドや、ワクワクする未来に投資できるため、買った後は「気長に放置」という大らかさが強みになります。",
    caution: "流行のピーク（高値圏）で飛び乗ってしまい、その後ブームが去って塩漬け（放置）になりやすい点です。"
  },
  D: {
    title: "「じっくり納得」さん（タイプD）",
    summary: "根拠やデータを大切にし、納得してから動きたいタイプです。",
    methods: "全世界/全米インデックス・高配当株（データ分析）・ロボアドバイザー",
    reason: "過去数十年のバックテスト（過去データ検証）が十分であり、手数料の安さや分配の仕組みが論理的に説明できる運用と最高の相性です。",
    caution: "分析に時間をかけすぎて「買い時」を逃す（機会損失）ことや、理屈が通じない暴落局面で考え込んでしまう点です。"
  }
};

const state = {
  participant: {},
  current: 0,
  answers: []
};

const screens = Object.fromEntries(
  [...document.querySelectorAll(".screen")].map((screen) => [screen.dataset.screen, screen])
);
const entryForm = document.querySelector("#entryForm");
const questionEyebrow = document.querySelector("#questionEyebrow");
const questionTitle = document.querySelector("#questionTitle");
const choicesEl = document.querySelector("#choices");
const progressBar = document.querySelector("#progressBar");
const stepLabel = document.querySelector("#stepLabel");
const backButton = document.querySelector("#backButton");
const saveState = document.querySelector("#saveState");
const answerReviewList = document.querySelector("#answerReviewList");

function showScreen(name) {
  Object.values(screens).forEach((screen) => screen.classList.remove("active"));
  screens[name].classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderQuestion() {
  const question = questions[state.current];
  questionEyebrow.textContent = `Q${state.current + 1}`;
  questionTitle.textContent = question.title;
  stepLabel.textContent = `${state.current + 1} / ${questions.length}`;
  progressBar.style.width = `${((state.current + 1) / questions.length) * 100}%`;
  backButton.disabled = state.current === 0;
  choicesEl.innerHTML = "";

  Object.entries(question.choices).forEach(([key, text]) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.innerHTML = `<b>${key}</b><span>${text}</span>`;
    button.addEventListener("click", () => chooseAnswer(key));
    choicesEl.append(button);
  });
}

function chooseAnswer(key) {
  state.answers[state.current] = key;
  if (state.current < questions.length - 1) {
    state.current += 1;
    renderQuestion();
    return;
  }
  renderResult();
}

function calculateType() {
  const counts = { A: 0, B: 0, C: 0, D: 0 };
  state.answers.forEach((answer) => {
    counts[answer] += 1;
  });
  return Object.entries(counts).sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return state.answers.indexOf(a[0]) - state.answers.indexOf(b[0]);
  })[0][0];
}

function renderResult() {
  const type = calculateType();
  const result = results[type];
  document.querySelector("#resultTitle").textContent = result.title;
  document.querySelector("#resultSummary").textContent = result.summary;
  document.querySelector("#resultMethods").textContent = result.methods;
  document.querySelector("#resultReason").textContent = result.reason;
  document.querySelector("#resultCaution").textContent = result.caution;
  renderAnswerReview();
  saveState.classList.remove("error");
  saveState.textContent = "";
  showScreen("result");
  saveSubmission(type, result);
}

function renderAnswerReview() {
  answerReviewList.innerHTML = "";
  state.answers.forEach((answer, index) => {
    const item = document.createElement("li");
    const question = questions[index];
    item.innerHTML = `
      <span class="review-question">Q${index + 1}. ${question.title}</span>
      <strong>${answer}</strong>
      <span>${question.choices[answer]}</span>
    `;
    answerReviewList.append(item);
  });
}

async function saveSubmission(type, result) {
  const payload = {
    submittedAt: new Date().toISOString(),
    name: state.participant.name,
    sns: state.participant.sns,
    answers: state.answers.join(""),
    type,
    character: result.title,
    userAgent: navigator.userAgent
  };

  if (!SHEET_ENDPOINT) {
    return;
  }

  try {
    await fetch(SHEET_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload)
    });
    saveState.textContent = "";
  } catch (error) {
    saveState.classList.add("error");
    saveState.textContent = "保存に失敗しました。通信環境または保存先URLを確認してください。";
  }
}

entryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(entryForm);
  state.participant = {
    name: formData.get("name").trim(),
    sns: formData.get("sns").trim()
  };
  state.current = 0;
  state.answers = [];
  renderQuestion();
  showScreen("quiz");
});

backButton.addEventListener("click", () => {
  if (state.current === 0) return;
  state.current -= 1;
  renderQuestion();
});

document.querySelector("#restartButton").addEventListener("click", () => {
  state.current = 0;
  state.answers = [];
  renderQuestion();
  showScreen("quiz");
});

document.querySelector("#completeButton").addEventListener("click", (event) => {
  event.currentTarget.textContent = "ありがとうございました";
  event.currentTarget.classList.add("completed");
});
