export function createTooltip(scene, width, x, y, content) {
    let fillStyle = {
        color: 0x999999,
        alpha: 0.9
    };

    var graphics = scene.add.graphics({
        fillStyle: fillStyle
    });
    const container = scene.add.container(0, 0)
    const text = scene.add.text(5, 5, content, {
        color: "#ffffff", fixedWidth: width - 10, wordWrap: {
            width: width - 10
        },
        font: '20px Silkscreen',
        align: 'center'
    })
    const rect = new Phaser.Geom.Rectangle(0, 0, width, text.height + 10)

    graphics.fillRectShape(rect)
    container.add(graphics)
    container.setSize(width, text.height)
    container.add(text)
    container.x = x - container.displayWidth / 2
    container.y = y - container.displayHeight / 2

    return container
}

export function createPlatform(scene, y = 0, count = 1, left = false) {
    let platform = scene.physics.add.staticGroup()

    let groundLeft = platform.create(left ? 0 : scene.cameras.main.width, scene.cameras.main.height * 0.7 - y, 'grassLeft')
    let groundRight = platform.create(left ? 0 : scene.cameras.main.width, scene.cameras.main.height * 0.7 - y, 'grassRight')


    if (count === 1) {
        let groundMid = platform.create(left ? 0 : scene.cameras.main.width, scene.cameras.main.height * 0.7 - y, 'grassMid')
        groundMid.setScale(0.5, 0.5)
        groundMid.x += (left ? 1 : -1) * groundMid.width * 0.75
        groundMid.refreshBody()
    } else {
        for (var i = 0; i < count; i++) {
            const groundMid = platform.create(left ? 0 : scene.cameras.main.width, scene.cameras.main.height * 0.7 - y, 'grassMid')
            groundMid.setScale(0.5, 0.5)
            groundMid.x += (left ? 1 : -1) * groundMid.width * (0.75 + i * 0.5)
            groundMid.refreshBody()
        }
    }


    groundLeft.setScale(0.5, 0.5)
    groundLeft.x += (left ? groundRight.width * 0.25 : -groundLeft.width * (1.25 + (count - 1) * 0.5))
    groundLeft.refreshBody()

    groundRight.setScale(0.5, 0.5)
    groundRight.x += (!left ? -groundRight.width * 0.25 : +groundLeft.width * (1.25 + (count - 1) * 0.5))
    groundRight.refreshBody()

    return platform
}