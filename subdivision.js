/*
 * subdivision.js
 * author: nathan lachenmyer <scottnla AT mit DOT edu>
 * last updated: 2013 March 13
 * version: 0.1
 * 
 * A javascript library for computational geometry.
 */

//input data 
function Vertex(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.edge;
}

function Edge(vertex_a, vertex_b) {
    this.a = vertex_a;
    this.b = vertex_b;
}

function Face() {
    this.vertices = [];
    this.edges = [];
    this.edge;
    this.centroid;
}

Face.prototype.addVertex = function(_vertex) {
    this.vertices.push(_vertex);
}

Face.prototype.computeCentroid = function() {
    /*
     * Compute the centroid of the face by averaging the position of all vertices.
     */
    var numVertices = this.vertices.length;
    var centroid_x = 0;
    var centroid_y = 0;
    for(var i = 0; i < numVertices; i++) {
	//compute the centroid
	centroid_x += this.vertices[i].x;
	centroid_y += this.vertices[i].y;
    }
    centroid_x /= numVertices;
    centroid_y /= numVertices;
    this.centroid = new Vertex(centroid_x, centroid_y);
    return this.centroid
}

Face.prototype.sortVertices = function() {
    /*
     * Sort the vertices in counterclockwise order relative to the centroid.  The centroid is automatically updated by this call, so there's no need to manually run it after adding new vertices.
     */
    this.computeCentroid();
    var angleList = [];
    for(var i = 0; i < this.vertices.length; i++) {
	//An extra PI is added to ensure all angles are positive.  This makes comparison a bit easier.
	var angleFromCentroid = Math.atan2(this.vertices[i].y - this.centroid.y, this.vertices[i].x - this.centroid.x) + Math.PI;
	//create a pair of vertex-angle objects for sorting
	angleList.push([this.vertices[i], angleFromCentroid]);
    }
    angleList.sort(function(a,b) {return a[1] - b[1]});
    for(var i = 0; i < this.vertices.length; i++) {
	this.vertices[i] = angleList[i][0];
    }
}

Face.prototype.subdivide = function() {
}

function HalfEdge(_vertex) {
    this.origin = _vertex;
    this.face;
    this.twin;
    this.next;
    this.prev;
}

function GeometryManager(_faces) {
    this.faces = _faces;
    this.vertices = _faces.vertices;
    this.halfedges = [];
    this.twinList = [];
}

GeometryManager.prototype.makeEdges = function() {
    /*
     * Creates the half-edge data structure from a list of faces (and their associated vertices).  This function takes each face, sorts the vertices, and creates half-edges in a loop around that face.  The half-edges are temporarily stored in the variable faceEdges until the ring is complete, and then the .next and .prev pointers are added before the faceEdges are added to the global list of edges (this.halfedges).  The half-edge pairs are created simultaneously, with the twin being placed in a list of spare twins.  Before creating a new edge, we always search the twinList for any edges that already represent the edge we're looking for.
     */
    for(var i = 0; i < this.faces.length; i++) {
	var faceEdges = [];
	face = this.faces[i];
	face.sortVertices();
	//for all vertices in the face
	for(var j = 0; j < face.vertices.length; j++) {
	    if(this.twinList) {
		for(var k = 0; k < this.twinList.length; k++) {
		    //loop over all existing edges created as twins
		    if (face.vertices[j] == twinList[k].origin) {
			//if this vertex is the origin of a twin, use that twin
			twinList[k].face = face;
			face.edge = twinList[k];
			faceEdges.push(twinList[k]);
		    }
		    else {
			//if we can't find a twin that belong to this vertex, then create both the twin and new halfedge from scratch.
			var halfedge = new HalfEdge(face.vertices[j]);
			halfedge.face = face;
			face.edge = halfedge;
			faceEdges.push(halfedge);
			//create the twin
			var twin = new HalfEdge(this.vertices[(j+1) % this.vertices.length]);
			twin.face = undefined;
			twinList.push(twin);
		    }
		}
	    }
	    else {
		var halfedge = new HalfEdge(face.vertices[j]);
		halfedge.face = face;
		face.edge = halfedge;
		faceEdges.push(halfedge);
		//create the twin
		var twin = new HalfEdge(this.vertices[(j+1) % this.vertices.length]);
		twin.face = undefined;
		twinList.push(twin);
	    }
	}
	//and then add the next and previous pointers
	var edgeListLength = this.halfedges.length;
	for(var j = 0; j < edgeListLength; j++) {
	    console.log((j-1) % edgeListLength);
	    faceEdges[j].next = faceEdges[(((j+1) % edgeListLength) + edgeListLength) % edgeListLength];
	    faceEdges[j].prev = faceEdges[(((j-1) % edgeListLength) + edgeListLength) % edgeListLength];
	}
	this.halfedges.push(faceEdges);
    }
}
    
/* Example! */

//create vertices in a random order
a = new Vertex(0,-5);
b = new Vertex(0,5);
c = new Vertex(5,10);
d = new Vertex(5,-10);
e = new Vertex(-5,10);
f = new Vertex(-5,-10);

//create a face out of vertices
f = new Face();
f.addVertex(a);
f.addVertex(c);
f.addVertex(b);
f.addVertex(d);
g = new Face();
g.addVertex(a);
g.addVertex(b);
g.addVertex(e);
g.addVertex(f);
geo = new GeometryManager([f,g]);
geo.makeEdges();
