const defaultStats = [
    { label: "SPEED", value: 90 },
    { label: "DEFENSE", value: 85 },
    { label: "PASS", value: 80 },
    { label: "DRIBBLE", value: 87 },
    { label: "SHOOT", value: 78 },
    { label: "OFFENSE", value: 70 }
];

let savedStats = {};

try {
    savedStats = JSON.parse(
        localStorage.getItem("PROJECT10-player-stats")
    ) || {};
} catch (error) {
    console.error("Unable to load saved stats:", error);
}

const stats = defaultStats.map(stat => {
    const savedValue = savedStats[stat.label];

    return {
        ...stat,
        value: Number.isInteger(savedValue) && savedValue >= 0 && savedValue <= 110
            ? savedValue
            : stat.value
    };
});

document.querySelectorAll("[data-stat]").forEach(input => {
    const stat = stats.find(item => item.label === input.dataset.stat);

    if (stat) input.value = stat.value;
});

const svg = document.getElementById("radar");
const chart = document.getElementById("radar-shape");

const center = 250;
const radarOffsetY = -12;
const radius = 145;

function updateRadar() {
    const pointsGroup = document.getElementById("radar-points");

    pointsGroup.innerHTML = "";

    const points = stats.map((stat, index) => {
        const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;
        const distance = (stat.value / 110) * radius;

        const x = center + Math.cos(angle) * distance;
        const y = center + Math.sin(angle) * distance + radarOffsetY;

        // CREATE RADAR VERTEX
        const point = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        point.setAttribute("cx", x);
        point.setAttribute("cy", y);
        point.setAttribute("r", 4);
        point.setAttribute("class", "radar-point");
        point.setAttribute("data-stat", stat.label);

        pointsGroup.appendChild(point);

        return `${x},${y}`;
    });

    chart.setAttribute("points", points.join(" "));
    chart.setAttribute("fill", "rgba(0, 153, 255, 0.28)");
    chart.setAttribute("stroke", "#32d5ff");
    chart.setAttribute("stroke-width", "3.5");
}

updateRadar();

const grid = document.getElementById("radar-grid");

// BLUE LOCK OUTER RING

const outerRing = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
);

outerRing.setAttribute("cx", center);
outerRing.setAttribute("cy", center + radarOffsetY);
outerRing.setAttribute("r", 265);
outerRing.setAttribute("class", "outer-ring");

grid.appendChild(outerRing);

// BLUE LOCK INNER SLASH RING

const slashCount = 60;
const slashInnerRadius = 199;
const slashOuterRadius = 230;

for (let i = 0; i < slashCount; i++) {
    const angle = (Math.PI * 2 * i) / slashCount;

    const line = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
    );

    line.setAttribute(
        "x1",
        center + Math.cos(angle) * slashInnerRadius
    );

    line.setAttribute(
        "y1",
        center + Math.sin(angle) * slashInnerRadius + radarOffsetY
    );

    line.setAttribute(
        "x2",
        center + Math.cos(angle) * slashOuterRadius
    );

    line.setAttribute(
        "y2",
        center + Math.sin(angle) * slashOuterRadius + radarOffsetY
    );

    line.setAttribute("class", "slash-mark");

    grid.appendChild(line); 
    
}
 // BLUE LOCK INNER CIRCLE

    const innerRing = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
);

innerRing.setAttribute("cx", center);
innerRing.setAttribute("cy", center + radarOffsetY);
innerRing.setAttribute("r", 198);
innerRing.setAttribute("class", "inner-ring");

grid.appendChild(innerRing);

// BLUE LOCK SECOND INNER CIRCLE

const secondRing = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "circle"
);

secondRing.setAttribute("cx", center);
secondRing.setAttribute("cy", center + radarOffsetY);
secondRing.setAttribute("r", 230);
secondRing.setAttribute("class", "inner-ring");
grid.appendChild(secondRing);

// Radial spokes give the chart a sharper, technical player-scouting look.
stats.forEach((stat, index) => {
    const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", center);
    line.setAttribute("y1", center + radarOffsetY);
    line.setAttribute("x2", center + Math.cos(angle) * radius);
    line.setAttribute("y2", center + Math.sin(angle) * radius + radarOffsetY);
    line.setAttribute("class", "radar-axis");
    line.setAttribute("data-stat", stat.label);
    grid.appendChild(line);
});

for (let level = 1; level <= 5; level++) {
    const gridPoints = stats.map((stat, index) => {
        const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;
        const distance = (radius * level) / 5;

        const x = center + Math.cos(angle) * distance;
        const y = center + Math.sin(angle) * distance + radarOffsetY;

        return `${x},${y}`;
    });

    const polygon = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polygon"
    );

    polygon.setAttribute("points", gridPoints.join(" "));
    polygon.setAttribute("class", "grid-ring");

    grid.appendChild(polygon);
}
// DRAW MAXIMUM VALUES (100)

const maxValues = document.getElementById("radar-max-values");

stats.forEach((stat, index) => {
    const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;

    const distance = radius - 15;

    const x = center + Math.cos(angle) * distance;
    const y = center + Math.sin(angle) * distance + radarOffsetY;

    const maxLabel = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );

    maxLabel.setAttribute("x", x);
    maxLabel.setAttribute("y", y);
    maxLabel.setAttribute("class", "stat-value");
    maxLabel.setAttribute("text-anchor", "middle");
    maxLabel.setAttribute("dominant-baseline", "middle");
    maxLabel.textContent = "110";

    maxValues.appendChild(maxLabel);
});
const labelPositions = [];
// DRAW STAT LABELS

const labels = document.getElementById("radar-labels");

stats.forEach((stat, index) => {
    const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;
    // DRIBBLE swaps positions with its grade; other labels stay toward the outer ring.
    const distance = stat.label === "SPEED"
        ? slashOuterRadius
        : stat.label === "DRIBBLE" ? radius + 50 : radius + 100;

    const x = center + Math.cos(angle) * distance;
    const y = center + Math.sin(angle) * distance + radarOffsetY
        - (stat.label === "DRIBBLE" ? radius + 100 - slashOuterRadius + 10 : 0);
    labelPositions.push({ x, y });

    const label = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );

    label.setAttribute("x", x);
    label.setAttribute("y", y);
    label.setAttribute("class", "stat-label");
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("dominant-baseline", "middle");
    label.textContent = stat.label;

    if (stat.label === "OFFENSE" || stat.label === "DEFENSE") {
        const gradeDistance = radius + 50;
        const gradeX = center + Math.cos(angle) * gradeDistance;
        const gradeY = center + Math.sin(angle) * gradeDistance + radarOffsetY;
        const labelY = gradeY - 65;

        label.setAttribute("x", gradeX);
        label.setAttribute("y", labelY);
        labelPositions[index] = { x: gradeX, y: labelY };
    }

    if (stat.label === "SHOOT" || stat.label === "PASS") {
        const gradeDistance = radius + 50;
        const outwardOffset = stat.label === "SHOOT" ? -20 : 20;
        const gradeX = center + Math.cos(angle) * gradeDistance + outwardOffset;
        const gradeY = center + Math.sin(angle) * gradeDistance + radarOffsetY;
        const labelY = gradeY - 65 + 10;

        label.setAttribute("x", gradeX);
        label.setAttribute("y", labelY);
        label.setAttribute("font-size", "20");
        labelPositions[index] = { x: gradeX, y: labelY };
    }

    labels.appendChild(label);
});
// AUTOMATIC PLAYER GRADES

function getGrade(value) {
    if (value >= 100) return "S+";
    if (value >= 90) return "S";
    if (value >= 80) return "A";
    if (value >= 70) return "B";
    if (value >= 60) return "C";
    if (value >= 50) return "D";
    if (value >= 40) return "E";
    if (value >= 30) return "F";
    return "G";
}

function getOverallRating() {
    const weights = {
        SPEED: 0.15,
        DEFENSE: 0.15,
        PASS: 0.15,
        DRIBBLE: 0.20,
        SHOOT: 0.20,
        OFFENSE: 0.15
    };

    return Math.round(
        stats.reduce((total, stat) => {
            return total + stat.value * weights[stat.label];
        }, 0)
    );
}

console.log("Player grades:", stats);
// DRAW GRADES OUTSIDE AND NUMBERS INSIDE RADAR

function updateStatDisplays() {

    stats.forEach(stat => {
    stat.grade = getGrade(stat.value);
    
});
    const overallGrade = document.getElementById("overall-grade")?.textContent.trim();
    document.querySelectorAll(".grade-row").forEach(row => {
        row.classList.toggle("active", row.dataset.grade === overallGrade);
    });

    const gradeGroup = document.getElementById("radar-grades");
    gradeGroup.innerHTML = "";

    stats.forEach((stat, index) => {
    const angle = (Math.PI * 2 * index) / stats.length - Math.PI / 2;

    // POSITION GRADES RELATIVE TO RADAR
    const gradeDistance = stat.label === "DRIBBLE" ? slashOuterRadius : radius + 50;

    let gradeX = center + Math.cos(angle) * gradeDistance;
    let gradeY = center + Math.sin(angle) * gradeDistance + radarOffsetY;

    if (stat.label === "SHOOT") gradeX -= 20;
    if (stat.label === "PASS") gradeX += 20;
    if (stat.label === "SHOOT" || stat.label === "PASS") gradeY += 10;
    if (stat.label === "SPEED") gradeY += 30;

    const grade = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );

    grade.setAttribute("x", gradeX);
    grade.setAttribute("y", gradeY);
    grade.setAttribute("class", "stat-grade");
    grade.setAttribute("data-stat", stat.label);
    grade.setAttribute("text-anchor", "middle");
    grade.setAttribute("dominant-baseline", "middle");
    grade.textContent = stat.grade;

    gradeGroup.appendChild(grade);

    // NUMERICAL VALUE FOLLOWS THE RADAR POINT
    const valueDistance = Math.max(
    20,
    (stat.value / 110) * radius - 22
    );

    const valueX = center + Math.cos(angle) * valueDistance;
    const valueY = center + Math.sin(angle) * valueDistance + radarOffsetY;

    const value = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
    );

    value.setAttribute("x", valueX);
    value.setAttribute("y", valueY);
    value.setAttribute("class", "stat-value");
    value.setAttribute("text-anchor", "middle");
    value.setAttribute("dominant-baseline", "middle");
    value.textContent = stat.value;

    gradeGroup.appendChild(value);
    });
}

updateStatDisplays();

console.log("PROJECT 10 chart loaded");

function updateAllStats() {
    updateRadar();
    updateStatDisplays();

    document.querySelectorAll(".stat-grade, .radar-axis, .radar-point")
        .forEach(element => {
            element.classList.toggle(
                "highlight",
                element.dataset.stat === highlightedStat
            );
        });

    const overallScore = getOverallRating();
    const overallGrade = getGrade(overallScore);

    document.getElementById("overall-score").textContent = overallScore;
    document.getElementById("overall-grade").textContent = overallGrade;

    document.querySelectorAll(".grade-row").forEach(row => {
        const grade = row.querySelector("span").textContent.trim();
        row.classList.toggle("active", grade === overallGrade);
    });
}
function setStat(label, newValue) {
    const stat = stats.find(stat => stat.label === label);

    if (!stat) return;
    if (newValue < 0 || newValue > 110) return;

    stat.value = newValue;
    localStorage.setItem(
        "PROJECT10-player-stats",
        JSON.stringify(
        Object.fromEntries(stats.map(stat => [stat.label, stat.value]))
        )
    );
    updateAllStats();
}
document.querySelectorAll("[data-stat]").forEach(input => {
    input.addEventListener("input", () => {
        const label = input.dataset.stat;
        const value = Number(input.value);

        if (input.value === "" || !Number.isFinite(value)) return;

        if (value < 0 || value > 110) {
            input.value = Math.max(0, Math.min(110, value));
        }

        setStat(label, Number(input.value));
    });
});

let highlightedStat = null;
// RADAR GRADE HIGHLIGHT INTERACTION

document.querySelectorAll(".stat-controls input[data-stat]").forEach(input => {
    let isHovered = false;

    function updateHighlight() {
        const active = isHovered || document.activeElement === input;

        highlightedStat = active ? input.dataset.stat : null;

        const grade = document.querySelector(
            `.stat-grade[data-stat="${input.dataset.stat}"]`
        );

        const axis = document.querySelector(
            `.radar-axis[data-stat="${input.dataset.stat}"]`
        );
        const point = document.querySelector(
            `.radar-point[data-stat="${input.dataset.stat}"]`
        );

        if (grade) {
            grade.classList.toggle("highlight", active);
        }

        if (axis) {
            axis.classList.toggle("highlight", active);
        }

        if (point) {
            point.classList.toggle("highlight", active);
        }
    }

    input.addEventListener("mouseenter", () => {
        isHovered = true;
        updateHighlight();
    });

    input.addEventListener("mouseleave", () => {
        isHovered = false;
        updateHighlight();
    });

    input.addEventListener("focus", updateHighlight);
    input.addEventListener("blur", updateHighlight);
});

updateAllStats();

const imageUpload = document.getElementById("image-upload");
const importButton = document.getElementById("import-image");
const playerImage = document.getElementById("player-image");
const pentagonBoot = document.getElementById("pentagon-boot");
const portraitFrame = document.querySelector(".portrait-frame");

// Connect both the button and the pentagon to the file upload
if (importButton) {
    importButton.addEventListener("click", () => imageUpload.click());
}
if (portraitFrame) {
    portraitFrame.addEventListener("click", () => imageUpload.click());
}

function playBootAnimation(mode = "initial") {
    pentagonBoot.classList.remove("active", "flickering");
    playerImage.classList.remove("revealing");
    portraitFrame.classList.remove("scanning");

    pentagonBoot.style.display = "block";
    playerImage.style.display = "none";

    // Restart animation
    void pentagonBoot.offsetWidth;

    pentagonBoot.classList.add("active");

    // Wait for the 5th piece to finish unfolding, then immediately start the wipe + double-flicker!
    const lastPiece = pentagonBoot.querySelector(".piece-5");
    lastPiece.onanimationend = () => {
        pentagonBoot.classList.add("flickering");
        if (playerImage.src && playerImage.src !== "" && !playerImage.src.endsWith("#")) {
            playerImage.style.display = "block";
            playerImage.classList.add("revealing");
        }
    };
}
const DB_NAME = "PROJECT10Database";
const STORE_NAME = "playerImages";

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = () => {
            request.result.createObjectStore(STORE_NAME);
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function savePlayerImage(file) {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readwrite");

        transaction.objectStore(STORE_NAME).put(file, "currentPlayer");

        transaction.oncomplete = () => {
            db.close();
            resolve();
        };

        transaction.onerror = () => {
            db.close();
            reject(transaction.error);
        };
    });
}

async function loadPlayerImage() {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, "readonly");
        const request = transaction.objectStore(STORE_NAME).get("currentPlayer");

        request.onsuccess = () => {
            const file = request.result;

            if (file) {
                const imageURL = URL.createObjectURL(file);

                playerImage.onload = () => {
                    playBootAnimation("initial");
                };

                playerImage.src = imageURL;
            }

            db.close();
            resolve();
        };

        request.onerror = () => {
            db.close();
            reject(request.error);
        };
    });
}

imageUpload.addEventListener("change", async () => {
    const file = imageUpload.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
        alert("Please select an image file.");
        return;
    }

    try {
        await savePlayerImage(file);

        const imageURL = URL.createObjectURL(file);

        playerImage.onload = () => {
            playBootAnimation("update");
        };

        playerImage.src = imageURL;

    } catch (error) {
        console.error("Image saving failed:", error);
        alert("Unable to save your player picture.");
    }
});

loadPlayerImage();
