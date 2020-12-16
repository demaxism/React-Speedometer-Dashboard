import React, {useState} from 'react';
import Instructions from '../Instructions/Instructions';
import Meter from '../Meter/Meter';
import Drawer from '../Drawer/Drawer';
import './App.css';

const displayEmojiName = event => alert(event.target.id);
const emojis = [
  {
    emoji: '😀',
    name: "test grinning face"
  },
  {
    emoji: '🎉',
    name: "party popper"
  },
  {
    emoji: '💃',
    name: "woman dancing"
  }
];

function App() {
  const greeting = "greeting";
  const displayAction = false;
  let memberCount = 0;

  const [count, setCount] = useState(0);

  return(
    <div className="container">
      <h1 id={greeting}>Hello, World</h1>
      {displayAction && <p>I am writing JSX</p>}
      <Instructions cname='demax'/>
      <Drawer />
      <ul>
        {
          emojis.map(emoji => (
            <li key={emoji.name}>
              <button
                onClick={displayEmojiName}
              >
                <span role="img" aria-label={emoji.name} id={emoji.name}>{emoji.emoji}</span>
              </button>
            </li>
          ))
        }
      </ul>
      <p>count: {count} times.</p>
      <button onClick={ ()=> setCount(count + 1)}>click me</button>
      <p>memberCount: {memberCount}</p>
      <button className='blueBtn' onClick={ ()=> memberCount = memberCount + 1 }>M_Click</button>
    </div>
  )
}

export default App;
