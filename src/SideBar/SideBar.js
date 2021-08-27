/* eslint react/prop-types: 0 */
import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
  }

  render() {
    const { items = [] } = this.props;
    return (
      <div className="col-md-2">
        <ListGroup variant="flush">
          {items.map((item) => (
            <ListGroup.Item
              key={item.id}
              variant="dark"
              style={{ background: '#E5F0F1' }}
              href={item.url}
              action
            >
              {item.title}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    );
  }
}

export default SideBar;
