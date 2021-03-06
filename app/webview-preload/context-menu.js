import { remote, ipcRenderer } from 'electron'
const { Menu, MenuItem, clipboard } = remote

export function setup () {
  document.addEventListener('contextmenu', onContextMenu, false)
}

function onContextMenu (e) {
  var menuItems = []

  // find href or img data
  var href, img
  var el = document.elementFromPoint(e.clientX, e.clientY)
  while (el && el.tagName) {
    if (!img && el.tagName == 'IMG')
      img = el.src
    if (!href && el.href)
      href = el.href
    el = el.parentNode
  }

  // links
  if (href) {
    menuItems.push({ label: 'Open Link in New Tab', click: () => ipcRenderer.sendToHost('new-tab', href) })
    menuItems.push({ label: 'Copy Link Address', click: () => clipboard.writeText(href) })
  }

  // images
  if (img) {
    menuItems.push({ label: 'Save Image As...', click: () => alert('todo') })
    menuItems.push({ label: 'Copy Image URL', click: () => clipboard.writeText(img) })
    menuItems.push({ label: 'Open Image in New Tab', click: () => ipcRenderer.sendToHost('new-tab', img) })
  }

  // clipboard
  if (e.target.nodeName == 'TEXTREA' || e.target.nodeName == 'INPUT') {
    menuItems.push({ label: 'Cut', click: () => document.execCommand('cut') })
    menuItems.push({ label: 'Copy', click: () => document.execCommand('copy') })
    menuItems.push({ label: 'Paste', click: () => document.execCommand('paste') })
    menuItems.push({ type: 'separator' })
  }
  else if (window.getSelection().toString() !== '') {
    menuItems.push({ label: 'Copy', click: () => document.execCommand('copy') })
    menuItems.push({ type: 'separator' })      
  }

  // inspector
  menuItems.push({ label: 'Inspect Element', click: () => ipcRenderer.sendToHost('inspect-element', e.clientX, e.clientY) })

  // show menu
  var menu = Menu.buildFromTemplate(menuItems)
  menu.popup(remote.getCurrentWindow())
}