// ==UserScript==
// @name         YouTube playlist to JSON
// @match        https://www.youtube.com/playlist?list=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// ==/UserScript==
const VIDEOS=[]
const PLAYLIST={'videos':VIDEOS}

function save(data,filename){
    data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    let a = document.createElement('a');
    a.href = 'data:' + data;
    a.download = filename+'.json';
    a.click()
}

function parse(viewsp){
    let views=new Number(viewsp.replace('K','000').replace('M','000000'))
    if(isNaN(views)) throw `Can't parse view-count: ${viewsp}`
    return views
}

function convert(){
    if(Math.ceil(window.scrollY)<window.scrollMaxY){
        window.alert('Scroll down to fully load playlist...')
        return
    }
    VIDEOS.splice(0,VIDEOS.length)
    PLAYLIST['name']=document.title.replace(' - YouTube','')
    PLAYLIST['channel']=document.querySelectorAll('yt-avatar-stack-view-model')[1].textContent.split(' ')[1]//document.querySelector('#owner-text a').textContent
    let d=new Date()
    d=[d.getFullYear(),d.getMonth(),d.getDate()].map(d=>d<10?'0'+d:d)
    PLAYLIST['date']=`${d[0]}-${d[1]}-${d[2]}`
    PLAYLIST['url']=document.location.toString()
    let playlist=document.querySelector('#contents *[page-subtype="playlist"]')
    let videos=playlist.querySelectorAll('ytd-playlist-video-renderer')
    for(let video of videos){
        let title=video.querySelector('a#video-title')
        let channel=video.querySelector('.ytd-channel-name a')
        let name=title.textContent.trim()
        if(!channel){
            window.alert(`Skip ${name}`)
            continue
        }
        VIDEOS.push({
            'name':name,
            'url':title.href,
            'duration':video.querySelector('ytd-thumbnail-overlay-time-status-renderer span').textContent.trim(),
            'channel':channel.textContent.trim(),
        })
    }
    save(PLAYLIST,PLAYLIST['name'])
}

function shortcut(event){if(event.ctrlKey&&event.key=='e') convert()}

GM_registerMenuCommand('Export to JSON',convert)
window.onkeyup=shortcut
