import React from 'react';
import Badge from 'react-bootstrap/Badge';

interface Props {
  rawMarkdown: string;
}

const ExperienceTimeline: React.FC<Props> = ({ rawMarkdown }) => {
  const lines = rawMarkdown.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

  const renderLine = (line: string, idx: number) => {
    if (line.startsWith('## ')) {
      return (
        <h3 key={idx} className="mb-2">
          {line.replace(/^##\s*/, '')}
        </h3>
      );
    }

    if (/^[★☆]+$/.test(line)) {
      return (
        <p key={idx} className="mb-2">
          <span className="text-warning">{line}</span>
        </p>
      );
    }

    if (line.startsWith('※')) {
      return (
        <p key={idx} className="mb-2">
          {line}
        </p>
      );
    }

    const tokens = line
      .replace(/[()]/g, '')
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    return (
      <p key={idx} className="mb-2">
        {tokens.map((token) => (
          <Badge key={token} bg="light" text="dark" className="border me-1 mb-1">
            {token}
          </Badge>
        ))}
      </p>
    );
  };

  return (
    <article className="mb-5 border-start border-4 border-primary ps-4">
      {lines.map((line, idx) => renderLine(line, idx))}
    </article>
  );
};

export default ExperienceTimeline;
