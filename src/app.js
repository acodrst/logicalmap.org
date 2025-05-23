import { model_to_dots } from "text-model-dot";
import { gsdot_svg } from "gsdot-svg"
import { saveAs } from 'file-saver'
document.body.insertAdjacentHTML("beforeend", site.page);
const style = document.createElement("style");
style.textContent = site.css;
document.head.appendChild(style);
document.getElementById("export").addEventListener("click", () => {
  const save_name = prompt("Enter the file name for the graph stack format text export. This will save to your browser's download folder.","gs_full.txt")
  let blob = new Blob([localStorage.getItem('gs_map')], {
    type: "text/plain;charset=utf-8"
  })
  if (!(save_name===null)) saveAs(blob, save_name)
})
document.getElementById("import").addEventListener("click", (e) => { document.getElementById("file").click() })
document.getElementById("file").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    localStorage.clear();
    localStorage.setItem('gs_map', reader.result);
    localStorage.setItem('gs_level', 'Top');
    update_levels('map');
  };
  reader.readAsText(file);
})
const gs_ta = document.getElementById("gs_txt")
if (localStorage.getItem('gs_map') === null) localStorage.setItem('gs_map', site.model)
if (localStorage.getItem('gs_level') === null)
  localStorage.setItem('gs_level', globalThis.location.hash.substring(1))
function update_levels(kind) {
  const level = localStorage.getItem('gs_level') || 'Top'
  globalThis.location = `#${level}`
  let new_gs_map = ''
  let levs=model_to_dots(localStorage.getItem('gs_map'),false)
  for (let i in levs){
    if (localStorage.getItem(`gs_map_${i}`) === null && i!="obj_set") {
      localStorage.setItem(`gs_map_${i}`,levs[i].lines.join('\n').trim())
      localStorage.setItem(`gs_map_${i}_label`, levs[i].level.join('\n'))
    }
    new_gs_map += ':: level\n'+localStorage.getItem(`gs_map_${i}_label`)+'\n'+localStorage.getItem(`gs_map_${i}`)+'\n'
  }
  localStorage.setItem('gs_map', new_gs_map)
  gs_ta.value = localStorage.getItem(`gs_map_${level}`)
  levs= model_to_dots(localStorage.getItem('gs_map'),true,null)
  gsdot_svg(levs[level].dots, 'default', kind,level,levs).then(svg=>localStorage.setItem('svg_content',svg))
}
document.getElementById("save").addEventListener("click", (e) => {
  if (document.getElementById("map").style.display == 'block'|| document.getElementById("key").style.display == ''){
    const save_name = prompt("Enter the file name for saving the map in SVG format. This will save to your browser's download folder.","logical_map.svg")
    const blob_content = new Blob([localStorage.getItem('svg_content')], {
      type: "text/plain;charset=utf-8"
    })
    if (!(save_name===null)) saveAs(blob_content, save_name)
  }
  if (document.getElementById("key").style.display == 'block'){
    const head=`<!DOCTYPE html><html lang="en"><head><style>table{ border: 2px solid; border-collapse: collapse;}
td{border: 2px solid; padding:7px;font-family: monospace;font-size:20px;}</style><title>Logical Map Key</title></head>`
    const save_name = prompt("Enter the file name for saving the key in HTML format. This will save to your browser's download folder.","logical_map_key.html")
    const blob_content = new Blob([`${head}\n${document.getElementById("key").innerHTML}</html>`], {
      type: "text/plain;charset=utf-8"
    })
    if (!(save_name===null)) saveAs(blob_content, save_name)
  }
})
if (globalThis.innerWidth < 800) {
document.body.innerHTML =
`<div style="color:#ee3377;font-size:22px;font-weight:800;">Your web browser won't work<br>with this website.</div> 
<p>It requires a browser with a view of at<br>least 800 pixels wide.  My apologies.
<div style="color:#ee7733;">All is not lost, though.</div>
<p>You can still view the <i><b><a href="https://adaptiveanalysis.org" title="Logical Map How-to Guide">Logical Map How-to Guide</a></b></i>.
<p>If you are using a desktop browser, then<br>expand your browser view and refresh.`;
} else update_levels('map')
globalThis.addEventListener("hashchange", () => {
  localStorage.setItem('gs_level', globalThis.location.hash.substring(1))
      update_levels('map')
});
document.getElementById("key_nav").addEventListener("click", () => {
    document.getElementById("key").style.display = 'block'
    document.getElementById("terms").style.display = 'none'
    document.getElementById("map").style.display = 'none'
    update_levels('key')
})
document.getElementById("home_nav").addEventListener("click", () => {
    document.getElementById("key").style.display = 'none'
    document.getElementById("terms").style.display = 'none'
    document.getElementById("map").style.display = 'block'
    update_levels('map')
})
document.getElementById("terms_nav").addEventListener("click", () => {
    document.getElementById("key").style.display = 'none'
    document.getElementById("terms").style.display = 'block'
    document.getElementById("map").style.display = 'none'
})
gs.addEventListener("input", (e) => {
  if (e.data){
    if (e.data.includes("`")){
      const ss=e.target.selectionStart
      gs_ta.value=gs_ta.value.slice(0,ss-1)+ gs_ta.value.slice(ss)
      e.target.selectionEnd=ss-1
      localStorage.setItem(`gs_map_${localStorage.getItem('gs_level')}`, gs_ta.value)
      update_levels('map')
    }
    else{
      localStorage.setItem(`gs_map_${localStorage.getItem('gs_level')}`, gs_ta.value)
    }
  }
});