#!/usr/bin/python3
import sys,json

PLAYLISTS=sys.argv[1:-1]
OUTPUT=sys.argv[-1]
SCRIPT='''
  let CONTAINER=document.querySelector('#videos')
  let VIDEOS=Array.from(CONTAINER.querySelectorAll('div'))
  let FROM=document.querySelector('#from')
  let TO=document.querySelector('#to')
  
  function roll(min,max){return Math.floor(Math.random()*(max-min+1))+min}

  function shuffle(array){
    for(let i=0;i<array.length;i++){
      let j=roll(i,array.length-1)
      let a=array[i]
      let b=array[j]
      array[i]=b
      array[j]=a
    }
    return array
  }
  
  function filter(){
    shuffle(VIDEOS)
    for(let v of VIDEOS) v.remove()
    for(let v of VIDEOS){
      let m=parseInt(v.getAttribute('minutes'))
      if(FROM.value<=m&&m<=TO.value) CONTAINER.appendChild(v)
    }
  }
  
  filter()
'''
HTML='''
  <html>
    <title>{}</title>
    
    Playlists:
    <div id='playlists'>{}</div>
    <br>
    <div>
      Between <input type='number' size='5' value='0' onchange='filter()' id='from'>
      and <input type='number' size='5' value='9000' onchange='filter()' id='to'> minutes.
    </div>
    <br>
    <div id='videos'>{}</div>
    
    <script>{}</script>
  </html>
'''
HEADERS=[]
VIDEOS=[]

if len(PLAYLISTS)==0 or '.html' not in OUTPUT:
  print('Usage: playlist.json [playlist.json ...] output.html')
  sys.exit(1)
  
for p in PLAYLISTS:
  p=json.load(open(p))
  HEADERS.append(f"- <a href='{p['url']}' target='_blank'>{p['channel']}:   {p['name']} (exported {p['date']})</a>")
  for v in p['videos']:
    d=[int(d) for d in v['duration'].split(':')]
    m=round(d[-1]/60)
    if len(d)>=2:
      m+=d[-2]
    if len(d)>=3:
      m+=d[-3]*60
    VIDEOS.append(f"<div minutes='{m}'><a target='_blank' href={v['url']}>{v['name']} ({v['duration']})</a></div>")
                      
title=OUTPUT[0:OUTPUT.index('.html')]
print(HTML.format(title,'<br>'.join(HEADERS),''.join(VIDEOS),SCRIPT),file=open(OUTPUT,'w'))
