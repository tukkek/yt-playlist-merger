#!/usr/bin/python3
import sys,json,math

PLAYLISTS=sys.argv[1:-1]
OUTPUT=sys.argv[-1]
HTML='''
  <html>
    <title>{}</title>
    
    <div>
      Between <input type='number' size='5' value='1' onchange='filter()' id='from'>
      and <input type='number' size='5' value='3' onchange='filter()' id='to'> hours.
    </div>
    <br>
    <div id='videos'>{}</div>

    <h1>Playlists</h1>
    <div>{}</div>
    
    <script src='./view.js'></script>
  </html>
'''
HEADERS=[]
VIDEOS=[]

if len(PLAYLISTS)==0 or '.html' not in OUTPUT:
  print('Usage: playlist.json [playlist.json ...] output.html')
  sys.exit(1)
  
for p in PLAYLISTS:
  try:
    p=json.load(open(p))
  except Exception as e:
    print(e)
    raise Exception(f'Error loading {p}')
  HEADERS.append(f"- <a href='{p['url']}' target='_blank'>{p['channel']}:   {p['name']} (exported {p['date']})</a>")
  for v in p['videos']:
    d=[int(d) for d in v['duration'].split(':')]
    minutes=math.floor(d[-1]/60)
    if len(d)>=2:
      minutes+=d[-2]
    if len(d)>=3:
      minutes+=d[-3]*60
    hours=math.floor(minutes/60)
    c=v['channel']
    u=v['url']
    n=v['name']
    VIDEOS.append(f"<div hours='{hours}'>{c} <a target='_blank' href={u}>{n} ({v['duration']})</a></div>")
                      
title=OUTPUT[0:OUTPUT.index('.html')]
print(HTML.format(title,''.join(VIDEOS),'<br>'.join(HEADERS)),file=open(OUTPUT,'w'))
