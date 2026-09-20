import { Entity } from './Entity.js';

// Cambia este valor para ajustar el tamaño visual y la hitbox del jugador.
export const PLAYER_SIZE = 128;

export class Player extends Entity {
    constructor(x, y, input) {
        super(x, y, PLAYER_SIZE, PLAYER_SIZE);
        this.input = input;
        this.speed = 250;           // px/seg
        this.maxSpeed = 250;

        this.spriteSize = 512;
        this.spriteColumns = 10;
        this.spriteRows = 6;
        this.idleFrameCount = 515;
        this.runFrameCount = 41;
        this.animationFps = 60;
        this.animationFrame = 0;
        this.animationTime = 0;
        this.animationType = 'idle';
        this.direction = 'Front';
        this.idleDirection = 'Front';
        this.animations = {
            Front: this.loadIdleFrames('Front'),
            Back: this.loadIdleFrames('Back'),
            Left: this.loadIdleFrames('Left'),
            Right: this.loadIdleFrames('Right')
        };
        this.runAnimations = {
            Back: this.loadRunFrame('Back'),
            BackLeft: this.loadRunFrame('BackLeft'),
            BackRigth: this.loadRunFrame('BackRigth'),
            Front: this.loadRunFrame('Front'),
            FrontLeft: this.loadRunFrame('FrontLeft'),
            FrontRigth: this.loadRunFrame('FrontRigth'),
            Left: this.loadRunFrame('Left'),
            Rigth: this.loadRunFrame('Rigth')
        };
    }

    loadIdleFrames(direction) {
        return Array.from({ length: 9 }, (_, index) => {
            const image = new Image();
            image.src =
                `assets/sprites/player/rifle/indle/${direction}/` +
                `Armature_Action.003_${String(index + 1).padStart(3, '0')}.png`;
            return image;
        });
    }

    loadRunFrame(direction) {
        const image = new Image();
        image.src =
            `assets/sprites/player/rifle/run/${direction}/` +
            'Armature_Action.006_001.png';
        return image;
    }

    update(dt, worldBounds) {
        const axis = this.input.getMoveAxis();
        const isMoving = axis.x !== 0 || axis.y !== 0;
        const nextDirection = this.getDirection(axis);

        if (isMoving) {
            this.direction = nextDirection;
            if (nextDirection === 'Back' || nextDirection === 'Front' ||
                nextDirection === 'Left' || nextDirection === 'Rigth') {
                this.idleDirection = nextDirection === 'Rigth' ? 'Right' : nextDirection;
            } else {
                this.idleDirection = nextDirection.startsWith('Back') ? 'Back' : 'Front';
            }
        }

        this.animationTime += dt;
        const frameCount = isMoving ? this.runFrameCount : this.idleFrameCount;
        const animationType = isMoving ? 'run' : 'idle';
        if (animationType !== this.animationType) {
            this.animationType = animationType;
            this.animationFrame = 0;
            this.animationTime = 0;
        }
        while (this.animationTime >= 1 / this.animationFps) {
            this.animationTime -= 1 / this.animationFps;
            this.animationFrame = (this.animationFrame + 1) % frameCount;
        }

        // La velocidad sigue directamente al input para evitar deslizamiento.
        this.velocity.x = axis.x * this.maxSpeed;
        this.velocity.y = axis.y * this.maxSpeed;

        // --- Integrar movimiento ---
        super.update(dt);

        // --- Clamp dentro del mundo ---
        if (worldBounds) {
            const { width, height } = worldBounds;
            if (this.position.x < 0) {
                this.position.x = 0;
                this.velocity.x = 0;
            }
            if (this.position.y < 0) {
                this.position.y = 0;
                this.velocity.y = 0;
            }
            if (this.position.x + this.width > width) {
                this.position.x = width - this.width;
                this.velocity.x = 0;
            }
            if (this.position.y + this.height > height) {
                this.position.y = height - this.height;
                this.velocity.y = 0;
            }
        }
    }

    getDirection(axis) {
        if (axis.y < 0) {
            if (axis.x > 0) return 'BackLeft';
            if (axis.x < 0) return 'BackRigth';
            return 'Back';
        }
        if (axis.y > 0) {
            if (axis.x > 0) return 'FrontLeft';
            if (axis.x < 0) return 'FrontRigth';
            return 'Front';
        }
        return axis.x > 0 ? 'Left' : 'Rigth';
    }

    draw(renderer) {
        if (this.animationType === 'run') {
            const image = this.runAnimations[this.direction];
            renderer.drawSpriteFrame(
                image,
                this.animationFrame * this.spriteSize, 0,
                this.spriteSize, this.spriteSize,
                this.position.x, this.position.y,
                this.width, this.height
            );
            return;
        }

        const templateIndex = Math.floor(this.animationFrame / 60);
        const frameInTemplate = this.animationFrame % 60;
        const image = this.animations[this.idleDirection][templateIndex];
        const sourceX = (frameInTemplate % this.spriteColumns) * this.spriteSize;
        const sourceY = Math.floor(frameInTemplate / this.spriteColumns) * this.spriteSize;

        renderer.drawSpriteFrame(
            image,
            sourceX, sourceY,
            this.spriteSize, this.spriteSize,
            this.position.x, this.position.y,
            this.width, this.height
        );
    }
}