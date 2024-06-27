const global = {
    currentPage: window.location.pathname,
    key:{
      apiKey: 'f6c53b64ea9383ff613ebd67a357e79a',
      apiURL : 'https://api.themoviedb.org/3/'
    },
    search:{
      term: '',
      type:'',
      page: 1 ,
      totalPage: 1,
      totalResults: 0 
    }
}

async function displayPopularMovie(){
    const {results} = await fetchData('movie/popular');
    results.forEach((movie)=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
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
async function search(){
  const query = window.location.search;
  const urlParam = new URLSearchParams(query)
  global.search.type = urlParam.get('type')
  global.search.term = urlParam.get('search-term')
  if(global.search.term !== '' && global.search.term !== null){
    const {results,total_pages,page,total_results} = await searchData ()

    global.search.page = page;
    
    global.search.totalPage = total_pages;
    global.search.totalResults = total_results;

    
    if(results.length === 0){
      alrt('no results found')
      return
    }
    displaySearch(results)
  }else{
    alrt('please enter a term')
    
  }
}
function alrt(message, className = "error"){
  const dive = document.createElement('div');
  dive.classList.add('alert', className);
  dive.appendChild(document.createTextNode(message))
  document.querySelector('#alert').appendChild(dive)
  setTimeout(()=> dive.remove(),3000)
}
function displaySearch (results){
      document.querySelector('#search-results').innerHTML = '';
      document.querySelector('#search-results-heading').innerHTML = '';
      document.querySelector('#pagination').innerHTML = '';
      
    results.forEach((result)=>{
      const div =  document.createElement('div')
      div.classList.add('card')
      div.innerHTML = `
      <a href="${global.search.type}-details.html?id=${result.id}">
      ${
        result.poster_path
        ? `
        <img
        src="https://images.tmdb.org/t/p/w500${result.poster_path}"
        class="card-img-top"
        alt="${global.search.type === 'movie'? result.title : result.name}" />
        ` :
        `
        <img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${global.search.type === 'movie'? result.title : result.name}"/>
        `
    }
          </a>
          <div class="card-body">
            <h5 class="card-title">${global.search.type === 'movie'? result.title : result.name}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${global.search.type === 'movie'? result.release_date : result.first_air_date}</small>
            </p>
          </div>
      `
      document.querySelector('#search-results').appendChild(div)
      document.querySelector('#search-results-heading').innerHTML = `
        <h2>${results.length} of ${global.search.totalResults} results for ${global.search.term}</h2>
      `
    });
    displayPagination()

}
function displayPagination (){
  const pagination = document.createElement('div');
    pagination.classList.add('pagination')
    pagination.innerHTML = `
    <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">${global.search.page} of ${global.search.totalPage}</div>
    `
    document.querySelector('#pagination').appendChild(pagination)
  const prev = document.querySelector('#prev');
  const nexxt = document.querySelector('#next')
    if(global.search.page === 1){
      prev.disabled = true
    }
    if(global.search.page === global.search.totalPage){
      nexxt.disabled = true
    }
    nexxt.addEventListener('click',async ()=>{
      global.search.page++;
      const {results, total_pages}= await searchData();
      displaySearch(results)
    })
    prev.addEventListener('click',async ()=>{
      global.search.page--;
      const {results, total_pages}= await searchData();
      displaySearch(results)
    })
}
async function searchData (){
  const API_KEY = global.key.apiKey;
  const API_URL =  global.key.apiURL;
  showSpinnr()

  const respons = await fetch(
      `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  )
  const data = await respons.json();
  hideSpinnr()
  return data
}

async function movieDetails (){
    const movieId = window.location.search.split('=')[1];
    const movie = await fetchData(`movie/${movieId}`)
    const div =  document.createElement('div')
    const deatils = document.querySelector('#movie-details')
    displayMovieBackDrop('movie',movie.backdrop_path)
    div.innerHTML= `
    <div class="details-top">
          <div>
            
            ${
                movie.poster_path
            ?`<img
            src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
            class="card-img-top"
            alt="${movie.title}"
          />`:
          `
          <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="Movie-title"
            />
          `
            }
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommasToNumbers(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommasToNumbers(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span>${movie.runtime}</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((compony)=> `<spaan>${compony.name}</span>`).join(', ')}</div>
        </div>
    `
    deatils.appendChild(div)
}
async function showDetails(){
    const showId = window.location.search.split('=')[1];
    const show = await fetchData(`tv/${showId}`);
    const showDiv = document.createElement('div')
    const showdisplay = document.querySelector('#show-details')
    displayMovieBackDrop('tv',show.backdrop_path)
    showDiv.innerHTML = `
    <div class="details-top">
          <div>
           ${
            show.poster_path
            ?`
            <img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
            `
            :`
            <img
            src="images/no-image.jpg"
            class="card-img-top"
            alt="$show.name"
            `

           }
            />
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.release_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${
                show.genres.map((genre)=>`
                <li>${genre.name}</li>
                `).join('')
              }
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span>${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${show.production_companies.map((company)=>`<span>${company.name}</span>`).join(', ')}</div>
        </div>
    `
    showdisplay.appendChild(showDiv)
}
function displayMovieBackDrop(type, movieBackdrop){
    const overlay = document.createElement('div')
    overlay.style.background = `url(https://images.tmdb.org/t/p/original/${movieBackdrop})`
    overlay.style.backroundSize = 'cover'
    overlay.style.backgroundPosition = 'centre'
    overlay.style.backgroundRepeat = 'no-repeat'
    overlay.style.position = 'absolute'
    overlay.style.top = '0'
    overlay.style.left = '0'
    overlay.style.width = '100vw'
    overlay.style.height = '100vh'
    overlay.style.zIndex = '-1'
    overlay.style.opacity = '0.1'
    if(type === 'movie' ){
        document.querySelector('#movie-details').appendChild(overlay)
    }else{
        document.querySelector('#show-details').appendChild(overlay)
    }
}
async function displaySlider(){
  const {results} = await fetchData('movie/now_playing');
  results.forEach((movie)=>{
    const div = document.createElement('div');
    const slider = document.querySelector('.swiper-wrapper')
    div.classList.add('swiper-slide');
    div.innerHTML= `
            <a href="movie-details.html?id=${movie.id}">
                <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>
    `
    slider.appendChild(div)
    initSwiper()
  })
}
function initSwiper(){
  const swiper = new Swiper ('.swiper',{
    slidersPerview : 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay:{
      delay:4000,
      disableOnIntereaction: false
    },
    breakpoints: {
      500:{
        slidersPerview: 2
      },
      700:{
        slidersPerview: 3
      },
      1200:{
        sliderPerview: 4
      },
    }
  });
}
function addCommasToNumbers (num){
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

async function displayPopularShow(){
    const {results} = await fetchData('tv/popular');
    results.forEach((show)=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="tv-details.html?id=${show.id}">
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
    const API_KEY = global.key.apiKey;
    const API_URL =  global.key.apiURL;
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
            displaySlider()
            break;
        case '/tv-details.html':
            showDetails()
            break;
        case '/shows.html':
            displayPopularShow()
            break;
        case '/search.html':
          search()
            break;
        case '/movie-details.html':
            movieDetails()
            break;
    }
    highlightPage()
}



document.addEventListener('DOMContentLoaded', init)