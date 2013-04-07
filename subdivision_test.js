/* Example! */

function testConvexHull2D(geo) {
    geo.addVertex(a);
    geo.addVertex(b);
    geo.addVertex(c);
    geo.addVertex(d);
    geo.addVertex(e);
    geo.addVertex(f);
//    var hull = geo.jarvisMarch();
    var hull = geo.grahamScan();
    console.log(hull);
}

function testConvexTrue() {
    g = new GeometryManager();
    p = new Vertex(0,0);
    q = new Vertex(3,3);
    r = new Vertex(3,6);
    return g.isConvex(p,q,r);
}

function testConvexFalse() {
    g = new GeometryManager();
    p = new Vertex(0,0);
    q = new Vertex(3,3);
    r = new Vertex(6,3);
    return g.isConvex(p,q,r);
}



geo = new GeometryManager();
a = new Vertex(0,-5);
b = new Vertex(0,5);
c = new Vertex(5,10);
d = new Vertex(5,-10);
e = new Vertex(-5,10);
f = new Vertex(-5,-10);
//testConvexHull2D();
console.log("Convexity Tests");
console.log(testConvexTrue());
console.log(testConvexFalse());