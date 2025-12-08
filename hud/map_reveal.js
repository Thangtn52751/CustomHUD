const firebaseConfig={
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
const db=firebase.database();

let names=[];
let shorts=[];
let picks=[];

function loadData(){
  db.ref("maps").once("value").then(s=>{names=s.val()||[]});
  db.ref("boSeries").once("value").then(s=>{shorts=s.val()||[]});
  db.ref("mapPickTeam").once("value").then(s=>{picks=s.val()||[]});
}

loadData();

db.ref("hud/reveal").on("value",snap=>{
  if(!snap.val()) return;
  runReveal();
});

function setCard(id,i){
  let card=document.getElementById(id);
  let name=card.querySelector(".map-name");
  let logo=card.querySelector(".map-logo");
  let t=picks[i];

  name.innerText=shorts[i]||names[i];

  if(t===1){
    db.ref("teams/team1/logo").once("value").then(s=>logo.src=s.val());
    card.className="map-card a";
  }else if(t===2){
    db.ref("teams/team2/logo").once("value").then(s=>logo.src=s.val());
    card.className="map-card b";
  }else{
    logo.src="btc.png";
    card.className="map-card decider";
  }
}

function runReveal(){
  loadData();
  setTimeout(()=>setCard("map1",0),100);
  setTimeout(()=>{
    document.getElementById("map1").classList.add("show");
    setTimeout(()=>setCard("map2",1),200);
  },200);

  setTimeout(()=>{
    document.getElementById("map2").classList.add("show");
    setTimeout(()=>setCard("map3",2),200);
  },900);

  setTimeout(()=>{
    document.getElementById("map3").classList.add("show");
  },1400);
}
