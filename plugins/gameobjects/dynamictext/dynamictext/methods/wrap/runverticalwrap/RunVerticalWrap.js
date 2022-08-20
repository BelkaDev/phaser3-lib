import { SetPadding } from '../../../../../../utils/padding/PaddingMethods.js';
import AlignLines from './AlignLines.js';
import { CanRender, IsNewLineChar } from '../../../bob/Types.js';

const GetValue = Phaser.Utils.Objects.GetValue;

var RunVerticalWrap = function (config) {
    // Parse parameters
    var startIndex = GetValue(config, 'start', 0);

    SetPadding(this.wrapPadding, GetValue(config, 'padding', 0));
    var wrapPaddingVertical = this.wrapPadding.top + this.wrapPadding.bottom;
    var wrapPaddingHorizontal = this.wrapPadding.left + this.wrapPadding.right;
    var paddingVertical = this.padding.top + this.padding.bottom;
    var paddingHorizontal = this.padding.left + this.padding.right;

    var lineWidth = GetValue(config, 'lineWidth', undefined);
    var maxLines;
    if (lineWidth === undefined) {
        // Calculate lineWidth via maxLines, in fixedWidth mode
        maxLines = GetValue(config, 'maxLines', 0);
        if (this.fixedWidth > 0) {
            var innerWidth = this.fixedWidth - paddingHorizontal - wrapPaddingHorizontal;
            lineWidth = innerWidth / maxLines;
        } else {
            lineWidth = 0;
        }
    } else {
        if (this.fixedWidth > 0) {
            // Calculate maxLines via lineWidth, in fixedWidth mode
            maxLines = GetValue(config, 'maxLines', undefined);
            if (maxLines === undefined) {
                var innerWidth = this.fixedWidth - paddingHorizontal;
                maxLines = Math.floor(innerWidth / lineWidth);
            }
        } else {
            maxLines = GetValue(config, 'maxLines', 0); // Default is show all lines
        }

    }
    var showAllLines = (maxLines === 0);

    // Get fixedChildHeight
    var fixedChildHeight = GetValue(config, 'fixedChildHeight', undefined);
    if (fixedChildHeight === undefined) {
        var charPerLine = GetValue(config, 'charPerLine', undefined);
        if (charPerLine !== undefined) {
            var innerHeight = this.fixedHeight - paddingVertical - wrapPaddingVertical;
            fixedChildHeight = Math.floor(innerHeight / charPerLine);
        } else {
            // Use char.heigh as fixedChildHeight
        }
    }

    // Get wrapHeight
    var wrapHeight = GetValue(config, 'wrapHeight', undefined);
    if (wrapHeight === undefined) {
        if (this.fixedHeight > 0) {
            wrapHeight = this.fixedHeight - paddingVertical;
        } else {
            wrapHeight = Infinity; // No word-wrap
        }
    }

    var letterSpacing = GetValue(config, 'letterSpacing', 0);

    var rtl = GetValue(config, 'rtl', true);
    var hAlign = GetValue(config, 'hAlign', rtl ? 2 : 0);
    var vAlign = GetValue(config, 'vAlign', 0);

    var result = {
        start: startIndex,  // Next start index
        isLastPage: false,  // Is last page
        padding: this.wrapPadding,
        lineWidth: lineWidth,
        maxLines: maxLines,
        fixedChildHeight: fixedChildHeight,
        wrapHeight: wrapHeight,
        letterSpacing: letterSpacing,
        hAlign: hAlign,
        vAlign: vAlign,
        rtl: rtl,
        children: [],       // Word-wrap result
        lines: [],          // Word-wrap result in lines
        maxLineHeight: 0,
        linesWidth: 0
    }

    // Set all children to active
    var children = this.children;
    for (var i = 0, cnt = children.length; i < cnt; i++) {
        children[i].setActive(false);
    }

    // Layout children
    wrapHeight += letterSpacing;
    var startX = this.padding.left + this.wrapPadding.left,  // Reset x of each character in AlignLines method
        startY = this.padding.top + this.wrapPadding.top,
        x = startX,
        y = startY;
    var remainderHeight = wrapHeight,
        childIndex = startIndex,
        lastChildIndex = children.length;
    var resultChildren = result.children;
    var resultLines = result.lines,
        lastLine = [], lastLineHeight = 0, maxLineHeight = 0;
    while (childIndex < lastChildIndex) {
        // Append non-typeable child directly
        var char = children[childIndex];
        childIndex++;
        if (!CanRender(char)) {
            char.setActive();
            resultChildren.push(char);
            lastLine.push(char);
            continue;
        }

        var childHeight = ((fixedChildHeight !== undefined) ? fixedChildHeight : char.height) + letterSpacing;
        // Next line
        var isNewLineChar = IsNewLineChar(char);
        if ((remainderHeight < childHeight) || isNewLineChar) {
            // Add to result
            if (isNewLineChar) {
                char.setActive().setPosition(x, y).setOrigin(0.5);
                resultChildren.push(char);
                lastLine.push(char);
            }

            // Move cursor
            x = startX;
            y = startY;
            remainderHeight = wrapHeight;
            resultLines.push({ children: lastLine, height: lastLineHeight });
            maxLineHeight = Math.max(maxLineHeight, lastLineHeight);

            lastLineHeight = 0;
            lastLine = [];

            if (!showAllLines && (resultLines.length === maxLines)) {  // Exceed maxLines
                break;
            } else if (isNewLineChar) {  // Already add to result                
                continue;
            }
        }
        remainderHeight -= childHeight;
        lastLineHeight += childHeight;

        char.setActive().setPosition(x, y).setOrigin(0.5);
        resultChildren.push(char);
        lastLine.push(char);
        y += childHeight;
    }

    if (lastLine.length > 0) {
        resultLines.push({ children: lastLine, height: lastLineHeight });
        maxLineHeight = Math.max(maxLineHeight, lastLineHeight);
    }

    result.start += resultChildren.length;
    result.isLastPage = (result.start === lastChildIndex);
    result.maxLineHeight = maxLineHeight;
    result.linesWidth = (resultLines.length * lineWidth) + wrapPaddingHorizontal;

    // Calculate size of game object
    var width = (this.fixedWidth > 0) ? this.fixedWidth : (result.linesWidth + paddingHorizontal);
    var height = (this.fixedHeight > 0) ? this.fixedHeight : (result.maxLineHeight + paddingVertical);

    // Size might be changed after wrapping
    var innerWidth = width - paddingHorizontal - wrapPaddingHorizontal;
    var innerHeight = height - paddingVertical - wrapPaddingVertical;
    AlignLines(result, innerWidth, innerHeight);

    // Resize
    this.setSize(width, height);

    // Set initial position
    for (var i = 0, cnt = resultChildren.length; i < cnt; i++) {
        var child = resultChildren[i];
        child.x0 = child.x;
        child.y0 = child.y;
    }

    return result;
}

export default RunVerticalWrap;