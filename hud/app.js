const firebaseConfig = {
  apiKey:"AIzaSyDyaRt2wZFse86lHpqMm5oS96xNLoGUZOY",
  authDomain:"demo1-36441.firebaseapp.com",
  databaseURL:"https://demo1-36441-default-rtdb.firebaseio.com",
  projectId:"demo1-36441",
  storageBucket:"demo1-36441.firebasestorage.app",
  messagingSenderId:"80993200631",
  appId:"1:80993200631:web:f7bd3b0eeecb52c5b1e6f2",
  measurementId:"G-VBB23MLC0J"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

let swapped = false;
let dataT1 = {};
let dataT2 = {};

db.ref("hud/tournament").on("value", s=>{
  document.getElementById("tournament-name").innerText = s.val() || "";
});

db.ref("hud/bo").on("value", s=>{
  document.getElementById("bo-round").innerText = s.val() || "";
});

function renderTeams(){
  if(!dataT1 || !dataT2) return;

  if(!swapped){
    document.getElementById("name-left").innerText = dataT1.name || "";
    document.getElementById("logo-left").src = dataT1.logo || "";
    document.getElementById("s1").innerText = dataT1.score || 0;

    document.getElementById("name-right").innerText = dataT2.name || "";
    document.getElementById("logo-right").src = dataT2.logo || "";
    document.getElementById("s2").innerText = dataT2.score || 0;
  } else {
    document.getElementById("name-left").innerText = dataT2.name || "";
    document.getElementById("logo-left").src = dataT2.logo || "";
    document.getElementById("s1").innerText = dataT2.score || 0;

    document.getElementById("name-right").innerText = dataT1.name || "";
    document.getElementById("logo-right").src = dataT1.logo || "";
    document.getElementById("s2").innerText = dataT1.score || 0;
  }
}

db.ref("teams/team1").on("value", snap=>{
  dataT1 = snap.val() || {};
  renderTeams();
  renderMaps();
});

db.ref("teams/team2").on("value", snap=>{
  dataT2 = snap.val() || {};
  renderTeams();
  renderMaps();
});

function renderMaps(){
  db.ref("maps").once("value").then(s1=>{
    const names = s1.val() || [];
    db.ref("boSeries").once("value").then(s2=>{
      const codes = s2.val() || [];
      db.ref("mapPickTeam").once("value").then(s3=>{
        const picks = s3.val() || [];
        let html = "";

        names.forEach((name, i)=>{
          let team = picks[i];
          let logo = "";
          let cls = "";

          if(team === 1){
            logo = swapped ? dataT2.logo : dataT1.logo;
            cls = "a";
          } else if(team === 2){
            logo = swapped ? dataT1.logo : dataT2.logo;
            cls = "b";
          } else {
            logo = "btc.png";
            cls = "decider";
          }

          html += `
            <div class="map-card ${cls}">
              <div class="map-card-name">${codes[i] || name}</div>
              <img class="map-card-logo" src="${logo}">
            </div>`;
        });

        document.getElementById("hud-map-picks").innerHTML = html;
      });
    });
  });
}

db.ref("maps").on("value", renderMaps);
db.ref("mapPickTeam").on("value", renderMaps);
db.ref("boSeries").on("value", renderMaps);

db.ref("hud/showMaps").on("value", snap=>{
  let v = snap.val();
  const box = document.getElementById("hud-map-picks");
  if(v === false){
    box.classList.add("hidden");
    setTimeout(()=>{ box.style.display="none"; },350);
  } else {
    box.style.display="flex";
    requestAnimationFrame(()=> box.classList.remove("hidden"));
  }
});

db.ref("swap").on("value", snap=>{
  if(!snap.val()) return;
  swapped = !swapped;
  renderTeams();
  renderMaps();
});

db.ref("victory").on("value", snap=>{
  let v = snap.val();
  if(!v) return;
  showVictory(v.winner);
});

function showVictory(winner){
  const vs = document.getElementById("victory-screen");
  const logo = document.getElementById("victory-logo");
  const name = document.getElementById("victory-name");
  let ref = winner===1 ? "teams/team1" : "teams/team2";

  db.ref(ref).once("value",snap=>{
    let d = snap.val()||{};
    logo.src = d.logo;
    name.innerText = d.name;
  });

  vs.classList.remove("hidden");
  const sound = document.getElementById("victory-sound");
  sound.currentTime = 0;
  sound.play();

  setTimeout(()=>{
    vs.classList.add("hidden");
    sound.pause();
    sound.currentTime = 0;
    db.ref("victory").remove();
  },10000);
}
