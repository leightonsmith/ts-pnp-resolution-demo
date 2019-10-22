import React from 'react';
import ReactMarkdown from 'react-markdown';
import logo from './logo.svg';
import './App.css';
import htmlParser from 'react-markdown/plugins/html-parser';


const parseHtml = htmlParser({
  isValidNode: node => node.type === 'tag' && node.name === 'abbr'
});


const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        <ReactMarkdown
          source="a string"
          escapeHtml={false}
          astPlugins={[parseHtml]}
          linkTarget="_blank"
        />
      </header>
    </div>
  );
}

export default App;
