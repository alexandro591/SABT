import React, { useState } from 'react';
import './App.css';
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
              SABT >>
            </p>
            
            <input placeholder="Enter a command here" className="commandInput" value={command} onChange={
              e=>{
                setCommand(e.target.value)
              }
            } onKeyDown={
              e=>{            
                if (e.key === 'Enter') {
                  let inactiveLine = document.createElement("div");
                  inactiveLine.setAttribute("class","inactiveLine");
                  inactiveLine.innerHTML="\
                    <p>SABT >>\
                    <spam class=\"commandInputText\">"+command+"</spam></p>";
                  let commands = command.split(" ")
                  getResult(commands[0],commands[1,commands.length-1])
                  .then(result => {
                    let commandOutput = document.createElement("span");
                    commandOutput.setAttribute("class","commandOutput");
                    commandOutput.innerHTML = result;
                    document.getElementById("inactiveOutput").appendChild(inactiveLine)
                    document.getElementById("inactiveOutput").appendChild(commandOutput)
                    setCommand("")
                  })
                }
              }
            }/>
          </div>
        </div>
      </div>
      <div className="Fotter" style={constraintDown}>
      </div>
    </div>
  );
}

async function getResult(command,args){
  if(command==="whoami" && (args===null || args===undefined || args==="") ){
    return "SABT: Super awesome browser terminal!";
  }
  else if(command==="wget" && args!==undefined){
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
    const instance = await axios.create({
      httpsAgent: new https.Agent({  
        rejectUnauthorized: false
      })
    });
    var data
    await instance.get(args)
    .then(body=>{
      data = "<code>"+body.data.replace(/</g,"&lt;").replace(/>/g,"&gt;")+"</code>";
    })
    .catch(err=>{
      data = err;
    });
    return data;
  }
  else{
    return "Command not found";
  }
}

export default App;
