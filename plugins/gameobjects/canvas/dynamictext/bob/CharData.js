import Base from './Base.js';
import TextStyle from './TextStyle.js';

class CharData extends Base {
    constructor(
        parent,
        styleJSON,
        text,
        x, y, rotation
    ) {
        super(parent, 'text');

        this.style = new TextStyle(styleJSON);
        this.setText(text);

        this.setPosition(x, y);
        this.setRotation(rotation);
    }

    get autoRound() {
        return this.parent.autoRound;
    }

    modifyStyle(style) {
        this.setDirty(true);
        this.style.modify(style);
        return this;
    }

    setText(text) {
        this.setDirty(this.text != text);
        this.text = text;
        this.width = this.style.getTextWidth(this.context, text);
        return this;
    }

    draw() {
        if (!this.visible || (this.text === '')) {
            return this;
        }

        var context = this.context;
        context.save();

        var textStyle = this.style;
        textStyle.syncFont(context).syncStyle(context);

        var x = this.x,
            y = this.y;
        if (this.autoRound) {
            x = Math.round(x);
            y = Math.round(y);
        }

        if (textStyle.stroke && textStyle.strokeThickness) {
            context.strokeText(this.text, x, y);
        }

        if (textStyle.color) {
            context.fillText(this.text, x, y);
        }

        context.restore();
    }
}

export default CharData;