const buttons = document.querySelectorAll(".style-buttons button");
const inputText = document.getElementById("inputText");
const result = document.getElementById("result");
const safetyResult = document.getElementById("safetyResult");
const apiBaseCandidates = [
  "http://localhost:5000",
  "http://localhost:5007",
  "http://localhost:5006",
  "http://localhost:5005",
  "http://localhost:5004",
  "http://localhost:5003",
  "http://localhost:5002",
  "http://localhost:5001"
];

function setLoading(isLoading, activeButton = null) {
  buttons.forEach((button) => {
    button.disabled = isLoading;
    button.classList.toggle("loading", isLoading && button === activeButton);
  });
}

function setActiveButton(activeButton) {
  buttons.forEach((button) => {
    button.classList.toggle("active", button === activeButton);
  });
}

function formatRuleCheck(ruleCheck) {
  if (!ruleCheck) {
    return "規則式檢查：未回傳結果";
  }

  if (ruleCheck.passed) {
    return "規則式檢查：通過，未命中禁止字串。";
  }

  return `規則式檢查：需注意\n命中字串：${ruleCheck.hits.join("、")}`;
}

async function postRewrite(payload) {
  let lastError = null;

  for (const apiBaseUrl of apiBaseCandidates) {
    try {
      const response = await fetch(`${apiBaseUrl}/api/rewrite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let data = {};

      try {
        data = await response.json();
      } catch (error) {
        lastError = error;
      }

      if (response.ok) {
        return { response, data };
      }

      const shouldTryNextApi =
        response.status === 403 ||
        (response.status === 404 && data.error === "Primary style not found.");

      if (!shouldTryNextApi) {
        return { response, data };
      }

      lastError = new Error(data.error || `API request failed on ${apiBaseUrl}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("API request failed.");
}

async function rewriteWithStyle(styleId, button) {
  const text = inputText.value.trim();

  if (!text) {
    result.textContent = "請先貼上 Threads 貼文。";
    safetyResult.textContent = "尚未檢查。";
    inputText.focus();
    return;
  }

  setActiveButton(button);
  result.textContent = "心碎小王子正在讀你的話...";
  safetyResult.textContent = "等待回應完成後檢查...";
  setLoading(true, button);

  try {
    const { response, data } = await postRewrite({
      styleId,
      secondaryStyleId: null,
      intensity: 3,
      purpose: "thread",
      text
    });

    if (!response.ok) {
      result.textContent = data.error || "回應失敗。";
      safetyResult.textContent = "安全檢查未執行。";
      return;
    }

    result.textContent = data.output || "沒有收到回應。";
    safetyResult.textContent = `${formatRuleCheck(data.ruleCheck)}\n\n模型安全檢查：\n${data.safetyCheck || "安全檢查完成，但沒有回傳摘要。"}`;
  } catch (error) {
    console.error(error);
    result.textContent = "無法連線到後端 API，請確認伺服器已啟動。";
    safetyResult.textContent = "安全檢查未執行。";
  } finally {
    setLoading(false);
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    rewriteWithStyle(button.dataset.style, button);
  });
});
