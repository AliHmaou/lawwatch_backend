import React, { useMemo } from 'react';

const StaticPage: React.FC<{ content: string; title: string }> = ({ content, title }) => {
    
    const processInlines = (text: string) => {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
            .replace(/\*\*([^\*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/`([^`]+)`/g, '<code>$1</code>');
    };

    const htmlContent = useMemo(() => {
        let text = content;

        const codeBlocks: string[] = [];
        text = text.replace(/```sql\n([\s\S]*?)```/g, (match, code) => {
            const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
            const escapedCode = code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
            codeBlocks.push(`<pre><code>${escapedCode}</code></pre>`);
            return placeholder;
        });

        let html = text.split('\n\n').map(block => {
            if (block.startsWith('## ')) return `<h3>${processInlines(block.substring(3))}</h3>`;
            if (block.startsWith('# ')) return `<h2>${processInlines(block.substring(2))}</h2>`;

            if (block.startsWith('* ') || block.startsWith('- ')) {
                const items = block.split('\n').map(item => `<li>${processInlines(item.substring(2))}</li>`).join('');
                return `<ul>${items}</ul>`;
            }
            
            if (/^\d+\.\s/.test(block)) {
                const items = block.split('\n').map(item => `<li>${processInlines(item.replace(/^\d+\.\s/, ''))}</li>`).join('');
                return `<ol>${items}</ol>`;
            }

            let p = processInlines(block).replace(/\n/g, '<br />');

            return `<p>${p}</p>`;
        }).join('');
        
        codeBlocks.forEach((block, index) => {
            html = html.replace(`<p>__CODE_BLOCK_${index}__</p>`, block);
        });

        return html;
    }, [content]);

    return (
        <div className="card page-content">
            <h2>{title}</h2>
            <div className="static-content" dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
    );
};

export default StaticPage;
