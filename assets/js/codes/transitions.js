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

/*
* Este método é usado para criar uma transição entre duas atividades
* 
*/
const createTransition = function () {
    const selectTo = document.getElementById("toID")
    if (selectTo.value == "") {
        alert("You need to select an state to create a transition")
        return
    }
    const node = nodes[document.getElementById("btnInsertTransition").getAttribute("trId") - 1]
    const nodeTo = nodes[parseInt(selectTo.value) - 1]

    let r = document.getElementById("trRate").value

    if (r === "") {
        r = 1
    }

    if (isNaN(r) || r <= 0) {
        alert("the rate needs to be a number greater than 0")
        document.getElementById("trRate").value = ""
        return
    }

    node.transitions.push({ to: nodeTo.id, rate: parseFloat(r) })

    edges.push({
        from: node.id,
        to: nodeTo.id,
        label: r + "",
        color: "#000000",
        arrows: {
            to: {
                enabled: true,
                type: "arrow",
            }
        }
    })

    document.getElementById("trRate").value = ""

    $("#modalStateInfo").modal("hide")

    restartBoard()


}

let updateTransition = function () {
    const conf = confirm("Are you sure you want to update this transition?")

    if (!conf)
        return

    const node = nodes[event.target.getAttribute("actId") - 1]
    const edge = edges[event.target.getAttribute("edgindex")]
    const trIndex = event.target.getAttribute("trIndex")

    const newRate = document.getElementById("trUpRate").value

    node.transitions[trIndex].rate = parseFloat(newRate)

    edge.label = newRate

    $("#modalTransitionInfo").modal("hide")

    restartBoard()
}

let deleteTransition = function (event) {

    const conf = confirm("Are you sure you want to delete this transition?")

    if (!conf)
        return

    const nodeTo = nodes[event.target.getAttribute("toId") - 1]
    const nodeFrom = nodes[event.target.getAttribute("fromId") - 1]

    for (let i = 0; i < nodeFrom.transitions.length; i++) {
        if (nodeFrom.transitions[i].to === nodeTo.id) {
            nodeFrom.transitions.splice(i, 1)
            break
        }
    }

    for (let i = 0; i < edges.length; i++) {
        if (edges[i].from === nodeFrom.id && edges[i].to === nodeTo.id) {
            edges.splice(i, 1)
            break
        }
    }

    $("#modalActivityInfo").modal("hide")
    $("#modalTransitionInfo").modal("hide")

    restartBoard()

}

document.getElementById("btnPModalUpdateTransition").addEventListener("click", function () {

    const edge = edges[event.target.getAttribute("edgIndex")]

    const nodeFrom = nodes[edge.from - 1]

    let index = 0
    for (index = 0; index < nodeFrom.transitions.length; index++) {
        if (nodeFrom.transitions[index].to == edge.to) {
            document.getElementById("trUpRate").value = nodeFrom.transitions[index].rate
            break
        }
    }

    document.getElementById("btnUpdateTransition").setAttribute("actId", nodeFrom.id)
    document.getElementById("btnUpdateTransition").setAttribute("trIndex", index)
    document.getElementById("btnUpdateTransition").setAttribute("edgIndex", event.target.getAttribute("edgIndex"))
    document.getElementById("btnUpdateTransition").addEventListener("click", updateTransition)

    $("#modalUpdateTransition").modal("show")
})

document.getElementById("btnInsertTransition").addEventListener("click", function (event) {

    const selectTo = document.getElementById("toID")
    const node = nodes[event.target.getAttribute("trId") - 1]

    while (selectTo.lastChild) {
        selectTo.removeChild(selectTo.firstChild)
    }

    nodes.forEach(element => {

        if (element.id !== node.id) {
            let haveIThisTransition = false
            for (let i = 0; i < node.transitions.length; i++) {
                if (element.id === node.transitions[i].to) {
                    haveIThisTransition = true
                    break
                }
            }
            if (haveIThisTransition === false) {
                const opt = document.createElement("option")
                opt.setAttribute("value", element.id)
                opt.appendChild(document.createTextNode(element.label))
                selectTo.appendChild(opt)
            }
        }

    })

})


document.getElementById("btnCreateTransition").addEventListener("click", createTransition)