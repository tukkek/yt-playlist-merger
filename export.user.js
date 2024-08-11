// ==UserScript==
// @name         Video playlist to JSON
// @match        https://www.youtube.com/playlist?list=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// ==/UserScript==
class Video{
    constructor(){
        this.duration=''
        this.channel=''
        this.name=''
        this.url=''
    }
}

class Playlist{
    constructor(){
        this.name=document.title.replace(' - YouTube','')
        this.url=document.location.toString()
        this.channel=''
        this.videos=[]
        let d=new Date()
        d=[d.getFullYear(),d.getMonth(),d.getDate()].map(d=>d<10?'0'+d:d)
        this.date=`${d[0]}-${d[1]}-${d[2]}`
    }

    save(){
        let data=`text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this))}`
        let a=document.createElement('a')
        a.href='data:'+data
        a.download=`${this.name}.json`
        a.click()
        window.alert(`Exported "${this.name}" with ${this.videos.length} videos.`)
    }

    extract(){
         //this.channel=document.querySelector('#owner-text a').textContent
        let playlists=document.querySelector('#contents *[page-subtype="playlist"]')
        let titles=playlists.querySelectorAll('a#video-title')
        let durations=playlists.querySelectorAll('ytd-thumbnail-overlay-time-status-renderer span')
        let channels=playlists.querySelectorAll('.ytd-channel-name .yt-simple-endpoint')
        let videos=[]
        for(let i=0;i<titles.length;i++)
            try{
                let v=new Video()
                v.duration=durations[i].textContent.trim()
                v.channel=channels[i].textContent.trim()
                v.name=titles[i].textContent.trim()
                v.url=titles[i].href
                videos.push(v)
            }catch(e){continue}
       return videos
    }

    convert(){
        if(Math.ceil(window.scrollY)<window.scrollMaxY){
            window.alert('Scroll down to fully load playlist...')
            return
        }
        this.videos=this.extract()
        this.save()
    }
}



function shortcut(event){if(event.ctrlKey&&event.key=='e') convert()}

GM_registerMenuCommand('Export to JSON',()=>new Playlist().convert())
window.onkeyup=shortcut
