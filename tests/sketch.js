var value = 0;

function setup() {

}

function draw() {
    fill(value);
    rect(25,25,50,50);
}

function keyPressed(key) {
    console.log(key)
    if (value == 0) {
        value = 255;
    } else {
        value = 0;
    }
}
