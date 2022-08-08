let moreToggler = document.querySelectorAll('[data-toggle="more"]');
let banksList = document.querySelectorAll('.converter__list-item:not(.show)');

moreToggler.forEach(more => {

   more.addEventListener('click', () => {
      more.parentElement.style.display = 'none';

      banksList.forEach(bank => bank.classList.add('show'));
   })
});
