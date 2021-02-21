const baseURL = 'https://movie-list.alphacamp.io'
const indexURL = baseURL + '/api/v1/movies/'
const imageURL = baseURL + '/posters/'

const moviePage = 8
let filterMovies = []

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
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
              <button class="btn btn-danger btn-remove-movie" data-id="${item.id}">X</button>
            </div>
          </div>
        </div>
      </div>
    `
  })
  moviePanel.innerHTML = rawHTML
}

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

// function addToFavorite(x) {
//   const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
//   const movie = movies.find((movie) => movie.id === x)
//   if (list.some((movie) => movie.id === x)) {
//     return alert('加過囉')
//   }
//   list.push(movie)
//   localStorage.setItem('favoriteMovies', JSON.stringify(list))
// }

// function moviePage (x) {
//   const data = filterMovies
// }

function movieByPage(page) {
  const data = filterMovies.length ? filterMovies : movies
  const movieIndex = (page - 1) * moviePage
  return data.slice(movieIndex, movieIndex + moviePage)
}


function renderPaginator(amount) {
  const page = Math.ceil(amount / moviePage)
  let raw = ''
  for (let i = 1; i <= page; i++) {
    raw += `<li class="page-item"><a class="page-link" href="#" data-page="${i}">${i}</a></li>`
  }
  paginator.innerHTML = raw
}

function removeMovie(x) {
  if (!movies) return
  const movieIndex = movies.findIndex((movie) => movie.id === x)
  if (movieIndex === -1) return
  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  movieDataList(movies)

}

paginator.addEventListener('click', function clickPage(event) {
  if (event.target.tagName === 'A') {
    const page = Number(event.target.dataset.page)
    movieDataList(movieByPage(page))
  }
})

moviePanel.addEventListener('click', function clickMoreInfo(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieInformation(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-movie')) {
    removeMovie(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function submittedKeyword(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()



  filterMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )

  if (filterMovies.length === 0) {
    return alert(`Your keyword: ${keyword} can't find anything`)
  }
  renderPaginator(filterMovies.length)
  movieDataList(movieByPage(1))

})

renderPaginator(movies.length)
movieDataList(movieByPage(1))


// axios.get(indexURL).then((response) => {
//   movies.push(...response.data.results)
//   movieDataList(movies)
// }).catch((error) => {
//   console.log(error)
// }) 