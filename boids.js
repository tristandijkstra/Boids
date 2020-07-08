//www.kfish.org/boids/pseudocode.html
maxBirds = 100;
// Attraction to eachother
factorRule1 = 0.01
// min distance to eachother
factorRule2 = 50
// align velocity factor
factorRule3 = 10

maxVelocity = 14
viewDistance = 100
mouseFeature = true
edgeMargin = 50

const BoidImage = "assets/cursorosx.png";


limitVelocity = function(velocityVecx, velocityVecy) {
    for (r=0; r < velocityVecx.length; r++) {

        speed = Math.sqrt(velocityVecx[r]**2 + velocityVecy[r]**2 )
        if (speed > maxVelocity) {
            velocityVecx[r] = (velocityVecx[r]/speed) * maxVelocity
            velocityVecy[r] = (velocityVecy[r]/speed) * maxVelocity
        }
    }
    return [velocityVecx, velocityVecy]
}

rule1 = function(b, bs) {
    var cx = 0;
    var cy = 0;
    // console.log(b.y)
    var ncount = 0
    for (o = 0; o < maxBirds; o++) {
        distance = Math.sqrt(((bs[o].x - b.x)**2 + (bs[o].y - b.y)**2))
        if (b != bs[o] && distance < viewDistance) {
            cx += bs[o].x;
            cy += bs[o].y;
            ncount += 1;
        }
    }
    if (ncount > 0) {
        cx = (cx / (ncount) - b.x) * factorRule1;
        cy = (cy / (ncount) - b.y) * factorRule1;
    } else {
        cx = 0;
        cy = 0;
    }
    return [cx, cy]
}

rule2 = function(b, bs, mousePos) {
        var c2x = 0;
        var c2y = 0;
        // console.log(b.y)
        for (a = 0; a < maxBirds; a++) {
            distance = Math.sqrt(((bs[a].x - b.x)**2 + (bs[a].y - b.y)**2))
            if ((b != bs[a]) && distance < viewDistance) {
                if (Math.abs(distance) < factorRule2) {
                    c2x -= (bs[a].x - b.x);
                    c2y -= (bs[a].y - b.y);
                }
            }
            distMouse = Math.sqrt(((mousePos.x - b.x)**2 + (mousePos.y - b.y)**2))
            if ((distMouse < factorRule2 * 1.5) && mouseFeature == true) {
                c2x -= (mousePos.x - b.x);
                c2y -= (mousePos.y - b.y);
            }
        }
        return [c2x / (factorRule2*0.8),c2y / (factorRule2*0.8)]
}

rule3 = function(b, bs, velocitiesx, velocitiesy) {
    var vx = 0
    var vy = 0
    var ncount = 0
    for (q = 0; q < maxBirds; q++) {
        distance = Math.sqrt(((bs[q].x - b.x)**2 + (bs[q].y - b.y)**2))
        if (b != bs[q] && distance < viewDistance) {
            vx += velocitiesx[q];
            vy += velocitiesy[q];
            ncount += 1
        }
    }
    if (ncount > 0) {
        vx = vx / (ncount)
        vy = vy / (ncount)
    } else {
        vx = 0
        vy = 0
    }
    return [vx/factorRule3, vy/factorRule3];
}

window.onload = function () {
    // document.getElementById("rule1result").innerHTML = factorRule1;
    // document.getElementById("rule2result").innerHTML = factorRule2;
    // document.getElementById("rule3result").innerHTML = factorRule3;

    // document.getElementById("MouseFeature").oninput = function () {
    //     mouseFeature = document.getElementById("MouseFeature").checked;
    //     console.log(mouseFeature);
    // };

    // document.getElementById("rule1").oninput = function () {
    //     factorRule1 = document.getElementById("rule1").value / 1000;
    //     document.getElementById("rule1result").innerHTML = factorRule1;
    // };
    // document.getElementById("rule2").oninput = function () {
    //     factorRule2 = document.getElementById("rule2").value;
    //     document.getElementById("rule2result").innerHTML = factorRule2;
    // };
    // document.getElementById("rule3").oninput = function () {
    //     factorRule3 = document.getElementById("rule3").value;
    //     document.getElementById("rule3result").innerHTML = factorRule3;
    // };

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;

    const app = new PIXI.Application({
        width: windowWidth,
        height: windowHeight,
        backgroundColor: 0x000000,
        resolution: window.devicePixelRatio || 1,
        resizeTo: window,
    });
    document.body.appendChild(app.view);

    const container = new PIXI.Container();

    app.stage.addChild(container);

    // Create a new texture
    const texture = PIXI.Texture.from(BoidImage);

    var Birds = [];

    // Initialise birds
    for (u = 0; u < maxBirds; u++) {
        var positionX = Math.floor(Math.random() * windowWidth) + edgeMargin;
        var positionY = Math.floor(Math.random() * windowHeight) + edgeMargin;
        const bird = new PIXI.Sprite(texture);
        bird.anchor.set(0.5);
        bird.x = positionX;
        bird.y = windowHeight + edgeMargin*3;
        app.stage.addChild(bird);
        Birds.push(bird);
    }

    toRad = function (deg) {
        return (deg / 180) * Math.PI;
    };
    velocitiesx = [];
    velocitiesy = [];
    for (aa = 0; aa < maxBirds; aa++) {
        velocitiesx.push(0);
        velocitiesy.push(0);
    }

    app.ticker.add((delta) => {
        const mouseposition = app.renderer.plugins.interaction.mouse.global;

        for (i = 0; i < maxBirds; i++) {
            r1 = rule1(Birds[i], Birds);
            r2 = rule2(Birds[i], Birds, mouseposition);

            velocitiesx[i] += r1[0] + r2[0];
            velocitiesy[i] += r1[1] + r2[1];

            r3 = rule3(Birds[i], Birds, velocitiesx, velocitiesy);

            velocitiesx[i] += r3[0];
            velocitiesy[i] += r3[1];

            limvelo = limitVelocity(velocitiesx, velocitiesy)
            velocitiesx = limvelo[0]
            velocitiesy = limvelo[1]

            Birds[i].x += velocitiesx[i] * delta;
            Birds[i].y += velocitiesy[i] * delta;

            var edgeWidth = app.screen.width - edgeMargin * 2;
            var edgeHeight = app.screen.height - edgeMargin * 2;
            if (Birds[i].x > edgeWidth || Birds[i].x < 0 + edgeMargin * 3) {
                if (Birds[i].x < 0 + edgeMargin * 3) {
                    velocitiesx[i] += maxVelocity / 3;
                } else {
                    velocitiesx[i] -= maxVelocity / 3;
                }
            }
            if (Birds[i].y > edgeHeight || Birds[i].y < 0 + edgeMargin * 3) {
                // velocitiesy[i] *= -1;
                if (Birds[i].y < 0 + edgeMargin * 3) {
                    velocitiesy[i] += maxVelocity / 3;
                } else {
                    velocitiesy[i] -= maxVelocity / 3;
                }
            }

            Birds[i].rotation =
                Math.atan2(velocitiesy[i], velocitiesx[i]) + Math.PI/2; 
        }
    });
};;

