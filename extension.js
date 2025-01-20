const vscode = require('vscode');

function activate(context) {
    // Hover provider
    const hoverProvider = vscode.languages.registerHoverProvider(['javascript', 'typescript', 'html', 'css'], {
        provideHover(document, position) {
            const range = document.getWordRangeAtPosition(position, /aspect-\[\d+\/\d+\]/);
            if (!range) return;

            const text = document.getText(range);
            const match = text.match(/aspect-\[(\d+)\/(\d+)\]/);
            if (!match) return;

            const [width, height] = [parseInt(match[1], 10), parseInt(match[2], 10)];
            if (width === 0 || height === 0) return;

            const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
            const divisor = gcd(width, height);
            const simplifiedRatio = `aspect-[${width / divisor}/${height / divisor}]`;

            return new vscode.Hover(
                new vscode.MarkdownString(`Simplified ratio: \`${simplifiedRatio}\``)
            );
        }
    });

    context.subscriptions.push(hoverProvider);
}
    
function deactivate() {}

module.exports = {
    activate,
    deactivate
};