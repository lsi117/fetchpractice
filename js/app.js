const select = document.getElementById('breeds');
const card = document.querySelector('.card');
const form = document.querySelector('form');

// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------
function fetchData (url){
  return fetch(url)
    .then(checkStatus)
    .then(response => response.json())
    .catch(error => console.log('Looks like there was a problem!', error))
    }

//will fail if one fails..
Promise.all([
  fetchData('https://dog.ceo/api/breeds/list'),
  fetchData('https://dog.ceo/api/breeds/image/random')

  ])
  .then(data => {
    let breedList = data[0].message;
    let randomImg = data[1].message;
    generateOptions(breedList);
    generateImage(randomImg);
  })

//these fetchData were replaced with Promise.all

// fetchData('https://dog.ceo/api/breeds/list')
//   .then(data => generateOptions(data.message))

// fetchData('https://dog.ceo/api/breeds/image/random')
//   .then(data => generateImage(data.message))


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------
function checkStatus (response) {
  if(response.ok){
    return Promise.resolve(response);
  }else {
    return Promise.reject(new Error(response.statusText));
  }
}

function generateOptions (data) {
  let options = data.map(item => `
      <option value='${item}'>${item}</option>
    `).join('');
  select.innerHTML = options;
}

function generateImage (data) {
  let html = `
    <img src='${data}' alt="#">
    <p>Click to view images of ${select.value}s</p>
  `;
  card.innerHTML = html;
}

function fetchBreedImage () {
  let breed = select.value;
  let img = card.querySelector('img');
  let p = card.querySelector('p');

  fetchData(`https://dog.ceo/api/breed/${breed}/images/random`)
    .then(data =>{
      img.src = data.message;
      img.alt = breed;
      p.textContent = `Click to view more ${breed}s`;

    })
}


// ------------------------------------------
//  EVENT LISTENERS
// ------------------------------------------
select.addEventListener('change', fetchBreedImage);
card.addEventListener('click', fetchBreedImage);
form.addEventListener('submit', postData);


// ------------------------------------------
//  POST DATA
// ------------------------------------------
function postData (e){
  e.preventDefault();
  const name = document.getElementById('name').value;
  const comment = document.getElementById('comment').value;

const config = {
  method: 'POST',
  mode: 'no-cors', //trying to fix CORS ISSUE
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({name, comment})
}


  fetch('https://jsonplaceholder.typicode.com/comments')
  .then(checkStatus)
  .then(response => response.json())
  .then(data => console.log(data))
}

