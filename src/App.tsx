import "./App.css";
import Aside from "./Aside";
import Header from "./Header";
import Content from "./Content";

function App() {
    return (
        <div className="App">
            <Header />
            <div className="container">
                <Aside />
                <Content />
            </div>
        </div>
    );
}

export default App;
