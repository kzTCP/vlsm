
let g_subnet = document.getElementById('g_subnet')

let g_host_IP = document.getElementById('g_host_IP')

let g_mask = document.getElementById('g_mask')

let g_gateway = document.getElementById('g_gateway')

let g_init = document.getElementById('g_init')

g_init.value = 'enable <br>\r\nconfigure terminal <br>\r\n'

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

function optionScript(value){

    return "<option value='"+value+"'>" + value + '</option>'

}


let varDup = undefined

function checkDuplicate(str){

    let out = undefined

    if(varDup == str){

        out = true

    }else{

        out =  false
    }

    varDup = str

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

function G_process(targetHosts="", targetHostsID=""){

    // let varDup = undefined

    g_subnet.innerHTML = ""
    g_host_IP.innerHTML = ""
    g_mask.innerHTML = ""
    g_gateway.innerHTML = ""
    // g_init.value = ""
    // g_formula.value = ""
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

        let scriptSubnet =  optionScript(subnet)

        if(subnet == tar_subnet || !targetHosts){

            let numduplication = checkDuplicateHosts(numHosts)

            g_subnet.innerHTML += scriptSubnet

            if (processOneSubnet){

                let scriptMask =  optionScript(mask)

                if(mask != oldMask){

                    g_mask.innerHTML += scriptMask

                    oldMask = mask

                }

                // getting hosts ips

                let numHoststoConfig = toConfig.value

                let objectIPs =  getIPsForhosts(subnet, mask, numHosts, numHoststoConfig)

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

            console.log('keyWord', keyWord)

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


function exampleFormula(){

    nextHopArea.none()
    port.none()
    hostsArea.tableRow()
    gatewayArea.tableRow()
    maskArea.tableRow()


    let selectedCMD = g_exp_formula.value



    if(selectedCMD == "PC Config"){

        g_formula.innerHTML = "ipconfig {host} {ex_mask} {gateway}"

    }else if(selectedCMD == "Serial"){

        g_formula.innerHTML  = "interface Serial{port}/<br>\r\n"
        g_formula.innerHTML += "no shutdown<br>\r\n"
        g_formula.innerHTML += "ip address {host} {ex_mask}"

        port.tableRow()
        gatewayArea.none()

        g_port.value = '2/0'

    }else if(selectedCMD ==  "Static"){

        g_formula.innerHTML = "ip route {subnet} {ex_mask} {nextHop}"

        nextHopArea.tableRow()
        hostsArea.none()
        gatewayArea.none()

    }else if(selectedCMD ==  "RIP"){

        g_formula.innerHTML = "router rip <br>\r\n"
        g_formula.innerHTML += "network {subnet}"

        hostsArea.none()
        maskArea.none()
        gatewayArea.none()

    }else if(selectedCMD == "OSPF"){

        g_formula.innerHTML = "router ospf 1 <br>\r\n"
        g_formula.innerHTML += "network {subnet} {rev_mask} area 0"

        hostsArea.none()
        gatewayArea.none()


    }else if(selectedCMD ==  "FastEthernet"){

        g_formula.innerHTML  = "interface FastEthernet{port}<br>\r\n"
        g_formula.innerHTML += "no shutdown<br>\r\n"
        g_formula.innerHTML += "ip address {host} {ex_mask}"

        port.tableRow()
        gatewayArea.none()

        g_port.value = '0/0'


    }else if(selectedCMD ==  "None"){

        g_formula.innerHTML = ""

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

            // getting hosts ips

            let numHoststoConfig = toConfig.value

            let objectIPs =  getIPsForhosts(subnet, mask, numHosts, numHoststoConfig)

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


}

