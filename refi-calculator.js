(() => {
  const form = document.querySelector("[data-refi-calculator]");
  if (!form) return;

  const dollars = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  });

  const fields = {
    balance: form.querySelector("[name='loan_balance']"),
    currentRate: form.querySelector("[name='current_rate']"),
    newRate: form.querySelector("[name='new_rate']"),
    yearsLeft: form.querySelector("[name='years_left']"),
    newTerm: form.querySelector("[name='new_term']")
  };

  const monthlyCurrent = document.querySelector("[data-current-payment]");
  const monthlyNew = document.querySelector("[data-new-payment]");
  const monthlySavings = document.querySelector("[data-monthly-savings]");
  const annualSavings = document.querySelector("[data-annual-savings]");
  const summaryInput = document.querySelector("[name='calculator_summary']");

  function payment(balance, annualRate, years) {
    const months = years * 12;
    const monthlyRate = annualRate / 100 / 12;

    if (!balance || !months) return 0;
    if (!monthlyRate) return balance / months;

    return balance * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  }

  function calculate(shouldTrack = false) {
    const balance = Number(fields.balance.value) || 0;
    const currentRate = Number(fields.currentRate.value) || 0;
    const newRate = Number(fields.newRate.value) || 0;
    const yearsLeft = Number(fields.yearsLeft.value) || 0;
    const newTerm = Number(fields.newTerm.value) || 0;

    const current = payment(balance, currentRate, yearsLeft);
    const proposed = payment(balance, newRate, newTerm);
    const monthly = Math.max(0, current - proposed);
    const annual = monthly * 12;

    monthlyCurrent.textContent = dollars.format(current);
    monthlyNew.textContent = dollars.format(proposed);
    monthlySavings.textContent = dollars.format(monthly);
    annualSavings.textContent = dollars.format(annual);

    const summary = `Balance ${dollars.format(balance)} | Current ${currentRate}% for ${yearsLeft} yrs = ${dollars.format(current)}/mo | New ${newRate}% for ${newTerm} yrs = ${dollars.format(proposed)}/mo | Estimated savings ${dollars.format(monthly)}/mo`;
    if (summaryInput) summaryInput.value = summary;

    if (shouldTrack) {
      document.dispatchEvent(new CustomEvent("veteransown:calculator_result", {
        detail: {
          calculator_name: "VA Refinance Savings",
          loan_balance: balance,
          current_rate: currentRate,
          new_rate: newRate,
          years_left: yearsLeft,
          new_term: newTerm,
          estimated_monthly_savings: Math.round(monthly),
          estimated_annual_savings: Math.round(annual)
        }
      }));
    }
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    calculate(true);
  });

  form.querySelectorAll("input, select").forEach((input) => {
    input.addEventListener("input", () => {
      if (fields.balance.value && fields.currentRate.value && fields.newRate.value) calculate();
    });
  });

  calculate();
})();
