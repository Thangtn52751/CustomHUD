const firebaseConfig = {
  apiKey: "AIzaSyDyaRt2wZFse86lHpqMm5oS96xNLoGUZOY",
  authDomain: "demo1-36441.firebaseapp.com",
  databaseURL: "https://demo1-36441-default-rtdb.firebaseio.com",
  projectId: "demo1-36441",
  storageBucket: "demo1-36441.firebasestorage.app",
  messagingSenderId: "80993200631",
  appId: "1:80993200631:web:f7bd3b0eeecb52c5b1e6f2",
  measurementId: "G-VBB23MLC0J"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function setName(team){
  const val = document.getElementById(`t${team}-name`).value;
  db.ref(`teams/team${team}/name`).set(val);
}

function setShort(team){
  const val = document.getElementById(`t${team}-short`).value;
  db.ref(`teams/team${team}/short`).set(val);
}

function setLogo(team){
  const val = document.getElementById(`t${team}-logo`).value;
  db.ref(`teams/team${team}/logo`).set(val);
}

function addScore(team){
  db.ref(`teams/team${team}/score`).transaction(s => (s || 0) + 1);
}

function subScore(team){
  db.ref(`teams/team${team}/score`).transaction(s => (s || 0) - 1);
}

function resetScore(){
  db.ref("teams/team1/score").set(0);
  db.ref("teams/team2/score").set(0);
}

db.ref("teams/team1/score").on("value", snap=>{
  document.getElementById("score1").innerText = snap.val() || 0;
});

db.ref("teams/team2/score").on("value", snap=>{
  document.getElementById("score2").innerText = snap.val() || 0;
});

function swapSide(){
  db.ref("swap").set(Date.now());
}

function setTournament(){
  const val = document.getElementById("tournament").value;
  db.ref("hud/tournament").set(val);
}

function setBO(bo){
  db.ref("hud/bo").set(bo);
}

function addMap(team){
  const name = document.getElementById("map-input").value;
  const short = document.getElementById("map-short").value;
  if(!name) return;
  db.ref("maps").once("value").then(snap=>{
    const arr = snap.val() || [];
    arr.push(name);
    db.ref("maps").set(arr);
  });
  db.ref("boSeries").once("value").then(snap=>{
    const arr = snap.val() || [];
    arr.push(short);
    db.ref("boSeries").set(arr);
  });
  db.ref("mapPickTeam").once("value").then(snap=>{
    const arr = snap.val() || [];
    arr.push(team);
    db.ref("mapPickTeam").set(arr);
  });
  document.getElementById("map-input").value = "";
  document.getElementById("map-short").value = "";
}

function clearMaps(){
  db.ref("maps").set([]);
  db.ref("boSeries").set([]);
  db.ref("mapPickTeam").set([]);
}

db.ref("maps").on("value", snap=>{
  const arr = snap.val() || [];
  let html = "";
  arr.forEach(m=>{
    html += `<div class="map-item">${m}</div>`;
  });
  document.getElementById("maps-list").innerHTML = html;
});

db.ref("boSeries").on("value", snap=>{
  const arr = snap.val() || [];
  let html = "";
  arr.forEach(m=>{
    html += `<div class="map-item">${m}</div>`;
  });
  document.getElementById("series-box").innerHTML = html;
});

function triggerVictory(team){
  db.ref("victory").set({ winner:team, t:Date.now() });
}

function toggleMaps(){
  db.ref("hud/showMaps").once("value").then(s=>{
    const cur = s.val();
    if (cur === false) {
      db.ref("hud/showMaps").set(true);
    } else {
      db.ref("hud/showMaps").set(false);
    }
  });
}


function revealMaps(){
  db.ref("hud/reveal").set(Date.now());
}

function addDecider(){
  const name = document.getElementById("map-input").value;
  const short = document.getElementById("map-short").value;

  if(!name) return;

  db.ref("maps").once("value").then(snap=>{
    const arr = snap.val() || [];
    arr.push(name);
    db.ref("maps").set(arr);
  });

  db.ref("boSeries").once("value").then(snap=>{
    const arr = snap.val() || [];
    arr.push(short);
    db.ref("boSeries").set(arr);
  });

  db.ref("mapPickTeam").once("value").then(snap=>{
    const arr = snap.val() || [];
    arr.push(0);
    db.ref("mapPickTeam").set(arr);
  });

  document.getElementById("map-input").value = "";
  document.getElementById("map-short").value = "";
}

