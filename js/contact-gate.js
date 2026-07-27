// ================================
// CareerSteps Contact Gate
// Premium Lamp Physics
// ================================

const lamp = document.getElementById("lamp");
const rope = document.getElementById("lampRope");
const cone = document.getElementById("lightCone");
const loader = document.getElementById("loaderScreen");

let dragging = false;
let current = 0;
let startX = 0;

const LIMIT = 120;

// ----------------
// Update Lamp
// ----------------

function updateLamp(x){

current = Math.max(-LIMIT,Math.min(LIMIT,x));

lamp.style.transform =
`translateX(${current}px) rotate(${current/10}deg)`;

rope.style.transform =
`rotate(${current/18}deg)`;

cone.style.transform =
`translateX(calc(-50% + ${current}px))
rotate(${current/18}deg)`;

}

// ----------------
// Mouse
// ----------------

lamp.addEventListener("mousedown",(e)=>{

dragging=true;

startX=e.clientX-current;

lamp.style.cursor="grabbing";

});

document.addEventListener("mousemove",(e)=>{

if(!dragging)return;

updateLamp(e.clientX-startX);

});

document.addEventListener("mouseup",()=>{

if(!dragging)return;

dragging=false;

lamp.style.cursor="grab";

finishDrag();

});

// ----------------
// Touch
// ----------------

lamp.addEventListener("touchstart",(e)=>{

dragging=true;

startX=e.touches[0].clientX-current;

},{passive:true});

document.addEventListener("touchmove",(e)=>{

if(!dragging)return;

updateLamp(e.touches[0].clientX-startX);

},{passive:true});

document.addEventListener("touchend",()=>{

dragging=false;

finishDrag();

});

// ----------------
// Finish
// ----------------

function finishDrag(){

if(Math.abs(current)>80){

    successEffect();
    
loader.classList.add("loader-show");

setTimeout(()=>{

window.location.href="contact.html";

},900);

return;

}

lamp.style.transition=".6s cubic-bezier(.22,.61,.36,1)";
rope.style.transition=".6s cubic-bezier(.22,.61,.36,1)";
cone.style.transition=".6s cubic-bezier(.22,.61,.36,1)";

updateLamp(0);

setTimeout(()=>{

lamp.style.transition="";
rope.style.transition="";
cone.style.transition="";

},600);

}

// ======================================
// Premium Swing + Dynamic Light Effects
// ======================================

let velocity = 0;
let target = 0;

function physicsLoop(){

    velocity += (current - target) * 0.08;
    velocity *= 0.88;

    target += velocity;

    rope.style.transform =
        `rotate(${target/16}deg)`;

    lamp.style.transform =
        `translateX(${target}px) rotate(${target/8}deg)`;

    cone.style.transform =
        `translateX(calc(-50% + ${target}px))
         rotate(${target/14}deg)`;

    // Light intensity increases while dragging
    const intensity = Math.min(Math.abs(target)/120,1);

    cone.style.opacity = 0.18 + intensity * 0.55;

    lamp.style.filter =
        `drop-shadow(0 0 ${25+intensity*35}px rgba(59,130,246,.9))`;

    requestAnimationFrame(physicsLoop);
}

physicsLoop();


// Mobile vibration when unlocked

function successEffect(){

    if(navigator.vibrate){

        navigator.vibrate([80,50,80]);

    }

}
