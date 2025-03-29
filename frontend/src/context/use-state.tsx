import { useState, useEffect, useRef } from 'react';
import { createDiceGameStateMachine } from './StateMachine';

export const useGameState = () => {
  // State for player position and movement
  const [playerAngle, setPlayerAngle] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(performance.now());
  
  // Track key presses
  const [keysPressed, setKeysPressed] = useState({
    ArrowLeft: false,
    ArrowRight: false,
    ' ': false // Space key
  });
  
  // Store state machine in a ref
  const stateMachineRef = useRef(null);
  
  // Player data
  const [playerData, setPlayerData] = useState({
    positionAngle: 0,
    throwAngle: 0,
    throwPower: 50,
    diceResult: null
  });
  
  // UI state derived from state machine
  const [gameUI, setGameUI] = useState({
    currentStage: 'positionSelection',
    displayName: 'Position Selection',
    description: 'Choose your starting position on the arena edge'
  });
  
  // Initialize state machine
  useEffect(() => {
    const callbacks = {
      // Transition callback to update UI
      onTransition: (fromState, toState) => {
        const newState = stateMachineRef.current.getState();
        setGameUI({
          currentStage: toState,
          displayName: newState.displayName,
          description: newState.description
        });
      },
      
      // Position Selection state
      onEnterPositionSelection: () => {
        console.log('Enter position selection stage');
      },
      onUpdatePositionSelection: (deltaTime, data) => {
        // Movement physics for position selection
        if (keysPressed.ArrowLeft || keysPressed.ArrowRight) {
          let newVelocity = velocity;
          
          // Apply acceleration based on key presses
          const acceleration = 0.003 * (deltaTime / 16); // Scale by time delta
          if (keysPressed.ArrowLeft) newVelocity -= acceleration;
          if (keysPressed.ArrowRight) newVelocity += acceleration;
          
          // Apply friction
          const friction = 0.92;
          newVelocity *= friction;
          
          // Clamp velocity
          const maxVelocity = 0.05;
          newVelocity = Math.max(Math.min(newVelocity, maxVelocity), -maxVelocity);
          
          // Update state
          setVelocity(newVelocity);
          setPlayerAngle((prev) => (prev + newVelocity) % (Math.PI * 2));
        }
        
        // Handle space key to transition to next stage
        if (keysPressed[' ']) {
          // Lock in position and move to next stage
          setPlayerData(prev => ({
            ...prev,
            positionAngle: playerAngle
          }));
          
          stateMachineRef.current.transition('angleSelection');
          
          // Reset key press to avoid auto-triggering next stage
          setKeysPressed(prev => ({ ...prev, ' ': false }));
        }
      },
      onExitPositionSelection: () => {
        // Reset velocity when leaving this state
        setVelocity(0);
      },
      
      // Angle Selection state - stub for now
      onEnterAngleSelection: () => {
        console.log('Enter angle selection stage');
      },
      onUpdateAngleSelection: () => {
        // Stub for now - will be implemented later
        if (keysPressed[' ']) {
          stateMachineRef.current.transition('powerSelection');
          setKeysPressed(prev => ({ ...prev, ' ': false }));
        }
      },
      
      // Other states - stubs for now
      onEnterPowerSelection: () => console.log('Enter power selection stage'),
      onUpdatePowerSelection: () => {
        if (keysPressed[' ']) {
          stateMachineRef.current.transition('rolling');
          setKeysPressed(prev => ({ ...prev, ' ': false }));
        }
      },
      
      onEnterRolling: () => console.log('Enter rolling stage'),
      onUpdateRolling: () => {
        // Auto-transition after some delay would go here
      },
      
      onEnterResult: () => console.log('Enter result stage'),
      onUpdateResult: () => {
        if (keysPressed[' ']) {
          stateMachineRef.current.transition('positionSelection');
          setKeysPressed(prev => ({ ...prev, ' ': false }));
        }
      }
    };
    
    // Create state machine
    stateMachineRef.current = createDiceGameStateMachine(callbacks);
    
    // Set initial UI state
    const initialState = stateMachineRef.current.getState();
    setGameUI({
      currentStage: 'positionSelection',
      displayName: initialState.displayName,
      description: initialState.description
    });
  }, [keysPressed, velocity, playerAngle]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (Object.keys(keysPressed).includes(e.key)) {
        setKeysPressed((prev) => ({ ...prev, [e.key]: true }));
      }
    };
    
    const handleKeyUp = (e) => {
      if (Object.keys(keysPressed).includes(e.key)) {
        setKeysPressed((prev) => ({ ...prev, [e.key]: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keysPressed]);
  
  // Game loop update for the current state
  useEffect(() => {
    if (!stateMachineRef.current) return;
    
    const updateGameState = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastUpdateTime;
      
      // Update the current state
      stateMachineRef.current.update(deltaTime, { playerData, keysPressed });
      
      setLastUpdateTime(currentTime);
    };
    
    const intervalId = setInterval(updateGameState, 16); // ~60fps
    
    return () => clearInterval(intervalId);
  }, [playerData, keysPressed, lastUpdateTime]);
  
  return {
    playerAngle,
    gameUI,
    playerData,
    setPlayerData,
    stateMachine: stateMachineRef.current
  };
};