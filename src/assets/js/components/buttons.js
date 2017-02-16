import React from "react";
import ReactDOM from "react-dom";

class ToggleBtn extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.setState({
      label: this.props.label,
      count: this.props.count,
    })
  }

  render() {
    return (
      <a
        className="btn"
        href="#"
        onClick={()=>this.setState({label: "クリックした"})}
      >
        {this.state.count}
        うー{this.state.label}
      </a>
    )
  }
}

ToggleBtn.propTypes = {
  label: React.PropTypes.string.isRequired,
  count: React.PropTypes.string
};

ToggleBtn.defaultProps = {
  label: "ラベル無し",
  count: "2"
};

document.addEventListener("DOMContentLoaded", ()=> {
  const d = document.querySelectorAll('.toggle-btn');
  for (var i = 0; i < d.length; i++) {
    ReactDOM.render(
      <ToggleBtn
        label={d[i].getAttribute('data-label')}
        count={d[i].getAttribute('data-count')}
      />, d[i]
    );
  }
});
