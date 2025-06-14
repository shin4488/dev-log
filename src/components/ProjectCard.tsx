import * as React from 'react';
import { Card, Badge, Table } from 'react-bootstrap';

interface ProjectItem {
  title: string;
  imageUri: string;
  siteUri: string;
  usedTechniques: string[];
  summary: string;
  technicalAppeal: string;
}

interface ProjectCardProps {
  item: ProjectItem;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ item }) => {
  return (
    <Card className="h-100 shadow-sm border">
      <a
        href={item.siteUri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-decoration-none"
      >
        <Card.Img
          variant="top"
          src={item.imageUri}
          alt={item.title}
          style={{ height: '200px', objectFit: 'contain' }}
        />
      </a>
      <Card.Body className="p-3">
        <Card.Title className="h5 mb-3">
          <a
            href={item.siteUri}
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-none text-primary"
          >
            {item.title}
          </a>
        </Card.Title>
        <Table size="sm" className="mb-0">
          <tbody>
            <tr>
              <th scope="row" className="fw-bold" style={{ width: '18%' }}>
                使用技術
              </th>
              <td>
                {item.usedTechniques.map((tech) => (
                  <Badge key={tech} bg="secondary" className="me-1 mb-1">
                    {tech}
                  </Badge>
                ))}
              </td>
            </tr>
            <tr>
              <th scope="row" className="fw-bold">
                概要
              </th>
              <td className="text-break">{item.summary}</td>
            </tr>
            <tr>
              <th scope="row" className="fw-bold">
                技術アピール
              </th>
              <td className="text-break">{item.technicalAppeal}</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ProjectCard;
