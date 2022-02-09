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
   Método usado para criar um estado
*/
const createState = function () {
    nodes.push({
        id: lastNode,
        label: "" + lastNode,
        transitions: [],
        color: "#ffffff",
        physics: false
    })
    lastNode++
    restartBoard()
}

const deleteState = function (event) {

    const node = nodes[event.target.getAttribute("trId") - 1]

    const conf = confirm("Are you sure that you want to delete state: " + node.id + "?")
    if (!conf) {
        return
    }

    for (let i = 0; i < nodes.length; i++) {

        if (nodes[i].id > node.id) {
            nodes[i].id--
            nodes[i].label = nodes[i].id + ""
        }
        for (let j = 0; j < nodes[i].transitions.length; j++) {
            if (nodes[i].transitions[j].to === node.id) {
                nodes[i].transitions.splice(j, 1)
                j--
            } else if (nodes[i].transitions[j].to > node.id) {
                nodes[i].transitions[j].to--
            }
        }

    }

    nodes.splice(node.id - 1, 1)

    lastNode--

    for (let i = 0; i < edges.length; i++) {
        if (edges[i].from === node.id || edges[i].to === node.id) {
            edges.splice(i, 1)
            i--
            continue
        }
        if (edges[i].from > node.id)
            edges[i].from--
        if (edges[i].to > node.id)
            edges[i].to--
    }


    restartBoard()

}

document.getElementById("btnDeleteState").addEventListener("click", deleteState)
document.getElementById("btnCreateState").addEventListener("click", createState)