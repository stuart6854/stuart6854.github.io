/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});

let slideIndex = 1;
showSlide(slideIndex);

// Next/Previous controls
function plusSlide(n) 
{
    showSlide(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n)
{
    showSlide(slideIndex = n);
}

function showSlide(n)
{
    let i;
    let slides = document.getElementsByClassName("slides");
    let dots = document.getElementsByClassName("slides-dot");
    if(n > slides.length)
    {
        slideIndex = 1;
    }
    if(n < 1)
    {
        slideIndex = slides.length;
    }
    for(i = 0; i < dots.length; i++)
    {
        slides[i].style.display = "none";
    }
    for(i = 0; i < dots.length; i++)
    {
        // dots[i].classList = dots[i].className.replace(" slide-active", "");
        dots[i].classList.remove("slide-active");
    }

    slides[slideIndex - 1].style.display = "block";
    slides[slideIndex - 1].classList.add("slide-active");
}