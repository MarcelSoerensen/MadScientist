class StatusBar extends DrawableObject {

    IMAGES = [
        'img/User Interfaces/ProfileBar.png',
    ];

    constructor() {
        super();
        this.loadImage(this.IMAGES);
        this.x = 5;
        this.y = 15;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    setPercentage(percentage) {
        this.percentage = percentage;
    }

}