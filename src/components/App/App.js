import React, {useState, useEffect} from 'react';
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
  const [speed, setSpeed] = useState(0);

  useKeyPress('v', () => {
    setSpeed(speed + 1);
    console.log(' parent speed:' + speed);
  });

  return(
    <div className="container">
      <h1 id={greeting}>Hello, World</h1>
      {displayAction && <p>I am writing JSX</p>}
      <Instructions cname='demax'/>
      <Drawer speedInput={speed} />
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

// Hook
function useKeyPress(targetKey, pressCallback) {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  // If pressed key is our target key then set to true
  function downHandler({ key }) {
    if (key === targetKey) {
      setKeyPressed(true);
      console.log('a-down');
      pressCallback();
    }
  }

  // If released key is our target key then set to false
  const upHandler = ({ key }) => {
    if (key === targetKey) {
      setKeyPressed(false);
      console.log('a-up');
    }
  };

  // Add event listeners
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return keyPressed;
}

export default App;
