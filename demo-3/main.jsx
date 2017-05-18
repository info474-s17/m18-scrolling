// Main.jsx file

// InputComponent for typing into: will render a TextComponent
class InputComponent extends React.Component {
    // Set initial state
    constructor(props) {
        super(props)
        this.state = {
            text: ''
        }
    }
    // Event to trigger when input is typed into
    update(event) {
        var value = event.target.value;
        this.setState({
            text: value
        });
    }
    // What to render on the screen
    render() {
        return ( <div>
                   <input placeholder="Start typing..." onChange={ (d) => this.update(d) } />
                   <br/>
                   <TextComponent text={ this.state.text } />
                 </div>
            );
    }
}

// Text Component: displays text passed as prop
class TextComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <div>I am a text input, receiving the text:
              <br/>
              { this.props.text }
            </div>
        )
    }
}

// Render your component in the `main` section
ReactDOM.render(< InputComponent />,
    document.querySelector('main')
);