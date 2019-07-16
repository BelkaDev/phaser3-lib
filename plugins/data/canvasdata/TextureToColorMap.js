import CanvasToData from './canvasdata/CanvasToData.js';
import ColorBuffer from './buffers/ColorBuffer.js';

const CanvasPool = Phaser.Display.Canvas.CanvasPool;

var TextureTColorMap = function (key, frameName, out) {
    var frame;
    if (typeof (key) === 'string') {
        if (typeof (frameName) !== 'string') {
            out = frameName;
            frameName = undefined;
        }
        frame = this.textureManager.getFrame(key, frameName);
    } else {
        frame = key;
        out = frameName;
    }

    var hasDefaultCanvas = (this._tmpCanvas !== undefined);
    var canvas = (hasDefaultCanvas) ?
        this._tmpCanvas :
        CanvasPool.create2D(this, undefined, undefined, undefined, true);

    out = CanvasToData(
        DrawFrame(frame, canvas), // canvas
        undefined, undefined, undefined, undefined, // x, y, width, height
        ColorBuffer,  // BufferClass
        undefined, // fillCallback
        undefined, // fillCallbackScope
        out);

    if (!hasDefaultCanvas) {
        CanvasPool.remove(canvas);
    } else {
        canvas.width = 1;
        canvas.height = 1;
    }
    return out;
};

var DrawFrame = function (frame, canvas) {
    canvas.width = frame.cutWidth;
    canvas.height = frame.cutHeight;
    var context = canvas.getContext('2d');
    context.drawImage(frame.source.image, frame.cutX, frame.cutY, frame.cutWidth, frame.cutHeight);
    return canvas;
}

export default TextureTColorMap;