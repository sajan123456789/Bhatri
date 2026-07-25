let touchStartX = 0;
let touchEndX = 0;

const card =
document.getElementById("testimonial-card");

card.addEventListener("touchstart",(e)=>{
touchStartX = e.changedTouches[0].screenX;
// Performance Fix: mark passive event true to prevent scroll jank
}, { passive: true });

card.addEventListener("touchend",(e)=>{
touchEndX = e.changedTouches[0].screenX;

if(touchEndX < touchStartX - 50){
nextTestimonial();
}

if(touchEndX > touchStartX + 50){
prevTestimonial();
}
// Performance Fix: mark passive event true
}, { passive: true });
 
const testimonials = [

{
name:"Arjun Verma",
role:"Engineering Student",
img:"https://i.pravatar.cc/100?img=12",
text:"CareerSteps helped me discover the right career path based on my strengths and interests."
},

{
name:"Priya Sharma",
role:"Class 12 Student",
img:"https://i.pravatar.cc/100?img=32",
text:"The AI report gave me clarity about my future and helped me choose the right stream."
},

{
name:"Rahul Singh",
role:"AI Aspirant",
img:"https://i.pravatar.cc/100?img=15",
text:"I discovered AI and Data Science careers through CareerSteps and now I have a clear roadmap."
}

];

let current = 0;

const dots = document.querySelectorAll(".dot");

function showTestimonial(index){

current = index;

document.getElementById("testimonial-name").innerText =
testimonials[current].name;

document.getElementById("testimonial-role").innerText =
testimonials[current].role;

document.getElementById("testimonial-text").innerText =
testimonials[current].text;

const imgElem = document.getElementById("testimonial-img");
imgElem.src = testimonials[current].img;
// Accessibility Fix: dynamically update alt tag
imgElem.alt = testimonials[current].name + " Testimonial";

dots.forEach(dot=>{
dot.classList.remove("bg-blue-500");
dot.classList.add("bg-white/20");
});

dots[current].classList.remove("bg-white/20");
dots[current].classList.add("bg-blue-500");

}

function nextTestimonial(){
current++;
if(current>=testimonials.length) current=0;
showTestimonial(current);
}

function prevTestimonial(){
current--;
if(current<0) current=testimonials.length-1;
showTestimonial(current);
}

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

if(nextBtn){
  nextBtn.addEventListener("click", nextTestimonial);
}

if(prevBtn){
  prevBtn.addEventListener("click", prevTestimonial);
}

dots.forEach((dot,index)=>{
dot.addEventListener("click",()=>{
showTestimonial(index);
});
});

showTestimonial(0);

let autoSlide = setInterval(() => {
  nextTestimonial();
}, 3000);
