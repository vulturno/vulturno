function menu(){var e=document.querySelector(".overlay"),c=document.querySelector(".navegacion"),o=document.querySelector("body"),t=document.querySelectorAll(".navegacion-btn"),l=document.querySelector(".burger");function n(){l.classList.toggle("clicked"),e.classList.toggle("show"),c.classList.toggle("show"),o.classList.toggle("overflow")}for(document.querySelector(".burger").addEventListener("click",n),document.querySelector(".overlay").addEventListener("click",n),i=0;i<t.length;i++)t[i].addEventListener("click",function(){r(),console.log("click")});function r(){e.classList.remove("show"),c.classList.remove("show"),l.classList.remove("clicked")}}menu();