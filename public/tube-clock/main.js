function updateTimeAndDate() {
    const now = new Date();

    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    const amPm = hours >= 12 ? "PM" : "AM";

    if (hours > 12) {
        hours -= 12;
    } else if (hours === 0) {
        hours = 12;
    }

    const hoursStr = hours.toString().padStart(2, "0");

    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const year = now.getFullYear().toString().slice(-2);

    /*
     * 12 tubes:
     *
     * HHMM
     * SS
     * AM
     * MM
     * DD
     * YY
     *
     * The original artwork has 12 character positions.
     */

    const displayStr =
        hoursStr +
        minutes +
        seconds +
        amPm +
        month +
        day +
        year;

    for (let i = 0; i < 12; i++) {
        const char1 = document.getElementById("char" + i + "1");
        const char2 = document.getElementById("char" + i + "2");

        if (!char1 || !char2) continue;

        const character = displayStr[i] ?? " ";

        char1.textContent = character;
        char2.textContent = character;
    }
}

updateTimeAndDate();

setInterval(updateTimeAndDate, 1000);
