function menu() {
  const overlay = document.querySelector('.overlay');
  const navigation = document.querySelector('.navegacion');
  const body = document.querySelector('body');
  const elementBtn = document.querySelectorAll('.navegacion-btn');
  const burger = document.querySelector('.burger');

  function classToggle() {
    burger.classList.toggle('clicked');
    overlay.classList.toggle('show');
    navigation.classList.toggle('show');
    body.classList.toggle('overflow');
  }

  document.querySelector('.burger').addEventListener('click', classToggle);
  document.querySelector('.overlay').addEventListener('click', classToggle);

  for (let i = 0; i < elementBtn.length; i++) {
    elementBtn[i].addEventListener('click', function() {
      removeClass();
    });
  }

  function removeClass() {
    overlay.classList.remove('show');
    navigation.classList.remove('show');
    burger.classList.remove('clicked');
  }
}

export default menu;
