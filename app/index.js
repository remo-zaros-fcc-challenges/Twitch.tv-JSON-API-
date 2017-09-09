import './main.css'
import {twitchOnlineInfoElement} from './TwitchOnlineElement'
import {twitchOfflineInfoElement} from './TwitchOfflineElement'
import {twitchUsers} from './TwitchUsers'

const elOnline = document.querySelector('#twitchElementsOnline')
const elOffline = document.querySelector('#twitchElementsOffline')
const elTimer = document.querySelector('#timer')
const checkLoaded = checkLoadedData(twitchUsers.length)

let dataLoadedOnline = []
let dataLoadedOffline = []
let busyUpdate = false

const myHeaders = new Headers()
myHeaders.append('Accept', 'application/vnd.twitchtv.v5+json')
myHeaders.append('Client-ID', 'uo6dggojyb8d6soh92zknwmi5ej1q2')
const myInit = {method: 'GET', headers: myHeaders}

function checkLoadedData (totalItems) {
  return function check (totalLoaded) {
    return totalItems === totalLoaded
  }
}

function openURL (e) {
  window.open(e.currentTarget.dataset.url, '_self')
}

function addMouseOverClass (e) {
  e.currentTarget.classList.add('mouse-over')
}

function removeMouseOverClass (e) {
  e.currentTarget.classList.remove('mouse-over')
}

function addEvents () {
  const els = document.querySelectorAll('.twitchElement')
  for (let i = 0; i < els.length; i++) {
    els[i].onclick = openURL
    els[i].onmouseover = addMouseOverClass
    els[i].onmouseout = removeMouseOverClass
  }
}

function deleteElements () {
  const els = document.querySelectorAll('.twitchElement')
  for (let i = 0; i < els.length; i++) {
    els[i].remove()
  }
}

function sortElements () {
  dataLoadedOnline.sort((x, y) => x.stream.viewers - y.stream.viewers).reverse()
  dataLoadedOffline.sort((x, y) => x.followers - y.followers).reverse()
}

function renderElements () {
  dataLoadedOnline.forEach(x => elOnline.append(twitchOnlineInfoElement(x)))
  dataLoadedOffline.forEach(x => elOffline.append(twitchOfflineInfoElement(x)))
}

function clearArrays () {
  dataLoadedOnline = []
  dataLoadedOffline = []
}

function refreshElementsWhenReady (data) {
  if (checkLoaded(dataLoadedOffline.length + dataLoadedOnline.length)) {
    deleteElements()
    sortElements()
    renderElements()
    addEvents()
    clearArrays()
    document.querySelector('#full-container').style.display = 'block'
  }
}

function getTwitchData () {
  busyUpdate = true
  twitchUsers.forEach(x => {
    try {
      fetch('https://api.twitch.tv/kraken/streams/' + x, myInit)
      .then(response => response.json())
      .then(data => {
        if (data.stream === null) {
          fetch('https://api.twitch.tv/kraken/channels/' + x, myInit)
            .then(response => response.json())
            .then(data => {
              dataLoadedOffline.push(data)
              refreshElementsWhenReady(data)
              busyUpdate = false
            })
        } else {
          dataLoadedOnline.push(data)
          refreshElementsWhenReady(data)
          busyUpdate = false
        }
      })
    } catch (e) {
      console.log(e)
    }
  })
}

let startTime = Math.round((new Date()).getTime() / 1000)
function update () {
  let now = Math.round((new Date()).getTime() / 1000)
  let timePast = now - startTime

  if (!busyUpdate) {
    elTimer.innerHTML = `update in ${(120 - timePast)} secs.`
  } else {
    elTimer.innerHTML = `updating...`
  }
  if (timePast > 120) {
    startTime = Math.round((new Date()).getTime() / 1000)
    getTwitchData()
  }
  window.requestAnimationFrame(update)
}

getTwitchData()
update()
