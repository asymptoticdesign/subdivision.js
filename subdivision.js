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
}

function Edge(_vertexA, _vertexB) {
    this.a = _vertexA;
    this.b = _vertexB;
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
    /*
     * Implementation of a basic proportional subdivision algorithm.
     */
}

function HalfEdge(_vertex) {
    this.origin = _vertex;
    this.face;
    this.twin;
    this.next;
    this.prev;
}

function GeometryManager() {
    /*
     * A class that manages the global vertex / edge / face space, subdivision, etc.
     * This stores data as a doubly-conneted edge list.
     */
    this.faces = [];
    this.vertices = [];
    this.edges = [];
    this.halfedges = [];
}

GeometryManager.prototype.makeEdges = function(_vertexList, _edgeList) {
    /*
     * Creates the half-edge data structure from a graph (vertices and edges).
     */
    
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
