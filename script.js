// =========================
// Search Function
// =========================

const searchInput = document.querySelector(".top-bar input");
const cards = document.querySelectorAll(".card");

searchInput.addEventListener("input", function () {

    const searchValue = searchInput.value.toLowerCase();

    cards.forEach(function (card) {

        const songTitle = card.querySelector("h3").textContent.toLowerCase();
        const artistName = card.querySelector("p").textContent.toLowerCase();

        if (
            songTitle.includes(searchValue) ||
            artistName.includes(searchValue)
        ) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});


// =========================
// Only One Song Plays
// =========================

const audios = document.querySelectorAll("audio");

audios.forEach(function (currentAudio) {

    currentAudio.addEventListener("play", function () {

        audios.forEach(function (otherAudio) {

            if (otherAudio !== currentAudio) {
                otherAudio.pause();
            }

        });

    });

});