(function () {
  const STORAGE_KEY = "openclaw_test_error_lab_v1";

  function safeParse(raw) {
    try {
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase();
  }

  function makeId(question) {
    return [
      normalizeText(question.subject || ""),
      normalizeText(question.enunciado || ""),
      ...(Array.isArray(question.opciones) ? question.opciones.map(normalizeText) : []),
    ].join("||");
  }

  function getQuestions() {
    return safeParse(localStorage.getItem(STORAGE_KEY));
  }

  function saveQuestions(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }

  function recordFailures(subject, questions, answers) {
    const items = getQuestions();
    const byId = new Map(items.map((item) => [item.id, item]));

    (questions || []).forEach((question, index) => {
      const answer = answers ? answers[index] : null;
      if (answer === null || answer === undefined) return;
      if (answer === question.correcta) return;

      const enriched = {
        id: makeId({ ...question, subject }),
        subject,
        enunciado: question.enunciado,
        opciones: question.opciones,
        correcta: question.correcta,
        fails: 1,
        lastFailedAt: new Date().toISOString(),
      };

      const existing = byId.get(enriched.id);
      if (existing) {
        existing.fails = Number(existing.fails || 0) + 1;
        existing.lastFailedAt = enriched.lastFailedAt;
        existing.subject = existing.subject || subject;
        byId.set(enriched.id, existing);
      } else {
        byId.set(enriched.id, enriched);
      }
    });

    saveQuestions(Array.from(byId.values()));
  }

  function clearAll() {
    localStorage.removeItem(STORAGE_KEY);
  }

  window.ErrorLab = {
    STORAGE_KEY,
    getQuestions,
    recordFailures,
    clearAll,
  };
})();
