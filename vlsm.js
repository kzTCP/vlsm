
function vlsmOnly(network, listHosts){

    listHosts = filterListHosts(listHosts)

    // oder list from big to small
    let orderedListHosts = listHosts.sort((a, b) =>  b - a);

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

            // fakeNetwork = subnetx(fakeNetwork, maxNum)

            let subnetObj = subnetxy(nextNetwork, maxHostsNum)

            nextNetwork = subnetObj.nextSubnet

            subnetObj['bits'] = numBits

            let currentSubnet = subnetObj.subnet

            subnetOut[numHosts +'.'+ key] = [subnetMask, currentSubnet]

            currentSubnet = nextNetwork

            key++;

        }else{

            console.log('not enough space for these hosts')

        }

    }

    return subnetOut

}

