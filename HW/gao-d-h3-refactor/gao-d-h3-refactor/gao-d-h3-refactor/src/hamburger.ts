// mobile menu
const burgerIcon = document.querySelector("#burger") as HTMLElement;
const navbarMenu = document.querySelector("#nav-links") as HTMLElement;

burgerIcon.addEventListener('click', () => {
    navbarMenu.classList.toggle('is-active');
});
