function testConvexHull2D() {
    var canvas = document.getElementById("convexhull");
    var ctx = canvas.getContext("2d");

    var geo = new GeometryManager();
    var numPoints = 20;
    for(var i = 0; i < numPoints; i++) {
	geo.addVertex(canvas.width*Math.random(), canvas.height*Math.random());
    }
    var hull = geo.jarvisMarch();
    //var hull = geo.grahamScan();

    //draw solution
    var radius = 5;
    
    ctx.fillStyle = "#000000";

    for(var i = 0; i < geo.vertices.length; i++) {
	ctx.beginPath();
	ctx.arc(geo.vertices[i].x, geo.vertices[i].y, radius, 0, 2*Math.PI);
	ctx.fill();
    }

    ctx.fillStyle = "#FF0000";
    ctx.beginPath();
    ctx.arc(hull[0].x, hull[0].y, radius, 0, 2*Math.PI);
    ctx.fill();

    for(var i = 0; i < hull.length - 1; i++) {
	ctx.strokeStyle = "#00FF00";
	ctx.moveTo(hull[i].x, hull[i].y);
	ctx.lineTo(hull[i+1].x, hull[i+1].y);
	ctx.stroke();
    }
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

function testConvex() {
    console.log("Convexity Tests");
    console.log("Should be true: " + testConvexTrue());
    console.log("Should be false: " + testConvexFalse());
}