

function subnetxy(network, numOFhost){


    let objOut = {}

    objOut['subnet'] = network

    let listOctets = network.split('.')

    let octet1 = parseInt(listOctets[0])
    let octet2 = parseInt(listOctets[1])
    let octet3 = parseInt(listOctets[2])
    let octet4 = parseInt(listOctets[3])

    let fisrtAddress , lastAddress, gateWay;


    for(let host = 0; host < numOFhost; host++){

        if(octet4 >= 255){

            octet4 = 0;
            octet3 += 1

        }else if(octet3 >= 255){

            octet4 = 0
            octet3 = 0
            octet2 += 1

        }else if(octet2 >= 255){

            octet4 = 0
            octet3 = 0
            octet2 = 0
            octet1 += 1

        }else{

            octet4 += 1;

        }

        if(host == 0){

            fisrtAddress = octet1 + "." +  octet2 + "." + octet3 + "." + octet4;
            
        }else if(host == numOFhost - 3){

            lastAddress = octet1 + "." +  octet2 + "." + octet3 + "." + octet4;

        }else if(host == numOFhost - 2){

            diffusion = octet1 + "." +  octet2 + "." + octet3 + "." + octet4;

        }

    }


    let networkOut = octet1 + "." +  octet2 + "." + octet3 + "." + octet4;

    objOut['nextSubnet'] = networkOut
    objOut['last'] = lastAddress
    objOut['first'] = fisrtAddress
    objOut['diffusion'] = diffusion

    return objOut

}


function getMaxNumOfHosts(numHosts){

    let strHostBinary = new str(numHosts).toBinary()

    let numBits = strHostBinary.length

    let maxHostsNum = Math.pow(2, numBits)

    return maxHostsNum

}


let obj_G_data = {}

function globalKey(hosts, hostID){

    let key = ""

    if(hostID > 1){
        // case "2 (5)": 120.0.2.3

        key = hosts + "("+hostID+")"



    }else{

        // case "2": 120.0.2.1
        key = hosts

    }

    return key

}


function getIPsForhosts(currentSubnet, mask, numHosts, numHoststoConfig){


    let objOut = {}

    let numDupliHosts = checkDuplicateHosts(numHosts);

    let key = globalKey(numHosts, numDupliHosts)

    obj_G_data[key] = currentSubnet


    objOut['hosts'] = numHosts

    objOut['id'] = numDupliHosts

    objOut['subnet'] = currentSubnet

    let listOctets = currentSubnet.split('.')

    let octet1 = parseInt(listOctets[0])
    let octet2 = parseInt(listOctets[1])
    let octet3 = parseInt(listOctets[2])
    let octet4 = parseInt(listOctets[3])

    let fisrtAddress , lastAddress, diffusion;

    let machineNum = 0

    let maxHostsNum = getMaxNumOfHosts(numHosts)

    for(let host = 0; host < maxHostsNum; host++){

        if(octet4 >= 255){

            octet4 = 0;
            octet3 += 1

        }else if(octet3 >= 255){

            octet4 = 0
            octet3 = 0
            octet2 += 1

        }else if(octet2 >= 255){

            octet4 = 0
            octet3 = 0
            octet2 = 0
            octet1 += 1

        }else{

            octet4 += 1;

        }

        let ipAddress = octet1 + "." +  octet2 + "." + octet3 + "." + octet4;

        let lastHostIndex = maxHostsNum - 1

        if(host == 0){

            fisrtAddress = ipAddress

            objOut['mask'] = toExtendedMask(mask)

            objOut['gateway'] = ipAddress
            
        }else if(host == lastHostIndex){

            diffusion = ipAddress

        }else{

            if(machineNum < numHoststoConfig){

                objOut['host' + machineNum] = ipAddress

                objOut['mask'] = toExtendedMask(mask)

                machineNum++;

            }else{

                break;

            }

        }

    }

    return objOut

}


function display2HostsConfig(objHostsConfig){

    let script  = '<table border="2" bordercolor="red">'

    script +=    '<tr>'
    script +=         '<th colspan="5" ><center>subnet '+ objHostsConfig.subnet 

    if(objHostsConfig.id > 1){

        script +=  ' ('+objHostsConfig.id+')'
        
    }

    script +=         '</center></th>'

    script +=     '</tr>'

    script +=         '<tr> <th>Hosts</th>    <td>' +  objHostsConfig.hosts   + '</td></tr>'

    script +=         '<tr> <th>Mask</th>    <td>' + objHostsConfig.mask     + '</td></tr>'

    // gateway in this case if the fist host
    script +=         '<tr> <th>Host 1</th> <td>' + objHostsConfig.gateway  + '</td></tr>'
    // cause usually, the use of two host is for communication between two WAN's


    for(let key in objHostsConfig){

        let ipAddress = objHostsConfig[key]

        if(key !="hosts"){

            if(key.includes('host') && ipAddress != objHostsConfig.subnet){

                let numIPaddress = parseInt(key.split('host')[1]) + 1

                numIPaddress += 1; // skipping fist address

                if(numIPaddress != 3){

                    script +=    '<tr>'

                    script +=         '<th>Host '+numIPaddress+'</th>'
                    script +=         '<td>'+ objHostsConfig[key] +'</td>'
                    script +=    '</tr>'
        
                }else{

                    script +=    '<tr>'

                    script +=         '<th>Broadcast </th>'
                    script +=         '<td>'+ objHostsConfig[key] +'</td>'
                    script +=    '</tr>'
        
                }

            }
        
        }

    }
    
    script += '</table><br>'

    return script
}


function displayMachineConfig(configDiv, objHostsConfig){

    if(objHostsConfig){

        let script;

        if(objHostsConfig.hosts > 2){

            script  = '<table border="2" bordercolor="red">'

            script +=    '<tr>'
            script +=         '<th colspan="5" ><center>subnet '+ objHostsConfig.subnet 
          
            if(objHostsConfig.id > 1){

                script +=  ' ('+objHostsConfig.id+')'
                
            }

            script +=         '</center></th>'

            script +=     '</tr>'

            script +=         '<tr> <th>Hosts</th>    <td>' +  objHostsConfig.hosts   + '</td></tr>'

            script +=         '<tr> <th>Mask</th>    <td>' + objHostsConfig.mask     + '</td></tr>'

            script +=         '<tr> <th>Gateway</th> <td>' + objHostsConfig.gateway  + '</td></tr>'
            // script +=         '<tr> <th>Bits</th>    <td>' + objHostsConfig.bits     + '</td></tr>'

            for(let key in objHostsConfig){

                let ipAddress = objHostsConfig[key]

                if(key !="hosts"){

                    if(key.includes('host') && ipAddress != objHostsConfig.subnet){

                        let numIPaddress = parseInt(key.split('host')[1]) + 1
    
                        script +=    '<tr>'
    
                        script +=         '<th>Host '+numIPaddress+'</th>'
                        script +=         '<td>'+ objHostsConfig[key] +'</td>'
                        script +=    '</tr>'
                    }

                }

            }
            
            script += '</table><br>'

        }else{

            script =  display2HostsConfig(objHostsConfig)

        }

        
        configDiv.innerHTML += script


    }

   

}


function wanSerialCmds(gateway, mask, SerialNum, fisrtCofig){

    let serialCmd = ""

    if(fisrtCofig){

        serialCmd    += "enable <br>"
        serialCmd    +=  "configure terminal <br>"

    }

    serialCmd    += "interface Serial"+parseInt(SerialNum)+"/0 <br>"

    serialCmd    += "no ip address<br>"

    serialCmd    += "ip address "+ gateway
    serialCmd    += " " 
    serialCmd    += mask
    serialCmd    += "<br>"

    serialCmd    += "no shutdown"

    return serialCmd

}


function display2HostsCmds(objHostsConfig){

    let cmdCounter = 1;

    let script;

    script = '<table border="2" bordercolor="red">'

    script +=    '<tr>'

    script +=         '<th colspan="2" ><center>subnet '+ objHostsConfig.subnet +' </center></th>'

    script +=     '</tr>'

    for(let key in objHostsConfig){

        let gateway2 = objHostsConfig[key]

        if(key !="hosts"){

            if(key.includes('host') && gateway2 != objHostsConfig.subnet){

                //enable
                //configure terminal
                //interface Serial2/0
                //no ip address
                //ip address 12.0.0.1 255.0.0.0
                //no shutdown

                // cmd formula = "ip address <default gateway> <subnet mask>"

                let gateway1 = objHostsConfig.gateway
                let mask = objHostsConfig.mask
                let SerialNum1 = 2
                let fisrtCofig = true

                let wanCmd1 = wanSerialCmds(gateway1, mask, SerialNum1, fisrtCofig)

                let SerialNum2 = 2

                let wanCmd2 = wanSerialCmds(gateway2, mask, SerialNum2, !fisrtCofig)

                script +=    '<tr>'
                script +=         '<th>Wan ' + cmdCounter + '</th>'
                script +=         '<td>'+ wanCmd1 +'</td>'
                script +=    '</tr>'

                cmdCounter++;

                script +=    '<tr>'
                script +=         '<th>Wan ' + cmdCounter + '</th>'
                script +=         '<td>'+ wanCmd2 +'</td>'
                script +=    '</tr>'

                break;

            }

        }


    }

            
    script += '</table><br>'

    return script;
}


function displayMachineCmds(objHostsConfig){

    if(objHostsConfig){

        let script;

        if(objHostsConfig.hosts > 2){

            let cmdCounter = 1;

            script = '<table border="2" bordercolor="red">'

            script +=    '<tr>'

            script +=         '<th colspan="2" ><center>subnet '+ objHostsConfig.subnet +' </center></th>'

            script +=     '</tr>'

            for(let key in objHostsConfig){

                let ipAddress = objHostsConfig[key]

                if(key !="hosts"){

                    if(key.includes('host') && ipAddress != objHostsConfig.subnet){

                        // cmd formula = "ipconfig <IPv4 address> <subnet mask> <default gateway>"

                        let cmd = "ipconfig "+ ipAddress
                        cmd    += " " 
                        cmd    += objHostsConfig.mask
                        cmd    += " " 
                        cmd    += objHostsConfig.gateway 

                        script +=    '<tr>'
                        script +=         '<th>M ' + cmdCounter + '</th>'
                        script +=         '<td>'+ cmd +'</td>'
                        script +=    '</tr>'

                        cmdCounter++;

                    }

                    }

  
            }

            
            script += '</table><br>'


        }else{

            script =  display2HostsCmds(objHostsConfig)

        }

       

        vlsmCMDSdiv.innerHTML += script

    }

}


function displayVlsm(cmdDiv, numHosts, subnetMask, subnetObj){

    let currentSubnet = subnetObj.subnet

    let fisrtAddress = subnetObj.first

    let lastAddress = subnetObj.last

    let diffusion = subnetObj.diffusion

    let bits = subnetObj.bits



    let script = '<table border="5" bordercolor="red">'

    script +=    '<tr>'
    script +=         '<th colspan="2"> <center> Subnet '+ currentSubnet + '</center> </th>'
    script +=     '</tr>'

    script +=    '<tr>'
    script +=         '<th>Hosts</th> <td>'+ numHosts +' </td>'
    script +=     '</tr>'

    script +=    '<tr>'
    script +=         '<th>Bits</th>  <td>'+ bits +'</td>'
    script +=     '</tr>'

    script +=    '<tr>'
    script +=         '<th>Mask</th>  <td>'+ subnetMask +'</td>'
    script +=     '</tr>'

    script +=    '<tr>'
    script +=         '<th>Fisrt Address</th> <td>'+ fisrtAddress +'</td>'
    script +=     '</tr>'

    script +=    '<tr>'
    script +=         '<th>Last Address</th> <td>'+ lastAddress +'</td>'
    script +=     '</tr>'

    script +=    '<tr>'
    script +=         '<th>Broadcast</th> <td>'+ diffusion +'</td>'
    script +=     '</tr>'
    
    script += '</table><br>'

    cmdDiv.innerHTML += script

}


function vlsm(network, orderedListHosts, targetHost, hostsID, numHoststoConfig, debug=0){

    vlsmDiv.innerHTML += " VLSM <br><br>"

    configDiv.innerHTML += 'Machines config <br><br>'
    
    vlsmCMDSdiv.innerHTML += "Machines Commands <br><br>"

    let subnetOut = {}

    let key = 0;

    let nextNetwork = network

    for(let numHosts of orderedListHosts) {

        numHosts = parseInt(numHosts);

        let totalNumHosts = adaptableNumOfHosts(numHosts)

        if(totalNumHosts >= numHosts){

            // the chosen hosts subnet in binary
            let strHostBinary = new str(numHosts).toBinary()

            let numBits = strHostBinary.length

            let subnetMask = 32 - numBits

            let maxHostsNum = Math.pow(2, numBits)

            let subnetObj = subnetxy(nextNetwork, maxHostsNum)

            nextNetwork = subnetObj.nextSubnet

            subnetObj['bits'] = numBits

            let currentSubnet = subnetObj.subnet

            let objHostsConfig = getIPsForhosts(currentSubnet, subnetMask, numHosts, numHoststoConfig)

            if("subnet" in objHostsConfig){

                let localHostsID = objHostsConfig.id


                if(targetHost){


                    if(parseInt(objHostsConfig.hosts) == parseInt(targetHost)){

              

                        if(localHostsID == hostsID){

                            displayMachineConfig(configDiv, objHostsConfig)

                            displayMachineCmds(objHostsConfig)

                        }

                    }

                }else{

                    displayMachineConfig(configDiv, objHostsConfig)

                    displayMachineCmds(objHostsConfig)

                }


            }

            let localHostsID = objHostsConfig.id

            subnetOut[numHosts +'.'+ key] = [subnetMask, currentSubnet, localHostsID]

            if(!targetHost){

                // will display all networks

                displayVlsm(vlsmDiv, numHosts, subnetMask, subnetObj)

            }else if(parseInt(numHosts) == parseInt(targetHost)){

                // will display one single network
                displayVlsm(vlsmDiv, numHosts, subnetMask, subnetObj)

            }

            currentSubnet = nextNetwork

            key++;

        }else{

            console.log('not enough space for these hosts')

        }

    }

    vlsmDiv.innerHTML += "<br>"

    return subnetOut

}


let oldMask = undefined

function displayMasks(masksDiv, subnet, mask, maskInDecimal, revMask){


    if(oldMask != mask){

        let script = '<table border="5" bordercolor="red">'

            script +=    '<tr>'
            script +=         '<th colspan="2" ><center>Subnet '+ subnet +' </center></th>'
            script +=     '</tr>'

            script +=    '<tr>'
            script +=         '<th>Mask</th>' +'<td>'+ mask +'</td>'
            script +=     '</tr>'

            script +=    '<tr>'
            script +=         '<th>Ext Mask</th>' +  '<td>'+maskInDecimal+'</td>'
            script +=     '</tr>'
            
            script +=    '<tr>'
            script +=         '<th>Rev Mask</th>' +  '<td>' + revMask  + '</td>'
            script +=     '</tr>'
            

                
            
            script += '</table>'

        // masksDiv.innerHTML += '<br>'

        // masksDiv.innerHTML += "Subnet: " + subnet + '<br><br>' 

        // masksDiv.innerHTML += "Mask: "   +  mask + '<br>'  

        // masksDiv.innerHTML += "Ext Mask: " + maskInDecimal + '<br>' 

        // masksDiv.innerHTML += "Rev Mask: " + revMask + '<br>' 

        masksDiv.innerHTML += script

        masksDiv.innerHTML += '<br>'

        oldMask = mask

    }

    

}


function displayOSPF(ospfDiv, numHosts, subnet, revMask, hostsID = 0){


    let script = '<table border="5" bordercolor="red">'

    script +=    '<tr>'


    if(hostsID > 1){

        script +=         '<th colspan="2"><center>subnet '+subnet+' ('+hostsID+')</center></th>'

    }else{

        script +=         '<th colspan="2"><center>subnet '+subnet+' </center></th>'
    }
  
    script +=     '</tr>'

    script +=    '<tr>'
    script +=         '<th >hosts</th> <td>'+numHosts+'</td>'
    script +=     '</tr>'


    script +=    '<tr>'
    script +=         '<th>CMD 1</th>'

    script +=  '<td>'

    script += 'router ospf 1 <br> network ' + subnet  + " " + revMask + ' area 0</td> </td>'
  
    script +=     '</tr>'
       
    
    script += '</table><br>'

    ospfDiv.innerHTML += script



}


function filterListHosts(listHosts){

    let listOut = []

    for(let hosts of listHosts){

        if(parseInt(hosts) >= 2){

            listOut.push(hosts)
        }
        
    }

    return listOut


}


function ospf(network, mask, listHosts, targetHost, hostsID,  numHoststoConfig = 0) {

    oldMask = undefined

    listDisplayedMasks = []

    let subnetObj;

    listHosts = filterListHosts(listHosts)

    let orderedListHosts = listHosts.sort((a, b) =>  b - a);

    subnetObj = vlsm(network, orderedListHosts, targetHost, hostsID, numHoststoConfig)

    if(subnetObj){

        ospfDiv.innerHTML += 'OSPF Commands <br><br>'

        masksDiv.innerHTML += 'Mask <br><br>'

        for(let key in subnetObj){

            let numHosts = key.split('.')[0]

            let listLocalSub = subnetObj[key]

            let mask = listLocalSub[0]

            let subnet = listLocalSub[1]

            let subnetHostsID = listLocalSub[2]


            let maskInDecimal = toExtendedMask(mask)

            let revMask = revGenericMask(maskInDecimal)

            if(targetHost){

                if(parseInt(numHosts) != parseInt(targetHost) || parseInt(hostsID) != subnetHostsID){

                    // display mask and ospf commands of other networks
                    // not the current one

                    displayOSPF(ospfDiv, numHosts, subnet, revMask, subnetHostsID)

                }

            }else{

                displayOSPF(ospfDiv, numHosts, subnet, revMask)

            }

            displayMasks(masksDiv, subnet, mask, maskInDecimal, revMask)

        }

    }

    // ospfDiv.innerHTML += 'OSPF DONE'


}



