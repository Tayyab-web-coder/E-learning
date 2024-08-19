// let menu=document.querySelector('.fa-bars')
// let mobile_res=document.querySelector('.mobile-res')
// menu.addEventListener('click',()=>{
// console.log(mobile_res);
// mobile_res.classList.toggle('active')
// })

// const tiltElement = document.querySelector('.tilt');

// tiltElement.addEventListener('mousemove', (e) => {
//     const width = tiltElement.offsetWidth;
//     const height = tiltElement.offsetHeight;
//     const centerX = tiltElement.offsetLeft + width / 2;
//     const centerY = tiltElement.offsetTop + height / 2;
//     const mouseX = e.clientX - centerX;
//     const mouseY = e.clientY - centerY;

//     const rotateX = (-1) * (mouseY / height) * 20; // Adjust sensitivity by changing 20
//     const rotateY = (mouseX / width) * 20; // Adjust sensitivity by changing 20

//     tiltElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
// });

// tiltElement.addEventListener('mouseleave', () => {
//     tiltElement.style.transform = 'rotateX(0) rotateY(0)';
// });