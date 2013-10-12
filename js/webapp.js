(function() {
    var canvas = null;
    var ctx = null;
    var movimiento_x = null; // que direccion se mueve el avion
    var movimiento_y = null; // que direccion se mueve el avion
    var preMov = null; // en que direccion se movia el avion antes de disparar
    var nave = new Image(); // jugador
    var enemigo = new Image();
    var cielo = new Image(); //fondo del juego
    var enemys = []; //
    var disparos = [];
    var x = 250;
    var y = 350;
    var saleEnemigo = 0; // sirve para ver cada cuanto tiempo sale el enemigo aunmenta en 1 cada 50 ms

    var aciertos = 0;
    var aciertostxt = "Score: " + aciertos;
    var vidas = 3;
    var vidastxt = "Lifes: " + vidas;
    var timer;

    nave.src = "images/avionsin.png";
    enemigo.src = "images/enemigo1.png";
    cielo.src = "images/cieloazul1.png";

    // obtiene el codigo de la tecla que se presiona

    function updatePosition(event) {
        var x = event.beta; // In degree in the range [-180,180]
        var y = event.gamma; // In degree in the range [-90,90]

        if (x < 0) { movimiento_x = 1; }
        if (x > 0) { movimiento_x = -1; }
        if (x = 0) { movimiento_x = 0; }
        
        if (y < 0) { movimiento_y = -1; }
        if (y > 0) { movimiento_y = 1; }
        if (y = 0) { movimiento_y = 0; }
    }

    //funcion que inicia todo

    function init() {
        canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = screen.width;
        canvas.height = screen.height;
        dibujar(ctx);
        run();
    }

    //reinicia el juego  

    function reiniciar() {
        // enviarle parametro y si es false que muestre algun mensaje
        enemys = [];
        disparos = [];
        x = 250;
        y = 350;
        saleEnemigo = 0;
        aciertos = 0;
        vidas = 3;
        document.formul.vida.value = vidas;
        document.formul.puntaje.value = aciertos;
        movimiento_x = 0;
        movimiento_y = 0;
        proMov = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        vidastxt = "Lifes: " + vidas;
        aciertostxt = "Score: " + aciertos;
        init();
    }


    //corre el juego

    function run() {
        timer = setTimeout(run, 50);
        juego();
        saleEnemigo += 1;
        dibujar(ctx);
    }

    // objeto bala

    function bala(x, y, w, h) {
        this.x = x + 90;
        this.y = y + 23;
        this.w = w;
        this.h = h;
        this.xcen = (w + x) / 2;
        this.ycen = (h + y) / 2;
    }
    // objeto enemigo

    function enemy(imagen, x, y) {
        this.imagen = imagen;
        this.x = x;
        this.y = y;
    }

    function juego() {
        if (movimiento_x == -1) {
            x -= 11;
        } else if (movimiento_x == 1) {
            x += 11;
        } else {
            x += 0;
        }
        
        if (movimiento_y == -1) {
            y -= 11;
        } else if (movimiento_y == 1) {
            y += 11;
        } else {
            y += 0;
        }
        // if (movimiento == 32) {
        //     disparos.push(new bala(x, y, 4, 4));
        //     movimiento_x = movimiento_y = preMov;
        //     //movimiento = 0;
        // }
        if ((saleEnemigo % 20) == 0) { // cada 50x  milisegundos sale un nuevo enemigo
            var malo = new Image();
            var aleatoria = Math.random();
            if (aleatoria < 0.25) {
                malo.src = "images/enemigo1.png";
            } else if (aleatoria < 0.50) {
                malo.src = "images/enemigo2.png";
            } else if (aleatoria < 0.75) {
                malo.src = "images/enemigo3.png";
            } else {
                malo.src = "images/enemigo4.png";
            }

            var alto = canvas.height - nave.height - enemigo.height;
            var pos = Math.floor(Math.random() * alto); //
            enemys.push(new enemy(malo, canvas.width, pos));
        }

        if (x > canvas.width) {
            x = -nave.width;
        }
        if (x < -nave.width) {
            x = canvas.width;
        }
        if (y > canvas.height) {
            y = -nave.height;
        }
        if (y < -nave.height) {
            y = canvas.height;
        }

        tamDisp = disparos.length;
        for (var j = 0; j < tamDisp; j++) {
            disparos[j].x += 12;

            if (disparos[j].y < -4) {
                disparos.splice(j, 1);
                if (tamDisp == 0) {
                    console.log("se quedo el array vacio");
                }
            }
        }

        tamEnem = enemys.length;
        for (var j = 0; j < tamEnem; j++) {
            enemys[j].x -= 9;

            if (enemys[j].x < -(enemigo.width)) {
                enemys.splice(j, 1);
                tamEnem = enemys.length;
                if (tamEnem == 0) {
                    console.log("se quedo el array de enemigos vacio");
                }
            }
        }

        //mirar si hay impactos a los enemigos con las balas
        tamEnem = enemys.length;
        tamDisp = disparos.length;
        for (var j = 0; j < tamEnem; j++) {
            for (var k = 0; k < tamDisp; k++) {

                var acierto = false;
                acierto = impacto(enemys[j].x, enemys[j].imagen.width, enemys[j].y, enemys[j].imagen.height, disparos[k].x, disparos[k].y);
                if (acierto) {
                    console.log("acierto");
                    aciertos += 1;
                    aciertostxt = "Score: " + aciertos;
                    document.formul.puntaje.value = aciertos;

                    if ((aciertos % 50) == 0) { //cada 50
                        vidas += 1;
                        vidastxt = "Lifes: " + vidas;
                        document.formul.vida.value = vidas;
                    }

                    enemys.splice(j, 1);
                    disparos.splice(k, 1);
                }


            }
            var choque = false;
            choque = colision(x + 12, y + 9, nave.width - 12, nave.height - 9, enemys[j].x + 12, enemys[j].y + 9, enemys[j].imagen.width - 12, enemys[j].imagen.height - 9);
            if (choque) {

                vidas -= 1;
                vidastxt = "Lifes: " + vidas;
                document.formul.vida.value = vidas;
                x = (canvas.width) / 2;
                y = canvas.height - nave.height;
                movimiento_x = 0;
                movimiento_y = 0;
                preMov = 0;

                if (vidas == 0) {
                    clearTimeout(timer);
                    reinicia = window.confirm("deseas reiniciar?");
                    if (reinicia) {

                        reiniciar();
                    }

                }

            }
        }

    }


    // funcion para saber cuando nos chocamos con el enemigo

    function colision(nx, ny, nw, nh, ex, ey, ew, eh) {
        var nxmax = nx + nw;
        var nymax = ny + nh;
        var exmax = ex + ew;
        var eymax = ey + eh;

        if (nx <= ex && ex <= nxmax && ny <= ey && ey <= nymax) {
            navigator.vibrate(1000);
            return true;
        }
        if (nx <= ex && ex <= nxmax && ny <= eymax && eymax <= nymax) {
            navigator.vibrate(1000);
            return true;
        }
        if (nx <= exmax && exmax <= nxmax && ny <= ey && ey <= nymax) {
            navigator.vibrate(1000);
            return true;
        }
        if (nx <= exmax && exmax <= nxmax && ny <= eymax && eymax <= nymax) {
            navigator.vibrate(1000);
            return true;
        }
        if (ex <= nx && nx <= exmax && ey <= ny && ny <= eymax) {
            navigator.vibrate(1000);
            return true;
        }
        if (ex <= nx && nx <= exmax && ey <= nymax && nymax <= eymax) {
            navigator.vibrate(1000);
            return true;
        }
        if (ex <= nxmax && nxmax <= exmax && ey <= ny && ny <= eymax) {
            navigator.vibrate(1000);
            return true;
        }
        if (ex <= nxmax && nxmax <= exmax && ey <= nymax && nymax <= eymax) {
            navigator.vibrate(1000);
            return true;
        }


        return false;

    }


    // funcion para saber cuando le dimos a un enemigo

    function impacto(xmin, wid, ymin, heig, px, py) {
        var xmax = xmin + wid;
        var ymax = ymin + heig;

        if (px >= xmin && px <= xmax && py >= ymin && py <= ymax) {
            return true;
        }
        return false;
    }


    // funcion que dibuja en el canvas todos los elementos 

    function dibujar(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        nave.src = "images/avionsin.png";
        ctx.drawImage(cielo, 0, 0);
        nave.onload = function() {
            ctx.drawImage(nave, x, y);

            ctx.fillStyle = "#ff0000";
            ctx.font = '20px "Tahoma"';
            ctx.fillText(vidastxt, 600, 20);
            ctx.fillText(aciertostxt, 600, 390);

            tamDisp = disparos.length;
            tamEnem = enemys.length;

            for (var i = 0; i < tamDisp; i++) {
                ctx.fillStyle = "#ff0000";
                ctx.fillRect(disparos[i].x, disparos[i].y, disparos[i].w, disparos[i].h);
            }

            for (var i = 0; i < tamEnem; i++) {
                ctx.drawImage(enemys[i].imagen, enemys[i].x, enemys[i].y);
            }
        };

    }

    window.addEventListener('load', init, false);
    window.addEventListener("deviceorientation", updatePosition, false);
    window.screen.lockOrientation('landscape-primary');
})();