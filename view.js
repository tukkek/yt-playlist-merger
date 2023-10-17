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

//filter duplicates with higher chance of first instance showing earlier
function distinguish(array){
  let m=new Map()
  for(let v of VIDEOS){
    let t=v.textContent
    if(!m.get(t)) m.set(t,v)
  }
  return Array.from(m.values())
}

function filter(){
  shuffle(VIDEOS)
  for(let v of VIDEOS) v.remove()
  for(let v of distinguish(VIDEOS)){
    let t=v.textContent
    let m=parseFloat(v.getAttribute('hours'))
    if(FROM.value<=m&&m<=TO.value) CONTAINER.appendChild(v)
  }
}

filter()
