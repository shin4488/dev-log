import * as React from 'react';
import { Badge, Alert } from 'react-bootstrap';
import {
  getSkillLevels,
  getSalesforceNotes,
  experienceUpdatedDate,
  type SkillLevel,
} from '@/data/skillLevel';
import { messages, type Locale } from '@/lib/i18n';

const SkillSection: React.FC<{ locale?: Locale }> = ({ locale = 'ja' }) => {
  const text = messages[locale];
  const renderStars = (level: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < level ? 'text-warning' : 'text-muted'}>
        ★
      </span>
    ));
  };

  return (
    <div>
      <p className="mb-3 text-muted">{text.updated(experienceUpdatedDate)}</p>
      <div className="position-relative ms-4 ps-3 border-start border-primary border-2">
        <h3 className="mb-4">{text.experienceTitle}</h3>

        {getSkillLevels(locale).map((skillLevel: SkillLevel) => (
          <div key={skillLevel.level} className="mb-4">
            <div className="mb-2">{renderStars(skillLevel.level)}</div>
            <div>
              {skillLevel.skills.map((skill) => (
                <Badge
                  key={skill}
                  bg="light"
                  text="dark"
                  className="border border-2 me-1 mb-1 text-wrap text-start"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        ))}

        <Alert variant="info" className="experience-note mt-4">
          {getSalesforceNotes(locale).map((note, index) => (
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
