
class displayDiv{

    constructor (div){

        this.div = div
    }

    block(){

        this.div.style.display = 'block'

    }

    none(){

        this.div.style.display = 'none'

    }

    flex(){

        this.div.style.display = 'flex'

    }

    tableRow(){

        this.div.style.display = 'table-row'

    }

}



let txtMode = true

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


vlsmDiv.style="display:flex;"
vlsmCMDSdiv.style="display:none;"

ospfDiv.style="display:none;"
masksDiv.style="display:none;"
configDiv.style="display:none;"
toConfig.style="display:block;"


function examples(){

    networkIN.value = "172.16.0.0"
    
    maskIN.value = 16

    textArea.value = "1000, 50, 2, 2, 2"

    toConfig.value = 5

}

examples()

