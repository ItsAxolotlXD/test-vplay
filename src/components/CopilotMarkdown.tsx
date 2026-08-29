import React from 'react';
import Markdown from 'react-markdown';

interface CopilotMarkdownProps {
  content: string;
  isUser?: boolean;
}

export const CopilotMarkdown: React.FC<CopilotMarkdownProps> = ({ content, isUser = false }) => {
  if (isUser) {
    return <span className="text-white font-medium whitespace-pre-wrap">{content}</span>;
  }

  return (
    <div className="copilot-markdown prose prose-sm max-w-none text-slate-800 dark:text-slate-100 text-xs sm:text-sm leading-relaxed break-words">
      <Markdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
          strong: ({ children }) => <strong className="font-bold text-slate-950 dark:text-white">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="leading-relaxed">{children}</li>,
          h1: ({ children }) => <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2 mt-3 first:mt-0 font-montserrat">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white mb-1.5 mt-2.5 first:mt-0 font-montserrat">{children}</h2>,
          h3: ({ children }) => <h3 className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1 mt-2 first:mt-0 font-montserrat">{children}</h3>,
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            return isInline ? (
              <code className="px-1.5 py-0.5 rounded bg-slate-200/80 dark:bg-white/10 text-indigo-700 dark:text-indigo-300 font-mono text-[11px] font-semibold border border-slate-300/60 dark:border-white/15" {...props}>
                {children}
              </code>
            ) : (
              <pre className="p-2.5 my-2 rounded-xl bg-slate-900 text-slate-100 dark:bg-black/60 font-mono text-xs overflow-x-auto border border-slate-700/50">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          blockquote: ({ children }) => (
            <blockquote className="border-l-3 border-indigo-500 pl-3 my-2 text-slate-600 dark:text-slate-300 italic bg-indigo-50/50 dark:bg-indigo-950/20 py-1 rounded-r-lg text-xs">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 underline font-semibold hover:text-indigo-700 dark:hover:text-indigo-300">
              {children}
            </a>
          ),
        }}
      >
        {content}
      </Markdown>
    </div>
  );
};
