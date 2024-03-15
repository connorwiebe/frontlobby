//
// Weighted Directed Cyclic Graph
//
// allow DCGraph to be instantiated with any type
export default class DCGraph<N extends Node<T>, T = any> {
	private nodes: N[];

	// we need to add a constructor here to initialize the nodes array
	constructor() {
		this.nodes = [];
	}

	// size of the graph
	get size() {
		return this.nodes.length;
	}

	// removed duplicate addNode method
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
	// added type annotation
	async WalkGraph(callback: (node: Node<T>) => boolean) {
		for (let a=0; a<this.nodes.length; a++) {
			// consider not using await inside if statements
			if ((await callback(this.nodes[a])) === false) {
				return false; // exit early
			}
			this.nodes[a].WalkEdges(callback);
		}
	}

	detectCycle(): Promise<boolean> {
		let result = false;

		// this method expects a return value of Promise<boolean>
		return this.WalkGraph(node => {
			if (node.visited) {
				result = true;	// cycle detected!!
				return false;	// early exit from the walk
			}
			node.visited = true;
			// return true was missing here so we can continue walking
			return true;
		})
		.then(function () {
			return result;
		});
	}
}

class Node<T> {
	// allow for value to potentially be undefined
	value: T | undefined;
	// added type annotation
	edges: Edge<T>[];
	// added visited property
	visited: boolean = false;

	// added type annotation
	constructor(newValue?: T) {
		this.value = newValue;
		// added initial value for edges property
		this.edges = [];
	}

	// adds an edge to this node
	// added added type annotation
	connect(towardsNode: Node<T>, weight?: number) {
		const edge = new Edge<T>();
		// added default value for weight
		edge.weight    = weight || 0;
		edge.otherNode = towardsNode;

		if (this.edges.includes(edge)) {
			// you should throw the error, not return it
			throw new Error('edge already exists');
		}

		this.edges.push(edge);
	}

	// added more specific function signature for better type safety
	WalkEdges(callback: (node: Node<T>) => void) {
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
// added generic type parameter and initial values
class Edge<T> {
	weight: number = 0;
	otherNode: Node<T> = new Node();
}
