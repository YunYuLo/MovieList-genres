(function () {
  const genres = {
    "1": "Action",
    "2": "Adventure",
    "3": "Animation",
    "4": "Comedy",
    "5": "Crime",
    "6": "Documentary",
    "7": "Drama",
    "8": "Family",
    "9": "Fantasy",
    "10": "History",
    "11": "Horror",
    "12": "Music",
    "13": "Mystery",
    "14": "Romance",
    "15": "Science Fiction",
    "16": "TV Movie",
    "17": "Thriller",
    "18": "War",
    "19": "Western"
  }
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'
  const data = []
  let paginationData = []

  const content = document.querySelector('.content')
  const genresBtn = document.querySelector('#genres-btn')
  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')
  const dataPanel = document.getElementById('data-panel')
  const pagination = document.getElementById('pagination')
  const container = document.querySelector('.container')
  const ITEM_PER_PAGE = 12

  content.addEventListener('click', function(event){
    let selectedGenresId = Number(event.target.dataset.genresId)
    const genresData = data.filter(function(movie){
      return movie.genres.includes(selectedGenresId)
    })

    if (!selectedGenresId) {
      return
    }

    if (genresData.length == 0) {
      alert('No results found!')
  } else {
      getTotalPages(genresData)
      getPageData(1, genresData)
  }
  })

  //show genres btn
  displayGenresBtn()
  function displayGenresBtn(){
    let htmlContent = ''
    Object.keys(genres)
    .forEach(function eachKey(key){
      htmlContent +=`
      <button type="button" class="btn btn-outline-primary" data-genres-id="${key}">${genres[key]}</button>
      `
    })
    genresBtn.innerHTML = htmlContent
  }

  //show movie on html
  axios.get(INDEX_URL).then((response) => {
    data.push(...response.data.results)
    // displayDataList(data)
    getTotalPages(data)
    getPageData(1, data)
  }).catch((err) => console.log(err))

  /*********** EventListener ***********/
  // listen to data panel
  dataPanel.addEventListener('click', (event) => {
    if (event.target.matches('.btn-show-movie')) {
      showMovie(event.target.dataset.id)
    }
  })

  // listen to pagination click event
  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      getPageData(event.target.dataset.page)
    }
  })

  // listen to search form submit event
  searchForm.addEventListener('submit', event => {
    event.preventDefault()

    let results = []
    const regex = new RegExp(searchInput.value, 'i')


    results = data.filter(movie => movie.title.match(regex))
    // displayDataList(results)
    getTotalPages(results)
    getPageData(1, results)
  })

  //listen to change view
  container.addEventListener('click', event => {
    if (event.target.classList.contains("list")) {
      dataPanel.classList.add('listView')
      getPageData(page)
    } else if (event.target.classList.contains("picView")){
      dataPanel.classList.remove('listView')
      getPageData(page)
    }
  })


  /*********** function ***********/
  //display pic with title
  function displayDataList (data) {
    let htmlContent = ''
    data.forEach(function (item, index) {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>`
      
      item.genres.forEach(function(key){
        htmlContent +=`
        <button type="button" class="btn btn-light btn-sm" data-genres-id="${key}">${genres[key]}</button>
        `
      })
 
      htmlContent +=`
            </div>

            <!-- "More" button -->
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  //display title only
  function displayListOnly (data) {
    let htmlContent = ''
    data.forEach(function(item, index) {
      htmlContent += `
        <div class="col-sm-9 mb-2 mt-2 bg-light">
          <h6 class="title">${item.title}</h6>
        </div>
        <div class="col-sm-3 mb-2 mt-2">
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#show-movie-modal" data-id="${item.id}">More</button>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  //show more detail of movie
  function showMovie (id) {
    // get elements
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')

    // set request url
    const url = INDEX_URL + id

    // send request to show api
    axios.get(url).then(response => {
      const data = response.data.results

      // insert data into modal ui
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
  }

  //Pagination
  function getTotalPages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javascript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  function getPageData (pageNum, data) {
    page = pageNum || 1
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    let listView = dataPanel.classList.contains('listView')

    //whether listView or pictureView
    if (listView === true) {
      displayListOnly (pageData)
    } else if (listView !== true) {
      displayDataList(pageData)
    }
  }

})()
