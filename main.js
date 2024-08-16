let menu=document.querySelector('.fa-bars')
let mobile_res=document.querySelector('.mobile-res')
menu.addEventListener('click',()=>{
console.log(mobile_res);
mobile_res.classList.toggle('active')
})