const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu .nav-link');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

window.addEventListener("scroll", () => {
    const header = document.querySelector("header");
    header.style.top = `${window.scrollY}px`;
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shortenForm');
    const input = document.getElementById('linkInput');
    const submitBtn = document.querySelector('.btn-secondary');
    const results = document.getElementById('shortenResults');
    const errorMessage = document.getElementById('errorMessage');

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const url = input.value;

            if (url === "") {
                errorMessage.textContent = "Please add a link!";
                return;
            }
          
            shortenUrl(url);
        });
    }
      
    async function shortenUrl(url) {
        try {
            const res = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
    
            const newUrl = document.createElement("div");
            newUrl.classList.add("shorten-result");
            newUrl.innerHTML = `
                <p class="original-link">${url}</p>
                <a href="${data.result.short_link}" class="short-link" target="_blank">${data.result.short_link}</a>
                <button class="btn-copy">Copy</button>
            `;
            results.prepend(newUrl);
    
            const copyBtn = newUrl.querySelector(".btn-copy");
            copyBtn.addEventListener("click", () => {
                navigator.clipboard.writeText(copyBtn.previousElementSibling.textContent)
                    .then(() => {
                        console.log('Text copied to clipboard');
                    })
                    .catch(err => {
                        console.log('Error in copying text: ', err);
                    });
            });
    
            input.value = "";
            errorMessage.textContent = "";
        } catch (err) {
            errorMessage.textContent = "Failed to shorten the link. Please try again.";
            console.log(err);
        }
    }

    function loadHTML(id, url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
                if (callback) callback();
            })
            .catch(error => console.error('Error loading HTML:', error));
    }
    
    loadHTML('header', 'header.html', () => {
        const script = document.createElement('script');
        script.src = 'header.js';
        document.body.appendChild(script);
    });
    
    loadHTML('footer', 'footer.html');
});
