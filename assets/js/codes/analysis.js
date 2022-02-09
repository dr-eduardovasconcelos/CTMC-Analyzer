/*
    This file is part of CTMC Analyzer.

    CTMC Analyzer is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    CTMC Analyzer is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with CTMC Analyzer.  If not, see <https://www.gnu.org/licenses/>.
*/

document.getElementById("btnPerfAnalysis").addEventListener("click", function (event) {

    const chain = []
    let isAbsortion = false

    nodes.forEach(node => {
        if (node.transitions == undefined || node.transitions.length === 0) {
            isAbsortion = true
            return
        }
    })

    if (isAbsortion) {

        nodes.forEach((element, index) => {

            chain.push({
                number: element.id,
                isInitialState: false,
                transitions: []

            })

            for (let i = 0; i < element.transitions.length; i++) {
                chain[index].transitions.push({
                    to: element.transitions[i].to,
                    rate: element.transitions[i].rate
                })
            }

            if (element.id === 1) {
                chain[index].isInitialState = true
            }

        })

        let result

        event.target.setAttribute("enabled", "false")

        try {
            result = calculateMTTF(chain)
        } catch (e) {
            alert(e.message)
            return
        } finally {
            event.target.setAttribute("enabled", "true")
        }

        document.getElementById("MTTFInfo").innerHTML = result.mttf.toFixed(4)

        const tblActRes = document.getElementById("tblActRes")

        while (tblActRes.firstChild) {
            tblActRes.removeChild(tblActRes.lastChild)
        }

        const headerTR = document.createElement("tr")

        const headerTHId = document.createElement("th")
        headerTHId.appendChild(document.createTextNode("ID"))
        headerTR.appendChild(headerTHId)


        const headerThPeriod = document.createElement("th")
        headerThPeriod.appendChild(document.createTextNode("Execution Time"))
        headerTR.appendChild(headerThPeriod)


        tblActRes.appendChild(headerTR)

        let totalCost = 0

        result.statePeriods.forEach((element, index) => {

            const currNode = nodes[element.number - 1]

            const innerTR = document.createElement("tr")

            const innerTDId = document.createElement("td")
            innerTDId.appendChild(document.createTextNode(currNode.id))
            innerTR.appendChild(innerTDId)

            const innerTDPeriod = document.createElement("td")
            innerTDPeriod.appendChild(document.createTextNode(element.period.toFixed(4)))
            innerTR.appendChild(innerTDPeriod)

            totalCost += (currNode.cost * element.period)

            tblActRes.appendChild(innerTR)

        })

        const tblAbsRes = document.getElementById("tblAbsRes")

        while (tblAbsRes.firstChild) {
            tblAbsRes.removeChild(tblAbsRes.lastChild)
        }

        const headerTR2 = document.createElement("tr")

        const headerTHId2 = document.createElement("th")
        headerTHId2.appendChild(document.createTextNode("ID"))
        headerTR2.appendChild(headerTHId2)

        const headerThPeriod2 = document.createElement("th")
        headerThPeriod2.appendChild(document.createTextNode("Occurrence Probabilities"))
        headerTR2.appendChild(headerThPeriod2)


        tblAbsRes.appendChild(headerTR2)

        result.absortionProbabilities.forEach(element => {

            const currNode = nodes[element.number - 1]

            const innerTR = document.createElement("tr")

            const innerTDId = document.createElement("td")
            innerTDId.appendChild(document.createTextNode(currNode.id))
            innerTR.appendChild(innerTDId)

            const innerTDPeriod = document.createElement("td")
            innerTDPeriod.appendChild(document.createTextNode((element.probability * 100).toFixed(4) + "%"))
            innerTR.appendChild(innerTDPeriod)

            tblAbsRes.appendChild(innerTR)
        })

        $("#modalResultMTTF").modal("show")

        return
    }

    nodes.forEach((element, index) => {

        chain.push({
            number: element.id,
            transitions: []

        })

        for (let i = 0; i < element.transitions.length; i++) {
            chain[index].transitions.push({
                to: element.transitions[i].to,
                rate: element.transitions[i].rate
            })
        }

    })

    let sProbs = {}

    try{
        sProbs = calculateAvailability(chain)
    }catch(e){
        alert(e.message)
        return
    }

    const tblStdResult = document.getElementById("tblSttRes")

    while(tblStdResult.firstChild){
        tblStdResult.removeChild(tblStdResult.lastChild)
    }

    const headTr = document.createElement("tr")
    const piTh = document.createElement("th")
    piTh.appendChild(document.createTextNode("Prob Id"))
    headTr.appendChild(piTh)
    const probTh = document.createElement("th")
    probTh.appendChild(document.createTextNode("Probability"))
    headTr.appendChild(probTh)
    tblStdResult.appendChild(headTr)

    sProbs.forEach((probs, index) => {
        const innerTr = document.createElement("tr")
        const innerpiTh = document.createElement("td")
        innerpiTh.innerHTML=(("&#960;"+(index + 1)))
        innerTr.appendChild(innerpiTh)
        const innerprobTh = document.createElement("td")
        innerprobTh.appendChild(document.createTextNode(probs))
        innerTr.appendChild(innerprobTh)
        tblStdResult.appendChild(innerTr)
    })

    $("#modalResultAvailability").modal("show")

})