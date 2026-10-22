import fs from 'node:fs'
import vm from 'node:vm'
import crypto from 'node:crypto'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
if (!process.argv[2]) throw Error('Usage: node scripts/check-presentation.mjs /path/to/say-show-script.md')
const script=fs.readFileSync(process.argv[2],'utf8').split('## Current revision checks')[0]
const deck=fs.readFileSync(root+'/slides.md','utf8')
const headers=[...deck.matchAll(/^---\n[\s\S]*?\n---\n/gm)]
const slides=headers.map((h,i)=>deck.slice(h.index+h[0].length,headers[i+1]?.index))
if(slides.length!==34)throw Error('Expected 34 slides')
const cues=[...script.matchAll(/^What I (show|say): Slide (\d+)[^\n]*/gm)]
let last=0
for(const [,type,n]of cues){if(+n<last||+n>slides.length)throw Error('Invalid script sequence '+n);last=+n}
for(let i=1;i<=slides.length;i++)if(!cues.some(c=>+c[2]===i))throw Error('Unscripted slide '+i)
for(const stage of [1,2,3,4,5]){
 const summary=slides.find(s=>s.includes('# Stage '+stage+' summary'))
 for(const label of ['Assumption','Question','Static inspection','Runtime evidence','Claim','Still open'])if(!summary.includes('<dt>'+label+'</dt>'))throw Error('Missing summary field '+stage+'/'+label)
}
const helper=fs.readFileSync(root+'/components/replAccountViews.js','utf8').replace(/^import .*\n/gm,'').replace(/export /g,'')
const component=fs.readFileSync(root+'/components/MockRepl.vue','utf8').split('<script setup>')[1].split('</script>')[0].replace(/^import .*\n/gm,'')
function context(stage,startInside=false){
 const ctx=vm.createContext({accountData:JSON.parse(fs.readFileSync(root+'/data/experiment-accounts.json','utf8')),structuralPlan:JSON.parse(fs.readFileSync(root+'/data/structural-plan.json','utf8')),defineProps:()=>({stage,startInside}),ref:value=>({value}),computed:fn=>({get value(){return fn()}}),watch:()=>{},nextTick:async()=>{},performance,window:{setTimeout:fn=>fn()}})
 vm.runInContext(helper+'\n'+component,ctx);return ctx
}
const get=(ctx,code)=>vm.runInContext(code,ctx)
const submit=async(ctx,cmd)=>{await get(ctx,`submit(${JSON.stringify(cmd)})`);return get(ctx,'entries.value.at(-1).output')}
const stageSlides={15:[1,false],18:[1,true],21:[2,false],24:[3,false],27:[4,false],30:[5,false]}
const contexts={};let current=0,checked=0
const lines=script.split('\n')
for(let i=0;i<lines.length;i++){
 const heading=lines[i].match(/^What I (?:show|say): Slide (\d+)/);if(heading)current=+heading[1]
 if(lines[i]!=='```text'||!stageSlides[current])continue
 const code=[];for(i++;i<lines.length&&lines[i]!=='```';i++)code.push(lines[i])
 const m=code[0]?.match(/^(topi(?:\[[^\]]+\])?>|❯) (.*)$/)
 if(!m)continue
 const ctx=contexts[current]??=context(...stageSlides[current])
 const actualPrompt=get(ctx,'promptPrefix.value')
 if(actualPrompt!==m[1])throw Error(`Prompt mismatch slide ${current}: ${actualPrompt} / ${m[1]}`)
 const actual=await submit(ctx,m[2]);const expected=code.slice(1).join('\n')
 if(actual!==expected)throw Error(`Output mismatch slide ${current}, ${m[2]}\nEXPECTED ${expected}\nACTUAL ${actual}`)
 checked++
}
const ctx=context(2)
await submit(ctx,'select structural_summary')
if(get(ctx,'selectedExperiment.value')!=='structural_substrate')throw Error('Alias failed')
const structure=await submit(ctx,'explain')
if(structure.includes('OBSERVED')||!structure.includes('runtime observations: not collected'))throw Error('Structure leaked runtime evidence')
const rejected=await submit(ctx,'run structural_substrate')
if(!rejected.includes('configuration only'))throw Error('Unexpected structural run')
for(const [slide,ctx]of Object.entries(contexts)){
 get(ctx,'reset()')
 if(get(ctx,'Object.keys(completedRuns.value).length')!==0)throw Error('Reset failed '+slide)
}
const runtime=context(3)
await submit(runtime,'select runtime_surface');await submit(runtime,'run');await submit(runtime,'select timing_follow_up')
if(!(await submit(runtime,'explain')).includes('runtime: not_run'))throw Error('Follow-up inherited result')
await submit(runtime,'run');if(!(await submit(runtime,'explain')).includes('12.7 s'))throw Error('Follow-up result absent')
const plan=JSON.parse(fs.readFileSync(root+'/data/structural-plan.json','utf8'))
for(const source of Object.values(plan.sources)){
 const bytes=fs.readFileSync(root+'/'+source.excerpt)
 if(crypto.createHash('sha256').update(bytes).digest('hex')!==source.sha256)throw Error('Source hash mismatch')
}
console.log(JSON.stringify({slides:slides.length,scriptCues:cues.length,scriptedCommands:checked,summaries:5,checks:['exact prompts and outputs','pre-run structure without observations','compatibility alias','structural run guard','reset','independent follow-up state','structural source hashes']}))
