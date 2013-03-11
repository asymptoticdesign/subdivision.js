/*
 * subdivision.js
 * author: nathan lachenmyer <scottnla AT mit DOT edu>
 * last updated: 2013 March 13
 * version: 0.1
 * 
 * A javascript library for computational geometry.
 */

function Vertex() {
    this.x = arguments[0];
    this.y = arguments[1];
    this.halfedge;
    this.angleFromCentroid;
}

function Face() {
    this.vertices = new Array();
    this.centroid;
}

Face.prototype.addVertex = function(vertex) {
    this.vertices.push(vertex);
    return vertex;
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
    for(var i = 0; i < this.vertices.length; i++) {
	//An extra PI is added to ensure all angles are positive.  This makes comparison a bit easier.
	this.vertices[i].angleFromCentroid = Math.atan2(this.vertices[i].y - this.centroid.y, this.vertices[i].x - this.centroid.x) + Math.PI;
    }
    this.vertices.sort(function(a,b) {return (a.angleFromCentroid - b.angleFromCentroid)});
}


/* Example! */

//create vertices in a random order
a = new Vertex(0,0);
b = new Vertex(1,5);
c = new Vertex(9,8);
d = new Vertex(4,-1);

//create a face out of vertices
f = new Face();
f.addVertex(a);
f.addVertex(c);
f.addVertex(b);
f.addVertex(d);
console.log(f.vertices);
f.sortVertices();
console.log(f.vertices);
