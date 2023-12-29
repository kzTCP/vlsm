
class str{

    constructor (string){

        this.string = string

    }

    toBinary() {

        let bits = ( this.string >>> 0).toString(2)

        return bits;

    }

    toDecimal(){


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
