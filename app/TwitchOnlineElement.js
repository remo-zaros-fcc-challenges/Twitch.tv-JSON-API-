export function twitchOnlineInfoElement (data) {
  const el = document.createElement('div')
  el.setAttribute('class', 'online-element twitchElement')
  el.setAttribute('data-isOnline', true)
  el.setAttribute('data-mature', `${data.stream.channel.mature}`)
  el.setAttribute('data-url', `${data.stream.channel.url}`)

  const html = `
    <header class="online-element__header" style="background: url(${data.stream.channel.profile_banner})">
      <img class="online-element__avatar" src="${data.stream.channel.logo}" height=150>
    </header>
    <div class="online-element__info">
      <div class="online-element__desc">
        <h3 class="online-element__head">${data.stream.channel.display_name}</h3>
        <p class="online-element__body">${data.stream.channel.status}</p>
      </div>
      <p class="online-element__aditional-info">Current Event: ${data.stream.channel.game}<br>
      viewers: ${data.stream.viewers}</p>
    </div>`

  el.innerHTML = html
  return el
}
