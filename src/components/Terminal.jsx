import React, { useState, useEffect, useRef } from 'react';

// Themes for light and dark modes
const themes = {
  dark: {
    background: 'bg-black',
    text: 'text-green-500',
    input: 'bg-black text-green-500',
  },
  light: {
    background: 'bg-gray-100',
    text: 'text-gray-800',
    input: 'bg-gray-100 text-gray-800',
  },
};

const Terminal = () => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState(null);
  const terminalRef = useRef(null);

  // Commands available to the user
  const commands = {
    help: () => `
      Available commands:
      - help: Display this help message
      - clear: Clear terminal history
      - ls: List files in the current directory
      - cd [dir]: Change directory
      - pwd: Show current directory
      - echo [message]: Print message or variable
      - theme [name]: Change theme (dark, light)
      - login [username] [password]: Log in to the system
      - signup [username] [password]: Create a new account
      - exit: Exit the terminal
    `,
    ls: () => 'File1.txt File2.js Folder1 Folder2',
    pwd: () => '/home/user',
    echo: (args) => args.join(' '),
    theme: (args) => {
      if (args[0] === 'light') {
        setTheme('light');
        return 'Theme switched to light mode.';
      } else if (args[0] === 'dark') {
        setTheme('dark');
        return 'Theme switched to dark mode.';
      }
      return 'Available themes: dark, light';
    },
    clear: () => {
      setHistory([]);
      return '';
    },
    exit: () => 'Exiting terminal... (just an example, terminal stays open!)',
    signup: (args) => {
      if (args.length !== 2) {
        return 'Usage: signup <username> <password>';
      }

      const [username, password] = args;
      const users = JSON.parse(localStorage.getItem('users')) || {};

      if (users[username]) {
        return 'Username already exists. Please choose a different username.';
      }

      users[username] = password;
      localStorage.setItem('users', JSON.stringify(users));

      return `Signup successful! You can now log in using login ${username} <password>.`;
    },
    login: (args) => {
      if (args.length !== 2) {
        return 'Usage: login <username> <password>';
      }

      const [username, password] = args;
      const users = JSON.parse(localStorage.getItem('users')) || {};

      if (users[username] && users[username] === password) {
        setCurrentUser(username);
        return `Login successful! Welcome, ${username}.`;
      }

      return 'Invalid credentials. Try again.';
    },
  };

  const handleCommand = (command) => {
    const [cmd, ...args] = command.split(' ');

    // Enforce login or signup for unauthenticated users
    if (!currentUser && cmd !== 'login' && cmd !== 'signup' && cmd !== 'help') {
      return 'Please log in or sign up first. Type "help" for instructions.';
    }

    if (commands[cmd]) {
      return typeof commands[cmd] === 'function'
        ? commands[cmd](args)
        : commands[cmd];
    }

    return `Command not found: ${cmd}. Type 'help' for a list of commands.`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const output = handleCommand(input);
    setHistory((prev) => [...prev, { command: input, output }]);
    setInput('');
  };

  useEffect(() => {
    // Scroll to the bottom on history update
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // Display welcome message initially
    setHistory([
      {
        command: '',
        output: `
Welcome to React Terminal!
Type 'help' to see the list of available commands.
To start, sign up with: signup <username> <password>.
        `,
      },
    ]);
  }, []);

  const currentTheme = themes[theme];

  return (
    <div
      className={`h-screen p-4 font-mono ${currentTheme.background} ${currentTheme.text}`}
    >
      <div
        ref={terminalRef}
        className="flex flex-col justify-start h-full overflow-y-auto"
      >
        {/* Command history */}
        {history.map((entry, index) => (
          <div key={index} className="mb-2">
            <p>
              <span className="text-blue-400">
                {currentUser
                  ? `${currentUser}@react-terminal`
                  : 'user@react-terminal'}
                :
              </span>{' '}
              {entry.command}
            </p>
            {entry.output && (
              <p className="pl-2 ml-4 border-l-2 border-blue-400">
                {entry.output}
              </p>
            )}
          </div>
        ))}

        {/* Input field */}
        <form onSubmit={handleSubmit} className="mt-4">
          <label>
            <span className="text-blue-400">
              {currentUser
                ? `${currentUser}@react-terminal:`
                : 'user@react-terminal:'}
            </span>
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className={`ml-2 w-3/4 ${currentTheme.input} focus:outline-none`}
            autoFocus
          />
        </form>
      </div>
    </div>
  );
};

export default Terminal;
