/* Example! */

//create vertices in a random order
geo = new GeometryManager();
a = new Vertex(0,-5);
b = new Vertex(0,5);
c = new Vertex(5,10);
d = new Vertex(5,-10);
e = new Vertex(-5,10);
f = new Vertex(-5,-10);

function testFace() {
    q = new Face();
    q.addVertex(a);
    q.addVertex(c);
    q.addVertex(b);
    q.addVertex(d);
    p = new Face();
    p.addVertex(a);
p.addVertex(b);
    p.addVertex(e);
    p.addVertex(f);
    geo.makeEdges([q,p]);
    for(var i = 0; i < geo.halfedges.length; i++) {
	console.log(geo.halfedges[i].twin);
    }
}

function testConvexHull2D() {
    geo.addVertex(a);
    geo.addVertex(b);
    geo.addVertex(c);
    geo.addVertex(d);
    geo.addVertex(e);
    geo.addVertex(f);
    geo.makeConvexHull2D();
}
