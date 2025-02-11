

class str{

    constructor (string){

        this.string = string

    }

    toBinary() {

        let bits = ( this.string >>> 0).toString(2)

        return bits;

    }

    toDecimal(){

        // return Math.pow(2, this.string.length)

        let string = this.string

        let counter = 0

        let outNum = 0;

        for(let numBit = 0; numBit < string.length; numBit++){

            let revNumBit = string.length - numBit - 1

            let bit = string[revNumBit]

            outNum +=  parseInt(bit) * Math.pow(2, counter)

            counter += 1


        }

        return outNum

    }

}


function adaptableNumOfHosts(numHosts){

    let totalNumHots = 0

    let strHostBinary = new str(numHosts).toBinary()

    do{
        // making sure the new subnet can hold these hosts 

        if(strHostBinary.includes('0')){

            // replace 0 with 1
            strHostBinary = strHostBinary.replace(/0/g, 1)
            
        }else{

            // adding 1 bit to the hosts subnet numbers
            strHostBinary = strHostBinary + '1'

        }

        let maxNum = new str(strHostBinary).toDecimal()

        totalNumHots = maxNum - 2;

    }while(totalNumHots < numHosts);

    return totalNumHots

}


function getSubnetGateway(mask, nextSubnetNetwork){

    let listSubnetOctacts = nextSubnetNetwork.split('.')

    let gateWay = ""

    let maskOctats = mask / 8

    let thirdOct = parseInt(listSubnetOctacts[2])

    let fourthOct = parseInt(listSubnetOctacts[3])

    let lastAddress = ''

    if(maskOctats > 1  && maskOctats <= 2){

        gateWay = listSubnetOctacts[0] + "." + listSubnetOctacts[1] + "."

        lastAddress = gateWay

        if(fourthOct == 0){

            thirdOct = thirdOct - 1;
            
            gateWay +=  thirdOct + "." + 255

            lastAddress +=  thirdOct + "." + 254

        }else{

            fourthOct = fourthOct - 1
            gateWay += thirdOct + "." + fourthOct

            fourthOct = fourthOct - 1
            lastAddress +=  thirdOct + "." + fourthOct


        }


    }


    return {gateWay, lastAddress}


}


function getFistSubnetAddress(mask, startSubnetNetwork){

    let listSubnetOctacts = startSubnetNetwork.split('.')

    let fistAddress = ""

    let maskOctats = mask / 8

    let thirdOct = parseInt(listSubnetOctacts[2])
    let fourthOct = parseInt(listSubnetOctacts[3])

    if(maskOctats > 1  && maskOctats <= 2){

        fistAddress = listSubnetOctacts[0] + "." + listSubnetOctacts[1] + "."

        fourthOct = fourthOct + 1;

        fistAddress += thirdOct + "." + fourthOct;

    }

    return fistAddress


}


function octetResize(strOctet, size, bitVal){

    let octetOut = strOctet

    for(let bit = strOctet.length; bit < size; bit++){

        octetOut += String(bitVal)

    }

    return octetOut

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

    // method 1 // reverse bits

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

    // method 2 // subtracting "decimal value of an octet" from 255

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
