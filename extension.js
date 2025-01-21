const vscode = require('vscode');

function activate(context) {
    let disposable = vscode.commands.registerCommand('extension.calculateAspectRatio', function () {
        vscode.window.showInformationMessage('Aspect Ratio Calculated!');
    });

    context.subscriptions.push(disposable);

    const hoverProvider = vscode.languages.registerHoverProvider(['html', 'php', 'handlebars'], {
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