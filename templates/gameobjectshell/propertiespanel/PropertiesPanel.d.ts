import Tweaker from '../../ui/tweaker/Tweaker';

export default PropertiesPanel;

declare namespace PropertiesPanel {
    interface IConfig extends Tweaker.IConfig {

    }

    interface IPropertyConfig extends Tweaker.IAddInputConfig {

    }
}

declare class PropertiesPanel extends Tweaker {
    constructor(
        scene: Phaser.Scene,
        config?: PropertiesPanel.IConfig,
        extraProperties?: PropertiesPanel.IPropertyConfig[]
    )
}