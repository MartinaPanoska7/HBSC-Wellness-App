let moodScore = 0;

const moods = document.querySelectorAll(".mood");

moods.forEach(button => {
    button.addEventListener("click", function () {
        moods.forEach(b => b.classList.remove("selected"));
        this.classList.add("selected");
        moodScore = Number(this.dataset.score);
    });
});

const stress = document.getElementById("stress");
const stressValue = document.getElementById("stressValue");

stress.oninput = function () {
    stressValue.textContent = this.value;
};

// Вчитување на историјата
let history = JSON.parse(localStorage.getItem("history")) || [];

// Креирање на график
const ctx = document.getElementById("myChart");

const chart = new Chart(ctx, {
    type: "line",
    data: {
        labels: history.map((_, i) => "Ден " + (i + 1)),
        datasets: [{
            label: "Wellness Score",
            data: history,
            borderWidth: 3,
            tension: 0.3
        }]
    },
    options: {
        responsive: true
    }
});

document.getElementById("saveBtn").addEventListener("click", function () {

    let sleep = Number(document.getElementById("sleep").value);
    let phone = Number(document.getElementById("phone").value);
    let exercise = document.getElementById("exercise").value;
    let stress = Number(document.getElementById("stress").value);

    let score = 100;

    if (sleep < 8) score -= 20;

    if (phone > 5) score -= 20;

    if (exercise === "Не") score -= 20;

    score -= stress * 2;

    score += moodScore;

    if (score < 0) score = 0;
    if (score > 100) score = 100;

    let advice = "";

    if (score >= 80) {
        advice = "🎉 Одлично! Продолжи со здравите навики.";
    } else if (score >= 60) {
        advice = "🙂 Добро ти оди, но има простор за подобрување.";
    } else {
        advice = "💙 Обиди се да спиеш повеќе, да бидеш поактивен и да го намалиш времето на телефон.";
    }

    // Прикажување резултат
    document.getElementById("result").style.display = "block";
    document.getElementById("result").innerHTML = `
        <h2>Твојот Wellness Score е:</h2>
        <h1>${score}/100</h1>
        <p>${advice}</p>
    `;

    // Зачувување
    history.push(score);
    localStorage.setItem("history", JSON.stringify(history));

    // Освежување на графикот
    chart.data.labels = history.map((_, i) => "Ден " + (i + 1));
    chart.data.datasets[0].data = history;
    chart.update();
});