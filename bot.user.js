// ==UserScript==
// @name         Slither.io-rexxxdaor-bot
// @namespace    http://slither.io/
// @version      1.1.0
// @description  Slither.io bot
// @author       Alexander Trofimov, Ermiya Eskandary, Théophile  Cailliau
// @match        http://slither.io/

// @grant        none
// ==/UserScript==

     // TODO what does window scale mean?

window.scores = [];



// Given an object (of which properties xx and yy are not null), return the object with an additional property 'distance'
window.getDistanceFromMe = function(point) {
    if (point === null) return null;
    point.distance = window.getDistance(window.getX(), window.getY(), point.xx, point.yy);
    return point;
};

// Custom logging function - disabled by default
window.log = function() {
    if (window.logDebugging) {
        console.log.apply(console, arguments);
    }

};
window.getX = function() {
    return window.snake.xx;
};
window.getY = function() {
    return window.snake.yy;
};

window.getPos = function() {
    return {x:window.getX(), y:window.getY()};
};

window.getSnakeLength = function() {
    return (Math.floor(150 * (window.fpsls[window.snake.sct] + window.snake
                              .fam /
                              window.fmlts[window.snake.sct] - 1) - 50) / 10);
};

window.getSnakeWidthSqr = function(sc) {
    sc = sc || window.snake.sc;
    var width = window.getSnakeWidth();
    return width*width;
};
window.getX = function() {
    return window.snake.xx;
};
window.getY = function() {
    return window.snake.yy;
};

window.getPos = function() {
    return {x:window.getX(), y:window.getY()};
};

window.log = function () {
    
        console.log.apply(console, arguments);
   
};
window.getWidth = function() {
    return window.ww;
};
window.getHeight = function() {
    return window.hh;
};

window.getSnakeLength = function() {
    return (Math.floor(150 * (window.fpsls[window.snake.sct] + window.snake.fam / window.fmlts[window.snake.sct] - 1) - 50) / 10);
};


window.getX = function() {
    return window.snake.xx;
};
window.getY = function() {
    return window.snake.yy;
};
var customBotOptions = {
    // target fps
    // size of arc for collisionAngles
    // arcSize: Math.PI / 8,
    // radius multiple for circle intersects
    // radiusMult: 10,
    // food cluster size to trigger acceleration
    // foodAccelSize: 60,
    // maximum angle of food to trigger acceleration
    // foodAccelAngle:  Math.PI / 3,
    // how many frames per food check
    // foodFrames: 4,
    // round food cluster size up to the nearest
    // foodRoundSize: 5,
    // round food angle up to nearest for angle difference scoring
    // foodRoundAngle: Math.PI / 8,
    // food clusters at or below this size won't be considered
    // if there is a collisionAngle
    // foodSmallSize: 10,
    // angle or higher where enemy heady is considered in the rear
    // rearHeadAngle: 3 * Math.PI / 4,
    // attack emeny rear head at this angle
    // rearHeadDir: Math.PI / 2,
    // quick radius toggle size in approach mode
    // radiusApproachSize: 5,
    // quick radius toggle size in avoid mode
    // radiusAvoidSize: 25,
    // uncomment to quickly revert to the default options
    // if you update the script while this is active,
    // you will lose your custom options
    // useDefaults: true
};

// Custom logging function - disabled by default
window.log = function() {
    if (window.logDebugging) {
        console.log.apply(console, arguments);
    }
};

var canvasUtil = window.canvasUtil = (function() {
    return {
        // Ratio of screen size divided by canvas size.
        canvasRatio: {
            x: window.mc.width / window.ww,
            y: window.mc.height / window.hh
        },
		mouseAngle: function(b){
			var mx = b.clientX-ww/2;
			var my = b.clientY-hh/2;
			return canvasUtil.fastAtan2(my,mx);
		},

        // Set direction of snake towards the virtual mouse coordinates
        setMouseCoordinates: function(point){
            window.xm = point.x;
            window.ym = point.y;
        },

        // Convert snake-relative coordinates to absolute screen coordinates.
        mouseToScreen: function(point) {
            var screenX = point.x + (window.ww / 2);
            var screenY = point.y + (window.hh / 2);
            return {
                x: screenX,
                y: screenY
            };
        },
        getScale: function() {
            return window.gsc;
        },
        // Convert screen coordinates to canvas coordinates.
        screenToCanvas: function(point) {
            var canvasX = window.csc *
                (point.x * canvasUtil.canvasRatio.x) - parseInt(window.mc.style.left);
            var canvasY = window.csc *
                (point.y * canvasUtil.canvasRatio.y) - parseInt(window.mc.style.top);
            return {
                x: canvasX,
                y: canvasY
            };
        },

        // Convert map coordinates to mouse coordinates.
        mapToMouse: function(point) {
            var mouseX = (point.x - window.snake.xx) * window.gsc;
            var mouseY = (point.y - window.snake.yy) * window.gsc;
            return {
                x: mouseX,
                y: mouseY
            };
        },
     // TODO what does window scale mean?
        // Map coordinates to Canvas coordinates.
        mapToCanvas: function(point) {
            var c = canvasUtil.mapToMouse(point);
            c = canvasUtil.mouseToScreen(c);
            c = canvasUtil.screenToCanvas(c);
            return c;
        },

        // Map to Canvas coordinates conversion for drawing circles.
        circleMapToCanvas: function(circle) {
            var newCircle = canvasUtil.mapToCanvas(circle);
            return canvasUtil.circle(
                newCircle.x,
                newCircle.y,
                // Radius also needs to scale by .gsc
                circle.radius * window.gsc
            );
        },

        // Constructor for point type
        point: function(x, y) {
            var p = {
                x: Math.round(x),
                y: Math.round(y)
            };

            return p;
        },

        // Constructor for rect type
        rect: function(x, y, w, h) {
            var r = {
                x: Math.round(x),
                y: Math.round(y),
                width: Math.round(w),
                height: Math.round(h)
            };

            return r;
        },
          getSnakeTail: function(snake) {
            var tailIndex = 0;
            for (var pts = 0, lp = snake.pts.length; pts < lp; pts++) {
                if (!snake.pts[pts].dying) {
                    tailIndex = pts;
                }
                else {
                    break;
                }
            }
            return snake.pts[tailIndex];
        },

        
    getSnakeScore: function(snake) {
            // Taken from slither.io code around 'Your length'
            return Math.floor(15 * (window.fpsls[snake.sct] +
                    snake.fam / window.fmlts[snake.sct] - 1) - 5) / 1;
        },
        // Constructor for circle type
        circle: function(x, y, r) {
            var c = {
                x: Math.round(x),
                y: Math.round(y),
                radius: Math.round(r)
            };

            return c;
        },
        // Fast atan2
        fastAtan2: function(y, x) {
            var r = 0.0;
            var angle = 0.0;
            var abs_y = Math.abs(y) + 1e-10;
            if (x < 0) {
                r = (x + abs_y) / (abs_y - x);
                angle = 3 * Math.PI / 4;
            } else {
                r = (x - abs_y) / (x + abs_y);
                angle = Math.PI / 4;
            }
            angle += (0.1963 * r * r - 0.9817) * r;
            if (y < 0) {
                return -angle;
            }

            return angle;
        },

        // Adjusts zoom in response to the mouse wheel.
        setZoom: function(e) {
            // Scaling ratio
            if (window.gsc) {
                window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
				window.desired_gsc = window.gsc;
                
            }
        },
     // TODO what does window scale mean?
        getScale: function() {
            return window.gsc;
        },

        // Restores zoom to the default value.
        resetZoom: function() {
            window.gsc = 0.9;
			window.desired_gsc = 0.7;
			
        },

        // Maintains Zoom		
        maintainZoom: function() {		
            if (window.desired_gsc !== undefined) {		
                window.gsc = window.desired_gsc;		
            }		
		},		
        // Sets background to the given image URL.
        // Defaults to slither.io's own background.
        setBackground: function(url) {
            url = typeof url !== 'undefined' ? url : '/s/bg45.jpg';
            window.ii.src = url;
			window.ii.onload();
        },

        // Draw a rectangle on the canvas.
        drawRect: function(rect, color, fill, alpha) {
            
            return 0;
            if (alpha === undefined) alpha = 1;

            var context = window.mc.getContext('2d');
            var lc = canvasUtil.mapToCanvas({
                x: rect.x,
                y: rect.y
            });

            context.save();
            context.globalAlpha = alpha;
            context.strokeStyle = color;
            context.rect(lc.x, lc.y, rect.width * window.gsc, rect.height * window.gsc);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },
getDistance: function(x1, y1, x2, y2) {
            // Calculate the vector coordinates.
            var xDistance = (x1 - x2);
            var yDistance = (y1 - y2);
            // Get the absolute value of each coordinate
            xDistance = xDistance < 0 ? xDistance * -1 : xDistance;
            yDistance = yDistance < 0 ? yDistance * -1 : yDistance;
            //Add the coordinates of the vector to get a distance. Not the real distance, but reliable for distance comparison.
            //var distance = xDistance + yDistance;
            // Real distance but not needed. Here for reference -
            // var distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

            var appSqrt = function(num) {
                var diff = 1;
                var cSquare = 1;
                
                //Looks for the closest number below the num that has roots
                while (diff > 0) {
                    diff = num - (cSquare * cSquare);
                    if (diff === 0) {
                        cSquare++;
                        break;
                    }
                    cSquare++;
                }
                cSquare--;
                diff = num - (cSquare * cSquare);
                return cSquare + (diff / (cSquare * 2));
            };
            var distance = appSqrt((xDistance * xDistance) + (yDistance * yDistance));
           
            return distance;
        },
        // Get distance squared
        getDistance2: function (x1, y1, x2, y2) {
            var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            return distance2;
        },
             isInsideAngle: function(point, startAngle, endAngle) {
            // calculate normalized vectors from angle
            var startAngleVector = {
                x: Math.cos(startAngle),
                y: Math.sin(startAngle)
            };
            var endAngleVector = {
                x: Math.cos(endAngle),
                y: Math.sin(endAngle)
            };
            // Use isBetweenVectors to check if the point belongs to the angle
            return canvasUtil.isBetweenVectors(point, startAngleVector, endAngleVector);
        },

        // Given two vectors, return a truthy/falsy value depending on their position relative to each other.
        areClockwise: function(vector1, vector2) {
            //Calculate the dot product.
            return -vector1.x * vector2.y + vector1.y * vector2.x > 0;
        },

        // Screen to Canvas coordinate conversion - used for collision detection
        collisionScreenToCanvas: function(circle) {
            var newCircle = canvasUtil.mapToMouse(circle.x, circle.y);
            newCircle = canvasUtil.mouseToScreen(newCircle[0], newCircle[1]);
            newCircle = canvasUtil.screenToCanvas(newCircle[0], newCircle[1]);
            return {
                x: newCircle[0],
                y: newCircle[1],
                radius: circle.radius
            };
        },

        getDistance2FromSnake: function (point) {
            point.distance = canvasUtil.getDistance2(window.snake.xx, window.snake.yy,
                point.xx, point.yy);
            return point;
        },
   // Convert screen coordinates to canvas coordinates.
        screenToCanvas: function(point) {
            var canvasX = window.csc *
                (point.x * canvasUtil.canvasRatio.x) - parseInt(window.mc.style.left);
            var canvasY = window.csc *
                (point.y * canvasUtil.canvasRatio.y) - parseInt(window.mc.style.top);
            return {
                x: canvasX,
                y: canvasY
            };
        },

        // Draw a circle on the canvas.
        drawCircle: function(circle, color, fill, alpha) {
           return 0;
            if (alpha === undefined) alpha = 1;
            if (circle.radius === undefined) circle.radius = 5;

            var context = window.mc.getContext('2d');
            var drawCircle = canvasUtil.circleMapToCanvas(circle);

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.strokeStyle = color;
            context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, 0, Math.PI * 2);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw an angle.
        // @param {number} start -- where to start the angle
        // @param {number} angle -- width of the angle
        // @param {String|CanvasGradient|CanvasPattern} color
        // @param {boolean} fill
        // @param {number} alpha
        drawAngle: function(start, angle, arcradius, color, fill, alpha) {
            if (alpha === undefined) alpha = 0.6;

            var context = window.mc.getContext('2d');

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.strokeStyle = color;
            context.moveTo(window.mc.width / 2, window.mc.height / 2);
            context.arc(window.mc.width / 2, window.mc.height / 2, arcradius * window.gsc, start, angle);
            context.lineTo(window.mc.width / 2, window.mc.height / 2);
            context.closePath();
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw a line on the canvas.
        drawLine: function(p1, p2, color, width) {
            if (width === undefined) width = 0;

            var context = window.mc.getContext('2d');
            var dp1 = canvasUtil.mapToCanvas(p1);
            var dp2 = canvasUtil.mapToCanvas(p2);

            context.save();
            context.beginPath();
            context.lineWidth = width * window.gsc;
            context.strokeStyle = color;
            context.moveTo(dp1.x, dp1.y);
            context.lineTo(dp2.x, dp2.y);
            context.stroke();
            context.restore();
        },

        // Given the start and end of a line, is point left.
        isLeft: function(start, end, point) {
            return ((end.x - start.x) * (point.y - start.y) -
                (end.y - start.y) * (point.x - start.x)) > 0;

        },
// Get distance squared
  getDistance: function(x1, y1, x2, y2) {
            var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            return distance2;
        },
        // Get distance squared
        getDistance2: function(x1, y1, x2, y2) {
            var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            return distance2;
        },

        getDistance2FromSnake: function(point) {
            point.distance = canvasUtil.getDistance2(window.snake.xx, window.snake.yy,
                point.xx, point.yy);
            return point;
        },

        // Check if point in Rect
        pointInRect: function(point, rect) {
            if (rect.x <= point.x && rect.y <= point.y &&
                rect.x + rect.width >= point.x && rect.y + rect.height >= point.y) {
                return true;
            }
            return false;
        },
       // return unit vector in the direction of the argument
        unitVector: function (v) {
            var l = Math.sqrt(v.x * v.x + v.y * v.y);
            if (l > 0) {
                return {
                    x: v.x / l,
                    y: v.y / l
                };
            } else {
                return {
                    x: 0,
                    y: 0
                };
            }
        },
   // check if point is in polygon
        pointInPoly: function (point, poly) {
            if (point.x < poly.minx || point.x > poly.maxx ||
                point.y < poly.miny || point.y > poly.maxy) {
                return false;
            }
            let c = false;
            const l = poly.pts.length;
            for (let i = 0, j = l - 1; i < l; j = i++) {
                if ( ((poly.pts[i].y > point.y) != (poly.pts[j].y > point.y)) &&
                    (point.x < (poly.pts[j].x - poly.pts[i].x) * (point.y - poly.pts[i].y) /
                        (poly.pts[j].y - poly.pts[i].y) + poly.pts[i].x) ) {
                    c = !c;
                }
            }
            return c;
        },

        addPolyBox: function (poly) {
            var minx = poly.pts[0].x;
            var maxx = poly.pts[0].x;
            var miny = poly.pts[0].y;
            var maxy = poly.pts[0].y;
            for (let p = 1, l = poly.pts.length; p < l; p++) {
                if (poly.pts[p].x < minx) {
                    minx = poly.pts[p].x;
                }
                if (poly.pts[p].x > maxx) {
                    maxx = poly.pts[p].x;
                }
                if (poly.pts[p].y < miny) {
                    miny = poly.pts[p].y;
                }
                if (poly.pts[p].y > maxy) {
                    maxy = poly.pts[p].y;
                }
            }
            return {
                pts: poly.pts,
                minx: minx,
                maxx: maxx,
                miny: miny,
                maxy: maxy
            };
        },

        cross: function (o, a, b) {
            return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
        },

        convexHullSort: function (a, b) {
            return a.x == b.x ? a.y - b.y : a.x - b.x;
        },
        getSnakeTa1il: function(snake) {
            var tailIndex = 0;
            for (var pts = 0, lp = snake.pts.length; pts < lp; pts++) {
                if (!snake.pts[pts].dying) {
                    tailIndex = pts;
                }
                else {
                    break;
                }
            }
            return snake.pts[tailIndex];
        },
        getSnakeSc2ore: function(snake) {
            // Taken from slither.io code around 'Your length'
            return Math.floor(15 * (window.fpsls[snake.sct] +
                    snake.fam / window.fmlts[snake.sct] - 1) - 5) / 1;
        },
                convexHull: function (points) {
            points.sort(canvasUtil.convexHullSort);

            var lower = [];
            for (let i = 0, l = points.length; i < l; i++) {
                while (lower.length >= 2 && canvasUtil.cross(
                    lower[lower.length - 2], lower[lower.length - 1], points[i]) <= 0) {
                    lower.pop();
                }
                lower.push(points[i]);
            }

            var upper = [];
            for (let i = points.length - 1; i >= 0; i--) {
                while (upper.length >= 2 && canvasUtil.cross(
                    upper[upper.length - 2], upper[upper.length - 1], points[i]) <= 0) {
                    upper.pop();
                }
                upper.push(points[i]);
            }

            upper.pop();
            lower.pop();
            return lower.concat(upper);
        },
     // Constructor for circle type
        circle3: function (x, y, r) {
            var c = {
                x: Math.round(x),
                y: Math.round(y),
                radius: Math.round(r)
            };

            return c;
        },
       // Ratio of screen size divided by canvas size.
        canvasRatio: {
            x: window.mc.width / window.ww,
            y: window.mc.height / window.hh
        },
		mouseAngle: function(b){
			var mx = b.clientX-ww/2;
			var my = b.clientY-hh/2;
			return canvasUtil.fastAtan2(my,mx);
		},

        // Set direction of snake towards the virtual mouse coordinates
        setMouseCoordinates: function(point){
            window.xm = point.x;
            window.ym = point.y;
        },

        // Convert snake-relative coordinates to absolute screen coordinates.
        mouseToScreen: function(point) {
            var screenX = point.x + (window.ww / 2);
            var screenY = point.y + (window.hh / 2);
            return {
                x: screenX,
                y: screenY
            };
        },

        // Convert screen coordinates to canvas coordinates.
        screenToCanvas: function(point) {
            var canvasX = window.csc *
                (point.x * canvasUtil.canvasRatio.x) - parseInt(window.mc.style.left);
            var canvasY = window.csc *
                (point.y * canvasUtil.canvasRatio.y) - parseInt(window.mc.style.top);
            return {
                x: canvasX,
                y: canvasY
            };
        },

        // Convert map coordinates to mouse coordinates.
        mapToMouse: function(point) {
            var mouseX = (point.x - window.snake.xx) * window.gsc;
            var mouseY = (point.y - window.snake.yy) * window.gsc;
            return {
                x: mouseX,
                y: mouseY
            };
        },

        // Map coordinates to Canvas coordinates.
        mapToCanvas: function(point) {
            var c = canvasUtil.mapToMouse(point);
            c = canvasUtil.mouseToScreen(c);
            c = canvasUtil.screenToCanvas(c);
            return c;
        },

        // Map to Canvas coordinates conversion for drawing circles.
        circleMapToCanvas: function(circle) {
            var newCircle = canvasUtil.mapToCanvas(circle);
            return canvasUtil.circle(
                newCircle.x,
                newCircle.y,
                // Radius also needs to scale by .gsc
                circle.radius * window.gsc
            );
        },

        // Constructor for point type
        point: function(x, y) {
            var p = {
                x: Math.round(x),
                y: Math.round(y)
            };

            return p;
        },

        // Constructor for rect type
        rect: function(x, y, w, h) {
            var r = {
                x: Math.round(x),
                y: Math.round(y),
                width: Math.round(w),
                height: Math.round(h)
            };

            return r;
        },

        // Constructor for circle type
        circle: function(x, y, r) {
            var c = {
                x: Math.round(x),
                y: Math.round(y),
                radius: Math.round(r)
            };

            return c;
        },
        // Fast atan2
        fastAtan2: function(y, x) {
            var r = 0.0;
            var angle = 0.0;
            var abs_y = Math.abs(y) + 1e-10;
            if (x < 0) {
                r = (x + abs_y) / (abs_y - x);
                angle = 3 * Math.PI / 4;
            } else {
                r = (x - abs_y) / (x + abs_y);
                angle = Math.PI / 4;
            }
            angle += (0.1963 * r * r - 0.9817) * r;
            if (y < 0) {
                return -angle;
            }

            return angle;
        },

        // Adjusts zoom in response to the mouse wheel.
        setZoom: function(e) {
            // Scaling ratio
            if (window.gsc) {
                window.gsc *= Math.pow(0.9, e.wheelDelta / -120 || e.detail / 2 || 0);
				window.desired_gsc = window.gsc;
                
            }
        },

        // Restores zoom to the default value.
        resetZoom: function() {
            window.gsc = 0.9;
			window.desired_gsc = 0.9;
			
        },

        // Maintains Zoom		
        maintainZoom: function() {		
            if (window.desired_gsc !== undefined) {		
                window.gsc = window.desired_gsc;		
            }		
		},		
        // Sets background to the given image URL.
        // Defaults to slither.io's own background.
        setBackground: function(url) {
            url = typeof url !== 'undefined' ? url : '/s/bg45.jpg';
            window.ii.src = url;
			window.ii.onload();
        },

        // Draw a rectangle on the canvas.
        drawRect: function(rect, color, fill, alpha) {
            if (alpha === undefined) alpha = 1;

            var context = window.mc.getContext('2d');
            var lc = canvasUtil.mapToCanvas({
                x: rect.x,
                y: rect.y
            });

            context.save();
            context.globalAlpha = alpha;
            context.strokeStyle = color;
            context.rect(lc.x, lc.y, rect.width * window.gsc, rect.height * window.gsc);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw a circle on the canvas.
        drawCircle: function(circle, color, fill, alpha) {
            if (alpha === undefined) alpha = 1;
            if (circle.radius === undefined) circle.radius = 5;

            var context = window.mc.getContext('2d');
            var drawCircle = canvasUtil.circleMapToCanvas(circle);

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.strokeStyle = color;
            context.arc(drawCircle.x, drawCircle.y, drawCircle.radius, 0, Math.PI * 2);
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw an angle.
        // @param {number} start -- where to start the angle
        // @param {number} angle -- width of the angle
        // @param {String|CanvasGradient|CanvasPattern} color
        // @param {boolean} fill
        // @param {number} alpha
        drawAngle: function(start, angle, arcradius, color, fill, alpha) {
            if (alpha === undefined) alpha = 0.6;

            var context = window.mc.getContext('2d');

            context.save();
            context.globalAlpha = alpha;
            context.beginPath();
            context.strokeStyle = color;
            context.moveTo(window.mc.width / 2, window.mc.height / 2);
            context.arc(window.mc.width / 2, window.mc.height / 2, arcradius * window.gsc, start, angle);
            context.lineTo(window.mc.width / 2, window.mc.height / 2);
            context.closePath();
            context.stroke();
            if (fill) {
                context.fillStyle = color;
                context.fill();
            }
            context.restore();
        },

        // Draw a line on the canvas.
        drawLine: function(p1, p2, color, width) {
            if (width === undefined) width = 5;

            var context = window.mc.getContext('2d');
            var dp1 = canvasUtil.mapToCanvas(p1);
            var dp2 = canvasUtil.mapToCanvas(p2);

            context.save();
            context.beginPath();
            context.lineWidth = width * window.gsc;
            context.strokeStyle = color;
            context.moveTo(dp1.x, dp1.y);
            context.lineTo(dp2.x, dp2.y);
            context.stroke();
            context.restore();
        },

        // Given the start and end of a line, is point left.
        isLeft: function(start, end, point) {
            return ((end.x - start.x) * (point.y - start.y) -
                (end.y - start.y) * (point.x - start.x)) > 0;

        },

        // Get distance squared
        getDistance2: function(x1, y1, x2, y2) {
            var distance2 = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            return distance2;
        },

        getDistance2FromSnake: function(point) {
            point.distance = canvasUtil.getDistance2(window.snake.xx, window.snake.yy,
                point.xx, point.yy);
            return point;
        },
        // Check if circles intersect
        circleIntersect: function(circle1, circle2, squareOnly) {
			if (squareOnly === undefined) squareOnly = false;

            var bothRadii = circle1.radius + circle2.radius;
            var dx = circle1.x - circle2.x;
            var dy = circle1.y - circle2.y;
			var distance2=0;

            // Pretends the circles are squares for a quick collision check.
            // If it collides, do the more expensive circle check.
            if (dx + bothRadii > 0 && dy + bothRadii > 0 &&
                dx - bothRadii < 0 && dy - bothRadii < 0) {
				if (!squareOnly)
					distance2 = canvasUtil.getDistance2(circle1.x, circle1.y, circle2.x, circle2.y);

                if (squareOnly||distance2 < bothRadii * bothRadii) {
                    if (window.visualDebugging) {
                        var collisionPointCircle = canvasUtil.circle(
                            ((circle1.x * circle2.radius) + (circle2.x * circle1.radius)) /
                            bothRadii,
                            ((circle1.y * circle2.radius) + (circle2.y * circle1.radius)) /
                            bothRadii,
                            5
                        );
                    }
                    return true;
                }
            }
            return false;
        }
    };
})();
// A 2D vector utility

var bot = window.bot = (function() {
    return {

        stage: 'grow',
	
        manualFood: false,
		isCollision: 0,
		holdCollision: 10,
		fencingSnake: 0,
		targetAcceleration: 0,
		arcSize: Math.PI / 20,
		mGoToAngle: Math.PI,
		mouseFollow: false,
		predatorMode: true,
		isBotRacer: false,
		doRedraw: true,
		resetZoomOnLowFPS: false,
		lookForSnakeDelayCnt: 0,
		lookForSnakeDelay: 50,
		isHunting: false,
		targetSnake: 0,
		minPredatorRadius: 5,
        isBotRunning: false,
        isBotEnabled: true,
        lookForFood: false,
		lowFPS: false,
        collisionAngles: [],
        scores: [],
        foodTimeout: undefined,
        sectorBoxSide: 0,
        defaultAccel: 0,
        sectorBox: {},
        currentFood: {},
		foodAccelDist2: 200000,
		foodAccelSize: 150,
        foodFrames: 1,
		accelAngle: Math.PI / 2.5,
          isBotRunning: false,
        isBotEnabled: true,
        stage: 'grow',
        collisionPoints: [],
        collisionAngles: [],
        foodAngles: [],
        scores: [],
        foodTimeout: undefined,
        sectorBoxSide: 0,
        defaultAccel: 0,
        sectorBox: {},
        currentFood: {},
        opt: {
            // These are the bot's default options
            // If you wish to customise these, use
            // customBotOptions above
			radiusMult: 10,
            targetFps: 30,
            // how many frames to delay action after collision
            collisionDelay: 10,
            // base speed
            speedBase: 5.78,
            // front angle size
            frontAngle: Math.PI / 2.5,
            // percent of angles covered by same snake to be considered an encircle attempt
            enCircleThreshold: 0.5625,
            // percent of angles covered by all snakes to move to safety
            enCircleAllThreshold: 0.5625,
            // distance multiplier for enCircleAllThreshold
            enCircleDistanceMult: 20,
            // snake score to start circling on self
            // direction for followCircle: +1 for counter clockwise and -1 for clockwise
            followCircleDirection: +1,
            foodRoundSize: 14,
            foodRoundAngle: Math.PI / 8,
            foodSmallSize: 15,
            rearHeadAngle: 3 * Math.PI / 2.5,
            rearHeadDir: Math.PI / 4,
            radiusApproachSize: 33,
            radiusAvoidSize: 22,

      //      foodRoundSize: 5,
  //          foodRoundAngle: Math.PI / 8,
      //      foodSmallSize: 10,
//rearHeadAngle: 3 * Math.PI / 4,
     //       rearHeadDir: Math.PI / 2,
     ////       radiusApproachSize: 3,
            // target fps
            // size of arc for collisionAngles
            arcSize: Math.PI / 8,
            // radius multiple for circle intersects
            // food cluster size to trigger acceleration
            // maximum angle of food to trigger acceleration
            foodAccelDa: Math.PI / 2,
            // how many frames per action
            foodAccelSz: 180,
            // maximum angle of food to trigger acceleration
            // how many frames per action
            actionFrames: 2,
            // how many frames to delay action after collision
            collisionDelay: 10,
            // how many frames to delay action after encircle
            encircleDelay: 10,
            // base speed
            speedBase: 5.78,
            frontAngle: Math.PI / 3,
            // percent of angles covered by same snake to be considered an encircle attempt
            enCircleThreshold: 0.5425,
            // percent of angles covered by all snakes to move to safety
            enCircleAllThreshold: 0.7,
            // distance multiplier for enCircleAllThreshold
            enCircleDistanceMult: 20,
            // snake score to start circling on self
            followCircleLength: 2500,
            // direction for followCircle: +1 for counter clockwise and -1 for clockwise
            followCircleDirection: +1
            // radius multiple for circle intersects
            // food cluster size to trigger acceleration
        },
        MID_X: 0,
        MID_Y: 0,
        MAP_R: 0,
		pingtime: '',
		checktime: 0,
		pingDelay: 0,

        getSnakeWidth: function(sc) {
            if (sc === undefined) sc = window.snake.sc;
            return Math.round(sc * 29.0);
        },

        quickRespawn: function() {
            window.dead_mtm = 0;
            window.login_fr = 0;

            bot.isBotRunning = false;
            window.forcing = true;
            window.connect();
            window.forcing = false;
        },

        indexBetween: function(i1, i2) {
			var iDiff = i2 - i1;
            if (iDiff > (2 * Math.PI) / bot.arcSize /2) 
				iDiff = iDiff - (2 * Math.PI) / bot.arcSize;
			else if (iDiff < -(2 * Math.PI) / bot.arcSize /2) 
				iDiff = (2 * Math.PI) / bot.arcSize - iDiff;

            return iDiff;
        },		
		
		
		calcAcceleration: function(a) {
					var tAccel = 1;
					var sang = window.snake.ehang;
					var aIndex1 = bot.getAngleIndex(sang);
					var aIndex2 = bot.getAngleIndex(a);
					
					if ((bot.collisionAngles[aIndex1] !== undefined && bot.collisionAngles[aIndex1].distance < Math.pow(bot.fullHeadCircleRadius , 2)))
					{
						return (bot.defaultAccel);					
					}
					if (bot.fencingSnake>0)
						return 1;

					var turnDir = bot.indexBetween(aIndex1, aIndex2);
					
					if ( Math.abs(turnDir) < bot.accelAngle / bot.arcSize)
					{
					
						
						if (turnDir < 0) 
							turnDir = -1;
						else
							turnDir = 1;
					
						var aIndex = aIndex1;
						while ((aIndex !== aIndex2 && aIndex1 !== aIndex2 || aIndex1 === aIndex2 && aIndex === aIndex1))
						{
							if ((bot.collisionAngles[aIndex] !== undefined && bot.collisionAngles[aIndex].distance < Math.pow(bot.fullHeadCircleRadius, 2)))
							{
								tAccel = bot.defaultAccel;
							}
							aIndex = aIndex + turnDir;
							if (aIndex1 !== aIndex2)
							{
								if (aIndex < 0) aIndex = (2 * Math.PI) / bot.arcSize - 1;
								if (aIndex > (2 * Math.PI) / bot.arcSize ) aIndex = 0;
							}
						}
						
					}
					else
						tAccel = bot.defaultAccel;
						
					return (tAccel);
		},
		
        // angleBetween - get the smallest angle between two angles (0-pi)
        angleBetween: function(a1, a2) {
            var r1 = Math.abs(a2-a1);
			if (r1 > Math.PI) r1 = 2 * Math.PI - r1;

            return r1;
        },

		

        // Change heading by ang
        // +0-pi turn left
        // -0-pi turn right

        changeHeading: function(angle) {
            var heading = {
                x: window.snake.xx + 500 * bot.cos,
                y: window.snake.yy + 500 * bot.sin
            };

            var cos = Math.cos(-angle);
            var sin = Math.sin(-angle);

            window.goalCoordinates = {
                x: Math.round(
                    cos * (heading.x - window.snake.xx) -
                    sin * (heading.y - window.snake.yy) + window.snake.xx),
                y: Math.round(
                    sin * (heading.x - window.snake.xx) +
                    cos * (heading.y - window.snake.yy) + window.snake.yy)
            };

            canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(window.goalCoordinates));
        },

        // Avoid collision with gotoAngle
        avoidCollision: function() {

				var headCircleRadius2 = Math.pow(bot.fullHeadCircleRadius/3, 2);
				
				//reduce speed first if collision

				if ((bot.targetAcceleration !== 1 && bot.speedMult > 2.1 && (bot.frontCollision ===0 || bot.frontCollision > headCircleRadius2 * 2)) )
				{
					return; 
				}

				
				var smalestDist=headCircleRadius2 * 2;
				var smalAng=-1;
				for (var i = 0; i < ((2 * Math.PI) / bot.arcSize); i++) {
								if (bot.collisionAngles[i] !== undefined && bot.collisionAngles[i].distance < headCircleRadius2) {						
									if (bot.collisionAngles[i].distance < smalestDist){
										smalestDist=bot.collisionAngles[i].distance;
										smalAng=i;
									}
								}
				}
				
				if (smalAng!==-1)
				{
				bot.avoidCollisionPoint(bot.collisionAngles[smalAng]);
				}
				
				window.goalCoordinates = {
										x: Math.round(window.snake.xx+bot.fullHeadCircleRadius*Math.cos(bot.gotoAngle)),
										y: Math.round(window.snake.yy+bot.fullHeadCircleRadius*Math.sin(bot.gotoAngle))
				};

				canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(window.goalCoordinates));

				
				return;
				
				

        },


 // Avoid collision point by ang
        // ang radians <= Math.PI (180deg)
        avoidCollisionPoint: function(collisionPoint, ang) {
            if (ang === undefined || ang > Math.PI) {
                ang = Math.PI;
            }

            var end = {
                x: window.snake.xx + 2000 * bot.cos,
                y: window.snake.yy + 2000 * bot.sin
            };

            if (window.visualDebugging) {
                canvasUtil.drawLine({
                    x: window.snake.xx,
                    y: window.snake.yy
                },
                    end,
                    'orange', 5);
                canvasUtil.drawLine({
                    x: window.snake.xx,
                    y: window.snake.yy
                }, {
                    x: collisionPoint.xx,
                    y: collisionPoint.yy
                },
                    'red', 5);
            }

            var cos = Math.cos(ang);
            var sin = Math.sin(ang);

            if (canvasUtil.isLeft({
                x: window.snake.xx,
                y: window.snake.yy
            }, end, {
                x: collisionPoint.xx,
                y: collisionPoint.yy
            })) {
                sin = -sin;
            }

            window.goalCoordinates = {
                x: Math.round(
                    cos * (collisionPoint.xx - window.snake.xx) -
                    sin * (collisionPoint.yy - window.snake.yy) + window.snake.xx),
                y: Math.round(
                    sin * (collisionPoint.xx - window.snake.xx) +
                    cos * (collisionPoint.yy - window.snake.yy) + window.snake.yy)
            };

            canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(window.goalCoordinates));
        },
        // Sorting by  property 'distance'
        sortDistance: function(a, b) {
            return a.distance - b.distance;
        },

        // get collision angle index, expects angle +/i 0 to Math.PI
        getAngleIndex: function(angle) {
            var index;

            if (angle < 0) {
                angle += 2 * Math.PI;
            }

            index = Math.round(angle * (1 / bot.arcSize));

            if (index === (2 * Math.PI) / bot.arcSize) {
                return 0;
            }
            return index;
        },

        // Add to collisionAngles if distance is closer
        addCollisionAngle: function(sp, collisionAngles) {
            var ang = canvasUtil.fastAtan2(
                (sp.yy - window.snake.yy),
                (sp.xx - window.snake.xx));
            var aIndex = bot.getAngleIndex(ang);
			sp.aIndex=aIndex;	
			
            var actualDistance = (Math.pow(
                Math.sqrt(sp.distance) - sp.radius, 2));

            if (collisionAngles[aIndex] === undefined) {
				collisionAngles[aIndex] = {
                    ang:  bot.arcSize * aIndex,
                    snake: sp.snake,
                    distance: actualDistance,
					xx: sp.xx,
					yy: sp.yy,
					isHead: sp.isHead
                };
            } else if (collisionAngles[aIndex].distance > sp.distance) {
                collisionAngles[aIndex].snake = sp.snake;
                collisionAngles[aIndex].distance = actualDistance;
				collisionAngles[aIndex].isHead = sp.isHead;
				collisionAngles[aIndex].xx = sp.xx;
				collisionAngles[aIndex].yy = sp.yy;
            }
        },

		//search snake to be hunted
		calcHuntTargetPoint: function() {
				var snake = bot.targetSnake;
                if (window.snakes[snake] !== undefined &&
                    window.snakes[snake].alive_amt === 1) {	

					
					if (window.snakes[snake].sp > 7) {
						bot.isHunting=false;
						bot.targetSnake=0;	
						return bot.defaultAccel;
						
					}
					scPoint = {
						xx: window.snakes[snake].xx,
						yy: window.snakes[snake].yy,
						snake: snake,
						radius: 1,
					};
					canvasUtil.getDistance2FromSnake(scPoint);
					var toSankeAng = canvasUtil.fastAtan2(
						window.snakes[snake].yy-window.snake.yy , window.snakes[snake].xx-window.snake.xx);
					var relAng = Math.abs(bot.angleBetween(window.snakes[snake].ang, toSankeAng));
					
					if (!(relAng > Math.PI / 2.2 && relAng < Math.PI /1.1)) {
					
						bot.isHunting=false;
						bot.targetSnake=0;	
						return bot.defaultAccel;
						
					}
					
					var offset = (bot.snakeRadius+10) * 1.2 + 60 + (Math.sqrt(scPoint.distance)) / ( bot.speedMult) / (Math.abs(relAng-Math.PI/1.5)+1) / 2;
					
					if (offset > 500) {
						bot.isHunting=false;
						bot.targetSnake=0;	
					
						return bot.defaultAccel;
						
					}
					
					var goalCoordinates = {
											x: (window.snakes[snake].xx+offset*Math.cos(window.snakes[snake].ang)),
											y: (window.snakes[snake].yy+offset*Math.sin(window.snakes[snake].ang))
					};
	
					var toPointAng = canvasUtil.fastAtan2(
						goalCoordinates.y-window.snake.yy , goalCoordinates.x-window.snake.xx);
					
					var aIndex = bot.getAngleIndex(toPointAng);
					var tAccel = bot.calcAcceleration(toPointAng);
					
					//if (tAccel === 1)
					{
						canvasUtil.drawCircle(canvasUtil.circle(
							goalCoordinates.x,
							goalCoordinates.y,
							30),
						'red', true);
						canvasUtil.drawCircle(canvasUtil.circle(
							goalCoordinates.x,
							goalCoordinates.y,
							150),
						'yellow', false);
						bot.currentFood=goalCoordinates;
						return tAccel;
					}
					
				}

				bot.isHunting=false;
				bot.targetSnake=0;		
				return bot.defaultAccel;
				
		
		},
		
		//search snake to be hunted
		getTargetSnake: function() {

			var scPoint;
			var huntCircleRadius2 = Math.pow(bot.fullHeadCircleRadius * 1.5, 2);
			var minHuntCircleRadius2 = Math.pow(bot.headCircleRadius * 1.5, 2);
            for (var snake = 0, ls = window.snakes.length; snake < ls; snake++) {
			
                if (window.snakes[snake].id !== window.snake.id &&
                    window.snakes[snake].alive_amt === 1) {

					if (window.snakes[snake].sc > 1.1 && window.snakes[snake].sp < 7)
					{
					
						
						var toSankeAng = canvasUtil.fastAtan2(
							window.snakes[snake].yy-window.snake.yy , window.snakes[snake].xx-window.snake.xx);

						scPoint = {
							xx: window.snakes[snake].xx,
							yy: window.snakes[snake].yy,
							snake: snake,
							radius: 1,
						};
						canvasUtil.getDistance2FromSnake(scPoint);

						if (scPoint.distance < huntCircleRadius2 && scPoint.distance > minHuntCircleRadius2 && Math.abs(bot.angleBetween(window.snake.ehang, toSankeAng)) < Math.PI /2  ) {
							var relAng = Math.abs(bot.angleBetween(window.snakes[snake].ang, toSankeAng));
	
						
							if (relAng > Math.PI / 2 && relAng < Math.PI /1.1) {
								bot.targetSnake=snake;
								bot.calcHuntTargetPoint();
								if (bot.targetSnake!==0)
								{
							
									if (window.visualDebugging && true) {
										canvasUtil.drawCircle(canvasUtil.circle(
												scPoint.xx,
												scPoint.yy,
												scPoint.radius*3),
											'red', true);
									}
									
									
									return true;
								}
							}
						}
					}
				}
			
			
			}
			bot.targetSnake=0;
			return false;
		
		},
		
		
        // Get closest collision point per snake.
        getCollision: function() {
            
			var scPoint;
			var pts, i,snakeLength;
			var collisionPoint;

            bot.collisionAngles = [];
			var collisionAnglesPred = [];
			var headCircleRadius2 = Math.pow(bot.headCircleRadius, 2);
			var fullHeadCircleRadius2 = Math.pow(bot.fullHeadCircleRadius, 2);
			if (bot.fencingSnake>0)
				bot.fencingSnake--;
			var escape_ang=-1;
			var snake_minX = window.snake.xx;
			var snake_maxX = window.snake.xx;
			var snake_minY = window.snake.yy;
			var snake_maxY = window.snake.yy;
			var predictMove=true;

			for (pts = 0, lp = window.snake.pts.length; pts < lp; pts++) {
				if (!window.snake.pts[pts].dying)
				{
					if (window.snake.pts[pts].xx < snake_minX) snake_minX = window.snake.pts[pts].xx;
					if (window.snake.pts[pts].xx > snake_maxX) snake_maxX = window.snake.pts[pts].xx;
					if (window.snake.pts[pts].yy < snake_minY) snake_minY = window.snake.pts[pts].yy;
					if (window.snake.pts[pts].yy > snake_maxY) snake_maxY = window.snake.pts[pts].yy;
				}
			}
            for (var snake = 0, ls = window.snakes.length; snake < ls; snake++) {
                scPoint = undefined;
				var fencingAngles = [];

                if (window.snakes[snake].id !== window.snake.id &&
                    window.snakes[snake].alive_amt === 1) {

					snakeLength=(window.snakes[snake].sct+5)*23;
					
                    scPoint = {
                        xx: window.snakes[snake].xx,
                        yy: window.snakes[snake].yy,
                        snake: snake,
                        radius: bot.getSnakeWidth(window.snakes[snake].sc) / 2,
						isHead: window.snakes[snake].sp
                    };
                    canvasUtil.getDistance2FromSnake(scPoint);
					{
					
						bot.addCollisionAngle(scPoint, bot.collisionAngles);
						fencingAngles[scPoint.aIndex]= 2;
						if (window.visualDebugging && false) {
							canvasUtil.drawCircle(canvasUtil.circle(
									scPoint.xx,
									scPoint.yy,
									scPoint.radius),
								'red', false);
						}
						
						if (scPoint.distance < fullHeadCircleRadius2 / 9 || (bot.targetSnake !== 0)) predictMove=false;	
						
						if (predictMove && scPoint.distance < fullHeadCircleRadius2 * 1.5 * 1.5)
						{
							
							var snakesp=Math.round((window.snakes[snake].sp+2) * (bot.snakeRadius+30)  / 200) + 1;
							var sncos = Math.cos(window.snakes[snake].ang);
							var snsin = Math.sin(window.snakes[snake].ang);
							var snradius=(bot.getSnakeWidth(window.snakes[snake].sc) +100)/ 30;
							for (var snp = 1; snp < snakesp; snp++) {

								collisionPoint = {
									xx: window.snakes[snake].xx + (snradius)*snp * sncos*6,
									yy: window.snakes[snake].yy+ (snradius)*snp * snsin*6,
									snake: snake,
									radius: (snradius+10) * (snp),
									isHead: window.snakes[snake].sp
								};

								if (window.visualDebugging && false) {
									canvasUtil.drawCircle(canvasUtil.circle(
											collisionPoint.xx,
											collisionPoint.yy,
											collisionPoint.radius),
										'red', false);
								}
								canvasUtil.getDistance2FromSnake(collisionPoint);
								bot.addCollisionAngle(collisionPoint, collisionAnglesPred);

							}
						}
					}

					if (scPoint.distance < snakeLength * snakeLength +fullHeadCircleRadius2 )
					{
						var snakes_minX = window.snakes[snake].xx;
						var snakes_maxX = window.snakes[snake].xx;
						var snakes_minY = window.snakes[snake].yy;
						var snakes_maxY = window.snakes[snake].yy;
						
							
						for (pts = 0, lp = window.snakes[snake].pts.length; pts < lp; pts++) {
							if (!window.snakes[snake].pts[pts].dying){
	/*						&&
								canvasUtil.pointInRect({
									x: window.snakes[snake].pts[pts].xx,
									y: window.snakes[snake].pts[pts].yy
								}, bot.sectorBox)) {
							

	*/						

								if (window.snakes[snake].pts[pts].xx < snakes_minX) snakes_minX = window.snakes[snake].pts[pts].xx;
								if (window.snakes[snake].pts[pts].xx > snakes_maxX) snakes_maxX = window.snakes[snake].pts[pts].xx;
								if (window.snakes[snake].pts[pts].yy < snakes_minY) snakes_minY = window.snakes[snake].pts[pts].yy;
								if (window.snakes[snake].pts[pts].yy > snakes_maxY) snakes_maxY = window.snakes[snake].pts[pts].yy;

								collisionPoint = {
									xx: window.snakes[snake].pts[pts].xx,
									yy: window.snakes[snake].pts[pts].yy,
									snake: snake,
									radius: bot.getSnakeWidth(window.snakes[snake].sc) / 2,
									isHead: 0
								};
								if (window.visualDebugging && false) {
									canvasUtil.drawCircle(canvasUtil.circle(
											collisionPoint.xx,
											collisionPoint.yy,
											collisionPoint.radius),
										'#00FF00', false);
								}
								canvasUtil.getDistance2FromSnake(collisionPoint);
								
								if (collisionPoint.distance>fullHeadCircleRadius2/2) 
								{
									var offst=Math.round(Math.sqrt(collisionPoint.distance)/bot.fullHeadCircleRadius*3);
									
									pts=pts+offst;
									
								}
								
								bot.addCollisionAngle(collisionPoint, bot.collisionAngles);
								if (fencingAngles[collisionPoint.aIndex] === undefined )
									fencingAngles[collisionPoint.aIndex]= 1;


							}
						}
						var fencingAngleslength=0;
						
						for (i = 0; i < ((2 * Math.PI) / bot.arcSize); i++) {
										if (fencingAngles[i] !== undefined || fencingAngles[i+1] !== undefined) {
											fencingAngleslength++;
										}
						}					
						
						if (fencingAngleslength > (2 * Math.PI / bot.arcSize) * 0.55 || (fencingAngleslength > (2 * Math.PI / bot.arcSize) * 0.43 && (snakes_minX < snake_minX && snakes_maxX > snake_maxX && snakes_maxY > snake_maxY && snakes_minY < snake_minY)))
						{
							if (fencingAngleslength !== (2 * Math.PI / bot.arcSize))
							{
								bot.fencingSnake = bot.holdCollision * 3;
								bot.isCollision = bot.fencingSnake ;
								predictMove=false;
								
								for (i = 0; i < ((2 * Math.PI) / bot.arcSize); i++) {
												if (fencingAngles[i] !== undefined || fencingAngles[i+1] !== undefined) {						
													if (bot.collisionAngles[i]!== undefined)
														bot.collisionAngles[i].distance=Math.min(headCircleRadius2 * 3 * fencingAngles[i],bot.collisionAngles[i].distance);
													else
													{
														bot.collisionAngles[i] = {
															ang:  bot.arcSize * i,
															snake: snake,
															distance: headCircleRadius2 * 3 * fencingAngles[i],
															isHead: 0
														};
													}
												}
								}
							}
						}
					}
					
                }
/*				
                if (scPoint !== undefined) {
                    if (window.visualDebugging  && false) {
                        canvasUtil.drawCircle(canvasUtil.circle(
                            scPoint.xx,
                            scPoint.yy,
                            scPoint.radius
                        ), 'red', false);
                    }
                }
*/
            }

            // WALL
            if (canvasUtil.getDistance2(bot.MID_X, bot.MID_Y, window.snake.xx, window.snake.yy) >
                Math.pow(bot.MAP_R - 2000, 2)) {
                var midAng = canvasUtil.fastAtan2(
                    window.snake.yy - bot.MID_X, window.snake.xx - bot.MID_Y);
					
				for (i = -6; i < 7; i++) {
					
					scPoint = {
						xx: bot.MID_X + bot.MAP_R * Math.cos(midAng + i * 0.01),
						yy: bot.MID_Y + bot.MAP_R * Math.sin(midAng + i * 0.01),
						snake: -1,
						radius: bot.snakeWidth,
						isHead: 0
					};
					
					canvasUtil.getDistance2FromSnake(scPoint);
					bot.addCollisionAngle(scPoint, bot.collisionAngles);
					
					if (window.visualDebugging) {
						canvasUtil.drawCircle(canvasUtil.circle(
							scPoint.xx,
							scPoint.yy,
							scPoint.radius
						), 'yellow', false);
					}
				}
				
            }

			var midCollisionAngle_x=window.snake.xx;
			var midCollisionAngle_y=window.snake.yy;

			var sang = window.snake.ehang;
			var isang = bot.getAngleIndex(sang);
			var minHeadDist2 = Math.pow(bot.headCircleRadius, 2);
			var frontArcRadius2 = Math.pow(bot.frontArcRadius, 2);
			var headCircleRadius22 = Math.pow(bot.headCircleRadius * 2, 2);

			if (bot.collisionAngles[isang] !== undefined && (bot.collisionAngles[isang].distance < frontArcRadius2)) {
				bot.frontCollision = bot.collisionAngles[isang].distance;	
				bot.isCollision = bot.holdCollision;
			}
			
			{				
				for (i = 0; i < ((2 * Math.PI) / bot.arcSize); i++) {
					if (predictMove)
					{
						if (collisionAnglesPred[i] !== undefined)
						{
							if (bot.collisionAngles[i] !== undefined) {
								if (collisionAnglesPred[i].distance <= bot.collisionAngles[i].distance)
									bot.collisionAngles[i]=collisionAnglesPred[i];
							}
							else
								bot.collisionAngles[i]=collisionAnglesPred[i];
						
						}
					}


					if (bot.collisionAngles[i] !== undefined) {
						if (bot.collisionAngles[i].distance < fullHeadCircleRadius2) {

							

							var frontHeadDist2 = 0;
							var iDiff=Math.abs(bot.indexBetween(isang, i));
							
							
							if (bot.collisionAngles[i].distance < minHeadDist2 || (bot.targetSnake===0) && bot.collisionAngles[i].distance < minHeadDist2 * bot.speedMult *bot.speedMult*4/ (iDiff * iDiff/2+4)) { //|| bot.collisionAngles[i].isHead > 0 && iDiff < ( Math.PI / bot.arcSize / 2 ) && (bot.collisionAngles[i].distance < headCircleRadius22 / 2 )) {

								bot.isCollision = bot.holdCollision;
								bot.isHeadCollision = (bot.collisionAngles[i].isHead > 0);
								if (window.visualDebugging ) {
										if (bot.isHeadCollision) {
											canvasUtil.drawLine({
													x: window.snake.xx,
													y: window.snake.yy
												}, {
													x: window.snake.xx + Math.sqrt(bot.collisionAngles[i].distance) * Math.cos(bot.collisionAngles[i].ang),
													y: window.snake.yy + Math.sqrt(bot.collisionAngles[i].distance) * Math.sin(bot.collisionAngles[i].ang)
												},
											'yellow', 2);
										}
										else {
											canvasUtil.drawLine({
													x: window.snake.xx,
													y: window.snake.yy
												}, {
													x: window.snake.xx + Math.sqrt(bot.collisionAngles[i].distance) * Math.cos(bot.collisionAngles[i].ang),
													y: window.snake.yy + Math.sqrt(bot.collisionAngles[i].distance) * Math.sin(bot.collisionAngles[i].ang)
												},
											'red', 2);
										}
								}
							}
							else {
								if (window.visualDebugging ) {
									if (bot.fencingSnake>0) {
										canvasUtil.drawLine({
												x: window.snake.xx,
												y: window.snake.yy
											}, {
												x: window.snake.xx + Math.sqrt(bot.collisionAngles[i].distance) * Math.cos(bot.collisionAngles[i].ang),
												y: window.snake.yy + Math.sqrt(bot.collisionAngles[i].distance) * Math.sin(bot.collisionAngles[i].ang)
											},
										'red', 2);								
									}
									else {
										canvasUtil.drawLine({
												x: window.snake.xx,
												y: window.snake.yy
											}, {
												x: window.snake.xx + Math.sqrt(bot.collisionAngles[i].distance) * Math.cos(bot.collisionAngles[i].ang),
												y: window.snake.yy + Math.sqrt(bot.collisionAngles[i].distance) * Math.sin(bot.collisionAngles[i].ang)
											},
										'white', 0.5);
									}
								}
							}
							var angleScore = fullHeadCircleRadius2 * fullHeadCircleRadius2 / bot.collisionAngles[i].distance / bot.collisionAngles[i].distance * (iDiff/2+4);
							midCollisionAngle_x += Math.cos(bot.collisionAngles[i].ang) * angleScore;
							midCollisionAngle_y += Math.sin(bot.collisionAngles[i].ang) * angleScore;

						}
					}

					
				}
			}
			
			if (midCollisionAngle_x === window.snake.xx && midCollisionAngle_y === window.snake.yy)
			{
                var midlAng = canvasUtil.fastAtan2(
                    bot.MID_Y-window.snake.yy , bot.MID_X-window.snake.xx)+Math.PI / 5;
				
				snakeLength=(window.snake.sct+5)*23;
				
				var minCenterRadius = snakeLength*1.2;
				if (bot.predatorMode) minCenterRadius = minCenterRadius*1.5;
				
				minCenterRadius=Math.min(bot.MAP_R-snakeLength,minCenterRadius);
				

				if ((Math.pow(window.snake.yy - bot.MID_Y,2) + Math.pow(window.snake.xx - bot.MID_X,2)) < Math.pow(minCenterRadius, 2) ) {
					midlAng = midlAng + Math.PI / 1.5;
				}
				
				var diffA = bot.indexBetween(bot.getAngleIndex(bot.gotoAngle),bot.getAngleIndex(midlAng));
				
				if (Math.abs(diffA)>2)
				{
					if (diffA>0) 
						bot.gotoAngle=bot.gotoAngle+0.02;
					else
						bot.gotoAngle=bot.gotoAngle-0.02;
					
					
				}
				else
					bot.gotoAngle = midlAng;
			}
			else
			{
				bot.gotoAngle = canvasUtil.fastAtan2(window.snake.yy - midCollisionAngle_y, window.snake.xx - midCollisionAngle_x);
				bot.gotoScore=3;
			}
        },

        // Checks to see if you are going to collide with anything in the collision detection radius
        checkCollision: function() {

			bot.headCircleRadius = bot.opt.radiusMult * (bot.snakeRadius) / 1.8;
//			if (bot.predatorMode) bot.headCircleRadius=bot.headCircleRadius*1.3;
			if (bot.isBotRacer && (bot.snakeRadius > bot.minPredatorRadius)) 
				bot.headCircleRadius = bot.headCircleRadius * 1.2;

			bot.frontArcAngle = bot.arcSize;
			bot.frontArcRadius = bot.speedMult * bot.headCircleRadius * 1.2 ;
			bot.fullHeadCircleRadius = bot.headCircleRadius * 3;
			if (bot.targetSnake!==0)
			{
				bot.frontArcRadius=bot.frontArcRadius*1.5;
				bot.headCircleRadius=bot.headCircleRadiu/10;
			}
			
			if (bot.isCollision > 0)
				bot.isCollision--;
				
			bot.isHeadCollision = false;
			bot.frontCollision = 0;
            
			bot.gotoScore=1;
			var startTime = (new Date()).getTime();
			bot.getCollision();
			var endTime = (new Date()).getTime();
			bot.checktime=(endTime - startTime);
			
			var sang = window.snake.ehang;
			
            if (window.visualDebugging) {
				var headCircle = canvasUtil.circle(
					window.snake.xx,
					window.snake.yy,
					bot.headCircleRadius
				);
			
				var headCircleSpeed = canvasUtil.circle(
					window.snake.xx + Math.cos(sang) * (bot.speedMult-1)*bot.headCircleRadius,
					window.snake.yy + Math.sin(sang) * (bot.speedMult-1)*bot.headCircleRadius,
					bot.headCircleRadius
				);

				if (bot.isCollision>0) {
					canvasUtil.drawCircle(headCircle, 'red', false);
					if (bot.targetSnake === 0)
						canvasUtil.drawCircle(headCircleSpeed, 'red', false);
				}
				else {
					canvasUtil.drawCircle(headCircle, 'blue', false);
					if (bot.targetSnake === 0)
						canvasUtil.drawCircle(headCircleSpeed, 'blue', false);
				}
				
				if (bot.frontCollision > 0) {
					canvasUtil.drawAngle(sang-bot.frontArcAngle/2, sang+bot.frontArcAngle/2, bot.frontArcRadius, 'red', true);
				}
				else {
					canvasUtil.drawAngle(sang-bot.frontArcAngle/2, sang+bot.frontArcAngle/2, bot.frontArcRadius, 'white', false);
				}

				var minHeadDist2 = Math.pow(bot.headCircleRadius, 2);

/*
				var la;
				for (var lm = 0; lm < 18; lm++)
				{	
					la=Math.sqrt(minHeadDist2 * bot.speedMult *bot.speedMult * 4 / (lm *lm/2+4));
					canvasUtil.drawAngle(sang+bot.frontArcAngle/2 * (lm * 2-1), sang+bot.frontArcAngle/2*(lm*2+1), la, 'blue', false);
				}
*/				
				var fullHeadCircle = canvasUtil.circle(
					window.snake.xx, window.snake.yy,
					bot.fullHeadCircleRadius
				);
				
				if (bot.fencingSnake > 0) {
				canvasUtil.drawCircle(fullHeadCircle, 'red', false);
				}
				else {
				canvasUtil.drawCircle(fullHeadCircle, 'gray', false);
				}
            }
            if (bot.isCollision>0 || bot.fencingSnake>0) {
				
				var tAccel = bot.defaultAccel;

				if ((bot.isHeadCollision|| bot.fencingSnake>0))
					tAccel = bot.calcAcceleration(bot.gotoAngle);
				bot.targetAcceleration = tAccel;
				window.setAcceleration(tAccel);	
				
				bot.avoidCollision();
                return true;
			}
			return false;
        },
            checkEncircle: function () {
            var enSnake = [];
            var high = 0;
            var highSnake;
            var enAll = 0;

            for (var i = 0; i < bot.collisionAngles.length; i++) {
                if (bot.collisionAngles[i] !== undefined) {
                    var s = bot.collisionAngles[i].snake;
                    if (enSnake[s]) {
                        enSnake[s]++;
                    } else {
                        enSnake[s] = 1;
                    }
                    if (enSnake[s] > high) {
                        high = enSnake[s];
                        highSnake = s;
                    }

                    if (bot.collisionAngles[i].distance <
                        Math.pow(bot.snakeRadius * bot.opt.enCircleDistanceMult, 2)) {
                        enAll++;
                    }
                }
            }

            if (high > bot.MAXARC * bot.opt.enCircleThreshold) {
                bot.headingBestAngle();

                if (high !== bot.MAXARC && window.snakes[highSnake].sp > 10) {
                    window.setAcceleration(1);
                } else {
                    window.setAcceleration(bot.defaultAccel);
                }

                if (window.visualDebugging) {
                    canvasUtil.drawCircle(canvasUtil.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.opt.radiusMult * bot.snakeRadius),
                        'red', true, 0.2);
                }
                return true;
            }

            if (enAll > bot.MAXARC * bot.opt.enCircleAllThreshold) {
                bot.headingBestAngle();
                window.setAcceleration(bot.defaultAccel);

                if (window.visualDebugging) {
                    canvasUtil.drawCircle(canvasUtil.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.snakeRadius * bot.opt.enCircleDistanceMult),
                        'yellow', true, 0.2);
                }
                return true;
            } else {
                if (window.visualDebugging) {
                    canvasUtil.drawCircle(canvasUtil.circle(
                        window.snake.xx,
                        window.snake.yy,
                        bot.snakeRadius * bot.opt.enCircleDistanceMult),
                        'yellow');
                }
            }

          //  window.setAcceleration(bot.defaultAccel);
            return false;
        },
            populatePts: function () {
            let x = window.snake.xx + window.snake.fx;
            let y = window.snake.yy + window.snake.fy;
            let l = 0.0;
            bot.pts = [{
                x: x,
                y: y,
                len: l
            }];
            for (let p = window.snake.pts.length - 1; p >= 0; p--) {
                if (window.snake.pts[p].dying) {
                    continue;
                } else {
                    let xx = window.snake.pts[p].xx + window.snake.pts[p].fx;
                    let yy = window.snake.pts[p].yy + window.snake.pts[p].fy;
                    let ll = l + Math.sqrt(canvasUtil.getDistance2(x, y, xx, yy));
                    bot.pts.push({
                        x: xx,
                        y: yy,
                        len: ll
                    });
                    x = xx;
                    y = yy;
                    l = ll;
                }
            }
            bot.len = l;
        },
        // set the direction of rotation based on the velocity of
        // the head with respect to the center of mass
            determineCircleDirection: function () {
            // find center mass (cx, cy)
            let cx = 0.0;
            let cy = 0.0;
            let pn = bot.pts.length;
            for (let p = 0; p < pn; p++) {
                cx += bot.pts[p].x;
                cy += bot.pts[p].y;
            }
            cx /= pn;
            cy /= pn;

            // vector from (cx, cy) to the head
            let head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };
            let dx = head.x - cx;
            let dy = head.y - cy;

            // check the sign of dot product of (bot.cos, bot.sin) and (-dy, dx)
            if (- dy * bot.cos + dx * bot.sin > 0) {
                // clockwise
                bot.opt.followCircleDirection = -1;
            } else {
                // couter clockwise
                bot.opt.followCircleDirection = +1;
            }
        },
        // returns a point on snake's body on given length from the head
        // assumes that bot.pts is populated
            smoothPoint: function (t) {
            // range check
            if (t >= bot.len) {
                let tail = bot.pts[bot.pts.length - 1];
                return {
                    x: tail.x,
                    y: tail.y
                };
            } else if (t <= 0 ) {
                return {
                    x: bot.pts[0].x,
                    y: bot.pts[0].y
                };
            }
            // binary search
            let p = 0;
            let q = bot.pts.length - 1;
            while (q - p > 1) {
                let m = Math.round((p + q) / 2);
                if (t > bot.pts[m].len) {
                    p = m;
                } else {
                    q = m;
                }
            }
            // now q = p + 1, and the point is in between;
            // compute approximation
            let wp = bot.pts[q].len - t;
            let wq = t - bot.pts[p].len;
            let w = wp + wq;
            return {
                x: (wp * bot.pts[p].x + wq * bot.pts[q].x) / w,
                y: (wp * bot.pts[p].y + wq * bot.pts[q].y) / w
            };
        },
        // finds a point on snake's body closest to the head;
        // returns length from the head
        // excludes points close to the head
            closestBodyPoint: function () {
            let head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };

            let ptsLength = bot.pts.length;

            // skip head area
            let start_n = 0;
            let start_d2 = 0.0;
            for ( ;; ) {
                let prev_d2 = start_d2;
                start_n ++;
                start_d2 = canvasUtil.getDistance2(head.x, head.y,
                    bot.pts[start_n].x, bot.pts[start_n].y);
                if (start_d2 < prev_d2 || start_n == ptsLength - 1) {
                    break;
                }
            }

            if (start_n >= ptsLength || start_n <= 1) {
                return bot.len;
            }

            // find closets point in bot.pts
            let min_n = start_n;
            let min_d2 = start_d2;
            for (let n = min_n + 1; n < ptsLength; n++) {
                let d2 = canvasUtil.getDistance2(head.x, head.y, bot.pts[n].x, bot.pts[n].y);
                if (d2 < min_d2) {
                    min_n = n;
                    min_d2 = d2;
                }
            }

            // find second closest point
            let next_n = min_n;
            let next_d2 = min_d2;
            if (min_n == ptsLength - 1) {
                next_n = min_n - 1;
                next_d2 = canvasUtil.getDistance2(head.x, head.y,
                    bot.pts[next_n].x, bot.pts[next_n].y);
            } else {
                let d2m = canvasUtil.getDistance2(head.x, head.y,
                    bot.pts[min_n - 1].x, bot.pts[min_n - 1].y);
                let d2p = canvasUtil.getDistance2(head.x, head.y,
                    bot.pts[min_n + 1].x, bot.pts[min_n + 1].y);
                if (d2m < d2p) {
                    next_n = min_n - 1;
                    next_d2 = d2m;
                } else {
                    next_n = min_n + 1;
                    next_d2 = d2p;
                }
            }

            // compute approximation
            let t2 = bot.pts[min_n].len - bot.pts[next_n].len;
            t2 *= t2;

            if (t2 === 0) {
                return bot.pts[min_n].len;
            } else {
                let min_w = t2 - (min_d2 - next_d2);
                let next_w = t2 + (min_d2 - next_d2);
                return (bot.pts[min_n].len * min_w + bot.pts[next_n].len * next_w) / (2 * t2);
            }
        },
            bodyDangerZone: function (
            offset, targetPoint, targetPointNormal, closePointDist, pastTargetPoint, closePoint) {
            var head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };
            const o = bot.opt.followCircleDirection;
            var pts = [
                {
                    x: head.x - o * offset * bot.sin,
                    y: head.y + o * offset * bot.cos
                },
                {
                    x: head.x + bot.snakeWidth * bot.cos +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + bot.snakeWidth * bot.sin +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 1.75 * bot.snakeWidth * bot.cos +
                        o * 0.3 * bot.snakeWidth * bot.sin +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + 1.75 * bot.snakeWidth * bot.sin -
                        o * 0.3 * bot.snakeWidth * bot.cos +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 2.5 * bot.snakeWidth * bot.cos +
                        o * 0.7 * bot.snakeWidth * bot.sin +
                        offset * (bot.cos - o * bot.sin),
                    y: head.y + 2.5 * bot.snakeWidth * bot.sin -
                        o * 0.7 * bot.snakeWidth * bot.cos +
                        offset * (bot.sin + o * bot.cos)
                },
                {
                    x: head.x + 3 * bot.snakeWidth * bot.cos +
                        o * 1.2 * bot.snakeWidth * bot.sin +
                        offset * bot.cos,
                    y: head.y + 3 * bot.snakeWidth * bot.sin -
                        o * 1.2 * bot.snakeWidth * bot.cos +
                        offset * bot.sin
                },
                {
                    x: targetPoint.x +
                        targetPointNormal.x * (offset + 0.5 * Math.max(closePointDist, 0)),
                    y: targetPoint.y +
                        targetPointNormal.y * (offset + 0.5 * Math.max(closePointDist, 0))
                },
                {
                    x: pastTargetPoint.x + targetPointNormal.x * offset,
                    y: pastTargetPoint.y + targetPointNormal.y * offset
                },
                pastTargetPoint,
                targetPoint,
                closePoint
            ];
            pts = canvasUtil.convexHull(pts);
            var poly = {
                pts: pts
            };
            poly = canvasUtil.addPolyBox(poly);
            return (poly);
        },
            followCircleSelf: function () {

            bot.populatePts();
            bot.determineCircleDirection();
            const o = bot.opt.followCircleDirection;



            var head = {
                x: window.snake.xx + window.snake.fx,
                y: window.snake.yy + window.snake.fy
            };

            let closePointT = bot.closestBodyPoint();
            let closePoint = bot.smoothPoint(closePointT);

            // approx tangent and normal vectors and closePoint
            var closePointNext = bot.smoothPoint(closePointT - bot.snakeWidth);
            var closePointTangent = canvasUtil.unitVector({
                x: closePointNext.x - closePoint.x,
                y: closePointNext.y - closePoint.y});
            var closePointNormal = {
                x: - o * closePointTangent.y,
                y:   o * closePointTangent.x
            };

            // angle wrt closePointTangent
            var currentCourse = Math.asin(Math.max(
                -1, Math.min(1, bot.cos * closePointNormal.x + bot.sin * closePointNormal.y)));

            // compute (oriented) distance from the body at closePointDist
            var closePointDist = (head.x - closePoint.x) * closePointNormal.x +
                (head.y - closePoint.y) * closePointNormal.y;

            // construct polygon for snake inside
            var insidePolygonStartT = 5 * bot.snakeWidth;
            var insidePolygonEndT = closePointT + 5 * bot.snakeWidth;
            var insidePolygonPts = [
                bot.smoothPoint(insidePolygonEndT),
                bot.smoothPoint(insidePolygonStartT)
            ];
            for (let t = insidePolygonStartT; t < insidePolygonEndT; t += bot.snakeWidth) {
                insidePolygonPts.push(bot.smoothPoint(t));
            }

            var insidePolygon = canvasUtil.addPolyBox({
                pts: insidePolygonPts
            });

            // get target point; this is an estimate where we land if we hurry
            var targetPointT = closePointT;
            var targetPointFar = 0.0;
            let targetPointStep = bot.snakeWidth / 64;
            for (let h = closePointDist, a = currentCourse; h >= 0.125 * bot.snakeWidth; ) {
                targetPointT -= targetPointStep;
                targetPointFar += targetPointStep * Math.cos(a);
                h += targetPointStep * Math.sin(a);
                a = Math.max(-Math.PI / 4, a - targetPointStep / bot.snakeWidth);
            }

            var targetPoint = bot.smoothPoint(targetPointT);

            var pastTargetPointT = targetPointT - 3 * bot.snakeWidth;
            var pastTargetPoint = bot.smoothPoint(pastTargetPointT);

            // look for danger from enemies
            var enemyBodyOffsetDelta = 0.25 * bot.snakeWidth;
            var enemyHeadDist2 = 64 * 64 * bot.snakeWidth * bot.snakeWidth;
            for (let snake = 0, snakesNum = window.snakes.length; snake < snakesNum; snake++) {
                if (window.snakes[snake].id !== window.snake.id && window.snakes[snake].alive_amt === 1) {
                    let enemyHead = {
                        x: window.snakes[snake].xx + window.snakes[snake].fx,
                        y: window.snakes[snake].yy + window.snakes[snake].fy
                    };
                    let enemyAhead = {
                        x: enemyHead.x +
                            Math.cos(window.snakes[snake].ang) * bot.snakeWidth,
                        y: enemyHead.y +
                            Math.sin(window.snakes[snake].ang) * bot.snakeWidth
                    };
                    // heads
                    if (!canvasUtil.pointInPoly(enemyHead, insidePolygon)) {
                        enemyHeadDist2 = Math.min(
                            enemyHeadDist2,
                            canvasUtil.getDistance2(enemyHead.x,  enemyHead.y,
                                targetPoint.x, targetPoint.y),
                            canvasUtil.getDistance2(enemyAhead.x, enemyAhead.y,
                                targetPoint.x, targetPoint.y)
                            );
                    }
                    // bodies
                    let offsetSet = false;
                    let offset = 0.0;
                    let cpolbody = {};
                    for (let pts = 0, ptsNum = window.snakes[snake].pts.length;
                        pts < ptsNum; pts++) {
                        if (!window.snakes[snake].pts[pts].dying) {
                            let point = {
                                x: window.snakes[snake].pts[pts].xx +
                                   window.snakes[snake].pts[pts].fx,
                                y: window.snakes[snake].pts[pts].yy +
                                   window.snakes[snake].pts[pts].fy
                            };
                            while (!offsetSet || (enemyBodyOffsetDelta >= -bot.snakeWidth && canvasUtil.pointInPoly(point, cpolbody))) {
                                if (!offsetSet) {
                                    offsetSet = true;
                                } else {
                                    enemyBodyOffsetDelta -= 0.0625 * bot.snakeWidth;
                                }
                                offset = 0.5 * (bot.snakeWidth +
                                    bot.getSnakeWidth(window.snakes[snake].sc)) +
                                    enemyBodyOffsetDelta;
                                cpolbody = bot.bodyDangerZone(
                                    offset, targetPoint, closePointNormal, closePointDist,
                                    pastTargetPoint, closePoint);

                            }
                        }
                    }
                }
            }
            var enemyHeadDist = Math.sqrt(enemyHeadDist2);

            // plot inside polygon
            if (window.visualDebugging) {
                for (let p = 0, l = insidePolygon.pts.length; p < l; p++) {
                    let q = p + 1;
                    if (q == l) {
                        q = 0;
                    }
                    canvasUtil.drawLine(
                        {x: insidePolygon.pts[p].x, y: insidePolygon.pts[p].y},
                        {x: insidePolygon.pts[q].x, y: insidePolygon.pts[q].y},
                        'orange');
                }
            }

            // mark closePoint
            if (window.visualDebugging) {
                canvasUtil.drawCircle(canvasUtil.circle(
                    closePoint.x,
                    closePoint.y,
                    bot.snakeWidth * 0.25
                ), 'white', false);
            }

            // mark safeZone
            if (window.visualDebugging) {
                canvasUtil.drawCircle(canvasUtil.circle(
                    targetPoint.x,
                    targetPoint.y,
                    bot.snakeWidth + 2 * targetPointFar
                ), 'white', false);
                canvasUtil.drawCircle(canvasUtil.circle(
                    targetPoint.x,
                    targetPoint.y,
                    0.2 * bot.snakeWidth
                ), 'white', false);
            }

            // draw sample cpolbody
            if (window.visualDebugging) {
                let soffset = 0.5 * bot.snakeWidth;
                let scpolbody = bot.bodyDangerZone(
                    soffset, targetPoint, closePointNormal,
                    closePointDist, pastTargetPoint, closePoint);
                for (let p = 0, l = scpolbody.pts.length; p < l; p++) {
                    let q = p + 1;
                    if (q == l) {
                        q = 0;
                    }
                    canvasUtil.drawLine(
                        {x: scpolbody.pts[p].x, y: scpolbody.pts[p].y},
                        {x: scpolbody.pts[q].x, y: scpolbody.pts[q].y},
                        'white');
                }
            }

            // TAKE ACTION

            // expand?
            let targetCourse = currentCourse + 0.25;
            // enemy head nearby?
            let headProx = -1.0 - (2 * targetPointFar - enemyHeadDist) / bot.snakeWidth;
            if (headProx > 0) {
                headProx = 0.125 * headProx * headProx;
            } else {
                headProx = - 0.5 * headProx * headProx;
            }
            targetCourse = Math.min(targetCourse, headProx);
            // enemy body nearby?
            targetCourse = Math.min(
                targetCourse, targetCourse + (enemyBodyOffsetDelta - 0.0625 * bot.snakeWidth) /
                bot.snakeWidth);
            // small tail?
            var tailBehind = bot.len - closePointT;
            var targetDir = canvasUtil.unitVector({
                x: bot.opt.followCircleTarget.x - head.x,
                y: bot.opt.followCircleTarget.y - head.y
            });
            var driftQ = targetDir.x * closePointNormal.x + targetDir.y * closePointNormal.y;
            var allowTail = bot.snakeWidth * (2 - 0.5 * driftQ);
            // a line in the direction of the target point
            if (window.visualDebugging) {
                canvasUtil.drawLine(
                    { x: head.x, y: head.y },
                    { x: head.x + allowTail * targetDir.x, y: head.y + allowTail * targetDir.y },
                    'red');
            }
            targetCourse = Math.min(
                targetCourse,
                (tailBehind - allowTail + (bot.snakeWidth - closePointDist)) /
                bot.snakeWidth);
            // far away?
            targetCourse = Math.min(
                targetCourse, - 0.5 * (closePointDist - 4 * bot.snakeWidth) / bot.snakeWidth);
            // final corrections
            // too fast in?
            targetCourse = Math.max(targetCourse, -0.75 * closePointDist / bot.snakeWidth);
            // too fast out?
            targetCourse = Math.min(targetCourse, 1.0);

            var goalDir = {
                x: closePointTangent.x * Math.cos(targetCourse) -
                    o * closePointTangent.y * Math.sin(targetCourse),
                y: closePointTangent.y * Math.cos(targetCourse) +
                    o * closePointTangent.x * Math.sin(targetCourse)
            };
            var goal = {
                x: head.x + goalDir.x * 4 * bot.snakeWidth,
                y: head.y + goalDir.y * 4 * bot.snakeWidth
            };


            if (window.goalCoordinates && Math.abs(goal.x - window.goalCoordinates.x) < 1000 && Math.abs(goal.y - window.goalCoordinates.y) < 1000) {
                window.goalCoordinates = {
                    x: Math.round(goal.x * 0.25 + window.goalCoordinates.x * 0.75),
                    y: Math.round(goal.y * 0.25 + window.goalCoordinates.y * 0.75)
                };
            } else {
                window.goalCoordinates = {
                    x: Math.round(goal.x),
                    y: Math.round(goal.y)
                };
            }

            canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(window.goalCoordinates));
        },
        sortScore: function(a, b) {
            return b.score - a.score;
        },

        // Round angle difference up to nearest foodRoundAngle degrees.
        // Round food up to nearest foodRoundsz, square for distance^2
        scoreFood: function(f) {
            f.score = Math.pow(Math.ceil(f.sz / bot.opt.foodRoundSize) * bot.opt.foodRoundSize, 2) /
                f.distance / (Math.ceil(f.da / bot.opt.foodRoundAngle) * bot.opt.foodRoundAngle) / (Math.ceil(f.gotoda / bot.opt.foodRoundAngle) * bot.opt.foodRoundAngle);
        },
            scoreFgood: function(f) {
            f.score = Math.pow(Math.ceil(f.sz / bot.opt.foodRoundSize) * bot.opt.foodRoundSize, 2) /
                f.distance / (Math.ceil(f.da / bot.opt.foodRoundAngle) * bot.opt.foodRoundAngle);
        },
        czomputeFoodGoal: function() {
            
			var foodAngles = [];
			var foodWeights = [];
			
			var sx = window.snake.xx;
            var a;
            var gotoda;
			var sy = window.snake.yy;
			var headCircleRadius2 = Math.pow(bot.headCircleRadius, 2);
			var fullHeadCircleRadius22 = Math.pow(bot.fullHeadCircleRadius * 2, 2);


            for (var i = 0; i < window.foods.length && window.foods[i] !== null; i++) {
                
                var da;
                
				var f = window.foods[i];
				var cx = f.xx;
				var cy = f.yy;
				var distance = canvasUtil.getDistance2(cx, cy, sx, sy);
                var sang = window.snake.ehang;
                var csz = f.sz;
					
				
				
                if (!f.eaten && (distance < fullHeadCircleRadius22 || csz > 10) ) {
							
							
							

                    
					
					a = canvasUtil.fastAtan2(cy - sy, cx - sx);
					var aIndex = bot.getAngleIndex(a);
                    da = Math.min((2 * Math.PI) - Math.abs(a - sang), Math.abs(a - sang));
                    gotoda = Math.min((2 * Math.PI) - Math.abs(a - bot.gotoAngle), Math.abs(a - bot.gotoAngle));	
					
					if (bot.collisionAngles[aIndex] === undefined || distance < bot.collisionAngles[aIndex].distance - headCircleRadius2 / 6)
					{
						if (foodAngles[aIndex] === undefined) {
							foodWeights[aIndex] = csz;
							foodAngles[aIndex] = 10 * csz / (Math.abs(Math.sqrt(distance ))+100) ;
						}
						else {
							foodAngles[aIndex] += 10 * csz / (Math.abs(Math.sqrt(distance ))+100) ;
							foodWeights[aIndex] += csz;
						}
					}

                }
            }

	
			var foodWeight = 0;
			var foodAindex = 0;
			var fw=0;
			for (i = 0; i < (2 * Math.PI) / bot.arcSize; i++) {
			

				var n1=i-1;
				var n2=i+1;
				if (n1===-1) n1=(2 * Math.PI) / bot.arcSize;
				if (n2===(2 * Math.PI) / bot.arcSize) n2=0;
				var nw=0;
				if (foodAngles[n1] !== undefined) nw=foodAngles[n1];
				if (foodAngles[n1] !== undefined) nw+=foodAngles[n2];
				
				if (foodAngles[i] !== undefined) {
						a = bot.arcSize * i;
						//da = Math.min((2 * Math.PI) - Math.abs(a - sang), Math.abs(a - sang));
						gotoda = Math.abs(bot.indexBetween(i, bot.getAngleIndex(bot.gotoAngle)));	
				
						fw = (foodAngles[i] + nw/2) / ( gotoda * bot.gotoScore + 10) / 5;
						if (fw > foodWeight)
						{
							foodWeight=fw;
							foodAindex = i;
						}
					
				}

				
			}
			if (foodWeight === 0)
			{
				bot.currentFood = {
					x: bot.MID_X,
					y: bot.MID_Y,
					sz: 0,
					ang: 0,
					foodAindex: 0
				};			
				return;
			}
			var foodAngle = bot.arcSize * foodAindex;
			
			
            bot.currentFood = {
                x: sx + bot.fullHeadCircleRadius * Math.cos(foodAngle),
                y: sy + bot.fullHeadCircleRadius * Math.sin(foodAngle),
				sz: foodWeights[foodAindex],
				ang: foodAngle,
				aIndex: foodAindex
            };			
			return;
			
        },
				g2etSnakeWidth: function (sc) {
					if (sc === undefined) sc = window.snake.sc;
					return Math.round(sc * 29.0);
				},

				quic2kRespawn: function () {
					window.dead_mtm = 0;
					window.login_fr = 0;

					bot.isBotRunning = false;
					window.forcing = true;
					window.connect();
					window.forcing = false;
				},

				// angleBetween - get the smallest angle between two angles (0-pi)
				ang2leBetween: function (a1, a2) {
					var r1 = 0.0;
					var r2 = 0.0;

					r1 = (a1 - a2) % Math.PI;
					r2 = (a2 - a1) % Math.PI;

					return r1 < r2 ? -r1 : r2;
				},


				// Avoid points in the front of the head
				avoidHeadCollision: function () {

				},

				// Avoid headPoint
				avoidHeadPoint: function (collisionPoint) {
					var cehang = canvasUtil.fastAtan2(collisionPoint.yy - window.snake.yy, collisionPoint.xx - window.snake.xx);
					var diff = bot.angleBetween(window.snake.ehang, cehang);

					if (Math.abs(diff) > bot.opt.rearHeadA) {
						var dir = diff > 0 ? -bot.opt.rearHeadDir : bot.opt.rearHeadDir;
						bot.changeHeading(dir);
					} else {
						bot.avoidCollisionPoint(collisionPoint);
					}
				},

				// Change heading by ang
				// +0-pi turn left
				// -0-pi turn right

			changeHeadinfg: function (angle) {
					var heading = {
						x: window.snake.xx + 500 * bot.cos,
						y: window.snake.yy + 500 * bot.sin
					};
					var cos = Math.cos(-angle);
					var sin = Math.sin(-angle);

					window.goalCoordinates = {
						x: Math.round(
							cos * (heading.x - window.snake.xx) -
							sin * (heading.y - window.snake.yy) + window.snake.xx),
						y: Math.round(
							sin * (heading.x - window.snake.xx) +
							cos * (heading.y - window.snake.yy) + window.snake.yy)
					};

					canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(window.goalCoordinates));
				},

				// Avoid collison point by ang
				// ang radians <= Math.PI (180deg)
				avoidCollisionPzoint: function (collisionPoint, ang) {
					if (ang === undefined || ang > Math.PI) {
						ang = Math.PI;
					}

					var end = {
						x: window.snake.xx + 2000 * bot.cos,
						y: window.snake.yy + 2000 * bot.sin
					};

	/*				if (window.visualDebugging) {
						canvas.drawLine(
							{ x: window.snake.xx, y: window.snake.yy },
							end,
							'orange', 5);
						canvas.drawLine(
							{ x: window.snake.xx, y: window.snake.yy },
							{ x: collisionPoint.xx, y: collisionPoint.yy },
							'red', 5);
					}
	*/
					var cos = Math.cos(ang);
					var sin = Math.sin(ang);

					if (canvasUtil.isLeft(
						{ x: window.snake.xx, y: window.snake.yy }, end,
						{ x: collisionPoint.xx, y: collisionPoint.yy })) {
						sin = -sin;
					}

					window.goalCoordinates = {
						x: Math.round(
							cos * (collisionPoint.xx - window.snake.xx) -
							sin * (collisionPoint.yy - window.snake.yy) + window.snake.xx),
						y: Math.round(
							sin * (collisionPoint.xx - window.snake.xx) +
							cos * (collisionPoint.yy - window.snake.yy) + window.snake.yy)
					};
					canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(window.goalCoordinates));
				},

				// Sorting by  property 'distance'
			zsortDistance: function (a, b) {
					return a.distance - b.distance;
				},

				// get collision angle index, expects angle +/i 0 to Math.PI
				getAndgleIndex: function (angle) {
					const ARCSIZE = bot.opt.arcSize;
					var index;

					if (angle < 0) {
						angle += 2 * Math.PI;
					}

					index = Math.round(angle * (1 / ARCSIZE));

					if (index === (2 * Math.PI) / ARCSIZE) {
						return 0;
					}
					return index;
				},

				// Add to collisionAngles if distance is closer
				addzCollisionAngle: function (sp) {
					var ang = canvasUtil.fastAtan2(
						Math.round(sp.yy - window.snake.yy),
						Math.round(sp.xx - window.snake.xx));
					var aIndex = bot.getAngleIndex(ang);

					var actualDistance = Math.round(Math.pow(
						Math.sqrt(sp.distance) - sp.radius, 2));

					if (bot.collisionAngles[aIndex] === undefined) {
						bot.collisionAngles[aIndex] = {
							x: Math.round(sp.xx),
							y: Math.round(sp.yy),
							ang: ang,
							snake: sp.snake,
							distance: actualDistance
						};
					} else if (bot.collisionAngles[aIndex].distance > sp.distance) {
						bot.collisionAngles[aIndex].x = Math.round(sp.xx);
						bot.collisionAngles[aIndex].y = Math.round(sp.yy);
						bot.collisionAngles[aIndex].ang = ang;
						bot.collisionAngles[aIndex].snake = sp.snake;
						bot.collisionAngles[aIndex].distance = actualDistance;
					}
				},

				// Get closest collision point per snake.
				getCollisionPoints: function () {
					var scPoint;

					bot.collisionPoints = [];
					bot.collisionAngles = [];


					var frontPath=[];
					var midLeftPath=[];
					var maxLeftPath=[];
					var midRightPath=[];
					var maxRightPath=[];
					var frontPathFree=true;
					var midLeftPathFree=true;
					var maxLeftPathFree=true;
					var midRightPathFree=true;
					var maxRightPathFree=true;
					var pathLn=Math.round(window.snake.sp*1.5);
					var midAngle=0.4/window.snake.sp;
					var maxAngle=0.9/window.snake.sp;
					for (var patho = 1; patho < pathLn+1; patho++) {

						frontPath[patho]= canvasUtil.circle(
							window.snake.xx + bot.snakeRadius*patho * bot.cos, window.snake.yy+ bot.snakeRadius*patho * bot.sin,
							 bot.snakeRadius/2
						);
						canvasUtil.drawCircle(frontPath[patho], 'green', false);
						midLeftPath[patho]= canvasUtil.circle(
							window.snake.xx + bot.snakeRadius* Math.cos(window.snake.ang-midAngle*patho)*patho, window.snake.yy+ bot.snakeRadius * Math.sin(window.snake.ang-midAngle*patho)*patho,
							 bot.snakeRadius/2*(100+patho)/100
						);					
						canvasUtil.drawCircle(midLeftPath[patho], 'green', false);
						maxLeftPath[patho]= canvasUtil.circle(
							window.snake.xx + bot.snakeRadius* Math.cos(window.snake.ang-maxAngle*patho)*Math.sqrt(patho*7), window.snake.yy+ bot.snakeRadius * Math.sin(window.snake.ang-maxAngle*patho)*Math.sqrt(patho*7),
							 bot.snakeRadius/2*(100+patho)/100
						);					
						canvasUtil.drawCircle(maxLeftPath[patho], 'green', false);						
						midRightPath[patho]= canvasUtil.circle(
							window.snake.xx + bot.snakeRadius* Math.cos(window.snake.ang+midAngle*patho)*patho, window.snake.yy+ bot.snakeRadius * Math.sin(window.snake.ang+midAngle*patho)*patho,
							 bot.snakeRadius/2*(100+patho)/100
						);					
						canvasUtil.drawCircle(midRightPath[patho], 'green', false);
						maxRightPath[patho]= canvasUtil.circle(
							window.snake.xx + bot.snakeRadius* Math.cos(window.snake.ang+maxAngle*patho)*Math.sqrt(patho*7), window.snake.yy+ bot.snakeRadius * Math.sin(window.snake.ang+maxAngle*patho)*Math.sqrt(patho*7),
							 bot.snakeRadius/2*(100+patho)/100
						);					
					canvasUtil.drawCircle(maxRightPath[patho], 'green', false);						
					}
					
						

					
					var frontPathCollision=false;
					var midLeftPathCollision=false;
					var maxLeftPathCollision=false;
					var midRightPathCollision=false;
					var maxRightPathCollision=false;

					for (var snake = 0, ls = window.snakes.length; snake < ls; snake++) {
						scPoint = undefined;

						if (window.snakes[snake].id !== window.snake.id &&
							window.snakes[snake].alive_amt === 1) {

							scPoint = {
								xx: window.snakes[snake].xx,
								yy: window.snakes[snake].yy,
								snake: snake,
								radius: bot.getSnakeWidth(window.snakes[snake].sc) / 2
							};
							canvasUtil.getDistance2FromSnake(scPoint);
							bot.addCollisionAngle(scPoint);
							if (window.visualDebugging && false) {
								canvasUtil.drawCircle(canvasUtil.circle(
									scPoint.xx,
									scPoint.yy,
									scPoint.radius),
									'green', false);
							}

							for (var pts = 0, lp = window.snakes[snake].pts.length; pts < lp; pts++) {
								if (!window.snakes[snake].pts[pts].dying &&
									canvasUtil.pointInRect(
										{
											x: window.snakes[snake].pts[pts].xx,
											y: window.snakes[snake].pts[pts].yy
										}, bot.sectorBox)
								) {
									var collisionPoint = {
										xx: window.snakes[snake].pts[pts].xx,
										yy: window.snakes[snake].pts[pts].yy,
										x: window.snakes[snake].pts[pts].xx,
										y: window.snakes[snake].pts[pts].yy,
										snake: snake,
										radius: bot.getSnakeWidth(window.snakes[snake].sc) / 2
									};
									
									
									for (var patho = 1; patho < pathLn+1; patho++) {
										
										if (canvasUtil.circleIntersect(frontPath[patho], collisionPoint,true)) {
											frontPathCollision=true;

										}									
										if (canvasUtil.circleIntersect(midLeftPath[patho], collisionPoint,true)) {
											midLeftPathCollision=true;

										}
										if (canvasUtil.circleIntersect(maxLeftPath[patho], collisionPoint,true)) {
											maxLeftPathCollision=true;

										}
										if (canvasUtil.circleIntersect(midRightPath[patho], collisionPoint,true)) {
											midRightPathCollision=true;

										}
										if (canvasUtil.circleIntersect(maxRightPath[patho], collisionPoint,true)) {
											maxRightPathCollision=true;

										}										

									}
									
									
										

									if (window.visualDebugging && true === false) {
										canvasUtil.drawCircle(canvasUtil.circle(
											collisionPoint.xx,
											collisionPoint.yy,
											collisionPoint.radius),
											'#00FF00', false);
									}

									canvasUtil.getDistance2FromSnake(collisionPoint);
									bot.addCollisionAngle(collisionPoint);

									if (scPoint === undefined ||
										scPoint.distance > collisionPoint.distance) {
										scPoint = collisionPoint;
									}
								}
							}
						}
						if (scPoint !== undefined) {
							bot.collisionPoints.push(scPoint);
							if (window.visualDebugging && false) {
								canvasUtil.drawCircle(canvasUtil.circle(
									scPoint.xx,
									scPoint.yy,
									scPoint.radius
								), 'red', false);
							}
						}
					}


					if (frontPathCollision)
					{
						if (!midLeftPathCollision)
						{
						
											bot.changeHeading(Math.PI / 6);
							
						}
						else if (!maxLeftPathCollision)
						{
						
											bot.changeHeading(Math.PI / 3);
							
						}
						else if (!midRightPathCollision)
						{
						
											bot.changeHeading(-Math.PI / 6);
							
						}						
						else if (!maxRightPathCollision)
						{
						
											bot.changeHeading(-Math.PI / 3);
							
						}
						else 
						{
							bot.changeHeading(-Math.PI / 2);
							window.setAcceleration(bot.defaultAccel);							
						}
						
					}
					
					
					// WALL
					if (canvasUtil.getDistance2(bot.MID_X, bot.MID_Y, window.snake.xx, window.snake.yy) >
						Math.pow(bot.MAP_R - 1000, 2)) {
						var midAng = canvasUtil.fastAtan2(
							window.snake.yy - bot.MID_X, window.snake.xx - bot.MID_Y);
						scPoint = {
							xx: bot.MID_X + bot.MAP_R * Math.cos(midAng),
							yy: bot.MID_Y + bot.MAP_R * Math.sin(midAng),
							snake: -1,
							radius: bot.snakeWidth
						};
						canvasUtil.getDistance2FromSnake(scPoint);
						bot.collisionPoints.push(scPoint);
						bot.addCollisionAngle(scPoint);
						if (window.visualDebugging && false) {
							canvasUtil.drawCircle(canvasUtil.circle(
								scPoint.xx,
								scPoint.yy,
								scPoint.radius
							), 'yellow', false);
						}
					}


					bot.collisionPoints.sort(bot.sortDistance);
					if (window.visualDebugging) {
						for (var i = 0; i < bot.collisionAngles.length; i++) {
							if (bot.collisionAngles[i] !== undefined) {
								/*canvas.drawLine(
									{ x: window.snake.xx, y: window.snake.yy },
									{ x: bot.collisionAngles[i].x, y: bot.collisionAngles[i].y },
									'#99ffcc', 2);*/
							}
						}
					}
				},

				// Checks to see if you are going to collide with anything in the collision detection radius
				zcheckCollision: function () {
					
					var headCircleOffset=(bot.speedMult-1) * bot.opt.radiusMult / 2 * bot.snakeRadius ;
					
			 
					
					
					var headCircle = canvasUtil.circle(
						window.snake.xx + headCircleOffset * bot.cos, window.snake.yy+ headCircleOffset * bot.sin,
						 bot.opt.radiusMult / 2 * bot.snakeRadius
					);
					
					var fullHeadCircleOffset=bot.opt.radiusMult * bot.snakeRadius / 1.4;
					
					var noHuntCircleOffset=bot.opt.radiusMult * bot.snakeRadius / 2;
					
					var fullHeadCircle = canvasUtil.circle(
						window.snake.xx+ fullHeadCircleOffset * bot.cos, window.snake.yy+ fullHeadCircleOffset * bot.sin,
						bot.opt.radiusMult * bot.snakeRadius*0.8
					);


					var noHuntCircle = canvasUtil.circle(
						window.snake.xx- noHuntCircleOffset * bot.cos, window.snake.yy- noHuntCircleOffset * bot.sin,
						bot.opt.radiusMult * bot.snakeRadius/1.2
					);

					var fullHuntCircleOffset=bot.opt.radiusMult * bot.snakeRadius*bot.opt.huntCircleSize/100*bot.opt.huntCircleOffset/100;
					var fullHuntCircle = canvasUtil.circle(
						window.snake.xx+ fullHuntCircleOffset * bot.cos, window.snake.yy+ fullHuntCircleOffset * bot.sin,
						bot.opt.radiusMult * bot.snakeRadius*bot.opt.huntCircleSize/100
					);
					if (window.visualDebugging) {
						canvasUtil.drawCircle(fullHeadCircle, 'red');
						canvasUtil.drawCircle(headCircle, 'blue', false);
						canvasUtil.drawCircle(fullHuntCircle, 'green', false);
//						canvasUtil.drawCircle(noHuntCircle, 'gray', false);
					}

					
					bot.getCollisionPoints();
					if (bot.collisionPoints.length === 0) return false;

					
					
					for (var i = 0; i < bot.collisionPoints.length; i++) {
						// -1 snake is special case for non snake object.

						var collisionCircle = canvasUtil.circle(
							bot.collisionPoints[i].xx,
							bot.collisionPoints[i].yy,
							bot.collisionPoints[i].radius

						);

									
				
						if (bot.collisionPoints[i].snake !== -1) {
							var eHeadCircle = canvasUtil.circle(
								window.snakes[bot.collisionPoints[i].snake].xx,
								window.snakes[bot.collisionPoints[i].snake].yy,
								bot.collisionPoints[i].radius
							);
							
							

						if (bot.snakeWidth>30&& canvasUtil.circleIntersect(fullHuntCircle, eHeadCircle) && ! canvasUtil.circleIntersect(noHuntCircle, eHeadCircle)) {


									//var huntedSpot
	var cehang = canvasUtil.fastAtan2(
						window.snakes[bot.collisionPoints[i].snake].yy - window.snake.yy, window.snakes[bot.collisionPoints[i].snake].xx - window.snake.xx);
															var angDiff=Math.abs((cehang-window.snakes[bot.collisionPoints[i].snake].ehang));
								if (angDiff>Math.PI)
								{
									angDiff=Math.PI*2-angDiff;
								}

									
									var angoffset=Math.abs(angDiff-Math.PI/2)+2.0;
												var enemycos = Math.cos(window.snakes[bot.collisionPoints[i].snake].ehang);
												var enemysin = Math.sin(window.snakes[bot.collisionPoints[i].snake].ehang);
												
												var spotOffset=angoffset*angoffset*(window.snakes[bot.collisionPoints[i].snake].sp-4)*8*(1+window.snakes[bot.collisionPoints[i].snake].sc/10);

												
												
												
									
												var newGoalCoordinates = {
													xx: Math.round(window.snakes[bot.collisionPoints[i].snake].xx+enemycos*spotOffset),
													yy: Math.round(window.snakes[bot.collisionPoints[i].snake].yy+enemysin*spotOffset)
												};
												
																		canvasUtil.getDistance2FromSnake(newGoalCoordinates);
																		//console.log("bot.snakeWidth:"+bot.snakeWidth);
																		//console.log("spotOffset " + Math.abs(spotOffset+newGoalCoordinates.distance/2000)+" "+window.snakes[bot.collisionPoints[i].snake].sp+" "+angoffset);
												window.goalCoordinates = {
													x: Math.round(window.snakes[bot.collisionPoints[i].snake].xx+enemycos*(spotOffset+newGoalCoordinates.distance/2000)),
													y: Math.round(window.snakes[bot.collisionPoints[i].snake].yy+enemysin*(spotOffset+newGoalCoordinates.distance/2000)),
													radius: 20
												};

						
	var cehang = canvasUtil.fastAtan2(
						window.goalCoordinates.y - window.snake.yy, window.goalCoordinates.x - window.snake.xx);
						
							angDiff=Math.abs((cehang-window.snakes[bot.collisionPoints[i].snake].ehang));
								if (angDiff>Math.PI)
								{
									angDiff=Math.PI*2-angDiff;
								}
							//	console.log("cehang"+cehang+" snake.ehang:"+window.snake.ehang+ " snake.ang"+window.snake.ang+"width"+window.snakes[bot.collisionPoints[i].snake].sc);
							var doHunt=true;

												var enemyCoordinates = {
													xx: Math.round(window.snakes[bot.collisionPoints[i].snake].xx),
													yy: Math.round(window.snakes[bot.collisionPoints[i].snake].yy)
												};
												
																		canvasUtil.getDistance2FromSnake(enemyCoordinates);
							
							for (var pts = 0, lp = window.snakes[bot.collisionPoints[i].snake].pts.length-20; pts < lp; pts++) {
									if (!window.snakes[bot.collisionPoints[i].snake].pts[pts].dying 
									) {
										var collisionPoint = {
											xx: window.snakes[bot.collisionPoints[i].snake].pts[pts].xx,
											yy: window.snakes[bot.collisionPoints[i].snake].pts[pts].yy,
											snake: bot.collisionPoints[i].snake,
											radius: bot.getSnakeWidth(window.snakes[bot.collisionPoints[i].snake].sc) / 2
										};

										if (window.visualDebugging && true === false) {
											canvasUtil.drawCircle(canvasUtil.circle(
												collisionPoint.xx,
												collisionPoint.yy,
												collisionPoint.radius),
												'#00FF00', false);
										}

										canvasUtil.getDistance2FromSnake(collisionPoint);
										if (collisionPoint.distance<enemyCoordinates.distance)
										{
											doHunt=false;
										}
							
									}
								}


	if (doHunt==false) 										console.log("do not hunt!!!");

						//		console.log("angDiff:"+angDiff+" distance"+ enemyCoordinates.distance);
								if (enemyCoordinates.distance<30000*(1+window.snake.sc/10)&&(angDiff>(Math.PI-0.6)||angDiff<1.5)) doHunt=false;
								if (enemyCoordinates.distance>=30000*(1+window.snake.sc/10)&&angDiff<bot.huntingAngle) doHunt=false;
								
								if (doHunt && window.snakes[bot.collisionPoints[i].snake].sc*1.6> window.snake.sc && window.snakes[bot.collisionPoints[i].snake].sp<28)
								{
					


	var tangDiff=Math.abs((cehang-window.snake.ehang));
								if (tangDiff>Math.PI)
								{
									tangDiff=Math.PI*2-tangDiff;
								}
								if (tangDiff<0.5)
									window.setAcceleration(1);
								else
									window.setAcceleration(bot.defaultAccel);
									
									
														var headCoord = { x: window.snake.xx, y: window.snake.yy };
														canvasUtil.drawLine(
															headCoord,
															window.goalCoordinates,
															'red');
														canvasUtil.drawCircle(window.goalCoordinates, 'red', true);
														

					var HuntCircle = canvasUtil.circle(
						Math.round(window.snakes[bot.collisionPoints[i].snake].xx+enemycos*(spotOffset+newGoalCoordinates.distance/2000)),
													Math.round(window.snakes[bot.collisionPoints[i].snake].yy+enemysin*(spotOffset+newGoalCoordinates.distance/2000)),
						bot.opt.radiusMult * bot.snakeRadius*0.2
					);
						canvasUtil.drawCircle(HuntCircle, 'yellow');

					var enemyCntInCircle=0;
					for (var k = 0; k < bot.collisionPoints.length; k++) {
						var collisionCircle = canvasUtil.circle(
							bot.collisionPoints[k].xx,
							bot.collisionPoints[k].yy,
							bot.collisionPoints[k].radius
						);
						if (bot.collisionPoints[k].snake !== -1) {
						
						
							var meHeadCircle = canvasUtil.circle(
								window.snakes[bot.collisionPoints[k].snake].xx,
								window.snakes[bot.collisionPoints[k].snake].yy,
								bot.collisionPoints[k].radius
							);
							if (canvasUtil.circleIntersect(fullHeadCircle, meHeadCircle)) {
						enemyCntInCircle++;
						if (window.snakes[bot.collisionPoints[i].snake].id!=window.snakes[bot.collisionPoints[k].snake].id) enemyCntInCircle++;
						}
						}
					}

										if (enemyCntInCircle<2)
										{
														
												canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(window.goalCoordinates));
																
															return true;
										}
								}
							}
							

						}
									if (canvasUtil.circleIntersect(headCircle, collisionCircle)) {
							window.setAcceleration(bot.defaultAccel);
							bot.avoidCollisionPoint(bot.collisionPoints[i]);
							return true;
						}
					}
					window.setAcceleration(bot.defaultAccel);
					return false;
				},

				sodrtScore: function (a, b) {
					return b.score - a.score;
				},

				// Round angle difference up to nearest foodRoundA degrees.
				// Round food up to nearest foodRoundsz, square for distance^2
				zzscoreFood: function (f) {
					f.score = Math.pow(Math.ceil(f.sz / bot.opt.foodRoundSz) * bot.opt.foodRoundSz, 2) /
						f.distance / (Math.ceil(f.da / bot.opt.foodRoundA) * bot.opt.foodRoundA);
				},

				computeal: function () {
					var foodClusters = [];
					var foodGetIndex = [];
					var fi = 0;
					var sw = bot.snakeWidth;

					for (var i = 0; i < window.foods.length && window.foods[i] !== null; i++) {
						var a;
						var da;
						var distance;
						var sang = window.snake.ehang;
						var f = window.foods[i];

						if (!f.eaten &&
							!(
								canvasUtil.circleIntersect(
									canvasUtil.circle(f.xx, f.yy, 2),
									bot.sidecircle_l) ||
								canvasUtil.circleIntersect(
									canvasUtil.circle(f.xx, f.yy, 2),
								   bot.sidecircle_r))) {

							var cx = Math.round(Math.round(f.xx / sw) * sw);
							var cy = Math.round(Math.round(f.yy / sw) * sw);
							var csz = Math.round(f.sz);

							if (foodGetIndex[cx + '|' + cy] === undefined) {
								foodGetIndex[cx + '|' + cy] = fi;
								a = canvasUtil.fastAtan2(cy - window.snake.yy, cx - window.snake.xx);
								da = Math.min(
									(2 * Math.PI) - Math.abs(a - sang), Math.abs(a - sang));
								distance = Math.round(
									canvasUtil.getDistance2(cx, cy, window.snake.xx, window.snake.yy));
								foodClusters[fi] = {
									x: cx, y: cy, a: a, da: da, sz: csz, distance: distance, score: 0.0
								};
								fi++;
							} else {
								foodClusters[foodGetIndex[cx + '|' + cy]].sz += csz;
							}
						}
					}

					foodClusters.forEach(bot.scoreFood);
					foodClusters.sort(bot.sortScore);

					for (i = 0; i < foodClusters.length; i++) {
						var aIndex = bot.getAngleIndex(foodClusters[i].a);
						if (bot.collisionAngles[aIndex] === undefined ||
							(Math.sqrt(bot.collisionAngles[aIndex].distance) -
								bot.snakeRadius * bot.opt.radiusMult / 2 >
								Math.sqrt(foodClusters[i].distance) &&
								foodClusters[i].sz > bot.opt.foodSmallSz)
						) {
							bot.currentFood = foodClusters[i];
							return;
						}
					}
					bot.currentFood = { x: bot.MID_X, y: bot.MID_Y };
				},
  computeFoodGoal: function() {
            
			var foodAngles = [];
			var foodWeights = [];
			
			var sx = window.snake.xx;
            var a;
            var gotoda;
			var sy = window.snake.yy;
			var headCircleRadius2 = Math.pow(bot.headCircleRadius, 2);
			var fullHeadCircleRadius22 = Math.pow(bot.fullHeadCircleRadius * 2, 2);


            for (var i = 0; i < window.foods.length && window.foods[i] !== null; i++) {
                
                var da;
                
				var f = window.foods[i];
				var cx = f.xx;
				var cy = f.yy;
				var distance = canvasUtil.getDistance2(cx, cy, sx, sy);
                var sang = window.snake.ehang;
                var csz = f.sz;
					
				
				
                if (!f.eaten && (distance < fullHeadCircleRadius22 || csz > 10) ) {
							
							
							

                    
					
					a = canvasUtil.fastAtan2(cy - sy, cx - sx);
					var aIndex = bot.getAngleIndex(a);
                    da = Math.min((2 * Math.PI) - Math.abs(a - sang), Math.abs(a - sang));
                    gotoda = Math.min((2 * Math.PI) - Math.abs(a - bot.gotoAngle), Math.abs(a - bot.gotoAngle));	
					
					if (bot.collisionAngles[aIndex] === undefined || distance < bot.collisionAngles[aIndex].distance - headCircleRadius2 / 6)
					{
						if (foodAngles[aIndex] === undefined) {
							foodWeights[aIndex] = csz;
							foodAngles[aIndex] = 10 * csz / (Math.abs(Math.sqrt(distance ))+100) ;
						}
						else {
							foodAngles[aIndex] += 10 * csz / (Math.abs(Math.sqrt(distance ))+100) ;
							foodWeights[aIndex] += csz;
						}
					}

                }
            }

	
			var foodWeight = 0;
			var foodAindex = 0;
			var fw=0;
			for (i = 0; i < (2 * Math.PI) / bot.arcSize; i++) {
			

				var n1=i-1;
				var n2=i+1;
				if (n1===-1) n1=(2 * Math.PI) / bot.arcSize;
				if (n2===(2 * Math.PI) / bot.arcSize) n2=0;
				var nw=0;
				if (foodAngles[n1] !== undefined) nw=foodAngles[n1];
				if (foodAngles[n1] !== undefined) nw+=foodAngles[n2];
				
				if (foodAngles[i] !== undefined) {
						a = bot.arcSize * i;
						//da = Math.min((2 * Math.PI) - Math.abs(a - sang), Math.abs(a - sang));
						gotoda = Math.abs(bot.indexBetween(i, bot.getAngleIndex(bot.gotoAngle)));	
				
						fw = (foodAngles[i] + nw/2) / ( gotoda * bot.gotoScore + 10) / 5;
						if (fw > foodWeight)
						{
							foodWeight=fw;
							foodAindex = i;
						}
					
				}

				
			}
			if (foodWeight === 0)
			{
				bot.currentFood = {
					x: bot.MID_X,
					y: bot.MID_Y,
					sz: 0,
					ang: 0,
					foodAindex: 0
				};			
				return;
			}
			var foodAngle = bot.arcSize * foodAindex;
			
			
            bot.currentFood = {
                x: sx + bot.fullHeadCircleRadius * Math.cos(foodAngle),
                y: sy + bot.fullHeadCircleRadius * Math.sin(foodAngle),
				sz: foodWeights[foodAindex],
				ang: foodAngle,
				aIndex: foodAindex
            };			
			return;
			
        },

        foodAccel: function() {
		
			if (bot.targetSnake!==0) return 1;
            if (bot.currentFood && bot.currentFood.sz > bot.foodAccelSize) {			
					var tAccel = bot.calcAcceleration(bot.currentFood.ang);
					
					return tAccel;
				
            }

			if (bot.isBotRacer && (bot.snakeRadius > bot.minPredatorRadius))
			{
				var aIndex1 = bot.getAngleIndex(sang);
				if ((bot.collisionAngles[aIndex1] === undefined || bot.collisionAngles[aIndex1].distance > Math.pow(bot.fullHeadCircleRadius , 2)))
				{
					return 1;
				}
			}
            return bot.defaultAccel;
        },

        codmputeFoodGoal: function() {
            
			var foodAngles = [];
			var foodWeights = [];
			
			var sx = window.snake.xx;
            var a;
            var gotoda;
			var sy = window.snake.yy;
			var headCircleRadius2 = Math.pow(bot.headCircleRadius, 2);
			var fullHeadCircleRadius22 = Math.pow(bot.fullHeadCircleRadius * 2, 2);


            for (var i = 0; i < window.foods.length && window.foods[i] !== null; i++) {
                
                var da;
                
				var f = window.foods[i];
				var cx = f.xx;
				var cy = f.yy;
				var distance = canvasUtil.getDistance2(cx, cy, sx, sy);
                var sang = window.snake.ehang;
                var csz = f.sz;
					
				
				
                if (!f.eaten && (distance < fullHeadCircleRadius22 || csz > 10) ) {
							
							
							

                    
					
					a = canvasUtil.fastAtan2(cy - sy, cx - sx);
					var aIndex = bot.getAngleIndex(a);
                    da = Math.min((2 * Math.PI) - Math.abs(a - sang), Math.abs(a - sang));
                    gotoda = Math.min((2 * Math.PI) - Math.abs(a - bot.gotoAngle), Math.abs(a - bot.gotoAngle));	
					
					if (bot.collisionAngles[aIndex] === undefined || distance < bot.collisionAngles[aIndex].distance - headCircleRadius2 / 6)
					{
						if (foodAngles[aIndex] === undefined) {
							foodWeights[aIndex] = csz;
							foodAngles[aIndex] = 10 * csz / (Math.abs(Math.sqrt(distance ))+100) ;
						}
						else {
							foodAngles[aIndex] += 10 * csz / (Math.abs(Math.sqrt(distance ))+100) ;
							foodWeights[aIndex] += csz;
						}
					}

                }
            }

	
			var foodWeight = 0;
			var foodAindex = 0;
			var fw=0;
			for (i = 0; i < (2 * Math.PI) / bot.arcSize; i++) {
			

				var n1=i-1;
				var n2=i+1;
				if (n1===-1) n1=(2 * Math.PI) / bot.arcSize;
				if (n2===(2 * Math.PI) / bot.arcSize) n2=0;
				var nw=0;
				if (foodAngles[n1] !== undefined) nw=foodAngles[n1];
				if (foodAngles[n1] !== undefined) nw+=foodAngles[n2];
				
				if (foodAngles[i] !== undefined) {
						a = bot.arcSize * i;
						//da = Math.min((2 * Math.PI) - Math.abs(a - sang), Math.abs(a - sang));
						gotoda = Math.abs(bot.indexBetween(i, bot.getAngleIndex(bot.gotoAngle)));	
				
						fw = (foodAngles[i] + nw/2) / ( gotoda * bot.gotoScore + 10) / 5;
						if (fw > foodWeight)
						{
							foodWeight=fw;
							foodAindex = i;
						}
					
				}

				
			}
			if (foodWeight === 0)
			{
				bot.currentFood = {
					x: bot.MID_X,
					y: bot.MID_Y,
					sz: 0,
					ang: 0,
					foodAindex: 0
				};			
				return;
			}
			var foodAngle = bot.arcSize * foodAindex;
			
			
            bot.currentFood = {
                x: sx + bot.fullHeadCircleRadius * Math.cos(foodAngle),
                y: sy + bot.fullHeadCircleRadius * Math.sin(foodAngle),
				sz: foodWeights[foodAindex],
				ang: foodAngle,
				aIndex: foodAindex
            };			
			return;
			
        },
        foofddAccel: function() {
		
			if (bot.targetSnake!==0) return 1;
            if (bot.currentFood && bot.currentFood.sz > bot.foodAccelSize) {			
					var tAccel = bot.calcAcceleration(bot.currentFood.ang);
					
					return tAccel;
				
            }

			if (bot.isBotRacer && (bot.snakeRadius > bot.minPredatorRadius))
			{
				var aIndex1 = bot.getAngleIndex(sang);
				if ((bot.collisionAngles[aIndex1] === undefined || bot.collisionAngles[aIndex1].distance > Math.pow(bot.fullHeadCircleRadius , 2)))
				{
					return 1;
				}
			}
            return bot.defaultAccel;
        },
	calcAcceleration: function(a) {
					var tAccel = 1;
					var sang = window.snake.ehang;
					var aIndex1 = bot.getAngleIndex(sang);
					var aIndex2 = bot.getAngleIndex(a);
					
					if ((bot.collisionAngles[aIndex1] !== undefined && bot.collisionAngles[aIndex1].distance < Math.pow(bot.fullHeadCircleRadius , 2)))
					{
						return (bot.defaultAccel);					
					}
					if (bot.fencingSnake>0)
						return 1;

					var turnDir = bot.indexBetween(aIndex1, aIndex2);
					
					if ( Math.abs(turnDir) < bot.accelAngle / bot.arcSize)
					{
					
						
						if (turnDir < 0) 
							turnDir = -1;
						else
							turnDir = 1;
					
						var aIndex = aIndex1;
						while ((aIndex !== aIndex2 && aIndex1 !== aIndex2 || aIndex1 === aIndex2 && aIndex === aIndex1))
						{
							if ((bot.collisionAngles[aIndex] !== undefined && bot.collisionAngles[aIndex].distance < Math.pow(bot.fullHeadCircleRadius, 2)))
							{
								tAccel = bot.defaultAccel;
							}
							aIndex = aIndex + turnDir;
							if (aIndex1 !== aIndex2)
							{
								if (aIndex < 0) aIndex = (2 * Math.PI) / bot.arcSize - 1;
								if (aIndex > (2 * Math.PI) / bot.arcSize ) aIndex = 0;
							}
						}
						
					}
					else
						tAccel = bot.defaultAccel;
						
					return (tAccel);
		},
        every: function() {
		

			
            bot.MID_X = window.grd;
            bot.MID_Y = window.grd;
            bot.MAP_R = window.grd * 0.98;
    if (bot.opt.followCircleTarget === undefined) {
                bot.opt.followCircleTarget = {
                    x: bot.MID_X,
                    y: bot.MID_Y
                };
            }

            bot.sectorBoxSide = Math.floor(Math.sqrt(window.sectors.length)) * window.sector_size;
            bot.sectorBox = canvasUtil.rect(
                window.snake.xx - (bot.sectorBoxSide / 2),
                window.snake.yy - (bot.sectorBoxSide / 2),
                bot.sectorBoxSide, bot.sectorBoxSide);
            // if (window.visualDebugging) canvasUtil.drawRect(bot.sectorBox, '#c0c0c0', true, 0.1);

            bot.cos = Math.cos(window.snake.ang);
            bot.sin = Math.sin(window.snake.ang);

            bot.speedMult = window.snake.sp / 5.78;
            bot.snakeRadius = bot.getSnakeWidth() / 2;
            bot.snakeWidth = bot.getSnakeWidth();
			bot.snakeLengthScore = Math.floor(15 * (fpsls[window.snake.sct] + window.snake.fam / fmlts[window.snake.sct] - 1) - 5) / 1;
			

            bot.sidecircle_r = canvasUtil.circle(
                window.snake.lnp.xx -
                ((window.snake.lnp.yy + bot.sin * bot.snakeWidth) -
                    window.snake.lnp.yy),
                window.snake.lnp.yy +
                ((window.snake.lnp.xx + bot.cos * bot.snakeWidth) -
                    window.snake.lnp.xx),
                bot.snakeWidth * bot.speedMult
            );

            bot.sidecircle_l = canvasUtil.circle(
                window.snake.lnp.xx +
                ((window.snake.lnp.yy + bot.sin * bot.snakeWidth) -
                    window.snake.lnp.yy),
                window.snake.lnp.yy -
                ((window.snake.lnp.xx + bot.cos * bot.snakeWidth) -
                    window.snake.lnp.xx),
                bot.snakeWidth * bot.speedMult
            );
        },

        // Main bot
        go: function() {
            bot.every();
                 scheduler.executeTasks();
            
			if (bot.checkCollision() ) {
                bot.lookForFood = false;
				bot.isHunting=false;
				bot.targetSnake=0;
                if (bot.foodTimeout) {
                    window.clearTimeout(bot.foodTimeout);
                    bot.foodTimeout = window.setTimeout(
                        bot.foodTimer, 1000 / bot.opt.targetFps * bot.foodFrames * 2);
                }
            } else {
				var tAccel =  bot.defaultAccel;
                bot.gotoAngle = bot.mGoToAngle;
                bot.lookForFood = bot.manualFood;
                if (bot.foodTimeout === undefined) {
                    bot.foodTimeout = window.setTimeout(
                        bot.foodTimer, 1000 / bot.opt.targetFps * bot.foodFrames * 2);
                }
				
				{
					
				
					if (bot.stage == 'grow')
					{
							if (bot.currentFood && bot.currentFood.sz > bot.foodAccelSize * 2) {
								bot.lookForSnakeDelayCnt = 0;
								bot.isHunting=false;
								bot.targetSnake=0;
							}	

							if (bot.snakeRadius > bot.minPredatorRadius)
								bot.lookForSnakeDelayCnt++;
							else
							{
								bot.lookForSnakeDelayCnt = 0;
								bot.isHunting=false;							
							}
								
							if (bot.lookForSnakeDelayCnt>bot.lookForSnakeDelay) {
								var huntCircle = canvasUtil.circle(
									window.snake.xx, window.snake.yy,
									bot.fullHeadCircleRadius * 1.5
								);
								
								if (bot.targetSnake === 0)
									bot.isHunting=bot.getTargetSnake();
									
								
									
								if (bot.targetSnake !== 0)	
									tAccel=bot.calcHuntTargetPoint();	
									
								var sang = window.snake.ehang;
	

								if (bot.targetSnake !== 0)
								{
									bot.lookForFood=false;
									if (window.visualDebugging) {
										canvasUtil.drawAngle(sang-Math.PI/2, sang+Math.PI/2, bot.fullHeadCircleRadius * 1.5, 'yellow', false);
										canvasUtil.drawAngle(sang-Math.PI/2, sang+Math.PI/2, bot.headCircleRadius * 1.5, 'yellow', false);
									}
								}
								else
								{
									if (window.visualDebugging) {
										canvasUtil.drawAngle(sang-Math.PI/2, sang+Math.PI/2, bot.fullHeadCircleRadius * 1.5, 'green', false);
										canvasUtil.drawAngle(sang-Math.PI/2, sang+Math.PI/2, bot.headCircleRadius * 1.5, 'green', false);
									}
								}
									
							}
							
							
					}
				
					if (bot.targetSnake === 0)
						tAccel = bot.foodAccel();
						
		
					
					if (bot.targetSnake !== 0 || !bot.manualFood) {
	
						window.setAcceleration(tAccel);
						bot.targetAcceleration = tAccel;
						
						window.goalCoordinates = bot.currentFood;
						canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(window.goalCoordinates));
					}
					else
						window.setAcceleration(bot.defaultAccel);	
				}


				
					

					
					
            }
			
			if (window.visualDebugging && (!bot.manualFood || bot.isCollision>0)) {
				arowcolor="green";
				if (bot.isCollision>0) arowcolor="yellow";
				canvasUtil.drawLine({
						x: window.snake.xx,
						y: window.snake.yy
					}, {
						x: window.snake.xx + bot.headCircleRadius * Math.cos(bot.gotoAngle) * 2,
						y: window.snake.yy + bot.headCircleRadius * Math.sin(bot.gotoAngle) * 2
					},
					arowcolor);
				canvasUtil.drawLine({
						x: window.snake.xx + bot.headCircleRadius * Math.cos(bot.gotoAngle) * 2,
						y: window.snake.yy + bot.headCircleRadius * Math.sin(bot.gotoAngle) * 2
					}, {
						x: window.snake.xx + bot.headCircleRadius * Math.cos(bot.gotoAngle+0.2) * 1.7,
						y: window.snake.yy + bot.headCircleRadius * Math.sin(bot.gotoAngle+0.2) * 1.7
					},
					arowcolor);
				canvasUtil.drawLine({
						x: window.snake.xx + bot.headCircleRadius * Math.cos(bot.gotoAngle) * 2,
						y: window.snake.yy + bot.headCircleRadius * Math.sin(bot.gotoAngle) * 2
					}, {
						x: window.snake.xx + bot.headCircleRadius * Math.cos(bot.gotoAngle-0.2) * 1.7,
						y: window.snake.yy + bot.headCircleRadius * Math.sin(bot.gotoAngle-0.2) * 1.7
					},
					arowcolor);
			}

			
			
		},

        // Timer version of food check
        foodTimer: function() {
          bot.foodTimeout = undefined;
        
    }};
})(window);

var scheduler = window.scheduler = (function() {
    return {
        tasks: [],

        init: function() {
            this.tasks = [
                {
                    id: 'AvoidCollisionEnemySnake',
                    active: true,
                    description: 'Avoid collision with other (enemy) snakes',

                    getPriority: function() {
                         if(bot.stage === 'circle'){
                    
                             return 0;
                         }else 
                         {
                         if (bot.checkCollision()  ) {
                            bot.lookForFood = false;
                            bot.isHunting=false;
                            bot.targetSnake=0;
                           //ot.opt.radiusMult = 20;

                        return 1000;
                        } else {
                          //  bot.isHunting=true;
                         //   bot.targetSnake=1;
//

return 0;
                        }}
                    },
                    execute: function() {
                        // NOP
                        // TODO: checkCollision() needs refactoring;
                        //       it should set/return direction but not set direction as that interferes with
                        //       other tasks
                    }
                },  //avoid collison
              
             
                {
                    id: 'CheckForFood',
                    active: true,
                    description: 'Trigger food scan',

                    // Priority to use when activated
                    triggerPriority: 403,

                    // How often to check
                    frequency: 0,
                    // step
                    step: 0,

                    getPriority: function() {
                    if (this.frequency === 0) {
                            this.frequency = bot.opt.foodFrames;
                        }

                        if (this.step < this.frequency) {
                            this.step++;
                            return 0;
                        }
                        this.step = 0;
                        return this.triggerPriority;
                    },
                    execute: function() {
             bot.computeFoodGoal();
             window.goalCoordinates = bot.currentFood;
 canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(window.goalCoordinates));

                    }
                },
                {
                    id: 'Eat',
                    active: false,
                    description: 'Just eat',

                    priority: 0,

                    getPriority: function() {
                        var ghm = '0';
                         if(bot.stage === 'circle')
                        {
                            return 0;
                        }
               
                       
                        return 402;
                    },
                    execute: function() {
                       if(window.goalCoordinates === bot.currentFood)
                       {
                           
                                                   window.setAcceleration(bot.foodAccel());

                           
                       }
                        else {
                            
                                                                               window.setAcceleration(0);

                        }
                      
                    }
                },
                {
                    id: 'Z_(exp) MoveToXY',
                    active: false,
                    description: 'Move to the given way point then deactivate task.',

                    // Value is somewhat related to CheckForFood priorities

                    // Where to move
                    point: {
                        x: 20000,
                        y: 20000
                    },

                    /**
                     * When reached the point given stop with reaching it and deactivate the task.
                     *
                     * The task can activated again when needed.
                     *
                     * @returns {number} new priority
                     */
                    getPriority: function () {
                        if (canvasUtil.getDistance2(window.snake.xx, window.snake.yy,
                                this.point.x, this.point.y) > 1000) {
                        return 999;

                        } else {
                            this.active = false;
                            return 0;
                        }
                    },
                    execute: function() {
//bot.stage = 'grow';
                        window.goalCoordinates = this.point;
                        canvasUtil.setMouseCoordinates(canvasUtil.mapToMouse(this.point));
                    }
                },
                {
                    id: 'MakeCircle',
                    active: false,
                    description: 'Make a perfect circle.',

                    triggerSize: 4000,

                    size: 0,
                    center: null,
                    direction: null,

                    getPriority: function() {

                        if(this.active === false) {
                         bot.stage = 'grow';
                            

                        }

                  

                        var snake = window.snake;
                        var size = canvasUtil.getSnakeScore(snake);

                        if (size > this.triggerSize) {
                            // We make the circle on current snake spot
                            var head = {
                                x: snake.xx,
                                y: snake.yy
                            };
                            if (this.center) {
                                // perpendicular on vector (center - head)
                                var m = {
                                    x: head.y - this.center.y,
                                    y: -(head.x - this.center.x)
                                };
                                // Tiny correction inside
                                var s = 0.1;
                                var inward = {
                                    x: m.y * s,
                                    y: - m.x * s
                                };
                                this.direction = {
                                    x: head.x + m.x + inward.x,
                                    y: head.y + m.y + inward.y
                                };
                                return 460;
                            }
                            else {
                                this.center = head;
                                return 0;
                            }
                        }
                        else {
                            this.center = null;
                            this.direction = null;
                            return 0;
                      
                        }
                    
                    },
                    execute: function() {
                        bot.stage = 'circle';
                            var tAccel =  bot.defaultAccel;

                            window.setAcceleration(tAccel);
                        bot.followCircleSelf();
                    }
                },
               
                {
                    id: '_default',
                    active: true,
                    description: 'This is the default task which cannot be deactivated.',

                    getPriority: function() {
                        // Always active
                        this.active = true;

                        // Lowest priority
                        return 0;
                    },
                    execute: function() {
                        window.log(this.id, 'Nothing to do. You probably need to enable a task.');
                    }
                }

            ];
        },

        /**
         * Lists the current tasks.
         *
         * Helper function for task developers.
         *
         * Example:
         *   window.scheduler.listTasks();
         */
        listTasks: function() {
            scheduler.tasks.forEach(function (v) {
                console.log(v.id, 'Active:', v.active, 'Priority:', v.priority, v.description);
            });
        },

        /**
         * Utility to create a task.
         *
         * @param id
         * @returns {
         *     active: boolean,
         *     id: string,
         *     description: string,
         *     getPriority: getPriority,
         *     execute: execute
         * }
         */
        newTask: function(id) {
          return {
              // Only active task will be checked.
              active: false,
              // ID is required and must differ from existing task
              id: id,
              // used when dumping all tasks
              description: 'Description of ' + id,
              getPriority: function() {
                  console.log('Task ' + id + ' should have an implementation for "getPriority"');
                  return 0;
              },
              execute: function() {
                  console.log('Task ' + id + ' should have an implementation for "execute"');
              }
          };
        },

        /**
         * Add task with unique ID to scheduler.
         *
         * @param task
         */
        addTask: function(task) {
            if (scheduler.getTask(task.id) === null) {
                scheduler.tasks.push(task);
            } else {
                console.log('Cannot add task with same ID: ' + task.id);
            }
        },

        /**
         * Get the task for give ID.
         *
         * @param id
         * @returns {null|{}}
         */
        getTask: function(id) {
            var index = scheduler.tasks.findIndex(function(v) {
                return v.id === id;
            });

            if (index !== -1) {
                return scheduler.tasks[index];
            }

            console.log('Task ' + id + ' not found');
            return null;

        },

        /**
         * Delete task for given ID.
         * @param id
         */
        deleteTask: function(id) {
            var index = scheduler.tasks.findIndex(function(v) {
                return v.id === id;
            });

            if (index !== -1) {
                scheduler.tasks.splice(index, 1);
            }

        },

        // Values of previous running task.
        // {id: ID, priority:PRIORITY}
        lastTaskRunStat: {},

        /**
         * Execute task with highest priority.
         *
         * New tasks can be injected into scheduler.tasks.
         * Existing tasks can be adjusted.
         */
        executeTasks: function() {
            // Get new priorities
            scheduler.tasks.forEach(function(v) {
                v.priority = v.getPriority();
            });

            scheduler.tasks.sort(scheduler.sortTasks);

            var task = scheduler.tasks[0];

            if (!task.active) {
                return;
            }

            // Only log task when switched from task or priority changed
            if (scheduler.lastTaskRunStat && (scheduler.lastTaskRunStat.id !== task.id ||
                scheduler.lastTaskRunStat.priority !== task.priority)) {
                window.log('ID:', task.id, 'Priority:', task.priority);
            }

            scheduler.lastTaskRunStat = {
                id: task.id,
                priority: task.priority
            };
            task.execute();
        },

        /**
         * Sort tasks by active then priority.
         *
         * @param {Task} a Task
         * @param {Task} b Task
         * @returns {boolean} a < b
         */
        sortTasks: function(a, b) {

            if (a.active !== b.active) {
                return a.active < b.active;
            }
            return a.priority < b.priority;
        }

    };
})();

scheduler.init();


var userInterface = window.userInterface = (function() {
    var original_keydown = document.onkeydown;
    var original_onmouseDown = window.onmousedown;
    var original_oef = window.oef;
    var original_redraw = window.redraw;
    var original_onmousemove = window.onmousemove;
    window.oef = function() {};
    window.redraw = function() {};
	//var original_newfood = window.newFood;
	//var original_newfood_string = original_newfood.toString();
	
	// Modify the redraw()-function to remove the zoom altering code
    // and replace b.globalCompositeOperation = "lighter"; to "hard-light".
    var original_redraw_string = original_redraw.toString();
    var new_redraw_string = original_redraw_string.replace(
        'gsc!=f&&(gsc<f?(gsc+=2E-4,gsc>=f&&(gsc=f)):(gsc-=2E-4,gsc<=f&&(gsc=f)))', '');
    new_redraw_string = new_redraw_string.replace(/b.globalCompositeOperation="lighter"/gi,
        'b.globalCompositeOperation="hard-light"');
    var new_redraw = new Function(new_redraw_string.substring(
        new_redraw_string.indexOf('{') + 1, new_redraw_string.lastIndexOf('}')));

    return {
        overlays: {},
		
        initOverlays: function() {
            var botOverlay = document.createElement('div');
            botOverlay.style.position = 'fixed';
            botOverlay.style.right = '5px';
            botOverlay.style.bottom = '112px';
            botOverlay.style.width = '150px';
            botOverlay.style.height = '85px';
            // botOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            botOverlay.style.color = '#C0C0C0';
            botOverlay.style.fontFamily = 'Consolas, Verdana';
            botOverlay.style.zIndex = 999;
            botOverlay.style.fontSize = '14px';
            botOverlay.style.padding = '5px';
            botOverlay.style.borderRadius = '5px';
            botOverlay.className = 'nsi';
            document.body.appendChild(botOverlay);

            var serverOverlay = document.createElement('div');
            serverOverlay.style.position = 'fixed';
            serverOverlay.style.right = '5px';
            serverOverlay.style.bottom = '5px';
            serverOverlay.style.width = '160px';
            serverOverlay.style.height = '14px';
            serverOverlay.style.color = '#C0C0C0';
            serverOverlay.style.fontFamily = 'Consolas, Verdana';
            serverOverlay.style.zIndex = 999;
            serverOverlay.style.fontSize = '14px';
            serverOverlay.className = 'nsi';
            document.body.appendChild(serverOverlay);

            var prefOverlay = document.createElement('div');
            prefOverlay.style.position = 'fixed';
            prefOverlay.style.left = '10px';
            prefOverlay.style.top = '75px';
            prefOverlay.style.width = '260px';
            prefOverlay.style.height = '210px';
            // prefOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            prefOverlay.style.color = '#C0C0C0';
            prefOverlay.style.fontFamily = 'Consolas, Verdana';
            prefOverlay.style.zIndex = 999;
            prefOverlay.style.fontSize = '14px';
            prefOverlay.style.padding = '5px';
            prefOverlay.style.borderRadius = '5px';
            prefOverlay.className = 'nsi';
            document.body.appendChild(prefOverlay);

            var statsOverlay = document.createElement('div');
            statsOverlay.style.position = 'fixed';
            statsOverlay.style.left = '10px';
            statsOverlay.style.top = '340px';
            statsOverlay.style.width = '140px';
            statsOverlay.style.height = '210px';
            // statsOverlay.style.background = 'rgba(0, 0, 0, 0.5)';
            statsOverlay.style.color = '#C0C0C0';
            statsOverlay.style.fontFamily = 'Consolas, Verdana';
            statsOverlay.style.zIndex = 998;
            statsOverlay.style.fontSize = '14px';
            statsOverlay.style.padding = '5px';
            statsOverlay.style.borderRadius = '5px';
            statsOverlay.className = 'nsi';
            document.body.appendChild(statsOverlay);

            userInterface.overlays.botOverlay = botOverlay;
            userInterface.overlays.serverOverlay = serverOverlay;
            userInterface.overlays.prefOverlay = prefOverlay;
            userInterface.overlays.statsOverlay = statsOverlay;
        },

        toggleOverlays: function() {
            Object.keys(userInterface.overlays).forEach(function(okey) {
                var oVis = userInterface.overlays[okey].style.visibility !== 'hidden' ?
                    'hidden' : 'visible';
                userInterface.overlays[okey].style.visibility = oVis;
                window.visualDebugging = oVis === 'visible';
            });
        },
        toggleLeaderboard: function() {
            window.leaderboard = !window.leaderboard;
            window.log('Leaderboard set to: ' + window.leaderboard);
            userInterface.savePreference('leaderboard', window.leaderboard);
            if (window.leaderboard) {
                // window.lbh.style.display = 'block';
                // window.lbs.style.display = 'block';
                // window.lbp.style.display = 'block';
                window.lbn.style.display = 'block';
            } else {
                // window.lbh.style.display = 'none';
                // window.lbs.style.display = 'none';
                // window.lbp.style.display = 'none';
                window.lbn.style.display = 'none';
            }
        },
        removeLogo: function() {
            if (typeof window.showlogo_iv !== 'undefined') {
                window.ncka = window.lgss = window.lga = 1;
                clearInterval(window.showlogo_iv);
                showLogo(true);
            }
        },
        // Save variable to local storage
        savePreference: function(item, value) {
            window.localStorage.setItem(item, value);
            userInterface.onPrefChange();
        },

        // Load a variable from local storage
        loadPreference: function(preference, defaultVar) {
            var savedItem = window.localStorage.getItem(preference);
            if (savedItem !== null) {
                if (savedItem === 'true') {
                    window[preference] = true;
                } else if (savedItem === 'false') {
                    window[preference] = false;
                } else {
                    window[preference] = savedItem;
                }
                window.log('Setting found for ' + preference + ': ' + window[preference]);
            } else {
                window[preference] = defaultVar;
                window.log('No setting found for ' + preference +
                    '. Used default: ' + window[preference]);
            }
            userInterface.onPrefChange();
            return window[preference];
        },

        // Saves username when you click on "Play" button
        playButtonClickListener: function() {
            userInterface.saveNick();
            userInterface.loadPreference('autoRespawn', false);
            userInterface.onPrefChange();
        },

        // Preserve nickname
        saveNick: function() {
            var nick = document.getElementById('nick').value;
            userInterface.savePreference('savedNick', nick);
        },

        // Hide top score
        hideTop: function() {
            var nsidivs = document.querySelectorAll('div.nsi');
            for (var i = 0; i < nsidivs.length; i++) {
                if (nsidivs[i].style.top === '4px' && nsidivs[i].style.width === '300px') {
                    nsidivs[i].style.visibility = 'hidden';
                    bot.isTopHidden = true;
                    window.topscore = nsidivs[i];
                }
            }
        },

        // Store FPS data
        framesPerSecond: {
            fps: 0,
            fpsTimer: function() {
                if (window.playing && window.fps && window.lrd_mtm) {
                    if (Date.now() - window.lrd_mtm > 970) {
						var fpsa=userInterface.framesPerSecond.fps = window.fps;

						if (bot.lowFPS) fpsa=fpsa*2;

						if (fpsa+4<bot.opt.targetFps){

							if (bot.resetZoomOnLowFPS && bot.lowFPS) {
								window.gsc=Math.min(window.gsc * 1.3,0.9);
								window.desired_gsc = window.gsc;
							}
							bot.lowFPS=true;

						}
						else
							bot.lowFPS=false;
                    }
                }
            }
        },

        onkeydown: function(e) {
            // Original slither.io onkeydown function + whatever is under it
            original_keydown(e);
            if (window.playing) {
				 // Letter `M` for manually feeding
                if (e.keyCode === 77) {
                    bot.manualFood = !bot.manualFood;
                }
				 // Letter `N` to follow the mouse move while feed search
                if (e.keyCode === 78) {
                    bot.mouseFollow = !bot.mouseFollow;
                }
				 // Letter `P` to togle predator on/off
                if (e.keyCode === 80) {
                    bot.predatorMode = !bot.predatorMode;
                }
                // Letter `T` to toggle bot
                if (e.keyCode === 84) {
                    bot.isBotEnabled = !bot.isBotEnabled;
                }
                // Letter `R` to toggle racer mode
                if (e.keyCode === 82) {
                    bot.isBotRacer = !bot.isBotRacer;
                }
                // Letter 'U' to toggle debugging (console)
                if (e.keyCode === 85) {
                    window.logDebugging = !window.logDebugging;
                    window.log('Log debugging set to: ' + window.logDebugging);
                    userInterface.savePreference('logDebugging', window.logDebugging);
                }
                // Letter 'Y' to toggle debugging (visual)
                if (e.keyCode === 89) {
                    window.visualDebugging = !window.visualDebugging;
                    window.log('Visual debugging set to: ' + window.visualDebugging);
                    userInterface.savePreference('visualDebugging', window.visualDebugging);
                }
                // Letter 'G' to toggle leaderboard
                if (e.keyCode === 71) {
                    userInterface.toggleLeaderboard(!window.leaderboard);
                }
                // Letter 'I' to toggle autorespawn
                if (e.keyCode === 73) {
                    window.autoRespawn = !window.autoRespawn;
                    window.log('Automatic Respawning set to: ' + window.autoRespawn);
                    userInterface.savePreference('autoRespawn', window.autoRespawn);
                }
                // Letter 'H' to toggle hidden mode
                if (e.keyCode === 72) {
                    userInterface.toggleOverlays();
                }
                // Letter 'B' to prompt for a custom background url
                if (e.keyCode === 66) {
                    var url = null;
					var actbackground=window.ii.src.split('/').pop();
					if (actbackground === 'black' || actbackground ==='black')
						url = 'black';
					else
						url = 'black';

					if (url !== null && url !== '') {
                        canvasUtil.setBackground(url);
                    }
					else if (actbackground == 'black' || actbackground==='')
					{
						canvasUtil.setBackground();
					}
					else
					{
						document.body.style.backgroundColor = "#000";
						canvasUtil.setBackground('black');
					}
                }
                // Letter 'O' to change rendermode (visual)
                if (e.keyCode === 79) {
                    userInterface.toggleMobileRendering(!window.mobileRender);
                }
                // Letter 'A' to increase collision detection radius
                if (e.keyCode === 65) {
                    bot.opt.radiusMult++;
                    window.log(
                        'radiusMult set to: ' + bot.opt.radiusMult);
                }
                // Letter 'S' to decrease collision detection radius
                if (e.keyCode === 83) {
                    if (bot.opt.radiusMult > 1) {
                        bot.opt.radiusMult--;
                        window.log(
                            'radiusMult set to: ' +
                            bot.opt.radiusMult);
                    }
                }
                // Letter 'D' to quick toggle collision radius
                if (e.keyCode === 68) {
                    if (bot.opt.radiusMult >
                        ((bot.opt.radiusAvoidSize - bot.opt.radiusApproachSize) /
                            2 + bot.opt.radiusApproachSize)) {
                        bot.opt.radiusMult = bot.opt.radiusApproachSize;
                    } else {
                        bot.opt.radiusMult = bot.opt.radiusAvoidSize;
                    }
                    window.log(
                        'radiusMult set to: ' + bot.opt.radiusMult);
                }
                // Letter 'Z' to reset zoom
                if (e.keyCode === 90) {
                    canvasUtil.resetZoom();
                }
                // Letter 'Q' to quit to main menu
                if (e.keyCode === 81) {
                    window.autoRespawn = false;
                    userInterface.quit();
                }
                // 'ESC' to quickly respawn
                if (e.keyCode === 27) {
                    bot.quickRespawn();
                }
                // Save nickname when you press "Enter"
                if (e.keyCode === 13) {
                    userInterface.saveNick();
                }
        if (e.keyCode > 48 && e.keyCode <= 57) {
                    var taskID = userInterface.getTaskIdByKeyBinding(e.keyCode);
                    if (taskID !== null) {
                        var task = scheduler.getTask(taskID);
                        console.log(taskID);
                        task.active = !task.active;
                    }
                }
                userInterface.onPrefChange();            }
        },

        onmousedown: function(e) {
            if (window.playing) {
                switch (e.which) {
                    // "Left click" to manually speed up the slither
                    case 1:
                        bot.defaultAccel = 1;
                        if (!bot.isBotEnabled) {
                            original_onmouseDown(e);
                        }
                        break;
                        // "Right click" to toggle bot in addition to the letter "T"
                    case 3:
                    bot.manualFood = !bot.manualFood;
                        break;
                }
            } else {
                original_onmouseDown(e);
            }
            userInterface.onPrefChange();
        },

        onmouseup: function() {
            bot.defaultAccel = 0;
        },

        // Manual mobile rendering
        toggleMobileRendering: function(mobileRendering) {
            window.mobileRender = mobileRendering;
            window.log('Mobile rendering set to: ' + window.mobileRender);
            userInterface.savePreference('mobileRender', window.mobileRender);
            // Set render mode
            if (window.mobileRender) {
                window.render_mode = 1;
                window.want_quality = 0;
                window.high_quality = false;
            } else {
                window.render_mode = 2;
                window.want_quality = 1;
                window.high_quality = true;
            }
        },

        // Update stats overlay.
        updateStats: function() {
            var oContent = [];

            if (bot.scores.length === 0) return;

            var avg = Math.round(bot.scores.reduce(function (a, b) { return a + b.score; }, 0) /
                    (bot.scores.length));

            var median = Math.round((bot.scores[Math.floor((bot.scores.length - 1) / 2)].score +
                     bot.scores[Math.ceil((bot.scores.length - 1) / 2)].score) / 2);


         
        },
	 ping: function(ip, callback) {

		if (!this.inUse) {
			this.status = 'unchecked';
			this.inUse = true;
			this.callback = callback;
			this.ip = ip;
			var _that = this;
			this.img = new Image();
			this.img.onload = function () {
				_that.inUse = false;
				_that.callback('responded');

			};
			this.img.onerror = function (e) {
				if (_that.inUse) {
					_that.inUse = false;
					_that.callback('respondederr', e);
				}

			};
			this.start = new Date().getTime();
			this.img.src =  ip;
			this.timer = setTimeout(function () {
				if (_that.inUse) {
					_that.inUse = false;
					_that.callback('timeout');
				}
			}, 1500);
		}
	},
        onPrefChange: function() {
            // Set static display options here.
            var oContent = [];
            var ht = userInterface.handleTextColor;

         //   oContent.push('version: ' + GM_info.script.version);
            oContent.push('[T / Right click] bot: ' + ht(bot.isBotEnabled));
         //   oContent.push('[O] mobile rendering: ' + ht(window.mobileRender));
            oContent.push('[A/S] radius multiplier: ' + bot.opt.radiusMult);
			oContent.push('[P] predator: ' + ht(bot.predatorMode));
			oContent.push('[R] racer: ' + ht(bot.isBotRacer));
			oContent.push('[N] mouse follow: ' + ht(bot.mouseFollow));
			oContent.push('[M] manually feed: ' + ht(bot.manualFood));
         //   oContent.push('[D] quick radius change ' +bot.opt.radiusApproachSize + '/' + bot.opt.radiusAvoidSize);
          //  oContent.push('[I] auto respawn: ' + ht(window.autoRespawn));
           // oContent.push('[G] leaderboard overlay: ' + ht(window.leaderboard));
           // oContent.push('[Y] visual debugging: ' + ht(window.visualDebugging));
            oContent.push('[1-9] toggle schedule task: ' + userInterface.getTaskMenu());
            userInterface.overlays.prefOverlay.innerHTML = oContent.join('<br/>');

        },
  getTaskMenu: function() {
            var ids = userInterface.getOrderedTaskIDs();
            var menu = '';
            ids.forEach(function(v, i) {
                var task = scheduler.getTask(v);
                menu += '<br/>- ' + (i + 1) + ' ' + (task.active ? '*' : ' ') + v;
            });
            return menu;
        },
        getOrderedTaskIDs: function() {
            var ids = [];
            scheduler.tasks.forEach(function(v) {
                if (v.id !== '_default') {
                    ids.push(v.id);
                }
            });
            return ids.sort();
        },

        /**
         * Get task ID by index on ordered keys.
         *
         * This allows for keys 1-9 to toggle task.
         *
         * @param {integer} keycode the key pressed
         * @returns {null|string} Task ID selected
         */
        getTaskIdByKeyBinding: function(keycode) {
            // http://www.cambiaresearch.com/articles/15/javascript-key-codes
            // 48 = keyboard-0 NOT num-0
            // 49 = 1
            var index = keycode - 49;

            if (index < 0 || index > 8) {
                return null;
            }

            var ids = userInterface.getOrderedTaskIDs();

            if (ids.length <= index) {
                return null;
            }
            return ids[index];
        },

        onFrameUpdate: function() {
            // Botstatus overlay
            var oContent = [];

            if (window.playing && window.snake !== null) {
			

				oContent.push('fps: ' + userInterface.framesPerSecond.fps+' ping: '+bot.pingtime+'ms');
                // Display the X and Y of the snake
                oContent.push('x: ' +
                    (Math.round(window.snake.xx) || 0) + ' y: ' +
                    (Math.round(window.snake.yy) || 0));

                if (window.goalCoordinates) {
                    if (window.goalCoordinates.sz) {
                        oContent.push('target sz: ' + Math.round(window.goalCoordinates.sz));
                    }
                    else
						oContent.push('target');
                    oContent.push('x: ' + Math.round(window.goalCoordinates.x) + ' y: ' +
                        Math.round(window.goalCoordinates.y));
                }
                    oContent.push('check: ' + bot.checktime+'ms');
				
                if (window.bso !== undefined && userInterface.overlays.serverOverlay.innerHTML !==
                    window.bso.ip + ':' + window.bso.po) {

                    userInterface.overlays.serverOverlay.innerHTML =
                        window.bso.ip + ':' + window.bso.po;


						
                }
            }

            userInterface.overlays.botOverlay.innerHTML = oContent.join('<br/>');

            if (window.playing && window.visualDebugging) {
                // Only draw the goal when a bot has a goal.
                if (window.goalCoordinates && bot.isBotEnabled && !bot.manualFood && bot.isCollision===0) {
                    var headCoord = {
                        x: window.snake.xx,
                        y: window.snake.yy
                    };
                    canvasUtil.drawLine(
                        headCoord,
                        window.goalCoordinates,
                        'green');
                    canvasUtil.drawCircle(window.goalCoordinates, 'red', true);
                }
            }
        },

        oefTimer: function() {
            var start = Date.now();
            canvasUtil.maintainZoom();
         //       requestAnimationFrame(window.foodNearFood);

            original_oef();
            // Modified slither.io redraw function
			if (bot.lowFPS) 
				bot.doRedraw = !bot.doRedraw;
			else
				bot.doRedraw=true;
			
			if (bot.doRedraw)	
				new_redraw();
				
				bot.pingDelay++;
                if (window.bso !== undefined && bot.pingDelay > 30) {
				
					bot.pingDelay=0;

					var startTime = (new Date()).getTime(),
						endTime;

					new userInterface.ping('ws://'+window.bso.ip + ':' + window.bso.po+'/slither', function (status, e) {
											endTime = (new Date()).getTime();
											bot.pingtime=(endTime - startTime);
											if (bot.pingtime<10) bot.pingtime=' '+bot.pingtime;


										});
					
				
	
				}

            if (window.playing && bot.isBotEnabled && window.snake !== null) {
				window.redraw = function() {};
                window.onmousemove = function(b) {
				
					if (bot.manualFood && bot.isCollision===0) original_onmousemove();
					if (bot.mouseFollow){
					bot.mGoToAngle = canvasUtil.mouseAngle(b);
					}
				};
                bot.isBotRunning = true;
                bot.go();
            } else if (bot.isBotEnabled && bot.isBotRunning) {
                bot.isBotRunning = false;
                if (window.lastscore && window.lastscore.childNodes[1]) {
                    var score = parseInt(window.lastscore.childNodes[1].innerHTML);
                    var duration = Date.now() - bot.startTime;
                    bot.stage = 'grow';
                    bot.scores.push({
                        score: score,
                        duration: duration
                    });
                    bot.scores.sort(function(a, b) {
                        return b.score - a.score;
                    });
                    userInterface.updateStats();
                }

                if (window.autoRespawn) {
                    bot.startTime = Date.now();
                    bot.stage = 'grow';
					window.connect();
                }
            }

            if (!bot.isBotEnabled || !bot.isBotRunning) {
                window.onmousemove = original_onmousemove;
            }

            userInterface.onFrameUpdate();
            setTimeout(userInterface.oefTimer, (1000 / bot.opt.targetFps) - (Date.now() - start));
        },

        // Quit to menu
        quit: function() {
            if (window.playing && window.resetGame) {
                window.want_close_socket = true;
                window.dead_mtm = 0;
                if (window.play_btn) {
                    window.play_btn.setEnabled(true);
                }
                window.resetGame();
            }
        },

        // Update the relation between the screen and the canvasUtil.
        onresize: function() {
            window.resize();
            
            // Canvas different size from the screen (often bigger).
            canvasUtil.canvasRatio = {
                x: window.mc.width / window.ww,
                y: window.mc.height / window.hh
            };
        },
        // Handles the text color of the bot preferences
        // enabled = green
        // disabled = red
        handleTextColor: function(enabled) {
            return '<span style=\"color:' +
                (enabled ? 'green;\">enabled' : 'red;\">disabled') + '</span>';
        }
    };
})();



// Target the user's browser.
(function() {
    var requestAnimationFrame = window.requestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.msRequestAnimationFrame;

    window.requestAnimationFrame = requestAnimationFrame;
})();


// Main
(function() {
    window.play_btn.btnf.addEventListener('click', userInterface.playButtonClickListener);
    document.onkeydown = userInterface.onkeydown;
    window.onmousedown = userInterface.onmousedown;
    window.addEventListener('mouseup', userInterface.onmouseup);
    window.onresize = userInterface.onresize;

    // Hide top score
    userInterface.hideTop();

    // Overlays
    userInterface.initOverlays();

    // Load preferences
    userInterface.loadPreference('logDebugging', false);
    userInterface.loadPreference('visualDebugging', false);
    userInterface.loadPreference('autoRespawn', false);
    userInterface.loadPreference('mobileRender', false);
    userInterface.loadPreference('leaderboard', true);
    window.nick.value = userInterface.loadPreference('savedNick', 'Slither.io-bot');



    // Save the bot options


    // Listener for mouse wheel scroll - used for setZoom function
    document.body.addEventListener('mousewheel', canvasUtil.setZoom);
    document.body.addEventListener('DOMMouseScroll', canvasUtil.setZoom);

        userInterface.toggleMobileRendering(true);
  
    // Remove laggy logo animation
    userInterface.removeLogo();
    // Unblocks all skins without the need for FB sharing.
    window.localStorage.setItem('edttsg', '1');

    // Remove social
    window.social.remove();

    // Maintain fps
    setInterval(userInterface.framesPerSecond.fpsTimer, 80);

    // Start!
    bot.startTime = Date.now();
    

    
	userInterface.oefTimer();
})();
