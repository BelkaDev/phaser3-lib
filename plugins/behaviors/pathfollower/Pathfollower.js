'use strict'

import GetSceneObject from 'rexPlugins/utils/system/GetSceneObject.js';

const GetValue = Phaser.Utils.Objects.GetValue;
const DegToRad = Phaser.Math.DegToRad;
const AngleBetween = Phaser.Math.Angle.Between;

class PathFollower {
    constructor(gameObject, config) {
        this.gameObject = gameObject;
        this.scene = GetSceneObject(gameObject);

        this._t = 0;
        this.pathVector = undefined;
        this.resetFromJSON(config);
        this.boot();
    }

    resetFromJSON(o) {
        this.setPath(GetValue(o, 'path', undefined));
        var t = GetValue(o, 't', undefined);
        if (t !== undefined) {
            this.setT(t);
        }

        var rotateToPath = GetValue(o, 'rotateToPath', false);
        var rotationOffset = GetValue(o, 'rotationOffset', undefined);
        if (rotationOffset === undefined) {
            rotationOffset = DegToRad(GetValue(o, 'angleOffset', 0));
        }
        this.setRotateToPath(rotateToPath, rotationOffset);
        return this;
    }

    toJSON() {
        return {
            path: this.path,
            t: this.t,
            rotateToPath: this.rotateToPath,
            rotationOffset: this.rotationOffset
        };
    }

    boot() {
        if (this.gameObject.on) { // oops, bob object does not have event emitter
            this.gameObject.on('destroy', this.destroy, this);
        }
    }

    shutdown() {
        this.gameObject = undefined;
        this.scene = undefined;
    }

    destroy() {
        this.shutdown();
    }

    setPath(path) {
        this.path = path;
        return this;
    }

    setT(t) {
        this.t = t;
        return this;
    }

    get t() {
        return this._t;
    }

    set t(value) {
        this._t = value;
        this.update();
    }

    setRotateToPath(rotateToPath, rotationOffset) {
        this.rotateToPath = rotateToPath;
        this.rotationOffset = rotationOffset;
        return this;
    }

    update() {
        if (this.path === undefined) {
            return;
        }

        var gameObject = this.gameObject;
        var oldX = gameObject.x,
            oldY = gameObject.y;
        this.pathVector = this.path.getPoint(this.t, this.pathVector);
        gameObject.setPosition(this.pathVector.x, this.pathVector.y);

        if ((gameObject.x === oldX) &&
            (gameObject.y === oldY)) {
            return;
        }

        if (this.rotateToPath) {
            gameObject.rotation = AngleBetween(oldX, oldY, gameObject.x, gameObject.y) + this.rotationOffset;
        }
    }
}

export default PathFollower;