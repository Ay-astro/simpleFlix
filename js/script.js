const global = {
    currentPage: window.location.pathname
}

async function displayPopularMovie(){
    const {results} = await fetchData('movie/popular');
    results.forEach((movie)=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=$(movie.id)">
            ${
                movie.poster_path
                ? `
                <img
                src="https://images.tmdb.org/t/p/w500${movie.poster_path}"
                class="card-img-top"
                alt="Movie Title" />
                ` :
                `
                <img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="Movie Title"/>
                `
            }
        </a>
        <div class="card-body">
        <h5 class="card-title">${movie.title}</h5>
        <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
        </p>
        </div>
        `
        const popular = document.querySelector('#popular-movies');
        popular.appendChild(div)
    })
}


async function displayPopularShow(){
    const {results} = await fetchData('tv/popular');
    results.forEach((show)=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=$(show.id)">
            ${
                show.poster_path
                ? `
                <img
                src="https://images.tmdb.org/t/p/w500${show.poster_path}"
                class="card-img-top"
                alt="show.name" />
                ` :
                `
                <img
                src="images/no-image.jpg"
                class="card-img-top"
                alt="shoow.name"/>
                `
            }
        </a>
        <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
            <small class="text-muted">Air Date: ${show.first_air_date}</small>
        </p>
        </div>
        `
        const popular = document.querySelector('#popular-shows');
        popular.appendChild(div)
    })
}


async function fetchData (endpoint){
    const API_KEY = 'f6c53b64ea9383ff613ebd67a357e79a';
    const API_URL =  'https://api.themoviedb.org/3/';
    showSpinnr()
    const respons = await fetch(
        `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
    )
    const data = await respons.json();
    hideSpinnr()
    return data
}

function highlightPage(){
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link)=>{
        if(link.getAttribute('href')=== global.currentPage){
            link.classList.add('active')
        }
    })
}

function showSpinnr(){
    const spinner = document.querySelector('.spinner')
    spinner.classList.add('show')
}
function hideSpinnr(){
    const spinner = document.querySelector('.spinner')
    spinner.classList.remove('show')
}

function init(){
    switch(global.currentPage){
        case '/':
            case '/index.html':
            displayPopularMovie()
            break;
        case '/tv-details.html':
            
            break;
        case '/shows.html':
            displayPopularShow()
            break;
        case '/search.html':
            console.log('search')
            break;
        case '/movie-details.html':
            console.log('movie details')
            break;
    }
    highlightPage()
}



document.addEventListener('DOMContentLoaded', init)