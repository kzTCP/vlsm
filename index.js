
                
let Processbtn = document.getElementById('process')

let input = document.getElementById('input')

let hostsDiv = document.getElementById('hostsArea')

let textArea = document.getElementById('hosts')

let selectHosts = document.getElementById('selectHosts')

let btnTxt = document.getElementById('text')

let networkIN = document.getElementById('network')

let maskIN = document.getElementById('mask')

let toConfig = document.getElementById('toConfig')

let hostsConfig = document.getElementById('hostsConfig')

let ospfDiv = document.getElementById('ospf')
let vlsmDiv = document.getElementById('vlsm')
let masksDiv = document.getElementById('masks')
let configDiv = document.getElementById('config')
let vlsmCMDSdiv = document.getElementById('vlsmCMDS')


vlsmDiv.style="display:none;"
vlsmCMDSdiv.style="display:none;"

ospfDiv.style="display:none;"
masksDiv.style="display:none;"
configDiv.style="display:none;"
toConfig.style="display:block;"


function examples(){

    networkIN.value = "172.16.0.0"
    
    maskIN.value = 16

    textArea.value = "1000, 100, 50, 2, 2"

    toConfig.value = 5

}

examples()


function adaptableNumOfHosts(numHosts){

    let totalNumHots = 0

    let strHostBinary = new str(numHosts).toBinary()

    do{


        if(strHostBinary.includes('0')){

            strHostBinary = strHostBinary.replace(/0/g, 1)
            
        }else{

    
            strHostBinary = strHostBinary + '1'

        }

        let maxNum = new str(strHostBinary).toDecimal()

        totalNumHots = maxNum - 2;

    }while(totalNumHots < numHosts);

    return totalNumHots

}


function bitsToOctet(numBits){

    let octetOut = ""

    let octetSize = 8

    for(let bit = 0; bit < octetSize; bit++){

        if(bit < numBits){

            octetOut += "1"

        }else{

            octetOut += "0"

        }

    }

    return octetOut

}


function validMaskList(listOctets, octetNum, bitVal = 0){

    let localListOctets = listOctets

    if(listOctets.length != octetNum){

        for(let oct = 0; oct < octetNum - listOctets.length; oct++){

            if (parseInt(bitVal) == 1){

                localListOctets.push("11111111")

            }else{

                localListOctets.push("00000000")

            }

        }

    }

    return localListOctets

}


function listBitsToMask(listOctets){

    let listLen = listOctets.length

    let maskOut = ""

    for(let index in listOctets){

        let octet = listOctets[index]


        let octetVal = new str(octet).toDecimal()

        
        if(index != listLen - 1){

            maskOut +=  octetVal + "."


        }else{


            maskOut += octetVal

        }

    }



    return maskOut

}


function maskTolistBits(mask){

    let numOctet = parseInt(mask/8)

    let listOctects = []

    for(let num = 0 ; num< numOctet; num++){

        listOctects.push("11111111")
    
    }

    let restBits = mask - (numOctet * 8)

    let lastOctet = bitsToOctet(restBits)

    listOctects.push(lastOctet)

    listOctects = validMaskList(listOctects, 4)

    return listOctects;
    
}


function toExtendedMask(mask){

    let listBits = maskTolistBits(mask)


    let subnetMask = listBitsToMask(listBits)

    return subnetMask;


}


function revMaskBits(maskInDecimal){


    let listOctetsBits = maskTolistBits(maskInDecimal)



    let revList = []

    for (let octet of listOctetsBits){

        let revOctet = ""

        for (let numbit = 0; numbit < octet.length; numbit++){

            let bit = octet[numbit];

            if(bit == "1"){

                revOctet += "0"

            }else{

                revOctet += "1"
                
            }


        }

        revList.push(revOctet)

    }



    let revSubnetMask = listBitsToMask(revList)

    return revSubnetMask

}


function revGenericMask(maskInDecimal){


    let listOctets = maskInDecimal.split('.')

    let revMask = ""

    for(let numOctet in listOctets){

        decimalOctet = listOctets[numOctet]

        let calc = 255 - parseInt(decimalOctet) 

        if(numOctet != listOctets.length - 1){

            revMask += calc + "."

        }else{

            revMask += calc

        }

    }

    return revMask

}


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

        key = hosts + "("+hostID+")"



    }else{

        key = hosts

    }

    return key

}


let oldNumHostsGIFH = undefined

function getIPsForHosts(currentSubnet, mask, numHosts, numHoststoConfig){

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

    for(let host = 0; host < maxHostsNum - 2; host++){

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

    script +=         '<tr> <th>Host 1</th> <td>' + objHostsConfig.gateway  + '</td></tr>'

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


function displayMachineConfig(objHostsConfig){

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


function wanSerialCmds(gateway, mask){

    let serialCmd = ""

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

                let gateway1 = objHostsConfig.gateway
                let mask = objHostsConfig.mask

                let wanCmd1 = wanSerialCmds(gateway1, mask)

                let wanCmd2 = wanSerialCmds(gateway2, mask)

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


            let strHostBinary = new str(numHosts).toBinary()

            let numBits = strHostBinary.length

            let subnetMask = 32 - numBits

            let maxHostsNum = Math.pow(2, numBits)

            let subnetObj = subnetxy(nextNetwork, maxHostsNum)

            nextNetwork = subnetObj.nextSubnet

            subnetObj['bits'] = numBits

            let currentSubnet = subnetObj.subnet

            let objHostsConfig = getIPsForHosts(currentSubnet, subnetMask, numHosts, numHoststoConfig)

  
            if("subnet" in objHostsConfig){

                let localHostsID = objHostsConfig.id

                if(targetHost){

                    if(parseInt(objHostsConfig.hosts) == parseInt(targetHost)){

                        if(localHostsID == hostsID){

                            displayMachineConfig(objHostsConfig)

                            displayMachineCmds(objHostsConfig)

                        }

                    }

                }else{

                    displayMachineConfig(objHostsConfig)

                    displayMachineCmds(objHostsConfig)

                }


            }

            let localHostsID = objHostsConfig.id

            subnetOut[numHosts +'.'+ key] = [subnetMask, currentSubnet, localHostsID]

            if(!targetHost){

                displayVlsm(vlsmDiv, numHosts, subnetMask, subnetObj)

            }else if(parseInt(numHosts) == parseInt(targetHost)){

                displayVlsm(vlsmDiv, numHosts, subnetMask, subnetObj)

            }

            currentSubnet = nextNetwork

            key++;

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

                    displayOSPF(ospfDiv, numHosts, subnet, revMask, subnetHostsID)

                }

            }else{

                displayOSPF(ospfDiv, numHosts, subnet, revMask)

            }

            displayMasks(masksDiv, subnet, mask, maskInDecimal, revMask)

        }

    }

}


let g_subnet = document.getElementById('g_subnet')

let g_host_IP = document.getElementById('g_host_IP')

let g_mask = document.getElementById('g_mask')

let g_gateway = document.getElementById('g_gateway')

let g_init = document.getElementById('g_init')

g_init.value = 'enable \r\nconfigure terminal \r\n'

let g_formula = document.getElementById('g_formula')

let G_radio = document.getElementsByName("radio_init")

let g_exp_formula = document.getElementById('g_exp_formula')

let G_script = document.getElementById('G_script')

let serialPort = document.getElementById('serialPort')

let g_Next_Hop = document.getElementById('g_Next_Hop')

let g_port = document.getElementById('g_port')

let myConfig = document.getElementById('myConfig')

let nextHopTr = document.getElementById('nextHopTr')

let portTr = document.getElementById('portTr')

let hostsTr = document.getElementById('hostsTr')

let maskTr = document.getElementById('maskTr')

let gatewayTr= document.getElementById('gatewayTr')


let configArea = new displayDiv(myConfig)

let nextHopArea = new displayDiv(nextHopTr)

let port = new displayDiv(portTr)

let hostsArea = new displayDiv(hostsTr)

let maskArea = new displayDiv(maskTr)

let gatewayArea = new displayDiv(gatewayTr)

nextHopArea.none()

port.none()

configArea.none()

hostsArea.tableRow()

function foundSelectedHosts(){

    let data = ""

    let options = g_subnet.childNodes

    for(let option of options){ 

        if(g_subnet.value == option.value){
            data = option.innerHTML
        }
    }

    return data
    
}


function optionScript(value, hosts = "", id=""){

    let out = ""

    if(hosts && !id){

        out = "<option value='"+value+"'>" + value +" (" + hosts + ')</option>'

    }else if(hosts && id){

        out = "<option value='"+value+"'>" + value +" (" + hosts +') '+ id +'</option>'

    }else{

        out = "<option value='"+value+"'>" + value + '</option>'
    }

    return out

}


function generateHostsIP(objectIPs, g_host){

    if(objectIPs){

        for(let key in objectIPs){

            if(key.includes('host') && key != 'hosts'){

                let hostIP =  objectIPs[key]

                let scriptHostIP =  optionScript(hostIP)

                g_host.innerHTML += scriptHostIP


            }

        }

    }

}


let objSubnets = {}

let dupNum = 1

let oldSubnetHosts = undefined

function G_process(targetHosts="", targetHostsID=""){

    console.log('targetHostsID', targetHostsID)

    g_subnet.innerHTML = ""
    g_host_IP.innerHTML = ""
    g_mask.innerHTML = ""
    g_gateway.innerHTML = ""
    G_script.innerHTML = ""
     
    configArea.block()

    let objVal = getVals()

    let network = objVal.network

    let listHosts = objVal.listHosts

    objSubnets = vlsmOnly(network, listHosts)

    let Gkey = globalKey(targetHosts, targetHostsID)

    let tar_subnet = undefined

    if(Gkey in obj_G_data){

        tar_subnet = obj_G_data[Gkey]

    }

    let oldMask = ""

    let processOneSubnet = true

    for(let subnetID in objSubnets){

        let numHosts = subnetID.split('.')[0]

        let listMaskSubnet = objSubnets[subnetID]

        let mask = listMaskSubnet[0]

        let subnet = listMaskSubnet[1]

        let scriptSubnet;

        if(targetHostsID){

            scriptSubnet =  optionScript(subnet, numHosts, targetHostsID)

        }else{

            if(oldSubnetHosts != numHosts){

                dupNum = 1;

            }else{

                dupNum += 1;

            }

            if(dupNum != 1){

                scriptSubnet =  optionScript(subnet, numHosts, String(dupNum))

            }else{

                scriptSubnet =  optionScript(subnet, numHosts)
            }

            oldSubnetHosts = numHosts

        }


        if(subnet == tar_subnet || !targetHosts){

            let numduplication = checkDuplicateHosts(numHosts)

            g_subnet.innerHTML += scriptSubnet

            if (processOneSubnet){

                let scriptMask =  optionScript(mask)

                if(mask != oldMask){

                    g_mask.innerHTML += scriptMask

                    oldMask = mask

                }

                let numHoststoConfig = toConfig.value

                let objectIPs =  getIPsForHosts(subnet, mask, numHosts, numHoststoConfig)

                let subnetGateway = objectIPs.gateway

                let scriptGateway =  optionScript(subnetGateway)

                g_gateway.innerHTML += scriptGateway

                generateHostsIP(objectIPs, g_host_IP)

                processOneSubnet = false

            }
           
        }
        
        g_Next_Hop.innerHTML += scriptSubnet  
        
    }

}


function insertInitCMD(initCMD){

    let cmd = ""

    for(let radio of G_radio){

        if(radio.checked){

            let data =  radio.value

            if(data == "yes"){

                cmd = initCMD

            }

        }
       
    }
    
    return cmd

}


function generateFormula(subnet, mask, gateway, hostIP){

    G_script.innerHTML = ""

    let formula = g_formula.value



    let listKeyWords = getBetween(formula , "{", "}")

    for(let keyWord of listKeyWords){

        if(keyWord == 'subnet'){    

            formula = formula.replace("{subnet}", subnet)

        }else if (keyWord =="gateway"){

            formula = formula.replace("{gateway}", gateway)

        }else if (keyWord =="host"){

            formula = formula.replace("{host}", hostIP)
            
        }else if (keyWord =="mask"){

            formula = formula.replace("{mask}", mask)
            
        }else if (keyWord =="rev_mask"){

            let rev_mask = revMaskBits(mask)

            formula = formula.replace("{rev_mask}", rev_mask)
            
        }else if (keyWord =="ex_mask"){

            let ex_mask = toExtendedMask(mask)

            formula = formula.replace("{ex_mask}", ex_mask)
            
        }else if (keyWord =="nextHop"){

            let nextHop = g_Next_Hop.value

            formula = formula.replace("{nextHop}", nextHop)

        }else if (keyWord =="port"){

            let portNumber = g_port.value

            formula = formula.replace("{port}", portNumber)

        }else{

           alert('unknown keyWord: ', keyWord)

        }


    }

    return formula;

}


function autoCopy(value){

    navigator.clipboard.writeText(value);

}


function G_Generate(){

    let subnet = g_subnet.value
    let mask = g_mask.value
    let gateway = g_gateway.value
    let hostIP = g_host_IP.value
    let initCMD = g_init.value

    let finalFormula = insertInitCMD(initCMD)

    let formula = generateFormula(subnet, mask, gateway, hostIP)

    finalFormula += formula

    G_script.value = finalFormula

    autoCopy(finalFormula)


}



function insertInitFormulaExp(){

    g_exp_formula.innerHTML += optionScript('PC Config')

    g_exp_formula.innerHTML += optionScript('FastEthernet')

    g_exp_formula.innerHTML += optionScript('Serial')

    g_exp_formula.innerHTML += optionScript('Static')

    g_exp_formula.innerHTML += optionScript('RIP')

    g_exp_formula.innerHTML += optionScript('OSPF')

    g_exp_formula.innerHTML += optionScript('None')

}

insertInitFormulaExp()

function getDataBetweenP(text){

    let regExp = /\(([^)]+)\)/;

    let matches = regExp.exec(text);

    return matches[1]

}


function exampleFormula(){

    nextHopArea.none()
    port.none()
    hostsArea.tableRow()
    gatewayArea.tableRow()
    maskArea.tableRow()

    G_script.value = ""

    let selectedCMD = g_exp_formula.value

    let sc = g_subnet

    let subnet_NumHosts = foundSelectedHosts()

    let numHosts = parseInt(getDataBetweenP(subnet_NumHosts))

    console.log("numHosts", numHosts)

    if(selectedCMD == "PC Config"){

        g_formula.innerHTML = "ipconfig {host} {ex_mask} {gateway}"

    }else if(selectedCMD == "Serial"){

        g_formula.innerHTML  = "interface Serial{port}\r\n"
        g_formula.innerHTML += "no shutdown\r\n"
        g_formula.innerHTML += "ip address {host} {ex_mask}"

        port.tableRow()

        if(numHosts > 2 ){

            gatewayArea.none()
            
        }else{

            gatewayArea.tableRow()

        }
  
        g_port.value = '2/0'

    }else if(selectedCMD ==  "Static"){

        g_formula.innerHTML = "ip route {subnet} {ex_mask} {nextHop}"

        nextHopArea.tableRow()
        hostsArea.none()
        gatewayArea.none()


    }else if(selectedCMD ==  "RIP"){

        g_formula.innerHTML = "router rip\r\n"
        g_formula.innerHTML += "network {subnet}"

        hostsArea.none()
        maskArea.none()
        gatewayArea.none()
        

    }else if(selectedCMD == "OSPF"){

        g_formula.innerHTML = "router ospf 1\r\n"
        g_formula.innerHTML += "network {subnet} {rev_mask} area 0"

        hostsArea.none()
        gatewayArea.none()


    }else if(selectedCMD ==  "FastEthernet"){

        g_formula.innerHTML  = "interface FastEthernet{port}\r\n"
        g_formula.innerHTML += "no shutdown\r\n"
        g_formula.innerHTML += "ip address {gateway} {ex_mask}"

        port.tableRow()
        gatewayArea.tableRow()

        g_port.value = '0/0'


    }else if(selectedCMD ==  "None"){

        g_formula.innerHTML = ""
        
        port.tableRow()
        nextHopArea.tableRow()

    }



}


function half_G_Process(selectedSubnet){

    g_host_IP.innerHTML = ""
    g_mask.innerHTML = ""
    g_gateway.innerHTML = ""
    G_script.innerHTML = ""

    let oldMask = ""

    for(let subnetID in objSubnets){

        let numHosts = subnetID.split('.')[0]

        let listMaskSubnet = objSubnets[subnetID]

        let mask = listMaskSubnet[0]

        let subnet = listMaskSubnet[1]

        if(subnet == selectedSubnet){

            let numduplication = checkDuplicateHosts(numHosts)

            let scriptMask =  optionScript(mask)

            if(mask != oldMask){

                g_mask.innerHTML += scriptMask

                oldMask = mask

            }

            let numHoststoConfig = toConfig.value

            let objectIPs =  getIPsForHosts(subnet, mask, numHosts, numHoststoConfig)

            let subnetGateway = objectIPs.gateway

            let scriptGateway =  optionScript(subnetGateway)

            g_gateway.innerHTML += scriptGateway

            generateHostsIP(objectIPs, g_host_IP)

        }
        

    }


}


function subnetChanged(){

    let selectedSubnet = g_subnet.value

    half_G_Process(selectedSubnet)

    exampleFormula()


}


function vlsmOnly(network, listHosts){

    listHosts = filterListHosts(listHosts)

    let orderedListHosts = listHosts.sort((a, b) =>  b - a);

    let subnetOut = {}

    let key = 0;

    let nextNetwork = network

    for(let numHosts of orderedListHosts) {

        numHosts = parseInt(numHosts);

        let totalNumHosts = adaptableNumOfHosts(numHosts)

        if(totalNumHosts >= numHosts){

            let strHostBinary = new str(numHosts).toBinary()

            let numBits = strHostBinary.length

            let subnetMask = 32 - numBits

            let maxHostsNum = Math.pow(2, numBits)

            let subnetObj = subnetxy(nextNetwork, maxHostsNum)

            nextNetwork = subnetObj.nextSubnet

            subnetObj['bits'] = numBits

            let currentSubnet = subnetObj.subnet

            subnetOut[numHosts +'.'+ key] = [subnetMask, currentSubnet]

            currentSubnet = nextNetwork

            key++;

        }

    }

    return subnetOut

}


function showTable(){

    configDiv.style="display:none;"
    ospfDiv.style="display:none;"
    vlsmCMDSdiv.style="display:none;"
    masksDiv.style="display:none;"
    vlsmDiv.style="display:none;"

    let listRadios = document.getElementsByName('table')

    for(let radioInput of listRadios){

        let selectedRadio = radioInput.value

        if(radioInput.checked){

            if(selectedRadio == "config"){
    
                configDiv.style="display:flex;"
    
            }else if(selectedRadio =='ospf'){
    
                ospfDiv.style="display:flex;"
    
            }else if(selectedRadio =='cmd'){
    
                vlsmCMDSdiv.style="display:flex;"
        
            }else if(selectedRadio =='mask'){
    
                masksDiv.style="display:flex;"
    
            }else if (selectedRadio == 'vlsm'){
    
                vlsmDiv.style="display:flex;"
    
            }else{
    
                configDiv.style="display:none;"
                ospfDiv.style="display:none;"
                vlsmCMDSdiv.style="display:none;"
                masksDiv.style="display:none;"
                vlsmDiv.style="display:none;"
            }
    
        }
        

    } 

}


function process(...listStrs){

    Processbtn.disabled = true

    for(let str of listStrs){

        if(parseInt(str) ){

            Processbtn.disabled = false

            break;

        }

    }

}


function saveAddHostHistoy(hostNum, objHosts, mode='save'){

    if(mode=='save'){

        for(let host = 0 ; host <hostNum; host++){

            let hostID = 'host' + host

            let hostsDiv = document.getElementById(hostID)

            if(hostsDiv){

                let hostVal = hostsDiv.value

                objHosts[hostID] = hostVal

            }

        }

    }else if (mode=='print'){

        for(let hostID in objHosts){

            let hostsDiv = document.getElementById(hostID)
            
            hostsDiv.value =  objHosts[hostID]

        }


    }

    return objHosts

}


let duplicateCounter = 1

let oldNumHosts = undefined

function checkDuplicateHosts(numHosts){

    if(oldNumHosts != numHosts){

        duplicateCounter = 1;

    }else{

        duplicateCounter++;

    }

    oldNumHosts = numHosts;

    return duplicateCounter;

}


function updateListHostsTxt(){

    selectHosts.innerHTML = ""

    let strHosts = textArea.value

    process(textArea.value, selectHosts.value)

    if(strHosts.length > 0){

        let listHosts = strHosts.split(',')

        let counter = 0

        let orderedListHosts = listHosts.sort((a, b) =>  b - a);

        for(let hosts of orderedListHosts){

            if(!isNaN(hosts)){

                hosts = parseInt(hosts)

                if(hosts){

                    let numDuplication = checkDuplicateHosts(hosts)

                    let script = "<option value='"+ counter +"'>"+hosts

                    if(numDuplication > 1){

                        script += " ("+numDuplication+")"

                    }

                    script += '</option>'

                    selectHosts.innerHTML += script
                    counter++;

                }

            }

        }



    }

}

updateListHostsTxt()


function emptyDivs(){

    ospfDiv.innerHTML = ""; // make it empty

    vlsmDiv.innerHTML = ""; // make it empty

    vlsmCMDSdiv.innerHTML = ""; // make it empty

    masksDiv.innerHTML = ""; // make it empty

    configDiv.innerHTML = ""; // make it empty

    g_Next_Hop.innerHTML = ""



}


let hostsCounter = 0

function createListOfHosts(hostsCounter){

    let listHosts = []

    for(let host =0; host < hostsCounter; host++){

        let hostid = "host" + host

        let hostIn =  document.getElementById(hostid)

        let hostVal = hostIn.value

        if(hostVal){

            listHosts.push(hostVal)

        }

    }

    return listHosts
}


function getVals(){

    let network = networkIN.value

    let numHoststoConfig = toConfig.value

    let mask = maskIN.value

    let listHosts = createListOfHosts(hostsCounter)

    if(listHosts.length == 0){

        listHosts = textArea.value

        listHosts = listHosts.split(',')

    }

    let obj = 
    {
        "network": network,
        "numHoststoConfig":numHoststoConfig,
        "mask": mask,
        "listHosts": listHosts
    }

    return obj


}


function reverseString(str) {

    return str.split("").reverse().join("");

}


function bitsToOneRev(strBits, numBits) {


    let out = ''

    for(let index = 0;  index < strBits.length; index++){

        if(index < numBits){

            out += "1"

        }else{

            out += "0"

        }

    }

    return reverseString(out)

}


function validSubnet(subnet, mask){

    let valid = true

    let listOctet = subnet.split('.')

    let o1 = listOctet[0]
    let o2 = listOctet[1]
    let o3 = listOctet[2]
    let o4 = listOctet[3]

    let str_8bits_1 = new str(o1) 
    let binaryOctet1 = str_8bits_1.toBinary()
    let bits1 = binaryOctet1.padStart(8, "0");

    let str_8bits_2 = new str(o2) 
    let binaryOctet2 = str_8bits_2.toBinary()
    let bits2 = binaryOctet2.padStart(8, "0");

    let str_8bits_3 = new str(o3) 
    let binaryOctet3 = str_8bits_3.toBinary()
    let bits3 = binaryOctet3.padStart(8, "0");

    let str_8bits_4 = new str(o4) 
    let binaryOctet4 = str_8bits_4.toBinary()
    let bits4 = binaryOctet4.padEnd(8, "0");

    mask = parseInt(mask)

    let maxO1 = ""
    let maxO2 = ""
    let maxO3 = ""
    let maxO4 = ""

    let rest = 0;

    if(mask <= 8){

        maxO1 =  bitsToOneRev(bits1, mask)

        maxO2 = "00000000"
        maxO3 = "00000000"
        maxO4 = "00000000"

    }else if(mask <= 8*2){

        rest = mask - 8

        maxO1 =  bitsToOneRev(bits1, 8)

        maxO2 = bitsToOneRev(bits2, rest)

        maxO3 = "00000000"

        maxO4 = "00000000"

    }else if(mask <= 8*3){

        rest = mask - 8*2

        maxO1 =  bitsToOneRev(bits1, 8)

        maxO2 = bitsToOneRev(bits2, 8)

        maxO3 = bitsToOneRev(bits3, rest)

        maxO4 = "00000000"


    }else{

        rest = mask - 8*3

        maxO1 =  bitsToOneRev(bits1, 8)

        maxO2 = bitsToOneRev(bits2, 8)

        maxO3 = bitsToOneRev(bits3, 8)

        maxO4 =  bitsToOneRev(bits4, rest)


    }

    let digitMaxO1 = new str(maxO1).toDecimal() 
    let digitMaxO2 = new str(maxO2).toDecimal() 
    let digitMaxO3 = new str(maxO3).toDecimal() 
    let digitMaxO4 = new str(maxO4).toDecimal() 

    let digitO1 = parseInt(o1)
    let digitO2 = parseInt(o2)
    let digitO3 = parseInt(o3)
    let digitO4 = parseInt(o4)


    if(mask <= 8){

        if(digitMaxO1 >= digitO1  && digitO2 == 0 && digitO3 == 0 && digitO4 == 0){

            valid = true

        }else{

            valid = false

        }

    }else if(mask <= 8*2){

        if(digitMaxO1 >= digitO1 && digitMaxO2 >= digitO2 && digitO3 == 0 && digitO4 == 0){

            valid = true

        }else{

            valid = false

        }


    }else if(mask <= 8*3){

        if(digitMaxO1 >= digitO1  && digitMaxO2 >= digitO2 && digitMaxO3 >= digitO3 && digitO4 == 0){

            valid = true

        }else{

            valid = false

        }

    }else{

        if(digitMaxO1 >= digitO1 && digitMaxO2 >= digitO2 && digitMaxO3 >= digitO3 && digitMaxO4 >= digitO4){

            valid = true

        }else{

            valid = false

        }

    }

    return valid

}


function validHostsSize(listHosts, mask){

    let maxNumHosts = 0

    for(let hosts of listHosts){

        maxNumHosts += parseInt(hosts)

    }

    let maxNumHostsUsingMask = Math.pow(2, mask)


    let valid = true

    if(maxNumHosts> maxNumHostsUsingMask){

        valid = false

    }

    return valid 
}


function checkError(mask, network, listHosts){

    let error = ""

    mask = parseInt(mask)

    let validNumHosts = validHostsSize(listHosts, mask)

    if(31 < mask || mask < 1){

        error += "Mask Error: mask range between 1 and 31"

    }else if(!validNumHosts){

        error += "Mask Error: mask can't handle all hosts, make sure to adapte it"

    }

    if(network.includes(',')){

        error += 'Network Error: replace "," by "."'

    }else if(network.includes('.')){

        let listOctet = network.split('.')

        if(listOctet.length != 4){

            error += 'Network Error: messing "." in Network or not an IPV4 address'

        }else{

            let o1 = parseInt(listOctet[0])
            let o2 = parseInt(listOctet[1])
            let o3 = parseInt(listOctet[2])
            let o4 = parseInt(listOctet[3])

            let isValidSubnet =  validSubnet(network, mask)

            function validOctet(octet){

                return octet > -1 && octet < 256
            }

            if(isNaN(o1) || isNaN(o2) || isNaN(o3) || isNaN(o4)){

                error += 'Network Error: enter a number'

            }else if(!validOctet(o1) || !validOctet(o2) || !validOctet(o3) || !validOctet(o4)){

                error += 'Network Error: an octet should vary between 0 ~ 255'

            }else if(!isValidSubnet){

                error += 'Network Error: network is out of mask range, check if one of the octets is wrong'

            }
            
        }

    }

    return error

}


function processAll(){

    let network = networkIN.value

    let numHoststoConfig = toConfig.value

    let mask = maskIN.value

    let listHosts = createListOfHosts(hostsCounter)

    if(listHosts.length == 0){

        listHosts = textArea.value

        listHosts = listHosts.split(',')

    }

    emptyDivs()

    let error = checkError(mask, network, listHosts)

    if(error.length == 0){

        G_process()
    
        ospf(network, mask, listHosts, "", "", numHoststoConfig)

    }else{

        alert(error)

    }


}


function processOne(){

    let numHoststoConfig = toConfig.value

    let selectedvalue = selectHosts.value

    let hostsSelected 

    if(selectedvalue){

        hostsSelected = selectHosts[selectedvalue].innerHTML
    }

    if(hostsSelected){

        let network = networkIN.value

        let mask = maskIN.value

        let listHosts = createListOfHosts(hostsCounter)

        if(listHosts.length == 0){

            listHosts = textArea.value

            listHosts = listHosts.split(',')

        } 
        
        emptyDivs()

        let hosts = ''
        let hostsID = "1"

        if(hostsSelected.includes('(')){

            hosts = hostsSelected.split(' ')[0]

            let hiddenID = hostsSelected.split(' ')[1] 

            hostsID = hiddenID.replace("(", "")

            hostsID = hostsID.replace(")", "")


        }else{

            hosts = hostsSelected

        }

        let error = checkError(mask, network, listHosts)

        if(error.length == 0){

            ospf(network, mask, listHosts, hosts, hostsID, numHoststoConfig)

            G_process(hosts, hostsID)
    
        }else{

            alert(error)

        }

    
    }

}


function getBetween(str , char1, char2){

    let listOut = []
    let startCollect = false

    let collector = ""

    for(let char of str){

        if(char == char1){

            startCollect = true

        }else if (char == char2){

            startCollect = false

            listOut.push(collector)

            collector = ""


        }else if (startCollect){
            
            collector += char

        }

    }

    return listOut

}
