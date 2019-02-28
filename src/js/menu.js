function menu() {
    var overlay = document.querySelector('.overlay');
    var navigation = document.querySelector('.navegacion');
    var body = document.querySelector('body');
    var elementBtn = document.querySelectorAll('.navegacion-btn');
    var burger = document.querySelector('.burger');

    function classToggle() {
        burger.classList.toggle('clicked');
        overlay.classList.toggle('show');
        navigation.classList.toggle('show');
        body.classList.toggle('overflow');
    }

    document.querySelector('.burger').addEventListener('click', classToggle);
    document.querySelector('.overlay').addEventListener('click', classToggle);

    for(i=0; i<elementBtn.length; i++){
        elementBtn[i].addEventListener("click", function(){
            removeClass();
            console.log('click')
        });
    }

    function removeClass() {
        overlay.classList.remove("show");
        navigation.classList.remove("show");
        burger.classList.remove("clicked");

    }
}

menu();
