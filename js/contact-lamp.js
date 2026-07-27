// ===============================
// Premium Lamp Interaction
// ===============================

const lamp = document.querySelector(".lamp-container");
const rope = document.querySelector(".lamp-rope");

if (lamp && rope) {

let dragging = false;

let startX = 0;

let currentX = 0;

const MAX_MOVE = 140;

function updateLamp(x){

currentX = Math.max(-MAX_MOVE, Math.min(MAX_MOVE, x));

lamp.style.transform =
`translateX(calc(-50% + ${currentX}px)) rotate(${currentX/10}deg)`;

rope.style.transform =
`translateX(-50%) rotate(${currentX/18}deg)`;

}

lamp.addEventListener("mousedown",(e)=>{

dragging=true;

startX=e.clientX-currentX;

lamp.style.cursor="grabbing";

});

document.addEventListener("mousemove",(e)=>{

if(!dragging) return;

updateLamp(e.clientX-startX);

});

document.addEventListener("mouseup",()=>{

if(!dragging) return;

dragging=false;

lamp.style.cursor="grab";

lamp.style.transition="transform .6s cubic-bezier(.22,.61,.36,1)";

rope.style.transition="transform .6s cubic-bezier(.22,.61,.36,1)";

updateLamp(0);

setTimeout(()=>{

lamp.style.transition="";

rope.style.transition="";

},600);

});

lamp.addEventListener("touchstart",(e)=>{

dragging=true;

startX=e.touches[0].clientX-currentX;

},{passive:true});

document.addEventListener("touchmove",(e)=>{

if(!dragging) return;

updateLamp(e.touches[0].clientX-startX);

},{passive:true});

document.addEventListener("touchend",()=>{

dragging=false;

lamp.style.transition="transform .6s ease";

rope.style.transition="transform .6s ease";

updateLamp(0);

setTimeout(()=>{

lamp.style.transition="";

rope.style.transition="";

},600);

});

}

// =========================
// Reveal Contact Form
// =========================

const formCard =
document.getElementById("contactFormCard");

const beam =
document.querySelector(".light-beam");

function revealForm(){

formCard.classList.add("show-form");

beam.classList.add("light-on");

}

function hideForm(){

formCard.classList.remove("show-form");

beam.classList.remove("light-on");

}

lamp.addEventListener("mouseup",()=>{

if(Math.abs(currentX)>70){

revealForm();

}else{

hideForm();

}

});

lamp.addEventListener("touchend",()=>{

if(Math.abs(currentX)>70){

revealForm();

}else{

hideForm();

}

});

// ===========================
// Premium Swing Physics
// ===========================

const cone=document.querySelector(".light-cone");

let angle=0;

function animateSwing(){

angle+=(currentX-angle)*0.08;

lamp.style.transform=
`translateX(calc(-50% + ${currentX}px))
rotate(${angle/8}deg)`;

rope.style.transform=
`translateX(-50%)
rotate(${angle/14}deg)`;

requestAnimationFrame(animateSwing);

}

animateSwing();
