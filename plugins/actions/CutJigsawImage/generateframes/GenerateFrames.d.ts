export default GenerateFrames;

declare namespace GenerateFrames {
    type EdgeModeType = {
        left: number,
        right: number,
        top: number,
        bottom: number,
    };

    type EdgesType = (EdgeModeType | string)[][];

    type DrawShapeCallbackType = (
        graphics: Phaser.GameObjects.Graphics,
        width: number,
        height: number,
        edgeWidth: number,
        edgeHeight: number,
        edgeMode: EdgeModeType
    ) => void;

    interface IConfig {
        sourceKey: string,
        destinationKey: string,
        columns: number, rows: number,
        framePadding?: number,
        edgeWidth?: number, edgeHeight?: number,
        edges?: EdgesType,
        drawShapeCallback?: DrawShapeCallbackType,
    }

    interface IResult {
        sourceKey: string,
        destinationKey: string,
        columns: number, rows: number,
        frameWidth: number, frameHeight: number,
        edgeWidth: number, edgeHeight: number,
        getFrameNameCallback: DrawShapeCallbackType,
    }
}

declare function GenerateFrames(
    scene: Phaser.Scene,
    config: GenerateFrames.IConfig
): GenerateFrames.IResult;