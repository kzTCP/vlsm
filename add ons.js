

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
    
                console.log('unknown command')
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


function processX(str){

    if(str){

        Processbtn.disabled = false

    }else{

        Processbtn.disabled = true

    }


}


function allowProcess(){

    process(inputToProcess.value, textArea.value, selectHosts.value)


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


function addNewInputHost(value){

    let objHosts = {}

    let hostNum = hostsCounter + 1 

    objHosts = saveAddHostHistoy(hostNum, objHosts, "save")

    hostsDiv.innerHTML += '<div><input type="text" oninput="updateListHostsInput()" id="host' +hostsCounter+ '" value="'+value+'" placeHolder="host ' + hostNum +'"></div>'

    saveAddHostHistoy(hostNum, objHosts, "print")

    if(hostsCounter == 0){

        document.getElementById("break").innerHTML += "<br>"
    }

    hostsCounter++;


}


function addTextHostsInInputs(){

    // clear old values before new print
    hostsDiv.innerHTML = "" 

    hostsCounter = 0

    let textAreaVal = textArea.value

    if(textAreaVal){

        let listHosts = textAreaVal.split(',')

        let orderedListHosts = listHosts.sort((a, b) =>  b - a);

        for(let host of orderedListHosts){

            host = parseInt(host)

            if(host){

                addNewHost(host)

            }

        }

    }

    
}


function getInputsListHosts(){

    let listHosts = []

    for (let host = 0; host< hostsCounter; host++){

        let hostInput = document.getElementById('host' + host)
        
        let hosts = hostInput.value

        listHosts.push(hosts)


    }

    return listHosts
}


function updateListHostsInput(){

    selectHosts.innerHTML = ""

    let listHosts = getInputsListHosts()

    if(listHosts){

        process(listHosts[0])

        let counter = 0

        let orderedListHosts = listHosts.sort((a, b) =>  b - a);

        for(let hosts of orderedListHosts){

            if(!isNaN(hosts)){

                hosts = parseInt(hosts)

                if(hosts){

                    selectHosts.innerHTML += "<option value='"+ counter +"'>"+hosts+'</option>'
                    counter++;

                }

            }

        }

    }

}


function hideTxt(){

    textArea.style='display:none'; 
    document.getElementById('New Host').style='display:block';
    hostsDiv.style='display:block';
    document.getElementById('break').style='display:block';

    btnTxt.disabled = false;

    input.disabled = true;
    txtMode = false

    addTextHostsInInputs()

    updateListHostsInput()


}


function addInputHost(){

    addNewInputHost("")

}


function updateTxtArea(){

    let listHosts = getInputsListHosts()

    textArea.value = ""// clear text area

    for(let index in listHosts){

        let host = listHosts[index]

        if(!isNaN(host) && parseInt(host)){

            if(index != listHosts.length - 1 ){

                textArea.value += host + ", "

            }else{

                textArea.value += host 

            }

        }

    }

}


function hideInput(){

    textArea.style='display:block'; 
    document.getElementById('New Host').style='display:none';
    hostsDiv.style='display:none';
    document.getElementById('break').style='display:none'; 

    btnTxt.disabled = true ;
    input.disabled = false;

    txtMode = true

    updateTxtArea()

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

    if(listHosts.length == 0 && txtMode){

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


function checkError(mask, network){

    let error = ""

    mask = parseInt(mask)

    if(31 < mask && mask < 1){

        error += "Mask Error"

    }

    if(network.includes(',')){

        error += 'Network Error: replace "," by "."'

    }else if(network.includes('.')){

        let listOctet = network.split('.')

        if(listOctet.length != 4){

            error += 'Network Error: support IPV4 only'

        }else{

            let o1 = parseInt(listOctet[0])
            let o2 = parseInt(listOctet[1])
            let o3 = parseInt(listOctet[2])
            let o4 = parseInt(listOctet[3])

            function validOctet(octet){

                return octet > -1 && octet < 256
            }

            if(isNaN(o1) || isNaN(o2) || isNaN(o3) || isNaN(o4)){

                error += 'Network Error: enter a number'
            }else if(!validOctet(o1) || !validOctet(o2) || !validOctet(o3) || !validOctet(o4)){

                error += 'Network Error: an octet should vary between 0 ~ 255'

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

    if(listHosts.length == 0 && txtMode){

        listHosts = textArea.value

        listHosts = listHosts.split(',')

    }

    let error = checkError(mask, network)

    if(error.length == 0){

        emptyDivs()

        G_process()
    
        ospf(network, mask, listHosts, "", "", numHoststoConfig)

    }else{

        alert(error, network)

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

        if(listHosts.length == 0 && txtMode){

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

        let error = checkError(mask, network)

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



