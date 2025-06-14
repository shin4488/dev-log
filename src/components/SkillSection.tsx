import * as React from 'react';
import { Badge, Alert } from 'react-bootstrap';
import {
  skillLevels,
  salesforceNotes,
  experienceUpdatedDate,
  type SkillLevel,
} from '@/data/skillLevel';

const SkillSection: React.FC = () => {
  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < level ? 'text-warning' : 'text-muted'}>
        ★
      </span>
    ));
  };

  return (
    <div>
      <p className="mb-3 text-muted">{experienceUpdatedDate} 現在</p>
      <div className="position-relative ms-4 ps-3 border-start border-primary border-2">
        <h3 className="mb-4">業務で扱ってきた主な技術スタック</h3>

        {skillLevels.map((skillLevel: SkillLevel) => (
          <div key={skillLevel.level} className="mb-4">
            <div className="mb-2">{renderStars(skillLevel.level)}</div>
            <div>
              {skillLevel.skills.map((skill) => (
                <Badge
                  key={skill}
                  bg="light"
                  text="dark"
                  className="border me-1 mb-1"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        <Alert variant="info" className="mt-4">
          {salesforceNotes.map((note, index) => (
            <p key={index} className={index === 0 ? 'fw-bold mb-2' : 'mb-1'}>
              {note}
            </p>
          ))}
        </Alert>
      </div>
    </div>
  );
};

export default SkillSection;
