let fabContainer = document.createElement("div");
fabContainer.className = "fab-container";

let fab = document.createElement("div");
fab.className = "fab fab-icon-holder";
fab.innerHTML = '<i class="fa fa-plus"></i>';

let ul = document.createElement("ul");
ul.className = "fab-options";

let options = [
    { label: "Maps", iconClass: "fa fa-instagram", url: "https://www.instagram.com" },
    { label: "Completar", iconClass: "fa fa-twitter", url: "https://twitter.com" },
    { label: "", iconClass: "", url: "" }
];

// Adiciona a classe 'fab-main' ao botão fixo
// Adiciona a classe 'fab-main' ao botão fixo
fab.classList.add('fab-main');

options.forEach(option => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    span.className = "fab-label";
    span.textContent = option.label;
    li.appendChild(span);

    let iconDiv = document.createElement("div");
    iconDiv.className = "fab-icon-holder";
    let icon = document.createElement("i");
    icon.className = option.iconClass;
    iconDiv.appendChild(icon);
    li.appendChild(iconDiv);

    li.setAttribute("data-url", option.url); // Adiciona o atributo data-url com o URL

    // Adiciona classes específicas para cada botão
    if (option.label === "Facebook") {
        li.classList.add('fab-facebook');
    } else if (option.label === "Instagram") {
        li.classList.add('fab-instagram');
    } else if (option.label === "Twitter") {
        li.classList.add('fab-twitter');
    }

    ul.appendChild(li);
});



fabContainer.appendChild(fab);
fabContainer.appendChild(ul);
document.body.appendChild(fabContainer);

// Adiciona o evento de hover para mostrar os botões adicionais
let isHovered = false;

fabContainer.addEventListener('mouseenter', function () {
    isHovered = true;
    ul.classList.add('active');
});

fabContainer.addEventListener('mouseleave', function () {
    isHovered = false;
    setTimeout(() => {
        if (!isHovered) {
            ul.classList.remove('active');
        }
    }, 200); // Atraso de 200 milissegundos (ajuste conforme necessário)
});

ul.addEventListener('mouseenter', function () {
    isHovered = true;
});

ul.addEventListener('mouseleave', function () {
    isHovered = false;
    ul.classList.remove('active');
});

// Adiciona o evento de clique para redirecionar para o URL
ul.addEventListener('click', function (event) {
    let target = event.target.closest('li[data-url]');
    if (target && target !== ul.lastElementChild) {
        let url = target.getAttribute('data-url');
        window.open(url, '_blank');
    }
});