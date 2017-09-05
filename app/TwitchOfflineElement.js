export function twitchOfflineInfoElement (data) {
  const el = document.createElement('div')
  el.setAttribute('class', 'offline-element twitchElement')
  el.setAttribute('data-isOnline', false)
  el.setAttribute('data-mature', `${data.mature}`)
  el.setAttribute('data-url', `${data.url}`)
  el.setAttribute('style', `background-image: url(${data.profile_banner})`)

  const html = `
   <h3 class="offline-element__header">${data.display_name}</h3>
   <img class="offline-element__avatar" src="${data.logo}" height=140>
   <p class="offline-element__followers">${data.followers} followers</p>`

  el.innerHTML = html
  return el
}
