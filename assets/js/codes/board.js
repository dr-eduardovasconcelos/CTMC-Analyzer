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

var container = document.getElementById("modelPanel")
var options = {
    layout: { randomSeed: 2 }

}
var network

var nodes = []
var edges = []
var lastNode = 1

var boardNodes
var boardEdges

network = new vis.Network(container, {}, options)
network.on("doubleClick", function () {
    createState()
    return
})

function restartBoard() {
    network.destroy()
    network = null

    boardNodes = new vis.DataSet(nodes)
    boardEdges = new vis.DataSet(edges)

    const data = { nodes: boardNodes, edges: boardEdges }

    network = new vis.Network(container, data, options)

    network.on("doubleClick", onNetwork)

}

let onNetwork = function (param) {

    if (param.nodes.length === 0 && param.edges.length === 0) {
        createState()
        return
    }

    /*
        Este código é executado quando a transição é clicada
    */

    if (param.edges.length > 0 && param.nodes.length == 0) {


        const edgId = param.edges[0]

        let edge
        let i = 0

        for (i = 0; i < edges.length; i++) {
            if (edges[i].id == edgId) {
                edge = edges[i]
                break
            }
        }

        document.getElementById("fromInfo").innerHTML = "state" + edge.from
        document.getElementById("toInfo").innerHTML = "state" + edge.to
        document.getElementById("rateInfo").innerHTML = edge.label

        document.getElementById("btnPModalUpdateTransition").setAttribute("edgIndex", i)

        document.getElementById("btnDeleteTransition").setAttribute("fromId", edge.from)
        document.getElementById("btnDeleteTransition").setAttribute("ToId", edge.to)
        document.getElementById("btnDeleteTransition").addEventListener("click", deleteTransition)


        $("#modalTransitionInfo").modal("show")

        return
    }

    /*
        trata do click duplo no estado
    */



    document.getElementById("StateNumber").innerHTML = param.nodes[0] + ""
    const node = nodes[param.nodes[0] - 1]

    let tblTransitions = document.getElementById("tblEdgInfo")

    while (tblTransitions.firstChild) {
        tblTransitions.removeChild(tblTransitions.lastChild)
    }

    if (node.transitions.length == 0) {
        tblTransitions.append(document.createTextNode("This activity has no transitions"))
    } else {

        const firstTR = document.createElement("tr")
        const firstTDTo = document.createElement("th")
        firstTDTo.appendChild(document.createTextNode("to-ID"))
        firstTR.appendChild(firstTDTo)

        const firstTDRate = document.createElement("th")
        firstTDRate.appendChild(document.createTextNode("rate"))
        firstTR.appendChild(firstTDRate)

        const firstTDOps = document.createElement("th")
        firstTDOps.appendChild(document.createTextNode("operation"))
        firstTR.appendChild(firstTDOps)
        tblTransitions.appendChild(firstTR)

        node.transitions.forEach(tr => {
            const innerTR = document.createElement("tr")

            const innerTDRate = document.createElement("td")
            innerTDRate.appendChild(document.createTextNode(tr.to))
            innerTR.appendChild(innerTDRate)

            const innerTDTo = document.createElement("td")
            innerTDTo.appendChild(document.createTextNode(tr.rate))
            innerTR.appendChild(innerTDTo)

            const innerTDOps = document.createElement("td")
            const deleteTransitionLink = document.createElement("button")
            deleteTransitionLink.setAttribute("class", "btn btn-link deleteTransition")
            deleteTransitionLink.setAttribute("toId", tr.to + "")
            deleteTransitionLink.setAttribute("fromId", node.id + "")
            deleteTransitionLink.appendChild(document.createTextNode("delete"))
            innerTDOps.appendChild(deleteTransitionLink)
            innerTR.appendChild(innerTDOps)
            tblTransitions.appendChild(innerTR)

            //$(".deleteTransition").on("click",deleteTransition)
        })

    }

    document.getElementById("btnInsertTransition").setAttribute("trId", node.id)
    document.getElementById("btnDeleteState").setAttribute("trId", node.id)

    $("#modalStateInfo").modal("show")

    return

}

document.getElementById("btnGnrJSON").addEventListener("click", function () {

    const jso = JSON.parse(JSON.stringify(nodes))

    for (let i = 0; i < jso.length; i++) {
        delete jso[i].physics
        delete jso[i].color
    }

    txtAreaJson = document.getElementById("txtAreaGnrJSON")

    txtAreaJson.value = JSON.stringify(jso)

})

/*
* Esteé o botão que fica dentro do modal que gera o JSON
*/
document.getElementById("btnCopyJSON").addEventListener("click", function () {

    const jso = JSON.parse(JSON.stringify(nodes))

    for (let i = 0; i < jso.length; i++) {
        delete jso[i].physics
        delete jso[i].color
    }

    navigator.clipboard.writeText(JSON.stringify(jso))

    alert("JSON Copied")

})

document.getElementById("btnLoadJSON").addEventListener("click", function () {
    let auxNodes = []
    try {
        auxNodes = JSON.parse(document.getElementById("txtAreaLoadJSON").value)

    } catch (e) {
        alert("there are problems with your JSON")
        document.getElementById("txtAreaLoadJSON").value = ""

        return
    }

    nodes = auxNodes

    nodes.forEach(el => {
        el.physics = false
        el.color = "#ffffff"
    })

    edges = []

    for (let i = 0; i < nodes.length; i++) {

        for (let j = 0; j < nodes[i].transitions.length; j++) {
            edges.push({
                from: nodes[i].id,
                to: nodes[i].transitions[j].to,
                label: nodes[i].transitions[j].rate + "",
                color: "#000000",
                arrows: {
                    to: {
                        enabled: true,
                        type: "arrow",

                    }
                },

            })
        }

    }

    lastNode = nodes.length + 1

    restartBoard()

})