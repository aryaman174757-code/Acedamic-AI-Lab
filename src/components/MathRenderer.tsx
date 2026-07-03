import React from 'react';

interface MathRendererProps {
  math: string;
  className?: string;
  block?: boolean;
}

export default function MathRenderer({ math, className = '', block = false }: MathRendererProps) {
  if (!math) return null;

  // Clean the string
  const cleanMath = math.trim();

  // Helper to format inline math segments (subscripts, superscripts, multiplication, etc.)
  const formatSegment = (text: string): React.ReactNode => {
    // Replace * with elegant × multiplication sign
    let formatted = text.replace(/\*/g, ' × ');
    
    // Replace <= with ≤ and >= with ≥
    formatted = formatted.replace(/<=/g, ' ≤ ').replace(/>=/g, ' ≥ ');

    // Match patterns like K_n, K_{m,n}, E_span, d(u,v), deg(v)
    // We can split and parse subscripts
    const parts: React.ReactNode[] = [];
    let currentText = formatted;
    
    // Regular expression to find subscripts: either _v or _{sub}
    const subRegex = /([A-Za-z]+)_(\{([^}]+)\}|([A-Za-z0-9,+-]+))/g;
    let match;
    let lastIndex = 0;

    while ((match = subRegex.exec(currentText)) !== null) {
      const matchIndex = match.index;
      
      // Add preceding text
      if (matchIndex > lastIndex) {
        parts.push(renderVariables(currentText.substring(lastIndex, matchIndex)));
      }

      const base = match[1];
      const subText = match[3] || match[4];

      parts.push(
        <span key={`sub-${matchIndex}`} className="inline-flex items-baseline">
          <span className="font-serif italic font-semibold">{base}</span>
          <sub className="text-[75%] bottom-[-0.2em] ml-[0.05em] font-sans font-medium">{subText}</sub>
        </span>
      );

      lastIndex = subRegex.lastIndex;
    }

    if (lastIndex < currentText.length) {
      parts.push(renderVariables(currentText.substring(lastIndex)));
    }

    return <span className="inline-flex items-center flex-wrap">{parts}</span>;
  };

  // Helper to distinguish mathematical variables (single letter italic) from general terms
  const renderVariables = (text: string): React.ReactNode => {
    // Split into tokens (letters, numbers, operators)
    const tokens = text.split(/(\s+|=|\+|\-|<|>|≤|≥|×|∑|{|}|:|∈|\|)/g);
    
    return tokens.map((token, idx) => {
      if (!token) return null;

      // Style operator characters
      if (/^(=|\+|\-|<|>|≤|≥|×|:)$/.test(token)) {
        return <span key={idx} className="mx-1 text-slate-500 font-sans font-semibold">{token}</span>;
      }
      
      if (token === '∈') {
        return <span key={idx} className="mx-1 text-indigo-600 font-sans font-bold">∈</span>;
      }

      if (token === '∑') {
        return <span key={idx} className="mr-1 text-base text-indigo-700 font-serif font-black">∑</span>;
      }

      // Check if it's a single variable letter (like u, v, n, m, x, y, G, V, E)
      if (/^[a-zA-Z]$/.test(token)) {
        return <span key={idx} className="font-serif italic font-semibold text-slate-900">{token}</span>;
      }

      // Check if it's a known math function like deg, max, log, d
      if (/^(deg|max|log|d)$/.test(token)) {
        return <span key={idx} className="font-serif italic font-semibold text-indigo-800">{token}</span>;
      }

      // Check for Cardinality |V| or |E|
      if (token === '|') {
        return <span key={idx} className="text-slate-400 font-sans font-semibold mx-[0.05em]">|</span>;
      }

      return <span key={idx} className="font-sans text-slate-800">{token}</span>;
    });
  };

  // Check if it's a fraction (has a '/' in the middle and is a suitable candidate)
  const isFraction = cleanMath.includes('/') && !cleanMath.includes('{') && !cleanMath.includes(':');

  if (isFraction) {
    const parts = cleanMath.split('/');
    if (parts.length === 2) {
      const numerator = parts[0].trim();
      const denominator = parts[1].trim();

      return (
        <span className={`inline-flex items-center gap-1.5 ${block ? 'my-3 justify-center' : ''} ${className}`}>
          {/* Vertical Fraction */}
          <span className="inline-flex flex-col items-center justify-center text-center leading-none">
            <span className="text-xs pb-[2px] border-b border-slate-300 px-1 font-serif">
              {formatSegment(numerator)}
            </span>
            <span className="text-xs pt-[2px] px-1 font-sans font-semibold text-slate-700">
              {formatSegment(denominator)}
            </span>
          </span>
        </span>
      );
    }
  }

  // Default inline or block math rendering
  return (
    <span className={`${block ? 'block my-2 text-center p-3 bg-slate-50 border border-slate-100 rounded-xl inline-block w-full' : 'inline-block px-1'} ${className}`}>
      <span className="inline-flex items-center text-xs tracking-wide">
        {formatSegment(cleanMath)}
      </span>
    </span>
  );
}
