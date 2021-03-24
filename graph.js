var network = null;
var container = null;

var hidden = false;

var nodes = [
    {id: 0, group: "main", label: 'Group'},

    {id: 1, group: "member", label: 'Nadyne\nAretz'},
    {id: 2, group: "extra", label: 'The\nNetherlands'},

    {id: 3, group: "member", label: 'Jaden\nNierop'},
    {id: 4, group: "extra", label: 'The\nNetherlands'},
    {id: 5, group: "extra", label: 'Aruba'},

    {id: 6, group: "member", label: 'Teun\nBuijs'},
    {id: 7, group: "extra", label: 'The\nNetherlands'},
    {id: 8, group: "extra", label: 'Philippines'},

    {id: 9, group: "member", label: 'Sanne\nVeringa'},
    {id: 10, group: "extra", label: 'The\nNetherlands'},

    {id: 11, group: "member", label: 'Alena\nShcheglova'},
    {id: 12, group: "extra", label: 'The\nNetherlands'},
    {id: 13, group: "extra", label: 'Russia'},

    // {id: 14, group: "extra", label: 'Aruba'},
    // {id: 15, group: "extra", label: 'The Netherlands'}
    
    
    {id: 14, group: "extra", label: 'Computer Science\nand Engineering'},
    {id: 15, group: "extra", label: 'Computer Science\nand Engineering'},
    {id: 16, group: "extra", label: 'Computer Science\nand Engineering'},
    {id: 17, group: "extra", label: 'Computer Science\nand Engineering'},
    {id: 18, group: "extra", label: 'Computer Science\nand Engineering'},
];
var nodesDataSet = new vis.DataSet(nodes);

var edges = new vis.DataSet([
    {from: 0, to: 1, title: 'has member'},
    {from: 0, to: 3, title: 'has member'},
    {from: 0, to: 6, title: 'has member'},
    {from: 0, to: 9, title: 'has member'},
    {from: 0, to: 11, title: 'has member'},
    {from: 1, to: 2, title: 'lives in'},
    {from: 3, to: 5, title: 'lived in'},
    {from: 3, to: 4, title: 'lives in'},
    {from: 6, to: 7, title: 'lives in'},
    {from: 6, to: 8, title: 'lived in'},
    {from: 9, to: 10, title: 'lives in'},
    {from: 11, to: 12, title: 'lived in'},
    {from: 11, to: 13, title: 'lives in'},
    {from: 1, to: 14, title: 'studies'},
    {from: 3, to: 15, title: 'studies'},
    {from: 6, to: 16, title: 'studies'},
    {from: 9, to: 17, title: 'studies'},
    {from: 11, to: 18, title: 'studies'},
]);

var data = {
    nodes: nodesDataSet,
    edges: edges
};

var options = {
    groups: {
        main: {
            font:{
                size: 40
            },
            color: {
                background: "#d7500d",
                border: "black",
                highlight: {
                    border: "black",
                    background: "#bcfccc"
                }
            },
            shape: "ellipse"
        },
        member: {
            font: {
                size: 25
            },
            color: {
                background: "#ec9527",
                border: "black",
                highlight: {
                    border: "black",
                    background: "#bcfccc"
                }
            },
            shape: "circle",
            margin: 10
        },
        extra: {
            font: {
                size: 18
            },
            color: {
                background: "#f4bc31",
                border: "black",
                highlight: {
                    border: "black",
                    background: "#bcfccc"
                }
            },
            shape: "ellipse"
        }
    },
    edges: {
        arrows: "to",
        color: {
            color: "#000000",
            highlight: "#4fa800",
        },
        length: 150
    },
    interaction: {
        hover: true,
        tooltipDelay: 20
    },
    physics: {
        repulsion: {
            nodeDistance: 400
        },
        maxVelocity: 10
    }
};

function draw() {

    container = document.getElementById('mynetwork');

    network = new vis.Network(container, data, options);
    //add open cluster funtionality, second argument is a call back
    network.on("selectNode", function (params) {
        if(params.nodes.length == 1) {
            if (network.isCluster(params.nodes[0])) {
                network.openCluster(params.nodes[0]);
            }
        }
    });
}

function clusterOutliers() {
    network.setData(data);
    network.clusterOutliers();
}

function clusterMembers() {
    network.setData(data);
    var clusterOptionsByData = {
        joinCondition: function (childOptions) {
            return childOptions.group == "member";
        },
        clusterNodeProperties: {
            group: "member",
            label: "members",
            borderWidth: 3,
            shape: "circle"
        }
    };
    network.cluster(clusterOptionsByData);
}

function clusterByGroupMember() {
    network.setData(data);
    var clusterOptionsByData = {
      joinCondition: function (childOptions) {
        return childOptions.group == "main";
      },
      clusterNodeProperties: {
        id: "group",
        borderWidth: 3,
        shape: "circle"
      },
    };
    network.cluster(clusterOptionsByData);
}

//clusters the children of the children of a Node
function clusterChildren(nodeId) {
    var children = network.getConnectedNodes(nodeId, "to");
    var clusterOptions = {
        joinCondition: function (childNodeOptions) {
            return children.includes(childNodeOptions.id) && childNodeOptions.group != "global";
        },
        clusterNodeProperties: {
            group: "member",
            label: "members",
            borderWidth: 3,
            shape: "circle",
            allowSingleNodeCluster: true
        }
    };
    network.cluster(clusterOptions);
}

function clusterAll(startId) {
    //cluster the tips first
    var children = network.getConnectedNodes(startId, "to");
    for (var i = 0; i < children.length; i++) {
        clusterAll(children[i]);
    }
    clusterChildren(startId);
}

function toggleExtras() {
    nodes.forEach(function (node) {
        if (node.group == "extra") {
            data.nodes.update([{id: node.id, hidden: hidden}]);
        }
    })
    // for (const node in nodes) {
    //     console.log(node);
    //     if (node.group == "extra") {
    //         data.nodes.update([{id: node.id, hidden: hidden}]);
    //     }
    // }
    hidden = !hidden;
}