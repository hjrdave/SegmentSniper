import { Row, Col, FormGroup, FormSelect } from "react-bootstrap";

export interface SortFilterProps {
  sortBy: string;
  onChange: (value: string) => void;
}

const SortFilter = ({ sortBy, onChange }: SortFilterProps) => {
  return (
    <Row>
      <Col className="text-start snipe-option-label">
        <p>Sort By:</p>
      </Col>
      <Col>
        <FormGroup controlId="sortControl">
          <FormSelect
            value={sortBy}
            onChange={(e) => {
              onChange(e.target.value);
            }}
          >
            <option>Sort By</option>
            <option value="date">Date</option>
            <option value="longestDistance">Longest Distance</option>
            <option value="shortestDistance">Shortest Distance</option>
            <option value="shortestTime">Shortest Time</option>
            <option value="longestTime">Longest Time</option>
          </FormSelect>
        </FormGroup>
      </Col>
    </Row>
  );
};

export default SortFilter;
