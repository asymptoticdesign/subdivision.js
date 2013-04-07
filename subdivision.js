/*
 * subdivision.js
 * author: nathan lachenmyer <scottnla AT mit DOT edu>
 * last updated: March 2013
 * version: 0.1
 * 
 * A javascript library for computational geometry.
 */

//input data 
function Vertex(x, y) {
    this.x = x;
    this.y = y;
}

function Edge(vertexA, vertexB) {
    this.a = vertexA;
    this.b = vertexB;
}

function Face() {
    this.vertices = [];
    this.centroid = null;
}

Face.prototype.addVertex = function(vertex) {
    this.vertices.push(vertex);
}

function HalfEdge(vertex) {
    this.origin = vertex;
    this.face = null;
    this.twin = null;
    this.next = null;
    this.nextVertex = null;
    this.prev = null;
}

function GeometryManager() {
    /*
     * A class that manages the global vertex / edge / face space, subdivision, etc.
     */
    this.faces = [];
    this.vertices = [];
    this.halfedges = [];
}

GeometryManager.prototype.addVertex = function(x, y) {
    this.vertices.push(new Vertex(x,y));
}

GeometryManager.prototype.makeEdges = function(faceList) {
}

GeometryManager.prototype.computeCentroid = function(vertices) {
    /*
     * Compute the centroid of a set of vertices
     */
    var numVertices = vertices.length;
    var centroid_x = 0;
    var centroid_y = 0;
    for(var i = 0; i < numVertices; i++) {
	centroid_x += vertices[i].x;
	centroid_y += vertices[i].y;
    }
    centroid_x /= numVertices;
    centroid_y /= numVertices;
    var centroid = new Vertex(centroid_x, centroid_y);
    return centroid;
}

GeometryManager.prototype.sortVertices = function(referenceVertex, vertices) {
    /*
     * Sort the vertices in counterclockwise order relative to a reference vertex.  By definition, the reference is the first
     * element in the set.
     */
    var vertexList = [];
    var angleList = [];
    for(var i = 0; i < vertices.length; i++) {
	if(referenceVertex !== vertices[i]) {
	    //the x difference is flipped because the canvas' coordinate system is upside down.
	    var angleFromReference = Math.atan2(vertices[i].y - referenceVertex.y, referenceVertex.x - vertices[i].x) + Math.PI;
	    //create a pair of vertex-angle objects forsorting
	    angleList.push([vertices[i], angleFromReference]);
	}
    }
    angleList.sort(function(a,b) {return a[1] - b[1];});
    for(var i = 0; i < angleList.length; i++) {
	vertexList.push(angleList[i][0]);
    }
    vertexList.unshift(referenceVertex);
    return vertexList;
}

GeometryManager.prototype.computeAngle = function(vertex0, vertex1, vertex2) {
    /*
     * Compute the polar angle (in radians) between (v0,v1) and (v1,v2).
     */
    var vecA = { x: vertex1.x - vertex0.x,
		 y: vertex1.y - vertex0.y
	       };
    var vecB = { x: vertex2.x - vertex1.x,
		 y: vertex2.y - vertex1.y
	       };
    var dotProduct = vecA.x*vecB.x + vecA.y*vecB.y;
    dotProduct /= (Math.sqrt(vecA.x*vecA.x + vecA.y*vecA.y) * Math.sqrt(vecB.x*vecB.x + vecB.y*vecB.y));
    var angle = Math.acos(dotProduct);
    return angle;
}

GeometryManager.prototype.isConvex = function(vertex0, vertex1, vertex2) {
    /*
     * Determines if 3 points are convex by computing the determinant of the two vectors (v0,v1) and (v0,v2).
     * This assumes that the points are in a counterclockwise ordering (such as sorted by sortVertices()).
     * Returns true if the points form a convex set, and false if they are colinear or not convex.
     */
    var determinant = vertex0.x*vertex1.y + vertex1.x*vertex2.y + vertex2.x*vertex0.y - vertex2.x*vertex1.y - vertex1.x*vertex0.y - vertex0.x*vertex2.y;
    if(determinant > 0) {
	return true;
    }
    else {
	return false;
    }
}

GeometryManager.prototype.computeExtremePoint = function(vertices) {
    var extremePoint = vertices[0];
    for(var i = 1; i < vertices.length; i++) {
	if(vertices[i].x > extremePoint.x) {
	    extremePoint = vertices[i];
	}
    }
    return extremePoint;
}

GeometryManager.prototype.jarvisMarch = function() {
    /*
     * Uses Jarvis' March to compute the convex hull.
     */

    var pointsOnHull = [];
    pointsOnHull.push(this.computeExtremePoint(this.vertices));

    var minAngle = 2*Math.PI;
    var polarAngle;
    //begin march by finding the point with the smallest polar angle relative to ((0,0), v0).
    //this loop is done separately because the 0,0 vertex needs to be hard-coded.
    for(var i = 0; i < this.vertices.length; i++) {
	polarAngle = this.computeAngle({x: 0, y: 0}, pointsOnHull[0], this.vertices[i]);
	if(polarAngle < minAngle && this.vertices[i] !== pointsOnHull[0]) {
	    minAngle = polarAngle;
	    pointsOnHull[1] = this.vertices[i];
	}
    }

    //now that we have two initial points, generalize the above loop and go until the latest point is equal to our initial point.
    var hullCounter = pointsOnHull.length - 1;
    while(pointsOnHull[0] !== pointsOnHull[pointsOnHull.length - 1]) {
	minAngle = 2*Math.PI;
	for(var i = 0; i < this.vertices.length; i++) {
	    polarAngle = this.computeAngle(pointsOnHull[hullCounter - 1], pointsOnHull[hullCounter], this.vertices[i]);
	    if(polarAngle < minAngle && this.vertices[i] !== pointsOnHull[pointsOnHull.length - 1]) {
		minAngle = polarAngle;
		pointsOnHull[hullCounter + 1] = this.vertices[i];
	    }
	}
	hullCounter++;
    }

    return pointsOnHull;
}

GeometryManager.prototype.grahamScan = function() {
    /*
     * Use Graham's Scan algorithm to compute the two-dimensional convex hull.
     */
    var extremePoint = this.computeExtremePoint(this.vertices);
    var pointsOnHull = this.sortVertices(extremePoint, this.vertices);
    //add extreme point at the end to complete the cycle.
    pointsOnHull.push(extremePoint);

    console.log("Number of vertices: " + this.vertices.length);
    //cycle through the vertices, determining if each point is convex or not.
    var hullCounter = 1;
    while(hullCounter < pointsOnHull.length - 1) {
	if(this.isConvex(pointsOnHull[hullCounter - 1],
				 pointsOnHull[hullCounter],
				 pointsOnHull[hullCounter + 1])) {
	    pointsOnHull.splice(hullCounter,1);
	    hullCounter--;
	}
	else {
	    hullCounter++;
	}
    }
    return pointsOnHull;
}

GeometryManager.prototype.quickHull = function() {
}

/*
 * Non-geometry related utility functions
 */
function clamp(value,min,max) {
    return Math.max(min, Math.min(value,max));
}