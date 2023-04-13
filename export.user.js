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

function convert(){
    if(Math.ceil(window.scrollY)<window.scrollMaxY){
        window.alert('Scroll down to fully load playlist...')
        return
    }
    PLAYLIST['name']=document.title.replace(' - YouTube','')
    PLAYLIST['channel']=document.querySelector('#owner-text a').textContent
    let d=new Date()
    d=[d.getFullYear(),d.getMonth(),d.getDate()].map(d=>d<10?'0'+d:d)
    PLAYLIST['date']=`${d[0]}-${d[1]}-${d[2]}`
    PLAYLIST['url']=document.location.toString()
    let titles=document.querySelectorAll('a#video-title')
    let durations=document.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer span')
    let channels=document.querySelectorAll('.ytd-channel-name .yt-simple-endpoint')
    for(let i=0;i<titles.length;i++)
        VIDEOS.push({
            'name':titles[i].textContent.trim(),
            'url':titles[i].href,
            'duration':durations[i].textContent.trim(),
            'channel':channels[i].textContent.trim(),
        })
    save(PLAYLIST,PLAYLIST['name'])
}

GM_registerMenuCommand('Export to JSON',convert)
