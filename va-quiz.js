(() => {
  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  const valueInput = document.getElementById("home-value");
  const balanceInput = document.getElementById("loan-balance");
  const ltv90Output = document.getElementById("ltv-90");
  const ltv100Output = document.getElementById("ltv-100");

  function updateCashEstimate() {
    if (!valueInput || !balanceInput || !ltv90Output || !ltv100Output) return;

    const value = Number(valueInput.value) || 0;
    const balance = Number(balanceInput.value) || 0;
    const at90 = Math.max(0, value * 0.9 - balance);
    const at100 = Math.max(0, value - balance);

    ltv90Output.textContent = money.format(at90);
    ltv100Output.textContent = money.format(at100);
  }

  if (valueInput && balanceInput) {
    valueInput.addEventListener("input", updateCashEstimate);
    balanceInput.addEventListener("input", updateCashEstimate);
    updateCashEstimate();
  }

  const quiz = document.querySelector("[data-va-quiz]");
  if (!quiz) return;

  const steps = Array.from(quiz.querySelectorAll("[data-quiz-step]"));
  const dots = Array.from(quiz.querySelectorAll("[data-quiz-dot]"));
  const backButton = quiz.querySelector("[data-quiz-back]");
  const resultPanel = document.querySelector("[data-quiz-result]");
  const resultTag = document.querySelector("[data-result-tag]");
  const resultTitle = document.querySelector("[data-result-title]");
  const resultBody = document.querySelector("[data-result-body]");
  const recommendedInput = document.querySelector("[name='recommended_option']");
  const summaryInput = document.querySelector("[name='quiz_summary']");
  const answerPreview = document.querySelector("[data-answer-preview]");
  const restartButton = document.querySelector("[data-quiz-restart]");
  const answers = {};
  let current = 0;

  const results = {
    purchase: {
      tag: "Best Starting Point",
      title: "VA Purchase Loan",
      body: "You are most likely looking for VA purchase pre-approval. A specialist should review your eligibility, credit profile, income, and target monthly payment so you can shop with a stronger plan."
    },
    irrrl: {
      tag: "Best Starting Point",
      title: "VA IRRRL Streamline Refinance",
      body: "If you already have a VA loan and your main goal is a lower payment or better loan terms, an IRRRL may be the simplest path to review."
    },
    cashout: {
      tag: "Best Starting Point",
      title: "VA Cash-Out Refinance",
      body: "If you own a home and want to access equity, consolidate debt, or refinance a non-VA loan into a VA loan, a VA cash-out refinance is worth reviewing."
    },
    credit: {
      tag: "Best Starting Point",
      title: "VA Credit Readiness Review",
      body: "Your best next step is a credit-focused VA review. A specialist can tell you whether you are ready now or what would make the file stronger."
    }
  };

  function answerSummary() {
    return [
      answers.goalLabel ? `Goal: ${answers.goalLabel}` : null,
      answers.homeLabel ? `Current home/loan: ${answers.homeLabel}` : null,
      answers.creditLabel ? `Credit: ${answers.creditLabel}` : null,
      answers.timingLabel ? `Timing: ${answers.timingLabel}` : null
    ].filter(Boolean).join(" | ");
  }

  function chooseResult() {
    if (answers.goal === "cashout") return results.cashout;
    if (answers.goal === "lower-payment" && answers.home === "va-current") return results.irrrl;
    if (answers.goal === "credit-help" || answers.credit === "580-or-lower") return results.credit;
    if (answers.home === "not-owner" && answers.goal !== "lower-payment") return results.purchase;
    if (answers.goal === "lower-payment") return results.cashout;
    return results.purchase;
  }

  function render() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === current);
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === current);
      dot.classList.toggle("complete", index < current);
    });

    if (backButton) backButton.hidden = current === 0;
  }

  function showResult() {
    const result = chooseResult();
    const summary = answerSummary();

    if (resultPanel) resultPanel.hidden = false;
    if (resultTag) resultTag.textContent = result.tag;
    if (resultTitle) resultTitle.textContent = result.title;
    if (resultBody) resultBody.textContent = result.body;
    if (recommendedInput) recommendedInput.value = result.title;
    if (summaryInput) summaryInput.value = summary;
    if (answerPreview) answerPreview.textContent = summary;

    resultPanel?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  quiz.querySelectorAll("[data-quiz-option]").forEach((button) => {
    button.addEventListener("click", () => {
      const field = button.getAttribute("data-field");
      const value = button.getAttribute("data-value");
      const label = button.getAttribute("data-label") || button.innerText.trim();

      answers[field] = value;
      answers[`${field}Label`] = label;

      quiz.querySelectorAll(`[data-field="${field}"]`).forEach((option) => {
        option.classList.toggle("selected", option === button);
      });

      if (current < steps.length - 1) {
        current += 1;
        render();
      } else {
        showResult();
      }
    });
  });

  if (backButton) {
    backButton.addEventListener("click", () => {
      current = Math.max(0, current - 1);
      render();
    });
  }

  if (restartButton) {
    restartButton.addEventListener("click", () => {
      Object.keys(answers).forEach((key) => delete answers[key]);
      current = 0;
      quiz.querySelectorAll("[data-quiz-option]").forEach((button) => button.classList.remove("selected"));
      if (resultPanel) resultPanel.hidden = true;
      if (recommendedInput) recommendedInput.value = "";
      if (summaryInput) summaryInput.value = "";
      render();
      quiz.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  render();
})();
