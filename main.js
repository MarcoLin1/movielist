const baseURL = 'https://movie-list.alphacamp.io'
const indexURL = baseURL + '/api/v1/movies/'
const imageURL = baseURL + '/posters/'

const movies = []
let filterMovies = []
const moviePage = 8
const moviePanel = document.querySelector('#movie-data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')

function movieDataList(data) {
  let rawHTML = ''
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${imageURL + item.image}"
              class="card-img-top" alt="movie-poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal"
                data-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  moviePanel.innerHTML = rawHTML
}

moviePanel.addEventListener('click', function clickMoreInfo(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieInformation(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function pageMovie(event) {
  if (event.target.tagName === 'A') {
    const page = Number(event.target.dataset.page)
    movieDataList(getMoviePage(page))
  }
})

function showMovieInformation(id) {
  const modalTitle = document.querySelector('#movie-modal-title')
  const modalDescription = document.querySelector('#movie-modal-description')
  const modalData = document.querySelector('#movie-modal-data')
  const modalImage = document.querySelector('#movie-modal-image')
  axios.get(indexURL + id).then(response => {
    const data = response.data.results
    modalTitle.innerHTML = data.title
    modalData.innerHTML = `Release date: ${data.release_date}`
    modalDescription.innerHTML = data.description
    modalImage.innerHTML = `<img src="${imageURL + data.image}" alt="movie-poster">`
  })

}

function addToFavorite(x) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find((movie) => movie.id === x)
  if (list.some((movie) => movie.id === x)) {
    return alert('加過囉')
  }
  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}




function getMoviePage(page) {
  const data = filterMovies.length ? filterMovies : movies
  const startIndex = (page - 1) * moviePage
  return data.slice(startIndex, startIndex + moviePage)
}

function renderPagination(amount) {
  const movieOfPages = Math.ceil(amount / moviePage)
  let rawHTML = ''
  for (let i = 1; i <= movieOfPages; i++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
  }
  paginator.innerHTML = rawHTML
}


searchForm.addEventListener('submit', function submittedKeyword(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()


  filterMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  console.log(filterMovies.length)

  if (filterMovies.length === 0) {
    return alert(`Your keyword: ${keyword} can't find anything`)
  }
  renderPagination(filterMovies.length)
  movieDataList(getMoviePage(1))
})



axios.get(indexURL).then((response) => {
  movies.push(...response.data.results)
  renderPagination(movies.length)
  movieDataList(getMoviePage(1))
}).catch((error) => {
  console.log(error)
}) 