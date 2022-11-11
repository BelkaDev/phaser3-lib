import CanvasInput from '../../../canvasinput/CanvasInput.js';
import DeepClone from '../../../../../plugins/utils/object/DeepClone.js';

var CreateTextInput = function (scene, config) {
    config = (config) ? DeepClone(config) : {};
    var inputText = new CanvasInput(scene, config);
    scene.add.existing(inputText);
    return inputText;
}

export default CreateTextInput;