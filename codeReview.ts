//
// Weighted Directed Cyclic Graph
//
export default class DCGraph<N extends Node> {
	private nodes: N[];

	// size of the graph
	get size() {
		return this.nodes.length;
	}

	addNode(value: any);
	addNode(node: N | any) {
		if (!(node instanceof Node)) {
			node = new Node(node);	// node must be the value
		}
		if (!this.nodes.includes(node)) {
			this.nodes.push(node);
		}
		return node;
	}

	// calls callback with each node in graph
	async WalkGraph(callback: (node: Node) => boolean) {
		for (let a=0; a<this.nodes.length; a++) {
			if ((await callback(this.nodes[a])) === false) {
				return false; // exit early
			}
			this.nodes[a].WalkEdges(callback);
		}
	}

	detectCycle(): Promise<boolean> {
		let result = false;

		this.WalkGraph(node => {
			if (node.visited) {
				result = true;	// cycle detected!!
				return false;	// early exit from the walk
			}
			node.visited = true;
		})
		.then(function () {
			return result;
		});
	}
}

class Node<T> {
	value: T;
	edges: Edge[];

	constructor(newValue?) {
		this.value = newValue;
	}

	// adds an edge to this node
	connect(towardsNode: Node<T>, weight?) {
		const edge     = new Edge();
		edge.weight    = weight;
		edge.otherNode = towardsNode;

		if (this.edges.includes(edge)) {
			return Error('edge already exists');
		}

		this.edges.push(edge);
	}

	WalkEdges(callback: Function) {
		callback(this);

		this.edges.forEach(edge => {
			edge.otherNode.WalkEdges(callback);
		});
	}
}

/**
 * Edge connects one node to another
 * can optionally have a weight
 */
class Edge {
	weight: number;
	otherNode: Node;
}
