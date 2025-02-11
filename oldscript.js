

function case1(orderedListHosts, listOctacts){

    let secondOctat = 0

    let fisrtOctat = 0

    let subnetNetwork = ""

    for (let numHosts of orderedListHosts) {

        let strHost = new str(numHosts).toBinary()

        if(strHost.includes('0')){

            let strMaxBits = strHost.replace(/0/g, 1)

            let maxNum = new str(strMaxBits).toDecimal()

            let totalNumHots = maxNum - 2;

            if(totalNumHots >= numHosts){

                let numBits = strMaxBits.length

                let subnetMask = 32 - numBits

                if(numBits > 8){

                    subnetNetwork =  listOctacts[0] + "." + listOctacts[1] + "."

                    secondOctat += Math.pow(2, numBits - 8);

                    subnetNetwork +=  secondOctat + "." + 255

                }else{

                    subnetNetwork =  listOctacts[0] + "." + listOctacts[1] + "."

                    fisrtOctat += Math.pow(2, numBits);

                    subnetNetwork +=  secondOctat + "." + fisrtOctat

                }

            }else{

                console.log('not enough space for these hosts')

            }
            
        }



    }

}
