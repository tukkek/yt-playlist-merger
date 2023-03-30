#!/usr/bin/python3
import sys,json

PLAYLISTS=sys.argv[1:-1]
OUTPUT=sys.argv[-1]
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
    
    <script src='./view.js'></script>
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
print(HTML.format(title,'<br>'.join(HEADERS),''.join(VIDEOS)),file=open(OUTPUT,'w'))
