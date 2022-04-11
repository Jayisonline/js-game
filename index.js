
// import platform from 
// import hills from 
// import background from 

const canvas = document.querySelector('canvas')


// let l1 = document.querySelector('#l1')
// let r1 = document.querySelector('#r1')
// let j = document.querySelector('#j')





let win = false
// console.log(canvas)

const audio = new Audio('./andrew.mp3')

const erro = new Audio('./erro.mp3')

// var x = document.createElement("VIDEO");

const jump = new Audio('./sfx-pop.mp3')

const c = canvas.getContext('2d')

let currentKey
function createImage(imgSrc){
    const image = new Image()
    image.src = imgSrc

    return image
}


const platformImg = createImage('./img/platform.png');
const backgroundImg = createImage('./img/background3.png');
const hillsImg = createImage('./img/hills.png');

const platformSmallTall = createImage('./img/platformSmallTall.png')

const spriteRunLeft = createImage('./img/spriteRunLeft.png')
const spriteRunRight = createImage('./img/spriteRunRight.png')
const spriteStandLeft = createImage('./img/spriteStandLeft.png')
const spriteStandRight = createImage('./img/spriteStandRight.png')

const flag = createImage('./img/flag.png')



// console.log(c)

canvas.width = 1024
canvas.height = 576

const gravity = 0.5


const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    }
}





// player

class Player {
    constructor(){
        this.speed = 5.5
        this.position = {
            x: 100, 
            y: 100
        }
        this.velocity = {
            x: 0,
            y: 0
        }
        this.width = 66
        this.height = 150

        this.image = spriteStandRight
        this.frames = 1
        this.sprite = {
            stand: {
                right:spriteStandRight,
                left: spriteStandLeft,

                cropWidth: 177,
                width: 66
            },
            run: {
                right:spriteRunRight,
                left: spriteRunLeft,
                cropWidth: 341,
                width: 127.875

            },
            
        }

        this.currentSprite = this.sprite.stand.right

        this.currentCropWidth = 177

    }

    draw(){

        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        // c.drawImage(img, 0, 0)

        c.drawImage(this.currentSprite, this.currentCropWidth*this.frames, 0, this.currentCropWidth, 400, this.position.x, this.position.y, this.width, this.height)
    }

    update() {
        this.frames +=1
        if (this.frames > 59 && (this.currentSprite === this.sprite.stand.right || this.currentSprite === this.sprite.stand.left )){
            this.frames = 0
        }
        else if (this.frames > 29 && (this.currentSprite === this.sprite.run.right || this.currentSprite === this.sprite.run.left)){
            this.frames = 0
        }
        this.position.y += this.velocity.y
        this.draw()

        if (this.position.y + this.height + this.velocity.y <= canvas.height)
        this.velocity.y += gravity
        // else this.velocity.y = 0

        
    }
}





// Platform

class Platform {
    constructor({x, y, image}) {
        this.position = {
            x, 
            y
        }

        this.image = image
        
        this.width = image.width
        this.height = image.height

    }

    draw() {
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)
        // canvas.drawImgae(img)
    }
}


// objects in game

class GenericObject {
    constructor({x, y, image}) {
        this.position = {
            x,  
            y
        }

        this.image = image
        
        this.width = image.width
        this.height = image.height

    }

    draw() {
        // c.fillStyle = 'blue'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        c.drawImage(this.image, this.position.x, this.position.y)
        // canvas.drawImgae(img)
    }
}



let player = new Player()





let platforms = []


let genericObject = []

let scrollOffset = 0


function init() {

    erro.play()

    player = new Player()
    platforms = [ new Platform({x:platformImg.width*4+platformSmallTall.width-182 , y:330, image: platformSmallTall}), 
        new Platform({x:platformImg.width*7-100 , y:400, image: platformSmallTall}), 
        new Platform({x:platformImg.width*8-100 , y:400, image: platformSmallTall}), 
        new Platform({x:platformImg.width*9-50 , y:400, image: platformSmallTall}),
        new Platform({x:platformImg.width*10, y:470, image: platformImg}), 
        new Platform({x:platformImg.width*11-2, y:470, image: platformImg}), 
        new Platform({x:platformImg.width*12-4, y:470, image: platformImg}), 

        new Platform({x:-1, y:470, image: platformImg}), 
        new Platform({x:platformImg.width-3, y:470, image: platformImg}), 
        new Platform({x:platformImg.width*2 + 200, y:470, image: platformImg}), 
        new Platform({x:platformImg.width*3+400, y:470, image: platformImg}),
        new Platform({x:platformImg.width*5+200, y:470, image: platformImg}),
        new GenericObject({x:6500, y:330, image:flag}),

    ]
    genericObject = [ 
        new GenericObject({x:-1, y:-1, image:backgroundImg}), 
        new GenericObject({x:backgroundImg.width-5, y:-1, image:backgroundImg}),
        new GenericObject({x:(backgroundImg.width-5)*2, y:-1, image:backgroundImg}),
        new GenericObject({x:(backgroundImg.width-5)*3, y:-1, image:backgroundImg}),
        new GenericObject({x:(backgroundImg.width-5)*4, y:-1, image:backgroundImg}),
    ]
    scrollOffset = 0
}


function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObject.forEach(genericObject => {
        genericObject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })

    player.update()


    if (keys.right.pressed && player.position.x < canvas.width/2-100) {
        player.position.x += player.speed
        
    } 
    else if ((keys.left.pressed && player.position.x > 200) || keys.left.pressed && scrollOffset === 0){
        player.position.x -= player.speed
    }
    else{

        if (keys.right.pressed){

            // if (win == false){
                scrollOffset += player.speed
                platforms.forEach(platform => {
                    // platform.draw()
                    platform.position.x -= player.speed
    
                })
                genericObject.forEach(genericObject => {
                    genericObject.position.x -=2
                })
            // }
            // else player.position.x+=player.speed
            
        }
        else if(keys.left.pressed){
            scrollOffset-=player.speed
            platforms.forEach(platform => {
                // platform.draw()
                platform.position.x += player.speed
            })
            genericObject.forEach(genericObject => {
                genericObject.position.x +=2
            })
            
        }
    }


   


    // if (platform.position.y - platform.height == player.position.y){
    //     player.velocity.y = 0;
    //     player.position.y = platform.position.y - platform.height;
    // }

    platforms.forEach(platform => {
        // platform.draw()

    if (player.position.y + player.height <= platform.position.y 
        && player.position.y+player.height + player.velocity.y >= platform.position.y
        && player.position.x+ player.width >= platform.position.x
        && player.position.x <= platform.position.x + platform.width){
        player.velocity.y = 0
    }
    })


    if (keys.right.pressed && currentKey === 'right' &&  player.currentSprite !== player.sprite.run.right){
        player.frames = 1
        player.currentSprite = player.sprite.run.right
        player.currentCropWidth = player.sprite.run.cropWidth 
        player.width = player.sprite.run.width 
    }
    else if (keys.left.pressed && currentKey === 'left' && player.currentSprite != player.sprite.run.left){
            player.currentSprite = player.sprite.run.left
            player.currentCropWidth = player.sprite.run.cropWidth 
            player.width = player.sprite.run.width 
    }


    // winn
    if (scrollOffset > 6150){

        win = true
        console.log("YOu win")

        audio.play()
        // x.play('./Andrew Garfield Laugh.mp4')
        // genericObject.position.x =0
    }


    // if (win === true){
    //     for (let i =0; i < 100; i++)
    //     player.position.x +=player.speed
    // }

    // game over
    if (player.position.y> canvas.height){
        // console.log('You Lose')
        init()
    }
    
}


init()
animate()





window.addEventListener('keydown', ( { keyCode } )=>{
    // console.log( keyCode )

    switch(keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = true
            // player.currentSprite = player.sprite.run.left
            // player.currentCropWidth = player.sprite.run.cropWidth 
            // player.width = player.sprite.run.width 
            // player.velocity.x = -5
            currentKey = 'left'
            break
        case 83:
            console.log('down')
            break
        case 68:
            console.log('right')
            keys.right.pressed = true
            // player.currentSprite = player.sprite.run.right
            // player.currentCropWidth = player.sprite.run.cropWidth 
            // player.width = player.sprite.run.width 
            currentKey = 'right'

            // player.velocity.x = 5
            break
        case 87:
            console.log('up')
            player.velocity.y -= 15
            jump.play()
            break
    }


    // console.log(keys.right.pressed)
})


// l1.




window.addEventListener('keyup', ( {keyCode} )=>{
    // console.log( keyCode )

    switch(keyCode) {
        case 65:
            console.log('left')
            keys.left.pressed = false
            player.currentSprite = player.sprite.stand.left
            player.currentCropWidth = player.sprite.stand.cropWidth 
            player.width = player.sprite.stand.width
            break
        case 83:
            console.log('down')
            break
        case 68:
            console.log('right')
            keys.right.pressed = false
            player.currentSprite = player.sprite.stand.right
            player.currentCropWidth = player.sprite.stand.cropWidth 
            player.width = player.sprite.stand.width
            break
        case 87:
            console.log('up')
            // player.velocity.y 
            break
    }

    // console.log(keys.right.pressed)

})


// document.querySelector('#l1')

// function l1() {
//     console.log('left')
//         keys.left.pressed = true
//         player.currentSprite = player.sprite.run.left
//         player.currentCropWidth = player.sprite.run.cropWidth 
//         player.width = player.sprite.run.width 
// }


// function r1() {

// console.log('right')
// keys.right.pressed = true
// player.currentSprite = player.sprite.run.right
// player.currentCropWidth = player.sprite.run.cropWidth 
// player.width = player.sprite.run.width 


// }