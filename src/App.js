import React, { useState } from 'react';
import './App.css';

/* eslint no-eval: 0 */

const axios = require('axios');
const https = require('https');

let constraintUp = {
  maxHeight:window.innerHeight*0.95,
  minHeight:window.innerHeight*0.95,
  maxWidth:window.innerWidth,
  minWidth:window.innerWidth,
}

let constraintDown = {
  maxHeight:window.innerHeight*0.05,
  minHeight:window.innerHeight*0.05,
  maxWidth:window.innerWidth,
  minWidth:window.innerWidth,
}

function App() {
  const [command,setCommand] = useState("")
  return (
    <div className="App">
      <div className="Upper" style={constraintUp}>
        <div id="output">
          <section id="inactiveOutput">
          </section>

          <div id="activeLine">
            <p>
              SABT >_
            </p>
            
            <input placeholder="Enter a command here" className="commandInput" spellcheck="false" value={command} onChange={
              e=>{
                setCommand(e.target.value)
              }
            } onKeyDown={
              e=>{            
                if (e.key === 'Enter') {
                  let inactiveLine = document.createElement("div");
                  inactiveLine.setAttribute("class","inactiveLine");
                  inactiveLine.innerHTML="<p>SABT >_ <spam class=\"commandInputText\">"+command+"</spam></p>";
                  let commands = command.split(" ")
                  getResult(commands[0],commands.slice(1,commands.length))
                  .then(result => {
                    let commandOutput = document.createElement("span");
                    commandOutput.setAttribute("class","commandOutput");
                    commandOutput.innerHTML = result;
                    document.getElementById("inactiveOutput").appendChild(inactiveLine)
                    document.getElementById("inactiveOutput").appendChild(commandOutput)
                    let loadingDiv = document.getElementById("animation")
                    document.getElementById("output").removeChild(loadingDiv)
                    setCommand("")
                  })
                  let loadingDiv = document.createElement("div");
                  loadingDiv.setAttribute("id","animation");
                  loadingDiv.innerHTML = "<i class=\"fas fa-spinner\"></i>"
                  document.getElementById("output").appendChild(loadingDiv)
                }
              }
            }/>
          </div>
        </div>
      </div>
      <div className="Fotter" style={constraintDown}>
        SABT: Super Awesome Browser Terminal!
      </div>
    </div>
  );
}

async function getResult(command,args){
  if(command==="whoami" && (args===null || args===undefined || args==="" || args.length===0) ){
    return "SABT: Super awesome browser terminal!";
  }
  else if(command==="wget" && args!==undefined){
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    const instance = await axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
    let data
    await instance.get("https://alexcolectionapi.netlify.com/.netlify/functions/getUrl/"+args)
    .then(body=>{
      try{
        data = "<code>"+body.data.replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</code>";
      }
      catch{
        data = JSON.stringify(body.data)
      }
    })
    .catch(err=>{
      data = err;
    });
    return data;
  }
  else if(command==="myip" && (args===null || args===undefined || args==="" || args.length===0)){
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    const instance = await axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
    let data
    await instance.get("https://api.ipify.org/")
    .then(async body=>{
        data = "ipv4: "+body.data+"<br>"
        await instance.get("https://api6.ipify.org/")
        .then(body=>{
            data = data + "ipv6: "+body.data
        })
    })
    .catch(err=>{
      data = err;
    });
    return data;
  }
  else if(command.includes("calc(") && command.substr(command.length-1)===")" && (args===null || args===undefined || args==="" || args.length===0)){
    let result = (command.substr(5));
    result = result.substr(0,result.length-1)
    result = result.replace(/\^/g,'**');
    return eval(result)
  }
  else if(command==="help" && (args===null || args===undefined || args==="" || args.length===0)){
    return "Here you got all the commands with some examples:<br><br>* help<br>* whoami<br>* wget https://www.google.com<br>* myip<br>* calc(1+3+4+5/3+54^(1/2))"
  }
  else{
    return "Command not found, here are some examples:<br><br>* help<br>* whoami<br>* wget https://www.google.com<br>* myip<br>* calc(1+3+4+5/3+54^(1/2))";
  }
}

export default App;
