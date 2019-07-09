
// Highlight the top nav as scrolling occurs
$('body').scrollspy({
    target: '.navbar-fixed-top'
})

// Closes the Responsive Menu on Menu Item Click
$('.navbar-collapse ul li a').click(function() {
    $('.navbar-toggle:visible').click();
});

//BACKGROUND
window.addEventListener('resize', function() {
    if (this.innerWidth >= 768) {
        let el = document.getElementById('mydiv');
        el.classList.remove('rec');
        el.classList.add('parallaxContainer2');
        el.style.setProperty("background-image", "url(img/kidss.png)");
    } else {
        let el = document.getElementById('mydiv');
        el.classList.add('rec');
        el.classList.remove('parallaxContainer2');
        el.style.setProperty("background-image", "url(img/recr.png)");


    }
});
$(function(){
     var navMain = $(".navbar-collapse");

     navMain.on("click", "a", null, function () {
         navMain.collapse('hide');
     });
 });
//ANIMATIONS
AOS.init();
$( document ).ready(function() {
    $(".parallaxContainer").mkParallax();
    $(".parallaxContainer2").mkParallax();
});

//GALLERY
window.onload = function() {
    baguetteBox.run('.baguetteBoxOne');

    if (typeof oldIE === 'undefined' && Object.keys) {
        hljs.initHighlighting();
    }

    var year = document.getElementById('year');
    year.innerText = new Date().getFullYear();
};

//FORM
{
    const form = document.querySelector('#contactForm');
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

    //wyłączamy domyślną walidację
    form.setAttribute('novalidate', true);

    const displayFieldError = function(elem) {
        const fieldRow = elem.closest('.form-row');
        const fieldError = fieldRow.querySelector('.field-error');
        if (fieldError === null) {
            const errorText = elem.dataset.error;
            const divError = document.createElement('div');
            divError.classList.add('field-error');
            divError.innerText = errorText;
            fieldRow.appendChild(divError);
        }
    };

    const hideFieldError = function(elem) {
        const fieldRow = elem.closest('.form-row');
        const fieldError = fieldRow.querySelector('.field-error');
        if (fieldError !== null) {
            fieldError.remove();
        }
    };

    [...inputs].forEach(elem => {
        elem.addEventListener('input', function() {
            if (!this.checkValidity()) {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                hideFieldError(this);
            }
        });

        if (elem.type === "checkbox") {
            elem.addEventListener('click', function() {
                const formRow = this.closest('.form-row');
                if (this.checked) {
                    this.classList.remove('error');
                    hideFieldError(this);
                } else {
                    this.classList.add('error');
                }
            });
        }
    });

    const checkFieldsErrors = function(elements) {
        //ustawiamy zmienną na true. Następnie robimy pętlę po wszystkich polach
        //jeżeli któreś z pól jest błędne, przełączamy zmienną na false.
        let fieldsAreValid = true;

        [...elements].forEach(elem => {
            if (elem.checkValidity()) {
                hideFieldError(elem);
                elem.classList.remove('error');
            } else {
                displayFieldError(elem);
                elem.classList.add('error');
                fieldsAreValid = false;
            }
        });

        return fieldsAreValid;
    };

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        //jeżeli wszystkie pola są poprawne...
        if (checkFieldsErrors(inputs)) {
            const elements = form.querySelectorAll('input:not(:disabled), textarea:not(:disabled), select:not(:disabled)');

            const dataToSend = new FormData();
            [...elements].forEach(el => dataToSend.append(el.name, el.value));

            const url = form.getAttribute('action');
            const method = form.getAttribute('method');

            const submit = form.querySelector('[type="submit"]');
            submit.disabled = true;
            submit.classList.add('element-is-busy');

            fetch(url, {
                method: method.toUpperCase(),
                body: dataToSend
            })
            .then(ret => ret.json())
            .then(ret => {
                submit.disabled = false;
                submit.classList.remove('element-is-busy');

                if (ret.errors) {
                    ret.errors.map(function(el) {
                        return '[name="'+el+'"]'
                    });
                    const selector = ret.errors.join(',');
                    checkFieldsErrors(form.querySelectorAll(sekector));

                } else {
                    if (ret.status === 'ok') {
                        //wyświetlamy komunikat powodzenia, cieszymy sie
                        const div = document.createElement('div');
                        div.classList.add('form-send-success');

                        div.innerHTML = '<strong>Wiadomość została wysłana</strong><span>Dziękujemy za kontakt. Postaramy się odpowiedzieć jak najszybciej</span>';
                        form.parentElement.insertBefore(div, form);
                        form.remove();
                    }

                    if (ret.status === 'error') {
                        //komunikat błędu, niepowodzenia
                        const div = document.createElement('div');
                        div.classList.add('send-error');
                        div.innerText = 'Wysłanie wiadomości się nie powiodło';
                    }
                }
            }).catch(_ => {
                submit.disabled = false;
                submit.classList.remove('element-is-busy');
            });
        }
    });
}
