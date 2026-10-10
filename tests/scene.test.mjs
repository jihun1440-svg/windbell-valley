import test from 'node:test';
import assert from 'node:assert/strict';
import {nodes,edges,route,nearestNode,onPath,loopPosition,WORLD} from '../scene-core.mjs';
test('every village destination is reachable without jumping over a river',()=>{for(let start=0;start<nodes.length;start++)for(let end=0;end<nodes.length;end++){const r=route(start,end);assert.equal(r[0],start);assert.equal(r.at(-1),end);for(let i=1;i<r.length;i++)assert.ok(edges.some(([a,b])=>a===r[i-1]&&b===r[i]||b===r[i-1]&&a===r[i]))}});
test('NPC route stays within scene and returns continuously at loop boundary',()=>{const ids=[9,10,11,12,13,12,11,10,9];for(let s=0;s<1000;s++){const p=loopPosition(ids,s/10);assert.ok(p.x>=0&&p.x<=WORLD.width&&p.y>=0&&p.y<=WORLD.height);assert.ok(onPath([p.x,p.y]).distance<.001)}const p=loopPosition(ids,-.0001),q=loopPosition(ids,.0001);assert.ok(Math.hypot(p.x-q.x,p.y-q.y)<.01)});
test('click destinations project onto nearest walkable graph node',()=>{nodes.forEach((p,i)=>assert.equal(nearestNode(p),i));assert.equal(onPath([0,0]).distance>50,true);assert.equal(onPath(nodes[10]).distance,0)});
