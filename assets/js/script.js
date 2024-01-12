let apiurl = "https://mp3quran.net/api/v3/";
let langauge = "ar";

async function getReciters () {
    let chooseReciters = document.querySelector("#chooseReciters");
    let res = await fetch(`${apiurl}reciters?language=${langauge}`);
    let data = await res.json();
    chooseReciters.innerHTML = `<option value = "">اختر قارئ</option>`;
    data.reciters.forEach(reciter => chooseReciters.innerHTML += `<option value = "${reciter.id}">${reciter.name}</option>`);

    chooseReciters.addEventListener("change", e => getMoshaf(e.target.value));

};

getReciters ();

async function getMoshaf(reciter) {
    let chooseMoshaf = document.querySelector("#chooseMoshaf");
    let res = await fetch(`${apiurl}reciters?language=${langauge}&reciter=${reciter}`);
    let data = await res.json();
    let moshafs = data.reciters[0].moshaf;
    chooseMoshaf.innerHTML = `<option value = "" data-server = "" data-surahList = "">اختر رواية</option>`;
    moshafs.forEach(moshaf => chooseMoshaf.innerHTML += `<option value = "${moshaf.id}" data-server = "${moshaf.server}" data-surahList = "${moshaf.surah_list}">${moshaf.name}</option>`);
    
    chooseMoshaf.addEventListener("change", (e) => {
        const selectedMoshaf = chooseMoshaf.options[chooseMoshaf.selectedIndex];
        const surahServer = selectedMoshaf.dataset.server;
        const surahList = selectedMoshaf.dataset.surahlist;
        getSurah(surahServer, surahList);
    });
}

async function getSurah(surahServer, surahList) {
    let chooseSurah = document.querySelector("#chooseSurah");
    let res = await fetch("https://mp3quran.net/api/v3/suwar");
    let data = await res.json();
    let surahNames = data.suwar;

    surahList = surahList.split(",");
    chooseSurah.innerHTML = `<option value = "">اختر سورة</option>`;
    surahList.forEach(surah => {
        let padSurah = surah.padStart(3, "0");
        surahNames.forEach(surahName => {
            if (surahName.id == surah) {
                chooseSurah.innerHTML += `<option value = "${surahServer}${padSurah}.mp3">${surahName.name}</option>`;
            }
        });
    });
    chooseSurah.addEventListener("change", e => {
        const selectedSurah = chooseSurah.options[chooseSurah.selectedIndex];
        playSurah(selectedSurah.value);
    });
}

function playSurah(surahMp3) {
    const audioPlayer = document.querySelector("#audioPlayer");
    audioPlayer.src = surahMp3;
    audioPlayer.play();
}


function playLive (channel) {
    if(Hls.isSupported()) {
        var video = document.getElementById('liveVideo');
        var hls = new Hls();
        hls.loadSource(`${channel}`);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function() {
          video.play();
      });
     }
}
