let talks=document.querySelector("#Talks");
let stat=document.querySelector("#Status");
let calls=document.querySelector("#Calls");
let set=document.querySelector("#setting")
talks.addEventListener("click",()=>{
    talks.style.borderBottom='3px solid #fbd4de';
    stat.style.borderBottom='';
    calls.style.borderBottom='';
})
stat.addEventListener("click",()=>{
    stat.style.borderBottom='3px solid #fbd4de';
    talks.style.borderBottom='';
    calls.style.borderBottom='';
})
calls.addEventListener("click",()=>{
    calls.style.borderBottom='3px solid #fbd4de';
    talks.style.borderBottom='';
    stat.style.borderBottom='';
})