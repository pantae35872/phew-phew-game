let a = false;
let b = false;
let ab = false;
let player: game.LedSprite = null;
let bullets: game.LedSprite[] = [];
let enemies: game.LedSprite[] = [];
let isrunning = false;
let losed = false;
let won = false;
let stillstarting = false;
let stilltexting = false;
let cooldown = false;

function start() {
    stillstarting = true;
    for (let i = 3; i >= 0; i--) {
        basic.showNumber(i)
        basic.pause(1000);
    }
    losed = false;
    won = false;
    player = game.createSprite(0, 4);
    for (let y = 0; y <= 1; y++) {
        for (let x = 0; x <= 5; x++) {
            enemies.push(game.createSprite(x, y));
        }
    }
    isrunning = true;
    stillstarting = false;
}

function fire() {
    if (!cooldown) {
        bullets.push(game.createSprite(player.x(), player.y()));
        cooldown = true;
    }
}

function lose() {
    if (!losed) {
        stilltexting = true;
        losed = true;
        isrunning = false;
        player.delete();
        player = null;
        bullets.forEach((bullet, index) => {
            bullet.delete();
        });
        bullets = [];
        enemies.forEach((enemy, index) => {
            enemy.delete();
        });
        enemies = [];
        a = false;
        b = false;
        ab = false;
        basic.clearScreen();

        basic.showString("You lose");
        stilltexting = false;
    }
}

function win() {
    if (!won) {
        won = true;
        isrunning = false;
        stilltexting = true;
        player.delete();
        player = null;
        bullets.forEach((bullet, index) => {
            bullet.delete();
        });
        bullets = [];
        enemies.forEach((enemy, index) => {
            enemy.delete();
        });
        enemies = [];
        a = false;
        b = false;
        ab = false;
        basic.clearScreen();

        basic.showString("You Win");
        bullets.forEach((bullet, index) => {
            bullet.delete();
        });
        bullets = [];
        enemies.forEach((enemy, index) => {
            enemy.delete();
        });
        enemies = [];
        stilltexting = false;
    }
}

basic.forever(function input() {
    if (isrunning) {
        if (a) {
            player.move(-1);
            a = false;
        }
        if (b) {
            player.move(1);
            b = false;
        }
        if (ab) {
            fire();
            ab = false;
        }
    }
});

basic.forever(function bullet_thread() {
    if (isrunning) {
        bullets.forEach((bullet, index) => {
            if (bullet != null) {
                basic.pause(100);
                let previus_y: number;
                previus_y = bullet.y();
                bullet.changeYBy(-1);
                if (previus_y == bullet.y()) {
                    bullet.delete();
                    bullets.removeAt(index);
                }
            }
        });
    }
})

basic.forever(function enemies_thread() {
    if (isrunning) {
        enemies.forEach((enemy, enemy_index) => {
            bullets.forEach((bullet, bullet_index) => {
                if (bullet != null && enemy != null) {
                    if (enemy.isTouching(bullet)) {
                        enemy.delete();
                        enemies.removeAt(enemy_index);
                        bullet.delete();
                        bullets.removeAt(bullet_index);
                    }
                }
            });
            if (enemy != null) {
                if (enemy.y() == 4) {
                    lose();
                }
            }
        });
    }
})

basic.forever(function nextFloor() {
    if (isrunning) {
        basic.pause(5000);
        enemies.forEach((enemy, index) => {
            enemy.changeYBy(1);
        });
        for (let x = 0; x <= 5; x++) {
            if (randint(0, 1) == 1) {
                enemies.push(game.createSprite(x, 0));
            }
        }
    }
});

basic.forever(function win_dection() {
    if (isrunning) {
        if (enemies.length == 0 && !won) {
            win();
        }
    }
});


basic.forever(function cooldown_thread() {
    if (isrunning) {
        if (cooldown) {
            basic.pause(200);
            cooldown = false;
        }
    }
});

input.onButtonPressed(Button.A, function () {
    if (isrunning) {
        a = true;
    }
});

input.onButtonPressed(Button.B, function () {
    if (isrunning) {
        b = true;
    }
});

input.onButtonPressed(Button.AB, function () {
    if (isrunning) {
        ab = true;
    } else if (!stillstarting && !stilltexting) {
        start();
    }
});
